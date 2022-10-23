import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: { cartItems: [] },
};

function reducer(state = initialState, action) {
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

    return { ...state, cart: { ...state.cart, cartItems } };
  }

  return state;
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
