const config = {
	mbaccessToken: "pk.eyJ1Ijoic3R1ZGVudHVzZXIiLCJhIjoiY2p3YW12dHc4MDVkaDRhcW1ieXY3cWJ6YSJ9.PGhwbEmZR7WYamtLGlGbbw",
	mbstyle: "mapbox://styles/studentuser/cjwap1w9i0hro1docd7x935xx",
	geocodeURI: address => {
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
const load = function (tick) {
	if (loadingEl != null) {
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

const search = async function (event) {
	if(event.keyCode === 13) {
		load(1);
		
			let searchfield = document.getElementById("searchbar").value;
			searchfield = searchfield.trim();
		
			const data = await fetch(config.geocodeURI(searchfield));
			const dataJson = await data.json();
		
		load(-1);

		if (dataJson.results.length > 0) {
			const location = dataJson.results[0].geometry;

			map.flyTo({
				center: [location.lng, location.lat],
				speed: 0.7,
				curve: 1.2
			});
		}
	}
};

let data;
let it;

document.addEventListener("DOMContentLoaded", async () => {
	loadingEl = document.getElementById("throbber");
	load(1);

	map = initMap("map");

	var requestURL = 'https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();

	request.onload = function () {
		data = request.response;

		for (let i = 0; i < data.length; i++) {
			if(data[i].type === "Airports" || data[i].type === "Other Airport"){

				let popup = new mapboxgl.Popup();
				popup.on("open",(p) => {
					details.style.display = "block";
					it = i;
					
					document.getElementById("airname").innerHTML = data[i].name;
					document.getElementById("airlocation").innerHTML = data[i].city +" - "+  data[i].state +" - "+ data[i].country;
				});
				popup.on("close",(p) => {
					details.style.display = "none";
				});

				let marker = new mapboxgl.Marker()
					.setLngLat([data[i].lon, data[i].lat])
					.setPopup(popup);

				popup.setLngLat(marker.getLngLat());

				marker.addTo(map);

			}
		}
	}

	load(-1);
});

const clickedFROM = el => {
	document.getElementById("flightlist").style.display = "block";
	const from = document.getElementById("listFrom");

	const icao = getICAOcodeTO();
	if (icao === data[it].icao)
		document.getElementById("listTo").innerHTML = "";

	from.innerHTML = '<h2 class="centered">From</h2><div id="fromAirport">'+data[it].name+' - '+data[it].icao+'</div>';
};
const clickedTO = el => {
	document.getElementById("flightlist").style.display = "block";
	const to = document.getElementById("listTo");

	const icao = getICAOcodeFROM();
	if (icao === data[it].icao)
		document.getElementById("listFrom").innerHTML = "";

	to.innerHTML = '<h2 class="centered">To</h2><div id="toAirport">'+data[it].name+' - '+data[it].icao+'</div>';
};

const getICAOcodeFROM = () => {
	let fromAirport = document.getElementById("fromAirport");
	if (fromAirport !== null){
		fromAirport = fromAirport.innerHTML.split(" - ")[1].trim();
		return fromAirport;
	} else
		return "";
}
const getICAOcodeTO = () => {
	let toAirport = document.getElementById("toAirport");
	if (toAirport !== null){
		toAirport = toAirport.innerHTML.split(" - ")[1].trim();
		return toAirport;
	} else
		return "";
}
