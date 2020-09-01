const { getHarvestData } = require('./harvest.js');
const { updateSheet } = require('./sheets.js');
const { SETTINGS } = require('./settings.js');
const { mark } = require('./log.js');
const chalk = require('chalk');

function harvestSync() {
	const projects = Object.entries(SETTINGS);
	projects.map(async ([name, settings], i) => {
		console.log(`Running ${chalk.bold(name)}`);
		console.log('               Data fetching from Harvest');
		console.log('               Google Sheet cleared');
		console.log('               Entered data into Google sheet');
		console.log('               Task finished');

		let harvestData;
		try {
			harvestData = await getHarvestData(settings);
			mark.ok(4, i, projects.length);
		} catch (error) {
			mark.fail(4, i, projects.length);
		}

		try {
			await updateSheet(settings, harvestData, i, projects.length);
			mark.ok(1, i, projects.length);
		} catch (error) {
			mark.fail(1, i, projects.length);
		}
	});
}

module.exports = {
	harvestSync,
};
