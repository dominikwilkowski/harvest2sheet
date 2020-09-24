/** @jsx jsx */

import { jsx } from '@emotion/core';

export function Checkbox({ id, label, ...props }) {
	return (
		<div>
			<input
				id={id}
				type="checkbox"
				{...props}
				css={{
					position: 'absolute',
					opacity: 0,
				}}
			/>
			<label
				htmlFor={id}
				css={{
					position: 'relative',
					display: 'inline-flex',
					paddingLeft: '1.5rem',
					height: '1rem',
					marginBottom: '0.5rem',
					alignItems: 'center',
					cursor: 'pointer',
					':before': {
						content: '""',
						position: 'absolute',
						left: 0,
						top: 0,
						width: '1rem',
						height: '1rem',
						border: '3px solid var(--text)',
						borderRadius: '3px',
					},
					':after': {
						content: '""',
						display: 'none',
						position: 'absolute',
						left: '5px',
						top: '4px',
						width: '6px',
						height: '6px',
						border: '2px solid var(--text)',
						borderStyle: 'none solid solid none',
						transform: 'rotate(45deg)',
					},
					'input:checked + &:after': {
						display: 'block',
					},
					'input:focus + &': {
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			>
				{label}
			</label>
		</div>
	);
}
