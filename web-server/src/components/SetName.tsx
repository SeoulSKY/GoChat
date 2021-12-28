import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form"

import { cookies } from "../global"

export interface SetNameProps {
    /**
     * true if this component is used to edit the current name, false if the component is used to set the name initially
     */
    editing: boolean

    /**
     * A fuction to be called after the user name has been set
     */
    cb?: Function
}

/**
 * This component sets the name of the current user
 */
export default function SetName({ editing, cb }: SetNameProps) {
    const [input, setInput] = useState("");

    const [name, setName] = useState<string>(cookies.get("name"));

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        cookies.set("name", input);
        setName(input);

        setInput("");

        if (cb) {
            cb();
        }
    }

    const title = editing ? "Edit Your Name" : "Decide Your Name";
    const placeholder = editing ? "Enter your new name" : "Enter your name";

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Card>
                    <Card.Header as={"h5"}>
                        {"Your Name: " + name}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <FormControl
                            placeholder={placeholder}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            required
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    )
}