import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography
} from '@mui/material';
import { Edit, Delete, Save, Cancel, UploadFile } from '@mui/icons-material';
import API_BASE_URL from '../config'; // ✅ Қосылды

const ProductItem = ({ product, onUpdateProduct, onDeleteProduct, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editImage, setEditImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
    setPreview(null);
  };

  const handleSave = () => {
    if (!editName.trim() || !editPrice) return;
    onUpdateProduct(product._id, editName, editPrice, editImage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditImage(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <ListItem divider sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
      {!isEditing ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {/* ✅ API_BASE_URL арқылы сурет */}
            <img
              src={
                product.image
                  ? `${API_BASE_URL}/uploads/${product.image}`
                  : '/placeholder.png'
              }
              alt={product.name}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              onError={(e) => (e.target.src = '/placeholder.png')}
            />

            <ListItemText
              primary={product.name}
              secondary={`₸${product.price}`}
            />
          </Box>

          <Box>
            <IconButton onClick={handleEdit} disabled={isLoading}><Edit /></IconButton>
            <IconButton onClick={() => onDeleteProduct(product._id)} disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} /> : <Delete />}
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Product Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            fullWidth
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
          >
            Upload New Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          {preview && (
            <Box>
              <Typography variant="subtitle2">Preview:</Typography>
              <img src={preview} alt="preview" style={{ width: 120, marginTop: 8 }} />
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleSave} startIcon={<Save />} disabled={isLoading}>
              Save
            </Button>
            <Button onClick={handleCancel} startIcon={<Cancel />} disabled={isLoading}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </ListItem>
  );
};

export default ProductItem;
