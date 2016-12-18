const alfy = require("alfy");
const aqiFormats = {
	0: "Bardzo dobry",
	1: "Dobry",
	2: "Umiarkowany",
	3: "Dostateczny",
	4: "Zły",
	5: "Bardzo zły"
};

alfy.fetch("http://powietrze.gios.gov.pl/pjp/current/getAQIDetailsList", {
	body: {
		param: "AQI"
	},
	maxAge: 3600
}).then(data => {
	const items = data.filter((station) => {
		let [city] = station.stationName.split(",");

		return city.toLowerCase().indexOf(alfy.input.toLowerCase()) >= 0;
	});

	const res = items.map(station => {
		const subtitle = Object.keys(station.values).reduce((prev, key) => {
			return `${prev}; ${key} - ${station.values[key]}`;
		}, aqiFormats[station.aqIndex]);
		return {
			title: station.stationName,
			subtitle: subtitle,
			arg: `http://powietrze.gios.gov.pl/pjp/current/station_details/chart/${station.stationId}`,
			icon: {
				"path": `./${station.aqIndex}.jpg`
			}
		}
	});

	if (!res.length) {
		res.push({
			title: "No data",
			subtitle: "City you provided is invalid or it has no monitoring station",
			valid: false
		});
	}

	alfy.output(res);
});