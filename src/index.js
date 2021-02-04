
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

  if (data1 && data2) {
    // the data objects get altered below, so
    // we must retain the stations' names now
    const station1 = data1.station
    const station2 = data2.station

    data1 = data1.timeSeries
    data2 = data2.timeSeries
    var temp1 = []
    var time1 = []
    for (var i = 0; i < data1.length; i++) {
      for (var j = 0; j < data1[i].parameters.length; j++) {
        if (data1[i].parameters[j].name == "t") {
          time1.push(data1[i].validTime.slice(0, 16).replace('T', ', '))
          temp1.push(data1[i].parameters[j].values[0])
        }
      }
    }
    var temp2 = []
    var time2 = []
    for (var i = 0; i < data2.length; i++) {
      for (var j = 0; j < data2[i].parameters.length; j++) {
        if (data2[i].parameters[j].name == "t") {
          time2.push(data2[i].validTime.slice(0, 16).replace('T', ', '))
          temp2.push(data2[i].parameters[j].values[0])
        }
      }
    }

    var table = ""
    for (var i = 0; i < temp1.length; i++) {

      var box1 = "<div style='width:" + (temp1[i] + 20) / 60 * 100 + "%; height: 10px; position: relative; background: purple;'>"
      var box2 = "<div style='width:" + (temp2[i] + 20) / 60 * 100 + "%; height: 10px; position: relative; background: blue;'>"

      box1 += "<div style='position: absolute; left: 100%; bottom: 0; font-size: 11px'>" + temp1[i]
      box2 += "<div style='position: absolute; left: 100%; bottom: 0; font-size: 11px'>" + temp2[i]

      table += "<tr><td rowspan=2>" + time1[i] + "</td><td>" + box1 + "</td></tr>"
      table += "<tr><td style='width: 10cm'>" + box2 + "</td></tr>"
    }
    table = "<table>" + table + "</table>"

    html += table

    // we don't need the API data anymore at this point.
    // we can overwrite the data variables with the name
    // of the stations to persist them outside this block
    data1 = station1
    data2 = station2
  }

  $("#main").innerHTML = html
  // update the select boxes values.
  // if this is a data view, both select boxes
  // are edited to reflect the compared cities.
  // I am using a ternary operator and the comma operator here for brevity.
  $("#stat2").value = data1 && data2 ? ($("#stat1").value = data1, data2) : "Umeå"

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
