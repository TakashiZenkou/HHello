import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

import { useState, useEffect } from 'react'

import UserService from "../../Services/UserService.js"
import ViewOrderDetails from './ViewOrderDetails.js'
import Statuses from '../../constants/statuses.js'

function AssigmentPopup(props){
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [employeeList, setEmployeeList] = useState([])

    function onEmployeeSelected(employeeUserId){
        const newEmployeeList = employeeList.filter(userData => {
            return userData.userId != employeeUserId
        })

        const newSelectedEmployeesList = employeeList.filter((userData) => {
            return userData.userId == employeeUserId
        })
        
        setSelectedEmployees([...selectedEmployees, ...newSelectedEmployeesList])
    }
    
    useEffect(()=>{
        UserService.getUsersData().then((data) => {
            if (!data.userData) return

            const newEmployeeList = data.userData.filter((userData) => {
                return userData.type == "Employee"
            })

            setEmployeeList(newEmployeeList)
            setSelectedEmployees([])
        })
    }, [])

    function handleAssign(){
        props.onAssigned(selectedEmployees)
        setSelectedEmployees([])
        
    }

    return(
        <>
            <Modal
                {...props}
                size="sm"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Assign Employees
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body> 
                    {
                        employeeList.length > 0
                        &&
                        <DropdownButton
                            title="Select Employees" 
                            id="bg-nested-dropdown" 
                            variant='outline-secondary mb-2'
                            onSelect={eventKey => {
                                onEmployeeSelected(eventKey)
                            }}
                        >
                        {
                            employeeList.map(employeeData => {
                                return <Dropdown.Item eventKey={employeeData.userId}>{employeeData.username}</Dropdown.Item>
                            })
                        }                    
                        </DropdownButton>    
                    }
                    {
                        selectedEmployees.map(employeeData => {
                            return <div>{employeeData.username}</div>    
                        })
                    }                                                        
                </Modal.Body>
                
                <Modal.Footer>                    
                    <Button
                        onClick={handleAssign}
                    >
                        Assign
                    </Button>
                </Modal.Footer>
            </Modal>   
        </> 
    )
}

function OrderTable(props){
    const [detailsShow, setDetailsShow] = useState(false)
    const [orderDetails, setOrderDetails] = useState([]) 
    return(
        <>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                    <th class="fw-bolder">Tracking Number</th>
                    <th class="fw-bolder">Customer</th>
                    <th class="fw-bolder">Date Placed</th>
                    {
                        props.assigned && <th class="fw-bolder">Status</th>
                    }
                    <th class="fw-bolder" colspan="3">Action</th>                  
                    </tr>
                </thead>

                <tbody>  
                    {
                        props.orderData.map(order => {
                            return(
                                <tr>
                                    <td class="fw-light">{order.orderId}</td>
                                    <td class="fw-light">{order.customerData[0].username}</td>
                                    <td class="fw-light">{(new Date(order.time)).toLocaleString()}</td>
                                    {
                                        props.assigned 
                                        && 
                                        <td class="fw-light">
                                            <DropdownButton 
                                                title={Statuses[order.status]} 
                                                id="bg-nested-dropdown" 
                                                variant='outline-secondary'
                                                onSelect={eventKey => {
                                                    props.onOrderStatusChanged(order.orderId, parseInt(eventKey))
                                                }}
                                            >
                                                {
                                                    Statuses.map((statusText, statusCode) => {
                                                        return(
                                                            <Dropdown.Item eventKey={statusCode}>{statusText}</Dropdown.Item>
                                                        )
                                                    })
                                                }                     
                                            </DropdownButton>
                                        </td>   
                                    }

                                    {
                                        !props.assigned 
                                        &&
                                        <td>
                                            <Button 
                                                variant='primary rounded-pill fw-bold'
                                                onClick={() => {
                                                    props.onAssigned(order.orderId)
                                                }}                       
                                            >
                                                Assign
                                            </Button>  
                                        </td>
                                    }

                                    {
                                        !props.assigned 
                                        &&
                                        <td>
                                            <Button 
                                                variant='danger rounded-pill fw-bold'
                                                onClick={() => {
                                                    props.onRemoveOrder(order.orderId)
                                                }}                       
                                            >
                                                Cancel
                                            </Button>  
                                        </td>
                                    }   

                                     <td>
                                        <Button 
                                            variant='primary rounded-pill fw-bold'
                                            onClick={() => {
                                                setOrderDetails(order)
                                                setDetailsShow(true)
                                            }}                       
                                        >
                                            View
                                        </Button>
                                        {props.assigned && order.status === 2 &&(
                                            <Button 
                                                variant='danger rounded-pill fw-bold ms-3'
                                                onClick={() => {
                                                    props.onRemoveOrder(order.orderId)
                                                }}                       
                                            >
                                                Delete
                                            </Button>)}
                                    </td>          
                                </tr>
                            )
                        })
                    } 
                    <ViewOrderDetails
                        show={detailsShow}
                        onHide={() => setDetailsShow(false)}
                        orderDetails={orderDetails}
                    />                        
                </tbody>
            </Table>          
        </>
    )
}

function ViewCurrentOrders(props) {
    const [assignmentShow, setAssigmentShow] = useState(false)
    const [orderId, setOrderId] = useState()
    const unassignedOrderData = props.orderData.filter(order => {
        return ("employees" in order) == false || order.employees == null || order.employees.length == 0
    })
    const assignedOrderData = props.orderData.filter(order => {
        return ("employees" in order) && order.employees && order.employees.length > 0
    })
    function handleRemoveOrder(orderId) {
        props.removeOrder(orderId);
      }

    return (
        <>
            {
                unassignedOrderData.length > 0 
                && 
                <>
                    <div class="fs-4 mb-3">
                        Unassigned Orders:
                    </div>

                    <OrderTable 
                        orderData={unassignedOrderData} 
                        assigned={false}
                        onRemoveOrder={handleRemoveOrder}
                        onAssigned={
                            (orderId) => {
                                setAssigmentShow(true)
                                setOrderId(orderId)
                            }
                        }
                    />

                    <hr class="mt-5 mb-5"/>
                </>
            }
            {
                 assignedOrderData.length > 0 
                 ?(
                 
                 <>
                    <div class="fs-4 mb-3">
                        Order Panel
                    </div>
                    <OrderTable 
                        onRemoveOrder={handleRemoveOrder}
                        orderData={assignedOrderData} 
                        onOrderStatusChanged={props.onOrderStatusChanged}
                        assigned={true}
                    />
                 </>
                 ):(

                 
                <div class="fs-4 fw-light ms-3">
                    NO ORDERS TO SHOW
                </div>
            )}
           
            

            <AssigmentPopup
                show={assignmentShow}
                onHide={() => setAssigmentShow(false)}
                onAssigned={(assignedEmployeesData) =>{
                    const employeeIdList = assignedEmployeesData.map((data)=>{
                        return data.userId
                    })
                    setAssigmentShow(false)
                    props.onOrderAssigned(orderId, employeeIdList)
                }}
                orderId = {orderId}
            /> 
        </>
    )
}

export default ViewCurrentOrders