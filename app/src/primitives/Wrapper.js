/** @jsx jsx */

import { jsx } from '@emotion/core';

export function Wrapper({ children, size = 'md' }) {
	const sizeMap = {
		sm: '30rem',
		md: '60rem',
		lg: '93.75rem',
	};

	return (
		<div
			css={{
				maxWidth: sizeMap[size],
				background: '#fff',
				margin: '1rem auto',
				padding: '2rem 1rem',
				boxShadow: '0 0 1rem 0.25rem rgba(0, 0, 0, 0.4)',
				overflow: 'hidden',
				'@media (min-width: 37.5rem)': {
					padding: '2rem',
				},
			}}
		>
			{children}
		</div>
	);
}
