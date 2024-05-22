import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { cookies } from "../globals.ts";

export default function NavBar() {
  const hasName = cookies.get("name") !== undefined;

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Go Chat</Navbar.Brand>
          <Nav className="me-auto">
            {hasName && <Nav.Link href="/chatroom">Chat Room</Nav.Link>}
            {hasName && <Nav.Link href="/profile">Profile</Nav.Link>}
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                            Your Name: <a href="/profile">{cookies.get("name")}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
