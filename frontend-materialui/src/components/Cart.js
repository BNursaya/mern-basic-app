import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, IconButton, Button, Card, CardContent,
  AppBar, Toolbar, Badge
} from '@mui/material';
import { Remove, Add, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsedCart = JSON.parse(stored);
      fetch(`${API_BASE_URL}/products`) // ⬅️ API-ға қарай өзгертіп қой
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const availableIds = new Set(data.data.map(p => p._id));
            const filtered = parsedCart.filter(item => availableIds.has(item._id));
            setCart(filtered);
            localStorage.setItem('cart', JSON.stringify(filtered));
          } else {
            setCart([]);
          }
        });
    }
  }, []);

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleIncrement = (productId) => {
    const updated = cart.map(item =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updated);
  };

  const handleDecrement = (productId) => {
    const updated = cart
      .map(item =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);
    updateLocalStorage(updated);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/user-login');
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Shop
          </Typography>

          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cart.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <Button onClick={handleLogout} variant="outlined" sx={{ ml: 2 }} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          🛒 Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography>No items in cart</Typography>
        ) : (
          <>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {cart.map(item => (
                <Card key={item._id} sx={{ width: 250 }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price} ₸ × {item.quantity} = {item.price * item.quantity} ₸
                    </Typography>

                    <Box mt={1} display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <IconButton onClick={() => handleDecrement(item._id)}>
                        <Remove />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton onClick={() => handleIncrement(item._id)}>
                        <Add />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Button variant="contained" color="success" onClick={() => alert("Order confirmed!")}>
                  Confirm Order
                </Button>
                <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={clearCart}>
                  Clear Cart
                </Button>
              </Box>
              <Typography variant="h6">Total: {total} ₸</Typography>
            </Box>
          </>
        )}

        <Button sx={{ mt: 4 }} onClick={() => navigate('/shop')}>
          ⬅ Back to Shop
        </Button>
      </Container>
    </>
  );
};

export default Cart;
