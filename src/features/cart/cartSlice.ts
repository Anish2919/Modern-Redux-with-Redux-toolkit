import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'; 
import { AppDispatch, RootState } from '../../app/store'; 
import { CartItems, checkout } from '../../app/api';

// creating interface 
export type CheckoutState = "LOADING" | "READY" | "ERROR"; 
export interface CartState {
    items: { [productId: string]:number };  
    checkoutState: CheckoutState; 
    errorMessage: string; 
} 


const initialState: CartState = {
    items: {}, 
    checkoutState: 'READY', 
    errorMessage: ''
} 


// async await with createAsyncThunk 
// export const checkoutCart = createAsyncThunk("cart/checkout",async (items:CartItems) => {
//     const response = await checkout(items);  
//     return response;
// }) 

// Accessing Global state inside of Async thunks with typeScript 
export const checkoutCart = createAsyncThunk("cart/checkout",async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState; 
    const items = state.cart.items; 
    const response = await checkout(items); 
    return response; 
})

// creating the slice 
const cartSlice = createSlice({
    name: "cart", 
    initialState, 
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;
            if(state.items[id]) {
                state.items[id]++; 
            } else {
                state.items[id] = 1; 
            }
        }, 
        removeFromCart(state, action: PayloadAction<string>) {
            const id = action.payload; 
            delete state.items[id]; 
        }, 
        updateQuantity(state, action: PayloadAction<{id: string, quantity: number}>) {
            const {id, quantity} = action.payload; 
            state.items[id] = quantity;
        }
    }, 
    extraReducers(builder) {
        builder.addCase(checkoutCart.pending, (state, action) => {
            state.checkoutState = "LOADING"; 
        }), 
        builder.addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{success: boolean}>) => {  
            const {success} = action.payload; 
            if(success) {
                state.checkoutState = "READY"; 
                state.items = {}; 
            } else {
                state.checkoutState = 'ERROR'; 
            }
        }), 
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.checkoutState = "ERROR"; 
            state.errorMessage = action.error.message || ''; 
        })
    },
}); 

export const {addToCart, removeFromCart, updateQuantity} = cartSlice.actions; 

export default cartSlice.reducer; 



// memoized getItemsNumber 
export const memoizedGetItemsNum = createSelector(
    (state: RootState) => {
        return state.cart.items
    }, 
    (items) => {
        let numItems = 0; 
        for(let id in items) {
            numItems += items[id]; 
        }
        return numItems; 
    }
    ) 
    
    // memoized getTotalPrice 
    export const getTotalPrice = createSelector(
        (state:RootState) => {
            return state.product.products
        }, 
        (state: RootState) => state.cart.items, 
    (products, items) => {
        let total = 0; 
        for(let id in items) {
            total += products[id].price * items[id]; 
        } 
        
        console.log(total); 
        return total.toFixed(2); 
    } 
    ) 
    
    // apply types to redux selector 
    /** Using the generic syntax, you can pass in the rootstate as the first 
     * argument and then appropriate types for the various arguments going into your final 
     * selector function. 
     * In this case, we're going to use  any. and any.The last argument would be the return value 
     * which here would be string. 
    */  
   
   // get cart items number 
   // export function getItemsNum(state: RootState) {
   //     let numItems = 0; 
   //     console.log('get items processing...'); 
   //     for(let id in state.cart.items) {
   //         numItems += state.cart.items[id];  
   //     }
   //     return numItems; 
   // }
   
   // custom action. It is used in the redux with redux-thunk middleware for working with asyn await functions , now in RTK, createReduxThunk is used for this. 
   // export function checkout() {
       //     return function(dispatch: AppDispatch) {
           //         dispatch({type: 'cart/checkout/pending'});  
           
           //         setTimeout(() => {
               //             dispatch({type: 'cart/checkout/fulfilled'}); 
               //         }, 500); 
               //     }
               // }
               
               
               
               