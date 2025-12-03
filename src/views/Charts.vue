<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const ROOT_PATH = 'https://echarts.apache.org/examples'
type EchartsOption = echarts.EChartsOption

// 使用 ref 来获取 DOM 元素
const chartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null

const upColor = '#00da3c'
const downColor = '#ec0000'

const splitData = (rawData: number[][]) => {
  const categoryData: string[] = []
  const values: number[][] = []
  const volumes: [number, number, number][] = []

  for (let i = 0; i < rawData.length; i++) {
    // 确保数据存在
    if (!rawData[i] || rawData[i].length < 5) continue
    
    categoryData.push(rawData[i][0].toString())
    values.push([rawData[i][1], rawData[i][2], rawData[i][3], rawData[i][4]])
    volumes.push([i, rawData[i][4], rawData[i][1] > rawData[i][2] ? 1 : -1])
  }

  return { categoryData, values, volumes }
}

const calculateMA = (dayCount: number, data: { values: number[][] }) => {
  const result: (number | string)[] = []
  
  for (let i = 0; i < data.values.length; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1]
    }
    result.push(+(sum / dayCount).toFixed(3))
  }
  
  return result
}

// 使用 fetch 替代 jQuery
const fetchData = async () => {
  try {
    const response = await fetch(`/data/stock-DJI.json`)
    const rawData = await response.json()
    
    const data = splitData(rawData)
    
    if (!myChart || !data.values.length) return
    
    const option: EchartsOption = {
      animation: false,
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: { color: '#000' }
      },
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: { backgroundColor: '#777' }
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: false },
          brush: { type: ['lineX', 'clear'] }
        }
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: { colorAlpha: 0.1 }
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          { value: 1, color: downColor },
          { value: -1, color: upColor }
        ]
      },
      grid: [
        { left: '10%', right: '8%', height: '50%' },
        { left: '10%', right: '8%', top: '63%', height: '16%' }
      ],
      xAxis: [
        {
          type: 'category',
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: { z: 100 }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        { scale: true, splitArea: { show: true } },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 98, end: 100 },
        { show: true, xAxisIndex: [0, 1], type: 'slider', top: '85%', start: 98, end: 100 }
      ],
      series: [
        {
          name: 'Dow-Jones index',
          type: 'candlestick',
          data: data.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          }
        },
        // { name: 'MA5', type: 'line', data: calculateMA(5, data), smooth: true, lineStyle: { opacity: 0.5 } },
        // { name: 'MA10', type: 'line', data: calculateMA(10, data), smooth: true, lineStyle: { opacity: 0.5 } },
        // { name: 'MA20', type: 'line', data: calculateMA(20, data), smooth: true, lineStyle: { opacity: 0.5 } },
        // { name: 'MA30', type: 'line', data: calculateMA(30, data), smooth: true, lineStyle: { opacity: 0.5 } },
        { name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: data.volumes }
      ]
    }
    
    myChart.setOption(option, true)
    
    // 可选：添加初始的刷选效果
    myChart.dispatchAction({
      type: 'brush',
      areas: [{ brushType: 'lineX', coordRange: ['2016-06-02', '2016-06-20'], xAxisIndex: 0 }]
    })
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
  }
}

// 在组件挂载后初始化
onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value)
    fetchData()
  }
})

// 组件销毁前清理
onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<template>
  <main>
    <!-- 使用 ref 绑定替代 id -->
    <div ref="chartRef" style="width: 100%; height: 600px;"></div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}
</style>