import { Card, Grid, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
export default function ClothesCard({
  idx,
  cloth,
  handleChangeImageClick,
  wishlist,
  handleWishClick,
  thumbnail,
}) {
  return (
    <Card key={`${idx}-card`}>
      <Card.Header
        style={{ height: 350 }}
        as={Link}
        to={`/clothes/${cloth.genre}/${cloth.code}`}
      >
        <Image
          style={{
            verticalAlign: "middle",
            height: 350,
            width: 250,
            objectFit: "cover",
          }}
          alt={`${cloth.name}`}
          key={`${cloth.code}-image`}
          src={`data:image/${thumbnail.currImage.type};base64,${thumbnail.currImage.data}`}
        />
      </Card.Header>
      <Card.Content>
        <strong>{cloth.name}</strong>
        {cloth.discount ? (
          <Grid columns={2}>
            <Grid.Column
              style={{
                textDecorationLine: "line-through",
                textDecorationColor: "red",
              }}
            >
              {cloth.price.toFixed(2)}€
            </Grid.Column>
            <Grid.Column>{cloth.salesPrice.toFixed(2)}€</Grid.Column>
          </Grid>
        ) : (
          <Grid.Row>{cloth.price.toFixed(2)}€</Grid.Row>
        )}
        <Grid.Column>
          <Grid.Row style={{ float: "left", marginLeft: 10 }}>
            {cloth.colors.map((color) => (
              <Button
                key={`${cloth.code}-${color}`}
                circular
                size="mini"
                icon
                style={{
                  marginTop: "15px",
                  backgroundColor: color,
                  border: "1px solid #777777",
                }}
                onClick={() => handleChangeImageClick(cloth, color)}
              ></Button>
            ))}
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Button
            className="wishButton"
            key={`${cloth.code}-wish-btn`}
            icon={
              wishlist && wishlist.find((w) => w.code === cloth.code)
                ? "heart"
                : "heart outline"
            }
            style={{
              marginTop: "5px",
              float: "right",
              backgroundColor: "White",
              color: "Red",
            }}
            onClick={() => handleWishClick(cloth.code)}
          />
        </Grid.Column>
      </Card.Content>
    </Card>
  );
}
