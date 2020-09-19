/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';

export function Button({ children, loading, look = 'default', as: Tag = 'button', ...props }) {
	const styleMap = {
		default: {
			background: '#008800',
			color: '#fff',
			':hover': {
				boxShadow: '0 0 0 2px white, 0 0 0 3px #008800',
			},
		},
		muted: {
			border: '1px solid #767676',
			':hover': {
				boxShadow: '0 0 0 2px white, 0 0 0 3px #767676',
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
			disabled={loading ? true : false}
			css={{
				position: 'relative',
				display: 'inline-block',
				border: 'none',
				borderRadius: '1px',
				apperance: 'none',
				fontSize: '1rem',
				cursor: 'pointer',
				lineHeight: 1,
				padding: '1rem 1.5rem',
				margin: '1rem 0 0 0',
				textDecoration: 'none',
				':after': {
					content: '""',
					display: loading ? 'block' : 'none',
					position: 'absolute',
					top: '12px',
					left: '50%',
					marginLeft: '-0.75rem',
					width: '1.5rem',
					height: '1.5rem',
					border: '3px solid #aaa',
					borderTopColor: '#000',
					borderRadius: '100%',
					animation: `${rotation} 0.6s linear infinite`,
				},
				':disabled': {
					opacity: 0.4,
				},
				...(styleMap[look] ? styleMap[look] : {}),
			}}
			{...props}
		>
			{children}
		</Tag>
	);
}
