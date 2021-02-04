import { HeatmapChart } from "@toast-ui/chart"

var stations = {
  "Uppsala": [59.86, 17.64],
  "Umeå": [63.8, 20.26],
  "Stockholm": [59.33,18.06],
  "Lund": [55.7,13.12],
  "Kiruna": [67.967, 20.309],
}
/**
 * Generates the current view's HTML code.
 * 
 * @param  {*} [data1] dataset of the first city
 * @param  {*} [data2] dataset of the second city
 * @param  {string} [selectedId] focused select box ID
 */
function main(data1, data2, selectedId) {
  var $ = document.querySelector.bind(document)

  var html = ""

  for (var stat in stations) {
    html += "<option value=" + stat + ">" + stat + "</option>"
  }
  html = "Compare <select id=stat1>" + html + "</select> and <select id=stat2>" + html + "</select>"
  html += "<button id=compare>Compare!</button>"
  html = "<p>" + html + "</p>"
  html += "<div id=chart></div>"

  $("#main").innerHTML = html

  if (data1 && data2) {
    // create an array of tuples of temperatures of both cities.
    // reduce the data of both cities to two arrays with
    // the temperatures for each city, next create an array
    // with tuples of temperatures for the chart.
    // also create an array of times from the data of the first city.

    const times = []
    const series1 = data1.timeSeries.reduce((temps, item) => {
      times.push(item.validTime.slice(0, 16).replace("T", ", "))
      const newValue = item.parameters.filter((item) => item.name == "t")
      return [...temps, newValue[0].values[0]]
    }, [])

    const series2 = data2.timeSeries.reduce((temps, item) => {
      const newValue = item.parameters.filter((item) => item.name == "t")
      return [...temps, newValue[0].values[0]]
    }, [])

    const series = series1.map((element, index) => {
      return [ element, series2[index] ]
    })

    // Chart Data
    const el = $("#chart")
    const data = {
      categories: {
        x: [data1.station, data2.station],
        y: times,
      },
      series: series,
    }
    const options = {
      chart: {
        title: `Weather Comparison between ${data1.station} and ${data2.station}`,
        width: 750,
        height: 2500,
      },
      yAxis: {
        width: 125,
      },
      series: {
        dataLabels: { visible: true },
      },
      tooltip: {
        formatter: (value, tooltipDataInfo) => {
          const temp = Number(value)
          let icon = "☀️"
          if (temp < 0) {
            icon = "❄️"
          } else if (temp > 25) {
            icon = "🔥"
          }

          return `${icon} ${value} ℃`
        },
      },
      legend: {
        align: "top",
        width: 400,
      },
    }

    new HeatmapChart({ el, data, options })
  }

  // update the select boxes values.
  // if this is a data view, both select boxes
  // are edited to reflect the compared cities.
  // I am using a ternary operator and the comma operator here for brevity.
  $("#stat2").value = data1 && data2 ? (($("#stat1").value = data1.station), data2.station) : "Umeå"

  if (selectedId) {
    $(`#${selectedId}`).focus()
  }

  $("#stat1").onchange = onchange
  $("#stat2").onchange = onchange

  function onchange() {
    // get the id of the focused select box
    const elId = this.id

    var stat1 = stations[$("#stat1").value]
    var stat2 = stations[$("#stat2").value]
    
    var request = new XMLHttpRequest();
    request.open("GET", "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + stat1[1] + "/lat/" + stat1[0] + "/data.json", true);

    request.onload = function() {
      if (request.status == 200) {
        // Success!
        var data1 = JSON.parse(request.responseText);
        request = new XMLHttpRequest();
        request.open("GET", "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + stat2[1] + "/lat/" + stat2[0] + "/data.json", true);
        // alter the returned data to also
        // include the station's name
        data1.station = $("#stat1").value

        request.onload = function() {
          if (request.status == 200) {
            var data2 = JSON.parse(request.responseText)
            // alter the returned data to also
            // include the station's name
            data2.station = $("#stat2").value
            main(data1, data2, elId) // pass the id of selected box too
          } else {
            $("#main").innerHTML += 'error!'
          }
        };

        request.onerror = function() {
          $("#main").innerHTML += 'error!'
        };

        request.send();
      } else {
        $("#main").innerHTML += 'error!'
      }
    };

    request.onerror = function() {
      $("#main").innerHTML += 'error!'
    };

    request.send();
  }
}

main()
