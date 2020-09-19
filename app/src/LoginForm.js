/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { Input } from './primitives/Input';

export function LoginForm({ handleLogin, inputLines }) {
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
						margin: 0,
						padding: 0,
					}}
				>
					<ul
						css={{
							listStyle: 'none',
							padding: 0,
							margin: 0,
						}}
					>
						{inputLines.map(({ id, label, value, setValue }) => (
							<Input
								required
								key={id}
								id={id}
								label={label}
								value={value}
								onChange={(event) => setValue(event.target.value)}
							/>
						))}
					</ul>
					<Button
						type="submit"
						css={{
							float: 'right',
						}}
					>
						Save login
					</Button>
				</form>
			</Wrapper>
		</Fragment>
	);
}
