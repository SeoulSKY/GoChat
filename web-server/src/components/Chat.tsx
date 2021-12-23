import Card from "react-bootstrap/Card";
import { cookies } from "../global";
import { ChatInterface as Props } from "../pages/ChatRoom"


export default function Chat({ senderName, message, timestamp }: Props) { 
    const float = cookies.get("name") === senderName ? "right" : "left"

    return (
        <>
            <Card style={{ width: "18rem", float: float }}>
                <Card.Header as="h5">
                    {senderName}
                </Card.Header>
                <Card.Body>
                    {message}
                </Card.Body>
                <Card.Footer>
                    {timestamp}
                </Card.Footer>
            </Card>
        </>
    )
}