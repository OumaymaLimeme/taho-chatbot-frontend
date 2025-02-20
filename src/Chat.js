import React, { useState, useEffect, useRef } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // WebSocket reference
  const socketRef = useRef(null);
  // Loading state for chatbot response
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat");
    socketRef.current.onopen = () => console.log("Connected to WebSocket");

    // Handle incoming messages from WebSocket

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => {
        if (
          prevMessages.length > 0 &&
          prevMessages[prevMessages.length - 1].sender === "TAHO AI"
        ) {
          // Add incoming text to the last chatbot message
          const updatedMessage = {
            sender: "TAHO AI",
            text: prevMessages[prevMessages.length - 1].text + " " + event.data,
          };
          return [...prevMessages.slice(0, -1), updatedMessage];
        } else {
          // Add a new chatbot message
          return [...prevMessages, { sender: "TAHO AI", text: event.data }];
        }
      });
      setIsLoading(false);
    };
    // Handle WebSocket errors
    socketRef.current.onerror = (error) =>
      console.error("WebSocket error:", error);
    // Handle WebSocket closure
    socketRef.current.onclose = () =>
      console.log("WebSocket connection closed");
    // Cleanup: close WebSocket connection when component unmounts
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // Function to send a user message
  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text: input },
      ]);
      setIsLoading(true);
      socketRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-800">
      <div className="max-w-2xl mx-auto p-6 ">
        {/* Toggle dark mode button */}
        <button
          onClick={() => document.body.classList.toggle("dark")}
          className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 absolute top-4 right-4 z-10"
        >
          {/* Dark and light mode icons */}
          <svg
            className="fill-violet-700 block dark:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg
            className="fill-yellow-500 hidden dark:block"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <h2 className="text-6xl font-semibold text-center mb-6 text-blue-600">
          TAHO AI Chatbot
        </h2>

        {/* Dark mode toggle */}
        <div className="border rounded-lg p-6 h-100 overflow-y-auto bg-white shadow-lg shadow-blue-200">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-xl ${
                msg.sender === "You"
                  ? "bg-blue-100 text-right text-blue-800"
                  : "bg-gray-100 text-left text-gray-800"
              } transition-all duration-300 ease-in-out`}
            >
              <strong className="font-semibold">{msg.sender}:</strong>{" "}
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
            </div>
          )}
        </div>
        {/* Chat window */}
        <div className="mt-6 flex items-center">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all duration-200 ease-in-out"
            placeholder="Message TAHO ChatGPT"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white p-3 ml-4 rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>

        <footer
          className="mx-auto mt-40 w-full max-w-container px-4 sm:px-6 lg:px-8"
          aria-labelledby="footer-heading"
        >
          <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-1">
            <p className="text-sm/6 text-gray-600 max-md:text-center">
              ©2025 <a href="https://learnwithsumit.com/">Oumeima Limeme</a>.
              All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Chat;
