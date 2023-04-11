import HttpClient from "./httpClient.js";

export default {
    async verifyLoginRequest(username, password){
        return HttpClient.post("/log-in",{
            username : username,
            password : password
        })
    },

    async getUsersData(){
        return HttpClient.post("/get-users-data")
    },

    async createUser(username, password, type){
        return HttpClient.post("/create-user", {
            username :username,
            password : password,
            type : type
        })
    }
}