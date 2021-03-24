import React, { useContext } from "react";
import { Grid, Image, Menu, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../contexts/WishlistContext";
import { BagContext } from "../contexts/BagContext";

export default function NavBar() {
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(BagContext);
  return (
    <Grid columns={3} style={{ marginLeft: 10, marginRight: 10 }}>
      <Grid.Column width={2}>
        <Image
          as={Link}
          to="/"
          floated="right"
          style={{ verticalAlign: "middle" }}
          size="tiny"
          src={"/images/logo.png"}
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
          <Menu.Item
            as={Link}
            to="/admin/products"
            style={{ backgroundColor: "White" }}
          >
            <Icon size="big" name="warehouse" />
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/register"
            style={{ backgroundColor: "White" }}
          >
            <Icon size="big" name="user" />
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/shopping-cart"
            style={{ backgroundColor: "White" }}
          >
            <Icon size="big" name="shop" />
            <Label
              size="tiny"
              circular
              color="black"
              floating
              style={{ backgroundColor: "White" }}
            >
              {cart.length}
            </Label>
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/wishlist"
            style={{ backgroundColor: "White" }}
          >
            <Icon size="big" name="heart" />
            <Label
              size="tiny"
              circular
              color="black"
              floating
              style={{ backgroundColor: "White" }}
            >
              {wishlist.length}
            </Label>
          </Menu.Item>
        </Menu>
      </Grid.Column>
    </Grid>
  );
}
