// Cities to label on the world map. Add more entries here to add more labels.
const cities = [
    {
        name: 'Hong Kong',
        coords: [114.1694, 22.3193],
        link: 'cities/hongkong.html',
    },
    {
        name: 'Chicago',
        coords: [-87.6298, 41.8781],
        link: 'cities/chicago.html',
    },
    {
        name: 'Beijing',
        coords: [116.4074, 39.9042],
        link: 'cities/beijing.html',
    },
];

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [30, 25],
    zoom: 1.3,
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.on('load', () => {
    cities.forEach((city) => {
        const el = document.createElement('div');
        el.className = 'city-marker';
        el.title = city.name;

        const popup = new maplibregl.Popup({ offset: 14 }).setHTML(
            `<h3>${city.name}</h3><a class="popup-link" href="${city.link}">View page &rarr;</a>`
        );

        new maplibregl.Marker({ element: el })
            .setLngLat(city.coords)
            .setPopup(popup)
            .addTo(map);
    });
});
