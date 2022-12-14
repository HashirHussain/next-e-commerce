import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existsItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );

    const quantity = existsItem ? existsItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    //with static data: product.countInStock < quantity
    if (data.countInStock < quantity) {
      return toast.error("Sorry, product out of stock");
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="home page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          return (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
