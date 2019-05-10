import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/auth-context";
import DrawerButton from "./DrawerButton";

import "./MainNavigation.css";

const MainNavigation = props => (
	<AuthContext.Consumer>
		{context => {
			return (
				<header className="main-navigation">
						<DrawerButton click={props.drawerClick} />
					<div className="main-navigation-logo">
						<h1>EventBooking</h1>
					</div>
					<div className="main-navigation-items">
						<ul>
							{!context.token && (
								<li>
									<NavLink to="/auth">Login</NavLink>
								</li>
							)}
							<li>
								<NavLink to="/events">Events</NavLink>
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
					</div>
				</header>
			);
		}}
	</AuthContext.Consumer>
);

export default MainNavigation;
