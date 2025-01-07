import { Schema, model, models, Document } from 'mongoose'

export interface IOrder extends Document {
  createdAt: Date
  stripeId: string
  totalAmount: number
  event: Schema.Types.ObjectId
  buyer: Schema.Types.ObjectId
}

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Order = models.Order || model('Order', OrderSchema)

export default Order;