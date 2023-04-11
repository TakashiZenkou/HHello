import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'

import { useState } from 'react'

function OrderConfirmation(props){
    return(
        <>
         <Modal
            {...props}
            size="md"
            centered
            >            
            <Modal.Body> 
                <div class="text-center mt-4">
                    <i class="bi bi-exclamation-triangle-fill fs-1 text-primary"></i>
                </div>
                
                <div class="fs-2 fw-bold text-center text-primary">
                    Are you sure?         
                </div>

                <div class="mt-2 fs-5 fw-light text-center mb-3">
                    Ensure that you double-check your order before placing it.     
                </div>                        
            </Modal.Body>
            
            <Modal.Footer bsPrefix=' w-100 mb-3'>
                <hr/>    
                <div class="mx-auto justify-content-center text-center">
                    <Button variant="danger w-25 rounded-pill fw-bold me-4" onClick={()=>props.onHide()}>No</Button>
                    <Button variant="primary w-25 rounded-pill fw-bold" onClick={()=>props.onConfirmed()}>Yes</Button>    
                </div>               
            </Modal.Footer>
        </Modal>   
        </>
    )
}

function CreateOrder(props){
    const [confirmationShow, setConfirmationShow] = useState(false)

    let cartTotal = 0

    props.cartData.forEach(item => {
        cartTotal += item.Price * item.Quantity
    })

    return(
        <> 
            {
                props.cartData.length > 0?         
                <div class="ms-3 me-3 mb-5">
                    <div class="row mb-2">
                        <div class="row justify-content-between w-100 mx-auto">
                            <div class="col-8 fs-3 fw-bolder">
                                Cart Total : ${cartTotal}
                            </div>
                            
                            <div class="col-4 d-flex justify-content-end">
                                <div>                                
                                    <Button 
                                        variant='primary rounded-pill fw-bold'
                                        onClick={() => {
                                            setConfirmationShow(true)
                                        }}                       
                                    >
                                        Place Order
                                    </Button>                                                               
                                </div>
                            </div>
                        </div>              
                    </div>  
                    <hr class="mt-5"></hr>              
                </div>
                :
                <div class="fs-4 fw-light ms-3">
                   YOUR CART IS EMPTY
                </div>
            }
            
            <div class="ms-3 me-3">
                {
                    props.cartData.map((item, index) => {
                        return(
                            <div class="row mb-2">
                                <div class="row justify-content-between w-100 mx-auto">
                                    <div class="col-6 fs-6">
                                        <Button 
                                            variant='outline-dark rounded-pill'
                                            onClick={() => {
                                               props.onItemRemoved(index)
                                            }}                       
                                        >
                                            <i class="bi bi-trash3-fill ps-2 pe-2"/>
                                        </Button> 

                                        <span class="ms-3 me-2">{item.Name}</span>
                                        <Badge bg="secondary fs-6 badge rounded-pill">x{item.Quantity}</Badge>
                                    </div>
                                    
                                    <div class="col-6 d-flex justify-content-end">
                                        <div>
                                            ${item.Price * item.Quantity}
                                        </div>
                                    </div>
                                </div>              
                            </div>
                        )
                    })
                } 
            </div>   

            <OrderConfirmation
                show={confirmationShow}
                onHide={() => setConfirmationShow(false)}
                onConfirmed = {() => {
                    setConfirmationShow(false)
                    props.onOrderPlaced()                    
                }}
            />
        </>
    )
}

export default CreateOrder