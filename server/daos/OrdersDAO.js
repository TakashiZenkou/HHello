import BaseDAO from "./BaseDAO.js"

import {ObjectId} from "mongodb"

class OrdersDAO extends BaseDAO {
    async createOrder(userId, orderData, time){
        await this.collection.insertOne({
            userId : userId,
            orderData : orderData,
            status : 0, 
            time : time,
            employees : []
        })
    }

    async getCustOrders(userId){
        return await this.collection.aggregate([
            { $match : { userId : userId} },         
            { $unwind : "$orderData"},
            {
                $lookup : {
                    from: "Inventory",
                    let: {
                        itemId : { $toObjectId: "$orderData.itemId"},
                        items: "$orderData"
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$itemId" ] } } },
                        { $unset : [ "Description", "Category", "_id", "Ingredients"] },
                        { $replaceRoot: { newRoot: { $mergeObjects: ["$$items", "$$ROOT"] } } }
                    ],
                    as: "orderData"
                }
            },
            {
                $group: {
                  _id: "$_id",
                  userId: { $first: "$userId" },
                  time: { $first: "$time" },
                  status: {$first: "$status"},
                  orderData: { $push: { $first: "$orderData" } }
                }
            },
            { $sort : { status : 1, time : -1 } },          
            { $addFields : { orderId : "$_id" } },    
            { $unset : [ "_id", "userId" ] }
        ]).toArray()
    }

    async getAllOrders(){
        return await this.collection.aggregate([  
            { $addFields : { userObjectId : { $toObjectId: "$userId"} } },  
            {
                $lookup : {
                    from: "Users",
                    localField: "userObjectId" ,
                    foreignField: "_id",
                    as: "customerData"
                }
            },
            { $unset : [ "customerData._id", "customerData.type", "customerData.password" ] },
            {
                $lookup : {
                    from: "Users",
                    let: {
                        employeeIds : "$employees",
                    },
                    pipeline: [
                        {$match : { 
                            $expr: {
                                $in: [ { $toString: "$_id" }, "$$employeeIds" ]
                            }                
                        }},

                        { $unset : [ "password", "_id", "type"] }
                    ],
                    as: "employeeData"
                }
            },
            { $unwind : "$orderData"},
            {
                $lookup : {
                    from: "Inventory",
                    let: {
                        itemId : { $toObjectId: "$orderData.itemId"},
                        items: "$orderData"
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$itemId" ] } } },
                        { $unset : [ "Description", "Category", "_id", "Ingredients"] },
                        { $replaceRoot: { newRoot: { $mergeObjects: ["$$items", "$$ROOT"] } } }
                    ],
                    as: "orderData"
                }
            },
            {
                $group: {
                  _id: "$_id",
                  userId: { $first: "$userId" },
                  time: { $first: "$time" },
                  status: {$first: "$status"},
                  customerData: {$first: "$customerData"},
                  employees: {$first: "$employees"},
                  orderData: { $push: { $first: "$orderData" } },
                  employeeData: {$first: "$employeeData"}
                }
            },
            { $sort : { status : 1, time : -1 } },          
            { $addFields : { orderId : "$_id" } },    
            { $unset : [ "_id", "userId" ] }
        ]).toArray()
    }

    async updateOrderStatus(orderId, status){
        orderId = ObjectId(orderId)

        return await this.collection.updateMany(
            { _id : orderId},
            {$set: {
                status:status
            }}
        )
    }

    async assignOrder(orderId, employeeIdList){
        orderId = ObjectId(orderId)

        return await this.collection.updateMany(
            { _id : orderId},
            {$set: {
                employees:employeeIdList
            }}
        )
    }

    async getAssignedOrders(employeeId){
        return await this.collection.aggregate([
            { $match : { 
                $expr: {
                    $in: [ employeeId, "$employees" ] 
                }                
            } },
            { $addFields : { userObjectId : { $toObjectId: "$userId"} } }, 
            {
                $lookup : {
                    from: "Users",
                    localField: "userObjectId" ,
                    foreignField: "_id",
                    as: "customerData"
                }
            },
            { $unset : [ "customerData._id", "customerData.type", "customerData.password" ] },
            {
                $lookup : {
                    from: "Users",
                    let: {
                        employeeIds : "$employees",
                    },
                    pipeline: [
                        {$match : { 
                            $expr: {
                                $in: [ { $toString: "$_id" }, "$$employeeIds" ]
                            }                
                        }},

                        { $unset : [ "password", "_id", "type"] }
                    ],
                    as: "employeeData"
                }
            },
            { $unwind : "$orderData"},
            {
                $lookup : {
                    from: "Inventory",
                    let: {
                        itemId : { $toObjectId: "$orderData.itemId"},
                        items: "$orderData"
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$itemId" ] } } },
                        { $unset : [ "Description", "Category", "_id", "Ingredients"] },
                        { $replaceRoot: { newRoot: { $mergeObjects: ["$$items", "$$ROOT"] } } }
                    ],
                    as: "orderData"
                }
            },            
            {
                $group: {
                  _id: "$_id",
                  userId: { $first: "$userId" },
                  time: { $first: "$time" },
                  status: {$first: "$status"},
                  customerData: {$first: "$customerData"},
                  employees: {$first: "$employees"},
                  employeeData: {$first: "$employeeData"},
                  orderData: { $push: { $first: "$orderData" } }
                }
            },
            
            { $sort : { status : 1, time : -1 } },          
            { $addFields : { orderId : "$_id" } },    
            { $unset : [ "_id", "userId", "employees","userObjectId" ] },
        ]).toArray()
    }

    async cancelOrder(orderId){
        orderId = ObjectId(orderId)

        return await this.collection.deleteOne({"_id" : orderId})
    }
}

export default new OrdersDAO("Orders")