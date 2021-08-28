import mongodb from 'mongodb';
import dotenv from 'dotenv';

const MongoClient = mongodb.MongoClient;
dotenv.config();

let url = process.env.MONGODB_URI;
let _db;

const mongoConnect = (callback)=>{
    
    MongoClient.connect(url)
        .then(client => {
            _db = client.db();
            console.log('Connect successful !');
            callback();
        })
        .catch(err => {
            console.log('Error connecting');
            throw err;
        })
}

const getDb = () =>{
    if( _db){
        return _db;
    }
    throw "No database found";
}

export default mongoConnect; 
export {getDb};