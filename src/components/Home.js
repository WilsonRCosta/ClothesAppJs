import React, { useEffect, useState } from "react";
import { Grid, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import NavBar from "./navbar/NavBar";
import clothesService from "../service/serviceAPI";
import LoadingDimmer from "./LoadingDimmer";

export default function Home() {
  const [salesClothes, setClothes] = useState([]);

  const [fetchError, setFetchError] = useState();
  const [fetchComplete, setFetchComplete] = useState();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setFetchComplete(false);
    clothesService()
      .getProducts()
      .then((resp) => {
        if (resp.type === "error") {
          setFetchError({ code: resp.code, msg: resp.msg });
          return;
        }
        setClothes(
          resp.data
            .filter((cl) => cl.salesPrice)
            .sort((a, b) => (a.discount >= b.discount ? 1 : -1))
        );
        setFetchComplete(true);
      });
  };

  return (
    <div>
      <br />
      <NavBar />
      {fetchComplete ? (
        <Grid columns={2} style={{ marginLeft: 10, marginRight: 10 }}>
          {salesClothes.map((cl) => (
            <Grid.Column
              style={{ color: "Black" }}
              as={Link}
              to={`/clothes/${cl.genre}/${cl.code}`}
            >
              <Image
                src={`data:image/${cl.images[0].type};base64,${cl.images[0].data}`}
                alt={`${cl.name}`}
                style={{
                  verticalAlign: "middle",
                  height: 1000,
                  width: 800,
                  objectFit: "cover",
                }}
              />
              <p>{cl.name}</p>
              <Grid.Row
                style={{
                  textDecorationLine: "line-through",
                  textDecorationColor: "red",
                }}
              >
                {cl.price.toFixed(2)}€
              </Grid.Row>
              <Grid.Row>{cl.salesPrice.toFixed(2)}€</Grid.Row>
            </Grid.Column>
          ))}
        </Grid>
      ) : (
        <LoadingDimmer complete={fetchComplete} error={fetchError} />
      )}
    </div>
  );
}
