import React, { useContext, useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { animateScroll as scroll } from "react-scroll";
import { Grid, Image, Menu, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../contexts/WishlistContext";
import { BagContext } from "../../contexts/BagContext";
import { UserContext } from "../../contexts/UserContext";
import homeLogo from "../images/logo.png";
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./StyledNavbarElements";

export default function NavBar() {
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(BagContext);
  const { userProvider } = useContext(UserContext);
  const [user, setUser] = userProvider;
  const [scrollNav, setScrollNav] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const toggleHome = () => scroll.scrollToTop();

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const styles = {
    noBackground: {
      background: "rgba(0, 0, 0, 0)",
    },
  };
  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <Nav scrollNav={scrollNav}>
        <NavbarContainer>
          <NavLogo to="/" onClick={toggleHome}>
            Shining Code
          </NavLogo>
          <MobileIcon onClick={toggle}>
            <FaBars />
          </MobileIcon>
          <NavMenu>
            <NavItem>
              <NavLinks
                to="about"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
              >
                MEN
              </NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks
                to="discover"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
              >
                WOMEN
              </NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks
                to="services"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
              >
                CHILDREN
              </NavLinks>
            </NavItem>
          </NavMenu>
          <NavBtn>
            <NavBtnLink to="/signin"> Sign In</NavBtnLink>
          </NavBtn>
        </NavbarContainer>
      </Nav>
    </IconContext.Provider>
  );
}

/*
 <Grid columns={3} style={{ marginLeft: 10, marginRight: 10 }}>
        <Grid.Column width={2}>
          <Image
            as={Link}
            to="/"
            floated="right"
            style={{ verticalAlign: "middle" }}
            size="tiny"
            src={homeLogo}
            alt="Home"
          />
        </Grid.Column>
        <Grid.Column textAlign="left" verticalAlign="middle" width={4}>
          <h1 className="app-title">Shining Code</h1>
        </Grid.Column>
        <Grid.Column width={10} verticalAlign="middle">
          <Menu secondary size="small">
            <Menu.Item as={Link} to="/clothes/sales" name="men">
              <strong>SALES</strong>
            </Menu.Item>
            <Menu.Item as={Link} to="/clothes/men" name="men">
              <strong>MEN</strong>
            </Menu.Item>
            <Menu.Item as={Link} to="/clothes/women" name="women">
              <strong>WOMEN</strong>
            </Menu.Item>
            <Menu.Item as={Link} to="/clothes/children" name="children">
              <strong>CHILDREN</strong>
            </Menu.Item>
            <Menu.Item position="right"></Menu.Item>
            {!user ? (
              <Menu.Item as={Link} to="/register" style={styles.noBackground}>
                <Icon size="big" name="user" />
              </Menu.Item>
            ) : (
              <>
                <Menu.Item as={Link} to="/register">
                  <strong>{user}</strong>
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/admin/products"
                  style={styles.noBackground}
                >
                  <Icon size="big" name="warehouse" />
                </Menu.Item>
              </>
            )}
            <Menu.Item
              as={Link}
              to="/shopping-cart"
              style={styles.noBackground}
            >
              <Icon size="big" name="shop" />
              <Label
                size="tiny"
                circular
                color="black"
                floating
                style={styles.noBackground}
              >
                {cart.length}
              </Label>
            </Menu.Item>
            <Menu.Item as={Link} to="/wishlist" style={styles.noBackground}>
              <Icon size="big" name="heart" />
              <Label
                size="tiny"
                circular
                color="black"
                floating
                style={styles.noBackground}
              >
                {wishlist.length}
              </Label>
            </Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid>
*/
