import React, { useState, useEffect } from "react";
import env from "react-dotenv";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { cookies } from "../global";
import Chat from "../components/Chat";
import { Form } from "react-bootstrap";

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
            <Container fluid style={{ position: "absolute", height: "93%", width: "99%", overflowY: "scroll", margin: "10px" }}>
                {chats.map((chat, index) => {
                    return (
                        <div key={index}>
                            <Chat senderName={chat.senderName} message={chat.message} timestamp={chat.timestamp}/>
                            <br />
                        </div>
                    )
                })}
            </Container>

            <br />

            <Form onSubmit={onSubmit}>
                <InputGroup style={{ position: "absolute", bottom: "0px", margin: "10px", width: "99%" }}>
                    <FormControl
                        placeholder="Type your message here..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        required
                    />
                    <Button variant="primary" type="submit">
                        Send
                    </Button>
                </InputGroup>
            </Form>
        </>
    )
}