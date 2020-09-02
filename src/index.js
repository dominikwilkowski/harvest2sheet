const { getHarvestData } = require('./harvest.js');
const { updateSheet } = require('./sheets.js');
const { login } = require('./login.js');
const { mark } = require('./log.js');
const chalk = require('chalk');

function harvest2sheet() {
	if (process.argv.includes('login')) {
		login();
	} else {
		sync();
	}
}

async function sync() {
	const { SETTINGS } = require('./settings.js');

	let errors = '';
	const projects = Object.entries(SETTINGS.tasks);
	const allTasks = [];

	await Promise.all(
		projects.map(async ([name, settings], i) => {
			const projectErrors = [];
			console.log();
			console.log(`Running ${chalk.bold(name)}`);
			console.log('               Data fetching from Harvest');
			console.log('               Google Sheet cleared');
			console.log('               Entered data into Google sheet');
			console.log('               Task finished');

			const projectSettings = {
				HARVEST_ACCESS_TOKEN: SETTINGS.HARVEST_ACCESS_TOKEN,
				HARVEST_ACCOUNT_ID: SETTINGS.HARVEST_ACCOUNT_ID,
				GOOGLE_ID: SETTINGS.GOOGLE_ID,
				GOOGLE_SECRET: SETTINGS.GOOGLE_SECRET,
				GOOGLE_REFRESH_TOKEN: SETTINGS.GOOGLE_REFRESH_TOKEN,
				...settings,
			};

			let harvestData;
			try {
				const { csv, errors: harvestErrors } = await getHarvestData(projectSettings);
				harvestData = csv;
				if (harvestErrors) {
					projectErrors.push(harvestErrors);
				}
				mark.ok(4, i, projects.length);
			} catch (error) {
				mark.fail(4, i, projects.length);
				projectErrors.push(error);
			}

			try {
				const sheetsErrors = await updateSheet(projectSettings, harvestData, i, projects.length);
				mark.ok(1, i, projects.length);
				if (sheetsErrors) {
					projectErrors.push(sheetsErrors);
				}
			} catch (error) {
				mark.fail(1, i, projects.length);
				projectErrors.push(error);
			}

			if (projectErrors.length) {
				errors += `Found errors in project "${chalk.bold(name)}"\n${chalk.red(
					projectErrors.join('\n')
				)}`;
			}
		})
	);

	if (errors) {
		console.error(`\n${errors}`);
	}
	console.log();
}

module.exports = {
	harvest2sheet,
};
