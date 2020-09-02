const { google } = require('googleapis');
const { mark } = require('./log.js');

const sheets = google.sheets('v4');

function getOauth(oauth2Client) {
	return new Promise((resolve, reject) => {
		oauth2Client.refreshAccessToken((error, tokens) => {
			if (error) {
				reject(error);
			}

			resolve(tokens.access_token);
		});
	});
}

function clearSheet(options) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.clear(options, (error, response) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
}

function enterData(options, data) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.append(options, (error, response) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
}

function updateSheet(projectSettings, data, project, projects) {
	return new Promise(async (resolve, reject) => {
		const errors = [];

		const oauth2Client = new google.auth.OAuth2(
			projectSettings.GOOGLE_ID,
			projectSettings.GOOGLE_SECRET
		);

		oauth2Client.setCredentials({
			refresh_token: projectSettings.GOOGLE_REFRESH_TOKEN,
		});

		let tokens;
		try {
			tokens = await getOauth(oauth2Client);
		} catch (error) {
			errors.push(error);
			reject(errors.join('\n'));
		}

		oauth2Client.setCredentials({
			access_token: tokens,
		});

		try {
			await clearSheet({
				spreadsheetId: projectSettings.spreadsheetID,
				range: `${projectSettings.tabName}!A1:ZZZ9999`,
				auth: oauth2Client,
			});
			mark.ok(3, project, projects);
		} catch (error) {
			errors.push(error);
			mark.fail(3, project, projects);
			mark.fail(2, project, projects);
			reject(errors.join('\n'));
		}

		if (!errors.length) {
			try {
				await enterData(
					{
						spreadsheetId: projectSettings.spreadsheetID,
						range: projectSettings.tabName,
						valueInputOption: 'RAW',
						insertDataOption: 'OVERWRITE',
						resource: {
							values: data,
						},
						auth: oauth2Client,
					},
					data
				);
				mark.ok(2, project, projects);
			} catch (error) {
				errors.push(error);
				mark.fail(2, project, projects);
				reject(errors.join('\n'));
			}
		}

		if (!errors.length) {
			resolve(errors.length ? errors.join('\n') : null);
		}
	});
}

module.exports = {
	updateSheet,
};
