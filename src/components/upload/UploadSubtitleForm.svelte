<script lang="ts">
	import * as yup from 'yup';
	import Alert from '../../components/Alert.svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { FileCheck, FileUp } from 'lucide-svelte';
	import { FeatureType } from '../../types/FeatureTypes';
	import { createSubtitle } from '../../api/createSubtitle';
	import { formatFileSize } from '../../helpers/formatFileSize';
	import { validateForm } from '../../utils/validateForm';
	import { validationErrors, exceptions } from '../../utils/errorStrings';
	import { debounce } from 'lodash';

	// Constants
	const ICON_SIZE = '4rem';

	// UI state variables
	let alertVisible = false;
	let isLoading = false;
	export let isFormSubmitted = false;

	// Alert variables for displaying messages to the user
	let alertTitle = '';
	let alertMessage = '';

	// Form error tracking
	let errors: Record<string, string> = {};

	// Feature selection
	let selectedFeatureType = FeatureType.Episode;

	// Form data for uploads
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

	const uploadFormSchema = yup.object().shape({
		imdbId: yup
			.string()
			.matches(/tt\d+/, validationErrors.imdbId.invalid)
			.required(validationErrors.imdbId.required),
		releaseName: yup.string().required(validationErrors.releaseName.required),
		file: yup.mixed().required(validationErrors.file.required).nullable(),
		language: yup.string().default('en'),
		seasonNumber: yup.number().when('featureType', {
			is: (val: string) => val === FeatureType.Episode,
			then: (schema) =>
				schema
					.required(validationErrors.seasonNumber.required)
					.min(1, validationErrors.seasonNumber.invalid),
			otherwise: (schema) => schema.notRequired()
		}),
		episodeNumber: yup.number().when('featureType', {
			is: (val: string) => val === FeatureType.Episode,
			then: (schema) =>
				schema
					.required(validationErrors.episodeNumber.required)
					.min(1, validationErrors.episodeNumber.invalid),
			otherwise: (schema) => schema.notRequired()
		})
	});

	const handleSubmit = debounce(async () => {
		isLoading = true;
		errors = await validateForm(uploadForm, uploadFormSchema);

		if (Object.keys(errors).length > 0) {
			isLoading = false;
			return;
		}
		clearAlert();
		try {
			const formData = createFormData();
			await createSubtitle(formData);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : exceptions.upload.message;
			setAlert(exceptions.upload.title, errorMessage);
			isLoading = false;
			return;
		}

		isLoading = false;
		isFormSubmitted = true;
	}, 500);

	function createFormData(): FormData {
		const formData = new FormData();
		Object.entries(uploadForm).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});
		return formData;
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

	// `file` property on input element doesn't work
	function onFileDropzoneChangeHandler(e: Event): void {
		uploadForm.file = (e.target as HTMLInputElement).files?.[0];
	}
</script>

<Alert bind:visible={alertVisible} bind:title={alertTitle} bind:message={alertMessage} />

<div class="card p-6">
	<header class="card-header">
		<h2 class="h2">Upload Subtitle</h2>
	</header>
	<section class="p-4">
		<form on:submit|preventDefault={handleSubmit}>
			<label class="label">
				<span>IMDb ID</span>
				<input
					class="input variant-form-material {errors.imdbId ? 'input-error' : ''}"
					type="text"
					placeholder="tt1234567"
					bind:value={uploadForm.imdbId}
				/>
				{#if errors.episodeNumber}
					<span class="validation-error">Please enter a valid IMDb ID</span>
				{/if}
			</label>

			<label class="label">
				<span>Release Name</span>
				<input
					class="input variant-form-material {errors.releaseName ? 'input-error' : ''}"
					type="text"
					placeholder="Raised.by.Wolves.2020.S02E07.1080p.WEB.H264-CAKES[TGx]"
					bind:value={uploadForm.releaseName}
				/>
				{#if errors.episodeNumber}
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
						class="input variant-form-material {errors.seasonNumber ? 'input-error' : ''}"
						type="text"
						placeholder="14"
						bind:value={uploadForm.seasonNumber}
					/>
					{#if errors.episodeNumber}
						<span class="validation-error">Please enter a valid season number.</span>
					{/if}
				</label>
				<label class="label">
					<span>Episode Number</span>
					<input
						class="input variant-form-material {errors.episodeNumber ? 'input-error' : ''}"
						type="text"
						placeholder="8"
						bind:value={uploadForm.episodeNumber}
					/>
					{#if errors.episodeNumber}
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
					{#if errors.file}
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

<style>
	.btn {
		margin-top: 2rem;
	}
	.upload-dropzone-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
