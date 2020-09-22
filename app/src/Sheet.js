/** @jsx jsx */

import { Link, useHistory } from 'react-router-dom';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { getProjectName } from './harvestSync';
import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { getSheetInfo } from './googleSync';
import { Input } from './primitives/Input';

import hProjectIDImg from './assets/harvest-project-id.png';
import gSheetIDImg from './assets/spreadsheet-id.png';

export function Sheet({ match }) {
	let {
		params: { sheetID },
	} = match;
	sheetID = parseInt(sheetID);

	let sheets = JSON.parse(localStorage.getItem('harvest2sheetSheets') || '[]');
	let hProjectDefault = '';
	let hProjectNameDefault = '';
	let gSheetIDDefault = '';
	let gSheetIDNameDefault = '';
	let nameDefault = '';
	if (sheetID) {
		const thisSheet = sheets.filter(({ id }) => id === sheetID);
		if (thisSheet.length === 1) {
			hProjectDefault = thisSheet[0].hProject;
			hProjectNameDefault = thisSheet[0].hProjectName;
			gSheetIDDefault = thisSheet[0].gSheetID;
			gSheetIDNameDefault = thisSheet[0].gSheetIDName;
			nameDefault = thisSheet[0].name;
		}
	}

	const [loadingH, setLoadingH] = useState(false);
	const [loadingG, setLoadingG] = useState(false);
	const [hProject, setHProject] = useState(hProjectDefault);
	const [hProjectName, setHProjectName] = useState(hProjectNameDefault);
	const [gSheetID, setGSheetID] = useState(gSheetIDDefault);
	const [gSheetIDName, setGSheetIDName] = useState(gSheetIDNameDefault);
	const [name, setName] = useState(nameDefault);
	const history = useHistory();

	const LOGIN = JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}');

	const getHarvestName = async () => {
		setLoadingH(true);
		setHProjectName('');
		try {
			const { name } = await getProjectName(LOGIN, hProject);
			setHProjectName(name);
		} catch (error) {
			setHProjectName('- not found -');
		}
		setLoadingH(false);
	};

	const getSheetName = async () => {
		setLoadingG(true);
		setGSheetIDName('');
		try {
			const {
				result: {
					properties: { title },
				},
			} = await getSheetInfo(LOGIN, gSheetID);
			setGSheetIDName(title || '');
		} catch (error) {
			setGSheetIDName('- not found -');
		}
		setLoadingG(false);
	};

	const addSheet = (event) => {
		event.preventDefault();

		if (
			hProjectName !== '- not found -' &&
			hProjectName !== '' &&
			hProjectName &&
			gSheetIDName !== '- not found -' &&
			gSheetIDName !== '' &&
			gSheetIDName
		) {
			if (sheetID) {
				sheets = sheets.map((sheet) =>
					sheet.id === sheetID
						? { id: sheet.id, name, hProject, hProjectName, gSheetID, gSheetIDName }
						: sheet
				);
			} else {
				sheets.push({
					id: sheets.length ? sheets[sheets.length - 1].id + 1 : 1,
					name,
					hProject,
					hProjectName,
					gSheetID,
					gSheetIDName,
				});
			}
			localStorage.setItem('harvest2sheetSheets', JSON.stringify(sheets));
			history.push('/');
		}
	};

	return (
		<Wrapper>
			<h2>{sheetID ? 'Edit a' : 'Add a new'} sheet</h2>
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
						label="Name"
						value={name}
						help={
							<span>
								The name of this item
								<br />
								Only important for you to organise your items
							</span>
						}
						onChange={(event) => setName(event.target.value)}
					/>
					<Input
						required
						id="hProject"
						label="Harvest Project ID"
						value={hProject}
						help={
							<img
								src={hProjectIDImg}
								alt="The project ID can be found in the url of the project website in harvest."
							/>
						}
						onChange={(event) => {
							setHProject(event.target.value);
							setHProjectName('');
						}}
						onBlur={getHarvestName}
					/>
					<Input
						required
						id="hProjectName"
						label="Harvest Project Name"
						value={hProjectName}
						disabled
						loading={loadingH}
						readOnly
						css={{
							...(hProjectName === '- not found -' || hProjectName === '' || !hProjectName
								? { boxShadow: '0 0 0 3px red' }
								: {}),
						}}
					/>
					<Input
						required
						id="gSheetID"
						label="Spreadsheet ID"
						value={gSheetID}
						help={
							<img
								src={gSheetIDImg}
								alt="The spreadsheet ID can be found in the url of the google spreadsheet."
							/>
						}
						onChange={(event) => {
							setGSheetID(event.target.value);
							setGSheetIDName('');
						}}
						onBlur={getSheetName}
					/>
					<Input
						required
						id="gSheetIDName"
						label="Sheet Name"
						value={gSheetIDName}
						disabled
						loading={loadingG}
						readOnly
						css={{
							...(gSheetIDName === '- not found -' || gSheetIDName === '' || !gSheetIDName
								? { boxShadow: '0 0 0 3px red' }
								: {}),
						}}
					/>
				</ul>

				<div
					css={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						justifyItems: 'start',
					}}
				>
					<Button look="muted" to="/" as={Link}>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={loadingH || loadingG}
						css={{
							justifySelf: 'end',
						}}
					>
						{sheetID ? 'Edit' : 'Add'} sheet
					</Button>
				</div>
			</form>
		</Wrapper>
	);
}
