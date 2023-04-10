import React, { useContext, useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import {animateScroll as scroll, Link} from "react-scroll";
import { WishlistContext } from "../../contexts/WishlistContext";
import { BagContext } from "../../contexts/BagContext";
import { UserContext } from "../../contexts/UserContext";
import homeLogo from "../../images/logo.png";
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavBtn,
  NavBtnLink, NavSignBtnLink,
} from "./StyledNavbarElements";
import {Image, Label} from "semantic-ui-react";
import {Icon} from "@material-ui/core";

export default function NavBar() {
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(BagContext);
  const { userProvider } = useContext(UserContext);
  const [user, setUser] = userProvider;
  const [scrollNav, setScrollNav] = useState(false);
  const [toggle, setToggle] = useState(false);

  const changeNav = () => setScrollNav(window.scrollY >= 100);

  const scrollToTop = () => scroll.scrollToTop();

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  return (
    <IconContext.Provider value={{ color: "#3f3f3f" }}>
      <Nav scrollNav={scrollNav}>
        <NavbarContainer>
          <NavLogo to="/" onClick={scrollToTop}>
            <Image spaced={'right'} as={Link} to="/" size="tiny" src={homeLogo} alt="Home"/>
            Shining Code
          </NavLogo>
          <NavMenu>
            <NavBtnLink to="/clothes/sales">Sales</NavBtnLink>
            <NavBtnLink to="/clothes/men">Men</NavBtnLink>
            <NavBtnLink to="/clothes/women">Women</NavBtnLink>
            <NavBtnLink to="/clothes/children">Children</NavBtnLink>
            {!user ? (
                <>
                  <NavBtn>
                    <NavBtnLink to="/signin"><NavSignBtnLink>Sign In</NavSignBtnLink></NavBtnLink>
                  </NavBtn>
                  <NavBtnLink to="/register"><Icon size="big" name="user" /></NavBtnLink>
                </>
            ) : (
              <>
                <NavBtnLink to="/register"><strong>{user}</strong></NavBtnLink>
                <NavBtnLink to="/admin/products"><Icon size="big" name="warehouse" /></NavBtnLink>
              </>
            )}
            <NavBtnLink to="/shopping-cart">
              <Icon size="big" name="shop" />
              <Label size="tiny" circular color="black" floating>{cart.length}</Label>
            </NavBtnLink>
            <NavBtnLink to="/wishlist">
              <Icon size="big" name="heart" />
              <Label size="tiny" circular color="black" floating>{wishlist.length}</Label>
            </NavBtnLink>
          </NavMenu>

          <MobileIcon>
            <FaBars />
          </MobileIcon>
        </NavbarContainer>
      </Nav>
    </IconContext.Provider>
  );
}
