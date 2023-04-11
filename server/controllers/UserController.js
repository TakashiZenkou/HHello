import BaseController from "./BaseController.js"
import UsersDAO from "../daos/UsersDAO.js"

class UsersController extends BaseController{
    async onLoginRequest(req, res){
        const body = req.body
        const username = body.username
        const password = body.password
        
        UsersDAO.verifyLoginRequest(username, password).then(userData => {
            res.json({
                userType : userData.type || null,
                userId : userData.userId || null

            })
        })      
    }

    async onGetUsersDataRequest(_, res){
        UsersDAO.getUsersData().then((userData) => {
            res.json({
                userData : userData
            })
        })
    }

    async onCreateUserRequest(req, res){
        const body = req.body
        const username = body.username
        const password = body.password
        const type = body.type

        UsersDAO.createUser(username, password, type).then((wasAccountCreated) => {
            res.json({
                wasAccountCreated : wasAccountCreated
            })
        })
    }
}

export default new UsersController(UsersDAO)