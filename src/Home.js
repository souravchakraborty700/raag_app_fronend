import React, { useState } from "react";
import './Home.css';

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);  // State to store chat messages
    const [userMessage, setUserMessage] = useState("");  // State to store the user's input message
    const [loading, setLoading] = useState(false);  // State to show typing indicator

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle file upload
    const handleFileUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include'  // Include cookies in the request
            }
        )
        .then(response => response.json())
        .then(data => {
            alert('File uploaded successfully');
            console.log(data);
        })
        .catch(error => console.error("Error:", error));
    };

    // Handle user message submission
    const handleSendMessage = () => {
        if (!userMessage.trim()) return;

        // Display the user message in the chatbox
        setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);

        // Show typing indicator
        setLoading(true);

        // Sending the message to the backend to get the response
        fetch(`${process.env.REACT_APP_BACKEND_URL}/chatgpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ content: userMessage })  // Send the message in JSON format
        })
        .then(response => response.json())
        .then(data => {
            // Remove the typing indicator
            setLoading(false);
            // Display the bot response in the chatbox
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: data.response }]);
        })
        .catch(error => {
            console.error("Error:", error);
            // Remove typing indicator in case of error
            setLoading(false);
        });

        // Clear the input field
        setUserMessage("");
    };

    return (
        <div className="home-container">
            <h1>RAG App</h1>

            {/* File Upload Section */}
            <div>
                <input type="file" onChange={handleFileChange}/>
                <button onClick={handleFileUpload}>Upload File</button>
            </div>

            {/* Chatbox Section */}
            <div className="chatbox">
                {/* Chat History */}
                <div className="chat-history">
                    {messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.sender}`}>
                            {/* Display user/bot icon based on sender */}
                            {message.sender === 'bot' && (
                                <img
                                    src="https://psrassuarancedev.webgen.me/wp-content/uploads/image_2024_07_23T12_52_23_903Z-removebg-preview.png"
                                    alt="Bot Icon"
                                    className="bot-icon"
                                />
                            )}
                            <p>{message.text}</p>
                            {message.sender === 'user' && (
                                <img
                                    src="https://psrassuarancedev.webgen.me/wp-content/uploads/chat_user.png"
                                    alt="User Icon"
                                    className="user-icon"
                                />
                            )}
                        </div>
                    ))}
                    {/* Show typing indicator if loading */}
                    {loading && (
                        <div className="chat-message bot typing-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="chat-input">
                    <textarea
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type your message..."
                    ></textarea>
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
