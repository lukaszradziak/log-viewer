import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

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

  const rows = lines.map(line => {
    return line
      .trim()
      .split(separator)
      .map(row => {
        return parseFloat(row) || 0
      })
  })

  return {
		labels,
		rows
	}
}

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

let graphs = []

const createGraph = (id, colors, label, series) => {
  return Highcharts.chart(id, {
    chart: {
      zoomType: 'x',
      height: 700,
    },
    rangeSelector: {
      selected: 2
  },
    exporting: {
      enabled: true
    },
    title: {
      text: 'CSV'
    },
    colors,
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

  const label = labels[0];
  const index = 0;

  const $container = document.createElement('div')
  $container.id = `graph-${index}`
  domElement.appendChild($container)

  let series = [{
    data: rows.map(row => row[index] || 0),
    lineWidth: 0.5,
    name: label,
  }]

  let colors = [];
  const maxColors = 20
  colors = [hslToHex(index%maxColors/maxColors*360, 100, 50)]

  if(index === 0){
    series = labels.map((label, index) => ({
      data: rows.map(row => row[index] || 0),
      lineWidth: 0.5,
      name: label,
      visible: index === 0,
    }))

    colors = [...Array(maxColors)].map((element, index) => {
      return hslToHex(index%maxColors/maxColors*360, 100, 50)
    })
  }

  graphs.push(
    createGraph($container.id, colors, label, series)
  )
}