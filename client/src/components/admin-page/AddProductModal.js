import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form } from "semantic-ui-react";
import clothesService from "../../service/serviceAPI";
import ImageAndColorGrid from "./ImageAndColorGrid";
import { UserContext } from "../../contexts/UserContext";
import { useSnackbar } from "notistack";

export default function AddProductModal({ clothes, setClothes }) {
  const { enqueueSnackbar } = useSnackbar();
  const emptyProduct = {
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
  };
  const [product, setProduct] = useState(emptyProduct);
  const { tokenProvider } = useContext(UserContext);
  const [token, setToken] = tokenProvider;

  const [open, setOpen] = useState(false);
  const [discountButton, setDiscountButton] = useState(false);
  const [activeImageAndColor, setActiveImageAndColor] = useState(false);

  const changeProduct = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const checkIfNum = (e) => {
    if (isNaN(e.target.value.toString())) {
      setProduct({ ...product, [e.target.name]: undefined });
    } else changeProduct(e);
  };

  useEffect(() => {
    if (product.code) {
      clothesService()
        .createProduct(product, token)
        .then((resp) => {
          enqueueSnackbar(resp.msg, { variant: resp.type });
          if (product.files) addImagesToProduct();
          setProduct(emptyProduct);
        });
    }
  }, [product.code]);

  const addImagesToProduct = () => {
    clothesService()
      .addImageToProduct(product.files, product.code, token)
      .then((resp) => {
        if (resp.type == "error") {
          enqueueSnackbar(resp.msg, { variant: resp.type });
          return;
        }
        setOpen(false);
        setClothes([...clothes, product]);
      });
  };

  const generateNumber = () => {
    const random = Math.floor(Math.random() * Math.floor(999));
    let num = random + "";
    while (num.length < 3) {
      num = "0" + num;
    }
    return num;
  };

  const generateCode = () => {
    const codeGenre = product.genre.charAt(0).toUpperCase();
    const type = product.type.replace("-", "").substring(0, 2);
    let codeBlock = codeGenre.concat(type.toUpperCase()).concat("-");
    let random = generateNumber();
    let code = codeBlock.concat(random);

    let existingCodes = [];
    clothesService()
      .getProducts()
      .then((resp) => {
        if (resp.type == "error") {
          enqueueSnackbar(resp.msg, { variant: resp.type });
          return;
        }
        resp.data.forEach((dataProd) => existingCodes.push(dataProd.code));
        while (existingCodes.findIndex((elem) => elem === code) !== -1) {
          random = random = generateNumber();
          code = codeBlock.concat(random);
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
          size="big"
          style={{
            borderRadius: 0,
            float: "center",
            color: "White",
            backgroundColor: "Black",
            opacity: 0.9,
          }}
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
              error={
                product.price == undefined
                  ? { content: "Field is not numeric" }
                  : null
              }
              fluid
              required
              name="price"
              label="Price (€)"
              placeholder="Price (€)"
              onChange={checkIfNum}
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
          onClick={() => {
            setOpen(false);
            generateCode();
          }}
          content="Create Product"
          style={{ borderRadius: 0, color: "White", backgroundColor: "Black" }}
        />
      </Modal.Actions>
    </Modal>
  );
}
