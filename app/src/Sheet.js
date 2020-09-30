/** @jsx jsx */

import { Link, useHistory } from 'react-router-dom';
import { jsx } from '@emotion/core';
import Select from 'react-select';
import { useState } from 'react';

import { getLogin, getSheets, writeSheets, getOutput } from './storage';
import { getProjectName, getClientName } from './harvestSync';
import { Checkbox } from './primitives/Checkbox';
import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { getSheetInfo } from './googleSync';
import { Input } from './primitives/Input';

import hProjectIDImg from './assets/harvest-project-id.png';
import hClientIDImg from './assets/harvest-client-id.png';
import gSheetIDImg from './assets/spreadsheet-id.png';

export function Sheet({ match }) {
	let {
		params: { sheetID },
	} = match;
	sheetID = parseInt(sheetID);

	const storageOutput = getOutput();
	const outputOptions = storageOutput.map(({ id, name }) => ({
		label: name,
		value: id,
	}));

	let storageSheets = getSheets();
	let hProjectDefault = '';
	let hProjectNameDefault = '';
	let hClientDefault = '';
	let hClientNameDefault = '';
	let gSheetIDDefault = '';
	let gSheetIDNameDefault = '';
	let nameDefault = '';
	let outputDefault = '';
	let hourSummaryDefault = true;
	let tabDefault = 'project';
	if (sheetID) {
		const thisSheet = storageSheets.filter(({ id }) => id === sheetID);
		if (thisSheet.length === 1) {
			hProjectDefault = thisSheet[0].hProject;
			hProjectNameDefault = thisSheet[0].hProjectName;
			hClientDefault = thisSheet[0].hClient;
			hClientNameDefault = thisSheet[0].hClientName;
			gSheetIDDefault = thisSheet[0].gSheetID;
			gSheetIDNameDefault = thisSheet[0].gSheetIDName;
			nameDefault = thisSheet[0].name;
			outputDefault = storageOutput
				.filter(({ id }) => id === thisSheet[0].output)
				.map(({ id, name }) => ({ label: name, value: id }))[0];
			hourSummaryDefault = !!thisSheet[0].hourSummary;
			if (hClientDefault) {
				tabDefault = 'client';
			}
		}
	}

	const [loadingHP, setLoadingHP] = useState(false);
	const [loadingHC, setLoadingHC] = useState(false);
	const [loadingG, setLoadingG] = useState(false);
	const [hProject, setHProject] = useState(hProjectDefault);
	const [hProjectName, setHProjectName] = useState(hProjectNameDefault);
	const [hClient, setHClient] = useState(hClientDefault);
	const [hClientName, setHClientName] = useState(hClientNameDefault);
	const [gSheetID, setGSheetID] = useState(gSheetIDDefault);
	const [gSheetIDName, setGSheetIDName] = useState(gSheetIDNameDefault);
	const [name, setName] = useState(nameDefault);
	const [output, setOutput] = useState(outputDefault);
	const [hourSummary, setHourSummary] = useState(hourSummaryDefault);
	const [tab, setTab] = useState(tabDefault);
	const history = useHistory();

	const LOGIN = getLogin();

	const getHProjectName = async () => {
		setLoadingHP(true);
		setHProjectName('');
		try {
			const { name } = await getProjectName(LOGIN, hProject);
			setHProjectName(name);
		} catch (error) {
			setHProjectName('- not found -');
		}
		setLoadingHP(false);
	};

	const getHClientName = async () => {
		setLoadingHC(true);
		setHProjectName('');
		try {
			const { name } = await getClientName(LOGIN, hClient);
			setHClientName(name);
		} catch (error) {
			setHClientName('- not found -');
		}
		setLoadingHC(false);
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

		const hasHArvestData =
			tab === 'project'
				? hProjectName !== '- not found -' && hProjectName !== '' && hProjectName
				: hClientName !== '- not found -' && hClientName !== '' && hClientName;

		if (
			hasHArvestData &&
			gSheetIDName !== '- not found -' &&
			gSheetIDName !== '' &&
			gSheetIDName &&
			output
		) {
			if (sheetID) {
				storageSheets = storageSheets.map((sheet) =>
					sheet.id === sheetID
						? {
								id: sheet.id,
								name,
								hProject: tab === 'project' ? hProject : '',
								hProjectName: tab === 'project' ? hProjectName : '',
								hClient: tab === 'client' ? hClient : '',
								hClientName: tab === 'client' ? hClientName : '',
								gSheetID,
								gSheetIDName,
								output: output.value,
								hourSummary,
						  }
						: sheet
				);
			} else {
				storageSheets.push({
					id: storageSheets.length ? storageSheets[storageSheets.length - 1].id + 1 : 1,
					name,
					hProject: tab === 'project' ? hProject : '',
					hProjectName: tab === 'project' ? hProjectName : '',
					hClient: tab === 'client' ? hClient : '',
					hClientName: tab === 'client' ? hClientName : '',
					gSheetID,
					gSheetIDName,
					output: output.value,
					hourSummary,
				});
			}
			writeSheets(storageSheets);
			history.push('/');
		}
	};

	const colourStyles = {
		container: (styles) => (output ? styles : { ...styles, boxShadow: '0 0 0 3px var(--danger)' }),
		control: (styles) => ({
			...styles,
			borderColor: '#767676',
			fontSize: '1.5rem',
			padding: '0.25rem 0',
			':hover': { borderColor: '#767676', ...styles[':hover'] },
		}),
	};

	const possibleTabs = ['project', 'client'];
	const toggleTab = () => {
		let index = possibleTabs.indexOf(tab) + 1;
		if (index > possibleTabs.length - 1) {
			index = 0;
		}
		setTab(possibleTabs[index]);
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
					<li
						css={{
							margin: '1rem 0 0 0',
							'@media (min-width: 37.5rem)': {
								paddingLeft: '17rem',
								margin: '0 0 0.5rem 0',
							},
						}}
					>
						<button
							type="button"
							onClick={toggleTab}
							css={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								apperance: 'none',
								background: 'transparent',
								border: '1px solid var(--text)',
								borderRadius: '6px',
								fontSize: '1rem',
								cursor: 'pointer',
								lineHeight: 1,
								padding: 0,
								width: '100%',
								overflow: 'hidden',
								':focus': {
									boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
									outline: 'none',
								},
							}}
						>
							{possibleTabs.map((thisTab) => (
								<span
									key={thisTab}
									css={{
										background: thisTab === tab ? 'var(--text)' : 'var(--alt-bg)',
										color: thisTab === tab ? '#fff' : 'var(--text)',
										padding: '0.5rem',
										transition: 'background 0.3s ease, color 0.3s ease',
									}}
								>
									Use {thisTab} ID
								</span>
							))}
						</button>
					</li>
					<Input
						required
						id="hProject"
						label="Harvest Project ID"
						value={hProject}
						visible={tab === 'project'}
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
						onBlur={getHProjectName}
					/>
					<Input
						required
						id="hProjectName"
						label="Harvest Project Name"
						value={hProjectName}
						disabled
						loading={loadingHP}
						readOnly
						visible={tab === 'project'}
						css={{
							...(hProjectName === '- not found -' || hProjectName === '' || !hProjectName
								? { boxShadow: '0 0 0 3px var(--danger)' }
								: {}),
						}}
					/>
					<Input
						required
						id="hClient"
						label="Harvest Client ID"
						value={hClient}
						visible={tab === 'client'}
						help={
							<img
								src={hClientIDImg}
								alt="The project ID can be found in the url of the project website in harvest."
							/>
						}
						onChange={(event) => {
							setHClient(event.target.value);
							setHClientName('');
						}}
						onBlur={getHClientName}
					/>
					<Input
						required
						id="hClientName"
						label="Harvest Client Name"
						value={hClientName}
						disabled
						loading={loadingHC}
						readOnly
						visible={tab === 'client'}
						css={{
							...(hClientName === '- not found -' || hClientName === '' || !hClientName
								? { boxShadow: '0 0 0 3px var(--danger)' }
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
								? { boxShadow: '0 0 0 3px var(--danger)' }
								: {}),
						}}
					/>
					<li
						css={{
							position: 'relative',
							zIndex: 3,
							marginBottom: '0.5rem',
							'@media (min-width: 37.5rem)': {
								display: 'grid',
								gridTemplateColumns: '17rem auto',
							},
						}}
					>
						<label
							htmlFor="output"
							css={{
								display: 'inline-block',
								margin: '1rem 0.5rem 0.5rem 0',
								fontSize: '1.5rem',
								alignSelf: 'center',
								whiteSpace: 'nowrap',
								'@media (min-width: 37.5rem)': {
									margin: '0 0.5rem 0 0',
								},
							}}
						>
							Output
						</label>
						<Select
							inputId="output"
							options={outputOptions}
							value={output}
							onChange={setOutput}
							styles={colourStyles}
						/>
					</li>
					<li
						css={{
							marginBottom: '0.5rem',
							'@media (min-width: 37.5rem)': {
								marginLeft: '16.5rem',
							},
						}}
					>
						<label
							css={{
								display: 'grid',
								gridTemplateColumns: 'auto 1fr',
								alignItems: 'center',
								fontSize: '1.5rem',
							}}
						>
							<Checkbox
								id="hourSummary"
								checked={hourSummary}
								onChange={() => setHourSummary(!hourSummary)}
							/>
							Generate summary sheet
						</label>
					</li>
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
						loading={loadingHP || loadingHC || loadingG}
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
