import axios from "axios";

const PRODUCTS_URL = "/api/products";
const USERS_URL = "/api/auth";

export default function clothesService() {
  return {
    // PRODUCT REQUESTS
    getProducts: () => {
      return axios.get(PRODUCTS_URL).then(getProductsInfo).catch(getError);
    },
    getProductByCode: (code) => {
      return axios
        .get(`${PRODUCTS_URL}/${code}`)
        .then(getProductsInfo)
        .catch(getError);
    },
    createProduct: (product, token) => {
      const { files, ...rest } = product; // remove files
      return axios
        .post(PRODUCTS_URL, rest, { headers: { token } })
        .then(setProductsInfo)
        .catch(getError);
    },
    addImageToProduct: (files, code, token) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file, file.name);
      });
      return axios
        .put(`${PRODUCTS_URL}/${code}/images`, formData, { headers: { token } })
        .then(setProductsInfo)
        .catch(getError);
    },
    editProduct: (product, token) => {
      return axios
        .put(`${PRODUCTS_URL}/${product.code}`, product, { headers: { token } })
        .then(setProductsInfo)
        .catch(getError);
    },
    deleteProduct: (code, token) => {
      return axios
        .delete(`${PRODUCTS_URL}/${code}`, { headers: { token } })
        .then(setProductsInfo)
        .catch(getError);
    },

    // AUTHENTICATION REQUESTS
    loginUser: (user) => {
      return axios
        .post(`${USERS_URL}/login`, user)
        .then(getUserInfo)
        .catch(getError);
    },
    registerUser: (user) => {
      return axios
        .post(`${USERS_URL}/register`, user)
        .then(getUserInfo)
        .catch(getError);
    },
  };
}

const getUserInfo = (resp) => ({
  msg: resp.data.msg,
  token: resp.headers.token,
  type: "success",
  user: resp.data.user,
});

const getProductsInfo = (resp) => ({
  data: resp.data,
  type: "success",
});

const setProductsInfo = (resp) => ({
  msg: resp.data.msg,
  type: "success",
});

const getError = (err) => ({
  code: err.response.status,
  msg: err.response.data.msg,
  type: "error",
});
