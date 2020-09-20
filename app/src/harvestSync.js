import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import parseISO from 'date-fns/parseISO';
import endOfDay from 'date-fns/endOfDay';
import isDate from 'date-fns/isDate';
import format from 'date-fns/format';

import { harvestKeys } from './harvestKeys';

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
		await response.json();
	} catch (error) {
		throw new Error('Harvest login failed. Please check your credentials.');
	}
}

/**
 * Get time entries out of harvest between two points in time
 *
 * @param  {object} projectSettings - This projects settings
 *
 * @return {array}                  - The time entries
 */
export async function harvestSync(LOGIN, harvestProject, date) {
	const errors = [];
	const fromDate = parseISO(`${date}-01T00:00:00.000Z`);
	if (!isDate(fromDate) || fromDate.toString() === 'Invalid Date') {
		console.error('The date passed in is not valid');
		return;
	}
	const toDate = endOfDay(lastDayOfMonth(fromDate));

	const output = [
		// TODO
		'date',
		'user',
		'client',
		'project',
		'task',
		'hours',
		'rounded_hours',
		'notes',
		'billable_rate',
		'billable_amount',
		'cost_rate',
		'cost_amount',
		'currency',
	];

	const csv = [output.map((item) => (harvestKeys[item] ? harvestKeys[item].name : 'unknown'))];

	try {
		const response = await fetch(
			`https://api.harvestapp.com/v2/time_entries?from=${format(fromDate, 'yyyyMMdd')}&to=${format(
				toDate,
				'yyyyMMdd'
			)}&project_id=${harvestProject}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
					'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
					'User-Agent': 'Harvest2Sheet',
				},
			}
		);
		const { time_entries } = await response.json();

		time_entries.reverse().forEach((entry) => {
			csv.push(output.map((item) => (harvestKeys[item] ? harvestKeys[item].value(entry) : '')));
		});
	} catch (error) {
		errors.push(error);
	}

	return {
		csv,
		errors: errors.length ? errors.join('\n') : null,
	};
}
