import React, { useState } from 'react';
import './Shop.css';
import tshirt1 from '../assets/ShopImg/tshirt1.png';
import mug1 from '../assets/ShopImg/mug1.jpg';
import socks1 from '../assets/ShopImg/socks1.jpg';
import bg1 from '../assets/ShopImg/back1.jpg';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Navbar } from '@material-tailwind/react';
import StickyNavbar from  './StickyNavbar.jsx';


const Shop = () => {
    const [cartItems, setCartItems] = useState([]);

    const products = [
        { id: 1, name: 'Explore the Cosmos T-Shirt', price: 999, image: tshirt1},
        { id: 2, name: 'Mars Rover Mug', price: 399, image: mug1},
        { id: 3, name: 'Planetary Socks', price: 299, image: socks1 },
    ];

    const addToCart = (product) => {
        const existingProduct = cartItems.find(item => item.id === product.id);
        if (existingProduct) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const incrementQuantity = (productId) => {
        setCartItems(cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    const decrementQuantity = (productId) => {
        setCartItems(cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const handleProceedToCheckout = () => {
        // Handle checkout logic here
        console.log('Proceeding to checkout');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <>
        <StickyNavbar/>
        
        <div>
           
            {/* Hero Section */}
            <section className="hero-section"
                style={{display: "flex",justifyContent: "center", flexDirection: "column", alignItems: "center", backgroundImage: `url(${bg1})`, backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <h1>Museum Merchandise - Bring the Science Home!</h1>
                <p>Discover exclusive museum-themed collectibles, apparel, and more.</p>
                <a href="#shop" className="cta-button">Start Shopping</a>
                <div style={{width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "absolute"}}></div>
            </section>

            {/* Featured Products */}
            <section id="shop" className="featured-products">
                <h2>Featured Items</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                          <img src={product.image} alt={product.name} className="product-image" />
                          <h3>{product.name}</h3>
                          <p>₹{product.price}</p>
                          <button onClick={() => addToCart(product)} className="button">
                              Add to Cart
                          </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="reviews">
                <h2>What Our Visitors Say</h2>
                <div className="review-carousel">
                    <div className="review">
                        <p>"The T-shirt quality is amazing! A must-have for science lovers."</p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div className="review">
                        <p>"Love the Mars Rover Mug! It's my go-to coffee cup now."</p>
                        <div className="stars">⭐⭐⭐⭐</div>
                    </div>
                </div>
            </section>

            {/* Cart */}
            <section className="cart">
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                      <div className='empty-cart'>
                        <p>No items in cart</p>
                      </div> 
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <div className="cart-item-quantity">
                                        <button onClick={() => decrementQuantity(item.id)}>-</button>
                                        <input type="text" value={item.quantity} readOnly />
                                        <button onClick={() => incrementQuantity(item.id)}>+</button>
                                    </div>
                                    <div className="cart-item-price">₹{item.price * item.quantity}</div>
                                </div>
                                <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="checkout-button-container">
                        <div className="cart-total">
                            Total: ₹{calculateTotal()}
                        </div>
                        <button className="checkout-button" onClick={handleProceedToCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </section>
            {/* Footer */}
            <motion.footer 
              className="footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
             <div className="footer-container">
                <div>
                  <h3 className="footer-heading">Contact Us</h3>
                  <p className="footer-contact-info">
                    123 Museum Lane<br />
                    City, State, Zip<br />
                    Email: info@museum.com
                  </p>
                </div>
                <div>
                  <h3 className="footer-heading">Quick Links</h3>
                  <ul className="footer-links">
                    <li><NavLink to="/">Home Page</NavLink></li>
                    <li><NavLink to="/booking">Ticket Booking</NavLink></li>
                    <li><NavLink to="/aboutus">About Us</NavLink></li>
                  </ul>
                </div>
                <div>
                  <h3 className="footer-heading">Follow Us</h3>
                  <div className="footer-social">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                  </div>
                </div>
             </div>
            </motion.footer>
        </div>
        </>
    );
};

export default Shop;
