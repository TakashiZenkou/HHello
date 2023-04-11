import BaseController from "./BaseController.js"
import InventoryDAO from "../daos/InventoryDAO.js"

class InventoryController extends BaseController{
    async onGetItemsRequest(_, res){
        InventoryDAO.getItems().then((itemData) => {
            res.json({
                itemData : itemData
            })
        })
    }
}

export default new InventoryController(InventoryDAO)