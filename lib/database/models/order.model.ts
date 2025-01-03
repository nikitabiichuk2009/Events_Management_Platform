import { Schema, model, models, Document } from 'mongoose'

export interface IOrder extends Document {
  createdAt: Date
  stripeId: string
  totalAmount: string
  event: Schema.Types.ObjectId
  buyer: Schema.Types.ObjectId
}

export type IOrderItem = {
  _id: string
  totalAmount: string
  createdAt: Date
  eventTitle: string
  eventId: string
  buyer: string
}

const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  totalAmount: { type: String, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Order = models.Order || model('Order', OrderSchema)

export default Order;