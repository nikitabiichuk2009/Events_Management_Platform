"use server";

import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import Stripe from "stripe";
import { stringifyObject } from "./../utils";
import { connectToDB } from "../database";
import Order from "../database/models/order.model";
import { revalidatePath } from "next/cache";

export async function checkoutOrder(order: CheckoutOrderParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = order.isFree ? 0 : order.price;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price * 100,
            product_data: {
              name: order.eventTitle,
              description: order.eventDescription,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
        buyerClerkId: order.buyerClerkId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/${order.buyerClerkId}?purchaseSuccess=true#profile-tickets`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${order.eventId}?cancelledOrder=true`,
    });
    return stringifyObject(session.url);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to checkout order");
  }
}

export async function createOrder(order: CreateOrderParams) {
  try {
    await connectToDB();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });
    revalidatePath("/orders");
    revalidatePath(`/events/${order.eventId}`);
    revalidatePath(`/profile/${order.buyerClerkId}`);

    return stringifyObject(newOrder);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create an order");
  }
}
