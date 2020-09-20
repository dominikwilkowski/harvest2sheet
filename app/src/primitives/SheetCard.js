/** @jsx jsx */

import { Link } from 'react-router-dom';
import { jsx } from '@emotion/core';

export function SheetCard({ id, name, hProjectName, tabName, selected, toggle, deleteSheet }) {
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
			<span
				css={{
					position: 'relative',
					overflow: 'hidden',
					display: 'block',
					width: '3rem',
					height: '3rem',
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
						border: '4px solid #000',
						borderRadius: '3px',
						':before': {
							content: '""',
							display: 'none',
							position: 'absolute',
							top: '0.5rem',
							right: '0.5rem',
							width: '1.5rem',
							height: '0.8rem',
							borderBottom: '4px solid #000',
							borderLeft: '4px solid #000',
							transform: 'rotate(-45deg)',
							zIndex: 2,
						},
						':after': {
							content: '""',
							display: 'none',
							position: 'absolute',
							top: '0',
							right: '0',
							width: '1.3rem',
							height: '1.3rem',
							background: '#fff',
							zIndex: 1,
						},
						'input:checked + &:before,input:checked + &:after': {
							display: 'block',
						},
					}}
				/>
			</span>
			<label
				htmlFor={id}
				css={{
					display: 'block',
				}}
			>
				<strong
					css={{
						display: 'block',
					}}
				>
					{name}
				</strong>
				{hProjectName} -> {tabName}
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
				<Link
					to={`/edit/${id}`}
					css={{
						position: 'relative',
						display: 'block',
						padding: '0.5rem 0 0.5rem 2.5rem',
						textAlign: 'left',
						background: '#eee',
						color: '#383E48',
						textDecoration: 'none',
						fontSize: '0.75rem',
						lineHeight: 1,
						borderRadius: '3px',
						transition: 'background 0.2s ease, color 0.2s ease',
						':before': {
							content: '""',
							position: 'absolute',
							top: '50%',
							marginTop: '-0.5rem',
							left: '1rem',
							width: '0.9rem',
							height: '1rem',
							border: '2px solid #383E48',
							transition: 'border 0.2s ease',
						},
						':after': {
							content: '""',
							position: 'absolute',
							top: '2px',
							left: '1.65rem',
							background: '#383E48',
							width: '4px',
							height: '1rem',
							transform: 'rotate(45deg)',
							borderRadius: '1px 1px 50% 50%',
							boxShadow: '0 0 0 2px #eee',
							transition: 'background 0.2s ease, box-shadow 0.2s ease',
						},
						':hover': {
							background: '#008800',
							color: '#fff',
						},
						':hover:before': {
							borderColor: '#fff',
						},
						':hover:after': {
							background: '#fff',
							boxShadow: '0 0 0 2px #008800',
						},
					}}
				>
					Edit
				</Link>
				<button
					type="button"
					onClick={() => deleteSheet(id)}
					css={{
						position: 'relative',
						apperance: 'none',
						background: '#eee',
						color: '#383E48',
						border: 'none',
						padding: '0.5rem 0 0.5rem 2.5rem',
						fontSize: '0.75rem',
						lineHeight: 1,
						borderRadius: '3px',
						transition: 'background 0.2s ease, color 0.2s ease',
						textAlign: 'left',
						cursor: 'pointer',
						':before, :after': {
							content: '""',
							position: 'absolute',
							width: '1rem',
							height: '0.25rem',
							background: '#383E48',
							borderRadius: '2px',
							transform: 'rotate(45deg)',
							top: '50%',
							marginTop: '-0.125rem',
							left: '1rem',
							transition: 'background 0.2s ease',
						},
						':after': {
							transform: 'rotate(-45deg)',
						},
						':hover': {
							background: '#ee0000',
							color: '#fff',
						},
						':hover:before, :hover:after': {
							background: '#fff',
						},
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
}
