import React, { useContext } from "react";
import { Item, Statistic, Grid, Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { WishlistContext } from "../contexts/WishlistContext";
import { BagContext } from "../contexts/BagContext";
import {
  updateLocalCart,
  deleteFromLocalStorage,
} from "../service/serviceLocalStorage";

export default function Wishlist() {
  const { wishlist, setWishlist } = useContext(WishlistContext);
  const { cart, setCart } = useContext(BagContext);

  const handleAddToCartClick = (product) => {
    product.size = "M"; 
    product.quantity = 1; // TODO: Open a modal to set size and quantity
    product.finalPrice = parseFloat(
      product.discount ? product.salesPrice : product.price
      ).toFixed(2);
      updateLocalCart(product);
    let newCart = [...cart]
    let item = newCart.find(cartItem => cartItem.code === product.code)
    if(item) {
      item.quantity += product.quantity;
      item.finalPrice = (
        +item.finalPrice + +product.finalPrice
      ).toFixed(2);
    } else newCart.push(product)
    setCart(newCart);
  };

  const handleDeleteFromWishlist = (item) => {
    let newWishlist = [...wishlist];
    const itemIdx = newWishlist.findIndex((i) => i.code === item.code);
    newWishlist.splice(itemIdx, 1);
    setWishlist(newWishlist);
    deleteFromLocalStorage("wish", item.code);
  };

  return (
    <div>
      <br />
      <NavBar />
      {wishlist.length > 0 ? (
        <>
          <Statistic style={{ marginRight: 100 }} floated="right">
            <Statistic.Label>You have</Statistic.Label>
            <Statistic.Value>{wishlist.length}</Statistic.Value>
            {wishlist.length > 1 ? (
              <Statistic.Label>Favorites</Statistic.Label>
            ) : (
              <Statistic.Label>Favorite</Statistic.Label>
            )}
          </Statistic>
          <Grid style={{ marginLeft: 50 }} columns={2} verticalAlign="middle">
            <Grid.Row>
              {wishlist.map((wishItem) => (
                <Grid.Column style={{ padding: 10 }}>
                  <Item.Group>
                    <Item>
                      <Item.Image
                        size="small"
                        src={`data:image/${wishItem.images[0].type};base64,${wishItem.images[0].data}`}
                      />
                      <Item.Content verticalAlign="middle">
                        <Item.Header
                          as={Link}
                          to={`/clothes/${wishItem.genre}/${wishItem.code}`}
                        >
                          {wishItem.name}
                        </Item.Header>
                        <Item.Description>{wishItem.brand}</Item.Description>
                        <Item.Meta>
                          {wishItem.discount
                            ? wishItem.salesPrice.toFixed(2)
                            : wishItem.price.toFixed(2)}
                          €
                        </Item.Meta>
                        <Button
                          icon="cart"
                          onClick={() => handleAddToCartClick(wishItem)}
                          size="big"
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                        <br />
                        <Button
                          content="Remove from Wishlist"
                          onClick={() => handleDeleteFromWishlist(wishItem)}
                          size="mini"
                          style={{
                            borderRadius: 0,
                            backgroundColor: "black",
                            color: "white",
                          }}
                        />
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </>
      ) : (
        <Card centered style={{ marginTop: 100, width: 550 }}>
          <Card.Content>
            <h3>Check our store to add favorites to your wishlist.</h3>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
