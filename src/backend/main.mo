import Nat "mo:core/Nat";
import Float "mo:core/Float";
import List "mo:core/List";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    price : Float;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Text;
    items : [OrderItem];
    totalAmount : Float;
    status : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // State
  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product CRUD
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    let newProduct : Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    assert products.containsKey(product.id);
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort(); // implicitly uses Product.compare
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(func(p) { p.category == category });
    filtered.sort(); // implicitly uses Product.compare
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    let filtered = products.values().toArray().filter(func(p) { p.featured });
    filtered.sort(); // implicitly uses Product.compare
  };

  public query ({ caller }) func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(
    customerName : Text,
    customerEmail : Text,
    shippingAddress : Text,
    items : [OrderItem],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let id = nextOrderId;
    let totalAmount = items.foldLeft(
      0.0,
      func(acc, item) { acc + (item.price * item.quantity.toFloat()) },
    );
    let order : Order = {
      id;
      customerName;
      customerEmail;
      shippingAddress;
      items;
      totalAmount;
      status = "Pending";
      createdAt = Time.now();
    };
    orders.add(id, order);
    nextOrderId += 1;
    id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          order with
          status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray(); // cannot use .sort()
  };

  // Seed initial products
  let sampleElectronics = [
    {
      id = 0;
      name = "Smartphone";
      description = "Latest model with high-res camera";
      price = 799.99;
      category = "Phones";
      imageUrl = "phone.jpg";
      stock = 100;
      featured = true;
    },
    {
      id = 0;
      name = "Laptop";
      description = "High-performance laptop for work and play";
      price = 1299.99;
      category = "Computers";
      imageUrl = "laptop.jpg";
      stock = 50;
      featured = true;
    },
    {
      id = 0;
      name = "Tablet";
      description = "Lightweight tablet for on-the-go use";
      price = 499.99;
      category = "Tablets";
      imageUrl = "tablet.jpg";
      stock = 80;
      featured = false;
    },
    {
      id = 0;
      name = "Smartwatch";
      description = "Track your fitness and stay connected";
      price = 199.99;
      category = "Wearables";
      imageUrl = "smartwatch.jpg";
      stock = 120;
      featured = false;
    },
    {
      id = 0;
      name = "Bluetooth Speaker";
      description = "Portable speaker with great sound";
      price = 59.99;
      category = "Audio";
      imageUrl = "speaker.jpg";
      stock = 200;
      featured = true;
    },
    {
      id = 0;
      name = "Wireless Headphones";
      description = "Noise-cancelling over-ear headphones";
      price = 149.99;
      category = "Audio";
      imageUrl = "headphones.jpg";
      stock = 75;
      featured = false;
    },
    {
      id = 0;
      name = "Smart TV";
      description = "4K ultra HD smart television";
      price = 899.99;
      category = "TVs";
      imageUrl = "tv.jpg";
      stock = 30;
      featured = true;
    },
    {
      id = 0;
      name = "Gaming Console";
      description = "Next-gen gaming experience";
      price = 499.99;
      category = "Gaming";
      imageUrl = "console.jpg";
      stock = 40;
      featured = false;
    },
  ];
  // Initialize products on actor deploy
  for (product in sampleElectronics.values()) {
    let id = nextProductId;
    let newProduct : Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
  };
};
