module.exports = {
	mbaccessToken : "pk.eyJ1Ijoic3R1ZGVudHVzZXIiLCJhIjoiY2p3YW12dHc4MDVkaDRhcW1ieXY3cWJ6YSJ9.PGhwbEmZR7WYamtLGlGbbw",
	mbstyle: "mapbox://styles/studentuser/cjwap1w9i0hro1docd7x935xx",
	//geoIp : "https://api.ipgeolocation.io/ipgeo?apiKey=782b4e3d7d51437b8096de0fafa88b24",
	geocodeURI : address => {
		return (
			"https://api.opencagedata.com/geocode/v1/json?q=" +
            address +
			"&key=9b0ed426ed5643748153ef884b7c1e70"
		);
	}
};
