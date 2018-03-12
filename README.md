
Working
---------

* Edison board boots up from roomba battery power and transmits to it via serial UART.
* SSH in, cd to the directory this is in, and run `node server.js`
* That will start a TCP server listening on port `6969`.
* Use `telnet IP PORT` to connect and the serialport is connected as well.
* send commands (bytes as uint8 and separated by commas) to roomba like so and then pressing enter

```
128 # start oci comms (sound is played)
173 # end oci comms (sound is played)
137,1,1,0,0 # drive straight
```

Don't forget to finish up with a 173 to exit oci mode!

Then exit telnet with `ctrl-]` and type `quit` and hit enter. Currently this ends the connection to the serialport and terminates the server.


Next Steps
-----------

* Decide if we want to put most of the logic into the code running on the roomba or put it elsewhere and communicate over serial. (can do both if we stick with nodejs.
* Keep track of the roomba's voltage and turn things off if it gets too low.
* Setup the computer vision components
* Setup mapping and localization.




Gotchas
---------

1. Arduinos can only communicate at 19200 (max)
2. DO NOT KEEP THE BOARD PLUGGED IN WHILE ROOMBA IS CHARGING! Voltage goes to like 20V
3. DO NOT LEAVE THE ROOMBA IN ANY MODE: It will drain the battery completely. Make sure you send a stop 0x173 command.
4. DO NOT LEAVE THE BOARD PLUGGED IN: It will still drain the battery if the board is using the roomba's battery.
5. IF you hard-press the center button, roomba communicates at 19200 baud instead of the 150K baud.
6. If the baud isn't set properly to match the roomba, there are no warning messages.
7. Make sure the gpio pins are configured.. see the `edison_setup_io.sh` script
8. DO NOT use the reset pin on the board, it ends up screwing with the gpio pins, namely 214 will not show up after a restart. Instead, just unplug and replug the power.

