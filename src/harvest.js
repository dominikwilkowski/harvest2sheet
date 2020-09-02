const parseISO = require('date-fns/parseISO');
const querystring = require('querystring');
const format = require('date-fns/format');
const https = require('https');

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

function clean(text) {
	if (!text) {
		return '';
	}
	return text.toString().replace(/\n/g, ' ').replace(/,/g, ' ');
}

async function getHarvestData(projectSettings) {
	const errors = [];
	const fromTime = parseISO(projectSettings.from);
	const toTime = parseISO(projectSettings.to);
	const url = 'https://api.harvestapp.com/v2/time_entries';
	let csv = [
		[
			'Date',
			'Client',
			'Project',
			'Project Code',
			'Task',
			'Notes',
			'Hours',
			'Hours Rounded',
			'Billable?',
			'Invoiced?',
			'First Name',
			'Last Name',
			'Roles',
			'Employee?',
			'Billable Rate',
			'Billable Amount',
			'Cost Rate',
			'Cost Amount',
			'Currency',
			'External Reference URL',
		],
	];

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
		const newLine = [];
		/* Date                   */ newLine.push(clean(entry.spent_date));
		/* Client                 */ newLine.push(clean(entry.client.name));
		/* Project                */ newLine.push(clean(entry.project.name));
		/* Project Code           */ newLine.push(clean(entry.project.node));
		/* Task                   */ newLine.push(clean(entry.task.name));
		/* Notes                  */ newLine.push(clean(entry.notes));
		/* Hours                  */ newLine.push(clean(entry.hours));
		/* Hours Rounded          */ newLine.push(clean(entry.rounded_hours));
		/* Billable?              */ newLine.push(clean(entry.billable ? 'Yes' : 'No'));
		/* Invoiced?              */ newLine.push(clean(entry.invoiced ? 'Yes' : 'No'));
		/* First Name             */ newLine.push(clean(entry.user.name));
		/* Last Name              */ newLine.push(clean(entry.user.name));
		/* Roles                  */ newLine.push(clean('TM Production'));
		/* Employee?              */ newLine.push(clean('Maybe'));
		/* Billable Rate          */ newLine.push(clean(entry.billable_rate));
		/* Billable Amount        */ newLine.push(clean(entry.rounded_hours * entry.billable_rate));
		/* Cost Rate              */ newLine.push(clean(entry.cost_rate));
		/* Cost Amount            */ newLine.push(clean(entry.rounded_hours * entry.cost_rate));
		/* Currency               */ newLine.push(clean('Australian Dollar - AUD'));
		/* External Reference URL */ newLine.push(clean(''));
		csv.push(newLine);
	});

	return {
		csv,
		errors: errors.length ? errors.join('\n') : null,
	};
}

module.exports = {
	getHarvestData,
};
