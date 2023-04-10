import React from "react";

import { SnackbarProvider } from "notistack";
import WishlistContextProvider from "./WishlistContext";
import BagContextProvider from "./BagContext";
import UserContextProvider from "./UserContext";

const ContextWrapper = () => {
  return (
    <SnackbarProvider
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={3000}
    >
      <UserContextProvider>
        <WishlistContextProvider>
          <BagContextProvider/>
        </WishlistContextProvider>
      </UserContextProvider>
    </SnackbarProvider>
  );
};

export default ContextWrapper;
