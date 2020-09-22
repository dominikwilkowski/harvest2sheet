/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';

export function Input({ id, label, loading = false, ...props }) {
	const rotation = keyframes({
		to: {
			transform: 'rotate( 360deg )',
		},
	});

	return (
		<li
			css={{
				marginBottom: '0.5rem',
				'@media (min-width: 37.5rem)': {
					display: 'grid',
					gridTemplateColumns: '16rem auto',
				},
			}}
		>
			<label
				htmlFor={id}
				css={{
					display: 'block',
					margin: '1rem 0 0.5rem 0',
					fontSize: '1.5rem',
					alignSelf: 'center',
					whiteSpace: 'nowrap',
					'@media (min-width: 37.5rem)': {
						display: 'inline-block',
						margin: '0 0.5rem 0 0',
					},
				}}
			>
				{label}
			</label>
			<span
				css={{
					position: 'relative',
					':after': {
						content: '""',
						display: loading ? 'block' : 'none',
						position: 'absolute',
						top: '10px',
						left: '50%',
						marginLeft: '-0.75rem',
						width: '1.5rem',
						height: '1.5rem',
						border: '3px solid #ccc',
						borderTopColor: '#383E48',
						borderRadius: '100%',
						animation: `${rotation} 0.6s linear infinite`,
					},
				}}
			>
				<input
					id={id}
					type="text"
					css={{
						fontSize: '1.5rem',
						padding: '0.5rem',
						margin: 0,
						border: '1px solid #767676',
						borderRadius: '0.2rem',
						apperance: 'none',
						width: '100%',
						color: '#383E48',
						':focus': {
							boxShadow: '0 0 0 3px #006cff',
							borderColor: '#006cff',
							outline: 'none',
						},
						':disabled': {
							background: '#eee',
						},
					}}
					{...props}
				/>
			</span>
		</li>
	);
}
