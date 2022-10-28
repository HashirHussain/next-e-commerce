import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: { location: {} }, paymentMethod: "" },
};

function reducer(state, action) {
  if (action.type === "CART_ADD_ITEM") {
    const newItem = action.payload;
    const existsItem = state.cart.cartItems.find(
      (item) => item.slug === newItem.slug
    );

    const cartItems = existsItem
      ? state.cart.cartItems.map((item) => {
          return item.name === existsItem.name ? newItem : item;
        })
      : [...state.cart.cartItems, newItem];

    Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
    return { ...state, cart: { ...state.cart, cartItems } };
  } else if (action.type === "CART_REMOVE_ITEM") {
    const cartItems = state.cart.cartItems.filter((item) => {
      return item.slug !== action.payload.slug;
    });
    Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
    return { ...state, cart: { ...state.cart, cartItems } };
  } else if (action.type === "SAVE_SHIPPING_ADDRESS") {
    return {
      ...state,
      cart: {
        ...state.cart,
        shippingAddress: {
          ...state.shippingAddress,
          ...action.payload,
        },
      },
    };
  } else if (action.type === "CART_RESET") {
    return {
      ...state,
      cart: {
        cartItems: [],
        shippingAddress: { location: {} },
        paymentMethod: "",
      },
    };
  } else {
    return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
