let isPinching = false
let initialPinchDistance = 0
let initialScale = 1
const originalScale = 1 // Set the original scale here

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
