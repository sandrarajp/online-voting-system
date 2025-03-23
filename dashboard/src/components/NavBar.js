import React from "react"
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap"
import { PollerLogo, UserIcon } from "./icons"
import { logout } from "../features/ballots/ballotsSlice"
import { useDispatch, useSelector } from "react-redux"
export default function NavBar() {
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.ballots)

    return (
        <Navbar bg="info" variant="dark" collapseOnSelect expand="sm">
            <Container>
                <Navbar.Brand className="text-white fw-bold">
                    <PollerLogo />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav ">
                    <Nav className="justify-content-end w-100">
                        <NavDropdown title={
                                <div className="d-flex flex-row align-items-center justify-content-start">
                                    <UserIcon /><span className="text-white ms-2">{user}</span>
                                </div>
                            } id="collasible-nav-dropdown"
                        >
                            {
                                /*                            
                                <NavDropdown.Item href="#action/3.2">
                                    Account settings
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                */
                            }
                            <NavDropdown.Item onClick={() => dispatch(logout())}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}