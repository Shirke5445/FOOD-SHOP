import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";
import order from "../models/order.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//create stripe chekout session => /api/v1/payment/chekout_session
export const stripeChekoutSession = catchAsyncErrors(async (req, res, next) => {
  const body = req?.body;

  const line_items = body?.orderItems?.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          images: [item?.image],
          metadata: { productId: item?.product },
        },

        unit_amount: item?.price * 100,
      },
      tax_rates: [""],
      quantity: item?.quantity,
    };
  });
  const shippingInfo = body?.shippingInfo;
  const shipping_rate = body?.itemsPrice >= 200 ? "" : "";

  const session = await stripe.chekout.sessions.create({
    payment_methods_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: req?.user?.email,
    client_reference_id: req?.user?._id?.tostring(),
    mode: "payment",
    metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
    shipping_options: [
      {
        shipping_rate,
      },
    ],
    line_items,
  });

  console.log("==================================");
  console.log("session");
  console.log("==================================");

  res.status(200).json({
    url: session.url,
  });
});
    

   const getOrderItems = async(line_items) => {
    return new Promise((resolve, reject) => {
      let cartItems = [];

      line_items?.data?.forEach(async(item) => {
          const product = await stripe.products.retrieve(item.price.product);
          const productId = product.metadata.productId

      
          cartItems.push({
            product: productId,
            name:product.name,
            price:item.price.unit_amount_decimal / 100,
            quantity: item.quantity,
            image:product.images[0],
          });

          if (cartItems.length === line_items?.data?.length){
            resolve(cartItems);
          }
      });
    });
   };
//create new order after payment => /api/v1/payment/webhook
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if(event.type=== 'checkout.session.completed'){
      const session = event.data.object;
      const line_items = await stripe.checkout.sessions.listLineItems(session.id);

      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
         phoneNo: session.metadata.phoneNo,
         zipCode: session.metadata.zipCode,
         country: session.metadata.country,


      };
      
        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status,

        }

        const orderData ={
          shippingInfo,
          orderItems,
          itemsPrice,
          taxAmount,
          shippingAmount,
          totalAmount,
          paymentInfo,
          paymentmethod: 'Card',
          user,
        };
        
        await order.create(orderData)
      res.status(200).json({success: true});
    }
  } catch (error) {
    
  }
});
