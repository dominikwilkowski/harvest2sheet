/** @jsx jsx */

import { jsx } from '@emotion/core';
import { useState } from 'react';

import { LoginForm } from './LoginForm';
import { Home } from './Home';

export function App() {
	const [login, setLogin] = useState(
		JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}')
	);

	const [hToken, setHToken] = useState('');
	const [hID, setHID] = useState('');
	const [gClientID, setGClientID] = useState('');
	const [gAPIKey, setGAPIKey] = useState('');

	const handleLogin = (event) => {
		event.preventDefault();
		if (hToken && hID && gClientID && gAPIKey) {
			const login = {
				HARVEST_ACCESS_TOKEN: hToken,
				HARVEST_ACCOUNT_ID: hID,
				GOOGLE_CLIENT_ID: gClientID,
				GOOGLE_API_KEY: gAPIKey,
			};
			localStorage.setItem('harvest2sheetLogin', JSON.stringify(login));
			setLogin(login);
		}
	};

	const handleLogout = () => {
		localStorage.setItem('harvest2sheetLogin', '{}');
		setLogin({});
	};

	const hasLogin = login
		? !!login.HARVEST_ACCESS_TOKEN ||
		  !!login.HARVEST_ACCOUNT_ID ||
		  !!login.GOOGLE_CLIENT_ID ||
		  !!login.GOOGLE_API_KEY
		: false;

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
					inputLines={[
						{ id: 'hToken', label: 'Harvest access token', value: hToken, setValue: setHToken },
						{ id: 'hID', label: 'Harvest account ID', value: hID, setValue: setHID },
						{
							id: 'gClientID',
							label: 'Google client ID',
							value: gClientID,
							setValue: setGClientID,
						},
						{ id: 'gAPIKey', label: 'Google API key', value: gAPIKey, setValue: setGAPIKey },
					]}
				/>
			) : (
				<Home handleLogout={handleLogout} />
			)}
		</main>
	);
}
