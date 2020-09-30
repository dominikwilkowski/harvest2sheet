/** @jsx jsx */

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Link, useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { getOutput, writeOutput } from './storage';
import { Wrapper } from './primitives/Wrapper';
import { Button } from './primitives/Button';
import { harvestKeys } from './harvestKeys';
import { Input } from './primitives/Input';

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

export function Output({ match }) {
	let {
		params: { itemID },
	} = match;
	itemID = parseInt(itemID);

	let storageOutput = getOutput();
	let nameDefault = '';
	let columnsDefault = [];
	if (itemID) {
		const thisOutput = storageOutput.filter(({ id }) => id === itemID);
		if (thisOutput.length === 1) {
			nameDefault = thisOutput[0].name;
			columnsDefault = thisOutput[0].columns.map((item) => ({
				value: item,
				label: harvestKeys[item].name,
			}));
		}
	}
	const [name, setName] = useState(nameDefault);
	const [columns, setColumns] = useState(columnsDefault);
	const history = useHistory();

	const onChange = (selectedOptions) => setColumns(selectedOptions);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		const newValue = arrayMove(columns, oldIndex, newIndex);
		setColumns(newValue);
	};

	const selectableItems = Object.entries(harvestKeys).map(([key, { name }]) => ({
		value: key,
		label: name,
	}));

	const saveOutput = (event) => {
		event.preventDefault();

		if (columns.length > 0) {
			if (itemID) {
				storageOutput = storageOutput.map((output) =>
					output.id === itemID
						? { id: output.id, name, columns: columns.map(({ value }) => value) }
						: output
				);
			} else {
				storageOutput.push({
					id: storageOutput.length ? storageOutput[storageOutput.length - 1].id + 1 : 1,
					name,
					columns: columns.map(({ value }) => value),
				});
			}
			writeOutput(storageOutput);
			history.push('/output');
		} else {
			//
		}
	};

	const colourStyles = {
		container: (styles) =>
			columns && columns.length ? styles : { ...styles, boxShadow: '0 0 0 3px var(--danger)' },
		control: (styles) => ({
			...styles,
			borderColor: '#767676',
			':hover': { borderColor: '#767676', ...styles[':hover'] },
		}),
	};

	return (
		<Wrapper size="sm">
			<h2>{itemID ? 'Edit' : 'Add'} Output</h2>

			<form
				onSubmit={saveOutput}
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
					<Input
						required
						id="name"
						label="Name"
						value={name}
						onChange={(event) => setName(event.target.value)}
						maxWidth="8rem"
					/>
					<li
						css={{
							marginBottom: '0.5rem',
							'@media (min-width: 37.5rem)': {
								display: 'grid',
								gridTemplateColumns: '8rem auto',
							},
						}}
					>
						<label
							htmlFor="columns"
							css={{
								display: 'inline-block',
								margin: '1rem 0.5rem 0.5rem 0',
								fontSize: '1.5rem',
								alignSelf: 'center',
								whiteSpace: 'nowrap',
								'@media (min-width: 37.5rem)': {
									margin: '0 0.5rem 0 0',
								},
							}}
						>
							Columns
						</label>
						<SortableSelect
							inputId="columns"
							axis="xy"
							onSortEnd={onSortEnd}
							distance={4}
							// small fix for https://github.com/clauderic/react-sortable-hoc/pull/352
							getHelperDimensions={({ node }) => node.getBoundingClientRect()}
							isMulti
							options={selectableItems}
							value={columns}
							styles={colourStyles}
							onChange={onChange}
							components={{
								MultiValue: SortableMultiValue,
							}}
							closeMenuOnSelect={false}
							css={{
								zIndex: 3,
							}}
						/>
					</li>
				</ul>

				<div
					css={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						justifyItems: 'start',
					}}
				>
					<Button look="muted" to="/output" as={Link}>
						Cancel
					</Button>
					<Button
						type="submit"
						css={{
							justifySelf: 'end',
						}}
					>
						{itemID ? 'Edit' : 'Add'} output
					</Button>
				</div>
			</form>
		</Wrapper>
	);
}
