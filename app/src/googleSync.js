/**
 * Create tab
 *
 * @param  {string} spreadsheetID - The spreadsheet ID to be updated
 * @param  {string} tabName       - The name of the tab inside the spreadsheet
 */
async function createTab(spreadsheetID, tabName) {
	try {
		await window.gapi.client.sheets.spreadsheets.batchUpdate({
			spreadsheetId: spreadsheetID,
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
	} catch (error) {}
}

/**
 * Clear a spreadsheet tab
 *
 * @param  {string} spreadsheetID - The spreadsheet ID to be updated
 * @param  {string} tabName       - The name of the tab inside the spreadsheet
 */
async function clearSheet(spreadsheetID, tabName) {
	await window.gapi.client.sheets.spreadsheets.values.clear({
		spreadsheetId: spreadsheetID,
		range: `${tabName}!A1:ZZZ9999`,
	});
}

/**
 * Enter data into a sheet tab
 *
 * @param  {string} spreadsheetID - The spreadsheet ID to be updated
 * @param  {string} tabName       - The name of the tab inside the spreadsheet
 * @param  {array}  data          - The data to be entered in a nested array
 */
async function enterData(spreadsheetID, tabName, data) {
	return await window.gapi.client.sheets.spreadsheets.values.append({
		spreadsheetId: spreadsheetID,
		range: tabName,
		valueInputOption: 'RAW',
		insertDataOption: 'OVERWRITE',
		resource: {
			values: data,
		},
	});
}

function initClient(LOGIN) {
	return new Promise((resolve, reject) => {
		window.gapi.load('client:auth2', async () => {
			await window.gapi.client.init({
				apiKey: LOGIN.GOOGLE_API_KEY,
				clientId: LOGIN.GOOGLE_CLIENT_ID,
				discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
				scope: 'https://www.googleapis.com/auth/spreadsheets',
			});
			resolve();
		});
	});
}

/**
 * Updating a google sheet with data
 *
 * @param  {object} LOGIN         - The login object
 * @param  {string} spreadsheetID - The spreadsheet ID to be updated
 * @param  {string} date          - A date within the range to extract year and month from
 * @param  {array}  data          - The data to be entered in a nested array
 * @param  {string} tabName       - The name of the tab inside the spreadsheet
 */
export async function googleSync(LOGIN, spreadsheetID, date, data, tabName) {
	await initClient(LOGIN);
	await createTab(spreadsheetID, tabName);
	await clearSheet(spreadsheetID, tabName);
	await enterData(spreadsheetID, tabName, data);
}
