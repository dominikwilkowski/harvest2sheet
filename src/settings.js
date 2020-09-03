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
			)}" by running "${chalk.bold('harvest2sheet login')}".`
		)
	);
	process.exit(1);
}

if (!SETTINGS.HARVEST_ACCESS_TOKEN) {
	console.error(chalk.red('Missing entry "HARVEST_ACCESS_TOKEN" in your project.json'));
	process.exit(1);
}
if (!SETTINGS.HARVEST_ACCOUNT_ID) {
	console.error(chalk.red('Missing entry "HARVEST_ACCOUNT_ID" in your project.json'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_ID) {
	console.error(chalk.red('Missing entry "GOOGLE_ID" in your project.json'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_SECRET) {
	console.error(chalk.red('Missing entry "GOOGLE_SECRET" in your project.json'));
	process.exit(1);
}
if (!SETTINGS.GOOGLE_REFRESH_TOKEN) {
	console.error(chalk.red('Missing entry "GOOGLE_REFRESH_TOKEN" in your project.json'));
	process.exit(1);
}

Object.entries(SETTINGS.tasks).map(async ([name, settings]) => {
	if (!settings.spreadsheetID) {
		console.error(
			chalk.red(`Missing entry "spreadsheetID" inside "${name}" task in your project.json`)
		);
		process.exit(1);
	}
	if (!settings.tabName) {
		console.error(chalk.red(`Missing entry "tabName" inside "${name}" task in your project.json`));
		process.exit(1);
	}
	if (!settings.harvestProject) {
		console.error(
			chalk.red(`Missing entry "harvestProject" inside "${name}" task in your project.json`)
		);
		process.exit(1);
	}
	if (!settings.from) {
		console.error(chalk.red(`Missing entry "from" inside "${name}" task in your project.json`));
		process.exit(1);
	}
	if (!settings.to) {
		console.error(chalk.red(`Missing entry "to" inside "${name}" task in your project.json`));
		process.exit(1);
	}
});

if (SETTINGS.output && !Array.isArray(SETTINGS.output)) {
	console.error(chalk.red('The "output" needs to be an array in your project.json'));
	process.exit(1);
}

module.exports = {
	SETTINGS,
};
