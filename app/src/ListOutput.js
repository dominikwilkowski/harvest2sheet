/** @jsx jsx */

import { Link } from 'react-router-dom';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { getOutput, writeOutput, getSheets, writeSheets } from './storage';
import { IconButton } from './primitives/IconButton';
import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { Code } from './primitives/Code';

export function ListOutput() {
	const [output, setOutput] = useState(getOutput());

	const deleteOutput = (outputID) => {
		if (outputID !== 1) {
			const sheets = getSheets().map(({ output, ...rest }) =>
				output === outputID ? { output: 1, ...rest } : { output, ...rest }
			);
			writeSheets(sheets);

			const newOutput = output.filter(({ id }) => id !== outputID);
			writeOutput(newOutput);
			setOutput(newOutput);
		}
	};

	return (
		<Wrapper>
			<h2>Output</h2>

			<IconButton look="add" as={Link} to="/output/add">
				Add new
			</IconButton>
			<ul
				css={{
					listStyle: 'none',
					padding: 0,
					margin: 0,
				}}
			>
				{output.map(({ id, name, columns }) => (
					<li
						key={id}
						css={{
							display: 'grid',
							gridTemplateColumns: 'auto',
							alignItems: 'center',
							marginTop: '1.5rem',
							':not(:first-of-type)': {
								borderTop: '2px dashed #eee',
								paddingTop: '0.5rem',
							},
							'@media (min-width: 40rem)': {
								marginTop: '0.5rem',
								gridTemplateColumns: 'auto 6rem',
								gap: '0.5rem',
							},
						}}
					>
						<Link
							to={`/output/${id}`}
							css={{
								textDecoration: 'none',
								':focus': {
									outline: 'none',
									boxShadow: '0 0 0 2px #fff, 0 0 0 5px #005fcc',
								},
							}}
						>
							<strong
								css={{
									display: 'block',
								}}
							>
								{name}
							</strong>
							<Code>{columns.length} columns</Code>
						</Link>
						{id !== 1 ? (
							<IconButton confirm type="button" look="delete" onClick={() => deleteOutput(id)}>
								Delete
							</IconButton>
						) : null}
					</li>
				))}
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
			</div>
		</Wrapper>
	);
}
