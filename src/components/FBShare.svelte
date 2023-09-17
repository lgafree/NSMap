<script>
	import { Button } from 'flowbite-svelte'
	import { FacebookSolid } from 'flowbite-svelte-icons'
	function shareOnFacebook() {
		// FB.ui({
		// 	method: 'share',
		// 	href: 'https://example.com' // URL you want to share
		// })
		html2canvas(document.body).then(function (canvas) {
			// Convert the canvas to a data URL
			const screenshotDataUrl = canvas.toDataURL('image/png')

			// Set the og:image meta tag with the screenshot URL
			const ogImageMeta = document.querySelector('meta[property="og:image"]')
			if (ogImageMeta) {
				ogImageMeta.setAttribute('content', screenshotDataUrl)
			}
		})

		const navUrl =
			'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href)
		window.open(navUrl, 'mywindow', 'width=350,height=250')
	}
</script>

<div class="flex">
	<Button class="mx-auto" color="blue" on:click={shareOnFacebook}
		><FacebookSolid size="lg" color="blue" class="mr-2 bg-white p-1 rounded-md" />Share to facebook</Button
	>
</div>
