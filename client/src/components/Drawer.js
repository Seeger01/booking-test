import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/auth-context";

import "./Drawer.css";

const Drawer = props => {
	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
 return (
	<AuthContext.Consumer>
		{context => {
			return (
				<nav className={drawerClasses}>
					<ul>
						{!context.token && (
							<li>
								<NavLink onClick={props.show} to="/auth">Login</NavLink>
							</li>
						)}
						<li>
							<NavLink onClick={props.show} to="/events">Events</NavLink>
						</li>
						{context.token && (
							<React.Fragment>
								<li>
									<NavLink to="/bookings">Bookings</NavLink>
								</li>
								<li>
									<button onClick={context.logout}>Logout</button>
								</li>
							</React.Fragment>
						)}
					</ul>
				</nav>
			);
		}}
	</AuthContext.Consumer>
)};

export default Drawer;
