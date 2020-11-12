/** @jsxImportSource @emotion/react */

export function Checkbox({ id, checked, onChange, size = 'lg', ...props }) {
	const styleMap = {
		sm: {
			root: {
				width: '1rem',
				height: '1rem',
				border: '3px solid var(--text)',
			},
			before: {
				top: '-1px',
				right: '-3px',
				width: '0.75rem',
				height: '0.4rem',
				borderBottom: '2px solid var(--text)',
				borderLeft: '2px solid var(--text)',
			},
			after: {
				top: '-8px',
				right: '-8px',
				width: '0.55rem',
				height: '0.85rem',
			},
		},
		lg: {
			root: {
				width: '2rem',
				height: '2rem',
				border: '4px solid var(--text)',
			},
			before: {
				top: '-1px',
				right: '-5px',
				width: '1.5rem',
				height: '0.8rem',
				borderBottom: '4px solid var(--text)',
				borderLeft: '4px solid var(--text)',
			},
			after: {
				top: '-10px',
				right: '-10px',
				width: '0.8rem',
				height: '1.4rem',
			},
		},
	};

	return (
		<div
			css={{
				position: 'relative',
				display: 'inline-block',
				overflow: 'hidden',
			}}
			{...props}
		>
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={onChange}
				css={{
					position: 'absolute',
					top: '-5rem',
					left: '-5rem',
				}}
			/>
			<span
				css={{
					position: 'relative',
					display: 'block',
					borderRadius: '3px',
					zIndex: 1,
					margin: '7px',
					...styleMap[size].root,
					':before': {
						content: '""',
						display: 'none',
						position: 'absolute',
						transform: 'rotate(-45deg)',
						zIndex: 3,
						...styleMap[size].before,
					},
					':after': {
						content: '""',
						display: 'none',
						position: 'absolute',
						background: '#fff',
						zIndex: 2,
						...styleMap[size].after,
					},
					'input:checked + &:before,input:checked + &:after': {
						display: 'block',
					},
					'input:focus + &': {
						boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
					},
				}}
			/>
		</div>
	);
}
