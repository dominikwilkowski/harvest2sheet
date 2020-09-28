import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import parseISO from 'date-fns/parseISO';
import endOfDay from 'date-fns/endOfDay';
import isDate from 'date-fns/isDate';
import format from 'date-fns/format';

import { harvestKeys } from './harvestKeys';

/**
 * Check the login credentials with the Harvest API
 *
 * @param  {object} LOGIN - The login object
 *
 * @return {object}       - The API object which contains data about my profile
 */
export async function harvestLogin(LOGIN) {
	try {
		const response = await fetch(`https://api.harvestapp.com/v2/users/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
				'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
				'User-Agent': 'Harvest2Sheet',
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error('Harvest login failed. Please check your credentials.');
	}
}

/**
 * Get the name of a project in Harvest
 *
 * @param  {object} LOGIN   - The login object
 * @param  {number} project - The Harvest client ID
 *
 * @return {object}         - The return object of the Harvest API
 */
export async function getProjectName(LOGIN, project) {
	try {
		const response = await fetch(`https://api.harvestapp.com/v2/projects/${project}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
				'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
				'User-Agent': 'Harvest2Sheet',
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error('Harvest sync failed. Please check your credentials.');
	}
}

/**
 * Get the name of a client in Harvest
 *
 * @param  {object} LOGIN  - The login object
 * @param  {number} client - The Harvest client ID
 *
 * @return {object}        - The return object of the Harvest API
 */
export async function getClientName(LOGIN, client) {
	try {
		const response = await fetch(`https://api.harvestapp.com/v2/clients/${client}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
				'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
				'User-Agent': 'Harvest2Sheet',
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error('Harvest sync failed. Please check your credentials.');
	}
}

async function getTimeEntries(LOGIN, fromDate, toDate, apiCall, harvestID, page = 1) {
	try {
		const response = await fetch(
			`https://api.harvestapp.com/v2/time_entries?from=${fromDate}&to=${toDate}&${apiCall}=${harvestID}&page=${page}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
					'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
					'User-Agent': 'Harvest2Sheet',
				},
			}
		);
		const { time_entries, total_pages } = await response.json();

		return {
			timeEntries: time_entries,
			totalPages: parseInt(total_pages),
		};
	} catch (error) {
		return error;
	}
}

/**
 * Get time entries out of harvest between two points in time
 *
 * @param  {object} LOGIN     - The login object
 * @param  {number} harvestID - The harvest ID for either the project or the client
 * @param  {string} date      - The date in YYYY-MM format
 * @param  {number} output    - The ID of the output to be used
 * @param  {string} apiCall   - The API call to be used with the harvestID
 *
 * @return {object}           - An object with csv and errors key
 */
export async function harvestSync(LOGIN, harvestID, date, output, apiCall = 'project_id') {
	const errors = [];
	const fromDate = parseISO(`${date}-01T00:00:00.000Z`);
	if (!isDate(fromDate) || fromDate.toString() === 'Invalid Date') {
		console.error('The date passed in is not valid');
		return;
	}
	const toDate = endOfDay(lastDayOfMonth(fromDate));

	let csv = [output.map((item) => (harvestKeys[item] ? harvestKeys[item].name : 'unknown'))];

	try {
		const { timeEntries, totalPages } = await getTimeEntries(
			LOGIN,
			format(fromDate, 'yyyyMMdd'),
			format(toDate, 'yyyyMMdd'),
			apiCall,
			harvestID
		);

		let allPages = [...timeEntries];

		if (totalPages > 1) {
			await Promise.all(
				Array(totalPages - 1)
					.fill()
					.map(async (_, page) => {
						const { timeEntries } = await getTimeEntries(
							LOGIN,
							format(fromDate, 'yyyyMMdd'),
							format(toDate, 'yyyyMMdd'),
							apiCall,
							harvestID,
							page + 2
						);

						allPages = [...allPages, ...timeEntries];
					})
			);
		}

		allPages = allPages
			.sort(
				(a, b) =>
					parseInt(a.spent_date.replace(/-/g, '')) - parseInt(b.spent_date.replace(/-/g, ''))
			)
			.map((entry) =>
				output.map((item) => (harvestKeys[item] ? harvestKeys[item].value(entry) : ''))
			);

		csv = [...csv, ...allPages];
	} catch (error) {
		errors.push(error);
	}

	return {
		csv,
		errors: errors.length ? errors.join('\n') : null,
	};
}
