import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useStripeChekoutSessionMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();
  const [
    stripeChekoutSession,
    { data: checkoutData, error: checkoutError, isLoading },
  ] = useStripeChekoutSessionMutation();

  useEffect(() => {
    if (checkoutData) {
      window.Location.href = checkoutData?.url;
    }
    /*if (checkoutError) {
      toast.error(checkoutError?.data?.message);
    }*/
  }, [checkoutData, checkoutError]);
  useEffect(() => {
   /* if (error) {
      toast.error(error?.data?.message);
    }*/
    if (isSuccess) {
      navigate("/me/orders?.order_success=true");
    }
  }, [navigate, error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);

    if (method === "COD") {
      //Create COD Order
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };

      createNewOrder(orderData);
    }

    if (method === "Card") {
      //Stripe Checkout
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };
      stripeChekoutSession(orderData);
    }
  };
  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping ConfirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            action="your_submit_url_here"
            method="post"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash On Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100"
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
