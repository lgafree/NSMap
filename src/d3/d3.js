import * as d3 from 'd3'
import { writable } from 'svelte/store'

export let openModal = writable()
export let selectedMunicipalityName = writable()
export let selectedBrgyName = writable()
export let selectedBrgy = writable()

function drawBrgys(filePath) {
	const features = filePath.features
	const svg = d3.select('#svg-container')
	const pathGenerator = d3.geoPath()

	svg
		.selectAll()
		.data(features)
		.join('path')
		.attr('d', pathGenerator)
		.attr('id', (d) => {
			const inputString = `${d.properties.NAME_3} ${d.properties.NAME_2}`

			// Manually replace Unicode escape sequences with ñ
			const convertedString = inputString.replace(/\u00c3/g, '').replace(/\u00b1/g, 'ñ')
			//replace space with dash
			return `path-${`${convertedString}`.toLowerCase().replace(/ /g, '-')}`
		})

		.style('fill', 'white')
		.style('stroke', 'black')
		.style('stroke-width', 0.0005)
		.on('click', (event, d) => {
			document.body.style.transform = 'scale(1)'
			openModal.set(true)
			// selectedCoord.set(d.properties)
			selectedMunicipalityName.set(d.properties.NAME_2)
			selectedBrgyName.set(d.properties.NAME_3)
			selectedBrgy.set(event.target.id)
		})

	//Center the map on load
	// Initialize variables to track the bounding box
	let left = Infinity
	let right = -Infinity
	let top = Infinity
	let bottom = -Infinity
	const margin = 0.05

	// Iterate through each path to calculate the bounding box
	svg.selectAll('path').each(function () {
		const bbox = this.getBBox()
		left = Math.min(left, bbox.x)
		right = Math.max(right, bbox.x + bbox.width)
		top = Math.min(top, bbox.y)
		bottom = Math.max(bottom, bbox.y + bbox.height)
	})

	left -= margin
	right += margin

	// Calculate the width and height of the viewBox
	const viewBoxWidth = right - left
	const viewBoxHeight = bottom - top
	svg.attr('viewBox', `${left} ${top} ${viewBoxWidth} ${viewBoxHeight}`)

	//flip the map horizontally
	svg.attr('transform', 'scale(1, -1)')
}

export async function processJSONFiles() {
	try {
		const fileNames = import.meta.glob('../hiresBrgy/*.json')

		for (const fileName in fileNames) {
			fileNames[fileName]().then((json) => {
				drawBrgys(json)
			})
		}

		// const municipalitiesJSON = import.meta.glob('../municities-province-ph084800000.0.001.json')
		// const svg = d3.select('#svg-container')
		// const pathGenerator = d3.geoPath()
		// for (const fileName in municipalitiesJSON) {
		// 	municipalitiesJSON[fileName]().then((json) => {
		// 		svg
		// 			.selectAll()
		// 			.data(json.features)
		// 			.join('path')
		// 			.attr('d', pathGenerator)
		// 			.attr('transform', 'scale(3)')
		// 			.style('fill', 'white')
		// 			.style('stroke', 'black')
		// 			.style('stroke-width', 0.0005)

		// 		svg.attr('transform', 'scale(1, -1)')
		// 	})
		// }
	} catch (error) {
		console.error('Error loading JSON files:', error)
	}
}
