import React, { useEffect } from "react";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({
  event,
  user,
}: {
  event: Event;
  user: { clerkId: string; userId: string };
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const onCheckout = async () => {
    console.log("checkout");
    const order = {
      eventTitle: event.title,
      eventDescription: event.description,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: user.userId,
      buyerClerkId: user.clerkId,
    };
    try {
      const url = await checkoutOrder(order);
      router.push(url);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Something went wrong while processing your order. Please try again.",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to explore events and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <Button
      type="submit"
      role="link"
      size="lg"
      className="w-full md:w-fit"
      onClick={onCheckout}
    >
      {event.isFree ? "Get Ticket" : `Buy Ticket`}
    </Button>
  );
};

export default Checkout;
