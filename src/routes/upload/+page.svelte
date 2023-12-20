<script lang="ts">
	import Alert from '../../components/Alert.svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { FileCheck, FileUp } from 'lucide-svelte';
	import { FeatureType } from '../../types/FeatureTypes';
	import { createSubtitle } from '../../api/createSubtitle';
	import { formatFileSize } from '../../helpers/formatFileSize';

	// Constants
	const ICON_SIZE = '4rem';

	// State variables
	let alertVisible = false;
	let alert = {
		title: '',
		message: ''
	};
	let isFormSubmitted = false;
	let isFormValid = false;
	let isLoading = false;
	let selectedFeatureType = FeatureType.Episode;

	// Form data model
	let uploadForm = {
		imdbId: '',
		comments: '',
		language: 'en',
		releaseName: '',
		episodeNumber: '',
		seasonNumber: '',
		file: undefined as File | undefined,
		featureType: FeatureType.Episode
	};

	let validationErrors = {
		imdbId: false,
		releaseName: false,
		language: false,
		seasonNumber: false,
		episodeNumber: false,
		file: false
	};

	function validateForm() {
		// Reset validation errors
		validationErrors = {
			imdbId: !uploadForm.imdbId,
			releaseName: !uploadForm.releaseName,
			file: !uploadForm.file,
			language: false,
			seasonNumber: uploadForm.featureType === FeatureType.Episode && !uploadForm.seasonNumber,
			episodeNumber: uploadForm.featureType === FeatureType.Episode && !uploadForm.episodeNumber
		};
		isFormValid = !Object.values(validationErrors).some(Boolean);
		return isFormValid;
	}

	async function handleSubmit() {
		validateForm();

		//debug
		console.log(uploadForm);

		// Check if form is valid
		if (!isFormValid) {
			isLoading = false;
			return;
		}

		isLoading = true;

		try {
			const formData = createFormData();
			await createSubtitle(formData);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			setAlert('Upload Failed', errorMessage);
			isLoading = false;
			return;
		}

		isLoading = false;
		isFormSubmitted = true;
	}

	function createFormData(): FormData {
		const formData = new FormData();
		Object.entries(uploadForm).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});
		return formData;
	}

	function setAlert(title: string, message: string) {
		alertVisible = true;
		alert.title = title;
		alert.message = message;
	}

	//file property on input element doesn't work
	function onFileDropzoneChangeHandler(e: Event): void {
		uploadForm.file = (e.target as HTMLInputElement).files?.[0];
	}
</script>

<Alert bind:visible={alertVisible} bind:title={alert.title} bind:message={alert.message} />

{#if !isFormSubmitted}
	<div class="card p-6">
		<header class="card-header">
			<h2 class="h2">Upload Subtitle</h2>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>IMDb ID</span>
					<input
						class="input variant-form-material {validationErrors.imdbId ? 'input-error' : ''}"
						type="text"
						placeholder="tt1234567"
						bind:value={uploadForm.imdbId}
					/>
					{#if validationErrors.episodeNumber}
						<span class="validation-error">Please enter a valid IMDb ID</span>
					{/if}
				</label>

				<label class="label">
					<span>Release Name</span>
					<input
						class="input variant-form-material {validationErrors.releaseName ? 'input-error' : ''}"
						type="text"
						placeholder="Raised.by.Wolves.2020.S02E07.1080p.WEB.H264-CAKES[TGx]"
						bind:value={uploadForm.releaseName}
					/>
					{#if validationErrors.episodeNumber}
						<span class="validation-error">Please enter a valid release name</span>
					{/if}
				</label>

				<label class="label">
					<span>Comments</span>
					<input
						class="input variant-form-material"
						type="text"
						placeholder="CAKES, TGx"
						bind:value={uploadForm.comments}
					/>
				</label>

				<label class="label">
					<span>Language</span>
					<select class="select variant-form-material" bind:value={uploadForm.language}>
						<option value="es">Spanish</option>
						<option value="en">English</option>
					</select>
				</label>

				<label class="label">
					<span>Feature Type</span>
					<select class="select variant-form-material" bind:value={uploadForm.featureType}>
						<option value={FeatureType.Episode}>TV Show</option>
						<option value={FeatureType.Movie}>Movie</option>
					</select>
				</label>

				{#if selectedFeatureType === 'episode'}
					<label class="label">
						<span>Season Number</span>
						<input
							class="input variant-form-material {validationErrors.seasonNumber
								? 'input-error'
								: ''}"
							type="text"
							placeholder="14"
							bind:value={uploadForm.seasonNumber}
						/>
						{#if validationErrors.episodeNumber}
							<span class="validation-error">Please enter a valid season number.</span>
						{/if}
					</label>
					<label class="label">
						<span>Episode Number</span>
						<input
							class="input variant-form-material {validationErrors.episodeNumber
								? 'input-error'
								: ''}"
							type="text"
							placeholder="8"
							bind:value={uploadForm.episodeNumber}
						/>
						{#if validationErrors.episodeNumber}
							<span class="validation-error">Please enter a valid episode number.</span>
						{/if}
					</label>
				{/if}

				<FileDropzone
					name="files"
					accept=".srt"
					multiple={false}
					on:change={(e) => onFileDropzoneChangeHandler(e)}
					class={uploadForm.file !== undefined ? 'border-2 border-dashed' : 'border-solid'}
				>
					<div class="upload-dropzone-icon" slot="lead">
						{#if uploadForm.file === undefined}
							<FileUp size={ICON_SIZE} />
						{:else}
							<FileCheck size={ICON_SIZE} />
						{/if}
					</div>
					<svelte:fragment slot="message">
						{#if validationErrors.file}
							<div class="validation-error">Please select a file to upload.</div>
						{:else if uploadForm.file !== undefined}
							<div>
								File: {uploadForm.file.name} | {formatFileSize(uploadForm.file.size)}
							</div>
						{:else}
							Upload a file or drop it here
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="meta">SRT allowed, Max 1mb.</svelte:fragment>
				</FileDropzone>

				<button type="submit" class="btn variant-filled">
					{#if isLoading}
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
	.validation-error {
		color: rgb(var(--color-error-500));
	}
</style>
