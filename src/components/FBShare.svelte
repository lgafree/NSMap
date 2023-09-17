<script>
	import { Button } from 'flowbite-svelte'
	import { FacebookSolid } from 'flowbite-svelte-icons'
	function shareOnFacebook() {
		const navUrl =
			'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href)
		window.open(navUrl, 'mywindow', 'width=350,height=250')
	}
</script>

<div class="flex">
	<Button class=" fixed bottom-0 mb-5 ml-5" color="blue" on:click={shareOnFacebook}
		><FacebookSolid size="lg" color="blue" class="mr-2 bg-white p-1 rounded-md" />Share to facebook</Button
	>
</div>
