import BaseController from "./BaseController.js"
import OrdersDAO from "../daos/OrdersDAO.js"

class OrderController extends BaseController{
    async onCreateOrderRequest(req, res){
        const body = req.body
        const userId = body.userId
        const orderData = JSON.parse(body.orderData)
        const time = parseInt(body.time)

        OrdersDAO.createOrder(userId, orderData, time).then(()=>{
            res.json({
                success : true
            })
        })
    }

    async onGetCustOrdersRequest(req, res){
        const body = req.body
        const userId = body.userId

        OrdersDAO.getCustOrders(userId).then((custOrdersData) => {
            res.json({
                custOrdersData : JSON.stringify(custOrdersData)
            })
        })
    }

    async onGetAllOrdersRequest(_, res){
        OrdersDAO.getAllOrders().then((ordersData) => {
            res.json({
                ordersData : JSON.stringify(ordersData)
            })
        })
    }

    async onUpdateStatusRequest(req, res){
        const body = req.body
        const orderId = body.orderId
        const status = parseInt(body.status)

        OrdersDAO.updateOrderStatus(orderId, status).then(() => {
            res.json({
                success : true
            })
        })
    }

    async onAssignEmployeeRequest(req, res){
        const body = req.body
        const orderId = body.orderId
        const employeeIdList = body.employeeIdList

        OrdersDAO.assignOrder(orderId, employeeIdList).then(() => {
            res.json({
                success : true
            })
        })
    }

    async onCancelOrderRequest(req, res){
        const body = req.body
        const orderId = body.orderId

        OrdersDAO.cancelOrder(orderId).then(() => {
            res.json({
                success : true
            })
        })
    }

    async getAssignedOrders(req, res){
        const body = req.body
        const employeeId = body.employeeId

        OrdersDAO.getAssignedOrders(employeeId).then((ordersData) => {
            res.json({
                ordersData : JSON.stringify(ordersData)
            })
        })
    }
}

export default new OrderController(OrdersDAO)