import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { SearchSubtitlesInput } from '../types/SearchSubtitlesInput';
import type { Subtitle } from '../types/Subtitle';

export async function searchSubtitles(input: SearchSubtitlesInput): Promise<Subtitle[]> {
	try {
		const baseUrl = PUBLIC_API_BASE_URL;
		const response = await axios.post<Subtitle[]>(`${baseUrl}/subtitle/search`, input);
		return response.status === 200 ? response.data : [];
	} catch (error) {
		console.error('Error searching subtitles:', error);
		return [];
	}
}
