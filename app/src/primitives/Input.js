/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';

export function Input({
	id,
	label,
	required,
	maxWidth = '17rem',
	loading = false,
	help = '',
	visible = true,
	...props
}) {
	const rotation = keyframes({
		to: {
			transform: 'rotate( 360deg )',
		},
	});

	return (
		<li
			css={{
				display: visible ? 'block' : 'none',
				marginBottom: '0.5rem',
				'@media (min-width: 37.5rem)': {
					display: visible ? 'grid' : 'none',
					gridTemplateColumns: `${maxWidth} auto`,
				},
			}}
		>
			<label
				htmlFor={id}
				css={{
					display: 'inline-block',
					margin: '1rem 0.5rem 0.5rem 0',
					fontSize: '1.5rem',
					alignSelf: 'center',
					whiteSpace: 'nowrap',
					'@media (min-width: 37.5rem)': {
						margin: '0 0.5rem 0 0',
					},
				}}
			>
				{label}
			</label>
			<div
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
						borderTopColor: 'var(--text)',
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
						padding: help ? '0.5rem 1.5rem 0.5rem 0.5rem' : '0.5rem',
						margin: 0,
						border: '1px solid #767676',
						borderRadius: '0.2rem',
						apperance: 'none',
						width: '100%',
						color: 'var(--text)',
						':focus': {
							boxShadow: '0 0 0 3px #006cff',
							borderColor: '#006cff',
							outline: 'none',
						},
						':disabled': {
							background: 'var(--alt-bg)',
						},
					}}
					required={visible ? required : false}
					{...props}
				/>
				{help && (
					<button
						type="button"
						aria-label="Help"
						css={{
							position: 'absolute',
							top: '5px',
							right: '5px',
							display: 'inline-block',
							background: '#fff',
							apperance: 'none',
							fontSize: '1rem',
							cursor: 'pointer',
							lineHeight: 1,
							border: '1px solid var(--text)',
							borderRadius: '100%',
							width: '1rem',
							height: '1rem',
							padding: 0,
							margin: 0,
							':before': {
								content: '"?"',
								position: 'absolute',
								top: '50%',
								left: '0',
								margin: '-0.5em 0 0 0',
								fontSize: '0.75rem',
								width: '100%',
								textAlign: 'center',
							},
							':focus, :hover': {
								outline: 'none',
								boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
							},
						}}
					>
						<div
							css={{
								display: 'none',
								position: 'absolute',
								width: 'max-content',
								maxWidth: '93vw',
								right: '-0.4rem',
								top: '2.6rem',
								background: '#fff',
								border: '3px solid var(--info)',
								padding: '0.5rem',
								whiteSpace: 'nowrap',
								textAlign: 'right',
								zIndex: 4,
								':before': {
									content: '""',
									position: 'absolute',
									top: '-1.7rem',
									right: '0.6rem',
									width: '3px',
									height: '1.7rem',
									background: 'var(--info)',
								},
								'button:focus > &, button:active > &, button:hover > &': {
									display: 'block',
								},
								'& img': {
									maxWidth: '100%',
								},
								'@media (min-width: 63.75rem)': {
									maxWidth: '59.375rem',
								},
							}}
						>
							{help}
						</div>
					</button>
				)}
			</div>
		</li>
	);
}
