import React from 'react'
import { Button,Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { useEffect,useState } from 'react';
import Swal from 'sweetalert2';
import InputField from '../../../utils/InputField';
import { Formik, Form } from 'formik';
import SelectField from '../../../utils/SelectField';

const AssignLeave = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [selectedLeave,setSelectedLeave] = useState([])
    const  axiosInstance = useAxios()
    const [employeeDetails,setEmployeeDetails] = useState([])


    const handleUpdate = (leave) => {
        console.log("done",leave)
        setEmployeeDetails(leave)
        axiosInstance.get(`leave-details/?id=${leave.id}`).then((res) => {
          setSelectedLeave(res.data);
          console.log("????????????????????????",res.data)
            }).then(()=>{
         
              setShowUpdateModal(true);
            });       
      };
      
      
      
      
      
      useEffect(() => {
        axiosInstance.get(`api/employees/`).then((res) => {
          setEmployee(res.data);
        });        
      }, []);
     
    // useEffect(()=>{
    //   axiosInstance.get(`leave-details/?id=${selectedLeave.id}`).then((res) => {
    //     set(res.data);
    //   });
    // },[])
      
      const handleUpdateSubmit = async (values, { setSubmitting, setErrors }) => {
        console.log("Finally i got the latet code ",selectedLeave)
        try {
          console.log("*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-",values)
          if(selectedLeave.length>0){
            await axiosInstance.patch(`leave-details/${selectedLeave[0]["id"]}/`, values);
            setShowUpdateModal(false);
          }
          else{
            console.log("THis is the post bhai",selectedLeave,values)
            try{  
              console.log("POOOOOOOOOOOOOOOOOOOOOOOOO",employeeDetails)
              await axiosInstance.post(`leave-details/?id=${employeeDetails["id"]}/`, values);
              setShowUpdateModal(false);
            }
            catch(err){
              console.log(err,"hello")
            }
         
          }
          
          // setRequestedLeave((prev) =>
          //   prev.map((leave) => (leave.id === selectedLeave.id ? { ...leave, ...values } : leave))
          // );
          Swal.fire('Success!', 'Leave Request is Updated Successfully!', 'success');
        } catch (err) {
          if (err.response && err.response.data && err.response.data.non_field_errors) {
            setErrors({ api: err.response.data.non_field_errors[0] });
          } else {
            setErrors({ api: 'An error occurred' });
          }
        } finally {
          setSubmitting(false);
        }
      };
    
  return (
    <div style={{ marginLeft: "250px" }}> 
    <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>           
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Update</th>            
          </tr>
        </thead>
        <tbody>
          {employee.map((employeeData) => (
            <tr key={employeeData.id}>
              <th scope="row">{employeeData["id"]}</th>             
              <th scope="row">{employeeData["first_name"]}</th>   
              <th scope="row">{employeeData["last_name"]}</th> 
              <td>
                <Button variant="primary" onClick={() => handleUpdate(employeeData)}>
                  Update
                </Button>
              </td>
              <td>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave  && (
            <Formik
              initialValues={{
                remaining_paid_leave:selectedLeave.length>0 ? selectedLeave[0]["remaining_paid_leave"] : "",
                remaining_casual_leave: selectedLeave.length>0 ? selectedLeave[0]["remaining_casual_leave"] : "",
                remaining_unpaid_leave:selectedLeave.length>0 ?  selectedLeave[0]["remaining_unpaid_leave"] : "",
                remaining_sick_leave:selectedLeave.length>0 ?  selectedLeave[0]["remaining_sick_leave"] : "",
              }}
             
              onSubmit={handleUpdateSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form>
                  {errors.api && <p className="text-danger">{errors.api}</p>}
                  <InputField
                    label="Paid Leave"
                    type="number"
                    name="remaining_paid_leave"
                    value={values.remaining_paid_leave}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Remaining Paid Leave"
                    isInvalid={touched.remaining_paid_leave && !!errors.remaining_paid_leave}
                    error={errors.remaining_paid_leave}
                  />                 
                  
                  <InputField
                    label="Remaining Casual Leave"
                    type="number"
                    name="remaining_casual_leave"
                    value={values.remaining_casual_leave}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Remaining Casual Leave"
                    isInvalid={touched.remaining_casual_leave && !!errors.remaining_casual_leave}
                    error={errors.remaining_casual_leave}
                  />
                  <InputField
                    label="Remaining Unpaid Leave"
                    type="number"
                    name="remaining_unpaid_leave"
                    value={values.remaining_unpaid_leave}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Remaining Unpaid Leave"
                    isInvalid={touched.remaining_unpaid_leave && !!errors.remaining_unpaid_leave}
                    error={errors.remaining_unpaid_leave}
                  />
                  <InputField
                    label="Remaining Sick Leave"
                    type="number"
                    name="remaining_sick_leave"
                    value={values.remaining_sick_leave}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Remaining Sick Leave"
                    isInvalid={touched.remaining_sick_leave && !!errors.remaining_sick_leave}
                    error={errors.remaining_sick_leave}
                  />
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default AssignLeave