import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);

  // const { query } = useRouter();
  // const { slug } = query;
  // const product = data.products.find((x) => x.slug === slug);

  if (!product) {
    return <Layout title="product not found">Product not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existsItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );

    const quantity = existsItem ? existsItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    //with static data: product.countInStock < quantity
    if (data.countInStock < quantity) {
      toast.error("Sorry, product out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href={"/"}>Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout={"responsive"}
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
