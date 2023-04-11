import BaseDAO from "./BaseDAO.js"

class UsersDAO extends BaseDAO {
    async createUser(username, password, type){
        const createPromise = new Promise((resolve) => {
            this.collection.distinct("username", { username : username }).then((documentsWithUsername) => {
                if (documentsWithUsername.length > 0){
                    resolve(false)
                }else{
                    this.collection.insertOne({
                        username : username,
                        password : password,
                        type : type
                    }).then(() => resolve(true))
                }
            })                
        })
            
        return createPromise      
    }

    async verifyLoginRequest(username, password) {        
        const documentsWithLoginInfo = await this.collection.aggregate([
            { $match : { username : username, password : password } },
            { $addFields: { userId : "$_id" } },
            { $unset : [ "_id" ] }
        ]).toArray()

        return documentsWithLoginInfo.length > 0 && documentsWithLoginInfo[0]
    }

    async getUsersData(){
        return this.collection.aggregate([
            { $match : { $or: [ { type : "Employee" }, { type : "Customer" } ] } },
            { $sort : { type : -1 } }, 
            { $addFields: { userId : "$_id" } },          
            { $unset : [ "_id" ] }
        ]).toArray()
    }
}

export default new UsersDAO("Users")