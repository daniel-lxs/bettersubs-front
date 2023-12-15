export interface CreateSubtitleInput {
	imdbId: string;
	comments: string;
	language: string;
	releaseName: string;
	episodeNumber: string;
	seasonNumber: string;
	file?: File;
}
