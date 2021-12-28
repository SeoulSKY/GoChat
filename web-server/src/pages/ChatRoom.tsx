import React, { useState, useEffect, useRef } from "react";
import env from "react-dotenv";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { cookies } from "../global";
import Chat from "../components/Chat";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const conn = new WebSocket("ws" + env.GO_SERVER_HOST.replace("http", "") + "/ws");


export interface ChatInterface {
    senderName: string,
    message: string,
    timestamp: string,
}

/**
 * Modify the format of the timestamp of the given chats
 * @param chats the array of chats to modify
 */
function setTimestamps(chats: ChatInterface[]) {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: true
    } as const

    chats.forEach(chat => {
        chat.timestamp = new Date(chat.timestamp).toLocaleTimeString(undefined, options);
    });
}

export default function ChatRoom() {
    const name = cookies.get("name");
    if (name === undefined) {
        throw new Error("Cookie \"name\" is not present");
    }

    const [chats, setChats] = useState<ChatInterface[]>([]);

    const [error, setError] = useState("");

    // automatically scroll to the bottom of the chats
    const chatRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [chats]);

    // GET existing chats
    useEffect(() => {
        fetch(env.GO_SERVER_HOST + "/chat")
            .then(response => response.json())
            .then(chats => {
                setTimestamps(chats);
                setChats(chats);
            })
            .catch(err => {
                setError("An error has been occurred");
                console.log(err);
            });
    }, []);

    // listen messages from go server
    conn.onmessage = e => {
        let clonedArray = [...chats];

        let chat: ChatInterface = JSON.parse(e.data);
        setTimestamps([chat]);

        clonedArray.push(chat);
        setChats(clonedArray);
    }

    // handle other socket events
    conn.onopen = () => setError("");
    conn.onclose = e => {
        setError("Connection to go server has been closed");
        console.log(e.reason);
    }

    const [input, setInput] = useState("");

    /**
     * Send a message to go server
     * @param e event
     */
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const json = {
            senderName: name,
            message: input
        }

        conn.send(JSON.stringify(json));

        setInput("");
    }

    return (
        <>
            {error && <Alert variant="danger" style={{ zIndex: 2 }}>{error}</Alert>}

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

                    {/*target to automatically scroll to*/}
                    <div ref={chatRef}/>
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