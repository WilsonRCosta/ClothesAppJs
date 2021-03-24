import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Image,
  Container,
  Divider,
  Label,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import clothesService from "../../service/serviceAPI";
import PathBreadcrumb from "../clothes-page/PathBreadcrumb";
import LoadingDimmer from "../LoadingDimmer";
import { BagContext } from "../../contexts/BagContext";
import colors from "ntcjs";

import {
  updateLocalCart,
  updateLocalWishlist,
} from "../../service/serviceLocalStorage";
import { WishlistContext } from "../../contexts/WishlistContext";

export default function ClothesDetails({ code }) {
  const [cloth, setCloth] = useState([]);

  const [fetchError, setFetchError] = useState();
  const [fetchComplete, setFetchComplete] = useState();

  const [size, setSize] = useState();
  const [quantity, setQuantity] = useState(1);

  const [currImage, setCurrImage] = useState();
  const [hasNextImage, setNextImage] = useState();
  const [hasPrevImage, setPrevImage] = useState(false);

  const { cart, setCart } = useContext(BagContext);
  const { wishlist, setWishlist } = useContext(WishlistContext);

  const handleChangeCurrImageClickInColor = (clickedColor) => {
    setCurrImage(cloth.images.find((i) => i.color === clickedColor));
  };

  const handleChangeCurrImageClickInImage = (clickedImg) => {
    setNextImage(
      cloth.images.filter((img) => img.color === clickedImg.color).length > 1
    );
    setCurrImage(cloth.images.find((image) => image.data === clickedImg.data));
  };

  const handleChangeCurrImageClickNextImage = () => {
    let { imgsWithColor, currImgIdx } = findImageIndex();
    setCurrImage(imgsWithColor[++currImgIdx]);
    setPrevImage(true);
    if (currImgIdx === imgsWithColor.length - 1) setNextImage(false);
  };

  const handleChangeCurrImageClickPrevImage = () => {
    let { imgsWithColor, currImgIdx } = findImageIndex();
    setCurrImage(imgsWithColor[--currImgIdx]);
    setNextImage(true);
    if (currImgIdx === 0) setPrevImage(false);
  };

  const findImageIndex = () => {
    let imgsWithColor = cloth.images.filter(
      (im) => im.color === currImage.color
    );
    console.log(imgsWithColor)
    console.log(currImage)
    let currImgIdx = imgsWithColor.findIndex((i) => i.name === currImage.name);
    return { imgsWithColor, currImgIdx };
  };

  const handleSetQuantity = (value) => {
    if (quantity + value > 0) setQuantity(quantity + value);
  };

  const handleWishClick = () => {
    let newWishlist = [...wishlist];
    const objIdx = newWishlist.findIndex((w) => w.code === cloth.code);
    objIdx > -1 ? newWishlist.splice(objIdx, 1) : newWishlist.push(cloth);
    setWishlist(newWishlist);
    updateLocalWishlist(cloth);
  };

  const addToCart = () => {
    if (!size) {
      alert("Please select size");
      return;
    }
    let product = cloth;
    product.size = size;
    product.quantity = quantity;
    product.finalPrice = parseFloat(
      cloth.discount ? quantity * cloth.salesPrice : quantity * cloth.price
    ).toFixed(2);
    updateLocalCart(product);
    setCart([...cart, product]);
  };

  useEffect(() => {
    setFetchComplete(false);
    clothesService()
      .getProductByCode(code)
      .then((data) => {
        if (data.error) {
          setFetchError({ error: data.status, msg: data.data });
          return;
        }
        setCloth(data);
        if (data.images) {
          setCurrImage(data.images[0]);
          setNextImage(
            data.images.filter((img) => img.color === data.images[0].color)
              .length > 1
          );
        }
        setFetchComplete(true);
      });
  }, [code]);

  useEffect(() => {
    if (currImage) {
      let {imgsWithColor, currImgIdx } = findImageIndex();
      console.log(currImgIdx)
      console.log(cloth.images)
      setNextImage(currImgIdx < imgsWithColor.length - 1)
      setPrevImage(currImgIdx > 0)
    }
  }, [currImage, hasNextImage, hasPrevImage])

  return (
    <div>
      <br />
      <NavBar />
      <br />
      {fetchComplete ? (
        <>
          <PathBreadcrumb genre={cloth.genre} code={cloth.code} />
          <br />
          <br />
          <Button
            floated="left"
            content="BACK"
            icon="arrow left"
            color="black"
            style={{ backgroundColor: "white", color: "black", marginLeft: 50 }}
            as={Link}
            to={`/clothes/${cloth.genre}`}
          />
          <br />
          <br />
          <br />
          <Container>
            <Grid>
              <Grid.Column>
                {cloth.images.map((image) => (
                  <>
                    <Grid.Row>
                      <Image
                        style={{ cursor: "pointer" }}
                        src={`data:image/${currImage.type};base64,${image.data}`}
                        onClick={() => handleChangeCurrImageClickInImage(image)}
                      />
                    </Grid.Row>
                    <br />
                  </>
                ))}
              </Grid.Column>
              <Grid.Column width={8}>
                <Image src={`data:image/${currImage.type};base64,${currImage.data}`} />
                {hasNextImage && (
                  <Button
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "90%",
                      transform: "translate(-50%, -50%)",
                      msTransform: "translate(-50%, -50%)",
                      color: "WhiteSmoke",
                      backgroundColor: "grey",
                      cursor: "pointer",
                      border: "2px solid WhiteSmoke",
                      borderRadius: 0,
                    }}
                    size="big"
                    icon="arrow right"
                    onClick={() => handleChangeCurrImageClickNextImage()}
                  />
                )}
                {hasPrevImage && (
                  <Button
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "10%",
                      transform: "translate(-50%, -50%)",
                      msTransform: "translate(-50%, -50%)",
                      color: "WhiteSmoke",
                      backgroundColor: "grey",
                      cursor: "pointer",
                      border: "2px solid WhiteSmoke",
                      borderRadius: 0,
                    }}
                    size="big"
                    icon="arrow left"
                    onClick={() => handleChangeCurrImageClickPrevImage()}
                  />
                )}
              </Grid.Column>
              <Grid.Column width={7}>
                <Grid.Row>
                  <h1>{cloth.name}</h1>
                </Grid.Row>
                <Grid.Row style={{ marginRight: 70 }}>
                  <Button
                    icon={
                      wishlist && wishlist.find((w) => w.code === code)
                        ? "heart"
                        : "heart outline"
                    }
                    style={{
                      backgroundColor: "White",
                      color: "Red",
                    }}
                    onClick={() => handleWishClick()}
                    floated="left"
                    size="massive"
                  />
                  {cloth.brand}
                </Grid.Row>
                <Grid.Row style={{ marginRight: 70, color: "grey" }}>
                  Code: {cloth.code}
                </Grid.Row>
                <br />
                <Divider />
                <Grid.Row>
                  <strong>SIZE</strong>
                  <br />
                  <br />
                </Grid.Row>
                <Grid.Row>
                  <Button.Group
                    compact
                    color="gray"
                    size="big"
                    buttons={["XS", "S", "M", "L", "XL"]}
                    onClick={(e) => setSize(e.target.innerText)}
                  />
                </Grid.Row>
                <br />
                <Divider />
                <strong>QUANTITY</strong>
                <br />
                <br />
                <Button
                  style={{
                    borderRadius: 0,
                    backgroundColor: "Grey",
                    color: "WhiteSmoke",
                    verticalAlign: "middle",
                  }}
                  icon="arrow left"
                  onClick={() => handleSetQuantity(-1)}
                />
                <Label
                  style={{
                    verticalAlign: "middle",
                    borderRadius: 0,
                    color: "black",
                  }}
                  size="big"
                  content={quantity}
                />
                <Button
                  style={{
                    borderRadius: 0,
                    backgroundColor: "Grey",
                    color: "WhiteSmoke",
                    verticalAlign: "middle",
                  }}
                  icon="arrow right"
                  onClick={() => handleSetQuantity(1)}
                />
                <Divider />
                <Grid.Row style={{ marginLeft: 140, float: "left" }}>
                  <h3>{colors.name(currImage.color)[1].toUpperCase()}</h3>
                </Grid.Row>
                <br />
                <br />
                <Grid.Row style={{ marginLeft: 140, float: "left" }}>
                  {cloth.colors.map((c) => (
                    <Button
                      circular
                      size="medium"
                      icon
                      style={{
                        backgroundColor: c,
                        border: "1px solid #777777",
                      }}
                      onClick={() => handleChangeCurrImageClickInColor(c)}
                    ></Button>
                  ))}
                </Grid.Row>
                <br />
                <br />
                <br />
                <Grid.Row>
                  {cloth.discount ? (
                    <Grid centered rows={2}>
                      <Grid.Row
                        style={{
                          textDecorationLine: "line-through",
                          textDecorationColor: "red",
                        }}
                      >
                        <h4>{cloth.price.toFixed(2)}€</h4>
                      </Grid.Row>
                      <Grid.Row>
                        <h2>{(quantity * cloth.salesPrice).toFixed(2)}€</h2>
                      </Grid.Row>
                    </Grid>
                  ) : (
                    <Grid.Row>
                      <h2>{(quantity * cloth.price).toFixed(2)}€</h2>
                    </Grid.Row>
                  )}
                </Grid.Row>
                <br />
                <Grid.Row>
                  <Button
                    style={{
                      backgroundColor: "black",
                      fontRadius: 1,
                      color: "WhiteSmoke",
                      border: "2px solid black",
                      borderRadius: 0,
                    }}
                    icon="cart"
                    size="huge"
                    content="Add to Cart"
                    onClick={addToCart}
                  />
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Container>
        </>
      ) : (
        <LoadingDimmer complete={fetchComplete} error={fetchError} />
      )}
    </div>
  );
}
