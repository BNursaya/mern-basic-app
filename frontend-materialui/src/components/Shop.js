import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Badge,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AuthContext } from '../contexts/AuthContext';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleAddToCart = (product) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const index = existingCart.findIndex(item => item._id === product._id);
    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
  };
  
  

  const handleLogout = () => {
    logout();
    navigate('/user-login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Shop
          </Typography>

          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cart.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Button onClick={handleLogout} variant="outlined" sx={{ ml: 2 }} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      product.image
                        ? `${API_BASE_URL}/uploads/${product.image}`
                        : '/placeholder.png'
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price} ₸
                  </Typography>
                  <Typography variant="body2">
                    Category: {product.category?.name || 'N/A'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Shop;
