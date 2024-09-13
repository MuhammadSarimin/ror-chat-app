import { useState, useEffect } from 'react'
import './App.css'
import useStore from './AppStore';
import SetUser from './SetUser';

const ws = new WebSocket("ws://localhost:3000/cable");

function App() {

  const [messages, setMessages] = useState([]);
  const messagesContainer = document.getElementById("messages");

  const { user, logout } = useStore();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  ws.onopen = () => {
    console.log("Connected to websocket server");

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: user.user_id,
          channel: "MessagesChannel",
        }),
      })
    );
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "ping") return;
    if (data.type === "welcome") return;
    if (data.type === "confirm_subscription") return;

    const message = data.message;
    console.log("message", message);
    setMessagesAndScrollDown([...messages, message]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    resetScroll();
  }, [messages]);

  const resetScroll = () => {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const setMessagesAndScrollDown = (data) => {
    setMessages(data);
    resetScroll();
  };

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/chats");
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = e.target.message.value;
    if (!body || body === "") return;
    const message = { message:body, user_id: user.user_id, user_name: user.user_name };
    e.target.message.value = "";

    await fetch("http://localhost:3000/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  if (!user) return <SetUser />;

  return (
    <div className="App">
      <div className="messageHeader">
        <p>Lets start {user.user_name}</p>
        <button 
        onClick={() => logout()} 
        type="button" 
        className='mt-10'
        >Logout</button>
      </div>
      <div className="messages" id="messages">
        {messages.map((message) => (
          <div className={`message ${message.user_id === user.user_id ? "right" : "left"}`} key={message.id}>
            <h3>{message.user_name}</h3>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className="messageForm">
        <form onSubmit={handleSubmit}>
          <input className="messageInput" type="text" name="message" />
          <button className="messageButton" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
