import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);  // Store multiple notifications
    const [open, setOpen] = useState(false);
    const {userId} = useAuth(); // Get the user ID from context

  useEffect(() => {
    
    // our socket
    let socket;

    const connectWebSocket = () => {
        socket = new WebSocket("ws://localhost:8002/ws/" + userId);
        console.log("Connecting WebSocket... 🌐");


        socket.onopen = () => console.log("WebSocket connected ✅");

        socket.onmessage = (event) => {
            console.log("New message:", event.data);
            setMessages((prev) => [...prev, event.data]);  // Add new message to array
            setOpen(true);  // Show Snackbar
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected ❌ Reconnecting...");
            setTimeout(connectWebSocket, 3000);  // Auto-reconnect after 3 sec
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            socket.close();  // Close and trigger reconnect
        };
    };

    connectWebSocket();

    return () => socket.close(); // Cleanup on component unmount
  }, [userId]);

  return (
    <>
      {/* MUI Snackbar for Notifications */}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="info">
          {messages[messages.length - 1]} {/* Show the latest message */}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WebSocketComponent;
