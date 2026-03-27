import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, Shield, ShoppingCart, X, Zap } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Audio",
  "Gaming",
  "Accessories",
  "Cameras",
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">
            Tech<span className="text-gradient">Drop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-ocid="nav.home.link"
          >
            Home
          </Link>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-ocid="nav.products.link"
          >
            Products
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              data-ocid="nav.categories.dropdown_menu"
            >
              Categories <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() =>
                    navigate({ to: "/products", search: { category: cat } })
                  }
                  data-ocid={`nav.category.${cat.toLowerCase()}.link`}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsOpen(true)}
            data-ocid="nav.cart.button"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 md:flex"
              onClick={() => navigate({ to: "/admin" })}
              data-ocid="nav.admin.button"
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Button>
          )}

          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={() => clear()}
              data-ocid="nav.logout.button"
            >
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              className="hidden md:flex"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              data-ocid="nav.login.button"
            >
              Login
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile_menu.button"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              className="text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.mobile.home.link"
            >
              Home
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              className="text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.mobile.products.link"
            >
              Products
            </Link>
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                className="text-left text-sm text-muted-foreground"
                onClick={() => {
                  navigate({ to: "/products", search: { category: cat } });
                  setMobileOpen(false);
                }}
                data-ocid={`nav.mobile.${cat.toLowerCase()}.link`}
              >
                {cat}
              </button>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-primary"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.admin.link"
              >
                Admin Panel
              </Link>
            )}
            {isLoggedIn ? (
              <button
                type="button"
                className="text-left text-sm font-medium"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                data-ocid="nav.mobile.logout.button"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                className="text-left text-sm font-medium text-primary"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                data-ocid="nav.mobile.login.button"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
