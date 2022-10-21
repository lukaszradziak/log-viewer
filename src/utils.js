import Highcharts from 'highcharts';

export const readFileContent = (file) => {
	const fileReader = new FileReader()

	return new Promise((resolve, reject) => {
		fileReader.onerror = () => {
			fileReader.abort()
			reject('Problem with opening input file.')
		}

		fileReader.onload = () => {
			resolve(fileReader.result)
		}

		fileReader.readAsText(file)
	})
}

export const csvToData = (content) => {
  const separator = ','
  const lines = content.split('\n')

  const labels = lines
    .shift()
    .trim()
    .split(separator)
    .filter(row => row)

  const rows = lines.map(line => {
    return line
      .trim()
      .split(separator)
      .filter(row => row)
      .map(row => {
        return parseFloat(row);
      })
  })

  return {
		labels,
		rows
	}
}

let graphs = []

const createGraph = (id, label, series) => {
  return Highcharts.chart(id, {
    chart: {
      zoomType: 'x',
      height: 700,
      events: {
        selection: function(){
          setTimeout(() => {
            graphs.forEach((graph) => {
              graph.xAxis[0].setExtremes(this.xAxis[0].min, this.xAxis[0].max);
            })
          }, 100)
        }
      },
    },
    exporting: {
      enabled: false
    },
    title: {
      text: label
    },
    colors: ['#'+Math.floor(Math.random()*16777215).toString(16)],
    tooltip: {
      valueDecimals: 2,
      split: true,
    },
    series
  })
}

export const generateGraph = (domElement, labels, rows) => {
	domElement.innerHTML = ''
  graphs = []

  labels.forEach((label, index) => {
    const $container = document.createElement('div')
    $container.id = `graph-${index}`
    domElement.appendChild($container)

    let series = [{
      data: rows.map(row => row[index]),
      lineWidth: 0.5,
      name: label,
    }]

    if(index === 0){
      series = labels.map((label, index) => ({
        data: rows.map(row => row[index]),
        lineWidth: 0.5,
        name: label,
        visible: index === 0,
      }))
    }

    graphs.push(
      createGraph($container.id, label, series)
    )
  })
}