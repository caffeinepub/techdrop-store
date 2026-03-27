import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { usePlaceOrder } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.address.trim())
      newErrors.address = "Shipping address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: BigInt(item.quantity),
        price: item.price,
      }));
      const id = await placeOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: form.address,
        items: orderItems,
      });
      setOrderId(id);
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (orderId !== null) {
    return (
      <main
        className="container mx-auto px-4 py-16"
        data-ocid="checkout.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-display mb-2 text-3xl font-bold">
            Order Placed!
          </h1>
          <p className="mb-4 text-muted-foreground">
            Thank you for your purchase, {form.name}!
          </p>
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-display text-2xl font-bold text-primary">
              #{orderId.toString()}
            </p>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            A confirmation will be sent to <strong>{form.email}</strong>.
            Estimated delivery: 3–7 business days.
          </p>
          <Button
            className="w-full glow-primary"
            onClick={() => navigate({ to: "/" })}
            data-ocid="checkout.continue_shopping.button"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main
        className="container mx-auto px-4 py-16"
        data-ocid="checkout.empty_state"
      >
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display mb-2 text-2xl font-bold">
            Your cart is empty
          </h1>
          <p className="mb-6 text-muted-foreground">
            Add some products before checking out.
          </p>
          <Button
            onClick={() =>
              navigate({ to: "/products", search: { category: undefined } })
            }
            data-ocid="checkout.shop.button"
          >
            Shop Now
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="checkout.page">
      <button
        type="button"
        onClick={() =>
          navigate({ to: "/products", search: { category: undefined } })
        }
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="checkout.back.button"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </button>

      <h1 className="font-display mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              data-ocid="checkout.name.input"
            />
            {errors.name && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.name_error"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              data-ocid="checkout.email.input"
            />
            {errors.email && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.email_error"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address</Label>
            <Textarea
              id="address"
              name="address"
              autoComplete="street-address"
              placeholder={"123 Main St, Apt 4B\nNew York, NY 10001"}
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              data-ocid="checkout.address.textarea"
            />
            {errors.address && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.address_error"
              >
                {errors.address}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={placeOrder.isPending}
            className="w-full glow-primary"
            data-ocid="checkout.place_order.submit_button"
          >
            {placeOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                Order...
              </>
            ) : (
              `Place Order — $${totalAmount.toFixed(2)}`
            )}
          </Button>
        </form>

        <Card data-ocid="checkout.summary.card">
          <CardHeader>
            <CardTitle className="font-display">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li
                  key={item.id.toString()}
                  className="flex items-center gap-3"
                  data-ocid={`checkout.item.${idx + 1}`}
                >
                  <img
                    src={
                      item.imageUrl ||
                      `https://picsum.photos/seed/${item.id}/60/60`
                    }
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-400">
                {totalAmount >= 50 ? "Free" : "$4.99"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>Total</span>
              <span className="text-lg text-primary">
                $
                {(totalAmount < 50 ? totalAmount + 4.99 : totalAmount).toFixed(
                  2,
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
