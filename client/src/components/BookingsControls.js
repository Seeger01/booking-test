import React from "react";

import "./BookingsControls.css";

const BookingsControls = props => {
	return (
		<div className="bookings-control">
			<button
				className={props.activeButton === "list" ? "active" : ""}
				onClick={props.activeOutput.bind(this, "list")}
			>
				List
			</button>
			<button
				className={props.activeButton === "chart" ? "active" : ""}
				onClick={props.activeOutput.bind(this, "chart")}
			>
				Chart
			</button>
		</div>
	);
};

export default BookingsControls;
