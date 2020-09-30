/** @jsx jsx */

import { Link } from 'react-router-dom';
import { jsx } from '@emotion/core';

import { IconButton } from './IconButton';
import { Checkbox } from './Checkbox';
import { Code } from './Code';

export function SheetCard({
	id,
	name,
	hProjectName,
	hClientName,
	tabName,
	hourSummaryTabName,
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
					display: 'block',
					width: '3rem',
					height: '3rem',
					cursor: 'pointer',
				}}
			>
				<Checkbox
					id={id}
					checked={selected.includes(id)}
					onChange={() => toggle(id)}
					css={{ margin: '2px' }}
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
				<div
					css={{
						'@media (min-width: 40rem)': {
							display: 'grid',
							gridTemplateColumns: 'auto 1fr',
							gap: '1.75rem',
							alignItems: 'center',
						},
					}}
				>
					<div
						css={{
							'@media (min-width: 40rem)': {
								position: 'relative',
								':before': {
									content: '""',
									position: 'absolute',
									top: '50%',
									right: '-1.25rem',
									height: '4px',
									width: '1rem',
									marginTop: '-2px',
									background: 'var(--text)',
								},
								':after': {
									content: '""',
									position: 'absolute',
									top: '50%',
									right: '-1.8rem',
									border: '6px solid var(--text)',
									borderColor: 'transparent transparent transparent var(--text)',
									marginTop: '-6px',
								},
							},
						}}
					>
						<Code kind={hProjectName ? 'project' : 'client'}>{hProjectName || hClientName}</Code>
					</div>
					<div>
						<Code>{gSheetIDName}</Code>
						<Code>{tabName}</Code>
						{hourSummaryTabName && <Code>{hourSummaryTabName}</Code>}
						<Code>
							{output.name} ({output.columns.length} columns)
						</Code>
					</div>
				</div>
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
