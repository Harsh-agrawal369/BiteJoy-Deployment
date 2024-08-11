import React, { useEffect } from 'react'
import './Verify.css'
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    const {API_URL} = useContext(StoreContext);

    const verifyPayment = async () => {
        try {
            console.log("mydta: " , success, orderId);
            let response = await axios.post(`${API_URL}/api/order/verify?success=${success}&orderId=${orderId}`);
            
            if(response.data.success){
                navigate('/myorders');
            }
            else{
                navigate('/');
            }
        } catch (error) {
            navigate('/')
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [])

    console.log(success, orderId);
  return (
    <div className='verify'>

        <div className="spinner">

        </div>
      
    </div>
  )
}

export default Verify
