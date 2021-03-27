import axios from "axios";

const HOST_URL = "/api/products";
export default function clothesService() {
  return {
    getProducts: async () => {
      const res = await axios.get(HOST_URL);
      return res.status === 200 ? res.data : res.error;
    },
    getProductByCode: async (code) => {
      const res = await axios.get(`${HOST_URL}/${code}`);
      return res.status === 200 ? res.data : res.error;
    },
    createProduct: async (product) => {
      const { files, ...rest } = product; // remove files
      const res = await axios.post(HOST_URL, rest);
      return res.status === 201 ? res.data : res.error;
    },
    addImageToProduct: async (files, code) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file, file.name);
      });
      const res = await axios.put(`${HOST_URL}/${code}/images`, formData);
      return res.status === 200 ? res.data : res.error;
    },
    editProduct: async (product) => {
      const res = await axios.put(`${HOST_URL}/${product.code}`, product);
      return res.status === 200 ? res.data : res.error;
    },
    deleteProduct: async (code) => {
      const res = await axios.delete(`${HOST_URL}/${code}`);
      return res.status === 200 ? res.data : res.error;
    },
  };
}
