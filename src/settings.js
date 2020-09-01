const chalk = require('chalk');
const path = require('path');

const SETTINGS = require(path.normalize(`${process.cwd()}/project.json`));

Object.entries(SETTINGS).map(async ([name, settings]) => {
	if (!settings.HARVEST_ACCESS_TOKEN) {
		console.error(
			chalk.red(`Missing project entry "HARVEST_ACCESS_TOKEN" inside "${name}" project`)
		);
		process.exit(1);
	}
	if (!settings.HARVEST_ACCOUNT_ID) {
		console.error(chalk.red(`Missing project entry "HARVEST_ACCOUNT_ID" inside "${name}" project`));
		process.exit(1);
	}
	if (!settings.GOOGLE_ID) {
		console.error(chalk.red(`Missing project entry "GOOGLE_ID" inside "${name}" project`));
		process.exit(1);
	}
	if (!settings.GOOGLE_SECRET) {
		console.error(chalk.red(`Missing project entry "GOOGLE_SECRET" inside "${name}" project`));
		process.exit(1);
	}
	if (!settings.GOOGLE_REFRESH_TOKEN) {
		console.error(
			chalk.red(`Missing project entry "GOOGLE_REFRESH_TOKEN" inside "${name}" project`)
		);
		process.exit(1);
	}
	if (!settings.GOOGLE_SPREADSHEET_ID) {
		console.error(
			chalk.red(`Missing project entry "GOOGLE_SPREADSHEET_ID" inside "${name}" project`)
		);
		process.exit(1);
	}
	if (!settings.GOOGLE_SPREADSHEET_TAB) {
		console.error(
			chalk.red(`Missing project entry "GOOGLE_SPREADSHEET_TAB" inside "${name}" project`)
		);
		process.exit(1);
	}
});

module.exports = {
	SETTINGS,
};
