<script>
  import Chart from '../components/Chart.svelte'
  import axios from 'axios'

  const stations = [
    { id: 0, name: 'Uppsala', value: [59.86, 17.64] },
    { id: 1, name: 'Umeå', value: [63.8, 20.26] },
    { id: 2, name: 'Stockholm', value: [59.33, 18.06] },
    { id: 3, name: 'Lund', value: [55.7, 13.12] },
    { id: 4, name: 'Kiruna', value: [67.967, 20.309] },
  ]

  let [firstStation, previousFirstStation, secondStation, previousSecondStation] = [0, 1, 1, 0]
  let promise

  $: stat1 = prepareStations({ stations: stations, offItem: secondStation })
  $: stat2 = prepareStations({ stations: stations, offItem: firstStation })

  const prepareChartData = async ({ stations, firstStation, secondStation }) => {
    const stat1Name = stations[firstStation].name
    const stat1Lat = stations[firstStation].value[0]
    const stat1Lon = stations[firstStation].value[1]

    const stat2Name = stations[secondStation].name
    const stat2Lat = stations[secondStation].value[0]
    const stat2Lon = stations[secondStation].value[1]

    const chartData = await axios
      .all([
        axios.get(
          `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${stat1Lon}/lat/${stat1Lat}/data.json`
        ),
        axios.get(
          `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${stat2Lon}/lat/${stat2Lat}/data.json`
        ),
      ])
      .then(
        axios.spread((firstResult, secondResult) => {
          // Both requests are now complete

          // create an array of tuples of temperatures of both cities.
          // reduce the data of both cities to two arrays with
          // the temperatures for each city, next create an array
          // with tuples of temperatures for the chart.
          // also create an array of times from the data of the first city.
          const times = []
          const series1 = firstResult.data.timeSeries.reduce((temps, item) => {
            times.push(item.validTime.slice(0, 16).replace('T', ', '))
            const newValue = item.parameters.filter(item => item.name == 't')
            return [...temps, newValue[0].values[0]]
          }, [])

          const series2 = secondResult.data.timeSeries.reduce((temps, item) => {
            const newValue = item.parameters.filter(item => item.name == 't')
            return [...temps, newValue[0].values[0]]
          }, [])

          const series = series1.map((element, index) => {
            return [element, series2[index]]
          })

          return {
            categories: {
              x: [stat1Name, stat2Name],
              y: times,
            },
            series: series,
          }
        })
      )
      .catch(error => {
        throw new Error(error)
      })

    return chartData
  }

  const prepareStations = ({ stations = [], offItem }) =>
    stations.filter(item => item.id != offItem).map(item => item.id)

  // get the data from the API
  $: if (firstStation != previousFirstStation || secondStation != previousSecondStation) {
    previousFirstStation = firstStation
    previousSecondStation = secondStation

    promise = prepareChartData({ stations, firstStation, secondStation })
  }
</script>

<h1 class="mt-12 text-5xl font-semibold text-center">Weather station</h1>
<h2 class="mt-2 text-xl text-center">Here you can see weather prognosis from SMHI.</h2>

<div class="m-auto my-8 font-serif text-center max-w-7xl">
  <p class="inline-flex space-x-4 text-lg">
    <span>Compare</span>
    <select id="stat1" bind:value="{firstStation}">
      {#each stat1 as index (index)}
        <option value="{stations[index].id}">{stations[index].name}</option>
      {/each}
    </select>
    <span>and</span>
    <select id="stat2" bind:value="{secondStation}">
      {#each stat2 as index (index)}
        <option value="{stations[index].id}">{stations[index].name}</option>
      {/each}
    </select>
  </p>

  {#key promise}
    {#await promise}
      <p class="mt-8 text-xl">...waiting</p>
    {:then data}
      <div class="mt-12">
        <Chart data="{data}" />
      </div>
    {:catch error}
      <!-- promise was rejected -->
      <p class="text-red-500">Something went wrong: {error.message}</p>
    {/await}
  {/key}
</div>
