/** @jsx jsx */

import { jsx, keyframes } from '@emotion/core';
import { useState } from 'react';

export function IconButton({
	children,
	confirm,
	onClick,
	icon,
	look = 'add',
	as: Tag = 'button',
	...props
}) {
	const [clicked, setClicked] = useState(false);
	const [confirmScreen, setConfirmScreen] = useState(false);
	const [reset, setReset] = useState([]);

	const pulse1 = keyframes({
		'0%': {
			transform: 'scale(0.6)',
			opacity: 0,
		},
		'33%': {
			transform: 'scale(1)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(1.4)',
			opacity: 0,
		},
	});

	const pulse2 = keyframes({
		'0%': {
			boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
			opacity: 0,
		},
		'33%': {
			boxShadow: '0 0 0 10px rgba(255, 255, 255, 0.2)',
			opacity: 1,
		},
		'100%': {
			boxShadow: '0 0 0 16px rgba(255, 255, 255, 0.2)',
			opacity: 0,
		},
	});

	const styleMap = {
		'import-export': {
			':before, :after': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '14px',
				width: '10px',
				height: '10px',
				marginTop: '-5px',
				border: '3px solid var(--text)',
				borderRadius: '100% 0 100% 100%',
				transform: 'rotate(45deg)',
				transition: 'border 0.2s ease',
			},
			':after': {
				left: '25px',
				borderRadius: '100% 100% 100% 0',
			},
			':hover': {
				background: 'var(--info)',
				color: '#fff',
			},
			':hover:before, :hover:after': {
				borderColor: '#fff',
			},
		},
		import: {
			':before': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '20px',
				width: '3px',
				height: '10px',
				marginTop: '-6px',
				background: 'var(--text)',
				borderRadius: '2px',
				transition: 'background 0.2s ease',
			},
			':after': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '17px',
				width: '9px',
				height: '9px',
				marginTop: '-3px',
				border: '3px solid var(--text)',
				borderStyle: 'none solid solid none',
				transform: 'rotate(45deg)',
				borderRadius: '2px',
				transition: 'border 0.2s ease',
			},
			':hover': {
				background: 'var(--info)',
				color: '#fff',
			},
			':hover:before': {
				background: '#fff',
			},
			':hover:after': {
				borderColor: '#fff',
			},
		},
		export: {
			':before': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '17px',
				width: '9px',
				height: '9px',
				marginTop: '-6px',
				border: '3px solid var(--text)',
				borderStyle: 'solid none none solid',
				transform: 'rotate(45deg)',
				borderRadius: '2px',
				transition: 'border 0.2s ease',
			},
			':after': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '20px',
				width: '3px',
				height: '10px',
				marginTop: '-4px',
				background: 'var(--text)',
				borderRadius: '2px',
				transition: 'background 0.2s ease',
			},
			':hover': {
				background: 'var(--info)',
				color: '#fff',
			},
			':hover:before': {
				borderColor: '#fff',
			},
			':hover:after': {
				background: '#fff',
			},
		},
		adjust: {
			':before': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '14px',
				width: '14px',
				height: '14px',
				marginTop: '-7px',
				border: '6px solid var(--text)',
				borderRadius: '100%',
				transition: 'border 0.2s ease',
			},
			':after': {
				content: '""',
				position: 'absolute',
				boxSizing: 'content-box',
				top: '50%',
				left: '12px',
				width: '10px',
				height: '10px',
				marginTop: '-9px',
				border: '4px dotted var(--text)',
				borderRadius: '100%',
				transition: 'border 0.2s ease',
			},
			':hover': {
				background: 'var(--info)',
				color: '#fff',
			},
			':hover:before, :hover:after': {
				borderColor: '#fff',
			},
		},
		logout: {
			background: '#fff',
			':hover': {
				background: 'var(--danger)',
				color: '#fff',
			},
		},
		sync: {
			background: props.disabled ? 'var(--alt-bg)' : 'var(--confirm)',
			color: props.disabled ? 'var(--text)' : '#fff',
			cursor: props.disabled ? 'not-allowed' : 'pointer',
			':before': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '0.5rem',
				width: '1.5rem',
				height: '1.5rem',
				marginTop: '-0.75rem',
				background: 'rgba(255,255,255, 0.2)',
				borderRadius: '50px',
				opacity: 0,
				animation: props.disabled ? 'none' : `${pulse1} 3s 2s infinite linear`,
			},
			':after': {
				content: '""',
				position: 'absolute',
				top: '50%',
				left: '1rem',
				width: '4px',
				height: '4px',
				marginTop: '-2px',
				marginLeft: '2px',
				background: props.disabled ? 'var(--text)' : '#fff',
				borderRadius: '50%',
				boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)',
				animation: props.disabled ? 'none' : `${pulse2} 3s infinite linear`,
			},
		},
		add: {
			':before, :after': {
				content: '""',
				position: 'absolute',
				width: '1rem',
				height: '0.25rem',
				background: 'var(--text)',
				borderRadius: '2px',
				top: '50%',
				marginTop: '-0.125rem',
				left: '1rem',
				transition: 'background 0.2s ease',
			},
			':after': {
				transform: 'rotate(-90deg)',
			},
			':hover': {
				background: 'var(--info)',
				color: '#fff',
			},
			':hover:before, :hover:after': {
				background: '#fff',
			},
		},
		delete: {
			':before, :after': {
				content: '""',
				position: 'absolute',
				width: '1rem',
				height: '0.25rem',
				background: 'var(--text)',
				borderRadius: '2px',
				transform: 'rotate(45deg)',
				top: '50%',
				marginTop: '-0.125rem',
				left: '1rem',
				transition: 'background 0.2s ease',
			},
			':after': {
				transform: 'rotate(-45deg)',
			},
			':hover': {
				background: 'var(--danger)',
				color: '#fff',
			},
			':hover:before, :hover:after': {
				background: '#fff',
			},
		},
		edit: {
			':before': {
				content: '""',
				position: 'absolute',
				top: '50%',
				marginTop: '-0.5rem',
				left: '1rem',
				width: '0.9rem',
				height: '1rem',
				border: '2px solid var(--text)',
				transition: 'border 0.2s ease',
			},
			':after': {
				content: '""',
				position: 'absolute',
				top: '2px',
				left: '1.65rem',
				background: 'var(--text)',
				width: '4px',
				height: '1rem',
				transform: 'rotate(45deg)',
				borderRadius: '1px 1px 50% 50%',
				boxShadow: '0 0 0 2px var(--alt-bg)',
				transition: 'background 0.2s ease, box-shadow 0.2s ease',
			},
			':hover': {
				background: 'var(--confirm)',
				color: '#fff',
			},
			':hover:before': {
				borderColor: '#fff',
			},
			':hover:after': {
				background: '#fff',
				boxShadow: '0 0 0 2px var(--confirm)',
			},
		},
	};

	const handleClick = (event) => {
		clearTimeout(reset);
		setReset([]);

		if (confirm && !clicked) {
			event.preventDefault();
			setConfirmScreen(true);
			setReset(
				setTimeout(() => {
					setClicked(false);
					setConfirmScreen(false);
					setReset([]);
				}, 3000)
			);
		} else {
			if (typeof onClick == 'function') {
				onClick();
			}

			setConfirmScreen(false);
		}

		setClicked(!clicked);
	};

	return (
		<Tag
			css={{
				position: 'relative',
				display: 'inline-block',
				apperance: 'none',
				background: 'var(--alt-bg)',
				color: 'var(--text)',
				border: 'none',
				borderRadius: '6px',
				padding: icon ? '0.5rem 1rem 0.5rem 2rem' : '0.5rem 1rem 0.5rem 2.5rem',
				fontSize: '0.75rem',
				textDecoration: 'none',
				textAlign: 'center',
				lineHeight: 1,
				transition: 'background 0.2s ease, color 0.2s ease',
				overflow: 'hidden',
				cursor: 'pointer',
				':focus': {
					outline: 'none',
					boxShadow: '0 0 0 2px #fff, 0 0 0 5px var(--focus)',
				},
				...(styleMap[look] ? styleMap[look] : {}),
			}}
			onClick={handleClick}
			{...props}
		>
			{icon && (
				<img
					src={icon}
					alt=""
					css={{
						position: 'absolute',
						left: '6px',
						top: '3px',
						height: '22px',
						borderRadius: '100%',
					}}
				/>
			)}
			{confirmScreen ? 'Sure?' : children}
		</Tag>
	);
}
