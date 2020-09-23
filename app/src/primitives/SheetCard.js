/** @jsx jsx */

import { Link } from 'react-router-dom';
import { jsx } from '@emotion/core';

import { IconButton } from './IconButton';
import { Code } from './Code';

export function SheetCard({
	id,
	name,
	hProjectName,
	tabName,
	gSheetIDName,
	output,
	selected,
	toggle,
	deleteSheet,
}) {
	return (
		<div
			css={{
				display: 'grid',
				gridTemplateColumns: '3rem auto',
				gap: '0.5rem',
				alignItems: 'center',
				'@media (min-width: 40rem)': {
					gridTemplateColumns: '3rem auto 12rem',
				},
			}}
		>
			<label
				css={{
					position: 'relative',
					overflow: 'hidden',
					display: 'block',
					width: '3rem',
					height: '3rem',
					cursor: 'pointer',
				}}
			>
				<input
					id={id}
					type="checkbox"
					checked={selected.includes(id)}
					onChange={() => toggle(id)}
					css={{
						position: 'absolute',
						top: '-5rem',
						left: '-5rem',
					}}
				/>
				<span
					css={{
						display: 'block',
						width: '2rem',
						height: '2rem',
						margin: '0.5rem',
						border: '4px solid #383E48',
						borderRadius: '3px',
						':before': {
							content: '""',
							display: 'none',
							position: 'absolute',
							top: '0.7rem',
							right: '0.4rem',
							width: '1.5rem',
							height: '0.8rem',
							borderBottom: '4px solid #383E48',
							borderLeft: '4px solid #383E48',
							transform: 'rotate(-45deg)',
							zIndex: 2,
						},
						':after': {
							content: '""',
							display: 'none',
							position: 'absolute',
							top: '0',
							right: '0',
							width: '1.1rem',
							height: '1.5rem',
							background: '#fff',
							zIndex: 1,
						},
						'input:checked + &:before,input:checked + &:after': {
							display: 'block',
						},
						'input:focus + &': {
							boxShadow: '0 0 0 2px #fff, 0 0 0 5px #005fcc',
						},
					}}
				/>
			</label>
			<label
				htmlFor={id}
				css={{
					display: 'block',
					cursor: 'pointer',
				}}
			>
				<strong
					css={{
						display: 'block',
					}}
				>
					{name}
				</strong>
				<Code>{hProjectName}</Code>
				<Code>{gSheetIDName}</Code>
				<Code>{tabName}</Code>
				<Code>
					{output.name} ({output.columns.length} columns)
				</Code>
			</label>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '0.5rem',
					alignItems: 'center',
					gridColumn: '1 / 3',
					'@media (min-width: 40rem)': {
						gridTemplateColumns: '1fr 1fr',
						gridColumn: 'unset',
					},
				}}
			>
				<IconButton look="edit" as={Link} to={`/edit/${id}`}>
					Edit
				</IconButton>
				<IconButton confirm type="button" look="delete" onClick={() => deleteSheet(id)}>
					Delete
				</IconButton>
			</div>
		</div>
	);
}
