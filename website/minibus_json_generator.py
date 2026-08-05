import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


trips = pd.read_csv("../hk_gtfs/trips.txt")
stop_times = pd.read_csv("../hk_gtfs/stop_times.txt")
stops = pd.read_csv("../hk_gtfs/stops.txt")
frequencies = pd.read_csv("../hk_gtfs/frequencies.txt")

with open("../hk_geojson/specific_hkgeojson_mini.json", "r", encoding="utf-8") as f:
    geojson = json.load(f)


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


final_json = [
    generate_line_json('58M', 2002614, 287, 1, 2002614, 287, 2),
    generate_line_json('69A', 2000819, 287, 1, 2000819, 287, 2)
]

with open("../pyscript_out/hkminibus_testing.json", "w", encoding="utf-8") as f:
    json.dump(final_json, f, indent=4)


#print(generate_line_json('58', 2002580, 287))