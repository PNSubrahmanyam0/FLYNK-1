import React from 'react';
import { X, ShieldCheck, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { Product } from '../../types';

interface TaggedProductsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const TaggedProductsDrawer: React.FC<TaggedProductsDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
      <div className="flex-1" onClick={onClose} />

      <div className="bg-[#02060E]/95 border-t border-[#2B5C92]/40 rounded-t-3xl max-h-[75%] flex flex-col shadow-[0_-10px_40px_rgba(3,86,197,0.35)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2B5C92]/30 bg-[#0C1446]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0356C5]/20 border border-[#0356C5]/40 text-[#38bdf8] flex items-center justify-center shadow-[0_0_10px_rgba(3,86,197,0.3)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-['Syne']">Featured Gear & Apparel</h3>
              <p className="text-xs text-[#B3CDE0]">
                {products.length} creator item{products.length === 1 ? '' : 's'} · Escrow Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#02060E]/80 border border-[#2B5C92]/40 text-[#B3CDE0] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="overflow-y-auto p-4 space-y-3.5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#0C1446]/40 hover:bg-[#0C1446]/70 border border-[#2B5C92]/30 rounded-2xl p-3 flex gap-3.5 transition-all group backdrop-blur-md shadow-sm"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-20 h-20 rounded-xl object-cover border border-[#2B5C92]/40 shrink-0 cursor-pointer group-hover:opacity-90"
                onClick={() => onSelectProduct(product)}
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#38bdf8] font-semibold uppercase tracking-wider font-mono">
                      {product.category}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {product.rating}
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-semibold text-white truncate cursor-pointer hover:text-[#38bdf8] transition-colors mt-0.5 font-['Syne']"
                  >
                    {product.title}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-white font-mono tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#64748B] line-through font-mono tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold tabular-nums">
                      {product.discountPct}% off
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2B5C92]/30">
                  <div className="flex items-center gap-1 text-[10px] text-[#B3CDE0]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Protected Escrow</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-2.5 py-1 rounded-lg bg-[#0C1446]/80 hover:bg-[#0356C5]/30 border border-[#2B5C92]/40 text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      + Cart
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#0356C5] to-[#2B5C92] hover:opacity-90 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-[0_0_12px_rgba(3,86,197,0.4)] cursor-pointer"
                    >
                      View
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
