A Subway train animation maker.

Main Files:
- kimi_mtr/kimi_mtr.html - Animation player. Can generate and play animations based on JSON files of networks.
- editor_version1/editor_version1.html - Network editor. Can edit JSON files of networks.
- systems/ - Some pre-made JSON network files that can be animated

Todo:
The system currently can't simulate transit systems with schedules. The following should be done to accomodate them:
- Make "single-trip" options for lines, where trains disappear when they travel to one end.
- For "single-trip" lines, create "unidirectional" and "bidirectional" options. For bidirectional lines, trains spawn on both ends.
- For the spawning of "single trip" trains, give two options: "scheduled" and "scheduled frequency".
- For "scheduled" spawning, a list of times (in seconds) is given. Trains spawn at each time in the list.
- For "scheduled frequencies" spawning, a list of times is given, along with a list of frequencies. At each time in the list, the frequency is changed to the corresponding frequency value. 
- For the animation player, let the number of seconds be the time since 00:00:00 (24 hour clock). Display the time. Make it possible to start/stop at any time.


January 5 update:
Due to bad performance, major overhauls are needed. From now on, the generation of the animation and the playing of the animation will be separate. I will generate an array storing the coordinates of each train every second to make the animation playing faster. Other things to consider:
- Start with all the trains. Space them apart by the frequency and calculate where they should be.
- Stop using classes and calculate the position of each train directly.
- Keep the time-based model for good performance. The speed-based model might be slow.
- For the train coordinates, simply record the coordinates for each line for the first x seconds, where x is the number of seconds per train. When playing, repeating it works.
- If the performance still isn't good enough, consider using another language. (could be caused by a limitation of browsers or leaflet js.)

