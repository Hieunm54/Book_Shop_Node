import mongoose from "mongoose";

const {Schema} = mongoose;

const orderSchema = new Schema({

    productList: [
        {
            productId: {type: Schema.Types.ObjectId, required: true},
            title: {type: String, required: true},
            price: {type: Number, required: true},
            quantity: {type: Number, required: true}
        }
    ],
    user:{
            userId: {type: Schema.Types.ObjectId, required: true,ref: 'User'},
            name: {type: String , required: true},
        }
})

export default mongoose.model('Order',orderSchema)