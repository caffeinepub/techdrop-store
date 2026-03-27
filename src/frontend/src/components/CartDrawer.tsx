import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    totalAmount,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-3"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                navigate({ to: "/products", search: { category: undefined } });
              }}
              data-ocid="cart.continue_shopping.button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li
                    key={item.id.toString()}
                    className="flex gap-3"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    <img
                      src={
                        item.imageUrl ||
                        `https://picsum.photos/seed/${item.id}/80/80`
                      }
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium leading-tight">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-md border border-border">
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center hover:bg-muted/50 transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            data-ocid={`cart.qty_minus.${idx + 1}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center hover:bg-muted/50 transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            data-ocid={`cart.qty_plus.${idx + 1}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <Separator className="mb-4" />
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full glow-primary"
                onClick={handleCheckout}
                data-ocid="cart.checkout.button"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
