/** @jsxImportSource @emotion/react */

import { keyframes } from '@emotion/react';
import parseISO from 'date-fns/parseISO';
import { Link } from 'react-router-dom';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import { useState } from 'react';

import { getLogin, getSheets, writeSheets, getOutput, writeOutput } from './storage';
import { harvestSync, getSummary } from './harvestSync';
import { IconButton } from './primitives/IconButton';
import { SheetCard } from './primitives/SheetCard';
import { Wrapper } from './primitives/Wrapper';
import { googleSync } from './googleSync';

export function ListSheets() {
	const LOGIN = getLogin();
	const storageSheets = getSheets();
	let output = getOutput();

	if (output.length === 0) {
		output = [
			{
				id: 1,
				name: 'Default',
				columns: [
					'date',
					'user',
					'client',
					'project',
					'task',
					'hours',
					'rounded_hours',
					'notes',
					'billable_rate',
					'billable_amount',
					'cost_rate',
					'cost_amount',
					'currency',
				],
			},
		];

		writeSheets(storageSheets.map((sheet) => ({ output: 1, ...sheet })));
		writeOutput(output);
	}

	const [sheets, setSheets] = useState(storageSheets);
	const [date, setDate] = useState(format(subDays(new Date(), 5), 'yyyy-MM'));
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState([]);
	const [sort, setSort] = useState('name');
	const [filter, setFilter] = useState('');

	const sorting = (sheets, sort) => {
		if (sort === 'time') {
			return sheets.sort((a, b) => (a.name < b.name ? -1 : 1));
		} else {
			return sheets.sort((a, b) => a.id - b.id);
		}
	};

	const sortSheets = () => {
		if (sort === 'time') {
			setSort('name');
			setSheets(sorting(sheets, 'name'));
		} else {
			setSort('time');
			setSheets(sorting(sheets, 'time'));
		}
	};

	const filterSheets = (event) => {
		setFilter(event.target.value);
		const newSheet = storageSheets.filter(({ name }) =>
			name.toLowerCase().includes(event.target.value.toLowerCase())
		);
		setSheets(sorting(newSheet, sort));
	};

	const getOutputByID = (ID) => output.filter(({ id }) => id === ID)[0];

	const deleteSheet = (sheetID) => {
		const newSheet = sheets.filter(({ id }) => id !== sheetID);
		writeSheets(newSheet);
		setSheets(newSheet);
	};

	const toggle = (toggleID) => {
		if (selected.includes(toggleID)) {
			const newSelected = [...selected].filter((id) => id !== toggleID);
			setSelected(newSelected);
		} else {
			const newSelected = [...selected];
			newSelected.push(toggleID);
			setSelected(newSelected);
		}
	};

	const selectAll = () => {
		setSelected(sheets.map((sheet) => sheet.id));
	};

	const deselectAll = () => {
		setSelected([]);
	};

	const sync = async (event, tabName) => {
		event.preventDefault();
		setLoading(true);
		const selectedSheets = sheets.filter(({ id }) => selected.includes(id));
		await Promise.all(
			selectedSheets.map(async ({ hProject, hClient, gSheetID, output, hourSummary }) => {
				const hID = hProject || hClient;
				const apiCall = hProject ? 'project_id' : 'client_id';
				try {
					const timeData = await harvestSync(
						LOGIN,
						hID,
						date,
						getOutputByID(output).columns,
						apiCall
					);
					await googleSync(LOGIN, gSheetID, date, timeData.csv, tabName);
					if (hourSummary) {
						const data = getSummary(timeData.allData);
						await googleSync(LOGIN, gSheetID, date, data, hourSummaryTabName);
					}
					setSelected([]);
				} catch (error) {
					console.error(error);
				}
			})
		);
		setLoading(false);
	};

	const rotation = keyframes({
		to: {
			transform: 'rotate( 360deg )',
		},
	});

	const fromDate = parseISO(`${date.length === 7 ? date : '2020-01'}-01T00:00:00.000Z`);
	const tabName = `H|${format(fromDate, `LLL`)}'${format(fromDate, `yy`)}`;
	const hourSummaryTabName = `${tabName}|Summary`;

	return (
		<Wrapper size="lg">
			<h2>Sheets</h2>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					alignItems: 'center',
					'@media (min-width: 35.625rem)': {
						gridTemplateColumns: 'auto 1fr',
					},
				}}
			>
				<div
					css={{
						'@media (min-width: 35.625rem)': {
							justifySelf: 'start',
						},
					}}
				>
					<IconButton look="add" as={Link} to="/add">
						Add new
					</IconButton>
					<IconButton
						look="adjust"
						as={Link}
						to="/output"
						css={{
							marginLeft: '0.5rem',
						}}
					>
						Output
					</IconButton>
					<IconButton
						look="import-export"
						as={Link}
						to="/import-export"
						css={{
							marginLeft: '0.5rem',
						}}
					>
						Import/Export
					</IconButton>
				</div>
				<form
					onSubmit={(event) => sync(event, tabName)}
					css={{
						marginTop: '1rem',
						'@media (min-width: 35.625rem)': {
							justifySelf: 'end',
							marginTop: 0,
						},
					}}
				>
					<input
						type="text"
						value={date}
						onChange={(event) => setDate(event.target.value)}
						pattern="\d{4}-\d{2}"
						title="Please use the format year(4 numbers)-month(2 numbers). E.g.: 2020-09 or 2023-03"
						css={{
							display: 'inline-block',
							apperance: 'none',
							background: '#fff',
							border: '1px solid var(--text)',
							width: '7em',
							padding: '0.5rem',
							lineHeight: 1,
							marginRight: '1rem',
							textAlign: 'center',
							':invalid': {
								boxShadow: '0 0 0 3px var(--danger)',
							},
							':focus': {
								outline: 'none',
								boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
							},
						}}
					/>
					<IconButton look="sync" type="submit" disabled={!selected.length}>
						Sync
					</IconButton>
				</form>
			</div>

			<button
				onClick={selectAll}
				css={{
					border: '1px solid var(--text)',
					borderRadius: '3px',
					background: 'transparent',
					apperance: 'none',
					fontSize: '0.75rem',
					cursor: 'pointer',
					margin: '1rem 0 0 0',
					padding: '0.25rem',
					':focus': {
						outline: 'none',
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			>
				Select all ({sheets.length})
			</button>

			<button
				onClick={deselectAll}
				css={{
					border: '1px solid var(--text)',
					borderRadius: '3px',
					background: 'transparent',
					apperance: 'none',
					fontSize: '0.75rem',
					cursor: 'pointer',
					margin: '1rem 0 0 0.5rem',
					padding: '0.25rem',
					':focus': {
						outline: 'none',
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			>
				Deselect all ({selected.length})
			</button>

			<button
				onClick={sortSheets}
				css={{
					border: '1px solid var(--text)',
					borderRadius: '3px',
					background: 'transparent',
					apperance: 'none',
					fontSize: '0.75rem',
					cursor: 'pointer',
					margin: '1rem 0 0 0.5rem',
					padding: '0.25rem',
					':focus': {
						outline: 'none',
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			>
				Sort by {sort}
			</button>

			<input
				type="text"
				placeholder="filter"
				value={filter}
				onChange={filterSheets}
				css={{
					apperance: 'none',
					border: '1px solid var(--text)',
					fontSize: '0.75rem',
					margin: '1rem 0 0 0.5rem',
					padding: '0.25rem',
					width: '5rem',
					':focus': {
						outline: 'none',
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			/>

			<ul
				css={{
					position: 'relative',
					listStyle: 'none',
					padding: 0,
					margin: '1rem 0 0 0',
					':after': {
						content: '""',
						display: loading ? 'block' : 'none',
						position: 'absolute',
						top: '50%',
						left: '50%',
						marginLeft: '-2.5rem',
						marginTop: '-2.5rem',
						width: '5rem',
						height: '5rem',
						border: '0.75rem solid #ccc',
						borderTopColor: 'var(--text)',
						borderRadius: '100%',
						animation: `${rotation} 0.5s linear infinite`,
					},
				}}
			>
				{sheets.map(
					({ id, name, hProjectName, hClientName, gSheetIDName, output = 1, hourSummary }, i) => (
						<li
							key={id}
							css={{
								opacity: loading ? 0.2 : 1,
								marginTop: '1.5rem',
								marginLeft: '-9px',
								':not(:first-of-type)': {
									borderTop: '2px dashed var(--alt-bg)',
									paddingTop: '1rem',
								},
								'@media (min-width: 40rem)': {
									marginTop: '0.5rem',
								},
							}}
						>
							<SheetCard
								id={id}
								name={name}
								hProjectName={hProjectName}
								hClientName={hClientName}
								tabName={tabName}
								hourSummaryTabName={hourSummary ? hourSummaryTabName : null}
								gSheetIDName={gSheetIDName}
								output={getOutputByID(output)}
								selected={selected}
								toggle={toggle}
								deleteSheet={deleteSheet}
							/>
						</li>
					)
				)}
			</ul>
		</Wrapper>
	);
}
