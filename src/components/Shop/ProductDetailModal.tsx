import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Share2,
  Check,
  TrendingUp,
  Store,
  Info,
  ChevronRight,
  ZoomIn,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts?: Product[];
  isOwner?: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onBuyNow: (product: Product, size?: string, color?: string) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenSellerProfile?: () => void;
  onPromoteProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts = [],
  isOwner = false,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onOpenSellerProfile,
  onPromoteProduct,
}) => {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.sizes?.[0] || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.colors?.[0]?.name || ''
  );
  const [pinCode, setPinCode] = useState('560038');
  const [pinChecked, setPinChecked] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [whyPromotionTooltip, setWhyPromotionTooltip] = useState<string | null>(null);

  // Products from this seller (Rule 87)
  const moreFromThisShop = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.sellerId === product.sellerId || p.sellerName === product.sellerName)
    )
    .slice(0, 4);

  // Similar products from other shops (Rule 95 & 96)
  const similarProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.sellerId !== product.sellerId &&
        p.category?.toLowerCase() === product.category?.toLowerCase()
    )
    .slice(0, 4);

  // Recommended products (Rule 97)
  const recommendedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans'] select-none">
      <div className="bg-[#101217] border border-[#292E38] rounded-t-[28px] sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* ================= TOP BAR ================= */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#292E38] bg-[#181B22]/90">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono uppercase bg-[#326BFF]/15 text-[#326BFF] font-bold px-2.5 py-0.5 rounded-full border border-[#326BFF]/30 truncate">
              {product.category}
            </span>
            <span className="text-xs text-[#A7ADB8] truncate">• Verified Listing</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Owner Promote shortcut (Rule 100) */}
            {isOwner && onPromoteProduct && (
              <button
                type="button"
                onClick={() => onPromoteProduct(product)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#326BFF] to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(50,107,255,0.4)] cursor-pointer hover:opacity-90"
                title="Launch self-service paid reach campaign"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Promote</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://flynk.app/p/${product.id}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 rounded-xl bg-[#101217] hover:bg-[#20242E] text-[#A7ADB8] hover:text-white border border-[#292E38] transition-colors cursor-pointer"
              title="Share Product"
            >
              {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#101217] hover:bg-[#20242E] text-[#A7ADB8] hover:text-white border border-[#292E38] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE BODY (Rule 149 Strict Sequence) ================= */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. PRODUCT CORE INFORMATION (Rule 75 & 149) */}
          <div className="space-y-3">
            {/* Gallery with zoom capability */}
            <div className="space-y-2">
              <div
                onClick={() => setIsZoomOpen(true)}
                className="aspect-square sm:aspect-video w-full rounded-2xl overflow-hidden bg-[#181B22] border border-[#292E38] relative flex items-center justify-center p-4 cursor-zoom-in group"
              >
                <img
                  src={product.images[activeImageIdx] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title}
                  className="w-full h-full object-contain drop-shadow-xl rounded-xl group-hover:scale-105 transition-transform"
                />

                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#101217]/90 backdrop-blur-md text-[10px] font-semibold text-[#326BFF] flex items-center gap-1 border border-[#292E38]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#326BFF]" />
                  <span>FLYNK Escrow Protected</span>
                </div>
              </div>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#181B22] shrink-0 cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#326BFF] scale-105 shadow-[0_0_12px_rgba(50,107,255,0.4)]'
                          : 'border-[#292E38] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title, Pricing & Stock Status */}
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug font-['Syne']">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#707681] line-through font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPct && (
                  <span className="text-xs bg-[#326BFF] text-white px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                    {product.discountPct}% OFF
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="text-xs bg-[#FF3D52]/20 text-[#FF3D52] border border-[#FF3D52]/40 px-2 py-0.5 rounded-full font-bold font-mono ml-auto">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-xs text-[#22C55E] font-medium ml-auto flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    In Stock
                  </span>
                )}
              </div>

              {/* Rating & Order Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#292E38] text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-[#A7ADB8] font-normal">
                    ({product.reviewsCount || product.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className="text-[#F7F8FA] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#326BFF]" />
                  <span>{(product.deliveredOrdersCount || 142).toLocaleString()} successfully delivered</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 text-xs text-[#A7ADB8] leading-relaxed space-y-1">
              <p>{product.description}</p>
              {product.returnPolicy && (
                <div className="text-[11px] text-[#707681] flex items-center gap-1 pt-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{product.returnPolicy}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. VARIANTS & PURCHASE CTA (Rule 149: #2) */}
          <div className="p-4 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-3.5">
            {/* Sizes */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Select Size: <span className="text-[#326BFF]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#326BFF] text-white shadow-[0_0_12px_rgba(50,107,255,0.4)]'
                          : 'bg-[#101217] text-[#A7ADB8] hover:text-white border border-[#292E38]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Select Color: <span className="text-[#326BFF]">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#326BFF] bg-[#326BFF]/20 text-white'
                          : 'border-[#292E38] bg-[#101217] text-[#A7ADB8]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery PIN Code */}
            <div className="pt-2 border-t border-[#292E38] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#326BFF]" />
                  <span>Delivery Check</span>
                </span>
                {pinChecked && (
                  <span className="text-[11px] text-[#22C55E] font-medium">
                    Ships in {product.shippingDays || 2} days • Cash on Delivery & UPI
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    setPinChecked(true);
                  }}
                  maxLength={6}
                  className="w-28 bg-[#101217] border border-[#292E38] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#326BFF]"
                />
                <span className="text-[11px] text-[#A7ADB8] self-center">
                  Estimated arrival in 2–3 business days via Bluedart
                </span>
              </div>
            </div>
          </div>

          {/* 3. SELLER CARD (Rule 74 & 149: #3) */}
          <div className="p-4 rounded-2xl bg-[#181B22] border border-[#292E38] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* 88dp rounded square logo thumbnail */}
              <div className="w-12 h-12 rounded-[14px] bg-[#101217] border border-[#292E38] overflow-hidden flex items-center justify-center shrink-0">
                {product.sellerAvatar ? (
                  <img src={product.sellerAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-[#326BFF]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {product.sellerName}
                  </span>
                  {product.sellerVerified && (
                    <span className="text-[10px] bg-[#326BFF]/20 text-[#326BFF] px-1.5 py-0.2 rounded font-semibold border border-[#326BFF]/30">
                      Verified Seller ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#A7ADB8] truncate mt-0.5">
                  98.4% On-Time Delivery • Escrow Certified Atelier
                </p>
              </div>
            </div>

            {/* Rule 74: Tap -> Shop Page */}
            {onOpenSellerProfile && (
              <button
                type="button"
                onClick={onOpenSellerProfile}
                className="px-3 py-2 rounded-xl bg-[#101217] hover:bg-[#20242E] text-[#326BFF] border border-[#292E38] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <span>Visit Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4. VERIFIED BUYER REVIEWS (Rule 91-94 & 149: #4) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Verified Buyer Reviews ({product.reviews?.length || 0})
              </h3>
              <span className="text-[11px] text-[#326BFF] font-medium">
                Verified Purchases Only
              </span>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-2.5">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.authorAvatar}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border border-[#292E38]"
                        />
                        <span className="font-semibold text-white">{rev.authorName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[9px] bg-[#22C55E]/15 text-[#22C55E] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5 border border-[#22C55E]/30">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#707681]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-[#F7F8FA]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#181B22] border border-[#292E38] text-center text-xs text-[#A7ADB8]">
                Be the first verified customer to leave a review after escrow delivery confirmation!
              </div>
            )}
          </div>

          {/* 5. MORE FROM THIS SHOP (Rule 87 & 149: #5 - Prioritizes current seller!) */}
          {moreFromThisShop.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    More From {product.sellerName}
                  </h3>
                  <p className="text-[11px] text-[#A7ADB8]">Curated catalog from this seller</p>
                </div>
                {onOpenSellerProfile && (
                  <button
                    type="button"
                    onClick={onOpenSellerProfile}
                    className="text-xs text-[#326BFF] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {moreFromThisShop.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct?.(item)}
                    className="p-2.5 rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/50 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#101217] mb-2">
                      <img
                        src={item.images[0]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-xs font-mono font-bold text-[#326BFF] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. SIMILAR PRODUCTS FROM OTHER SHOPS (Rule 95, 96, 149: #6 - Clearly separated!) */}
          {similarProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>Similar Products</span>
                    <span className="text-[10px] text-[#A7ADB8] font-normal font-sans">(Other Sellers)</span>
                  </h3>
                  <p className="text-[11px] text-[#A7ADB8]">
                    Explore comparable {product.category} selections across FLYNK
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {similarProducts.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct?.(item)}
                    className="p-2.5 rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/50 transition-all cursor-pointer group relative"
                  >
                    {/* Simulated Promoted Placement tag (Rule 99 & 115) */}
                    {idx === 0 && (
                      <span className="absolute top-4 left-4 z-10 text-[9px] font-mono font-bold bg-black/80 text-[#F59E0B] px-1.5 py-0.2 rounded border border-[#F59E0B]/40">
                        Promoted
                      </span>
                    )}

                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#101217] mb-2">
                      <img
                        src={item.images[0]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-[11px] text-[#A7ADB8] truncate mt-0.5">By {item.sellerName}</div>
                    <div className="text-xs font-mono font-bold text-white mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. RECOMMENDED FOR YOU (Rule 97, 98, 149: #7) */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Recommended For You
                  </h3>
                  <p className="text-[11px] text-[#A7ADB8]">Based on your interests and recent views</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setWhyPromotionTooltip(
                      whyPromotionTooltip ? null : 'Recommendations are generated using privacy-safe signals like category views and saved items.'
                    )
                  }
                  className="text-[#707681] hover:text-white p-1"
                  title="Why am I seeing these recommendations?"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {whyPromotionTooltip && (
                <div className="p-2.5 rounded-xl bg-[#181B22] border border-[#292E38] text-[11px] text-[#A7ADB8] flex items-center justify-between">
                  <span>{whyPromotionTooltip}</span>
                  <button
                    type="button"
                    onClick={() => setWhyPromotionTooltip(null)}
                    className="text-[#707681] hover:text-white ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {recommendedProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct?.(item)}
                    className="p-2.5 rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/50 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#101217] mb-2">
                      <img
                        src={item.images[0]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-xs font-mono font-bold text-[#326BFF] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= STICKY ACTION FOOTER (Rule 75) ================= */}
        <div className="p-4 border-t border-[#292E38] bg-[#181B22] flex items-center gap-3">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product, selectedSize, selectedColor)}
            className="flex-1 py-3 rounded-2xl bg-[#101217] hover:bg-[#20242E] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#292E38] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4 text-[#326BFF]" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onBuyNow(product, selectedSize, selectedColor)}
            className="flex-1 py-3 rounded-2xl bg-[#326BFF] hover:bg-[#2558E8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_25px_rgba(50,107,255,0.4)] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <span>{isOutOfStock ? 'Out of Stock' : `Buy Now (₹${product.price.toLocaleString('en-IN')})`}</span>
            {!isOutOfStock && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal (Rule 76) */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={product.images[activeImageIdx]}
            alt=""
            className="max-w-full max-h-[90vh] object-contain drop-shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
