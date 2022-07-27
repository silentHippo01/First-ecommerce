import React, {createContext, useContext, useState, useEffect, Children} from "react";
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantities) => {
        //в этой функции идет проверка. 
        //При добавлении одного и того же продукта в корзину, 
        //не должен добавляться еще один item одного и того же товара, а должно просто увеличиться кол-во и цена
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantities);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantities);

        if(checkProductInCart){
            const updateCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantities
                    // quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updateCartItems);
        } else {
            product.quantity = quantities;
            // product.quantity = quantity;

            setCartItems([...cartItems, {...product}]);
        }

        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    const onRemove = (product) => {
        const newCartItems = cartItems.filter(item => item._id != product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price * product.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - product.quantity);
        setCartItems(newCartItems);

    }

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter(item => item._id != id);

        if(value === 'inc'){
            setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1} ]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities  + 1);
        } else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1} ]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            
            return prevQty - 1;
        });
    }

    return (
        <Context.Provider value={{
            showCart,
            cartItems,
            totalPrice,
            setTotalPrice,
            totalQuantities,
            setTotalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            showCart,
            setCartItems,
            setShowCart,
            toggleCartItemQuanitity,
            onRemove,
        }}>
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context); 
// кастомный хук, при вызове которого возвращается объект, 
// из которого можно деструктуризировать функции для изменения состояния