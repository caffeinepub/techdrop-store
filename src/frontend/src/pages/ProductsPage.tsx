import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useQueries";
import { useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio",
  "Gaming",
  "Accessories",
  "Cameras",
];

const SKELETONS = [1, 2, 3, 4, 5, 6, 7, 8];

type SortOption = "default" | "price-asc" | "price-desc" | "featured";

export default function ProductsPage() {
  const search = useSearch({ from: "/products" }) as { category?: string };
  const [activeCategory, setActiveCategory] = useState<string>(
    search.category || "All",
  );
  const [sort, setSort] = useState<SortOption>("default");

  const { data: products, isLoading, isError } = useGetProducts();

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "featured")
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [products, activeCategory, sort]);

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="products.page">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">All Products</h1>
        <p className="mt-1 text-muted-foreground">
          Explore our full collection of electronics & gadgets
        </p>
      </div>

      <div
        className="mb-6 flex flex-wrap items-center gap-3"
        data-ocid="products.filter.tab"
      >
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" /> Filter:
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid={`products.filter.${cat.toLowerCase()}.tab`}
            >
              <Badge
                variant={activeCategory === cat ? "default" : "secondary"}
                className="cursor-pointer transition-all"
              >
                {cat}
              </Badge>
            </button>
          ))}
        </div>
        {activeCategory !== "All" && (
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="products.filter.clear.button"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
        <div className="ml-auto">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-44" data-ocid="products.sort.select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-ocid="products.loading_state"
        >
          {SKELETONS.map((n) => (
            <div
              key={n}
              className="overflow-hidden rounded-lg border border-border"
            >
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center"
          data-ocid="products.error_state"
        >
          <p className="text-destructive">
            Failed to load products. Please try again.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-border bg-card/50 p-12 text-center"
              data-ocid="products.empty_state"
            >
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveCategory("All")}
                data-ocid="products.show_all.button"
              >
                Show All
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <ProductCard product={product} index={i + 1} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}
