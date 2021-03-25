// Documentation: https://free.currencyconverterapi.com/
const ACCESS_KEY = "44f0e557dfbeaab5960a"
const BASE_URL = "https://free.currconv.com"

let showRate = document.getElementById('showRate'); // １行目のライン

let fcs = document.getElementById("fcs"); // シンボル
let tcs = document.getElementById("tcs");

let transForm = document.getElementById('trans'); // trigger button
let fromInput = document.getElementById('from-input');
let fromSelect = document.getElementById('from-select');
let toInput = document.getElementById('to-input');
let toSelect = document.getElementById('to-select');

let switchButton = document.getElementById("switch");

// START: Main current currencies /////////////////////////////////////////////////////
const converter = (from, to, amount) => {
	let url = `${BASE_URL}/api/v7/convert?q=${from}_${to},${to}_${from}&compact=ultra&apiKey=${ACCESS_KEY}`;
	url = "converter.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			allCurrencies(from, to, data);
			HistoricalData(from, to, "2021-03-14", "2021-03-22");

			toInput.value = (fromInput.value * data.CAD_JPY).toFixed(2); //                   あとで治す
		})
}
// END: Main current currencies /////////////////////////////////////////////////////

// START: List of all currencies /////////////////////////////////////////////////////
const allCurrencies = (from, to, firstFunction) => {
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

			let defaultNum = 1;
			let fromc = from;
			let toc = to;
			let fromCurrencySymbol = data.results[fromc].currencySymbol;
			let toCurrencySymbol = data.results[toc].currencySymbol;
			let fromCurrencyId = data.results[fromc].id;
			let toCurrencyId = data.results[toc].id;

			showRate.innerHTML = `${fromCurrencySymbol}${(defaultNum).toFixed(2)} ${fromCurrencyId} = ${toCurrencySymbol}${(firstFunction.CAD_JPY).toFixed(4)} ${toCurrencyId}`;
			// (defaultNum).toLocaleString('en-CA', {style:'currency', currency: 'CAD', currencyDisplay: "code"}) -> CAD 1.00
			// (firstF.CAD_JPY).toLocaleString('ja-JP', {style:'currency', currency: 'JPY', currencyDisplay: "code"}) -> JPY 87
			// "1 CAD $ = 0.839 JPY"

			fcs.innerHTML = fromCurrencySymbol;
			tcs.innerHTML = toCurrencySymbol;
		})
}
// END: List of all currencies /////////////////////////////////////////////////////

// START: Historical Data (Experimental, Date Range) ////////////////////////////////////
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
			// １週間分のデータ
		})
}
// END: Historical Data (Experimental, Date Range) ////////////////////////////////////


// START: current date and time //////////////////////////////////////////////////////////////////////////////////////
let now = new Date();

function LoadProc() {
	var target = document.getElementById("DateTimeDisp");

	var Year = now.getFullYear();
	var Month = now.getMonth() + 1;
	var Date = now.getDate();
	var Hour = now.getHours();
	var Min = now.getMinutes();
	var Sec = now.getSeconds();

	target.innerHTML = `Updated: ${Hour}:${Min}:${Sec}, ${Date}/${Month}/${Year}`;
}
// END: current date and time //////////////////////////////////////////////////////////////////////////////////////

// START: graph of current chart //////////////////////////////////////////////////////////////////////////////////////
// Documentation: https://developers.google.com/chart/interactive/docs/gallery/linechart
// Visualization API と折れ線グラフ用のパッケージのロード
google.charts.load('current', {
	'packages': ['corechart']
});
// Google Visualization API ロード時のコールバック関数の設定
google.charts.setOnLoadCallback(drawChart);
// グラフ作成用のコールバック関数
function drawChart() {
	// データテーブルの作成
	var data = google.visualization.arrayToDataTable([
		['Date', 'CAD-JPY'],
		// [data.CAD_JPY, data.CAD_JPY.2021-03-14],
		['03-16', 87.468623],
		['03-18', 87.622879],
		['03-20', 87.869315]
	]);
	// グラフのオプションを設定
	var options = {
		// title: 'Updated: 1:13 p.m., Mar 24, 2021',
		curveType: 'function',
		legend: {
			position: 'bottom'
		}
	};
	// LineChart のオブジェクトの作成
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
	// データテーブルとオプションを渡して、グラフを描画
	chart.draw(data, options);
}
// END: graph of current chart ////////////////////////////////////////////////////////////////////////////////////////////


// update data every 2 mins
// let setC;
// let reloadDisplay = (v) => {
// 	setC = setTimeout(function () {
// 		getResults(v);
// 		reloadDisplay(v);
// 	}, 120000);
// }

// START: switch button //////////////////////////////////////////////////////////////
let switchFunc = () => {
	let from = fromSelect.value;
	let to = toSelect.value;
	// let fromAmount = fromInput.value;
	// let toAmount = toInput.value;
	let fromCurrencySymbol = fcs.innerHTML;
	let toCurrencySymbol = tcs.innerHTML;

	converter(to, from, toInput.value);
	toSelect.value = from;
	fromSelect.value = to;
	// fromInput.value = toAmount;
	// toInput.value = fromAmount;
	fcs.innerHTML = toCurrencySymbol;
	tcs.innerHTML = fromCurrencySymbol;
}
// END: switch button //////////////////////////////////////////////////////////////

// START: submit event ////////////////////////////////////////////////////////////////
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
// END: submit event ////////////////////////////////////////////////////////////////


// START: first loaded (default) ///////////////////////////////////////////////////
$(document).ready(() => {
	converter("CAD", "JPY", 0);
})
// END: first loaded (default) ///////////////////////////////////////////////////