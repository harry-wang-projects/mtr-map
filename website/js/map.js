/*
// Cities to label on the world map. Add more entries here to add more labels.
// Each city can have multiple links, each with its own title.
const cities = [
    {
        name: 'Hong Kong',
        coords: [114.1694, 22.3193],
        links: [
            { title: 'MTR', url: 'networks/hkmtr_offpeak/' },
            { title: 'Light Rail', url: 'networks/hklrt_peak/' },
        ],
    },
    {
        name: 'Chicago L',
        coords: [-87.6298, 41.8781],
        links: [
            { title: 'View page', url: 'networks/chicagol_offpeak' },
        ],
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

        const linksHtml = city.links
            .map((link) => `<a class="popup-link" href="${link.url}">${link.title} &rarr;</a>`)
            .join('');

        const popup = new maplibregl.Popup({ offset: 14 }).setHTML(
            `<h3>${city.name}</h3>${linksHtml}`
        );

        new maplibregl.Marker({ element: el })
            .setLngLat(city.coords)
            .setPopup(popup)
            .addTo(map);
    });
});
*/