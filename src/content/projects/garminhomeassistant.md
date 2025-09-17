---
title: "GarminHomeAssistant"
repository: https://github.com/house-of-abbey/garminhomeassistant
description: |-
  Garmin application to provide a dashboard to control your Home Assistant.
icon: ./x
contributors:
  - PhilipAbbey
  - JosephAbbey
  - Someone0nEarth
  - moesterheld
  - vincentezw
  - tispokes
  - krzys-h
  - j-a-n
  - aalaei
  - KPWhiver
  - jose1711
  - tarekbecker
  - Patrick44fr
  - TomerMir
  - mymyke
  - jjusko
languages:
  - Monkey C
  - Javascript
  - Python
---

![Venu 2](https://raw.githubusercontent.com/house-of-abbey/GarminHomeAssistant/main/images/Actual_Venu2_Theme.jpg)

A Garmin application to provide a "dashboard" to control your devices via [HomeAssistant](https://www.home-assistant.io/). The application will never be as fully fledged as a HomeAssistant dashboard, so it is designed to be good enough for the simple and essential things. Those things that can be activated via an on/off toggle or a tap. That should cover lights, switches, and anything requiring a single press such as an automation. For anything more complicated, e.g. thermostat, it would always be quicker and simpler to reach for your phone or tablet... or the device's own remote control!

The application is designed around a simple scrollable menu where menu items have been extended to interface with the [HomeAssistant API](https://developers.home-assistant.io/docs/api/rest/), e.g. to get the status of switches or lights for display on the `toggle` menu item, or a text status for an entity (`info` item). It is possible to nest menus, so there is a menu item to open a sub-menu. This can be arbitrarily deep and nested in the format of a tree of items, although you need to consider if reaching for your phone becomes quicker to select the device what you want to control.

### Source Code Repositories

* [Application](https://github.com/house-of-abbey/GarminHomeAssistant)
* [Widget](https://github.com/house-of-abbey/GarminHomeAssistantWidget)

### Connect IQ Store

* [Application](https://apps.garmin.com/en-US/apps/61c91d28-ec5e-438d-9f83-39e9f45b199d)
* [Widget](https://apps.garmin.com/en-US/apps/559f5174-177f-4f46-b170-f31c7e74dea3)

# Authors & Contributors

For an up to date list of all authors and contributors, please check the [contributor's page](https://github.com/house-of-abbey/GarminHomeAssistant/graphs/contributors). Thank you all for improving this application.
