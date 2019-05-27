import React from "react";
import Modal from "../components/Modal";
import Backdrop from "../components/Backdrop";
import EventList from "../components/EventList";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner";

import "./Events.css";

class EventsPage extends React.Component {
	static contextType = AuthContext;
	isActive = true;
	constructor(props) {
		super(props);
		this.state = {
			creating: false,
			events: [],
			isLoading: false,
			selectedEvent: null
		};
		this.titleEl = React.createRef();
		this.priceEl = React.createRef();
		this.dateEl = React.createRef();
		this.descriptionEl = React.createRef();
	}

	componentDidMount() {
		this.fetchEvents();
	}

	createEventHandler = () => {
		this.setState({ creating: true });
	};

	modalConfirmHandler = () => {
		this.setState({ creating: false });
		const title = this.titleEl.current.value;
		const price = +this.priceEl.current.value;
		const date = this.dateEl.current.value;
		const description = this.descriptionEl.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return;
		}

		const event = { title, price, date, description };

		const requestBody = {
			query: `
					mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
						createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
							_id
							title
							date
							price
						}
					}
				`,
			variables: {
				title: title,
				description: description,
				price: price,
				date: date
			}
		};

		const token = this.context.token;

		fetch("/graphql" || "http://localhost:3001/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + token
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
					const updatedEvents = [...prevState.events];
					updatedEvents.push({
						_id: resData.data.createEvent._id,
						title: resData.data.createEvent.title,
						description: resData.data.createEvent.description,
						date: resData.data.createEvent.date,
						price: resData.data.createEvent.price,
						creator: {
							_id: this.context.userId
						}
					});
					return { events: updatedEvents };
				});
			})
			.catch(err => {
				console.log(err);
			});
	};

	modalCancelHandler = () => {
		this.setState({ creating: false, selectedEvent: null });
	};

	fetchEvents() {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
					query {
						events {
							_id
							title
							date
							price
							description
							creator {
								_id
								email
							}
						}
					}
				`
		};

		fetch("/graphql" || "http://localhost:3001/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Request failed");
				}
				return res.json();
			})
			.then(resData => {
				const events = resData.data.events;
				if (this.isActive) {
					this.setState({ events: events, isLoading: false });
				}
			})
			.catch(err => {
				if (this.isActive) {
					this.setState({ isLoading: false });
				}
			});
	}

	showDetailHandler = eventId => {
		this.setState(prevState => {
			const selectedEvent = prevState.events.find(e => e._id === eventId);
			return { selectedEvent: selectedEvent };
		});
	};

	bookEventHandler = () => {
		if (!this.context.token) {
			this.setState({ selectedEvent: null });
			return;
		}
		const requestBody = {
			query: `
					mutation BookEvent($id: ID!) {
						bookEvent(eventId: $id) {
							_id
							createdAt
							updatedAt
						}
					}
				`,
			variables: {
				id: this.state.selectedEvent._id
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
				console.log(resData);
				this.setState({ selectedEvent: null });
			})
			.catch(err => {
				console.log(err);
			});
	};

	componentWillUnmount() {
		this.isActive = false;
	}

	render() {
		return (
			<React.Fragment>
				{(this.state.creating || this.state.selectedEvent) && <Backdrop />}
				{this.state.creating && (
					<Modal
						title="Add Event"
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.modalConfirmHandler}
						confirmText="Confirm"
					>
						<form>
							<div className="form-control">
								<label htmlFor="title">Title</label>
								<input type="text" id="title" ref={this.titleEl} />
							</div>
							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input type="number" id="price" ref={this.priceEl} />
							</div>
							<div className="form-control">
								<label htmlFor="date">Date</label>
								<input type="datetime-local" id="date" ref={this.dateEl} />
							</div>
							<div className="form-control">
								<label htmlFor="description">Description</label>
								<textarea id="description" rows="4" ref={this.descriptionEl} />
							</div>
						</form>
					</Modal>
				)}
				{this.state.selectedEvent && (
					<Modal
						title={this.state.selectedEvent.title}
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.bookEventHandler}
						confirmText={this.context.token ? "Book" : "Confirm"}
					>
						<h1>{this.state.selectedEvent.title}</h1>
						<p>{this.state.selectedEvent.description}</p>
						<h2 className="h2pricing">
							Price: ${this.state.selectedEvent.price} - <br />
							Date:{" "}
							{new Date(this.state.selectedEvent.date).toLocaleDateString(
								"dk-DK"
							)}{" "}
							<br />
							Time:{" "}
							{new Date(this.state.selectedEvent.date).toLocaleTimeString(
								"dk-DK"
							)}
						</h2>
					</Modal>
				)}
				{this.context.token && (
					<div className="events-control">
						<p>Share your own Events!</p>
						<button className="btn" onClick={this.createEventHandler}>
							Create Event
						</button>
					</div>
				)}
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<EventList
						events={this.state.events}
						userId={this.context.userId}
						viewDetails={this.showDetailHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default EventsPage;
