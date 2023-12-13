import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { Subtitle } from '../types/Subtitle';

export async function createSubtitle(input: FormData): Promise<Subtitle> {
	//TODO: add validation
	const baseUrl = PUBLIC_API_BASE_URL;
	const headers = {
		'Content-Type': 'multipart/form-data'
	};

	const response = await axios.post<Subtitle>(`${baseUrl}/subtitle/create`, input, { headers });

	if (!response || response.status !== 201) {
		throw new Error('Failed to upload subtitle');
	}

	return response.data;
}
