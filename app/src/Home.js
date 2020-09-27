/** @jsx jsx */

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { jsx, Global } from '@emotion/core';
import { Fragment, useState } from 'react';

import { IconButton } from './primitives/IconButton';
import { ImportExport } from './ImportExport';
import { ListSheets } from './ListSheets';
import { version } from '../package.json';
import { ListOutput } from './ListOutput';
import { getLogin } from './storage';
import { Output } from './Output';
import { Sheet } from './Sheet';

export function Home({ handleLogout }) {
	const [colors, setColors] = useState(['rgb(1, 255, 251)', 'rgb(183, 1, 255)']);
	const [index, setIndex] = useState(0);
	const { avatar_url } = getLogin();

	const easterEgg = () => {
		const colorSets = [
			['rgb(1, 255, 251)', 'rgb(183, 1, 255)'],
			['#f857a6', '#ff5858'],
			['#2BC0E4', '#EAECC6'],
			['#7474BF', '#348AC7'],
			['#A9C9FF', '#FFBBEC'],
			['#3D7EAA', '#FFE47A'],
			['#08AEEA', '#2AF598'],
			['#5f2c82', '#49a09d'],
			['#00DBDE', '#FC00FF'],
			['#FC354C', '#0ABFBC'],
			['#f2709c', '#ff9472'],
			['green', 'red'],
			['red', 'blue'],
			['#888', '#888'],
		];
		const newIndex = index + 1 > colorSets.length - 1 ? 0 : index + 1;
		setIndex(newIndex);

		setColors(colorSets[newIndex]);
	};

	return (
		<Fragment>
			<Global
				styles={{
					html: {
						'--bg-color1': colors[0],
						'--bg-color2': colors[1],
					},
				}}
			/>
			<h1
				css={{
					fontFamily:
						'"Playfair Display", "PT Serif", Cambria, "Hoefler Text", Utopia, "Liberation Serif", "Nimbus Roman No9 L Regular", Times, "Times New Roman", serif',
					fontStyle: 'italic',
					fontSize: '10vw',
					lineHeight: 1,
					margin: '1vw 0 3vw 0',
					textAlign: 'center',
					fontWeight: 700,
					textShadow: '0 0 1px #000, 0 1.8vw 1.8vw #333',
					color: '#fff',
					'@media (min-width: 75rem)': {
						fontSize: '7.5rem',
						margin: '0.75rem 0 2.25rem 0',
						textShadow: '0 0 1px #000, 0 1.34375rem 1.34375rem #333',
					},
				}}
			>
				Harvest 2 Sheet
			</h1>
			<IconButton
				look="logout"
				onClick={handleLogout}
				icon={avatar_url ? avatar_url : null}
				confirm
				css={{
					display: 'block',
					margin: '0 auto',
					'@media (min-width: 41.875rem)': {
						position: 'absolute',
						top: '1rem',
						right: '1rem',
					},
				}}
			>
				Logout
			</IconButton>

			<Router>
				<Switch>
					<Route exact path="/" component={ListSheets} />
					<Route exact path="/add" component={Sheet} />
					<Route exact path="/edit/:sheetID" component={Sheet} />
					<Route exact path="/output" component={ListOutput} />
					<Route exact path="/output/add" component={Output} />
					<Route exact path="/output/:itemID" component={Output} />
					<Route exact path="/import-export" component={ImportExport} />
				</Switch>
			</Router>
			<div
				css={{
					display: 'block',
					padding: '1rem',
					textAlign: 'right',
					color: '#fff',
					fontSize: '0.5rem',
				}}
			>
				<span onClick={easterEgg}>v{version}</span>
			</div>
		</Fragment>
	);
}
