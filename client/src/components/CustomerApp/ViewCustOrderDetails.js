import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

function ViewCustOrderDetails(props) {
    let total = 0

    props.orderDetails.forEach(item => {
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
                    <div class="fs-3">
                        Order Total : ${total}
                    </div>
                </Modal.Header>

                <Modal.Body> 
                    {
                        props.orderDetails.map(item => {
                            return(
                                <>
                                    <div class="row mb-2">
                                        <div class="row justify-content-between w-100 mx-auto">
                                            <div class="col-6 fs-6">
                                                <span class="ms-3 me-2">{item.Name}</span>
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
                </Modal.Body>
                
                <Modal.Footer bsPrefix=' w-100 mb-3'>
                                
                </Modal.Footer>
            </Modal>   
        </>
    )
}

export default ViewCustOrderDetails