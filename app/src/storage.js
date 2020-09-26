const OUTPUT_KEY = 'harvest2sheetOutputs';
const SHEETS_KEY = 'harvest2sheetSheets';
const LOGIN_KEY = 'harvest2sheetLogin';

/**
 * Retrieve data from localStorage
 *
 * @param  {string} key        - The key of the data entry
 * @param  {string} defaultVal - The default value fallback
 *
 * @return {any}               - The data
 */
function getFromStorage(key, defaultVal) {
	const locallyStored = localStorage.getItem(key) || defaultVal;
	try {
		return JSON.parse(locallyStored);
	} catch (_) {
		return {};
	}
}

/**
 * Write to localStorage
 *
 * @param  {string} key  - The key of the data entry
 * @param  {any}    data - The data to be stored
 */
function writeToStorage(key, data) {
	if (typeof data !== 'object') {
		throw new Error(`Data to be written to storage is not an object but "${typeof data}"`);
	}
	localStorage.setItem(key, JSON.stringify(data));
}

export function getLogin() {
	return getFromStorage(LOGIN_KEY, '{}');
}

export function writeLogin(data) {
	writeToStorage(LOGIN_KEY, data);
}

export function getSheets() {
	return getFromStorage(SHEETS_KEY, '[]');
}

export function writeSheets(data) {
	writeToStorage(SHEETS_KEY, data);
}

export function getOutput() {
	return getFromStorage(OUTPUT_KEY, '[]');
}

export function writeOutput(data) {
	writeToStorage(OUTPUT_KEY, data);
}
