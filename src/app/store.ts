import { configureStore } from "@reduxjs/toolkit"; 
import cartReducer from '../features/cart/cartSlice'; 
import productReducer from '../features/products/productSlice'; 

 
export const store = configureStore({
    reducer: {
        cart: cartReducer, 
        product: productReducer
    }, 
});  
 
// Return Type is a TypeScript utility that will allow you to transform the type
// defination of a function into its return type. RootState is going to contain 
// a type defination  that perfectly matches all the data we have in our redux store. 
export type RootState =  ReturnType<typeof store.getState>; 

// ReturnType<typeof store.getState> ley, store.getState() function le return garni values haru ko type lai denote garxw. 

/**  */
export type AppDispatch = typeof store.dispatch; 




