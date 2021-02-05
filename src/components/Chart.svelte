<script>
  import { HeatmapChart } from '@toast-ui/chart'
  import { onMount } from 'svelte'

  export let data
  let el

  const firstStationName = data ? data.categories.x[0] : ''
  const secondStationName = data ? data.categories.x[1] : ''

  // Chart Data
  const options = {
    chart: {
      title: {
        text: `Weather Comparison between ${firstStationName} and ${secondStationName}`,
        offsetX: 2,
      },
      width: 750,
      height: 2500,
      animation: false,
    },
    xAxis: {
      margin: 40,
    },
    yAxis: {
      width: 120,
    },
    series: {
      dataLabels: { visible: true },
    },
    tooltip: {
      formatter: value => {
        const temp = Number(value)
        let icon = '☀️'
        if (temp < 0) {
          icon = '❄️'
        } else if (temp > 25) {
          icon = '🔥'
        }

        return `${icon} ${value} ℃`
      },
    },
    legend: {
      align: 'top',
      width: 400,
    },
    exportMenu: {
      visible: false,
    },
  }

  onMount(() => {
    if (data) {
      new HeatmapChart({ el, data, options })
    }
  })
</script>

<div class="inline-flex justify-center mb-12" bind:this="{el}"></div>

<style global>
  @import '@toast-ui/chart/dist/toastui-chart.min.css';
</style>
