import ViewAssignedOrders from "./components/EmployeeApp/ViewAssignedOrders.js"

import "./App.css"

function EmployeeApp(props){
    return(
        <>
            <div class="container dashboard-container pt-5">
                <div class="fit-content">
                    <ViewAssignedOrders userId={props.userId}/>
                </div>                
            </div>            
        </>
    )
}

export default EmployeeApp