import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core'

import './Join.css';

export default function Join() {
	const [name, setName] = useState('');

	return (
		<div className="join-container">
			<div className="join-header">
				<h1>Join a room</h1>
			</div>
			<div className="join-body">
				<input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" />
				<Link onClick={(e) => (!name) ? e.preventDefault() : null} to={`/chat?name=${name}`} style={{ textDecoration: 'none' }} >
					<Button variant="contained" color="primary">Join</Button>
				</Link>
			</div>
		</div>
	)
}
