<template>
  <div>
    <h1 style="font-size:5vmin">UK General Election Data Visualiser</h1>
    <div style="position:relative; height:100vmin; width:70vmin; margin:auto;">
      <line-chart :chart-data="datacollection" :options="options"/>
      <select v-model="party">
        <option value="labour">Labour</option>
        <option value="tories">Tories</option>
        <option value="snp">SNP</option>
        <option value="libdems">LibDems</option>
        <option value="ukip">UKIP</option>
        <!--<option value="brexit">UKIP/Brexit Party</option>-->
        <!--<option value="toriesxbrexit">Tories + UKIP/BP</option>-->
      </select>
    </div>
  </div>
</template>

<script>
import LineChart from './Chart.vue'
import * as d3 from 'd3'

export default {
  name: 'ChartWrapper',
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: {},
      options: {
        legend: {
            display:false
        }
      },
      party: "labour",
      cols: {
        labour: ["Lab 2015","Lab 2017","Lab"],
        tories: ["Con 2015","Con 2017","Con"],
        snp: ["SNP 2015","SNP 2017","SNP"],
        libdems: ["LDem 2015","LDem 2017","LDem"],
        ukip: ["UKIP 2015","UKIP 2017","UKIP"]
      },
      bgColor: {
        labour: "rgb(255,0,0)",
        tories: "rgb(0,0,255)",
        snp: "rgb(255,226,0)",
        libdems: "rgb(255,174,66)",
        ukip: "rgb(162,40,255)",
      },
      lineColor: {
        labour: "rgba(255,0,0,0.1)",
        tories: "rgba(0,0,255,0.1)",
        snp: "rgba(255,226,0,0.4)",
        libdems: "rgba(255,174,66,0.1)",
        ukip: "rgba(162,40,255,0.1)",
      },
      dataSource: {},
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      d3.csv("data.csv").then((geData) => {
        this.dataSource = geData;
      }).then(this.fillData);
    },
    fillData () {
      this.datacollection = {
        labels: ["2015","2017","2019"],
        datasets: Array.from(this.dataSource,(constituency) => ({
          label: constituency["Constituency"],
          backgroundColor: this.bgColor[this.party],
          borderColor: this.lineColor[this.party],
          fill: false,
          data: this.cols[this.party].map((col) => constituency[col])
        }))
      }
    }
  },
  watch: {
    party() {
      this.fillData();
    }
  }
}

</script>