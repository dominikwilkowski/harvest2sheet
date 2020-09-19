const format = require('date-fns/format');
const { google } = require('googleapis');
const { mark } = require('./log.js');

const sheets = google.sheets('v4');

/**
 * Retrieve the access token from google
 *
 * @param  {object} oauth2Client - The auth object instance
 *
 * @return {string}              - The access token
 */
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

/**
 * Clear a spreadsheet
 *
 * @param  {object} options - The options for clearing the sheet
 */
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

/**
 * Enter data into a sheet
 *
 * @param  {object} options - The options for entering data
 */
function enterData(options) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.append(options, (error, response) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
}

/**
 * Batch update data into sheet
 *
 * @param  {object} options - The options for entering data
 */
function batchUpdate(options) {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.batchUpdate(options, (error, response) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
}

/**
 * Updating a google sheet with data
 *
 * @param  {object} projectSettings - This projects settings
 * @param  {array}  data            - The data to be entered in a nested array
 * @param  {number} project         - The index of the loop
 * @param  {number} projects        - The length of all projects
 *
 * @return {string|null}            - A string of errors if there are any
 */
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

		const tabName = `H|${format(projectSettings.fromDate, `LLL`)}'${format(
			projectSettings.fromDate,
			`yy`
		)}`;

		// creating a new tab
		try {
			await batchUpdate({
				spreadsheetId: projectSettings.spreadsheetID,
				auth: oauth2Client,
				resource: {
					requests: [
						{
							addSheet: {
								properties: {
									title: tabName,
									tabColor: {
										red: 155,
										green: 155,
										blue: 155,
									},
								},
							},
						},
					],
				},
			});
		} catch (error) {
			/* ignoring if the tab already exists*/
		}

		try {
			await clearSheet({
				spreadsheetId: projectSettings.spreadsheetID,
				range: `${tabName}!A1:ZZZ9999`,
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
						range: tabName,
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
