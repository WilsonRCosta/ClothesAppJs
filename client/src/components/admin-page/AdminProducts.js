import { useEffect, useState } from "react";
import { Grid, Statistic, Card } from "semantic-ui-react";
import NavBar from "../navbar/NavBar";
import clothesService from "../../service/serviceAPI";
import LoadingDimmer from "../LoadingDimmer";
import AddProductModal from "./AddProductModal";
import SortProducts from "./SortProducts";
import ProductsTable from "./ProductsTable";

export default function AdminProducts() {
  const [clothes, setClothes] = useState([]);

  const handleSortByProp = (prop) =>
    setClothes([...clothes].sort((a, b) => (a[prop] >= b[prop] ? 1 : -1)));

  const [fetchError, setFetchError] = useState();
  const [fetchComplete, setFetchComplete] = useState();

  useEffect(() => {
    setFetchComplete(false);
    clothesService()
      .getProducts()
      .then((resp) => {
        if (resp.type === "error")
          setFetchError({ code: resp.code, msg: resp.msg });
        setClothes(resp.data.sort((a, b) => (a.code >= b.code ? 1 : -1)));
        setFetchComplete(true);
      });
  }, []);

  const ProductsStats = () => (
    <Statistic floated="right" style={{ marginRight: 200 }}>
      <Statistic.Label>Products</Statistic.Label>
      <Statistic.Value>{clothes.length}</Statistic.Value>
    </Statistic>
  );

  return (
    <div>
      <br />
      <NavBar />
      <Grid centered columns={2}>
        <Grid.Column floated="left" style={{ marginLeft: 50, width: 250 }}>
          <AddProductModal clothes={clothes} setClothes={setClothes} />
        </Grid.Column>
        <Grid.Column>
          <ProductsStats />
        </Grid.Column>
      </Grid>
      {fetchComplete ? (
        <>
          <SortProducts handleSortByProp={handleSortByProp} />
          <br />
          <br />
          {clothes.length > 0 ? (
            <ProductsTable clothes={clothes} setClothes={setClothes} />
          ) : (
            <Card centered style={{ marginTop: 100, width: 550 }}>
              <Card.Content>
                <h3>No items stored.</h3>
              </Card.Content>
            </Card>
          )}
          <br />
        </>
      ) : (
        <LoadingDimmer complete={fetchComplete} error={fetchError} />
      )}
    </div>
  );
}
