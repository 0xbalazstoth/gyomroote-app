﻿import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { v4 as uuidv4 } from "uuid";

function Chat({ socket, username, room }) {
	const [currentMessage, setCurrentMessage] = useState("");
	const [messageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				id: uuidv4(), // Generate a unique ID for the message
				room: room,
				author: username,
				message: currentMessage,
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};

			await socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage("");
		}
	};

	useEffect(() => {
		const receiveMessage = (data) => {
			setMessageList((list) => {
				// Check if the message already exists in the list
				if (!list.some((message) => message.id === data.id)) {
					return [...list, data];
				}
				return list;
			});
		};

		socket.on("receive_message", receiveMessage);

		return () => {
			socket.off("receive_message", receiveMessage);
		};
	}, [socket]);

	return (
		<div className="chat-window">
			<div className="chat-header">
				<p>Live Chat</p>
			</div>
			<div className="chat-body">
				<ScrollToBottom className="message-container">
					{messageList.map((messageContent) => (
						<div
							className="message"
							id={
								username === messageContent.author
									? "you"
									: "other"
							}
							key={messageContent.id}
						>
							<div>
								<div className="message-content">
									<p>{messageContent.message}</p>
								</div>
								<div className="message-meta">
									<p id="time">{messageContent.time}</p>
									<p id="author">{messageContent.author}</p>
								</div>
							</div>
						</div>
					))}
				</ScrollToBottom>
			</div>
			<div className="chat-footer">
				<input
					type="text"
					value={currentMessage}
					placeholder="Hey..."
					onChange={(event) => {
						setCurrentMessage(event.target.value);
					}}
					onKeyPress={(event) => {
						event.key === "Enter" && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>Küldés</button>
			</div>
		</div>
	);
}

export default Chat;