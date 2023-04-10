import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
import { Link as LinkS } from "react-scroll";

export const Nav = styled.nav`
  background: ${({ scrollNav }) => (scrollNav ? "transparent" : "#9f9f9f")};
  height: 100px;
  margin-top: -100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.125rem;
  position: sticky;
  top: 0;
  z-index: 10;

  @media screen and (max-width: 960px) {
    transition: 2s all ease;
  }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1100px;
`;

export const NavLogo = styled(LinkR)`
  color: #000;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-weight: bold;
  text-decoration: none;
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavLinkS = styled(LinkS)`
  color: #000;
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  cursor: pointer;

  &.active {
    border-bottom: 3px solid #01bf71;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(LinkR)`
  color: #010606;
  margin: 10px;
  font-size: 1rem;
  cursor: pointer;
`;

export const NavSignBtnLink = styled.div`
  border-radius: 20px;
  background: #01bf71;
  padding: 10px 22px;

  transition: all 0.2s ease-in-out;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #9f9f9f;
    color: #010606;
  }
`;
