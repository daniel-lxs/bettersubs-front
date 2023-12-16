<script lang="ts">
	import type { Subtitle } from '../../types/Subtitle';
	import SearchSubtitleForm from '../../components/SearchSubtitleForm.svelte';
	import SubtitlesTable from '../../components/SubtitlesTable.svelte';

	let subtitles: Subtitle[] = [];
</script>

<SearchSubtitleForm bind:subtitles />
<SubtitlesTable bind:subtitles />
