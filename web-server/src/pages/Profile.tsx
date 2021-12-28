import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import Card from "react-bootstrap/Card";

import { cookies } from "../global"

export default function Profile() {
    const [input, setInput] = useState("");

    const [name, setName] = useState<string>(cookies.get("name"));

    function onClick() {
        cookies.set("name", input);
        setName(input);
    }

    return (
        <>
            <Card>
                <Card.Header as={"h5"}>
                    {"Your Name: " + name}
                </Card.Header>
                <Card.Body>
                    <Card.Title>{"Edit Your Name"}</Card.Title>
                    <FormControl
                        placeholder="Enter your new name"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary" onClick={onClick}>
                        Submit
                    </Button>
                </Card.Footer>
            </Card>
        </>
    )
}