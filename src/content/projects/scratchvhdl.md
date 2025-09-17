---
title: "ScratchVHDL"
repository: https://github.com/house-of-abbey/scratch_vhdl
site: https://house-of-abbey.github.io/scratch_vhdl
description: |-
  The purpose of "Scratch VHDL" is to make reprogrammable logic design into child's play.
  Sounds ambitious.
icon: ./scratchvhdl.svg
contributors:
  - JosephAbbey
  - PhilipAbbey
  - L3harris
languages:
  - VHDL
  - Typescript
articles:
  - scratchvhdl-iet
  - scratchvhdl-l3harris
---

The purpose of "Scratch VHDL" is to make reprogrammable logic design into child's play. Sounds ambitious. We'll do this by providing an introductory package of measures to simplify all aspects of design entry from coding through to deployment on a _"Field Programmable Gate Array"_ (FPGA) which is a reprogrammable silicon chip. To learn more about what an FPGA is, you might like to read the blog "[All About FPGAs](https://www.eetimes.com/all-about-fpgas/)" by Bob Zeidman, or "[Basics of FPGA Architecture and Applications](https://www.elprocus.com/fpga-architecture-and-applications/)". We'll simplify the FPGA design process into the following step:

1. Using a _Scratch_ interface to enable drag and drop coding of VHDL.
2. Providing simple examples to code on a basic theme of 4 button and 4 LEDs, thereby...
3. Reducing the range of VHDL being used to a subset that can still be interesting and provide a learning experience.
4. Making testing interactive through a graphical control panel composed of buttons and LEDs to drive stimulus for the functional simulation instead of writing a VHDL test bench.
5. Using the native FPGA design tools in a guided point & click mode.
6. Encourage the understanding of the synthesis results by clicking through from gates to code.
7. Reducing the clock speed so that timing closure can be ignored.
8. Downloading the design to a development board in order to test for real, in a similar style to the interactive test bench used for simulation.

For example, we can create this Scratch diagram using our VS Code plug-in, and VS Code will generate the VHDL shown.

![Scratch editor for the logic gates demo](https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/scratch_blocks/logic_gates_reg_scratch.png)

```vhdl
architecture scratch of logic_gates is
begin

  process(clk)
  begin
    if rising_edge(clk) then
      if reset = '1' then
        leds <= "0000";
      else
        leds(0) <= and(buttons);
        leds(1) <= or(buttons);
        leds(2) <= xor(buttons);
        leds(3) <= nor(buttons);
      end if;
    end if;
  end process;

end architecture;
```

All of these measures allow the design entry process to be simplified to a practical guided lesson. The content of what can be done with four buttons and 4 LEDs can then be tailored from fundamental combinatorial gates through to basic sequences of states with more involved combinatorial logic demands. Anyone new to FPGA design will be able to experience the design process to realise and test a real (if simple) design, and gain an education.

## Design Entry

Rather than hiding the code from the students, the Scratch project builder engages its audience with its creation, allowing them to experience a modern design entry method. Scratch will reduce the chances of syntax errors (but not completely eliminate them), and a standard project setup can be used to avoid many of the time consuming distractions. For example, we use a standard VHDL `entity` for all the demonstration designs, and the Scratch builder only has to assist with the derivation of the VHDL `architecture` in a single file.

Once the Scratch design compiles, it can be tested in a VHDL simulator with the following point & click graphical controls.

![Traffic Lights](https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/sim_controls/knight_rider_demo.gif)

Variations on the controls are placed in different tabs.

1. Push buttons that immediately release, with 4 red LEDs.
2. Toggle buttons that have to be clicked to release, with 4 red LEDs.
3. Traffic light LEDs with push buttons.

The buttons will control the inputs to the top level entity, and the LED outputs from the VHDL simulator will drive the LED graphics. With the "Autostep" simulator control, the VHDL simulator becomes the chip, and no test bench code needs to be written. A free version of ModelSim is used for this purpose, where the limitations do not constrain the required functions.

The controls are used as a substitute for writing a full VHDL test bench. This is what the simulation looks like.

![ModelSim Wave Window](https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/modelsim_wave/knight_rider_sim.png)

Scripts are then used to automate the production of the bit file and sending it to the development board for testing. The scripts show the intermediate products, and the picture below shows the elaboration of the design to generic gates.

![ModelSim Wave Window](https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/vivado/knight_rider_elab.png)

The chosen FPGA development board is a [Zybo Z7](https://digilent.com/reference/programmable-logic/zybo-z7/start) shown below as its relatively cheap and we are not exactly pushing the capabilities of this board here.

![Zybo Z7, Zynq-7010](https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/zybo-z7-1.png)

Below is a video of a pseudo-random sequence generated by one of the demonstrations.

<video width="100%" controls style="max-width:500px">
  <source src="https://raw.githubusercontent.com/house-of-abbey/scratch_vhdl/main/docs/images/lfsr_internal.mp4" type="video/mp4">
</video>

Vivado Webpack is used for synthesis, place and route as we are staying within the devices supported by this free version. The source code includes input, output, constraints and pin out required to interface to the design, and these details are hidden from immediate view.

The download to the development board is managed through TCL scripts so the authors can immediately start trying their design out for real.
