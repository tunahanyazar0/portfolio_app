from fastapi import WebSocket

# WebSocketManager class for managing connections
class WebSocketManager:
    def __init__(self):
        self.connections = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.connections[user_id] = websocket
        print(f"User {user_id} connected")

    # Send a message to a specific user by user_id
    async def send_update(self, user_id: int, message: str):
        websocket = self.connections.get(user_id)
        if websocket:
            print(f"Sending message to user {user_id}: {message}")
            await websocket.send_text(message)

    async def disconnect(self, user_id: int):
        if user_id in self.connections:
            del self.connections[user_id]
            print(f"User {user_id} disconnected")

# Initialize WebSocketManager instance
websocket_manager = WebSocketManager()