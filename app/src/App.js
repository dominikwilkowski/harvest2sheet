/** @jsx jsx */

import { jsx } from '@emotion/core';
import { useState } from 'react';

import { harvestLogin } from './harvestSync';
import { googleLogin } from './googleSync';
import { LoginForm } from './LoginForm';
import { Home } from './Home';

import harvestAccess from './assets/harvest-access.png';
import harvestAccessTokenID from './assets/harvest-token-id.png';

export function App() {
	const [login, setLogin] = useState(
		JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}')
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [hToken, setHToken] = useState('');
	const [hID, setHID] = useState('');
	const [gAPIKey, setGAPIKey] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();
		setLoading(true);

		if (hToken && hID && gAPIKey) {
			const login = {
				HARVEST_ACCESS_TOKEN: hToken,
				HARVEST_ACCOUNT_ID: hID,
				GOOGLE_API_KEY: gAPIKey,
			};

			try {
				await harvestLogin(login);
				await googleLogin(login);

				localStorage.setItem('harvest2sheetLogin', JSON.stringify(login));
				setLogin(login);
				setLoading(false);
			} catch (error) {
				if (typeof error === 'object') {
					setError(`Can't login. Check that you allow popups in the browser.`);
				} else {
					setError(error.toString());
				}
				setLoading(false);
			}
		}
	};

	const handleLogout = () => {
		localStorage.setItem('harvest2sheetLogin', '{}');
		setLogin({});
	};

	const hasLogin = login
		? !!login.HARVEST_ACCESS_TOKEN || !!login.HARVEST_ACCOUNT_ID || !!login.GOOGLE_API_KEY
		: false;

	const HTokenHelp = () => (
		<div>
			Log into <strong>https://id.getharvest.com/developers</strong>
			<br />
			and create a Personal Access Tokens
			<br />
			<img src={harvestAccess} alt="" css={{ width: '30rem !important' }} />
			<br />
			Copy the "Your Token" and paste it here
			<br />
			<img src={harvestAccessTokenID} alt="" css={{ width: '30rem !important' }} />
		</div>
	);

	return (
		<main
			css={{
				textRendering: 'optimizeLegibility',
				fontKerning: 'auto',
				MozOsxFontSmoothing: 'grayscale',
			}}
		>
			{!hasLogin ? (
				<LoginForm
					handleLogin={handleLogin}
					loading={loading}
					error={error}
					inputLines={[
						{
							id: 'hToken',
							label: 'Harvest access token',
							value: hToken,
							setValue: setHToken,
							help: <HTokenHelp />,
						},
						{
							id: 'hID',
							label: 'Harvest account ID',
							value: hID,
							setValue: setHID,
							help: <HTokenHelp />,
						},
						{
							id: 'gAPIKey',
							label: 'Google API key',
							value: gAPIKey,
							setValue: setGAPIKey,
							help: 'Ask Dom for it',
						},
					]}
				/>
			) : (
				<Home handleLogout={handleLogout} />
			)}
		</main>
	);
}
