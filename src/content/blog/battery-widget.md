---
title: "Home Assistant Battery Widget"
description: A guide to creating a battery widget for Home Assistant.
pubDate: 2023-12-26
tags:
  - homeassistant
  - android
  - widget
original: https://community.home-assistant.io/t/battery-widget/661545
cover: ../../assets/blog/battery-widget.png
---

I have been working on a battery widget for my home screen to replace the Pixel battery widget, the UI is not great because it is rendered as ASCII art but I quite like it.

<!-- ![Demo Image](../../assets/blog/battery-widget.png) -->

It makes use of a [template widget](https://companion.home-assistant.io/docs/integrations/android-widgets#template) so it requires a connection to HomeAssistant even for local devices.

## Version 2

There are a few notable improvements over version 1:

- Displays when the entity was updated
- Displays remaining charge time
- Thinner, more granular battery bars
- Important devices (those that are not important are hidden when not charging or low battery)

Version 2 requires [easy_time](https://github.com/Petro31/easy-time-jinja)

```jinja
{% from 'easy_time.jinja' import easy_time %}

{% set granularity = 56 %}
{% set max_devices = 8 %}
{# Name, Battery Level, Is Charging, Remaining Charge Time, Important #}
{% set devices = [
  ("Phone", "sensor.joseph_s_phone_battery_level", "binary_sensor.joseph_s_phone_is_charging", "sensor.joseph_s_phone_remaining_charge_time", True),
  ...
] %}
{# Min, Color #}
{% set colors = [
  (90, "#a1eb93"),
  (50, ""),
  (20, "#ebd660"),
  (-1, "#F2B8B5"),
] %}


{%set ns=namespace(displaying=0)%}<tt>{%for device in(devices|rejectattr("1","is_state","unavailable")|rejectattr("1","is_state","unknown")|list)%}{%if ns.displaying<max_devices and(device[4]or is_state(device[2],"on")or((states(device[1])|int(0))<=20and(states(device[1])|int(0))!=0and(states(device[1])|int(0))!=100))%}{%set ns.displaying=ns.displaying+1%}{%if(states.sensor[device[1].split(".")[1]].last_updated|as_timestamp(0))-(now()|as_timestamp(0))<-300%}<i>{%else%}<b>{%endif%}{{device[0]}}: {{states(device[1])|int(0)}}% {%if is_state(device[2],"on")%}⚡{%endif%} {%if(states(device[3])|int(0))>0%}full in {{as_datetime(max(0,(states(device[3])|int(0))*60+(states.sensor[device[3].split(".")[1]].last_changed|as_timestamp(0))-(now()|as_timestamp(0)))).strftime("%H:%M")}}{%else%} - {{easy_time(states.sensor[device[1].split(".")[1]].last_updated)}} ago{%endif%}<br /></i></b><font color="{{(colors|selectattr("0","<",states(device[1])|int(0))|first)[1]}}"><small><small>{{"█"*(((states(device[1])|int(0))/100*granularity)|int(0))}}{{"░"*(granularity-(((states(device[1])|int(0))/100*granularity)|int(0)))}}</small></small></font>{%if ns.displaying<max_devices%}<small><small><small><br /><br /></small></small></small>{%endif%}{%endif%}{%endfor%}
```

The two variables at the top hold all of the config information, `granularity` is how many characters are used in the progress bar, `devices` is a list of any number of devices, it is made up 5 parts (Name, Battery Level, Is Charging, Remaining Charge Time, Important), if you don't have a charging entity just leave it blank. If a device is important it will always be displayed, if not it will only be displayed when low battery or charging.

Feel free to modify it and improve it. If you make it better, I would love to hear!

Merry Christmas!

For Bluetooth battery levels check out my other post: [Home Assistant Bluetooth Battery Levels (Android)](/blog/bluetooth-battery-levels-android)
