import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import {useState} from "react";
import Cookies from "universal-cookie";
import {Conn} from "../pages/ChatRoom";
import {InputGroup} from "react-bootstrap";


export default function ChatInput({conn}: Conn) {

    const cookies = new Cookies();
    const [input, setInput] = useState("");

    const name = cookies.get("name");
    if (name === undefined) {
        throw new Error("Cookie \"name\" is not present");
    }

    function onClick() {
        let json = {
            senderName: name,
            message: input
        }

        conn.send(JSON.stringify(json));
    }

    return (
        <>
            <InputGroup>
                <FormControl
                    placeholder="Type your message here"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <Button variant="primary" onClick={onClick}>
                    Send
                </Button>
            </InputGroup>
        </>
    )
}