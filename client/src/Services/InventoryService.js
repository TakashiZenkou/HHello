import HttpClient from "./httpClient.js";

export default {
    async getItems(){
        return HttpClient.post("/get-items", null, "itemData")
    }
}