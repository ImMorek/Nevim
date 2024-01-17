import mongoose, { mongo } from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mngdb konekt")
    } catch (error) {
        console.log(error);
    }
}
export default connectMongoDB;