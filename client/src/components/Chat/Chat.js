import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';


import { Input } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import './Chat.css';

let socket;

export default function Chat(props) {

	const { name } = querystring.parse(props.location.search);
	const [message, setMessage] = useState('');
	const ENDPOINT = 'http://localhost:3001';

	useEffect(() => {

		socket = io(ENDPOINT);
		socket.name = name;

		socket.on('connect', () => {
			socket.emit('message', { message: `${socket.name} se conectou`, id: socket.id, bot: true });
			socket.emit('getName', name);
		});

		socket.on('message', (payload) => {
			showMessage(payload);
		});

		return () => {
			socket.off();
		}

	}, [ENDPOINT, name]);

	const showMessage = (payload) => {
		const span = document.createElement('span');
		if (!payload.bot) {
			if (socket.id === payload.id)
				span.classList = 'message-container message-mine';
			else
				span.classList = 'message-container';

			const p = document.createElement('p');
			p.className = 'author';
			p.innerHTML = payload.name;

			const spanMsg = document.createElement('span');
			spanMsg.className = 'message';
			spanMsg.innerHTML = payload.message;

			span.append(p);
			span.append(spanMsg);

		} else {
			span.className = 'message-bot';
			span.innerHTML = payload.message;
		}

		document.querySelector('.messages-list').append(span);
		scrollDown();
		clearInput();
	}

	const sendMessageToServer = (bot = false) => {
		if (message.trim() === '') return;
		const payload = {
			message,
			id: socket.id,
			name,
		}
		if (bot)
			payload.bot = true;
		socket.emit('message', payload);
	}

	const clearInput = () => {
		document.querySelector('input').value = '';
		setMessage('');
		focusInput();
	};

	const focusInput = () => {
		document.querySelector('input').focus();
	}

	const scrollDown = () => {
		const div = document.querySelector('.chat-body');
		div.scrollTop = div.scrollHeight;
	}

	return (
		<div className="chat-container">
			<div className="chat-body">
				<div className="messages">
					<span className="messages-list">
						{/* <span className="message-container">
							<p className="author">Teste:</p>
							<span className="message">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
						</span> */}
					</span>
				</div>
			</div>
			<div className="chat-footer">
				<div className="footer-content">
					<Input
						onChange={(e) => setMessage(e.target.value)}
						onKeyUp={(e) => { if (e.key === 'Enter') sendMessageToServer() }}
						style={{ width: "100%" }}
						placeholder="Write something..."
					/>

					<SendIcon
						onClick={() => sendMessageToServer()}
						color="primary"
						style={{ cursor: "pointer", margin: "5px 10px" }}
					/>
				</div>
			</div>
		</div>
	)
}
