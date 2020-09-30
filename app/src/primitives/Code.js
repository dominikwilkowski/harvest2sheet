/** @jsx jsx */

import { jsx } from '@emotion/core';

export function Code({ kind, ...props }) {
	const kindMap = {
		project: {
			content: '"P"',
			title: 'Project',
		},
		client: {
			content: '"C"',
			title: 'Client',
		},
	};

	return (
		<span
			title={kind ? kindMap[kind].title : null}
			css={{
				display: 'inline-block',
				background: 'var(--alt-bg)',
				border: '1px solid #ccc',
				padding: '0 0.25rem',
				borderRadius: '3px',
				margin: '0.25rem 0.25rem 0 0',
				fontSize: '0.75rem',
				...(kind
					? {
							':before': {
								content: kindMap[kind].content,
								display: 'inline-block',
								fontWeight: 900,
								marginRight: '0.25rem',
								paddingRight: '0.25rem',
								borderRight: '1px solid #ccc',
							},
					  }
					: {}),
			}}
			{...props}
		/>
	);
}
