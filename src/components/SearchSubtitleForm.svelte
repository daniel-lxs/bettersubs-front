<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { searchSubtitles } from '../api/searchSubtitles';
	import type { SearchSubtitlesInput } from '../types/SearchSubtitlesInput';
	import type { Subtitle } from '../types/Subtitle';
	import { FeatureType } from '../types/FeatureTypes';
	import Alert from './Alert.svelte';

	export let subtitles: Subtitle[] = [];

	let alertVisible = false;
	let isLoading = false;
	let isFormValid = false;
	let alert = {
		title: '',
		message: ''
	};

	let searchForm: SearchSubtitlesInput = {
		imdbId: '',
		language: 'en',
		query: '',
		featureType: FeatureType.Episode
	};

	let validationErrors = {
		imdbId: false,
		seasonNumber: false,
		episodeNumber: false
	};

	let episodeNumber = '';
	let seasonNumber = '';

	// Update the overall form validity
	function updateFormValidity() {
		const { imdbId, seasonNumber, episodeNumber } = validationErrors;
		const isEpisode = searchForm.featureType === 'episode';
		const isValid = !imdbId && !(isEpisode && (seasonNumber || episodeNumber));
		isFormValid = isValid;
		return isValid;
	}

	async function fetchData() {
		updateFormValidity();

		if (!isFormValid) {
			return;
		}

		isLoading = true;
		alert.message = ''; // Clear the alert message before fetching
		alertVisible = false; // Hide the alert before fetching

		if (searchForm.featureType === 'episode' && episodeNumber && seasonNumber) {
			searchForm.episodeNumber = parseInt(episodeNumber);
			searchForm.seasonNumber = parseInt(seasonNumber);
		}

		try {
			subtitles = await searchSubtitles(searchForm);

			if (subtitles.length === 0) {
				setAlert(
					'No subtitles found',
					'No results found. Please try again with different search criteria.'
				);
			}
		} catch (error) {
			setAlert('Error', 'An error occurred while fetching data. Please try again later.');
		} finally {
			isLoading = false;
		}
	}

	function setAlert(title: string, message: string) {
		alertVisible = true;
		alert.title = title;
		alert.message = message;
	}
</script>

<Alert bind:visible={alertVisible} bind:title={alert.title} bind:message={alert.message} />

<div class="card p-6">
	<header class="card-header">
		<h2 class="h2">Search Subtitles</h2>
	</header>
	<section class="p-4">
		<!--Create 2 columns -->
		<div class="flex justify-center items-center mx-auto transition-[width] duration-200 w-full">
			<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
				<label class="label">
					<span>IMDb ID</span>
					<input
						class="input {validationErrors.imdbId ? 'input-error' : ''}"
						type="text"
						placeholder="tt1234567"
						bind:value={searchForm.imdbId}
					/>
				</label>
				<label class="label">
					<span>Query</span>
					<input
						class="input"
						type="text"
						placeholder="PROPER.HDTV.x264-KILLERS"
						bind:value={searchForm.query}
					/>
				</label>
				<label class="label">
					<span>Language</span>
					<select class="select" bind:value={searchForm.language}>
						<option value="es">Spanish</option>
						<option value="en">English</option>
					</select>
				</label>
				<label class="label">
					<span>Feature Type</span>
					<select class="select" bind:value={searchForm.featureType}>
						<option value={FeatureType.Episode}>TV Show</option>
						<option value={FeatureType.Movie}>Movie</option>
					</select>
				</label>
				{#if searchForm.featureType === 'episode'}
					<label class="label">
						<span>Season Number</span>
						<input
							class="input {validationErrors.seasonNumber ? 'input-error' : ''}"
							type="text"
							placeholder="14"
							bind:value={seasonNumber}
						/>
					</label>
					<label class="label">
						<span>Episode Number</span>
						<input
							class="input {validationErrors.episodeNumber ? 'input-error' : ''}"
							type="text"
							placeholder="8"
							bind:value={episodeNumber}
						/>
					</label>
				{/if}
			</div>
		</div>
		<button type="button" class="btn variant-filled" on:click={fetchData} disabled={!isFormValid}>
			{#if isLoading}
				<span>Loading...</span>
			{:else}
				<span><Search /></span>
				<span>Search</span>
			{/if}
		</button>
	</section>
</div>
