/** @jsx jsx */

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Link, useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { harvestKeys } from './harvestKeys';

function arrayMove(array, from, to) {
	array = array.slice();
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
	return array;
}

const SortableMultiValue = SortableElement((props) => {
	const onMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};
	const innerProps = { onMouseDown };
	return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableSelect = SortableContainer(Select);

export function Output() {
	const storageOutput = JSON.parse(localStorage.getItem('harvest2sheetOutput') || '[]').map(
		(item) => ({
			value: item,
			label: harvestKeys[item].name,
		})
	);
	const [output, setOutput] = useState(storageOutput);
	const history = useHistory();

	const onChange = (selectedOptions) => setOutput(selectedOptions);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		const newValue = arrayMove(output, oldIndex, newIndex);
		setOutput(newValue);
	};

	const selectableItems = Object.entries(harvestKeys).map(([key, { name }]) => ({
		value: key,
		label: name,
	}));

	const saveOutput = (event) => {
		event.preventDefault();

		localStorage.setItem('harvest2sheetOutput', JSON.stringify(output.map(({ value }) => value)));
		history.push('/');
	};

	return (
		<Wrapper>
			<h2>Output</h2>

			<form
				onSubmit={saveOutput}
				css={{
					margin: 0,
					padding: 0,
				}}
			>
				<p>Select the columns to be written into the spreadsheets</p>
				<SortableSelect
					axis="xy"
					onSortEnd={onSortEnd}
					distance={4}
					// small fix for https://github.com/clauderic/react-sortable-hoc/pull/352
					getHelperDimensions={({ node }) => node.getBoundingClientRect()}
					isMulti
					options={selectableItems}
					value={output}
					onChange={onChange}
					components={{
						MultiValue: SortableMultiValue,
					}}
					closeMenuOnSelect={false}
				/>

				<div
					css={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						justifyItems: 'start',
					}}
				>
					<Button look="muted" to="/" as={Link}>
						Cancel
					</Button>
					<Button
						type="submit"
						css={{
							justifySelf: 'end',
						}}
					>
						Save output
					</Button>
				</div>
			</form>
		</Wrapper>
	);
}
