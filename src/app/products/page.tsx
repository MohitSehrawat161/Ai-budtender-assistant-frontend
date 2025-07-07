"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Heart,
  Droplet,
  Candy,
  Flower,
  Moon,
  Shield,
  Sparkles,
  Plus,
  Leaf,
  FlaskConical,
  Tag,
  Info,
} from "lucide-react";
import ProductCard from '@/components/ProductCard';
import { useGetProductsQuery } from '@/store/api/api';

type Product = {
  _id: string;
  mainBenefit: string;
  type: string;
  otherBenefits: string | null;
  flavor: string | null;
  cbdMg: number;
  thc: number;
  servings: number | null;
  basicDescription: string;
  tags: string | null;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const BENEFIT_OPTIONS = ["All", "Calm", "Relief", "Sleep", "Wellness"];
const TYPE_OPTIONS = ["All", "Drops", "Gummies", "Topical", "Softgel"];
const CONTENT_OPTIONS = ["All", "CBD", "THC", "Mushrooms"];

const getTypeBadgeStyle = (type: string) => {
  switch (type) {
    case "Drops":
      return { background: "#D6E6FF", color: "#2563EB" };
    case "Gummies":
      return { background: "#FFE5B4", color: "#B8860B" };
    case "Topical":
      return { background: "#E5D4FF", color: "#6B4FA1" };
    case "Softgel":
      return { background: "#D4FFE5", color: "#2E7D5B" };
    default:
      return { background: "#F0F0F0", color: "#666" };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Drops":
      return <Droplet className="w-4 h-4" style={{ color: "#2563EB" }} />;
    case "Gummies":
      return <Candy className="w-4 h-4" style={{ color: "#B8860B" }} />;
    case "Topical":
      return <Flower className="w-4 h-4" style={{ color: "#6B4FA1" }} />;
    case "Softgel":
      return <FlaskConical className="w-4 h-4" style={{ color: "#2E7D5B" }} />;
    default:
      return <Leaf className="w-4 h-4" style={{ color: "#666" }} />;
  }
};

const getBenefitColor = (benefit: string) => {
  switch (benefit) {
    case "Calm":
      return "from-[#e3e7e3] to-[#a3b2a3] border-[#c7d0c7]";
    case "Relief":
      return "from-[#cdd5cd] to-[#5c735c] border-[#a3b2a3]";
    case "Sleep":
      return "from-[#a3b2a3] to-[#7a8f7a] border-[#c7d0c7]";
    case "Wellness":
      return "from-[#e6eae6] to-[#7d957d] border-[#cdd5cd]";
    default:
      return "from-[#f6f7f6] to-[#e3e7e3] border-[#c7d0c7]";
  }
};

export default function ProductExplorer() {
  const [search, setSearch] = useState("");
  const [benefit, setBenefit] = useState("All");
  const [type, setType] = useState("All");
  const [content, setContent] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesName = (product.basicDescription || '').toLowerCase().includes(search.toLowerCase());
      const matchesBenefit = benefit === "All" || product.mainBenefit === benefit;
      const matchesType = type === "All" || product.type === type;
      const matchesContent =
        content === "All" ||
        (content === "CBD" && product.cbdMg > 0) ||
        (content === "THC" && product.thc > 0) ||
        (content === "Mushrooms" && product.tags && product.tags.toLowerCase().includes("mushroom"));
      return matchesName && matchesBenefit && matchesType && matchesContent;
    });
  }, [products, search, benefit, type, content]);

  const handleClear = () => {
    setSearch("");
    setBenefit("All");
    setType("All");
    setContent("All");
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-[#f4fbf0]">
      {/* Sticky Filter Bar */}
      <div
        className={`sticky top-18 z-10 transition-all duration-300 bg-white border-b border-black/10`}
        style={{ boxShadow: isScrolled ? "0 2px 12px 0 rgba(0,0,0,0.06)" : "0 1px 4px 0 rgba(0,0,0,0.03)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium mb-2 text-black">
                <Search className="w-4 h-4 inline mr-1" /> Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter product name..."
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200 text-[#222] placeholder-[#666]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Benefit
                </label>
                <select
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  className="px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200 text-[#222] min-w-32"
                >
                  {BENEFIT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200 text-[#222] min-w-32"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Content
                </label>
                <select
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200 text-[#222] min-w-32"
                >
                  {CONTENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-white border border-black/10 text-black rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Filter className="w-4 h-4 inline mr-2" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222] mb-4">
            Cannabis Product Explorer
          </h1>
          <p className="text-lg md:text-xl text-[#666] max-w-3xl mx-auto leading-relaxed">
            Discover premium cannabis products with detailed information about benefits, contents, and flavors. Find your perfect match from our curated collection.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-[#222]">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-[#B5C9B5]" />
              <span className="text-sm font-medium">{filteredProducts.length} Products Available</span>
            </div>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-2xl p-8 border border-[#F0F0F0] shadow-lg max-w-md mx-auto">
                <Leaf className="w-12 h-12 text-[#B5C9B5] mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-[#222] mb-2">Loading products...</h3>
                <p className="text-[#666] mb-4">Please wait while we fetch the latest products</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-2xl p-8 border border-[#F0F0F0] shadow-lg max-w-md mx-auto">
                <Leaf className="w-12 h-12 text-[#B5C9B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#222] mb-2">No products found</h3>
                <p className="text-[#666] mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-[#6B7A6B] hover:bg-[#485a48] text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredProducts.map((product: Product, idx: number) => (
              <ProductCard key={product._id || product.sku} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
