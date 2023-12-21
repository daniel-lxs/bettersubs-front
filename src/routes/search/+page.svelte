<script lang="ts">
	import type { Subtitle } from '../../types/Subtitle';
	import SearchSubtitleForm from '../../components/search/SearchSubtitleForm.svelte';
	import SubtitlesTable from '../../components/search/SubtitlesTable.svelte';

	let subtitles: Subtitle[] = [];
</script>

<SearchSubtitleForm bind:subtitles />
<SubtitlesTable bind:subtitles />
