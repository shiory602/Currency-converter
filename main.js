// // 変換を実行(日本円)
// let jpy_price1 = price1.toLocaleString('ja-JP', {style:'currency', currency: 'JPY'});

// // 変換を実行(米ドル)
// let usd_price1 = price1.toLocaleString('en-US', {style:'currency', currency: 'USD'});



// graph of current chart //////////////////////////////////////////////////////////////////////////////////////
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'USD');

      data.addRows([
        [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 80]
      ]);

      var options = {
        hAxis: {
          title: 'Month'
        },
        vAxis: {
          title: 'USD'
        },
        backgroundColor: '#f1f8e9'
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
// END: current chart ////////////////////////////////////////////////////////////////////////////////////////////

// Documentation: https://currencylayer.com/documentation
let showRate = document.getElementById('showRate');

const transfer = (from, to, amount) => {
	const ACCESS_KEY = "44f0e557dfbeaab5960a"
	const BASE_URL = "https://free.currconv.com"
	let url = `${BASE_URL}/api/v7/convert?q=${from}_${to},${to}_${from}&compact=ultra&apiKey=${ACCESS_KEY}`;
	// let url = `http://api.currencylayer.com/live?access_key=${ACCESS_KEY}&currencies=USD,EUR,GBP,AUD,NGN,JPN`;
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


trans.addEventListener("submit", (e) => {
	e.preventDefault();
	transfer("CAD", "GBP", 1000);
});