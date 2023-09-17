// let isPinching = false
// let initialPinchDistance = 0
// let initialScale = 1
// const originalScale = 1 // Set the original scale here

// // Function to handle pinch-to-zoom
// export function handlePinch(event) {
// 	const svgContainer = document.getElementById('svg-container')

// 	if (event.touches.length === 2) {
// 		const touch1 = event.touches[0]
// 		const touch2 = event.touches[1]
// 		const currentPinchDistance = Math.hypot(
// 			touch1.clientX - touch2.clientX,
// 			touch1.clientY - touch2.clientY
// 		)

// 		if (!isPinching) {
// 			// Start of pinch gesture
// 			isPinching = true
// 			initialPinchDistance = currentPinchDistance
// 			initialScale = getCurrentScale(svgContainer)
// 		} else {
// 			// During pinch gesture
// 			const pinchScale = currentPinchDistance / initialPinchDistance
// 			let newScale = initialScale * pinchScale

// 			// Prevent zooming out beyond the original scale
// 			if (newScale < originalScale) {
// 				newScale = originalScale
// 			}

// 			applyZoom(newScale, svgContainer)
// 		}
// 	}
// }

// // Function to get the current scale of the SVG
// function getCurrentScale(target) {
// 	const transform = window.getComputedStyle(target).getPropertyValue('transform')
// 	const matrix = new DOMMatrix(transform)
// 	return matrix.a
// }

// // Function to apply zoom to the SVG
// function applyZoom(scale, target) {
// 	target.style.transform = `scale(1, -1) scale(${scale})`
// }

// // Function to end pinch gesture
// export function endPinch() {
// 	isPinching = false
// }

let isPinching = false
let initialPinchDistance = 0
let initialScale = 1
const originalScale = 1 // Set the original scale here

let isPanning = false
let lastTouchX = 0
let lastTouchY = 0

// Function to handle pinch-to-zoom
export function handlePinch(event) {
	const svgContainer = document.getElementById('svg-container')

	if (event.touches.length === 2) {
		const touch1 = event.touches[0]
		const touch2 = event.touches[1]
		const currentPinchDistance = Math.hypot(
			touch1.clientX - touch2.clientX,
			touch1.clientY - touch2.clientY
		)

		if (!isPinching) {
			// Start of pinch gesture
			isPinching = true
			initialPinchDistance = currentPinchDistance
			initialScale = getCurrentScale(svgContainer)
		} else {
			// During pinch gesture
			const pinchScale = currentPinchDistance / initialPinchDistance
			let newScale = initialScale * pinchScale

			// Prevent zooming out beyond the original scale
			if (newScale < originalScale) {
				newScale = originalScale
			}

			applyZoom(newScale, svgContainer)
		}
	}
}

// Function to handle panning
export function startPanning(event) {
	const svgContainer = document.getElementById('svg-container')
	if (event.touches.length === 1 && getCurrentScale(svgContainer) > originalScale) {
		isPanning = true
		lastTouchX = event.touches[0].clientX
		lastTouchY = event.touches[0].clientY
	}
}

export function performPanning(event) {
	if (isPanning) {
		const svgContainer = document.getElementById('svg-container')
		const touchX = event.touches[0].clientX
		const touchY = event.touches[0].clientY
		const deltaX = touchX - lastTouchX
		const deltaY = touchY - lastTouchY

		// Get the current viewBox attributes
		const viewBoxAttrs = svgContainer.getAttribute('viewBox').split(' ').map(parseFloat)
		let viewBoxX = viewBoxAttrs[0]
		let viewBoxY = viewBoxAttrs[1]
		const viewBoxWidth = viewBoxAttrs[2]
		const viewBoxHeight = viewBoxAttrs[3]

		// Calculate the boundaries based on the paths' bounding box
		let left = Number.MAX_VALUE
		let right = Number.MIN_VALUE
		let top = Number.MAX_VALUE
		let bottom = Number.MIN_VALUE

		svgContainer.querySelectorAll('path').forEach((path) => {
			const bbox = path.getBBox()
			left = Math.min(left, bbox.x)
			right = Math.max(right, bbox.x + bbox.width)
			top = Math.min(top, bbox.y)
			bottom = Math.max(bottom, bbox.y + bbox.height)
		})

		// Calculate the boundaries for panning
		const viewBoxMinX = left
		const viewBoxMinY = top
		const viewBoxMaxX = right - viewBoxWidth
		const viewBoxMaxY = bottom - viewBoxHeight

		// Update the viewBox based on the panning, preventing it from going beyond boundaries
		viewBoxX = Math.min(Math.max(viewBoxX - deltaX, viewBoxMinX), viewBoxMaxX)
		viewBoxY = Math.min(Math.max(viewBoxY - deltaY, viewBoxMinY), viewBoxMaxY)

		// Construct the new viewBox attribute
		const newViewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
		svgContainer.setAttribute('viewBox', newViewBox)

		lastTouchX = touchX
		lastTouchY = touchY
	}
}

export function stopPanning() {
	isPanning = false
}

// Function to get the current scale of the SVG
function getCurrentScale(target) {
	const transform = window.getComputedStyle(target).getPropertyValue('transform')
	const matrix = new DOMMatrix(transform)
	return matrix.a
}

// Function to apply zoom to the SVG
function applyZoom(scale, target) {
	target.style.transform = `scale(1, -1) scale(${scale})`
}

// Function to end pinch gesture
export function endPinch() {
	isPinching = false
}
