import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

import { useState, useEffect } from 'react'

import ViewOrderDetails from '../AdminApp/ViewOrderDetails.js'
import OrderService from "../../Services/OrderService.js"
import Statuses from '../../constants/statuses.js'

function ViewAssignedOrders(props) {
  const [orderData, setOrderData] = useState([])
  const [detailsShow, setDetailsShow] = useState(false)
  const [orderDetails, setOrderDetails] = useState([]) 
  const [orderId, setOrderId] = useState()

function onOrderCancelled(orderId){
    return OrderService.cancelOrder(orderId)
}


  async function updateOrderData(){
    return await OrderService.getAssignedOrders(props.userId).then((assignedOrderData) => {
      console.log(assignedOrderData)
      const filteredData = assignedOrderData.filter((orderData) => orderData.status != 2);
      setOrderData(filteredData || [])
    })
  }

  function updateOrderStatus(orderId, status){
    OrderService.updateOrderStatus(orderId, status).then(() => {updateOrderData()})
  }
  
  useEffect(() => {
    updateOrderData()
  }, [])

  return (
    <>
      {
        orderData.length === 0?
          <div class="fw-light fs-4 text-center">
            <h1>You are currently assigned no orders.</h1>
          </div>
        :
        <>
          <h1>Currently Assigned Orders</h1>
          <p></p>
          <p></p>
          <Table responsive striped bordered hover>
              <thead>
                  <tr>
                    <th class="fw-bolder">Tracking Number</th>
                    <th class="fw-bolder">Customer</th>
                    <th class="fw-bolder">Date Placed</th>
                    <th class="fw-bolder">Status</th>                   
                  </tr>
              </thead>

              <tbody>  
                  {
                      orderData.map(order => {
                          return(
                              <tr>
                                  <td class="fw-light">{order.orderId}</td>
                                  <td class="fw-light">{order.customerData[0].username}</td>
                                  <td class="fw-light">{(new Date(order.time)).toLocaleString()}</td>                             
                                  <td>
                                      <DropdownButton 
                                          title={Statuses[order.status]} 
                                          id="bg-nested-dropdown" 
                                          variant='outline-secondary'
                                          onSelect={eventKey => {
                                            updateOrderStatus(order.orderId, eventKey)
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
                                    </td>
                                    <td>
                                    <Button 
                                        variant='danger rounded-pill fw-bold'
                                        onClick={() => {
                                          onOrderCancelled(order.orderId).then(updateOrderData)
                                                }}                       
                                            >
                                        Cancel
                                  </Button>    
                                </td>        
                              </tr>
                          )
                      })
                  } 
                  <ViewOrderDetails
                      show={detailsShow}
                      onHide={() => setDetailsShow(false)}
                      orderDetails={orderDetails}
                      orderId={orderId}
                  />                        
              </tbody>
          </Table>          
        </>
      }
    </>
    
  )
}

export default ViewAssignedOrders