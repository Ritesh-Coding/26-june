import React from 'react'
import useAxios from '../../../hooks/useAxios';
import { useState,useEffect } from 'react';
import CustomSpecialDaysPagination from '../../../hooks/useCustomSpecialDaysPagination';
const BirthDays = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 1;
    const [totalPages, setTotalPages] = useState(1);
    const axiosInstance = useAxios()
    const [birthdays,setBirthDays]= useState([])
    const handlePageChange = (page)=>{
        setCurrentPage(page)
    }
    const showbirthdays=async (page)=>{
      const result =await  axiosInstance.get('api/birthdays/',{
            params:{
            page
            }
        })
        console.log(result.data["results"],"<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>")
        if (result.data.count === 0){
            setTotalPages(1);
          }
          else{
          console.log("total count page",Math.ceil(result.data.count / rowsPerPage))
          setTotalPages(Math.ceil(result.data.count / rowsPerPage));
          }       
        setBirthDays(result.data["results"])       
    }
    useEffect( ()=>{
        showbirthdays(currentPage)
    },[currentPage])
  return (
    <div style={{marginLeft:`50px`}}>
        <h3>Birthdays</h3>  
        <div className="card" style={{width:`360px`}}>
        <div style={{float:`right`,width:`60px` ,marginLeft:`235px`}} >
        <CustomSpecialDaysPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> 
        </div>
        
        {
            birthdays.length >0 ? (birthdays.map((birthday)=>(
                <div key={birthday.id}>
                <img className="card-img-top" src={birthday.profile} alt="BirthDay Image" width="260px" height="150px"/> 
              
                <div className="card-body">
                    <pre>{birthday.dob}</pre>
                    <pre className="card-text">{birthday.first_name}  {birthday.last_name}</pre>
                </div>
                </div>
            ))) : (
                <h5>No Image Found</h5>
            )
        }
       
        </div>
    </div>
  )
}

export default BirthDays