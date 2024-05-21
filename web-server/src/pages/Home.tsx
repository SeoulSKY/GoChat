import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import SetName from "../components/SetName";
import { cookies } from "../global";
import Image from "react-bootstrap/Image";

function nameExists() {
  return (
    <>
      <h5>{"Join the chat and enjoy real-time conversation with others"}</h5>
      <Button variant="primary" size="lg" href="/chatroom">Join</Button>
    </>
  );
}

export default function Home() {
  const hasName = cookies.get("name") !== undefined;

  return (
    <>
      <Container>
        <br/>
        <h2>{"Welcome to Go Chat!"}</h2>
        <Image src="/gochat.png" width="80%" thumbnail rounded/>
        <br />
        <br />
        {!hasName && <SetName editing={false} cb={() => window.location.reload()} />}
        {hasName && nameExists()}
      </Container>
    </>
  );
}
