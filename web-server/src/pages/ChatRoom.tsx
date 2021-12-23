import { useState } from "react";
import env from "react-dotenv";
import ChatInput from "../components/ChatInput";
import Chat from "../components/Chat";
import Container from "react-bootstrap/Container"

const conn = new WebSocket("ws" + env.GO_SERVER_HOST.replace("http", "") + "/chat");


export interface ChatInterface {
    senderName: string,
    message: string,
    timestamp: string,
}

let chat = {
    senderName: "SeoulSKY",
    message: "myMessage",
    timestamp: new Date().toString()
}


export default function ChatRoom() {
    const [chats, setChats] = useState<ChatInterface[]>([chat]);

    return (
        <>
            <Container fluid style={{height: "700px", overflowY: "scroll"}}>
                {chats.map((chat) => <Chat senderName={chat.senderName} message={chat.message} timestamp={chat.timestamp} />)}
                <br/>
            </Container>

            <ChatInput conn={conn} />
        </>
    )
}