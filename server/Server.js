import BodyParser from "body-parser"
import Express from "express"
import Mongodb from "mongodb"
import Dotenv from "dotenv"
import Cors from "cors"

//Controllers
import InventoryController from "./controllers/InventoryController.js"
import OrderController from "./controllers/OrderController.js"
import UserController from "./controllers/UserController.js"

Dotenv.config()

const mongoClient = Mongodb.MongoClient
const port = process.env.SERVER_PORT || 8000
const Router = Express.Router()
const app = Express()

function createAppRoutes(){
    function createRequestCallback(callback){
        return (req, res) => {
            try {   
                res.header("Access-Control-Allow-Origin", "*")
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")  
                callback(req, res)
            } catch (error) {
                res.status(500).json({ error : err.message })
            }
        }
    }

   
    app.post("/api/get-users-data", createRequestCallback(UserController.onGetUsersDataRequest))
    app.post("/api/create-user", createRequestCallback(UserController.onCreateUserRequest))
    app.post("/api/log-in", createRequestCallback(UserController.onLoginRequest))

    app.post("/api/get-items", createRequestCallback(InventoryController.onGetItemsRequest))

    app.post("/api/create-order", createRequestCallback(OrderController.onCreateOrderRequest))
    app.post("/api/get-cust-orders", createRequestCallback(OrderController.onGetCustOrdersRequest))
    app.post("/api/get-all-orders", createRequestCallback(OrderController.onGetAllOrdersRequest))
    app.post("/api/update-order-status", createRequestCallback(OrderController.onUpdateStatusRequest))
    app.post("/api/assign-order", createRequestCallback(OrderController.onAssignEmployeeRequest))
    app.post("/api/cancel-order", createRequestCallback(OrderController.onCancelOrderRequest))
    app.post("/api/get-assigned-orders", createRequestCallback(OrderController.getAssignedOrders))
}

function initControllers(client){
    const controllers = [UserController, InventoryController, OrderController]

    controllers.forEach(
        (controller) => {
            controller.init(client)
        }
    )    
}

function initMongoClient(){
    return mongoClient.connect(
        process.env.DATABASE_URI,
        {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser:true
        }
    ).catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
}

function initApp(){
    app.use("/api", Router)
    app.use(Express.json())
    app.use(Cors())
    app.use(BodyParser.urlencoded({ extended: false }))

    app.listen(port, () => {
        console.log("Port Created")
    })    
}

initMongoClient()
    .then(initControllers)
    .then(initApp)
    .then(createAppRoutes)