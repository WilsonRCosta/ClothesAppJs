import React, { useState, useContext } from "react";
import { Modal, Button } from "semantic-ui-react";
import clothesService from "../../service/serviceAPI";
import { UserContext } from "../../contexts/UserContext";
import { useSnackbar } from "notistack";

export default function DeleteProductModal({ clothes, setClothes, product }) {
  const [open, setOpen] = useState(false);
  const { tokenProvider } = useContext(UserContext);
  const [token, setToken] = tokenProvider;
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteProduct = () => {
    clothesService()
      .deleteProduct(product.code, token)
      .then((res) => {
        setOpen(false);
        enqueueSnackbar(res.msg, { variant: res.type });
        if (res.type === "error") return;
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
