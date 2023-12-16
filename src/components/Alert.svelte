<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Frown, XCircle } from 'lucide-svelte';

	const iconSize = '2rem';

	export let visible = false;
	export let title = '';
	export let message = '';
	export let timeout = 3000; // Default time in milliseconds

	// Reactive statement simplified to watch for changes in `visible`.
	$: if (visible) handleAlert();

	async function handleAlert() {
		// If `visible` is true, start a timer to set it to false after 3 seconds.
		await new Promise((resolve) =>
			setTimeout(() => {
				visible = false;
				resolve(null);
			}, timeout)
		);
	}

	function toggleAlert() {
		// Toggle the visibility of the alert
		visible = !visible;
	}
</script>

{#if visible}
	<div class="fixed bottom-0 right-0 mb-4 mr-4">
		<aside class="alert variant-filled-error shadow-lg" transition:fade|local={{ duration: 200 }}>
			<div>
				<Frown size={iconSize} />
			</div>

			<div class="alert-message">
				<h3 class="h3">{title}</h3>
				<p>{message}</p>
			</div>

			<div class="alert-actions">
				<button class="btn-icon variant-filled-error" on:click={toggleAlert}>
					<XCircle />
				</button>
			</div>
		</aside>
	</div>
{/if}
