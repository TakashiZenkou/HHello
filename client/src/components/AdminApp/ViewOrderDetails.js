import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

function ViewOrderDetails(props) {
    let total = 0

    if (props.orderDetails.length == 0){
        return(<></>)
    }

    props.orderDetails.orderData.forEach(item => {
        total += parseInt(item.Price) * parseInt(item.quantity)
    })

    return (
        <>
            <Modal
                {...props}
                size="md"
                centered
                > 
                <Modal.Header closeButton>
                    <div class="fs-3 fw-bolder">
                        Order <span class="fs-5 fw-light">  #{props.orderDetails.orderId}</span>
                    </div>

                    
                </Modal.Header>                

                <Modal.Body> 
                    <div class="row mb-4 ">
                        <div class="row justify-content-between w-100 mx-auto">
                            <div class="col-6 fs-6 fs-4 fw-bold">
                                Total
                            </div>
                            
                            <div class="col-6 d-flex justify-content-end fs-4 fw-bold">
                                <div>
                                    ${total}
                                </div>
                            </div>
                        </div>              
                    </div>

                    <hr class="mb-4"/>

                    {
                        props.orderDetails.orderData.map(item => {
                            return(
                                <>
                                    <div class="row mb-2">
                                        <div class="row justify-content-between w-100 mx-auto">
                                            <div class="col-6 fs-6">
                                                <span class="">{item.Name}</span>
                                                <Badge bg="secondary fs-6 badge rounded-pill">x{item.quantity}</Badge>
                                            </div>
                                            
                                            <div class="col-6 d-flex justify-content-end">
                                                <div>
                                                    ${parseInt(item.Price) * parseInt(item.quantity)}
                                                </div>
                                            </div>
                                        </div>              
                                    </div>
                                </>
                            )
                        })
                    } 

                    <hr class="mb-4"/>
                    <div>
                        <span class="fw-bold">Assigned employees :</span>
                        <span>
                            {
                                props.orderDetails.employeeData.map((employee, index) => {
                                    return(
                                        <>  
                                            <span> {employee.username}</span> 
                                            <span>{index+1 < props.orderDetails.employeeData.length && <>,</>}</span>                            
                                        </>
                                    )
                                })
                            } 
                        </span>
                    </div>
                   
                    


                </Modal.Body>
                
                <Modal.Footer bsPrefix=' w-100 mb-3'>
                                
                </Modal.Footer>
            </Modal>   
        </>
    )
}

export default ViewOrderDetails