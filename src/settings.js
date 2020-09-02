const chalk = require('chalk');
const path = require('path');

let SETTINGS;
try {
	SETTINGS = require(path.normalize(`${process.cwd()}/project.json`));
} catch (error) {
	console.error(
		chalk.red(
			`Was not able to open the "${chalk.bold(
				'project.json'
			)}".\nMake sure you have that file in the same folder you run this app in.\nYou can create a new "${chalk.bold(
				'project.json'
			)}" by running "${chalk.bold('harvestsync login')}".`
		)
	);
	process.exit(1);
}

if (!SETTINGS.HARVEST_ACCESS_TOKEN) {
	console.error(chalk.red('Missing project entry "HARVEST_ACCESS_TOKEN"'));
	process.exit(1);
}
if (!SETTINGS.HARVEST_ACCOUNT_ID) {
	console.error(chalk.red('Missing project entry "HARVEST_ACCOUNT_ID"'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_ID) {
	console.error(chalk.red('Missing project entry "GOOGLE_ID"'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_SECRET) {
	console.error(chalk.red('Missing project entry "GOOGLE_SECRET"'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_REFRESH_TOKEN) {
	console.error(chalk.red('Missing project entry "GOOGLE_REFRESH_TOKEN"'));
	process.exit(1);
}

Object.entries(SETTINGS.tasks).map(async ([name, settings]) => {
	if (!settings.spreadsheetID) {
		console.error(chalk.red(`Missing project entry "spreadsheetID" inside "${name}" project`));
		process.exit(1);
	}
	if (!settings.tabName) {
		console.error(chalk.red(`Missing project entry "tabName" inside "${name}" project`));
		process.exit(1);
	}
});

module.exports = {
	SETTINGS,
};
