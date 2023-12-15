<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Frown, Search, XCircle } from 'lucide-svelte';
	import { searchSubtitles } from '../api/searchSubtitles';
	import type { SearchSubtitlesInput } from '../types/SearchSubtitlesInput';
	import type { Subtitle } from '../types/Subtitle';
	import { FeatureType } from '../types/FeatureTypes';

	export let resultArray: Subtitle[];

	let isAlertVisible = false;
	let loading = false;

	const iconSize = '2rem';

	let searchFormData: SearchSubtitlesInput = {
		imdbId: '',
		language: 'en',
		query: '',
		featureType: 'episode'
	};

	let episodeNumber: string | undefined;
	let seasonNumber: string | undefined;

	async function fetchData() {
		loading = true;

		if (searchFormData.featureType === 'episode' && episodeNumber && seasonNumber) {
			searchFormData.episodeNumber = parseInt(episodeNumber);
			searchFormData.seasonNumber = parseInt(seasonNumber);
		}

		resultArray = await searchSubtitles(searchFormData);

		if (resultArray.length < 1) {
			await handleAlert();
		}

		loading = false;
	}

	async function handleAlert() {
		if (!isAlertVisible) {
			isAlertVisible = true;
			await new Promise((resolve) =>
				setTimeout(() => {
					isAlertVisible = false;
					resolve(null);
				}, 3000)
			);
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
		<h3 class="text-3xl font-bold mb-4">Search Subtitles</h3>
	</header>
	<section class="p-4">
		<!--Create 2 columns -->
		<div>
			<label class="label">
				<span>IMDb ID</span>
				<input
					class="input short-input"
					type="text"
					placeholder="tt1234567"
					bind:value={searchFormData.imdbId}
				/>
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
			<label class="label">
				<span>Language</span>
				<select class="select" bind:value={searchFormData.language}>
					<option value="es">Spanish</option>
					<option value="en">English</option>
				</select>
			</label>
			<label class="label">
				<span>Feature Type</span>
				<select class="select" bind:value={searchFormData.featureType}>
					<option value={FeatureType.Episode}>TV Show</option>
					<option value={FeatureType.Movie}>Movie</option>
				</select>
			</label>
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
		</div>
		<button type="button" class="btn variant-filled" on:click={fetchData}>
			{#if loading}
				<span>Loading...</span>
			{:else}
				<span><Search /></span>
				<span>Search</span>
			{/if}
		</button>
	</section>
</div>
