const lastDayOfMonth = require('date-fns/lastDayOfMonth');
const format = require('date-fns/format');
const axios = require('axios');

function clean(text) {
	if (!text) {
		return '';
	}
	return text.toString().replace(/\n/g, ' ').replace(/,/g, ' ');
}

async function getHarvestData(projectSettings) {
	const fromTime = new Date(2020, 7);
	const toTime = lastDayOfMonth(new Date(2020, 7, 1, 23, 59, 59));
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

	const {
		data: { time_entries: data },
	} = await axios.get(url, {
		params: {
			from: format(fromTime, 'yyyyMMdd'),
			to: format(toTime, 'yyyyMMdd'),
			project_id: 25774345,
		},
		headers: {
			Authorization: `Bearer ${projectSettings.HARVEST_ACCESS_TOKEN}`,
			'Harvest-Account-Id': projectSettings.HARVEST_ACCOUNT_ID,
			'User-Agent': 'HarvestSync',
		},
	});

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

	return csv;
}

module.exports = {
	getHarvestData,
};
