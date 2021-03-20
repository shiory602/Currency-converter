// // 変換を実行(日本円)
// let jpy_price1 = price1.toLocaleString('ja-JP', {style:'currency', currency: 'JPY'});

// // 変換を実行(米ドル)
// let usd_price1 = price1.toLocaleString('en-US', {style:'currency', currency: 'USD'});



// graph of current chart //////////////////////////////////////////////////////////////////////////////////////
google.charts.load('current', {
	packages: ['corechart', 'line']
});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'CAD');

	data.addRows([
		[0, 0],
		[1, 10],
		[2, 23],
		[3, 17],
		[4, 18],
		[5, 9],
		[6, 11],
		[7, 27]
	]);

	var options = {
		hAxis: {
			title: 'Month'
		},
		vAxis: {
			title: 'CAD'
		},
		backgroundColor: '#e9e9e9'
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}
// END: current chart ////////////////////////////////////////////////////////////////////////////////////////////


// Documentation: https://free.currencyconverterapi.com/
const ACCESS_KEY = "44f0e557dfbeaab5960a"
const BASE_URL = "https://free.currconv.com"

let showRate = document.getElementById('showRate');

let transForm = document.getElementById('trans'); // trigger button
let fromInput = document.getElementById('from-input');
let fromSelect = document.getElementById('from-select');
let toSelect = document.getElementById('to-select');

const transfer = (from, to, amount) => {
	let url = `${BASE_URL}/api/v7/convert?q=${from}_${to},${to}_${from}&compact=ultra&apiKey=${ACCESS_KEY}`;
	url = "transfer.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			console.log(data);

			allCurrencies(from, to, amount);
			HistoricalData(from, to, "2020-12-10", "2020-12-18");

		})
}

// List of all currencies /////////////////////////////////////////////////////
const allCurrencies = () => {
	url = `${BASE_URL}/api/v7/currencies?apiKey=${ACCESS_KEY}`;
	url = "currency.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			console.log(data);

		})
}
//////////////////////////////////////////////////////////////////////////////////

// Historical Data (Experimental, Date Range) ////////////////////////////////////
const HistoricalData = (from, to, start, end) => {
	url = `${BASE_URL}/api/v7/convert?apiKey=${ACCESS_KEY}&q=${from}_${to},${to}_${from}&compact=ultra&date=${start}&endDate=${end}`;
	url = "historicalData.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			console.log(data);
		})
}
//////////////////////////////////////////////////////////////////////////////////

// update data every 2 mins
// let setC;
// let reloadDisplay = (v) => {
// 	setC = setTimeout(function () {
// 		getResults(v);
// 		reloadDisplay(v);
// 	}, 120000);
// }


// submit event
trans.addEventListener("submit", (e) => {
	e.preventDefault();
	if (fromInput.value) {
		let amount = fromInput.value;
		let from = fromSelect.value;
		let to = toSelect.value;
		transfer(from, to, amount);
	} else {
		alert("Please fill out the form.")
	}
});


// first loaded (default)
$(document).ready(() => {
	transfer("CAD", "JPY", 1);
})