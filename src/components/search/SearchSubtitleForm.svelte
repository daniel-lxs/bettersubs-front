<script lang="ts">
	import * as yup from 'yup';
	import { Search } from 'lucide-svelte';
	import { searchSubtitles } from '../../api/searchSubtitles';
	import type { Subtitle } from '../../types/Subtitle';
	import { FeatureType } from '../../types/FeatureTypes';
	import Alert from '../Alert.svelte';
	import { validationErrors, exceptions } from '../../utils/errorStrings';
	import { debounce } from 'lodash';
	import { validateForm } from '../../utils/validateForm';

	// Exported state variables
	export let subtitles: Subtitle[] = [];

	// UI state variables
	let alertVisible = false;
	let isLoading = false;

	// Alert information
	let alertTitle = '';
	let alertMessage = '';

	// Form error tracking
	let errors: Record<string, string> = {};

	// Form values
	let formValues = {
		imdbId: '',
		language: 'en',
		query: '',
		featureType: FeatureType.Episode,
		episodeNumber: 1,
		seasonNumber: 1
	};

	const formSchema = yup.object().shape({
		imdbId: yup
			.string()
			.matches(/tt\d+/, validationErrors.imdbId.invalid)
			.required(validationErrors.imdbId.required),
		featureType: yup.string().oneOf([FeatureType.Episode, FeatureType.Movie]),
		episodeNumber: yup.number().when('featureType', {
			is: (val: string) => val === FeatureType.Episode,
			then: (schema) =>
				schema
					.required(validationErrors.episodeNumber.required)
					.min(1, validationErrors.episodeNumber.invalid),
			otherwise: (schema) => schema.notRequired()
		}),
		seasonNumber: yup.number().when('featureType', {
			is: (val: string) => val === FeatureType.Episode,
			then: (schema) =>
				schema
					.required(validationErrors.seasonNumber.required)
					.min(1, validationErrors.seasonNumber.invalid),
			otherwise: (schema) => schema.notRequired()
		}),
		language: yup.string().oneOf(['en', 'es']) //TODO: Add other languages
	});

	const fetchData = debounce(async () => {
		isLoading = true;
		errors = await validateForm(formValues, formSchema);
		if (Object.keys(errors).length > 0) {
			isLoading = false;
			return;
		}
		clearAlert();
		try {
			subtitles = await searchSubtitles(formValues);
			if (subtitles.length === 0) {
				setAlert(exceptions.subtitles.notFound.title, exceptions.subtitles.notFound.message);
			}
		} catch (error) {
			setAlert(exceptions.unknown.title, exceptions.unknown.message);
		} finally {
			isLoading = false;
		}
	}, 500);

	function handleSubmit() {
		isLoading = true;
		fetchData();
	}

	function setAlert(title: string, message: string) {
		alertVisible = true;
		alertTitle = title;
		alertMessage = message;
	}

	function clearAlert() {
		alertVisible = false;
		alertTitle = '';
		alertMessage = '';
	}
</script>

<Alert bind:visible={alertVisible} bind:title={alertTitle} bind:message={alertMessage} />

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
						class="input variant-form-material {errors.imdbId ? 'input-error' : ''}"
						type="text"
						placeholder="tt1234567"
						bind:value={formValues.imdbId}
						required
					/>
					{#if errors.imdbId}
						<span class="validation-error">{errors.imdbId}</span>
					{/if}
				</label>
				<label class="label">
					<span>Query</span>
					<input
						class="input"
						type="text"
						placeholder="PROPER.HDTV.x264-KILLERS"
						bind:value={formValues.query}
					/>
				</label>
				<label class="label">
					<span>Language</span>
					<select class="select" bind:value={formValues.language}>
						<option value="es">Spanish</option>
						<option value="en">English</option>
					</select>
				</label>
				<label class="label">
					<span>Feature Type</span>
					<select class="select" bind:value={formValues.featureType}>
						<option value={FeatureType.Episode}>TV Show</option>
						<option value={FeatureType.Movie}>Movie</option>
					</select>
				</label>
				{#if formValues.featureType === 'episode'}
					<label class="label">
						<span>Season Number</span>
						<input
							class="input variant-form-material {errors.seasonNumber ? 'input-error' : ''}"
							type="number"
							min="1"
							placeholder="14"
							bind:value={formValues.seasonNumber}
							required
						/>
						{#if errors.seasonNumber}
							<span class="validation-error">{errors.seasonNumber}</span>
						{/if}
					</label>
					<label class="label">
						<span>Episode Number</span>
						<input
							class="input variant-form-material {errors.episodeNumber ? 'input-error' : ''}"
							type="number"
							min="1"
							placeholder="8"
							bind:value={formValues.episodeNumber}
							required
						/>
						{#if errors.episodeNumber}
							<span class="validation-error">{errors.episodeNumber}</span>
						{/if}
					</label>
				{/if}
			</div>
		</div>
		<button type="button" class="btn variant-filled" on:click={handleSubmit}>
			{#if isLoading}
				<span>Loading...</span>
			{:else}
				<span><Search /></span>
				<span>Search</span>
			{/if}
		</button>
	</section>
</div>
