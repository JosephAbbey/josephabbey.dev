---
title: Programming Humans to Use Cheap Energy
description: |-
  Exploring how I am training my household to use energy when it is cheapest.
tags:
  - homeassistant
pubDate: 2025-09-29
previous: predbat-dashboard
---

An important part of optimising energy costs is making sure that humans use energy at the correct times.

Here are some simple rules that help to achieve this:

1. Limit energy use when the battery is low, and in the near future, energy will be expensive, with minimal solar generation.
2. Use lots of energy when the battery is full, or energy is cheap, or there is lots of solar generation (especially minimise exported energy).
3. Use energy when it is free (e.g. Octopus Free Energy Sessions).
4. When energy is expensive, and there is little solar generation, do not overload the battery (e.g. do not turn on the kettle and the toaster at the same time).

## Using an App/Dashboard

In my experience, simply making people aware of how their actions use energy has an effect on their behaviour; in the first case, simply having an app/dashboard that shows the current energy use, and people being interested enough to have a look at it, makes a difference. Part of the optimisation will happen without people even noticing as their intuition acts on the data presented. I should note that all the people in my sample (my household) are reasonably nerdy, so will naturally interpret data automatically, so this may not apply to everyone.

It is interesting how quickly humans learn from feedback.

I talk about my dashboard cards specifically in my [previous post](/blog/predbat-dashboard).

## Using Notifications

The problem with a dashboard is that people aren't always going to be looking at it. It can improve behaviour if people are notified when an important change should be made. Here is a set of notifications that I have found useful:

1. Large export of energy - you will always (usually) sell energy at a lower price than you buy it, so if you can use more energy instead of exporting it, you will save money.
2. Battery overload - if energy cannot be drawn from the battery quickly enough, to supply the load (`load - solar > battery max discharge`), then energy will be drawn from the grid, which costs money.
3. Energy is free - if energy is free, then it is a good time to use energy. This is especially good if you can create a calendar event for free electricity sessions, so people can plan ahead.

Here are the corresponding Home-Assistant automations:

```yaml
- alias: Large Energy Export Notification
  description: ""
  triggers:
    - trigger: state
      entity_id:
        - binary_sensor.predbat_export_trigger_large
      to: "on"
      from: "off"
  conditions: []
  actions:
    - action: notify.all_phones
      metadata: {}
      data:
        title: We're exporting lots of energy right now
        message: Turn on your devices for free power!
        data:
          notification_icon: mdi:solar-power
          tag: big-export
          channel: Energy
  mode: single

- alias: Free Electricity Session Notification
  description: ''
  triggers:
  - event_type: octopus_energy_new_octoplus_free_electricity_session
    trigger: event
  conditions: []
  actions:
  - action: notify.all_phones
    metadata: {}
    data:
      title: New Free Electricity Session
      message: Turn on your devices for free power! It starts at {{ trigger.event.data["event_start"].strftime('%H:%M') }} on {{ trigger.event.data["event_start"].strftime('%d/%m') }} for {{ trigger.event.data["event_duration_in_minutes"] | int }} minutes.
      data:
        notification_icon: mdi:home-lightning-bolt
        tag: free-electricity
        channel: Energy
  mode: single

- alias: Battery Overload Notification
  description: Battery maxed out and additional energy drawn from the grid.
  triggers:
  - trigger: numeric_state
    entity_id:
    - sensor.solax_battery_power_charge
    below: -3600
  - trigger: numeric_state
    entity_id:
    - sensor.solax_grid_import
    above: 0
  conditions:
  - condition: numeric_state
    entity_id: sensor.solax_battery_power_charge
    below: -3600
  - condition: numeric_state
    entity_id: sensor.solax_grid_import
    above: 0
  actions:
  - action: notify.all_phones
    metadata: {}
    data:
      title: Battery Overload Warning
      message: Full battery discharge and drawing from the grid, totalling {{ states('sensor.solax_grid_import') | int - states('sensor.solax_battery_power_charge') | int }} W.
      data:
        notification_icon: mdi:battery-alert
        tag: battery-overload
        channel: Energy
  mode: single
```

Here are Home-Assistant automations to add Octopus Sessions to Google Calendar:

```yaml
- alias: "📆 Free Electricity Calendar"
  description: ''
  triggers:
  - event_type: octopus_energy_new_octoplus_free_electricity_session
    trigger: event
  conditions: []
  actions:
  - action: calendar.create_event
    data:
      summary: Free Electricity
      start_date_time: '{{ trigger.event.data["event_start"] }}'
      end_date_time: '{{ trigger.event.data["event_end"] }}'
    target:
      entity_id: calendar.shared
  mode: parallel
  max: 3

- alias: "📆 Electricity Savings Sessions Calendar"
  description: Creates a calendar event for upcoming Octopus Energy Savings Sessions
    periods.
  triggers:
  - event_type: octopus_energy_new_octoplus_saving_session
    trigger: event
  conditions: []
  actions:
  - action: calendar.create_event
    data:
      summary: Octopus Savings Session
      start_date_time: '{{ trigger.event.data["event_start"] }}'
      end_date_time: '{{ trigger.event.data["event_end"] }}'
    target:
      entity_id: calendar.shared
  mode: parallel
  max: 3
```

## Using a Physical Indicator

Having seen the success of just a simple dashboard, my expectation was that putting a live indicator in the kitchen (the most energy intensive room due to actions) would have an even greater effect. The idea being that you can see in real time what effect turning on an appliance has without having to check your phone. In addition, it can show the battery level, energy price, solar generation and battery overload warnings.

I created my live indicator using ESPHome on an [M5Stack-Atom-Echo](https://docs.m5stack.com/en/atom/atomecho) and some addressable RGB LEDs. The LEDs are split into 4 sections:

1. Nothing yet (obscured by curtain)
2. Battery Level (level shown like a progress bar across the wall, current state shown by animated pixel moving across the LEDs with variable speed) and energy rates (green colour for <0.3p/kWh, red colour for >20p/kWh, otherwise yellow colour)
3. Solar Level (solar generation as a fraction of the capacity shown like a progress bar)
4. Battery Overload Warning (accompanied by a beep)

This setup has slightly improved our costs. I think that this improvement is a product of improved ergonomics and the feeling of guilt felt when you see the battery discharging quickly or you get beeped by the battery overload warning.

Here is my ESPHome configuration:

```yaml
esphome:
  name: energy-light
  friendly_name: Energy Light

esp32:
  board: m5stack-atom
  framework:
    type: arduino

logger:

api:
  encryption:
    key: "REDACTED"

ota:
  - platform: esphome
    password: "REDACTED"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  ap:
    ssid: "Energy-Light Fallback Hotspot"
    password: "REDACTED"

captive_portal:

button:
  - platform: restart
    name: Restart

#region Beep
  - platform: template
    name: Beep
    on_press:
      then:
        - rtttl.play: 'two_short:d=4,o=5,b=100:16e6,16e6'

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO39
      inverted: true
    name: Button
    disabled_by_default: true
    entity_category: diagnostic
    id: echo_button

i2s_audio:
  id: echo_audio
  i2s_lrclk_pin: GPIO33
  i2s_bclk_pin: GPIO19

speaker:
  - platform: i2s_audio
    id: echo_speaker
    i2s_dout_pin: GPIO22
    dac_type: external
    i2s_audio_id: echo_audio

rtttl:
  - speaker: echo_speaker
#endregion

color:
  - id: import_color
    red: 1
    green: 0.3
    blue: 0
  - id: solar_color
    red: 1
    green: 0.7
    blue: 0
  - id: export_color
    red: 1
    green: 0
    blue: 1

light:
  - platform: esp32_rmt_led_strip
    id: status_led
    name: Status LED
    pin: GPIO27
    default_transition_length: 0s
    chipset: SK6812
    num_leds: 1
    rgb_order: GRB
  - platform: fastled_clockless
    id: led_string
    name: LED String
    chipset: WS2812B
    pin: GPIO25
    num_leds: 100
    rgb_order: RGB
  - platform: partition
    name: Curtain
    id: curtain
    segments:
      - id: led_string
        from: 0
        to: 10
  - platform: partition
    name: Power Status
    id: power_status
    segments:
      - id: led_string
        from: 11
        to: 44
    effects:
      - addressable_lambda:
          name: "Battery Level"
          update_interval: 5000ms
          lambda: |-
            // it.size() - Number of LEDs
            // it[num] - Access the LED at index num.
            // Set the LED at num to the given r, g, b values
            // it[num] = Color(r, g, b);
            // Get the color at index num (Color instance)
            // it[num].get();
            int N = it.size();
            int n = (int)(id(battery_level).state * N);
            for (int i = 0; i < N; i++) {
              if (i <= n) {
                it[i] = current_color;
              } else {
                it[i] = Color::BLACK;
              }
            }
      - addressable_lambda:
          name: "Battery Level Importing"
          update_interval: 5ms
          lambda: |-
            int N = it.size();
            int n = (int)(id(battery_level).state * N);

            // A counter that cycles across the lit LEDs
            static float frame = 0.0;
            frame += id(leds_per_frame).state;
            if (frame > n) frame = 0;
            int led = (int)round(frame);

            for (int i = 0; i < N; i++) {
              if (i <= n) {
                if (i == led) {
                  it[i] = id(import_color);
                } else {
                  it[i] = current_color;
                }
              } else {
                it[i] = Color::BLACK;
              }
            }
      - addressable_lambda:
          name: "Battery Level Charging"
          update_interval: 5ms
          lambda: |-
            int N = it.size();
            int n = (int)(id(battery_level).state * N);

            // A counter that cycles across the lit LEDs
            static float frame = 0.0;
            frame += id(leds_per_frame).state;
            if (frame > n) frame = 0;
            int led = (int)round(frame);

            for (int i = 0; i < N; i++) {
              if (i <= n) {
                if (i == led) {
                  it[i] = id(solar_color);
                } else {
                  it[i] = current_color;
                }
              } else {
                it[i] = Color::BLACK;
              }
            }
      - addressable_lambda:
          name: "Battery Level Discharging Exporting"
          update_interval: 5ms
          lambda: |-
            int N = it.size();
            int n = (int)(id(battery_level).state * N);

            // A counter that cycles across the lit LEDs
            static float frame = 0.0;
            frame += id(leds_per_frame).state;
            if (frame > n) frame = 0;
            int led = (int)round(frame);

            for (int i = 0; i < N; i++) {
              if (i <= n) {
                if (i == n - led) {
                  it[i] = id(export_color);
                } else {
                  it[i] = current_color;
                }
              } else {
                it[i] = Color::BLACK;
              }
            }
      - addressable_lambda:
          name: "Battery Level Discharging"
          update_interval: 5ms
          lambda: |-
            int N = it.size();
            int n = (int)(id(battery_level).state * N);

            // A counter that cycles across the lit LEDs
            static float frame = 0.0;
            frame += id(leds_per_frame).state;
            if (frame > n) frame = 0;
            int led = (int)round(frame);

            for (int i = 0; i < N; i++) {
              if (i <= n) {
                if (i == n - led) {
                  it[i] = Color::BLACK;
                } else {
                  it[i] = current_color;
                }
              } else {
                it[i] = Color::BLACK;
              }
            }
  - platform: partition
    name: Other
    id: other
    segments:
      - id: led_string
        from: 45
        to: 68
    effects:
      - addressable_lambda:
          name: "Solar Level"
          update_interval: 200ms
          lambda: |-
            // it.size() - Number of LEDs
            // it[num] - Access the LED at index num.
            // Set the LED at num to the given r, g, b values
            // it[num] = Color(r, g, b);
            // Get the color at index num (Color instance)
            // it[num].get();
            int N = it.size();
            int n = (int)((1 - id(solar_level).state) * N);
            for (int i = 0; i < N; i++) {
              if (i <= n) {
                it[i] = Color::BLACK;
              } else {
                it[i] = id(solar_color);
              }
            }
  - platform: partition
    name: Spice Rack
    id: spice_rack
    segments:
      - id: led_string
        from: 69
        to: 99
    effects: 
      - pulse:
          name: Pulse

# Home Assistant sensors
sensor:
  # - platform: homeassistant
  #   id: energy_price
  #   entity_id: predbat.rates
  #   on_value:
  #     then:
  #       - lambda: |-
  #           if (isnan(id(energy_price).state)) return;
  #           auto call = id(status_led).turn_on();
  #           if (id(energy_price).state > 20) {  // high price threshold
  #             call.set_red(1.0);
  #             call.set_green(0.0);
  #             call.set_blue(0.0);
  #           } else if (id(energy_price).state < 0.3) {
  #             call.set_red(0.0);
  #             call.set_green(1.0);
  #             call.set_blue(0.0);
  #           } else {
  #             call.set_red(0.0);
  #             call.set_green(0.0);
  #             call.set_blue(1.0);
  #           }
  #           call.perform();
  - platform: homeassistant
    id: battery_level
    entity_id: sensor.solax_battery_percentage
    filters:
      - lambda: "return x / 100.0;"
  - platform: homeassistant
    id: leds_per_frame
    entity_id: sensor.solax_battery_power_charge
    filters:
      - lambda: "return abs(x) / 20000.0;"
  - platform: homeassistant
    id: solar_level
    entity_id: sensor.solax_pv_power_total
    filters:
      - lambda: "return x / 4350.0;"
```

Here are the Home-Assistant automations:

```yaml
- alias: Energy Light
  triggers:
  - trigger: state
    entity_id:
    - binary_sensor.kitchen_motion
  - trigger: numeric_state
    entity_id:
    - predbat.rates
    below: 0.3
  - trigger: numeric_state
    entity_id:
    - predbat.rates
    above: 0.3
  - trigger: numeric_state
    entity_id:
    - predbat.rates
    below: 20
  - trigger: numeric_state
    entity_id:
    - predbat.rates
    above: 20
  - trigger: time
    at: 06:00:00
  - trigger: time
    at: '22:00:00'
    enabled: false
  - trigger: state
    entity_id:
    - light.energy_light_power_status
    from: unavailable
    to: 'off'
  - trigger: numeric_state
    entity_id:
    - sensor.solax_battery_power_charge
    above: 0
  - trigger: numeric_state
    entity_id:
    - sensor.solax_battery_power_charge
    below: 0
  - trigger: state
    entity_id:
    - predbat.status
  conditions: []
  actions:
  - if:
    - condition: or
      conditions:
      - condition: state
        entity_id: binary_sensor.kitchen_motion
        state: 'off'
      - condition: time
        before: 06:00:00
      - condition: time
        after: '22:00:00'
        enabled: false
    then:
    - action: light.turn_off
      metadata: {}
      data: {}
      target:
        entity_id: light.energy_light_power_status
    - stop: ''
    alias: Light should be off
  - variables:
      color:
      - 255
      - 128
      - 0
      effect: Battery Level
  - choose:
    - conditions:
      - condition: numeric_state
        entity_id: predbat.rates
        below: 0.3
      sequence:
      - variables:
          color:
          - 0
          - 255
          - 0
    - conditions:
      - condition: numeric_state
        entity_id: predbat.rates
        above: 20
      sequence:
      - variables:
          color:
          - 255
          - 0
          - 0
  - choose:
    - conditions:
      - condition: state
        entity_id: predbat.status
        state: Charging
      sequence:
      - variables:
          effect: Battery Level Importing
    - conditions:
      - condition: state
        entity_id: predbat.status
        state: Discharging
      sequence:
      - variables:
          effect: Battery Level Exporting
    - conditions:
      - condition: state
        entity_id: predbat.status
        state: Demand
      sequence:
      - choose:
        - conditions:
          - condition: numeric_state
            entity_id: sensor.solax_battery_power_charge
            above: 0
          sequence:
          - variables:
              effect: Battery Level Charging
        - conditions:
          - condition: numeric_state
            entity_id: sensor.solax_battery_power_charge
            below: 0
          sequence:
          - variables:
              effect: Battery Level Discharging
  - action: light.turn_on
    metadata: {}
    data:
      brightness_pct: 50
      rgb_color: '{{ color }}'
      effect: '{{ effect }}'
    target:
      entity_id: light.energy_light_power_status
  mode: single

- alias: Battery Discharge Overload
  description: ''
  triggers:
  - trigger: state
    entity_id:
    - binary_sensor.kitchen_motion
  - trigger: time
    at: 06:00:00
  - trigger: time
    at: '22:00:00'
    enabled: false
  - trigger: state
    entity_id:
    - light.energy_light_spice_rack
    from: unavailable
    to: 'off'
  - trigger: numeric_state
    entity_id:
    - sensor.solax_battery_power_charge
    below: -3600
  - trigger: numeric_state
    entity_id:
    - sensor.solax_battery_power_charge
    above: -3600
  - trigger: numeric_state
    entity_id:
    - sensor.solax_grid_import
    above: 0
  - trigger: numeric_state
    entity_id:
    - sensor.solax_grid_import
    below: 0
  - trigger: state
    entity_id:
    - predbat.status
  conditions: []
  actions:
  - if:
    - condition: or
      conditions:
      - condition: state
        entity_id: binary_sensor.kitchen_motion
        state: 'off'
      - condition: time
        before: 06:00:00
      - condition: time
        after: '22:00:00'
        enabled: false
    then:
    - action: light.turn_off
      metadata: {}
      data: {}
      target:
        entity_id: light.energy_light_spice_rack
    - stop: ''
    alias: Light should be off
  - if:
    - condition: numeric_state
      entity_id: sensor.solax_battery_power_charge
      below: -3600
    - condition: numeric_state
      entity_id: sensor.solax_grid_import
      above: 0
    - condition: not
      conditions:
      - condition: state
        entity_id: predbat.status
        state: Discharging
    then:
    - action: light.turn_on
      metadata: {}
      data:
        brightness_pct: 50
        effect: Pulse
        rgb_color:
        - 255
        - 0
        - 0
      target:
        entity_id: light.energy_light_spice_rack
    - action: button.press
      metadata: {}
      data: {}
      target:
        entity_id: button.energy_light_beep
    else:
    - action: light.turn_off
      metadata: {}
      target:
        entity_id: light.energy_light_spice_rack
      data: {}
  mode: single

- alias: Solar Level Light
  description: ''
  triggers:
  - trigger: state
    entity_id:
    - binary_sensor.kitchen_motion
  - trigger: time
    at: 06:00:00
  - trigger: time
    at: '22:00:00'
    enabled: false
  - trigger: state
    entity_id:
    - light.energy_light_other
    from: unavailable
    to: 'off'
  conditions: []
  actions:
  - if:
    - condition: or
      conditions:
      - condition: state
        entity_id: binary_sensor.kitchen_motion
        state: 'off'
      - condition: time
        before: 06:00:00
      - condition: time
        after: '22:00:00'
        enabled: false
    then:
    - action: light.turn_off
      metadata: {}
      data: {}
      target:
        entity_id: light.energy_light_other
    - stop: ''
    alias: Light should be off
  - action: light.turn_on
    metadata: {}
    data:
      brightness_pct: 50
      effect: Solar Level
    target:
      entity_id: light.energy_light_other
  mode: single
```

I have included (commented out), the ESPHome code to control the colour of the battery level without a Home-Assistant automation, but I find it easier to use the automation as I want it to be motion controlled (especially to save energy 😉).
