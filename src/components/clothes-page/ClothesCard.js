import { Link } from "react-router-dom";
import {
  CardContent,
  ColorButton,
  CardHeader,
  CardsWrapper,
  GridColumn,
  GridRow,
  GridSaleColumn,
  InnerImage,
  StyledCard,
  StyledGrid,
  WishButton,
} from "./StyledCardElements";

export default function ClothesCard({
  idx,
  cloth,
  handleChangeImageClick,
  wishlist,
  handleWishClick,
  thumbnail,
}) {
  return (
    <CardsWrapper>
      <StyledCard key={`${idx}-card`}>
        <CardHeader as={Link} to={`/clothes/${cloth.genre}/${cloth.code}`}>
          <InnerImage
            alt={`${cloth.name}`}
            key={`${cloth.code}-image`}
            src={`data:image/${thumbnail.currImage.type};base64,${thumbnail.currImage.data}`}
          />
        </CardHeader>
        <CardContent>
          <strong>{cloth.name}</strong>
          {cloth.discount ? (
            <StyledGrid columns={2}>
              <GridColumn>{cloth.price.toFixed(2)}€</GridColumn>
              <GridSaleColumn>{cloth.salesPrice.toFixed(2)}€</GridSaleColumn>
            </StyledGrid>
          ) : (
            <GridRow>{cloth.price.toFixed(2)}€</GridRow>
          )}
          <GridColumn>
            <GridRow style={{ float: "left", marginLeft: 10 }}>
              {cloth.colors.map((color) => (
                <ColorButton
                  key={`${cloth.code}-${color}`}
                  circular
                  size="mini"
                  icon
                  color={color}
                  onClick={() => handleChangeImageClick(cloth, color)}
                ></ColorButton>
              ))}
            </GridRow>
          </GridColumn>
          <GridColumn>
            <WishButton
              key={`${cloth.code}-wish-btn`}
              icon={
                wishlist && wishlist.find((w) => w.code === cloth.code)
                  ? "heart"
                  : "heart outline"
              }
              onClick={() => handleWishClick(cloth.code)}
            />
          </GridColumn>
        </CardContent>
      </StyledCard>
    </CardsWrapper>
  );
}
