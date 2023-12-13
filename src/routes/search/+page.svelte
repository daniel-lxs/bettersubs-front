<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Download, Frown, Search, XCircle } from 'lucide-svelte';
	import { searchSubtitles } from '../../api/searchSubtitles';
	import type { SearchSubtitlesInput } from '../../types/SearchSubtitlesInput';
	import type { Subtitle } from '../../types/Subtitle';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	let isSearchFormVisible: boolean = true;
	let isAlertVisible: boolean = false;
	let loading = false;

	const iconSize = '2rem';

	let resultArray: Subtitle[] = [];

	let searchFormData: SearchSubtitlesInput = {
		imdbId: '',
		language: 'en',
		query: '',
		featureType: 'episode'
	};

	let episodeNumber: string | undefined = undefined;
	let seasonNumber: string | undefined = undefined;

	//TODO: Add validation
	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		searchFormData.featureType = target.value;
	}

	async function fetchData() {
		loading = true;

		if (searchFormData.featureType === 'episode' && episodeNumber && seasonNumber) {
			searchFormData.episodeNumber = parseInt(episodeNumber);
			searchFormData.seasonNumber = parseInt(seasonNumber);
		}

		resultArray = await searchSubtitles(searchFormData);

		if (resultArray.length > 0) {
			isSearchFormVisible = false;
		} else {
			handleAlert();
		}

		loading = false;
	}

	function handleAlert() {
		if (!isAlertVisible) {
			isAlertVisible = true;
			setTimeout(() => {
				isAlertVisible = false;
			}, 3000);
			return;
		}
		isAlertVisible = false;
	}
</script>

<div class="card p-6">
	<header class="card-header">
		{#if isAlertVisible}
			<div class="alert-overlay">
				<aside class="alert variant-filled-error" transition:fade|local={{ duration: 200 }}>
					<!-- Icon -->
					<div><Frown size={iconSize} /></div>
					<!-- Message -->
					<div class="alert-message">
						<h3 class="h3">No Results</h3>
						<p>Try changing your search criteria</p>
					</div>
					<!-- Actions -->
					<div class="alert">
						<button class="btn-icon variant-filled-error" on:click={handleAlert}><XCircle /></button
						>
					</div>
				</aside>
			</div>
		{/if}
	</header>
	<Accordion>
		<AccordionItem bind:open={isSearchFormVisible}>
			<svelte:fragment slot="lead"><Search size={iconSize} /></svelte:fragment>
			<div slot="summary" class="text-3xl font-bold">Search Subtitles</div>
			<svelte:fragment slot="content">
				<section class="p-4">
					<label class="label">
						<span>IMDb ID</span>
						<input
							class="input"
							type="text"
							placeholder="tt1234567"
							bind:value={searchFormData.imdbId}
						/>
					</label>
					<label class="label">
						<span>Language</span>
						<select class="select" bind:value={searchFormData.language}>
							<option value="es">Spanish</option>
							<option value="en">English</option>
						</select>
					</label>
					<label class="label">
						<span>Query</span>
						<input
							class="input"
							type="text"
							placeholder="PROPER.HDTV.x264-KILLERS"
							bind:value={searchFormData.query}
						/>
					</label>
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input
								class="radio"
								type="radio"
								checked
								name="radio-direct"
								value="episode"
								bind:group={searchFormData.featureType}
								on:change={handleInputChange}
							/>
							<p>TV Show</p>
						</label>
						<label class="flex items-center space-x-2">
							<input
								class="radio"
								type="radio"
								name="radio-direct"
								value="movie"
								bind:group={searchFormData.featureType}
								on:change={handleInputChange}
							/>
							<p>Movie</p>
						</label>
					</div>
					{#if searchFormData.featureType === 'episode'}
						<label class="label">
							<span>Season Number</span>
							<input class="input" type="text" placeholder="14" bind:value={seasonNumber} />
						</label>
						<label class="label">
							<span>Episode Number</span>
							<input class="input" type="text" placeholder="8" bind:value={episodeNumber} />
						</label>
					{/if}
					<button type="button" class="btn variant-filled" on:click={fetchData}>
						{#if loading}
							<span>Loading...</span>
						{:else}
							<span><Search /></span>
							<span>Search</span>
						{/if}
					</button>
				</section>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>

<div class="card p-6">
	<header class="card-header">
		<h3 class="text-3xl font-bold mb-4">Results</h3>
	</header>
	<section class="p-4">
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Provider</th>
						<th>Title</th>
						<th>Year</th>
						<th>Release Name</th>
						<th>Language</th>
						<th>Download Count</th>
						<th>Download</th>
					</tr>
				</thead>
				<tbody>
					{#each resultArray as row, i}
						<tr>
							<td>{row.provider.toLocaleUpperCase()}</td>
							<td>{row.featureDetails.title}</td>
							<td>{row.featureDetails.year}</td>
							<td>{row.releaseName}</td>
							<td>{row.language}</td>
							<td>{row.downloadCount}</td>
							<td>
								<a href={'http://localhost:3000' + row.url} class="btn-icon variant-filled"
									><Download /></a
								></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.alert-overlay {
		position: fixed;
		width: 90%;
		z-index: 9999;
	}
	.space-y-2 label {
		margin-bottom: 10px;
	}
</style>
