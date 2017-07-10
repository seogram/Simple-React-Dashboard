import React from 'react'
import {Nav , NavItem , Navbar ,Badge } from 'react-bootstrap';
class Menu extends React.Component{
  render(){
    return (
      <Navbar  inverse collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Book Store</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/about">About us</NavItem>
              <NavItem eventKey={2} href="/contact">Contact</NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} href="/admin">Admin</NavItem>
              <NavItem eventKey={2} href="/cart">Your Cart
                {
                  (this.props.currentItemQty > 0) ? (<Badge className="badge">{this.props.currentItemQty}</Badge>) : ('')
                }
            </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}

export default Menu;
