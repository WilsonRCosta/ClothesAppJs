import React from "react";
import { Switch, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import Home from "./components/Home";
import Clothes from "./components/clothes-page/Clothes";
import ClothesDetails from "./components/cloth-details-page/ClothesDetails";
import Wishlist from "./components/Wishlist";
import ShoppingCart from "./components/ShoppingCart";
import Register from "./components/Register";
import AdminProducts from "./components/admin-page/AdminProducts";

import ContextWrapper from "./contexts/ContextWrapper";
import UserContextProvider from "./contexts/UserContext";
import WishlistContextProvider from "./contexts/WishlistContext";
import BagContextProvider from "./contexts/BagContext";
import { SnackbarProvider } from "notistack";

function App() {
  const wrapper = React.createRef();
  return (
    <div ref={wrapper}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoHideDuration={3000}
      >
        <UserContextProvider>
          <WishlistContextProvider>
            <BagContextProvider>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/wishlist" component={Wishlist} />
                <Route exact path="/shopping-cart" component={ShoppingCart} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/clothes/sales" component={Clothes} />
                <Route exact path="/admin/products" component={AdminProducts} />
                <Route
                  exact
                  path="/clothes/:genre"
                  render={({ match }) => <Clothes genre={match.params.genre} />}
                />
                <Route
                  exact
                  path="/clothes/:genre/:code"
                  render={({ match }) => (
                    <ClothesDetails code={match.params.code} />
                  )}
                />
              </Switch>
            </BagContextProvider>
          </WishlistContextProvider>
        </UserContextProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
