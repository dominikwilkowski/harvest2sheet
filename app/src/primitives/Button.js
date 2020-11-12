/** @jsxImportSource @emotion/react */

import { keyframes } from '@emotion/react';

export function Button({ children, loading, look = 'default', as: Tag = 'button', ...props }) {
	const styleMap = {
		default: {
			'--gradient': 'linear-gradient(to right, var(--bg-color1) 0%, var(--bg-color2) 100%)',
		},
		muted: {
			'--gradient': 'linear-gradient(to right, #ccc 0%, #555 50%, #ccc 100%)',
			':hover:before, :focus:before': props.disabled
				? {}
				: {
						filter: 'invert(1)',
				  },
		},
	};

	const rotation = keyframes({
		to: {
			transform: 'rotate( 360deg )',
		},
	});

	return (
		<Tag
			disabled={loading}
			css={{
				position: 'relative',
				display: 'inline-block',
				border: 'none',
				background: '#fff',
				apperance: 'none',
				fontSize: '1rem',
				cursor: 'pointer',
				lineHeight: 1,
				padding: '3px',
				borderRadius: '6px',
				margin: '1rem 0 0 0',
				textDecoration: 'none',
				':before': {
					content: '""',
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					background: 'var(--gradient)',
					borderRadius: '8px',
					transition: 'filter 0.3s ease',
					zIndex: 1,
				},
				':after': {
					content: '""',
					display: loading ? 'block' : 'none',
					position: 'absolute',
					top: '50%',
					left: '50%',
					marginLeft: '-0.75rem',
					marginTop: '-0.75rem',
					width: '1.5rem',
					height: '1.5rem',
					border: '3px solid #ccc',
					borderTopColor: 'var(--text)',
					borderRadius: '100%',
					animation: `${rotation} 0.6s linear infinite`,
					zIndex: 2,
				},
				':disabled': {
					opacity: 0.4,
				},
				':hover:before': props.disabled
					? {}
					: {
							filter: 'hue-rotate(180deg)',
					  },
				':focus': {
					outline: 'none',
					boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
				},
				...(styleMap[look] ? styleMap[look] : {}),
			}}
			{...props}
		>
			<span
				css={{
					position: 'relative',
					display: 'block',
					background: '#fff',
					padding: '0.5rem 2.5rem',
					borderRadius: '6px',
					zIndex: 2,
				}}
			>
				{children}
			</span>
		</Tag>
	);
}
