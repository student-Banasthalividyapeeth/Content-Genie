

import React from "react";
import ReactDOM from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext/AuthContext";
//Stripe configuration
const stripePromise = loadStripe(
  "pk_test_51P9vihSAA9L8Qy9Nw0ZcRHe5lyngr4Rgr1Fw5TSuLFAOEqKK8GFYdBKQydLgKarFfBwvb9UxMV7om9ek58blgeSI00xrYo4LWE"
);

const options = {
  mode: "payment",
  currency: "usd",
  amount: 1099,
  // payment_method_types : ['card'],
};
const root = ReactDOM.createRoot(document.getElementById("root"));

//React query client
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();