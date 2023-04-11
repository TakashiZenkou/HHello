import BaseDAO from "./BaseDAO.js"

import {ObjectId} from "mongodb"

class InventoryDAO extends BaseDAO {
    async getItems(){
        const itemData = await this.collection.aggregate([
            { $sort : { Category : 1 } },            
            { $addFields: { ItemId : "$_id" } },
            { $unset : [ "_id" ] }
        ]).toArray()

        itemData.forEach(element => {
            element.ItemId = element.ItemId.toString()
        })

        return itemData
    }
}

export default new InventoryDAO("Inventory")