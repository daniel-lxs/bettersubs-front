export interface CreateSubtitleInput {
	file: File;
	releaseName: string;
	comments?: string;
	language: string;
	imdbId: string;
	seasonNumber?: string;
	episodeNumber?: string;
}
