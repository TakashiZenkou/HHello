export default class BaseDAO {    
    constructor(collectionName) {
        this.collectionName = collectionName
    }

    async load(client) {
        let collectionName =  this.collectionName

        if (this.collection) {
            return;
        }

        try {
            this.collection = await client.db(process.env.DATABASE_NAME).collection(collectionName);
            console.log(this.collectionName + " collection loaded");
        } catch (error) {
            console.log(error.message);
        }
    }
}