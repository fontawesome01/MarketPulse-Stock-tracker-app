 import mongoose from "mongoose";

const MONGODB_URI = "process.env.MONGODB_URL";

declare global {
        var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null ;
        }
}
 let cached = global.mongooseCache;

if(!cached){
    cached = global.mongooseCache={ conn:null,promise:null};
}

export const connectiontoDatabase = async() => {
    if(!MONGODB_URI) throw new Error("MongoDB URI is missing");
    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands : false});
    }
    try{
        cached.conn = await cached.promise;
    }catch(err){
        cached.promise =null;
        throw err;

    }

    console.log(`MongoDB Connected! ${process.env.NODE_ENV}`);
}