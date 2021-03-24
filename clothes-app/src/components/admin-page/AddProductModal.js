import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "semantic-ui-react";
import clothesService from "../../service/serviceAPI";
import ImageAndColorGrid from "./ImageAndColorGrid";

export default function AddProductModal({ clothes, setClothes, setMessageOnAddProduct }) {
  const [product, setProduct] = useState({
    code: "",
    name: "",
    brand: "",
    genre: "",
    type: "",
    price: 0,
    path: "",
    discount: 0,
    salesPrice: 0,
    images: [], // needs to be separated from files
    colors: [],
    files: [],
  });

  const [open, setOpen] = useState(false);
  const [discountButton, setDiscountButton] = useState(false);
  const [activeImageAndColor, setActiveImageAndColor] = useState(false);

  const changeProduct = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  useEffect(() => {
    if (product.code) {
      clothesService()
        .createProduct(product)
        .then((resp) => {
          setMessageOnAddProduct(resp.msg);
          if (product.files) addImagesToProduct();
        });
    }
  }, [product.code]);

  const addImagesToProduct = () => {
    clothesService()
      .addImageToProduct(product.files, product.code)
      .then(data => {
        if (data.error) {
          setMessageOnAddProduct(`Error: ${data.error}. ${data.msg}`);
          return;
        }
        setOpen(false);
        setTimeout(() => {
          setMessageOnAddProduct(null);
        }, 3000);
        setClothes([...clothes, product]);
      })
  };

  const generateCode = () => {
    const codeGenre = product.genre.charAt(0).toUpperCase();
    const codeType = product.type.substring(0, 2).toUpperCase();
    const firstBlock = codeGenre.concat(codeType).concat("-");
    let random = Math.floor(Math.random() * Math.floor(999));
    let code = firstBlock + random;
    let existingCodes = [];
    clothesService()
      .getProducts()
      .then((data) => {
        if (data.error) throw new Error(data.error);
        data.map((dataProd) => existingCodes.push(dataProd.code));
        while (existingCodes.findIndex((elem) => elem === code) !== -1) {
          random = Math.floor(Math.random() * Math.floor(999));
          code = firstBlock.concat(random);
        }
        setProduct({ ...product, code });
      });
  };

  const changeDiscountAndPrice = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
      salesPrice: (Number(product.price) * (1 - e.target.value / 100)).toFixed(
        2
      ),
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
          content="Add New Product"
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
        />
      }
    >
      <Modal.Header style={{ backgroundColor: "#ddd" }}>
        Add New Product
        {product.colors.map((c, idx) => (
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
              name="name"
              label="Name"
              placeholder="Name"
              onChange={changeProduct}
              maxLength={30}
            />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              required
              fluid
              label="Genre"
              name="genre"
              placeholder="Genre"
              options={[
                { key: "m", text: "Men", value: "men" },
                { key: "w", text: "Women", value: "women" },
                { key: "c", text: "Children", value: "children" },
              ]}
              onChange={(e, { value }) =>
                setProduct({ ...product, genre: value })
              }
            />
            <Form.Input
              required
              fluid
              name="brand"
              label="Brand"
              placeholder="Brand"
              onChange={changeProduct}
              maxLength={15}
            />
            <Form.Select
              required
              label="Type"
              placeholder="Type"
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
                setProduct({ ...product, type: value })
              }
            />
            <Form.Input
              fluid
              required
              name="price"
              label="Price (€)"
              placeholder="Price (€)"
              onChange={changeProduct}
            />
          </Form.Group>
        </Form>
        <Button
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
          compact
          content="Set Discount"
          disabled={!product.price}
          onClick={() => {
            setDiscountButton(!discountButton);
            setProduct({ ...product, salesPrice: 0, discount: 0 });
          }}
        />
        <Button
          content="Add new Image"
          compact
          style={{ backgroundColor: "Black", color: "White", borderRadius: 0 }}
          onClick={() => {
            setActiveImageAndColor(!activeImageAndColor);
          }}
        />
        {product.colors.length > 0 && (
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
              setProduct({ ...product, images: [], colors: [], files: [] });
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
                  label={`Discount: ${product.discount}%`}
                  min={0}
                  max={100}
                  name="discount"
                  onChange={changeDiscountAndPrice}
                  step={5}
                  type="range"
                  value={product.discount}
                />
                <Form.Input
                  label="Sales Price"
                  value={`${product.salesPrice}`}
                  readOnly
                />
              </Form.Group>
            </Form>
          </>
        )}
        {activeImageAndColor && (
          <ImageAndColorGrid
            product={product}
            setProduct={setProduct}
            activeImageAndColor={activeImageAndColor}
            setActiveImageAndColor={setActiveImageAndColor}
          />
        )}
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#ddd" }}>
        <Button
          disabled={
            !product.name ||
            !product.type ||
            !product.brand ||
            !product.price ||
            !product.genre ||
            product.files.length === 0
          }
          onClick={() => generateCode()}
          content="Create Product"
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
        />
      </Modal.Actions>
    </Modal>
  );
}
