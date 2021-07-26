import styled from "styled-components";
import { Card, Image, Button, Grid } from "semantic-ui-react";

export const CardsWrapper = styled.div`
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media screen and (max-width: 1285px) {
    grid-template-columns: 1fr 1fr !important;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr !important;
  }

  @media screen and (max-width: 500px) {
    padding: 4rem 2rem !important;
  }
`;

export const StyledCard = styled(Card)`
  text-align: center;
`;

export const CardHeader = styled(Card.Header)``;

export const CardContent = styled(Card.Content)``;

export const InnerImage = styled(Image)`
  width: 100%;
  height: 350;
  object-fit: cover;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

export const WishButton = styled(Button)`
  margin-top: 5px;
  float: right;
  background: rgba(0, 0, 0, 0) !important;
  color: red !important;
`;

export const ColorButton = styled(Button)`
  margin-top: 15px;
  background-color: ${({ color }) => color} !important;
  border: 1px solid #777777 !important;
  &:hover {
    border: 2px solid #777777 !important;
  }
`;

export const StyledGrid = styled(Grid)``;

export const GridSaleColumn = styled(Grid.Column)`
  text-decoration: line-through;
  text-decoration-color: red;
`;

export const GridColumn = styled(Grid.Column)``;

export const GridRow = styled(Grid.Row)``;
