/** @jsx jsx */

import { jsx } from '@emotion/core';
import { useState } from 'react';

import { harvestLogin } from './harvestSync';
import { googleLogin } from './googleSync';
import { LoginForm } from './LoginForm';
import { Home } from './Home';

export function App() {
	const [login, setLogin] = useState(
		JSON.parse(localStorage.getItem('harvest2sheetLogin') || '{}')
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [hToken, setHToken] = useState('');
	const [hID, setHID] = useState('');
	const [gClientID, setGClientID] = useState('');
	const [gAPIKey, setGAPIKey] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();
		setLoading(true);

		if (hToken && hID && gClientID && gAPIKey) {
			const login = {
				HARVEST_ACCESS_TOKEN: hToken,
				HARVEST_ACCOUNT_ID: hID,
				GOOGLE_CLIENT_ID: gClientID,
				GOOGLE_API_KEY: gAPIKey,
			};

			try {
				await harvestLogin(login);
				await googleLogin(login);

				localStorage.setItem('harvest2sheetLogin', JSON.stringify(login));
				setLogin(login);
				setLoading(false);
			} catch (error) {
				setError(error.toString());
				setLoading(false);
			}
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
					loading={loading}
					error={error}
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
