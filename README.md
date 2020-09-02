# HarvestSync

Allows you to download time sheet data from a project within [Harvest](https://www.getharvest.com/) into [Google sheets](https://docs.google.com/spreadsheets).

<p align="center"><img src="https://raw.githubusercontent.com/dominikwilkowski/harvestsync/released/assets/harvestsync.gif" alt="Running harvestsync can batch several tasks together"></p>

## Install

To install this app you need [NodeJS](https://nodejs.org/en/) installed.

Install via:

```sh
npm install -g harvestsync
```

## Configure your tasks

`harvestsync` requires a `project.json` file to run it's tasks off of.

The `project.json` format is as follows:

```json
{
	"HARVEST_ACCESS_TOKEN": "Add your personal token here",
	"HARVEST_ACCOUNT_ID": 666,
	"GOOGLE_ID": "Add your google ID here",
	"GOOGLE_SECRET": "Add your google secret here",
	"GOOGLE_REFRESH_TOKEN": "Add your google refresh token here",
	"tasks": {
		"project1": {
			"harvestProject": 42,
			"from": "2020-08-01T00:00:00",
			"to": "2020-08-31T23:59:59",
			"spreadsheetID": "Add your google sheets ID here",
			"tabName": "Add your google sheet tab name here"
		},
		"project2": {
			"harvestProject": 42,
			"from": "2020-08-01T00:00:00",
			"to": "2020-08-31T23:59:59",
			"spreadsheetID": "Add your google sheets ID here",
			"tabName": "Add your google sheet tab name here"
		}
	}
}
```

The login block on the top is important and can be generated by running `harvestsync login`.

## The tasks

The project name, used internally only. Can be anything

### `harvestProject`

The harvest project ID. Find it by navigating to the project inside the harvest web app and look at the URL.

An example might be `https://yourorg.harvestapp.com/projects/1234567` in which case the `harvestProject` is `1234567`.

### `from`

This is a time from which you like to get the harvest data.

The format is: `[year]-[month]-[day]T[hour]:[minute]:[second]`.

### `to`

This is a time to which you like to get the harvest data.

The format is: `[year]-[month]-[day]T[hour]:[minute]:[second]`.

### `spreadsheetID`

This is the spreadsheet ID. Find it by navigating to your spreadsheet in the web app and look at the URL.

An example might be `https://docs.google.com/spreadsheets/d/1ZZS15TTMxQRjeX2nI-u4zJMQJu0QzhlKRgOC17jLG6X/edit#gid=0`
in which case the `spreadsheetID` is `1ZZS15TTMxQRjeX2nI-u4zJMQJu0QzhlKRgOC17jLG6X`.

### `tabName`

The name of the tab you want to add the harvest data.

Please note that all data inside that tab will be erased.

# };
