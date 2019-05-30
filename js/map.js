const config = {
	mbaccessToken: "pk.eyJ1Ijoic3R1ZGVudHVzZXIiLCJhIjoiY2p3YW12dHc4MDVkaDRhcW1ieXY3cWJ6YSJ9.PGhwbEmZR7WYamtLGlGbbw",
	mbstyle: "mapbox://styles/studentuser/cjwap1w9i0hro1docd7x935xx",
	geocodeURI : address => {
		return (
			"https://api.opencagedata.com/geocode/v1/json?q=" +
			address +
			"&key=9b0ed426ed5643748153ef884b7c1e70"
		);
	}
}

mapboxgl.accessToken = config.mbaccessToken;

let map = null;

let loadingEl = null;
let loadCount = 0;
const load = function(tick){
	if (loadingEl != null){
		loadCount += tick;

		if (loadCount > 0)
			loadingEl.style.display = "block";
		else
			loadingEl.style.display = "none";
	}
};

const initMap = container => {
	const map = new mapboxgl.Map({
		container: container,
		style: config.mbstyle,
		center: [-73.6103642, 45.4972159],
		zoom: 11.05 //11.05 zoom necessary to see all airports (if more zoomed out, smaller airports will cease to appear)
	});
	return map;
};

const search  = async function() {
	load(1);

	let searchfield = document.getElementById("searchbar").value;
	searchfield = searchfield.trim();

	const data = await fetch(config.geocodeURI(searchfield));
	const dataJson = await data.json();

	load(-1);

	if (dataJson.results.length > 0){
		const location = dataJson.results[0].geometry;

		map.flyTo({
			center: [location.lng, location.lat],
			speed: 0.7,
			curve: 1.2
		});
	}	
};

document.addEventListener("DOMContentLoaded", async () => {

	map = initMap("map");
	let markers = [];

	loadingEl = document.getElementById("throbber");

	/*	Mark all airports
	let userMarker = new mapboxgl.Marker()
		.setLngLat([locInfo.longitude, locInfo.latitude])
		.setPopup(
			new mapboxgl.Popup({ className: "here" }).setHTML(
				'<h1>you are here</h1><img src="' + locInfo.country_flag + '" />'
			)
		)
		.addTo(map)
		.togglePopup();*/

	load(0);
});
