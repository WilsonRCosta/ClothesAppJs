import { Table, Card, Button } from 'semantic-ui-react'

import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

export default function ProductsTable({clothes, setClothes, setRespMessage}) {
    return (
        <Card centered fluid style={{ width: "95%" }}>
              <Table celled selectable striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Code</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Genre</Table.HeaderCell>
                    <Table.HeaderCell>Brand</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Colors</Table.HeaderCell>
                    <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {clothes.map((p, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell style={{ color: "Gray" }}>
                        {p.code}
                      </Table.Cell>
                      <td>
                        <a href={`/clothes/${p.genre}/${p.code}`}>
                          <div style={{ color: "black" }}>
                            <strong>{p.name}</strong>
                          </div>
                        </a>
                      </td>
                      <Table.Cell>
                        {p.genre.slice(0, 1).toUpperCase() +
                          p.genre.substring(1)}
                      </Table.Cell>
                      <Table.Cell>{p.brand}</Table.Cell>
                      <Table.Cell>
                        {p.type.slice(0, 1).toUpperCase() + p.type.substring(1)}
                      </Table.Cell>
                      <Table.Cell>{p.price}€</Table.Cell>
                      <Table.Cell>
                        {p.colors.map((c) => (
                          <Button
                            key={`${p.code}-${c}`}
                            circular
                            size="mini"
                            icon
                            style={{
                              backgroundColor: c === "white" ? "white" : c,
                              border: "1px solid #777777",
                            }}
                          ></Button>
                        ))}
                      </Table.Cell>
                      <Table.Cell>
                        <EditProductModal
                          product={p}
                          clothes={clothes}
                          setClothes={setClothes}
                          setMessageOnAddProduct={setRespMessage}
                        />
                        <DeleteProductModal
                          product={p}
                          clothes={clothes}
                          setClothes={setClothes}
                          setMessageOnAddProduct={setRespMessage}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card>
    )
};
