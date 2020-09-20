/** @jsx jsx */

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { IconButton } from './primitives/IconButton';
import { ListSheets } from './ListSheets';
import { Output } from './Output';
import { Sheet } from './Sheet';

export function Home({ handleLogout }) {
	return (
		<Fragment>
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
				css={{
					position: 'absolute',
					top: '1rem',
					right: '1rem',
				}}
			>
				Logout
			</IconButton>

			<Router>
				<Switch>
					<Route exact path="/" component={ListSheets} />
					<Route exact path="/add" component={Sheet} />
					<Route exact path="/output" component={Output} />
					<Route exact path="/edit/:sheetID" component={Sheet} />
				</Switch>
			</Router>
		</Fragment>
	);
}
