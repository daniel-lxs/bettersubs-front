<script lang="ts">
	import UploadSubtitleForm from '../../components/upload/UploadSubtitleForm.svelte';

	let isFormSubmitted = false;
</script>

{#if !isFormSubmitted}
	<UploadSubtitleForm bind:isFormSubmitted />
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
