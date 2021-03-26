// Documentation: https://free.currencyconverterapi.com/
const ACCESS_KEY = "44f0e557dfbeaab5960a"
const BASE_URL = "https://free.currconv.com"

let showRate = document.querySelector('#showRate'); // １行目のライン

let fcs = document.querySelector("#fcs"); // シンボル
let tcs = document.querySelector("#tcs");

let transForm = document.querySelector('#trans'); // trigger button
let fromInput = document.querySelector('#input1');
let toInput = document.querySelector('#input2');
let select = document.querySelectorAll('select');
let fromSelect = document.querySelector('#from-select');
let toSelect = document.querySelector('#to-select');
let html = "";

let switchButton = document.querySelector("#switch");

// START: Main current currencies /////////////////////////////////////////////////////
const converter = (from, to) => {
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
			allCurrencies(from, to, data);
			HistoricalData(from, to, "2021-03-14", "2021-03-22");
		})
}
// END: Main current currencies /////////////////////////////////////////////////////

// START: List of all currencies /////////////////////////////////////////////////////
const allCurrencies = (from, to, rate) => {
	let url = `${BASE_URL}/api/v7/currencies?apiKey=${ACCESS_KEY}`;
	// url = "currency.json";
	fetch(url)
		.then(res => {
			if (res.status !== 200) {
				alert(`We have an error ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			console.log(data);
			console.log(rate);

			let defaultNum = 1;
			let fromc = from;
			let toc = to;
			let fromCurrencySymbol = data.results[fromc].currencySymbol;
			let toCurrencySymbol = data.results[toc].currencySymbol;
			let currencyName = data.results[fromc].currencyName;
			let fromTo = `${from}_${to}`;
			let fromToRate = rate[fromTo];

			// 通貨 options --------------------------------------------------------------------
			if (select[0].innerHTML === "") {
				let arrKeys = Object.keys(data.results);
				arrKeys.sort();
				arrKeys.map(item => {
					return html += `<option value="${item}" title="${currencyName}">${item}</option>`
				});
				for (let i = 0; i < select.length; i++) {
					select[i].innerHTML = html;
				}
				select[0].value = "CAD";
				select[1].value = "JPY";
			}
			// ---------------------------------------------------------------------------------


			
			// input --------------------------------------------------------------------------
			
			fromInput.value = (defaultNum).toFixed(4);
			toInput.value = (fromInput.value * fromToRate).toFixed(4);
			// ---------------------------------------------------------------------------------
			

			showRate.innerHTML = `${fromCurrencySymbol}${(defaultNum).toFixed(4)} ${from} = ${toCurrencySymbol}${(fromToRate).toFixed(4)} ${to}`;
			// "1 CAD $ = 0.839 JPY"

			fcs.innerHTML = fromCurrencySymbol;
			tcs.innerHTML = toCurrencySymbol;

		})
}
// END: List of all currencies /////////////////////////////////////////////////////

// START: Historical Data (Experimental, Date Range) ////////////////////////////////////
const HistoricalData = (from, to, start, end) => {
	let url = `${BASE_URL}/api/v7/convert?apiKey=${ACCESS_KEY}&q=${from}_${to},${to}_${from}&compact=ultra&date=${start}&endDate=${end}`;
	// url = "historicalData.json";
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

	target.innerHTML = `Graph updated: ${Hour}:${Min}:${Sec}, ${Date}/${Month}/${Year}`;
}
// END: current date and time //////////////////////////////////////////////////////////////////////////////////////

// START: graph of current chart //////////////////////////////////////////////////////////////////////////////////////
// Documentation: https://developers.google.com/chart/interactive/docs/gallery/linechart
// get API data: https://developers.google.com/chart/interactive/docs/reference#arraytodatatable
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
		['03-15', 87.369315],
		['03-16', 87.468623],
		['03-18', 87.622879],
		['03-20', 87.869315]
	]);
	// グラフのオプションを設定
	var options = {
		// title: 'Updated: 1:13 p.m., Mar 24, 2021',
		// curveType: 'function',
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


// // update data every 30 mins
// let setC;
// let reloadDisplay = (v) => {
// 	setC = setTimeout(function () {
// 		getResults(v);
// 		reloadDisplay(v);
// 	}, 180000);
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
	converter("CAD", "JPY");
})
// END: first loaded (default) ///////////////////////////////////////////////////