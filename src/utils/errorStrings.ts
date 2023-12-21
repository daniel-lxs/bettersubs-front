export const validationErrors = {
	imdbId: {
		required: 'Please enter a valid IMDb ID',
		invalid: 'Invalid IMDb ID'
	},
	episodeNumber: {
		required: 'Please enter an episode number',
		invalid: 'Please enter a valid episode number'
	},
	seasonNumber: {
		required: 'Please enter a season number',
		invalid: 'Please enter a valid season number'
	},
	releaseName: {
		required: 'Please enter a release name'
	},
	file: {
		required: 'Please select a file'
	}
};

export const exceptions = {
	unknown: {
		title: 'Something Went Wrong',
		message: 'An unknown error occurred. Please try again later.'
	},
	upload: {
		title: 'Upload Failed',
		message: 'An unknown error occurred while uploading. Please try again later.'
	},
	subtitles: {
		notFound: {
			title: 'No Subtitles Found',
			message: 'No subtitles were found for the given criteria'
		}
	}
};
