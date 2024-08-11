import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const List = ({API_URL}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${API_URL}/api/food/list`);

    if(response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error(response.data.message);
    }
  }

  const removeFood = async (FoodId) => {
    const response = await axios.post(`${API_URL}/api/food/remove`, {id : FoodId});

    if(response.data.success) {
      toast.success(response.data.message);
      await fetchList();
    }
    else{
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Iamge</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div> 
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${API_URL}/images/` + item.image}></img>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p className='cursor' onClick={() => {removeFood(item.id)}}>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
