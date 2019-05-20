import React from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner";
import BookingList from "../components/BookingList";
import Chart from "../components/Chart";
import BookingsControls from "../components/BookingsControls";

class BookingsPage extends React.Component {
	static contextType = AuthContext;
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			bookings: [],
			output: "list"
		};
	}
	componentDidMount() {
		this.fecthBookings();
	}

	fecthBookings = () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
					query {
						bookings {
							_id
							createdAt
							event {
								_id
								title
								date
								price
							}
						}
					}
				`
		};

		fetch("/graphql" || "http://localhost:3001/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.context.token
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Request failed");
				}
				return res.json();
			})
			.then(resData => {
				const bookings = resData.data.bookings;
				this.setState({ bookings: bookings, isLoading: false });
			})
			.catch(err => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	};

	showDetailHandler = eventId => {
		this.setState(prevState => {
			const selectedEvent = prevState.events.find(e => e._id === eventId);
			return { selectedEvent: selectedEvent };
		});
	};

	deleteBookingHandler = bookingId => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
					mutation DeleteBooking($id: ID!) {
						cancelBooking(bookingId: $id) {
							_id
							title
						}
					}
				`,
			variables: {
				id: bookingId
			}
		};

		fetch("/graphql" || "http://localhost:3001/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.context.token
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Request failed");
				}
				return res.json();
			})
			.then(resData => {
				this.setState(prevState => {
					const updatedBookings = prevState.bookings.filter(booking => {
						return booking._id !== bookingId;
					});
					return { bookings: updatedBookings, isLoading: false };
				});
			})
			.catch(err => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	};

	outputHandler = output => {
		if (output === "list") {
			this.setState({ output: "list" });
		} else {
			this.setState({ output: "chart" });
		}
	};

	render() {
		let content = <Spinner />;
		if (!this.state.isLoading) {
			content = (
				<React.Fragment>
					<BookingsControls
						activeButton={this.state.output}
						activeOutput={this.outputHandler}
					/>
					<div>
						{this.state.output === "list" ? (
							<BookingList
								bookings={this.state.bookings}
								onDelete={this.deleteBookingHandler}
							/>
						) : (
							<Chart bookings={this.state.bookings} />
						)}
					</div>
				</React.Fragment>
			);
		}
		return <React.Fragment>{content}</React.Fragment>;
	}
}

export default BookingsPage;
