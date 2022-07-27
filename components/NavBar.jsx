import React from 'react';
import Link from 'next/link';
import {AiOutlineShopping} from 'react-icons/ai';

import { useStateContext } from '../context/StateContext';
import Cart from './Cart.jsx';


const NavBar = () => {

  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className='navbar-container'>
      <p>
        <Link href="/">Headphones</Link>
      </p>
      <button className="cart-icon" type='button' onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>

      {
        showCart && <Cart />
      }

    </div>
  )
}

export default NavBar