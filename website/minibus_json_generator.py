import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


trips = pd.read_csv("../hk_gtfs/trips.txt")
stop_times = pd.read_csv("../hk_gtfs/stop_times.txt")
stops = pd.read_csv("../hk_gtfs/stops.txt")
frequencies = pd.read_csv("../hk_gtfs/frequencies.txt")

with open("../pyscript_in/specific_hkgeojson_mini.json", "r", encoding="utf-8") as f:
    geojson = json.load(f)


#manual checkpoints: Routes that are hard to checkpoint (e.g circular lines)
def generate_branch_json(route_id, service_id, dir_num, manual_checkpoints):
    specific_trips = trips[(trips["route_id"] == route_id) & (trips["service_id"] == service_id)]
    
    specific_trips = specific_trips[specific_trips["trip_id"].str.contains(str(route_id) + '-' + str(dir_num), case=False, na=False)]
    print(str(route_id) + '-' + str(dir_num))

    specific_trips = specific_trips.sort_values(by="trip_id")

    parts = specific_trips["trip_id"].str.split('-', expand = True)
    print("parts:")
    print(specific_trips)
    specific_trips[["routeid_repeat", "dir", "serviceid_repeat", "trip_time"]] = parts
    specific_trips = specific_trips.drop(columns = ["routeid_repeat", "serviceid_repeat"])
    #print(specific_trips)

    route = stop_times[stop_times["trip_id"] == specific_trips.iloc[0]["trip_id"]]

    route_stops = route.merge(stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon']], on = 'stop_id', how = 'left')

    #print(route_stops[['stop_id', 'stop_name']])
    #print(route_stops[['arrival_time', 'departure_time']])

    return_branch = {
                "branch_id": 0,
                "SPAWN_EVERY": 300,
                "branch_type": "unidirectional",
                "scheduling": "scheduled_frequencies",
                "stations": [
                ],
                "timetable": [

                ],
    }

    #stations 
    i = 0
    for row in route_stops.itertuples(index=True):
        return_branch["stations"].append({
            'name': row.stop_name,
            'lat': row.stop_lat,
            'lng': row.stop_lon,
            'run': 120,
            'dwell': 30,
            'checkpoints': [
            ]
        })


    #checkpoints
    dropout_rate = 2

    print(geojson.keys())
    #add the checkpoints
    #add the direction 1 route
    for route_feature in geojson["features"]:
        if route_feature["properties"]["ROUTE_ID"] != route_id:
            continue
        if route_feature["properties"]["ROUTE_SEQ"] != dir_num:
            continue

        #build the full list of candidate checkpoints along the route
        checkpoint_points = []
        counter = 0
        for coord in route_feature["geometry"]["coordinates"]:
            counter += 1
            if counter % dropout_rate == 0:
                checkpoint_points.append({
                    'lat': coord[1],
                    'lng': coord[0],
                    'progress': 0.5
                })

        stations = return_branch["stations"]

        #start by putting every checkpoint on the first station, then peel
        #checkpoints off the tail station onto the next station as we go:
        #for each station, find the checkpoint (within the points still
        #owned by the previous station) closest to it, and hand everything
        #from the point after that one onward to this station.
        if manual_checkpoints == False:
            cursor = 0
            for station_idx in range(1, len(stations)):
                station = stations[station_idx]

                closest_index = None
                closest_dist = None
                for point_index in range(cursor, len(checkpoint_points)):
                    point = checkpoint_points[point_index]
                    dist = (point['lat'] - station['lat']) ** 2 + (point['lng'] - station['lng']) ** 2
                    if closest_dist is None or dist < closest_dist:
                        closest_dist = dist
                        closest_index = point_index

                if closest_index is None:
                    stations[station_idx - 1]["checkpoints"] = checkpoint_points[cursor:]
                    continue

                #see if putting the station between the previous checkpoint and the shortest checkpoint or between the shortest checkpoint and the next checkpoint is better
                dist1 = -1
                dist2 = -1
                #previous checkpoint >> station >> shortest checkpoint
                if (closest_index > cursor):
                    point = checkpoint_points[closest_index]
                    otherpoint = checkpoint_points[closest_index - 1]
                    dist1 = (otherpoint['lat'] - station['lat']) ** 2 + (otherpoint['lng'] - station['lng']) ** 2
                    dist1 += (point['lat'] - station['lat']) ** 2 + (point['lng'] - station['lng']) ** 2
                #shortest checkpoint >> station >> next checkpoint
                if (closest_index < len(checkpoint_points) - 1):
                    point = checkpoint_points[closest_index]
                    otherpoint = checkpoint_points[closest_index + 1]
                    dist2 = (otherpoint['lat'] - station['lat']) ** 2 + (otherpoint['lng'] - station['lng']) ** 2
                    dist2 += (point['lat'] - station['lat']) ** 2 + (point['lng'] - station['lng']) ** 2

                if ((dist1 != -1) and (dist2 != -1)):
                    if(dist1 < dist2):
                        #previous checkpoint >> station >> shortest checkpoint is shorter
                        stations[station_idx - 1]["checkpoints"] = checkpoint_points[cursor:closest_index]
                    else:
                        #previous checkpoint >> station >> shortest checkpoint is not as short
                        stations[station_idx - 1]["checkpoints"] = checkpoint_points[cursor:closest_index + 1]
                else:
                    stations[station_idx - 1]["checkpoints"] = checkpoint_points[cursor:closest_index + 1]
                cursor = closest_index + 1

            stations[-1]["checkpoints"] = checkpoint_points[cursor:]
            
        else:
            stations[0]["checkpoints"] = checkpoint_points


    #schedule/frequencies
    frequencies_new = specific_trips.merge(frequencies[['trip_id', 'start_time', 'end_time', 'headway_secs']], how="left", on="trip_id")
    frequencies_new = frequencies_new.drop(columns=['service_id', 'dir'])

    freqs_len = len(frequencies_new.index)

    i = 0
    #print(frequencies_new)
    for row in frequencies_new.itertuples(index=True):
        #print("start time:")
        if not isinstance(row.start_time, str):
            #no start/end time. This means that it's a single journey. Scheduled, not scheduled frequencies.
            #can't get start time. Get time from trip_id.
            print("!!!?!")
            last_part = row.trip_id.split("-")[3]
            print(last_part)
            print(last_part[0:2] + ":" + last_part[2:4])
            return_branch["timetable"].append({
                "time": last_part[0:2] + ":" + last_part[2:4],
                "frequency": 86400
            })
            i += 1
            continue

        return_branch["timetable"].append({
            "time": row.start_time[:5],
            "frequency": row.headway_secs
        })
        #if it is the end, then add a 86400 frequency thingy at the end.
        #print("i: " + str(i) + "freqlen - 1:" + str(freqs_len - 1))
        if (i >= freqs_len - 1):
            print("last freq, stopping it")
            if (int(row.end_time[:2]) >= 24):
                return_branch["timetable"].append({
                    "time": "23:59",
                    "frequency": 86400
                })
            else:
                return_branch["timetable"].append({
                    "time": row.end_time[:5],
                    "frequency": 86400
                })
        i += 1

    return return_branch
    
"""
def generate_line_json(line_name, route_id1, service_id1, dir1, route_id2, service_id2, dir2):
    specific_trips = trips[((trips["route_id"] == route_id1) | (trips["route_id"] == route_id2)) & ((trips["service_id"] == service_id1) | (trips["service_id"] == service_id2))]
    print((str(route_id1) + '-1'))

    # df['col'] is your original column
    #parts = trips['rou'].astype(str).str.split('-', expand=True)

    #df[['a', 'b', 'c', 'd']] = parts

    specific_trips_1 = specific_trips[specific_trips["trip_id"].str.contains(str(route_id1) + '-' + str(dir1), case=False, na=False)]
    specific_trips_2 = specific_trips[specific_trips["trip_id"].str.contains(str(route_id2) + '-' + str(dir2), case=False, na=False)]

    #specific_trips_2 = specific_trips.filter(like=(str(route_id) + '-2'))

    specific_trips_1 = specific_trips_1.sort_values(by="trip_id")
    specific_trips_2 = specific_trips_2.sort_values(by="trip_id")

    parts = specific_trips_1["trip_id"].str.split('-', expand = True)
    specific_trips_1[["routeid_repeat", "dir", "serviceid_repeat", "trip_time"]] = parts
    specific_trips_1 = specific_trips_1.drop(columns = ["routeid_repeat", "serviceid_repeat"])
    parts = specific_trips_2["trip_id"].str.split('-', expand = True)
    specific_trips_2[["routeid_repeat", "dir", "serviceid_repeat", "trip_time"]] = parts
    specific_trips_2 = specific_trips_2.drop(columns = ["routeid_repeat", "serviceid_repeat"])

    print(specific_trips_1)
    print(specific_trips_2)

    #stops
    route1 = stop_times[stop_times["trip_id"] == specific_trips_1.iloc[0]["trip_id"]]
    route2 = stop_times[stop_times["trip_id"] == specific_trips_2.iloc[0]["trip_id"]]

    route1_stops = route1.merge(stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon']], on = 'stop_id', how = 'left')
    route2_stops = route2.merge(stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon']], on = 'stop_id', how = 'left')

    print(route1_stops[['stop_id', 'stop_name']])
    print(route2_stops[['stop_id', 'stop_name']])
    print(route1_stops[['arrival_time', 'departure_time']])
    print(route2_stops[['arrival_time', 'departure_time']])

    #frequencies
    frequencies_1 = specific_trips_1.merge(frequencies[['trip_id', 'start_time', 'end_time', 'headway_secs']])
    frequencies_1 = frequencies_1.drop(columns=['service_id', 'dir'])
    frequencies_2 = specific_trips_2.merge(frequencies[['trip_id', 'start_time', 'end_time', 'headway_secs']])
    frequencies_2 = frequencies_2.drop(columns=['service_id', 'dir'])
    print(frequencies_1)

    to_return = {
        "line_id": 100,
        "name": line_name,
        "line_color":'#3ABA9C',
        "branches": [
            {
                "branch_id": 0,
                "SPAWN_EVERY": 300,
                "branch_type": "unidirectional",
                "scheduling": "scheduled_frequencies",
                "stations": [
                ],
                "timetable": [

                ],
            },
            {
                "branch_id": 1,
                "SPAWN_EVERY": 300,
                "branch_type": "unidirectional",
                "scheduling": "scheduled_frequencies",
                "stations": [
                ],
                "timetable": [

                ],
            }
        ]
    }

    #add stations
    i = 0
    for row in route1_stops.itertuples(index=True):
        to_return["branches"][0]["stations"].append({
            'name': row.stop_name,
            'lat': row.stop_lat,
            'lng': row.stop_lon,
            'run': 120,
            'dwell': 30,
            'checkpoints': [
            ]
        })

    i = 0
    for row in route2_stops.itertuples(index=True):
        to_return["branches"][1]["stations"].append({
            'name': row.stop_name,
            'lat': row.stop_lat,
            'lng': row.stop_lon,
            'run': 120,
            'dwell': 30,
            'checkpoints': [
            ]
        })

    #print(frequencies_1)

    #only keep 1 checkpoint every 10.
    dropout_rate = 7

    print(geojson.keys())
    #add the checkpoints
    #add the direction 1 route
    for route_feature in geojson["features"]:
        if route_feature["properties"]["ROUTE_ID"] != route_id1:
            continue
        if route_feature["properties"]["ROUTE_SEQ"] != dir1:
            continue
        #iterate through each stop
        #make sure it doesn't exceed this
        stops_len = len(to_return["branches"][0]["stations"])
        counter = 0
        for coord in route_feature["geometry"]["coordinates"]:
            counter += 1
            if counter % dropout_rate == 0:
                to_return["branches"][0]["stations"][0]["checkpoints"].append({
                    'lat': coord[1],
                    'lng': coord[0],
                    'progress': 0.5
                })

    #add the direction 2 route
    for route_feature in geojson["features"]:
        if route_feature["properties"]["ROUTE_ID"] != route_id2:
            continue
        if route_feature["properties"]["ROUTE_SEQ"] != dir2:
            continue
        #iterate through each stop
        #make sure it doesn't exceed this
        stops_len = len(to_return["branches"][1]["stations"])
        counter = 0
        for coord in route_feature["geometry"]["coordinates"]:
            counter += 1
            if counter % dropout_rate == 0:
                to_return["branches"][1]["stations"][0]["checkpoints"].append({
                    'lat': coord[1],
                    'lng': coord[0],
                    'progress': 0.5
                })


    #add calendar
    print("length:")
    print(frequencies_1.shape[0])
    i = 0
    for row in frequencies_1.itertuples(index=True):
        to_return["branches"][0]["timetable"].append({
            "time": row.start_time[:5],
            "frequency": row.headway_secs
        })
        if i >= frequencies_1.shape[0] - 1:
            to_return["branches"][0]["timetable"].append({
                "time": row.end_time[:5],
                "frequency": 86400
            })
        i += 1

    i = 0
    for row in frequencies_2.itertuples(index=True):
        to_return["branches"][1]["timetable"].append({
            "time": row.start_time[:5],
            "frequency": row.headway_secs
        })
        if i >= frequencies_2.shape[0] - 1:
            to_return["branches"][1]["timetable"].append({
                "time": row.end_time[:5],
                "frequency": 86400
            })
        i += 1

    return to_return

"""

def new_generate_line_json(line_name, routes):
    to_return = {
        "line_id": 100,
        "name": line_name,
        "line_color":'#00ff00',
        "icon_size": 23,
        "markertype": "image",
        "branches": [
        ]
    }
    for route in routes:
        to_return["branches"].append(generate_branch_json(route[0], route[1], route[2], route[3]))
    return to_return

final_json = [
    new_generate_line_json('31', [(2006738, 287, 1, False), (2006738, 287, 2, False)]),
    new_generate_line_json('54', [(2003636, 287, 1, False), (2003637, 511, 1, False), (2009840, 511, 1, False), (2009842, 511, 1, False)]),
    new_generate_line_json('54M', [(2003685, 287, 1, False), (2003685, 287, 2, False)]),
    new_generate_line_json('55', [(2003771, 287, 1, False)]),
    new_generate_line_json('59A', [(2002746, 511, 1, False), (2002746, 511, 2, False), (2002748, 511, 1, False), (2002748, 511, 2, False)]),
    new_generate_line_json('63', [(2003405, 287, 1, False), (2003405, 287, 2, False)])
]

with open("../pyscript_out/hkminibus_testing.json", "w", encoding="utf-8") as f:
    json.dump(final_json, f, indent=4)


#print(generate_line_json('58', 2002580, 287))