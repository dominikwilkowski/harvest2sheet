const chalk = require('chalk');

/**
 * An object with login methods that allows us to tick things of async
 *
 * @type {Object}
 */
const mark = {
	errors: {}, // we keep track if a project has already failed
	ok: (position, project, projects) => {
		if (mark.errors[project]) {
			mark.fail(position, project, projects);
		} else {
			const offset = position + 6 * (projects - (project + 1));
			process.stdout.write(
				`\u001b[${offset}A\u001b[${9}G${chalk.bgGreen.bold('  OK  ')}\u001b[${offset}B\u001b[1G`
			);
		}
	},
	fail: (position, project, projects) => {
		mark.errors[project] = true;
		const offset = position + 6 * (projects - (project + 1));
		process.stdout.write(
			`\u001b[${offset}A\u001b[${9}G${chalk.bgRed.bold(' FAIL ')}\u001b[${offset}B\u001b[1G`
		);
	},
};

module.exports = {
	mark,
};
