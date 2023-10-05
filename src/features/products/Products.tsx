import React, { useEffect, useState } from "react";
import { getProducts, Product } from "../../app/api";
import styles from "./Products.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { receivedProducts } from "./productSlice";
import { addToCart } from "../cart/cartSlice";

export function Products() {
  // getting products from the react-redux 
  const products = useAppSelector((state) => state.product.products); 

  const dispatch = useAppDispatch(); 
  useEffect(() => {
    getProducts().then((products) => {
      dispatch(receivedProducts(products)); 
    });
  }, []); 

  // on adding cart 
  const handleAddToCart = (id: string) => {
    dispatch(addToCart(id)); 
  } 
  


  return (
    <main className="page">
      <ul className={styles.products}>
        {Object.values(products).map((product) => (
          <li key={product.id}>
            <article className={styles.product}>
              <figure>
                <img src={product.imageURL} alt={product.imageAlt} />
                <figcaption className={styles.caption}>
                  {product.imageCredit}
                </figcaption>
              </figure>
              <div>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => handleAddToCart(product.id)}>Add to Cart 🛒</button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
