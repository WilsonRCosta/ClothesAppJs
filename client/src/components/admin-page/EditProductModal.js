import React, { useState, useContext } from "react";
import { Modal, Button, Form, Image, Grid } from "semantic-ui-react";
import clothesService from "../../service/serviceAPI";
import ImageAndColorGrid from "./ImageAndColorGrid";
import { UserContext } from "../../contexts/UserContext";
import { useSnackbar } from "notistack";

export default function EditProductModal({ product, clothes, setClothes }) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [discountButton, setDiscountButton] = useState(false);
  const [activeImageAndColor, setActiveImageAndColor] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...product, files: [] });

  const { tokenProvider } = useContext(UserContext);
  const [token, setToken] = tokenProvider;

  const changeNewProduct = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const checkIfNum = (e) => {
    if (isNaN(e.target.value.toString())) {
      setNewProduct({ ...newProduct, [e.target.name]: undefined });
    } else changeNewProduct(e);
  };

  const handleEditProduct = () => {
    moveImagesToFileArray();
    clothesService()
      .editProduct(newProduct, token)
      .then((resp) => {
        enqueueSnackbar(resp.msg, { variant: resp.type });
        if (newProduct.files) addImagesToProduct();
        updateState();
      });
  };

  const addImagesToProduct = () => {
    clothesService()
      .addImageToProduct(newProduct.files, product.code, token)
      .then((resp) => {
        if (resp.type === "error")
          enqueueSnackbar(resp.msg, { variant: resp.type });
      });
  };

  const updateState = () => {
    setOpen(false);
    let newClothes = [...clothes];
    let prodIndex = newClothes.findIndex((cl) => cl.code === newProduct.code);
    if (newProduct.files.length > 0) {
      newProduct.files.forEach((file) => {
        newProduct.images.forEach((image) => {
          if (file.name === image.name) {
            const reader = new FileReader();
            reader.onload = (e) => (image.data = e.target.result);
            reader.readAsDataURL(file);
          }
        });
      });
      newProduct.files = [];
    }
    newClothes[prodIndex] = newProduct;
    setClothes(newClothes);
  };

  const moveImagesToFileArray = () => {
    let productToEdit = { ...newProduct };
    console.log(
      productToEdit,
      "images DATA ::::::::::",
      productToEdit.images.filter((image) => image.data)
    );
    productToEdit.images
      .filter((image) => image.data)
      .forEach((image, idx) => {
        image.data = image.data.startsWith("data") ? image.data.replace(constructBase64Format(image.type), "") : image.data;
        const bstr = atob(image.data);
        let n = bstr.length;
        let u8Array = new Uint8Array(n);
        while (n--) u8Array[n] = bstr.charCodeAt(n);
        productToEdit.files.push(
          new File([u8Array], image.name, { type: `image/${image.type}` })
        );
        productToEdit.images[idx].data = null;
      });
    setNewProduct(productToEdit);
  };

  const handleDeleteImage = (image) => {
    const productAux = { ...newProduct };
    const imageIndex = productAux.images.findIndex((img) => img.name === image.name);
    productAux.images.splice(imageIndex, 1);
    productAux.colors.forEach((color, idx) => {
      const colorIndex = productAux.images.findIndex((img) => img.color === color);
      colorIndex < 0 && productAux.colors.splice(idx, 1);
    });
    setNewProduct(productAux);
  };

  const handleChangeDiscountAndPrice = (e) => {
    let discount = (1 - e.target.value / 100).toFixed(2);
    let salesPrice = Number(newProduct.price) * discount;
    setNewProduct({
      ...newProduct,
      [e.target.name] : e.target.value,
      salesPrice,
    });
  };

  const getImageInBase64 = (image) =>
      image.data.startsWith("data") ? image.data : `${constructBase64Format(image.type)}${image.data}`

  const constructBase64Format = (type) => `data:image/${type};base64,`

  return (
    <Modal
      style={{ borderRadius: 0 }}
      closeIcon
      onClose={() => {
        setOpen(false);
        setNewProduct(product);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button
          style={{ backgroundColor: "#bbb", color: "Black" }}
          compact
          circular
          icon="edit"
        />
      }
    >
      <Modal.Header style={{ backgroundColor: "#ddd" }}>
        Edit Product
        {newProduct.colors.map((c, idx) => (
          <Button
            key={`${idx}-${c}`}
            circular
            size="medium"
            icon
            style={{
              float: "right",
              backgroundColor: c,
              border: "1px solid #777777",
            }}
          />
        ))}
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#eee" }}>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              required
              fluid
              value={newProduct.name}
              name="name"
              label="Name"
              placeholder="Name"
              onChange={changeNewProduct}
              maxLength={30}
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              required
              fluid
              value={newProduct.genre}
              label="Genre"
              name="genre"
              placeholder="Genre"
              options={[
                { key: "m", text: "Men", value: "men" },
                { key: "w", text: "Women", value: "women" },
                { key: "c", text: "Children", value: "children" },
              ]}
              onChange={(e, { value }) =>
                setNewProduct({ ...newProduct, genre: value })
              }
            />
            <Form.Input
              required
              fluid
              value={newProduct.brand}
              name="brand"
              label="Brand"
              placeholder="Brand"
              onChange={changeNewProduct}
              maxLength={15}
            />
            <Form.Select
              required
              label="Type"
              placeholder="Type"
              value={newProduct.type}
              name="type"
              options={[
                { key: "AC", text: "Accessory", value: "accessories" },
                { key: "JK", text: "Jacket", value: "jackets" },
                { key: "JE", text: "Jeans", value: "jeans" },
                { key: "ST", text: "Shirt", value: "shirts" },
                { key: "SH", text: "Shoes", value: "shoes" },
                { key: "TS", text: "T-Shirt", value: "t-shirt" },
                { key: "UW", text: "Underwear", value: "underwear" },
              ]}
              onChange={(e, { value }) =>
                setNewProduct({ ...newProduct, type: value })
              }
            />
            <Form.Input
              fluid
              required
              error={
                newProduct.price === undefined
                  ? { content: "Field is not numeric" }
                  : null
              }
              name="price"
              label="Price (€)"
              placeholder="Price (€)"
              onChange={checkIfNum}
              value={newProduct.price}
            />
          </Form.Group>
        </Form>
        <Button
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
          compact
          content="Set Discount"
          disabled={!newProduct.price}
          onClick={() => {
            setDiscountButton(!discountButton);
            setNewProduct({ ...newProduct, salesPrice: 0, discount: 0 });
          }}
        />
        <Button
          content="Add new Image"
          compact
          style={{ backgroundColor: "Black", color: "White", borderRadius: 0 }}
          onClick={() => setActiveImageAndColor(!activeImageAndColor)}
        />
        {newProduct.colors.length > 0 && (
          <Button
            floated="right"
            content="Reset Images"
            compact
            style={{
              backgroundColor: "Black",
              color: "White",
              borderRadius: 0,
            }}
            onClick={() => {
              setNewProduct({
                ...newProduct,
                images: [],
                colors: [],
                files: [],
              });
            }}
          />
        )}
        <br />
        <br />
        {discountButton && (
          <>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label={`Discount: ${newProduct.discount}%`}
                  min={0}
                  max={100}
                  name="discount"
                  onChange={handleChangeDiscountAndPrice}
                  step={5}
                  type="range"
                  value={newProduct.discount}
                />
                <Form.Input
                  label="Sales Price"
                  value={`${newProduct.salesPrice}`}
                  readOnly
                />
              </Form.Group>
            </Form>
          </>
        )}
        <Grid centered columns={3}>
          <Grid.Row>
            { newProduct.images.filter((image) => image.data).map((image, idx) => (
                <Grid.Column key={idx}>
                  <Image
                    style={{
                      objectFit: "cover",
                      border: "1px solid #ddd",
                      borderRadius: 20,
                    }}
                    src={getImageInBase64(image)}
                  />
                  <Button
                    style={{
                      position: "absolute",
                      top: "5%",
                      left: "10%",
                      backgroundColor: "#eee",
                      color: "black",
                    }}
                    circular
                    size="mini"
                    icon="delete"
                    onClick={() => handleDeleteImage(image)}
                  />
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>
        {activeImageAndColor && (
          <ImageAndColorGrid
            product={newProduct}
            setProduct={setNewProduct}
            activeImageAndColor={activeImageAndColor}
            setActiveImageAndColor={setActiveImageAndColor}
          />
        )}
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#ddd" }}>
        <Button
          disabled={
            !newProduct.name ||
            !newProduct.type ||
            !newProduct.brand ||
            !newProduct.price ||
            !newProduct.genre ||
            newProduct.images.length === 0
          }
          onClick={handleEditProduct}
          content="Edit Product"
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
        />
      </Modal.Actions>
    </Modal>
  );
}
