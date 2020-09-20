/** @jsx jsx */

import { Link } from 'react-router-dom';
import { jsx } from '@emotion/core';

import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';

export function Output() {
	return (
		<Wrapper>
			<h2>Output</h2>
			<Button look="muted" to="/" as={Link}>
				Cancel
			</Button>
		</Wrapper>
	);
}
