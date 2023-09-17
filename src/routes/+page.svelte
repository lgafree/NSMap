<script>
	import '../app.css'
	import municipalities from '../municipalityBrgys.json'
	import FBShare from '../components/FBShare.svelte'
	import { handlePinch, endPinch } from '$lib/zoomandpan.js'

	import { onMount } from 'svelte'
	import { Button, Checkbox, Dropdown, DropdownItem, Modal, P } from 'flowbite-svelte'
	import { ChevronDownSolid } from 'flowbite-svelte-icons'
	import {
		openModal,
		processJSONFiles,
		selectedBrgy,
		selectedMunicipalityName,
		selectedBrgyName
	} from '../d3/d3.js'
	import FbShare from '../components/FBShare.svelte'

	let brgyTotal = 0
	let patronizerLevel = 0
	let modalPatronizerStatusColor
	let brgys = []
	let municipalitySelectOpen = false
	let brgySelectOpen = false
	let selectedBrgys = {}

	//on openModal, remove bounce color
	$: $openModal, checkOpenModalChange()

	//listen to local variables change
	$: {
		if (municipalitySelectOpen) {
			brgySelectOpen = false
		}
		if (brgySelectOpen) {
			municipalitySelectOpen = false
		}
	}

	function checkOpenModalChange() {
		if ($openModal) {
			modalPatronizerStatusColor = 'white'
			brgyTotal = 0
		} else {
			patronizerLevel = 0

			setSelectedBrgys()

			Object.entries(selectedBrgys).forEach((value, key) => {
				document.getElementById(value[0]).style.fill = value[1].fill
				patronizerLevel += value[1].points
			})
		}
	}

	function setSelectedBrgys() {
		if ($selectedBrgy) {
			selectedBrgys[$selectedBrgy] = {
				fill: modalPatronizerStatusColor,
				points: brgyTotal
			}
		}
	}

	function toggleCheck(e) {
		const patronizerStatus = document.getElementById('modal-patronizer-status')
		const cbTanan = document.getElementById('cb-tanan')
		const cbAnte = document.getElementById('cb-ante')
		const cbBisperas = document.getElementById('cb-bisperas')
		const cbPatron = document.getElementById('cb-patron')
		const cbLiwas = document.getElementById('cb-liwas')

		//check/uncheck all if 'tanan' is checked
		if (e.target.id === 'cb-tanan') {
			cbAnte.checked = e.target.checked
			cbBisperas.checked = e.target.checked
			cbPatron.checked = e.target.checked
			cbLiwas.checked = e.target.checked
		}

		//check/uncheck 'tanan' whether all 4 is checked/unchecked
		if (cbAnte.checked && cbBisperas.checked && cbPatron.checked && cbLiwas.checked) {
			cbTanan.checked = true
		} else {
			cbTanan.checked = false
		}

		brgyTotal = 0

		//adding points accordingly
		if (cbAnte.checked) {
			brgyTotal += 1
		}

		if (cbBisperas.checked) {
			brgyTotal += 3
		}
		if (cbPatron.checked) {
			brgyTotal += 4
		}
		if (cbLiwas.checked) {
			brgyTotal += 2
		}

		//check patronizer status
		if (brgyTotal > 0 && brgyTotal < 4) {
			patronizerStatus.innerHTML = 'Maluya'
			modalPatronizerStatusColor = 'purple'
		} else if (brgyTotal === 4) {
			patronizerStatus.innerHTML = 'Patronizer'
			modalPatronizerStatusColor = 'green'
		} else if (brgyTotal > 4 && brgyTotal < 10) {
			patronizerStatus.innerHTML = 'Matindi'
			modalPatronizerStatusColor = 'blue'
		} else if (brgyTotal === 10) {
			patronizerStatus.innerHTML = 'Ah yadi! Kasiod man'
			modalPatronizerStatusColor = 'red'
		}
	}

	function getBrgys(key) {
		municipalities.forEach((municipality) => {
			if (municipality[key] !== undefined) {
				brgys = municipality[key]
			}
		})
		brgys.forEach((brgy, index) => {
			brgys[index] = brgy.replace(/\u00c3/g, '').replace(/\u00b1/g, 'ñ')
		})
		selectedMunicipalityName.set(key)
		municipalitySelectOpen = false
		brgySelectOpen = true
	}

	function selectBrgy(key) {
		openModal.set(true)
		selectedBrgyName.set(key)
		selectedBrgy.set(
			`path-${$selectedBrgyName.toLowerCase()}-${$selectedMunicipalityName.toLowerCase()}`.replace(
				/ /g,
				'-'
			)
		)
	}

	//Zoom and Pan SVG
	onMount(() => {
		processJSONFiles()
		const svg = document.getElementById('svg-container')

		// Add event listeners for pinch-to-zoom
		svg.addEventListener('touchstart', handlePinch)
		svg.addEventListener('touchmove', handlePinch)
		svg.addEventListener('touchend', endPinch)
		svg.addEventListener('touchcancel', endPinch)
	})
</script>

<main>
	<div class="grid grid-cols-2 gap-4">
		<div class="col-span-1">
			<Button class="mt-1 ml-2 w-32"
				>Municipality<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" /></Button
			>
			<Dropdown
				id="dd-municipality"
				bind:open={municipalitySelectOpen}
				class="overflow-y-auto h-48"
			>
				{#each municipalities as municipality}
					{#each Object.keys(municipality) as key}
						<DropdownItem id={key.toLocaleLowerCase()} on:click={() => getBrgys(key)}
							>{key}</DropdownItem
						>
					{/each}
				{/each}
			</Dropdown>

			<Button class="mt-1 ml-2 w-32"
				>Brgy<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" /></Button
			>
			<Dropdown id="dd-brgys" bind:open={brgySelectOpen} class="overflow-y-auto h-48">
				{#each brgys as brgy}
					<DropdownItem id={brgy.toLocaleLowerCase()} on:click={() => selectBrgy(brgy)}
						>{brgy}</DropdownItem
					>
				{/each}
			</Dropdown>
		</div>
		<div class="col-span-1 mr-2">
			<div class="lg:w-64 h-auto bg-white mt-1 p-3 rounded-xl border-2 border-black">
				<div class="grid grid-cols-4">
					<div class="col-span-1">
						<div class="rounded-md border-2 border-black bg-white w-7 h-5" />
					</div>
					<div class="col-span-3">
						<span class="flex items-center font-medium">Waray</span>
					</div>
				</div>
				<div class="grid grid-cols-4">
					<div class="col-span-1">
						<div class="rounded-md border-2 border-black bg-purple-700 w-7 h-5" />
					</div>
					<div class="col-span-3">
						<span class="flex items-center font-medium">Maluya</span>
					</div>
				</div>
				<div class="grid grid-cols-4">
					<div class="col-span-1">
						<div class="rounded-md bg-green-700 w-7 h-5" />
					</div>
					<div class="col-span-3">
						<span class="flex items-center font-medium">Patronizer</span>
					</div>
				</div>
				<div class="grid grid-cols-4">
					<div class="col-span-1">
						<div class="rounded-md bg-blue-700 w-7 h-5" />
					</div>
					<div class="col-span-3">
						<span class="flex items-center font-medium">Matindi</span>
					</div>
				</div>
				<div class="grid grid-cols-4">
					<div class="col-span-1">
						<div class="rounded-md bg-red-700 w-7 h-5" />
					</div>
					<div class="col-span-3">
						<span class="flex items-center font-medium">Kasiod man</span>
					</div>
				</div>
			</div>
			<div class="pl-2"><P weight="semibold">Patronizer Level: {patronizerLevel}</P></div>
		</div>
	</div>

	<div class="flex flex-col mt-5 px-5">
		<span class="flex items-center text-lg font-medium mx-auto"
			>Diin ka paka pamatron yana nga tuig?</span
		>
		<span class="flex items-center text-center text-sm font-small mx-auto"
			>Yana la nga tuig. Kay kun all-time, maaram ak halos bug-os nga Northern Samar naka pamatron
			ka na.</span
		>
	</div>

	<div class="flex h-4/6 content-center">
		<svg id="svg-container" class="h-full w-full" />
	</div>

	<FbShare />

	<Modal bind:open={$openModal} size="xs" autoclose outsideclose>
		<svelte:fragment slot="header">
			<div class="grid grid-cols-2">
				<div class="row-span-2 col-span-1">
					<!-- // Manually replace Unicode escape sequences with ñ -->
					<P size="xl" weight="semibold">{`Brgy. ${$selectedBrgyName}`}</P>
					<P size="lg">{$selectedMunicipalityName}</P>
				</div>
				<div class="col-span-1 row-span-2">
					<p class="text-3xl mt-3 pl-3 text-right dark:text-white">
						{brgyTotal}
						{brgyTotal == 1 ? 'point' : 'points'}
					</p>
				</div>
			</div>
		</svelte:fragment>
		<div class="grid grid-cols-2">
			<div class="col px-auto">
				<P size="lg" weight="bold">Kinadto ak sito:</P>
			</div>
			<div
				class="col animate-bounce font-bold rounded-md text-center text-white bg-{modalPatronizerStatusColor}-700"
				id="modal-patronizer-status-container"
			>
				<span class="font-bold text-lg" id="modal-patronizer-status" />
			</div>
		</div>

		<div class="mx-auto">
			<Checkbox id="cb-tanan" on:change={toggleCheck}><P weight="bold">TANAN 🤤</P></Checkbox>
			<div class="grid grid-cols-3">
				<div class="col-span-1">
					<Checkbox id="cb-ante" on:change={toggleCheck}><P weight="semibold">Ante</P></Checkbox>
				</div>
				<div class="col-span-2">
					<P weight="semibold">1 pt</P>
				</div>
			</div>
			<div class="grid grid-cols-3">
				<div class="col-span-1">
					<Checkbox id="cb-bisperas" on:change={toggleCheck}
						><P weight="semibold">Bisperas</P></Checkbox
					>
				</div>
				<div class="col-span-2">
					<P weight="semibold">3 pts</P>
				</div>
			</div>
			<div class="grid grid-cols-3">
				<div class="col-span-1">
					<Checkbox id="cb-patron" on:change={toggleCheck}><P weight="semibold">Patron</P></Checkbox
					>
				</div>
				<div class="col-span-2">
					<P weight="semibold">4 pts</P>
				</div>
			</div>
			<div class="grid grid-cols-3">
				<div class="col-span-1">
					<Checkbox id="cb-liwas" on:change={toggleCheck}><P weight="semibold">Liwas</P></Checkbox>
				</div>
				<div class="col-span-2">
					<P weight="semibold">2 pts</P>
				</div>
			</div>
		</div>
	</Modal>
</main>

<style>
	main {
		height: 100%;
	}

	svg {
		transition: transform 0.3s ease;
	}
</style>
