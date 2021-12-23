import Card from "react-bootstrap/Card";
import { ChatInterface as Props } from "../pages/ChatRoom"


export default function Chat({ senderName, message, timestamp }: Props) { 
    return (
        <>
            <Card style={{ width: "30rem" }}>
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