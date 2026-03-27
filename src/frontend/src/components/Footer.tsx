import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold">
                Tech<span className="text-gradient">Drop</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Next-gen gadgets and electronics, delivered fast to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/products"
                  search={{ category: undefined }}
                  className="transition-colors hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Smartphones" }}
                  className="transition-colors hover:text-foreground"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Laptops" }}
                  className="transition-colors hover:text-foreground"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Audio" }}
                  className="transition-colors hover:text-foreground"
                >
                  Audio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">More</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/products"
                  search={{ category: "Gaming" }}
                  className="transition-colors hover:text-foreground"
                >
                  Gaming
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Cameras" }}
                  className="transition-colors hover:text-foreground"
                >
                  Cameras
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Accessories" }}
                  className="transition-colors hover:text-foreground"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@techdrop.store</li>
              <li>Free shipping on orders $50+</li>
              <li>24/7 Customer Support</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
