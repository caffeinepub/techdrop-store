import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addItem } = useCart();

  const imageUrl =
    product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl,
      stock: product.stock,
    });
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card"
      data-ocid={`product.item.${index}`}
    >
      <Link to="/products/$id" params={{ id: product.id.toString() }}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.featured && (
            <div className="absolute left-2 top-2">
              <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
                <Star className="h-3 w-3" /> Featured
              </Badge>
            </div>
          )}
          {Number(product.stock) === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to="/products/$id" params={{ id: product.id.toString() }}>
            <h3 className="font-display text-sm font-semibold leading-snug transition-colors hover:text-primary line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {product.category}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={Number(product.stock) === 0}
            className="gap-1.5"
            data-ocid={`product.add_to_cart.${index}`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
