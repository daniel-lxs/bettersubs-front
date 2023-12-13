export function formatFileSize(size: number) {
	const kbSize = (size / 1024).toFixed(2);
	return `${kbSize} KB`;
}
