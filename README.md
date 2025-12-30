MTR train tracking map, inspired by Datarail from Instagram.

A simulation, not a real-time map. Things that are realistic:
- Travel times and dwell times
- Train frequencies

Steps: 
1. Make a functional simulation of simple lines where trains simply go back and forth along a line. (Island Line, South Island Line, Tsuen Wan Line, West Rail Line, Disneyland Resort Line, Airport Express?)

Todo (priority):
- Make sure that trains complete the entire journey.
- Make sure that the stopping and dwelling times can be toggled for every station.
- Make sure that the simulation supports multiple lines.

Todo (other):
- Make sure that the spawner stops spawning when the leading train is almost here. (could consider deleting the last train once the first train arrives at the terminus)
- Get realistic numbers for the frequencies/travel times during rush hour.
- Find the optimal length of 1 tick (not sure if 1 tick = 1 second can peform well).
- Make it easy to show/hide the stations and the toggle the size of the trains/stations.
- Make a config file (json/csv/javascript?) storing data for each line. New lines should be able to be added solely based on data in the file.

2. Make branches and special schedules possible.
- The TKO Line and East Rail Line have branches which require additional programming. Make branches (essentially new lines with the same color?)
- For the Kwun Tong Line and Tung Chung Line, some trains terminate at stops that aren't the terminus during peak hours (the branch system could also work).
3. Make it possible for routes to have checkpoints (i.e. allowing for the line routes to be more precise). Will help for segments such as Tsing Yi -> Airport.
4. Add additional functions related to realism, such as:
- Keeping trains a certain distance apart (tricky on branch lines where branches take different amounts of time)
- Making sure trains crossing the Tsing Ma Bridge are a certain distance apart (need to synchronize trains on the Tung Chung Line and Airport Express)
- Adding acceleration/deceleration (can watch online videos of MTR trains to get an idea of the time needed to accelerate/decelerate)
- Simulating trains during off-peak hours
- Support for loop lines (useful for metro systems in different places)
5. Add other modes of transport, e.g. light rail, buses, trams, ferries
6. Create a framework to make visualizations of new lines easily (e.g. by adding stations by clicking on points on a map). Perhaps simplify it by making "spawners" that one can place in stations which spawn trains. Use this framework to make simulations of metro systems in other cities.

Notes:
Could add a "time offset" parameter to branches of lines to sync trains on a line with different destinations.
