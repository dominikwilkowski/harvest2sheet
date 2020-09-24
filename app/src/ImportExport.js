/** @jsx jsx */

import { Link, useHistory } from 'react-router-dom';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { getSheets, writeSheets, getOutput, writeOutput } from './storage';
import { IconButton } from './primitives/IconButton';
import { Checkbox } from './primitives/Checkbox';
import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { version } from '../package.json';

export function ImportExport() {
	const sheets = getSheets();
	const output = getOutput();
	const [includeOutput, setIncludeOutput] = useState(false);
	const [overrideSheets, setOverrideSheets] = useState(false);
	const [overrideOutput, setOverrideOutput] = useState(false);
	const [file, setFile] = useState('');
	const [error, setError] = useState('');
	const history = useHistory();

	const importFile = (event) => {
		event.preventDefault();

		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				let data = event.target.result;
				try {
					data = JSON.parse(data);
					if (overrideSheets && data.sheets) {
						// reset relationship
						if (!overrideOutput) {
							data.sheets = data.sheets.map(({ output, ...rest }) => ({ output: 1, ...rest }));
						}
						writeSheets(data.sheets);
					}
					if (overrideOutput && data.output) {
						// reset relationship
						if (!overrideSheets) {
							const newSheets = sheets.map(({ output, ...rest }) => ({ output: 1, ...rest }));
							writeSheets(newSheets);
						}
						writeOutput(data.output);
					}
					history.push('/');
				} catch (error) {
					setError(
						`The import file could not be read. Please make sure it's in the right format "harvest2sheet.export"`
					);
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<Wrapper>
			<h2>Export</h2>

			<div
				css={{
					marginLeft: '1rem',
				}}
			>
				<Checkbox
					id="includeOutput"
					label="Include Output"
					checked={includeOutput}
					onChange={(event) => setIncludeOutput(event.target.checked)}
				/>
			</div>
			<IconButton
				look="export"
				as="a"
				href={`data:text/plain;charset=utf-8,${encodeURIComponent(
					JSON.stringify({ version, sheets, ...(includeOutput ? { output } : {}) }, null, '\t')
				)}`}
				download="harvest2sheet.export"
				css={{
					marginTop: '1rem',
				}}
			>
				Export
			</IconButton>

			<h2
				css={{
					borderTop: '2px dashed var(--alt-bg)',
					paddingTop: '0.5rem',
					marginBottom: '1rem',
				}}
			>
				Import
			</h2>

			<form onSubmit={importFile}>
				<div
					css={{
						position: 'relative',
						marginLeft: '1rem',
					}}
				>
					<input
						id="file"
						type="file"
						required
						onChange={(event) => setFile(event.target.files[0])}
						css={{
							position: 'absolute',
							opacity: 0,
							width: '1px',
							left: '0.5rem',
							height: '1.5rem',
						}}
					/>
					<label
						htmlFor="file"
						css={{
							position: 'relative',
							display: 'block',
							width: '12.5rem',
							height: '1.5rem',
							borderRadius: '6px',
							border: '3px solid var(--text)',
							margin: '0.5rem 0',
							':before': {
								content: '"Browse"',
								display: 'flex',
								position: 'absolute',
								left: 0,
								bottom: 0,
								top: 0,
								width: '3.3rem',
								background: 'var(--text)',
								color: '#fff',
								padding: '0 6px',
								fontSize: '0.75rem',
								alignItems: 'center',
							},
							':after': {
								content: file && file.name ? `"${file.name}"` : '"Choose file..."',
								display: 'flex',
								position: 'absolute',
								left: '3.8rem',
								bottom: 0,
								top: 0,
								width: '8rem',
								overflow: 'hidden',
								fontSize: '0.75rem',
								alignItems: 'center',
								textAlign: 'center',
							},
							'input:focus + &': {
								boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
							},
						}}
					/>
					<Checkbox
						id="overrideSheets"
						label="Override sheets"
						checked={overrideSheets}
						onChange={(event) => setOverrideSheets(event.target.checked)}
					/>
					<Checkbox
						id="overrideOutput"
						label="Override output"
						checked={overrideOutput}
						onChange={(event) => setOverrideOutput(event.target.checked)}
					/>
				</div>
				{error && <div css={{ color: 'var(--danger)' }}>{error}</div>}
				<IconButton
					look="import"
					type="submit"
					css={{
						marginTop: '1rem',
					}}
				>
					Import
				</IconButton>
			</form>

			<Button
				look="muted"
				to="/"
				as={Link}
				css={{
					marginTop: '1.5rem',
				}}
			>
				Cancel
			</Button>
		</Wrapper>
	);
}
