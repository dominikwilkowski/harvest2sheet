const parseISO = require('date-fns/parseISO');
const querystring = require('querystring');
const format = require('date-fns/format');
const https = require('https');

/**
 * Make a request to the harvest API
 *
 * @param  {string} path            - The path of the API route
 * @param  {object} params          - The parameters to be encoded as query string
 * @param  {object} projectSettings - This projects settings
 *
 * @return {object}                 - The returning data
 */
function makeRequest(path, params, projectSettings) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'api.harvestapp.com',
			path: `${path}?${querystring.stringify(params)}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${projectSettings.HARVEST_ACCESS_TOKEN}`,
				'Harvest-Account-Id': projectSettings.HARVEST_ACCOUNT_ID,
				'User-Agent': 'HarvestSync',
			},
		};

		https
			.request(options, (response) => {
				let data = '';

				response.on('data', (chunk) => {
					data += chunk;
				});

				response.on('end', () => {
					resolve(JSON.parse(data));
				});
			})
			.on('error', (error) => {
				reject(error);
			})
			.end();
	});
}

/**
 * Get time entries out of harvest between two points in time
 *
 * @param  {object} projectSettings - This projects settings
 *
 * @return {array}                  - The time entries
 */
async function getHarvestData(projectSettings) {
	const errors = [];
	const fromTime = parseISO(projectSettings.from);
	const toTime = parseISO(projectSettings.to);
	const url = 'https://api.harvestapp.com/v2/time_entries';
	const outputMap = {
		date: {
			name: 'Date',
			value: (item) => item.spent_date,
		},
		hours: {
			name: 'Hours',
			value: (item) => item.hours,
		},
		rounded_hours: {
			name: 'Rounded Hours',
			value: (item) => item.rounded_hours,
		},
		notes: {
			name: 'Notes',
			value: (item) => item.notes,
		},
		locked: {
			name: 'Locked',
			value: (item) => (item.is_locked ? 'Yes' : 'No'),
		},
		locked_reason: {
			name: 'Locked Reason',
			value: (item) => item.locked_reason,
		},
		closed: {
			name: 'Closed',
			value: (item) => (item.is_closed ? 'Yes' : 'No'),
		},
		billed: {
			name: 'Billed',
			value: (item) => (item.is_billed ? 'Yes' : 'No'),
		},
		timer_started_at: {
			name: 'Timer Started At',
			value: (item) => item.timer_started_at,
		},
		started_time: {
			name: 'Started Timer',
			value: (item) => item.started_time,
		},
		ended_time: {
			name: 'Ended Timer',
			value: (item) => item.ended_time,
		},
		running: {
			name: 'Running',
			value: (item) => (item.is_running ? 'Yes' : 'No'),
		},
		billable: {
			name: 'Billable',
			value: (item) => item.billable,
		},
		budgeted: {
			name: 'Budgeted',
			value: (item) => item.budgeted,
		},
		billable_rate: {
			name: 'Billable Rate',
			value: (item) => item.billable_rate,
		},
		billable_amount: {
			name: 'Billable Amount',
			value: (item) => item.rounded_hours * item.billable_rate,
		},
		cost_rate: {
			name: 'Cost Rate',
			value: (item) => item.cost_rate,
		},
		cost_amount: {
			name: 'Cost Amount',
			value: (item) => item.rounded_hours * item.cost_rate,
		},
		created_at: {
			name: 'Created At',
			value: (item) => format(parseISO(item.created_at), 'yyyy-MM-dd'),
		},
		updated_at: {
			name: 'Updated At',
			value: (item) => item.updated_at,
		},
		user: {
			name: 'User',
			value: (item) => item.user.name,
		},
		client: {
			name: 'Client',
			value: (item) => item.client.name,
		},
		currency: {
			name: 'Currency',
			value: (item) => item.client.currency,
		},
		project: {
			name: 'Project',
			value: (item) => item.project.name,
		},
		project_code: {
			name: 'Project Code',
			value: (item) => item.project.code,
		},
		task: {
			name: 'Task',
			value: (item) => item.task.name,
		},
	};

	const csv = [projectSettings.output.map((item) => outputMap[item].name)];

	let data;
	try {
		const { time_entries } = await makeRequest(
			'/v2/time_entries',
			{
				from: format(fromTime, 'yyyyMMdd'),
				to: format(toTime, 'yyyyMMdd'),
				project_id: projectSettings.harvestProject,
			},
			projectSettings
		);
		data = time_entries;
	} catch (error) {
		errors.push(error);
	}

	data.reverse().map((entry) => {
		csv.push(projectSettings.output.map((item) => outputMap[item].value(entry)));
	});

	return {
		csv,
		errors: errors.length ? errors.join('\n') : null,
	};
}

module.exports = {
	getHarvestData,
};
