export default class BaseController {    
    constructor(DAO) {
        this.DAO = DAO
    }

    async init(client){
        this.DAO.load(client)
    }
}