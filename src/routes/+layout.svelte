<script lang="ts">
	import '../app.css';
	import '../app.postcss';
	import { AppShell, AppBar, TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { Home } from 'lucide-svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead"
				><strong class="h1 text-xl uppercase">Better Subs</strong></svelte:fragment
			>
			<svelte:fragment slot="trail">
				<TabGroup
					justify="justify-center"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flex="flex-1 lg:flex-none"
					rounded=""
					border=""
					class="bg-surface-100-800-token w-full"
				>
					<TabAnchor href="/" selected={$page.url.pathname === '/'}>
						<span>Home</span>
					</TabAnchor>
					<TabAnchor href="/search" selected={$page.url.pathname === '/search'}>
						<span>Search</span>
					</TabAnchor>
					<TabAnchor href="/upload" selected={$page.url.pathname === '/upload'}>
						<span>Upload</span>
					</TabAnchor>
					<!-- ... -->
				</TabGroup>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
