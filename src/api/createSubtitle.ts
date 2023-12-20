import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { Subtitle } from '../types/Subtitle';

export async function createSubtitle(input: FormData): Promise<Subtitle> {
	try {
		const url = `${PUBLIC_API_BASE_URL}/subtitle/create`;
		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		const response = await axios.post<Subtitle>(url, input, config);

		if (response.status === 201) {
			return response.data;
		}

		throw new Error(`Subtitle creation failed: ${response.status}`);
	} catch (error) {
		let errorMsg = 'Error in subtitle upload: ';
		if (axios.isAxiosError(error)) {
			errorMsg += error.response?.data || 'unknown error';
		} else if (error instanceof Error) {
			errorMsg += error.message;
		} else {
			errorMsg += 'unexpected error type';
		}
		throw new Error(errorMsg);
	}
}
