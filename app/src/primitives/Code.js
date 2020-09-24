/** @jsx jsx */

import { jsx } from '@emotion/core';

export function Code(props) {
	return (
		<span
			css={{
				display: 'inline-block',
				background: 'var(--alt-bg)',
				border: '1px solid #ccc',
				padding: '0 0.25rem',
				borderRadius: '3px',
				margin: '0.25rem 0.25rem 0 0',
				fontSize: '0.75rem',
			}}
			{...props}
		/>
	);
}
