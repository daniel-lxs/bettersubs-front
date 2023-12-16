<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { FileCheck, FileUp } from 'lucide-svelte';
	import type { CreateSubtitleInput } from '../../types/CreateSubtitleInput';
	import { FeatureType } from '../../types/FeatureTypes';
	import { createSubtitle } from '../../api/createSubtitle';
	import { formatFileSize } from '../../helpers/formatFileSize';
	import type { Subtitle } from '../../types/Subtitle';
	import { debounce } from 'lodash';

	// Constants
	let iconSize = '4rem';

	// State variables
	let isFormSubmitted = false;
	let loading = false;
	let featureType = FeatureType.Episode;
	let fileInput: File | undefined = undefined;

	// Input data
	let input = {
		imdbId: '',
		comments: '',
		language: 'en',
		releaseName: '',
		episodeNumber: '',
		seasonNumber: '',
		file: undefined as File | undefined
	};

	// Event handler for input change
	const handleInputChange = debounce((event: Event) => {
		const target = event.target as HTMLInputElement;
		featureType = target.value as FeatureType;
	}, 300);

	// Event handler for form submission
	async function handleSubmit() {
		loading = true;

		if (fileInput) {
			input.file = fileInput;
			const formData = createFormData(input);
			await createSubtitle(formData);
		}

		loading = false;
		isFormSubmitted = true;
	}

	// Helper function to create FormData
	function createFormData(input: CreateSubtitleInput): FormData {
		const formData = new FormData();

		// TODO: Add validation

		formData.append('imdbId', input.imdbId || '');
		formData.append('comments', input.comments || '');
		formData.append('language', input.language || '');
		formData.append('releaseName', input.releaseName || '');
		formData.append('episodeNumber', input.episodeNumber || '');
		formData.append('seasonNumber', input.seasonNumber || '');
		formData.append('file', input.file as File);

		return formData;
	}
</script>

{#if !isFormSubmitted}
	<div class="card p-6">
		<header class="card-header">
			<h2 class="h2">Upload Subtitle</h2>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>IMDb ID</span>
					<input class="input" type="text" placeholder="tt1234567" bind:value={input.imdbId} />
				</label>

				<label class="label">
					<span>Release Name</span>
					<input
						class="input"
						type="text"
						placeholder="Raised.by.Wolves.2020.S02E07.1080p.WEB.H264-CAKES[TGx]"
						bind:value={input.releaseName}
					/>
				</label>

				<label class="label">
					<span>Comments</span>
					<input class="input" type="text" placeholder="CAKES, TGx" bind:value={input.comments} />
				</label>

				<label class="label">
					<span>Language</span>
					<select class="select" bind:value={input.language}>
						<option value="es">Spanish</option>
						<option value="en">English</option>
					</select>
				</label>

				<div class="space-y-2">
					<label class="flex items-center space-x-2">
						<input
							class="radio"
							type="radio"
							checked
							name="radio-direct"
							value={FeatureType.Episode}
							bind:group={featureType}
							on:change={handleInputChange}
						/>
						<p>TV Show</p>
					</label>
					<label class="flex items-center space-x-2">
						<input
							class="radio"
							type="radio"
							name="radio-direct"
							value={FeatureType.Movie}
							bind:group={featureType}
							on:change={handleInputChange}
						/>
						<p>Movie</p>
					</label>
				</div>
				{#if featureType === 'episode'}
					<label class="label">
						<span>Season Number</span>
						<input class="input" type="text" placeholder="14" bind:value={input.seasonNumber} />
					</label>
					<label class="label">
						<span>Episode Number</span>
						<input class="input" type="text" placeholder="8" bind:value={input.episodeNumber} />
					</label>
				{/if}

				<FileDropzone
					name="files"
					bind:file={fileInput}
					accept=".srt"
					multiple={false}
					class={fileInput !== undefined ? 'border-2 border-dashed' : 'border-solid'}
				>
					<div class="upload-dropzone-icon" slot="lead">
						{#if fileInput === undefined}
							<FileUp size={iconSize} />
						{:else}
							<FileCheck size={iconSize} />
						{/if}
					</div>
					<svelte:fragment slot="message">
						{#if fileInput !== undefined}
							<div>
								File: {fileInput.name} |
								{formatFileSize(fileInput.size)}
							</div>
						{:else}
							Upload a file or drop it here
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="meta">SRT allowed, Max 1mb.</svelte:fragment>
				</FileDropzone>

				<button type="submit" class="btn variant-filled">
					{#if loading}
						<span>Loading...</span>
					{:else}
						<span>Submit</span>
					{/if}</button
				>
			</form>
		</section>
	</div>
{:else}
	<div class="card p-6">
		<header class="card-header">
			<h3 class="h3">Your Subtitle was Uploaded Successfully</h3>
		</header>

		<section class="p-4">
			<p class="mt-4">Your subtitle is ready to be downloaded. Thank you for using Better Subs.</p>
		</section>
	</div>
{/if}

<style>
	.btn {
		margin-top: 2rem;
	}
	.upload-dropzone-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.space-y-2 {
		margin-bottom: 1rem;
	}
</style>
