---
title: "ESPHome Glimmer Effect"
description: A guide to creating a glimmer effect for addressable lights in ESPHome.
pubDate: 2023-12-26
tags:
  - esphome
original: https://community.home-assistant.io/t/glimmer-light-effect/660996
---

I have recently created a [custom effect](https://esphome.io/components/light/index.html#addressable-lambda-effect) that I am calling glimmer, it is essentially an inverse of the twinkle effect (lights start on and randomly some slightly dim before coming back again):

```yaml
  effects:
      - addressable_lambda: 
          name: Glimmer
          update_interval: 16ms
          lambda: |-
            const float glimmer_probability = 0.10f;
            const uint32_t progress_interval = 4;

            static uint32_t progress = 0;

            const uint32_t now = millis();
            uint8_t pos_add = 0;
            if (now - progress > 4) {
              const uint32_t pos_add32 = (now - progress) / 4;
              pos_add = pos_add32;
              progress += pos_add32 * 4;
            }
            for (auto view : it) {
              if (view.get_effect_data() != 0) {
                const uint8_t sine = half_sin8(view.get_effect_data());
                view = current_color * -sine;
                const uint8_t new_pos = view.get_effect_data() + pos_add;
                if (new_pos < view.get_effect_data())
                  view.set_effect_data(0);
                else
                  view.set_effect_data(new_pos);
              } else {
                view = current_color;
              }
            }
            while (random_float() < 0.10) {
              const size_t pos = random_uint32() % it.size();
              if (it[pos].get_effect_data() == 0)
                it[pos].set_effect_data(1);
            }
            it.schedule_show();

            if (initial_run) {
              progress = 0;
              it.all() = current_color;
            }
```

You can adjust the effect by editing the constants at the top of the file, `glimmer_probability` is a value between 0 and 1 representing how likely it is that a light will glimmer.

NB. This effect requires a set of addressable lights but it will automatically use the correct length.

Feel free to give it a go and maybe improve it, if you have any enhancements, I would love to read about them!

Merry Christmas!
