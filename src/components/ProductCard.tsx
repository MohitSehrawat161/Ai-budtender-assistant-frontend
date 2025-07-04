import React from 'react';
import {
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
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

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

export type Product = {
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

export default function ProductCard({ product }: { product: Product }) {
  const badgeStyle = getTypeBadgeStyle(product.type);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="group relative bg-white rounded-xl p-6 border border-[#F0F0F0] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer flex flex-col"
        >
          {/* Type Badge */}
          <div
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: badgeStyle.background, color: badgeStyle.color }}
          >
            {getTypeIcon(product.type)}
            <span>{product.type}</span>
          </div>
          {/* Product Name */}
          <h3 className="text-xl font-bold text-[#222] mb-2 group-hover:text-black transition-colors">
            {product.basicDescription}
          </h3>
          {/* Main Benefit */}
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#6B7A6B]" />
            <span className="text-sm text-[#6B7A6B] font-medium">{product.mainBenefit}</span>
          </div>
          {/* Other Benefits */}
          {product.otherBenefits && (
            <div className="mb-2">
              <span className="text-xs text-[#666]">Other: {product.otherBenefits}</span>
            </div>
          )}
          {/* Flavor */}
          {product.flavor && (
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span className="text-xs text-[#B8860B] bg-[#FFF7E0] rounded px-2 py-0.5">{product.flavor}</span>
            </div>
          )}
          {/* CBD/THC/Servings */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.cbdMg > 0 && (
              <div className="bg-[#F0F0F0] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#6B7A6B]">CBD</span>
                <div className="text-sm font-bold text-[#222]">{product.cbdMg}mg</div>
              </div>
            )}
            {product.thc > 0 && (
              <div className="bg-[#F0F0F0] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#8C5E18]">THC</span>
                <div className="text-sm font-bold text-[#222]">{product.thc}mg</div>
              </div>
            )}
            {product.servings && (
              <div className="bg-[#F0F0F0] px-3 py-1 rounded-lg">
                <span className="text-xs font-medium text-[#6B4FA1]">Servings</span>
                <div className="text-sm font-bold text-[#222]">{product.servings}</div>
              </div>
            )}
          </div>
          {/* Tags */}
          {product.tags && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-[#6B4FA1] mb-2 uppercase tracking-wide flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#6B4FA1]" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {product.tags.split(",").map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-[#F0F0F0] text-[#6B4FA1] rounded-lg text-xs font-medium border border-[#E5D4FF]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* View Details Button */}
          <button className="w-full cursor-pointer px-4 py-3 bg-gradient-to-r from-[#7a8f7a] to-[#4a614a] text-white rounded-xl font-medium shadow hover:shadow-lg transition-all duration-200 group-hover:scale-105 mt-auto">
            View Details
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20 p-0">
        <DialogHeader className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-[#c7d0c7]/30 p-6 rounded-t-3xl z-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 bg-gradient-to-r ${getBenefitColor(product.mainBenefit)} border`}>
                {getTypeIcon(product.type)}
                <span className="text-[#3c4a3c]">{product.type}</span>
              </div>
              <DialogTitle asChild>
                <h2 className="text-3xl font-bold text-[#323d32] mb-2">{product.basicDescription}</h2>
              </DialogTitle>
              <p className="text-[#7a8f7a]">
                {product.mainBenefit}
              </p>
            </div>
            <DialogClose asChild>
              <button
                className="p-2 rounded-full cursor-pointer bg-[#E5D4FF] hover:bg-[#D6E6FF] text-[#6B4FA1] transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {/* CBD/THC/Servings */}
          <div className="grid grid-cols-2 gap-4">
            {product.cbdMg > 0 && (
              <div className="bg-[#e3e7e3]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#c7d0c7]/30">
                <div className="text-sm font-medium text-[#5c735c] mb-1">CBD Content</div>
                <div className="text-2xl font-bold text-[#323d32]">{product.cbdMg}mg</div>
              </div>
            )}
            {product.thc > 0 && (
              <div className="bg-[#cdd5cd]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#a3b2a3]/30">
                <div className="text-sm font-medium text-[#7a8f7a] mb-1">THC Content</div>
                <div className="text-2xl font-bold text-[#323d32]">{product.thc}mg</div>
              </div>
            )}
            {product.servings && (
              <div className="bg-[#f6f7f6]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#e3e7e3]/30">
                <div className="text-sm font-medium text-[#7a8f7a] mb-1">Servings</div>
                <div className="text-2xl font-bold text-[#323d32]">{product.servings}</div>
              </div>
            )}
          </div>
          {/* Other Benefits */}
          {product.otherBenefits && (
            <div>
              <h3 className="text-lg font-semibold text-[#323d32] mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#5c735c]" />
                Other Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.otherBenefits.split(",").map((b: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-[#e6eae6]/80 text-[#5c735c] rounded-xl text-sm font-medium border border-[#cdd5cd]/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{b.trim()}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Flavor */}
          {product.flavor && (
            <div>
              <h3 className="text-lg font-semibold text-[#323d32] mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#a3b2a3]" />
                Flavor
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-2 bg-[#e6eae6]/80 text-[#7a8f7a] rounded-xl text-sm font-medium border border-[#cdd5cd]/30">
                  {product.flavor}
                </span>
              </div>
            </div>
          )}
          {/* Tags */}
          {product.tags && (
            <div>
              <h3 className="text-lg font-semibold text-[#323d32] mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-[#5c735c]" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.split(",").map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-[#e6eae6]/80 text-[#5c735c] rounded-xl text-sm font-medium border border-[#cdd5cd]/30"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* SKU */}
          <div className="flex items-center gap-2 pt-4">
            <Info className="w-5 h-5 text-[#7a8f7a]" />
            <span className="text-xs text-[#7a8f7a]">SKU: {product.sku}</span>
          </div>
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <button
                className="px-6 py-3 cursor-pointer bg-[#6B4FA1] text-white rounded-xl font-medium shadow hover:shadow-lg transition-all duration-200"
              >
                Close
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 