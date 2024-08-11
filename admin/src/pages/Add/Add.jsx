import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = ({API_URL}) => {
  

  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    name: '',
    description: '',
    category: '',
    price: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevents default refresh by the browser

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', Number(data.price));
    formData.append('image', image);

    try {
      const response = await axios.post(`${API_URL}/api/food/add`, formData); // Post request to the server

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          category: '',
          price: ''
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error uploading the image', error);
      toast.error('Error uploading the image');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className='add'>
      <ToastContainer />
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor='image'>
            <img 
              src={image ? window.URL.createObjectURL(image) : assets.upload_area} 
              alt="Uploaded Preview"
              onError={(e) => { e.target.src = assets.upload_area; }} // Fallback in case of error
            />
          </label>
          <input 
            onChange={handleImageChange} 
            type='file' 
            id='image' 
            hidden 
            required 
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            type='text' 
            onChange={onChangeHandler} 
            value={data.name} 
            name='name' 
            placeholder='Type Product Name' 
            required 
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            name='description' 
            onChange={onChangeHandler} 
            value={data.description} 
            placeholder='Type Product Description' 
            rows="6" 
            required 
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Select Category</p>
            <select onChange={onChangeHandler} name='category' value={data.category} required>
              <option value="">--Select--</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desserts">Desserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price</p>
            <input 
              type='number' 
              onChange={onChangeHandler} 
              value={data.price} 
              name='price' 
              placeholder='Type Price' 
              required 
            />
          </div>
        </div>
        <button type='submit' className='add-btn'>Add Product</button>
      </form>
    </div>
  );
};

export default Add;
