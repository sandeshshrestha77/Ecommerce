"use client";

import { useState } from "react";
import { ShoppingCart, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const product = {
  name: "Limited Edition Mechanical Watch",
  price: 299,
  description: "Handcrafted timepiece with precision Japanese movement",
  features: [
    "Sapphire crystal glass",
    "316L stainless steel case",
    "Water resistant to 100m",
    "Genuine leather strap",
  ],
  images: [
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1200",
  ],
};

// Replace this with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSwMaX2Ixy_idN-8YeM0XUnz93GoCvAQ2BBqo3V5EfO2-pX1ChJWcdwe7IE_LjNv2H/exec";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("product", product.name);
      form.append("quantity", quantity.toString());
      form.append("totalPrice", (product.price * quantity).toString());
      form.append("orderDate", new Date().toISOString());

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Add this back as Google Scripts requires it
        body: form
      });

      // Since mode is no-cors, we won't get a proper response status
      // We'll assume success unless there's an error
      toast({
        title: "Order Submitted Successfully!",
        description: "We'll contact you soon with shipping details.",
      });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
      });
      setQuantity(1);
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Error Submitting Order",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={product.images[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-20 h-20 overflow-hidden rounded-md transition-all ${
                currentImage === index
                  ? "ring-2 ring-primary"
                  : "opacity-50 hover:opacity-75"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-3xl text-gray-900">${product.price}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Complete Your Purchase</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quantity</span>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>${product.price * quantity}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <p className="mt-8 text-lg text-gray-600">{product.description}</p>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <Package className="w-6 h-6 text-primary" />
                  <p className="text-gray-600">{feature}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}