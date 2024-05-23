import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {getUser} from "../utils/user.ts";

export default function NavBar() {
  const name = getUser()?.name;

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Go Chat</Navbar.Brand>
          <Nav className="me-auto">
            {name && <Nav.Link href="/chatroom">Chat Room</Nav.Link>}
            {name && <Nav.Link href="/profile">Profile</Nav.Link>}
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                            Your Name: <a href="/profile">{name}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
