/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';
import { Fragment } from 'react';

import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { Input } from './primitives/Input';

export function LoginForm({ handleLogin, inputLines, loading, error }) {
	const rotation = keyframes({
		to: {
			transform: 'rotate( 360deg )',
		},
	});

	return (
		<Fragment>
			<h1
				css={{
					fontFamily:
						'"Playfair Display", "PT Serif", Cambria, "Hoefler Text", Utopia, "Liberation Serif", "Nimbus Roman No9 L Regular", Times, "Times New Roman", serif',
					fontStyle: 'italic',
					fontSize: '20vw',
					margin: '0 0 5vw 0',
					textAlign: 'center',
					fontWeight: 700,
					textShadow: '0 1.8vw 1.8vw #333',
					color: '#fff',
					'@media (min-width: 125rem)': {
						fontSize: '25rem',
						marginBottom: '6.25rem',
						textShadow: '0 2.25rem 2.25rem #333',
					},
				}}
			>
				Login
			</h1>
			<Wrapper>
				<form
					onSubmit={handleLogin}
					css={{
						position: 'relative',
						margin: 0,
						padding: 0,
						':after': {
							content: '""',
							display: loading ? 'block' : 'none',
							position: 'absolute',
							top: '50%',
							left: '50%',
							marginLeft: '-2.5rem',
							marginTop: '-2.5rem',
							width: '5rem',
							height: '5rem',
							border: '0.75rem solid #aaa',
							borderTopColor: '#383E48',
							borderRadius: '100%',
							animation: `${rotation} 0.5s linear infinite`,
						},
					}}
				>
					<ul
						css={{
							listStyle: 'none',
							padding: 0,
							margin: 0,
							opacity: loading ? 0.4 : 1,
						}}
					>
						{inputLines.map(({ id, label, value, setValue }) => (
							<Input
								required
								key={id}
								id={id}
								label={label}
								value={value}
								disabled={loading}
								onChange={(event) => setValue(event.target.value)}
							/>
						))}
					</ul>
					<div
						css={{
							display: 'grid',
							gridTemplateColumns: '1fr',
							justifyItems: 'end',
						}}
					>
						<Button type="submit" disabled={loading}>
							Save login
						</Button>
					</div>
					{error && (
						<span
							css={{
								display: 'inline-block',
								marginTop: '1rem',
								color: 'red',
							}}
						>
							{error}
						</span>
					)}
				</form>
			</Wrapper>
		</Fragment>
	);
}
