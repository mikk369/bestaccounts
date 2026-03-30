"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  sku: string;
  featured: number;
  created_at: string;
}

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "General",
  stock: "1",
  sku: "",
  featured: false,
  image_url: "",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      sku: product.sku,
      featured: Boolean(product.featured),
      image_url: product.image_url,
    });
    setEditingId(product.id);
    setImageFile(null);
    setImagePreview(product.image_url || "");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        sku: form.sku,
        featured: form.featured,
        image_url: form.image_url,
      };

      let productId = editingId;

      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        productId = data.id;
      }

      // Upload image if selected
      if (imageFile && productId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await fetch(`/api/products/${productId}/image`, {
          method: "POST",
          body: formData,
        });
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview("");
      await fetchProducts();
    } catch {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-muted">{products.length} products in your store</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-20">
          <div className="w-full max-w-lg rounded-xl border border-card-border bg-background p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId ? "Edit Product" : "New Product"}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-card-bg"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Product Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent"
                />
                {imagePreview && (
                  <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border border-card-border">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="128px" />
                  </div>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-card-border accent-accent"
                />
                <span className="text-sm text-muted">Featured product</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-card-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-card-bg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-card-border bg-card-bg py-20 text-center">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4 text-muted">
            <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="mb-2 text-muted">No products yet</p>
          <button onClick={openNewForm} className="text-sm font-medium text-accent hover:text-accent-hover">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-card-border bg-card-bg text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-card-bg/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-card-border bg-input-bg">
                        {product.image_url ? (
                          <Image src={product.image_url} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted">N/A</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.title}</p>
                        {product.sku && <p className="text-xs text-muted">{product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-accent">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                        <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditForm(product)}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-card-bg hover:text-accent"
                        title="Edit"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        title="Delete"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
