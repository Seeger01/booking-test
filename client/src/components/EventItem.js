import React from "react";

import "./EventItem.css";

const eventItem = props => (
	<li key={props.eventId} className="events-list-item">
		<div className="events-list-item-right">
			<h1>{props.title}</h1>
			<h2>
				Price: ${props.price} <br /> Date:{" "}
				{new Date(props.date).toLocaleDateString()} <br /> Time:{" "}
				{new Date(props.date).toLocaleTimeString()}
			</h2>
		</div>
		<div>
			{props.userId === props.creatorId ? (
				<p>your the owner of this event</p>
			) : (
				<button
					className="btn"
					onClick={props.onDetail.bind(this, props.eventId)}
				>
					View Details
				</button>
			)}
		</div>
	</li>
);

export default eventItem;
