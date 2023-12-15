<script lang="ts">
	import { Download } from 'lucide-svelte';
	import type { Subtitle } from '../types/Subtitle';

	export let subtitles: Subtitle[] = [];
</script>

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
					{#each subtitles as row, i}
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
