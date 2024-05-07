import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let mongoClient;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo UTI to .env.local");
}

export default async function connectToDatabase(){
    try {
        if(mongoClient){
            return {mongoClient};
        }
   
        const mongoClient = await (new MongoClient(uri,options)).connect();
        console.log("Just Connected!");
        return {mongoClient};
    } catch(e) {
        console.error(e);
       
    }
}