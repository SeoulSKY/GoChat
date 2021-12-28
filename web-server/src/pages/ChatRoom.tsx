import React, { useState, useEffect } from "react";
import env from "react-dotenv";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { cookies } from "../global";
import Chat from "../components/Chat";
import Form from "react-bootstrap/Form";

const conn = new WebSocket("ws" + env.GO_SERVER_HOST.replace("http", "") + "/ws");


export interface ChatInterface {
    senderName: string,
    message: string,
    timestamp: string,
}

export default function ChatRoom() {
    const name = cookies.get("name");
    if (name === undefined) {
        throw new Error("Cookie \"name\" is not present");
    }

    const [chats, setChats] = useState<ChatInterface[]>([]);

    // GET existing chats
    useEffect(() => {
        fetch(env.GO_SERVER_HOST + "/chat")
            .then(response => response.json())
            .then(chats => setChats(chats))
            .catch(err => console.log(err));
    }, [])

    // listen messages from go server
    conn.onmessage = e => {
        let clonedArray = [...chats]
        clonedArray.push(JSON.parse(e.data));
        setChats(clonedArray);
    }

    const [input, setInput] = useState("");

    /**
     * Send a message to go server
     * @param e event
     */
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        setInput("");

        let json = {
            senderName: name,
            message: input
        }

        conn.send(JSON.stringify(json));
    }

    return (
        <>
            <Container>
                <div style={{ position: "absolute", minWidth: "71%", top: "7%", bottom: "7%", overflowY: "auto", backgroundColor: "#85929E"}}>
                    {chats.map((chat, index) => {
                        // align the chat based on the sender name
                        const justifyContent = chat.senderName === name ? "right" : "left";

                        return (
                            <div key={index} style={{ display: "flex", justifyContent: justifyContent, margin: "20px" }}>
                                <Chat senderName={chat.senderName} message={chat.message} timestamp={chat.timestamp} />
                            </div>
                        )
                    })}
                </div>

                <div style={{ position: "absolute", minWidth: "71%", bottom: "0px", marginTop: "10px", marginBottom: "10px" }}>
                    <Form onSubmit={onSubmit}>
                        <InputGroup>
                            <FormControl
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your message here..."
                                required
                            />
                            <Button variant="primary" type="submit">
                                Send
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
            </Container>
        </>
    )
}