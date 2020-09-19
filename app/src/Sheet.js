/** @jsx jsx */

import { Link, useHistory } from 'react-router-dom';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { Input } from './primitives/Input';

export function Sheet({ match }) {
	let {
		params: { sheetID },
	} = match;
	sheetID = parseInt(sheetID);

	let sheets = JSON.parse(localStorage.getItem('harvest2sheetSheets') || '[]');
	let hProjectDefault = '';
	let hProjectNameDefault = '';
	let gSheetIDDefault = '';
	let nameDefault = '';
	if (sheetID) {
		const thisSheet = sheets.filter(({ id }) => id === sheetID);
		if (thisSheet.length === 1) {
			hProjectDefault = thisSheet[0].hProject;
			hProjectNameDefault = thisSheet[0].hProjectName;
			gSheetIDDefault = thisSheet[0].gSheetID;
			nameDefault = thisSheet[0].name;
		}
	}

	const [loading, setLoading] = useState(false);
	const [hProject, setHProject] = useState(hProjectDefault);
	const [hProjectName, setHProjectName] = useState(hProjectNameDefault);
	const [gSheetID, setGSheetID] = useState(gSheetIDDefault);
	const [name, setName] = useState(nameDefault);
	const history = useHistory();

	const LOGIN = JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}');

	const getHarvestName = async () => {
		setLoading(true);
		try {
			const response = await fetch(`https://api.harvestapp.com/v2/projects/${hProject}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${LOGIN.HARVEST_ACCESS_TOKEN}`,
					'Harvest-Account-Id': LOGIN.HARVEST_ACCOUNT_ID,
					'User-Agent': 'Harvest2Sheet',
				},
			});
			const data = await response.json();
			setHProjectName(data.name);
		} catch (error) {
			setHProjectName('- not found -');
		}
		setLoading(false);
	};

	const addSheet = (event) => {
		event.preventDefault();

		if (hProjectName !== '- not found -') {
			if (sheetID) {
				sheets = sheets.map((sheet) =>
					sheet.id === sheetID ? { id: sheet.id, name, hProject, hProjectName, gSheetID } : sheet
				);
			} else {
				sheets.push({
					id: sheets.length ? sheets[sheets.length - 1].id + 1 : 1,
					name,
					hProject,
					hProjectName,
					gSheetID,
				});
			}
			localStorage.setItem('harvest2sheetSheets', JSON.stringify(sheets));
			history.push('/');
		}
	};

	return (
		<Wrapper>
			<form
				onSubmit={addSheet}
				css={{
					margin: 0,
					padding: 0,
				}}
			>
				<ul
					css={{
						listStyle: 'none',
						padding: 0,
						margin: 0,
					}}
				>
					<Input
						required
						id="name"
						label="Sheet name"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
					<Input
						required
						id="hProject"
						label="Harvest Project ID"
						value={hProject}
						onChange={(event) => setHProject(event.target.value)}
						onBlur={getHarvestName}
					/>
					<Input
						required
						id="hProjectName"
						label="Harvest Project Name"
						value={hProjectName}
						disabled
						loading={loading}
						readOnly
						css={{
							...(hProjectName === '- not found -' ? { boxShadow: '0 0 0 3px red' } : {}),
						}}
					/>
					<Input
						required
						id="gSheetID"
						label="Spreadsheet ID"
						value={gSheetID}
						onChange={(event) => setGSheetID(event.target.value)}
					/>
				</ul>
				<Button look="muted" to="/" as={Link}>
					Cancel
				</Button>
				<Button
					type="submit"
					loading={loading}
					css={{
						float: 'right',
					}}
				>
					{`${sheetID ? 'Edit' : 'Add'} sheet`}
				</Button>
			</form>
		</Wrapper>
	);
}
