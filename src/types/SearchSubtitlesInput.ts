export interface SearchSubtitlesInput {
	imdbId: string;
	language: string;
	query: string;
	featureType: string;
	episodeNumber?: number;
	seasonNumber?: number;
}
