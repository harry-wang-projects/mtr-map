// Cities to label on the world map. Add more entries here to add more labels.
const cities = [
    {
        name: 'Hong Kong MTR',
        coords: [114.1694, 22.3193],
        link: 'cities/hongkong.html',
    },
    {
        name: 'Hong Kong Light Rail',
        coords: [114.1294, 22.3593],
        link: 'cities/hongkong.html',
    },
    {
        name: 'Chicago L',
        coords: [-87.6298, 41.8781],
        link: 'cities/chicago.html',
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
