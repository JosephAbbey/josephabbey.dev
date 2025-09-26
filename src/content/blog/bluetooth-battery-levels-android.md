---
title: Home Assistant Bluetooth Battery Levels (Android)
description: A guide to getting battery levels of Bluetooth devices in Home Assistant on Android.
pubDate: 2023-12-05
tags:
  - homeassistant
  - android
original: https://community.home-assistant.io/t/bluetooth-battery-levels-android/661525
---

I have seen a few posts about getting the battery level of Bluetooth device in homeassistant but none of them actually fully explain and none of them actually worked for me at first.

1. First open the homeassistant app on your phone and navigate to Settings > Companion App > Manage Sensors > Last Update Trigger.
2. Ensure that it is enabled.
3. Click `Add New Intent` at the bottom of the screen and then on `Intent 1`.
4. Enter exactly `android.bluetooth.device.action.BATTERY_LEVEL_CHANGED`.
5. ***IMPORTANT***: Restart the app, it is important that you perform a forced restart (there will be a button in your phones settings on the homeassistant app info page that will say something along the lines of `Force stop`).
6. Open up your `configuration.yaml` file and add:

```yaml
template:
  - trigger:
      - platform: "event"
        event_type: "android.intent_received"
        event_data:
          android.bluetooth.device.extra.DEVICE: "<mac_address>"
          intent: "android.bluetooth.device.action.BATTERY_LEVEL_CHANGED"
    sensor:
      - name: "<device_name> Battery Level"
        unique_id: "<uid>"
        device_class: "battery"
        unit_of_measurement: "%"
        state_class: "measurement"
        availability: "{{ trigger.event['data']['android.bluetooth.device.extra.BATTERY_LEVEL'] != '-1' }}"
        state: "{{ trigger.event['data']['android.bluetooth.device.extra.BATTERY_LEVEL'] }}"
```

7. Swap &lt;mac_address&gt; and &lt;device_name&gt; for the mac address and device name of your bluetooth device.
8. Swap &lt;uid&gt; for a unique id (in the Studio Code Server you can do this from the right click menu).
9. Either restart HomeAssistant or open the developer tools page and click reload template entities.
10. You did it!

Troubleshooting:

- Open the developer tools page and navigate to the events tab, enter `android.intent_received` into `Event to subscribe to`, then click `START LISTENING` and then power off and on your bluetooth device you should see two events pop up one for power off and one for power on.
- Check the system logs in settings.
- Check that your phone is showing a battery charge for the device in Bluetooth settings.
- Check the mac address is correct.
- Check all spellings!

### Disclaimers

For Garmin devices check out [GarminHomeAssistant](/projects/garminhomeassistant).

For buds style devices, you will only get one battery level; for my pixel buds pro, that was the right ear bud battery level.
