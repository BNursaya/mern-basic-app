import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  InputLabel,
  Select,
  FormControl
} from '@mui/material';
import API_BASE_URL from '../config';

const ProductForm = ({ onAddProduct, isLoading }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Категорияларды жүктеу
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        console.log("Categories response:", data); // 👈 осыны көр
        if (data.success) {
          setCategories(data.data);
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !category) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    onAddProduct(formData); // 🧠 Жаңартылған: FormData арқылы
    setName('');
    setPrice('');
    setCategory('');
    setImage(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Product
      </Typography>

      {/* Product Name */}
      <TextField
        fullWidth
        label="Product Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
      />

      {/* Price */}
      <TextField
        fullWidth
        label="Price"
        type="number"
        variant="outlined"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        step="0.01"
        required
        margin="normal"
        inputProps={{ min: 0 }}
      />

      {/* Category Select */}
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Image Upload */}
      <Button
        variant="outlined"
        component="label"
        sx={{ mt: 2 }}
      >
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </Button>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        startIcon={isLoading && <CircularProgress size={20} />}
        sx={{ mt: 3 }}
      >
        {isLoading ? 'Adding...' : 'Add Product'}
      </Button>
    </Box>
  );
};

export default ProductForm;
