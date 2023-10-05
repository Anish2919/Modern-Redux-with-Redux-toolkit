import React from "react";
import styles from "./Cart.module.css"; 
import classNames from 'classnames'; 
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkoutCart, getTotalPrice, removeFromCart, updateQuantity } from "./cartSlice"; 
``

export function Cart() {
  const dispatch = useAppDispatch(); 

  const products = useAppSelector(state => state.product.products); 
  const items = useAppSelector(state => state.cart.items); 
  const totalPrice = useAppSelector(getTotalPrice);  
  const checkoutState = useAppSelector(state => state.cart.checkoutState); 
  const errorMessage = useAppSelector(state => state.cart.errorMessage);  

  // onCheckout 
  const onCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  
    dispatch(checkoutCart()); 
  }

  // onfocus out or blur 
  function onQuantityChange(e: React.FocusEvent<HTMLInputElement>, id: string) {
    const quantity = Number(e.target.value); 
    // dispatch update quantity 
    dispatch(updateQuantity({id, quantity})); 
  }

  // classnames 
  const tableClasses = classNames({
    [styles.table]: true, 
    [styles.checkoutError]: checkoutState === "ERROR",  // if checkoutstate is equal to 'ERROR' then 'checkoutError' classname is added. 
    [styles.checkoutLoading]: checkoutState === 'LOADING' // if checkoutState is equal to 'LOADING' then 'checkoutLoading' is added in the class name. 
  }); 
     
  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([id, Quantity]) => (
            <tr key={id}>
              <td>{products[id].name}</td>
              <td>
                <input onBlur={(e) => onQuantityChange(e, id)} type="text" className={styles.input} defaultValue={Quantity} />
              </td>
              <td>{(products[id].price * Quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => dispatch(removeFromCart(id))} aria-label="Remove Magnifying Glass from Shopping Cart">
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckout}> 
        {checkoutState === 'ERROR' && errorMessage ? (<p className={styles.errorBox}>{errorMessage}</p>) : null}
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
