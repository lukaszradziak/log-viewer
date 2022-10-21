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

export const generateGraph = (labels, rows) => {
	console.log('generateGraph', labels, rows)
}