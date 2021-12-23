import ChatInput from "../components/ChatInput";

export interface Conn {
    conn: WebSocket
}

export default function ChatRoom({conn}: Conn) {
    return (
        <>
            <ChatInput conn={conn}/>
        </>
    )
}