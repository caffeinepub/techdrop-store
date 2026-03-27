import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeaturedProducts } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Headphones, Shield, Truck, Zap } from "lucide-react";
import { motion } from "motion/react";

const CATEGORIES = [
  {
    name: "Smartphones",
    image: "/assets/generated/product-smartphone.dim_400x300.jpg",
    color: "from-blue-900/40",
  },
  {
    name: "Laptops",
    image: "/assets/generated/product-laptop.dim_400x300.jpg",
    color: "from-indigo-900/40",
  },
  {
    name: "Audio",
    image: "/assets/generated/product-headphones.dim_400x300.jpg",
    color: "from-purple-900/40",
  },
  {
    name: "Gaming",
    image: "/assets/generated/product-gaming.dim_400x300.jpg",
    color: "from-green-900/40",
  },
  {
    name: "Accessories",
    image: "/assets/generated/product-accessories.dim_400x300.jpg",
    color: "from-yellow-900/40",
  },
  {
    name: "Cameras",
    image: "/assets/generated/product-camera.dim_400x300.jpg",
    color: "from-red-900/40",
  },
];

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free delivery on orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "100% protected transactions",
  },
  { icon: Zap, title: "Latest Tech", desc: "Always cutting-edge products" },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round the clock assistance",
  },
];

const FEATURED_SKELETONS = [1, 2, 3, 4];

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();
  const navigate = useNavigate();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" data-ocid="hero.section">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1600x600.jpg')",
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" /> New arrivals just dropped
            </div>
            <h1 className="font-display mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Next-Gen Gadgets,
              <br />
              <span className="text-gradient">Delivered Fast</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
              Discover the latest electronics and tech gadgets at unbeatable
              prices. Premium quality, fast shipping, backed by our 30-day
              guarantee.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="glow-primary gap-2"
                onClick={() =>
                  navigate({ to: "/products", search: { category: undefined } })
                }
                data-ocid="hero.shop_now.primary_button"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/products",
                    search: { category: "featured" },
                  })
                }
                data-ocid="hero.featured.secondary_button"
              >
                View Featured
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        className="border-b border-border bg-card/50"
        data-ocid="features.section"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feat.title}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="container mx-auto px-4 py-12"
        data-ocid="featured.section"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-muted-foreground">
              Hand-picked top picks just for you
            </p>
          </div>
          <Link
            to="/products"
            search={{ category: undefined }}
            data-ocid="featured.view_all.link"
          >
            <Button variant="outline" className="gap-1.5">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            data-ocid="featured.loading_state"
          >
            {FEATURED_SKELETONS.map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-lg border border-border"
              >
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <ProductCard product={product} index={i + 1} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            data-ocid="featured.empty_state"
            className="rounded-lg border border-border bg-card/50 p-12 text-center"
          >
            <p className="text-muted-foreground">No featured products yet.</p>
          </div>
        )}
      </section>

      {/* Category Grid */}
      <section
        className="container mx-auto px-4 pb-12"
        data-ocid="categories.section"
      >
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-1 text-muted-foreground">
            Find what you're looking for
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to="/products"
                search={{ category: cat.name }}
                className="group relative block overflow-hidden rounded-lg border border-border"
                data-ocid={`categories.${cat.name.toLowerCase()}.link`}
              >
                <div className="aspect-video">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`}
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="font-display font-bold text-white">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
