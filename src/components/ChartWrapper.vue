<template>
  <div>
    <h1 style="font-size:5vmin">UK General Election Data Visualiser</h1>
    <div style="position:relative; height:100vmin; width:70vmin; margin:auto;">
      <line-chart :chart-data="datacollection" :options="options"/>
      <label>Political Party: </label>
      <select v-model="party">
        <option value="labour">Labour</option>
        <option value="tories">Tories</option>
        <option value="snp">SNP</option>
        <option value="libdems">LibDems</option>
        <option value="ukip">UKIP</option>
        <option value="brexit">UKIP/Brexit Party</option>
        <option value="toriesxbrexit">Tories + UKIP/BP</option>
      </select>
      <br>
      <label>EU Referendum Vote: </label>
      <select v-model="euvote">
        <option value="all">-disabled-</option>
        <option value="remain">>50% Remain</option>
        <option value="leave">>50% Leave</option>
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
        },
        scales: {
          yAxes: [{
            ticks:{
              min:0,
              max:100
            },
            scaleLabel: {
              display: true,
              labelString: 'Constituency vote %'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Year of UK General Election'
            }
          }],
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem,data) =>
              tooltipItem && data ?
                `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel}%`:
                ''
          },
        },
      },
      party: "labour",
      cols: {
        labour: [["Lab 2015"],["Lab 2017"],["Lab"]],
        tories: [["Con 2015"],["Con 2017"],["Con"]],
        snp: [["SNP 2015"],["SNP 2017"],["SNP"]],
        libdems: [["LDem 2015"],["LDem 2017"],["LDem"]],
        ukip: [["UKIP 2015"],["UKIP 2017"],["UKIP"]],
        brexit: [["UKIP 2015"],["UKIP 2017"],["UKIP","Brex"]],
        toriesxbrexit: [["Con 2015","UKIP 2015"],["Con 2017","UKIP 2017"],["Con","UKIP","Brex"]],
      },
      euvote: "all",
      euvotelogic: {
        all: () => true,
        remain: (constituency) => constituency["Leave vote (%) 2016"]<50,
        leave: (constituency) => constituency["Leave vote (%) 2016"]>50,
      },
      bgColor: {
        labour: "rgb(255,0,0)",
        tories: "rgb(0,0,255)",
        snp: "rgb(255,226,0)",
        libdems: "rgb(255,174,66)",
        ukip: "rgb(162,40,255)",
        brexit: "rgb(66,227,245)",
        toriesxbrexit: "rgb(93,66,245)",
      },
      lineColor: {
        labour: "rgba(255,0,0,0.1)",
        tories: "rgba(0,0,255,0.1)",
        snp: "rgba(255,226,0,0.4)",
        libdems: "rgba(255,174,66,0.1)",
        ukip: "rgba(162,40,255,0.1)",
        brexit: "rgba(66,227,245,0.1)",
        toriesxbrexit: "rgba(93,66,245,0.1)",
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
      }).then(this.fillData)
    },
    fillData () {
      this.datacollection = {
        labels: ["2015","2017","2019"],
        datasets: Array.from(
          this.dataSource.filter(this.euvotelogic[this.euvote]),
          (constituency) => ({
            label: constituency["Constituency"],
            backgroundColor: this.bgColor[this.party],
            borderColor: this.lineColor[this.party],
            fill: false,
            data: this.cols[this.party].map((cols) =>
              cols.reduce((colSum, col) => colSum + parseFloat(constituency[col]),0)
            )
          })
        )
      }
    }
  },

  watch: {
    party() {
      this.fillData();
    },
    euvote() {
      this.fillData();
    }
  }
}

</script>