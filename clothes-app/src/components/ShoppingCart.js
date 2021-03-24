import { useContext } from "react";
import { Table, Image, Grid, Button, Card } from "semantic-ui-react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { BagContext } from "../contexts/BagContext";
import { deleteFromLocalStorage } from '../service/serviceLocalStorage'

export default function ShoppingCart() {

  const { cart, setCart } = useContext(BagContext)
/*
  //TODO: Update sizes if needed
  const [sizes, updateSize] = useState(
    cart.map((item) => ({ code: item.code, size: item.size }))
  );
*/
  const deleteItemFromCart = (item) => {
    let newCart = [...cart];
    const itemIdx = newCart.findIndex((i) => i.code === item.code);
    newCart.splice(itemIdx, 1);
    setCart(newCart);
    deleteFromLocalStorage('cart', item.code)
  };

  return (
    <div>
      <br />
      <NavBar cartItems={cart.length}/>
      {cart && cart.length > 0 ? (
        <Table columns={5}>
          <Table.Header>
            <Table.Row>
              {cart.length > 1 ? (
                <Table.HeaderCell>
                  Your bag contains {cart.length} products.
                </Table.HeaderCell>
              ) : (
                <Table.HeaderCell>
                  Your bag contains {cart.length} product.
                </Table.HeaderCell>
              )}
              <Table.HeaderCell />
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Sub Total</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cart.map((item) => (
              <Table.Row>
                <Table.Cell>
                  <Image
                    size="small"
                    src={`data:image/${item.images[0].type};base64,${item.images[0].data}`}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Grid>
                    <Grid.Row
                      style={{ color: "black" }}
                      as={Link}
                      to={`clothes/${item.genre}/${item.code}`}
                    >
                      <h4>{item.name}</h4>
                    </Grid.Row>
                    <Grid.Row>
                      <strong>SIZE: </strong> {item.size}
                    </Grid.Row>
                    <Grid.Row style={{ fontSize: 11, color: "grey" }}>
                      Code: {item.code}
                    </Grid.Row>
                  </Grid>
                </Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>
                  {item.discount
                    ? item.salesPrice.toFixed(2)
                    : item.price.toFixed(2)}
                  €
                </Table.Cell>
                <Table.Cell>{item.finalPrice}€</Table.Cell>
                <Table.Cell>
                  <Button
                    size="big"
                    style={{ backgroundColor: "white", color: "black" }}
                    icon="delete"
                    onClick={() => deleteItemFromCart(item)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
              <Table.Cell>
                <h4>TOTAL PRICE</h4>
              </Table.Cell>
              <Table.Cell>
                {cart.reduce((sum, { finalPrice }) => sum + parseFloat(finalPrice), 0).toFixed(2)}€
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      ) : (
        <Card centered style={{ marginTop: 100, width: 550 }}>
          <Card.Content>
            <h3>
              Your bag is empty, check our store if you want to buy anything.
            </h3>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
