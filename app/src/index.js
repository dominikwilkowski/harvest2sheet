import * as serviceWorker from './serviceWorker';
import { Global } from '@emotion/core';
import ReactDOM from 'react-dom';
import { App } from './App';
import React from 'react';

ReactDOM.render(
	<React.StrictMode>
		<Global
			styles={{
				html: {
					'--bg-color1': 'rgb(1, 255, 251)',
					'--bg-color2': 'rgb(183, 1, 255)',
					'--alt-bg': '#eee',
					'--text': '#383E48',
					'--info': '#005fcc',
					'--confirm': '#008800',
					'--danger': '#ee0000',
					'--focus': '#005fcc',
					background:
						'rgb(183, 1, 255) -webkit-radial-gradient(left bottom, var(--bg-color1), var(--bg-color2)) repeat fixed 0% 0%',
					height: '100%',
				},
				body: {
					fontFamily:
						'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
					lineHeight: 1.2,
					margin: 0,
					padding: 0,
					color: 'var(--text)',
				},
				a: {
					color: 'var(--text)',
				},
				'*, *:before, *:after': {
					boxSizing: 'border-box',
				},
			}}
		/>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
