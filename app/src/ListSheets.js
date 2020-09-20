/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';
import parseISO from 'date-fns/parseISO';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { useState } from 'react';

import { IconButton } from './primitives/IconButton';
import { SheetCard } from './primitives/SheetCard';
import { Wrapper } from './primitives/Wrapper';
import { harvestSync } from './harvestSync';
import { googleSync } from './googleSync';

export function ListSheets() {
	const LOGIN = JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}');

	const [sheets, setSheets] = useState(
		JSON.parse(localStorage.getItem('harvest2sheetSheets') || '[]')
	);
	const [date, setDate] = useState(format(new Date(), 'yyyy-MM'));
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState([]);

	const deleteSheet = (sheetID) => {
		const newSheet = sheets.filter(({ id }) => id !== sheetID);
		localStorage.setItem('harvest2sheetSheets', JSON.stringify(newSheet));
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

	const sync = async (event, tabName) => {
		event.preventDefault();
		setLoading(true);
		const selectedSheets = sheets.filter(({ id }) => selected.includes(id));
		await Promise.all(
			selectedSheets.map(async ({ hProject, gSheetID }) => {
				try {
					const timeData = await harvestSync(LOGIN, hProject, date);
					await googleSync(LOGIN, gSheetID, date, timeData.csv, tabName);
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

	return (
		<Wrapper size="lg">
			<h2>Sheets</h2>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					alignItems: 'baseline',
				}}
			>
				<IconButton
					look="add"
					as={Link}
					to="/add"
					css={{
						justifySelf: 'start',
					}}
				>
					Add new
				</IconButton>
				<form
					onSubmit={(event) => sync(event, tabName)}
					css={{
						justifySelf: 'end',
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
							border: '1px solid #383E48',
							width: '7em',
							padding: '0.5rem',
							lineHeight: 1,
							marginRight: '1rem',
							textAlign: 'center',
							':invalid': {
								boxShadow: '0 0 0 3px #ee0000',
							},
						}}
					/>
					<IconButton look="sync" type="submit" disabled={!selected.length}>
						Sync
					</IconButton>
				</form>
			</div>

			<ul
				css={{
					position: 'relative',
					listStyle: 'none',
					padding: 0,
					margin: 0,
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
						border: '0.75rem solid #aaa',
						borderTopColor: '#383E48',
						borderRadius: '100%',
						animation: `${rotation} 0.5s linear infinite`,
					},
				}}
			>
				{sheets.map(({ id, name, hProjectName, gSheetIDName }, i) => (
					<li
						key={id}
						css={{
							opacity: loading ? 0.2 : 1,
							marginTop: '1.5rem',
							':not(:first-of-type)': {
								borderTop: '2px dashed #eee',
								paddingTop: '0.5rem',
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
							tabName={tabName}
							gSheetIDName={gSheetIDName}
							selected={selected}
							toggle={toggle}
							deleteSheet={deleteSheet}
						/>
					</li>
				))}
			</ul>
		</Wrapper>
	);
}
