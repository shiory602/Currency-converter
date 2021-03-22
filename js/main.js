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


let fcs = document.getElementById("fcs");
let tcs = document.getElementById("tcs");

let transForm = document.getElementById('trans'); // trigger button
let fromInput = document.getElementById('from-input');
let fromSelect = document.getElementById('from-select');
let toInput = document.getElementById('to-input');
let toSelect = document.getElementById('to-select');

let switchButton = document.getElementById("switch");

const converter = (from, to, amount) => {
	let url = `${BASE_URL}/api/v7/convert?q=${from}_${to},${to}_${from}&compact=ultra&apiKey=${ACCESS_KEY}`;
	// url = "converter.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			//console.log(data);
			allCurrencies(from, to, data);
			HistoricalData(from, to, "2021-03-14", "2021-03-22");


			// fromInput.innerHTML = (fromInput.value).toFixed(2);
			toInput.value = (amount * data.CAD_JPY).toFixed(2);
		})
}

// List of all currencies /////////////////////////////////////////////////////
const allCurrencies = (from, to, firstF) => {
	url = `${BASE_URL}/api/v7/currencies?apiKey=${ACCESS_KEY}`;
	// url = "currency.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			let defaultNum = 1;
			// let num = parseFloat(fromInput.value);
			
			showRate.innerHTML = `${data.results.CAD.currencySymbol}${(defaultNum).toFixed(2)} ${data.results.CAD.id} = ${data.results.JPY.currencySymbol}${(firstF.CAD_JPY).toFixed(4)} ${data.results.JPY.id}`;
			// (defaultNum).toLocaleString('en-CA', {style:'currency', currency: 'CAD', currencyDisplay: "code"}) -> CAD 1.00
			// (firstF.CAD_JPY).toLocaleString('ja-JP', {style:'currency', currency: 'JPY', currencyDisplay: "code"}) -> JPY 87
			// "1 CAD $ = 0.839 JPY"

			// switch (from to)    //  通貨の部分だけparameterを使いたい　もしくはif/switchしか方法がない？
			fcs.innerHTML = data.results.CAD.currencySymbol; //TODO: pass the value from variable
			tcs.innerHTML = data.results.JPY.currencySymbol; //TODO: pass the value from variable

		
			const arrKeys = Object.keys(data.results);
			const rates = data.results;
			//console.log(rates);
			// arrKeys.map(item => {
			// 	return html += `<option value=${item}>${item}</option>`;
			// });
			// for(let i = 0; i < select.length; i++) {
			// 	select[i].innerHTML = html;
			// }

		})
}
//////////////////////////////////////////////////////////////////////////////////

// Historical Data (Experimental, Date Range) ////////////////////////////////////
const HistoricalData = (from, to, start, end) => {
	url = `${BASE_URL}/api/v7/convert?apiKey=${ACCESS_KEY}&q=${from}_${to},${to}_${from}&compact=ultra&date=${start}&endDate=${end}`;
	// url = "historicalData.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
		//	console.log(data);
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

// switch button
switchButton.addEventListener("click", (e) => {
	e.preventDefault();
	let amount = fromInput.value;
	let to = fromSelect.value;
	let from = toSelect.value;
	converter(from, to, amount);
});


// submit event
trans.addEventListener("submit", (e) => {
	e.preventDefault();
	if (fromInput.value) {
		let amount = fromInput.value;
		let from = fromSelect.value;
		let to = toSelect.value;
		converter(from, to, amount);
	} else {
		alert("Please fill out the form.")
	}
});


// first loaded (default)
$(document).ready(() => {
	converter("CAD", "JPY", 1);
})