import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetOrders,
  useGetProducts,
  useIsAdmin,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Edit2,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

const CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Audio",
  "Gaming",
  "Accessories",
  "Cameras",
];
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

const defaultForm = (): Omit<Product, "id"> => ({
  name: "",
  description: "",
  price: 0,
  category: "Smartphones",
  imageUrl: "",
  stock: BigInt(0),
  featured: false,
});

export default function AdminPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(defaultForm());
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const isLoggedIn = loginStatus === "success" && !!identity;

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm(defaultForm());
    setProductDialog(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      featured: product.featured,
    });
    setProductDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ ...form, id: editingProduct.id });
        toast.success("Product updated");
      } else {
        await addProduct.mutateAsync({ ...form, id: BigInt(0) });
        toast.success("Product added");
      }
      setProductDialog(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (!isLoggedIn) {
    return (
      <main
        className="container mx-auto px-4 py-16"
        data-ocid="admin.login.page"
      >
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-display mb-2 text-3xl font-bold">Admin Panel</h1>
          <p className="mb-8 text-muted-foreground">
            Log in to manage products and orders.
          </p>
          <Button
            size="lg"
            className="w-full glow-primary"
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            data-ocid="admin.login.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Login to Continue"
            )}
          </Button>
        </div>
      </main>
    );
  }

  if (isCheckingAdmin) {
    return (
      <main
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="container mx-auto px-4 py-16"
        data-ocid="admin.unauthorized.page"
      >
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display mb-2 text-2xl font-bold">
            Access Denied
          </h1>
          <p className="mb-6 text-muted-foreground">
            You don't have admin permissions.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin.go_home.button"
          >
            Go Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8" data-ocid="admin.page">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your store products and orders
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6" data-ocid="admin.tabs">
          <TabsTrigger
            value="products"
            className="gap-2"
            data-ocid="admin.products.tab"
          >
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="gap-2"
            data-ocid="admin.orders.tab"
          >
            <ShoppingBag className="h-4 w-4" /> Orders
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Products</h2>
            <Button
              onClick={openAddDialog}
              className="gap-2"
              data-ocid="admin.add_product.button"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="admin.products.loading_state"
            >
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table data-ocid="admin.products.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product, idx) => (
                    <TableRow
                      key={product.id.toString()}
                      data-ocid={`admin.product.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock.toString()}</TableCell>
                      <TableCell>
                        {product.featured ? (
                          <Badge className="bg-primary/20 text-primary">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            data-ocid={`admin.product.edit_button.${idx + 1}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                            data-ocid={`admin.product.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!products || products.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="admin.products.empty_state"
                      >
                        No products yet. Add your first product.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <h2 className="font-display mb-4 text-xl font-semibold">Orders</h2>
          {ordersLoading ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="admin.orders.loading_state"
            >
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table data-ocid="admin.orders.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order, idx) => (
                    <TableRow
                      key={order.id.toString()}
                      data-ocid={`admin.order.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-sm">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.customerEmail}
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(s) => handleStatusChange(order.id, s)}
                        >
                          <SelectTrigger
                            className="w-36 h-8"
                            data-ocid={`admin.order.status.${idx + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="admin.orders.empty_state"
                      >
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent className="sm:max-w-lg" data-ocid="admin.product.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.product.name.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                data-ocid="admin.product.description.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-price">Price ($)</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  data-ocid="admin.product.price.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-stock">Stock</Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min="0"
                  value={form.stock.toString()}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stock: BigInt(Number.parseInt(e.target.value) || 0),
                    }))
                  }
                  data-ocid="admin.product.stock.input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger data-ocid="admin.product.category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="admin.product.image.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="prod-featured"
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                data-ocid="admin.product.featured.switch"
              />
              <Label htmlFor="prod-featured">Featured product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialog(false)}
              data-ocid="admin.product.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={addProduct.isPending || updateProduct.isPending}
              data-ocid="admin.product.dialog.save_button"
            >
              {addProduct.isPending || updateProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="admin.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.delete.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
