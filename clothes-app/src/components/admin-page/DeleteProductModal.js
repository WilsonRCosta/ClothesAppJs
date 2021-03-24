import React, { useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import clothesService from "../../service/serviceAPI";

export default function DeleteProductModal({
  clothes,
  setClothes,
  product,
  setMessageOnAddProduct,
}) {
  const [open, setOpen] = useState(false);

  const handleDeleteProduct = () => {
    clothesService()
      .deleteProduct(product.code)
      .then((res) => {
        if (res.error) {
          setMessageOnAddProduct(`Error: ${res.error}. ${res.msg}`);
          return;
        }
        setOpen(false);
        setMessageOnAddProduct(`${product.name} - ${res.msg}`);
        setTimeout(() => {
          setMessageOnAddProduct(null);
        }, 3000);
        let newClothes = [...clothes];
        let prodIndex = newClothes.findIndex((cl) => cl.code === product.code);
        newClothes.splice(prodIndex, 1);
        setClothes(newClothes);
      });
  };

  return (
    <Modal
      style={{ borderRadius: 0 }}
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button
          style={{ backgroundColor: "#ccc", color: "Black" }}
          compact
          circular
          icon="delete"
        />
      }
    >
      <Modal.Header style={{ backgroundColor: "#ddd" }}>
        Delete Product
      </Modal.Header>
      <Modal.Content>
        Are you sure you want to delete this product?
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#ddd" }}>
        <Button
          onClick={() => setOpen(false)}
          content="No"
          style={{ borderRadius: 0, color: "Black", backgroundColor: "White" }}
        />
        <Button
          onClick={() => handleDeleteProduct()}
          content="Yes"
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
        />
      </Modal.Actions>
    </Modal>
  );
}
