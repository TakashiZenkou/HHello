import { useState, useEffect } from "react"

import ViewCurrentOrders from "./components/AdminApp/ViewCurrentOrders.js"
import UserConfig from "./components/AdminApp/UserConfig.js"
import CreateUser from "./components/AdminApp/CreateUser.js"

import OrderService from './Services/OrderService.js'

import "./App.css"

function AdminApp(props){  
    const [userConfigShow, setUserConfigShow] = useState(false)
    const [createUserShow, setCreateUserShow] = useState(false)   
    const [orderData, setOrderData] = useState([]) 

    function removeOrder(orderId) {
        OrderService.cancelOrder(orderId)
        updateOrderData()
      }

    function updateOrderData(){
        OrderService.getAllOrders().then((orderData) => {
            if (orderData){
                setOrderData(orderData)
            }
        })
    }

    useEffect(() => {
        OrderService.getAllOrders().then((orderData) => {
            if (orderData){
                setOrderData(orderData)
            }
        })
    }, [])

    return(
        <>
            <div class="container dashboard-container">
                <button type="button" onClick={() => setUserConfigShow(true)} class="btn btn-primary rounded-pill fw-bold mt-5 mb-5">
                    User Settings
                </button>
                <UserConfig 
                    show={userConfigShow}
                    onHide={() => setUserConfigShow(false)}
                    onCreateUserRequest={() => {
                        setUserConfigShow(false)
                        setCreateUserShow(true)
                    }}
                /> 
                <CreateUser
                    show={createUserShow}
                    onHide={() => setCreateUserShow(false)}
                    onUserAccountCreated = {() => setCreateUserShow(false)}
                /> 

                <div>
                    <ViewCurrentOrders 
                    orderData={orderData}
                    setOrderData={setOrderData}
                    removeOrder={removeOrder} 
                    onOrderStatusChanged={(orderId, statusCode)=> {
                        OrderService.updateOrderStatus(orderId, statusCode).then(() => {
                            updateOrderData()
                        })
                    }}
                    onOrderAssigned={(orderId, employeesIdList) => {
                        OrderService.assignOrder(orderId, employeesIdList).then(() => {
                            updateOrderData()
                        })
                    }}
                />    
                </div>                    
            </div>                    
        </>
    )
}

export default AdminApp