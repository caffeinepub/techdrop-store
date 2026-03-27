import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useGetProductById } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = BigInt(id);
  const { data: product, isLoading, isError } = useGetProductById(productId);

  const imageUrl =
    product?.imageUrl || `https://picsum.photos/seed/${id}/800/600`;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl,
        stock: product.stock,
      });
    }
  };

  if (isLoading) {
    return (
      <main
        className="container mx-auto px-4 py-8"
        data-ocid="product_detail.loading_state"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main
        className="container mx-auto px-4 py-8"
        data-ocid="product_detail.error_state"
      >
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-destructive">Product not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              navigate({ to: "/products", search: { category: undefined } })
            }
            data-ocid="product_detail.back.button"
          >
            Back to Products
          </Button>
        </div>
      </main>
    );
  }

  const inStock = Number(product.stock) > 0;

  return (
    <main
      className="container mx-auto px-4 py-8"
      data-ocid="product_detail.page"
    >
      <button
        type="button"
        onClick={() =>
          navigate({ to: "/products", search: { category: undefined } })
        }
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="product_detail.back.button"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-lg border border-border"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.featured && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" /> {product.category}
              </Badge>
              {inStock ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-green-500/30 text-green-400"
                >
                  <Package className="h-3 w-3" /> In Stock (
                  {product.stock.toString()})
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="text-4xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>

          <Separator />

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Qty:</span>
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center hover:bg-muted/50 transition-colors"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  data-ocid="product_detail.qty_minus.button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setQuantity((q) => Math.min(q + 1, Number(product.stock)))
                  }
                  disabled={quantity >= Number(product.stock)}
                  data-ocid="product_detail.qty_plus.button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="glow-primary gap-2 text-base"
            data-ocid="product_detail.add_to_cart.primary_button"
          >
            <ShoppingCart className="h-5 w-5" />
            {inStock
              ? `Add ${quantity > 1 ? `${quantity}x` : ""} to Cart`
              : "Out of Stock"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Free shipping on orders over $50 • 30-day return policy
          </p>
        </motion.div>
      </div>
    </main>
  );
}
