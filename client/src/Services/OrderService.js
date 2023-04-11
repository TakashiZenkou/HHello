import HttpClient from "./httpClient.js"

function getDateString(){
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()

    return mm + '/' + dd + '/' + yyyy
}

export default {
    async createOrder(userId, orderData){
        return HttpClient.post("/create-order", {
            userId :userId,
            orderData : JSON.stringify(orderData),
            time: Date.now().toString()
        })
    },

    async getCustOrders(userId){
        return await HttpClient.post("/get-cust-orders", {
            userId :userId,
        }, "custOrdersData").then((custOrdersData) => {
            if (custOrdersData)
                return JSON.parse(custOrdersData)
        })
    },

    async getAllOrders(){
        return await HttpClient.post("/get-all-orders", null, "ordersData").then((ordersData) => {
            if (ordersData)
                return JSON.parse(ordersData)
        })
    },

    async updateOrderStatus(orderId, status){
        return await HttpClient.post("/update-order-status",{
            orderId : orderId,
            status : status
        })
    },

    async assignOrder(orderId, employeeIdList){
        return await HttpClient.post("/assign-order",{
            orderId : orderId,
            employeeIdList : employeeIdList
        })
    },

    async cancelOrder(orderId){
        return await HttpClient.post("/cancel-order",{
            orderId : orderId,
        }) 
    },

    async getAssignedOrders(employeeId){
        return await HttpClient.post("/get-assigned-orders", {
            employeeId : employeeId
        }, "ordersData").then((ordersData) => {
            return JSON.parse(ordersData)
        })
    }
}