import React from 'react'
import {Nav , NavItem , Navbar ,NavDropdown ,Badge,MenuItem ,Image} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import {Link} from 'react-router';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
class Menu extends React.Component{

  render(){

    return (
      <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to ="/"><img src="/images/logo.png" width="120px"/></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>    
          </Navbar.Collapse>
        </Navbar>
      );

  }
}

export default Menu;
