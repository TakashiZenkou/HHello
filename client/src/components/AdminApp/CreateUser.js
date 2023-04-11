import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import UserService from '../../Services/UserService.js'

function CreateUser(props){
    const [isFormCompleted, setIsFormCompleted] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(false)

    function onFieldChanged(){
        const usernameLen = document.getElementById("username-field").value.length
        const passwordLen = document.getElementById("password-field").value.length
        const accountSelect = parseInt(document.getElementById("select-account-type").value)
    
        setIsFormCompleted(usernameLen > 0 && passwordLen >0 && accountSelect > 0)
        setUsernameTaken(false)
    }

    function onCreateRequest(){
        if (!isFormCompleted) return

        const username = document.getElementById("username-field").value
        const password = document.getElementById("password-field").value
        const type = parseInt(document.getElementById("select-account-type").value)

        UserService.createUser(
            username, 
            password,
            type == 1 && "Employee" || "Customer"
        ).then((data) => {
            if (data.wasAccountCreated){
                props.onUserAccountCreated()
            }else{
                setUsernameTaken(true)
            }
        })
    }

    return(
        <>
         <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                create new user account
                </Modal.Title>
            </Modal.Header>
            <Modal.Body> 
                <div class="ms-2 me-2">
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col">
                            <label for="username-field" class="col-form-label">Username</label>
                        </div>
                        <div class="col">
                            <input id="username-field" class="form-control" autocomplete="off" onChange={onFieldChanged}/>
                        </div>
                    </div>

                    <div class="row g-3 align-items-center mb-3">
                        <div class="col">
                            <label for="password-field" class="col-form-label">Password</label>
                        </div>
                        <div class="col">
                            <input id="password-field" class="form-control" autocomplete="off" onChange={onFieldChanged} />
                        </div>
                    </div> 

                    <div class="row g-3 align-items-center">
                        <div class="col">
                            <label for="select-account-type" class="col-form-label">Account type</label>
                        </div>
                        <div class="col">
                            <select id="select-account-type" class="form-select" onChange={onFieldChanged}>
                                <option selected value="0">Select</option>
                                <option value="1">Employee</option>
                                <option value="2">Customer</option>
                            </select>
                        </div>
                    </div>          
                </div>                        
            </Modal.Body>
            
            <Modal.Footer>
                <div class="me-5 align-items-left w-50">
                    {
                        usernameTaken && <>Username unavailable</>
                        ||!isFormCompleted && <>*One or more fields are empty</>
                    }     
                </div>           
                <Button onClick={onCreateRequest}>Create</Button>
            </Modal.Footer>
        </Modal>   
        </>
    )
}

export default CreateUser