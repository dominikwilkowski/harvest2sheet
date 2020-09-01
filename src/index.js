const { getHarvestData } = require('./harvest.js');
const { updateSheet } = require('./sheets.js');
const { SETTINGS } = require('./settings.js');
const { mark } = require('./log.js');
const chalk = require('chalk');

function harvestSync() {
	const projects = Object.entries(SETTINGS.tasks);
	projects.map(async ([name, settings], i) => {
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
			harvestData = await getHarvestData(projectSettings);
			mark.ok(4, i, projects.length);
		} catch (error) {
			mark.fail(4, i, projects.length);
		}

		try {
			await updateSheet(projectSettings, harvestData, i, projects.length);
			mark.ok(1, i, projects.length);
		} catch (error) {
			mark.fail(1, i, projects.length);
		}
	});
}

module.exports = {
	harvestSync,
};
