const { google } = require('googleapis');
const readline = require('readline');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function question(question, rl) {
	return new Promise((resolve, reject) => {
		rl.question(question, (input) => {
			resolve(input);
		});
	});
}

function getToken(oAuth2Client, accessToken) {
	return new Promise((resolve, reject) => {
		oAuth2Client.getToken(accessToken, (error, token) => {
			if (error) {
				reject(
					chalk.red(
						`Error while trying to retrieve access token\n${error.response.data.error_description}`
					)
				);
			} else {
				oAuth2Client.setCredentials(token);
				resolve(token.refresh_token);
			}
		});
	});
}

async function login() {
	const rl = readline
		.createInterface({
			input: process.stdin,
			output: process.stdout,
		})
		.on('close', () => {
			console.log(); // We log an empty string so when the program was terminated we don't misalign out cursor
		});

	const projectFile = path.normalize(`${process.cwd()}/project.json`);

	if (fs.existsSync(projectFile)) {
		const deleteFile = await question(
			`\nA "${chalk.bold(
				'project.json'
			)}" file already exists in this directory.\nDo you want to replace it with a new one? (yes/no) `,
			rl
		);
		if (deleteFile.toLowerCase() !== 'yes') {
			console.log();
			process.exit(0);
		}
	}

	console.log('\nTo setup your login you will need to do a couple things manually:\n');
	console.log('  Log into https://id.getharvest.com/developers');
	console.log(`  And create a "${chalk.bold('Personal Access Tokens')}"\n`);

	const harvestAccessToken = await question(
		`Copy the "${chalk.bold('Your Token')}" and paste it here: `,
		rl
	);
	const harvestAccountID = await question(
		`Copy the "${chalk.bold('Account ID')}" and paste it here: `,
		rl
	);

	console.log(
		'\n  Now log into google with your Thinkmill account and visit https://developers.google.com/sheets/api/quickstart/nodejs'
	);
	console.log(`  Click the blue button "${chalk.bold('Enable the Google Sheets API')}"`);
	console.log(`  Choose "${chalk.bold('Desktop app')}" and click "${chalk.bold('Create')}"\n`);

	const googleID = await question(`Copy the "${chalk.bold('Client ID')}" and paste it here: `, rl);
	const googleSecret = await question(
		`Copy the "${chalk.bold('Client Secret')}" and paste it here: `,
		rl
	);

	const oAuth2Client = new google.auth.OAuth2(googleID, googleSecret, 'urn:ietf:wg:oauth:2.0:oob');
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/spreadsheets'],
	});

	console.log(`\n  Now please authorize this app by visiting:\n  ${authUrl}\n`);
	const accessToken = await question(`Copy the "${chalk.bold('code')}" and paste it here: `, rl);
	let googleRefreshToken;
	try {
		googleRefreshToken = await getToken(oAuth2Client, accessToken);
	} catch (error) {
		console.error(error);
		rl.close();
	}

	fs.writeFileSync(
		projectFile,
		JSON.stringify(
			{
				HARVEST_ACCESS_TOKEN: harvestAccessToken,
				HARVEST_ACCOUNT_ID: harvestAccountID,
				GOOGLE_ID: googleID,
				GOOGLE_SECRET: googleSecret,
				GOOGLE_REFRESH_TOKEN: googleRefreshToken,
				tasks: {
					project1: {
						harvestProject: 123,
						from: '2020-08-01T00:00:00',
						to: '2020-08-31T23:59:59',
						spreadsheetID: 'your spredsheet ID',
						tabName: 'your tab name',
					},
				},
			},
			null,
			'\t'
		),
		{ encoding: 'utf8' }
	);

	if (googleRefreshToken) {
		console.log(
			`\n${chalk.green(
				`The "${chalk.bold('project.json')}" was successfully created.`
			)}\nYou can now add your tasks into it and run "${chalk.bold('harvestsync')}"`
		);
	}

	rl.close();
}

module.exports = {
	login,
};
