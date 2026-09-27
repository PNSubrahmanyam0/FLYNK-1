import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Film,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Search,
  ShoppingCart,
  Check,
  Shield,
  Tag,
} from 'lucide-react';
import { User, Product, ShortVideo, LongVideo, Order } from '../../types';
import { FlynkLogo } from '../Common/FlynkLogo';

interface StorefrontViewProps {
  creator: User;
  products: Product[];
  shorts: ShortVideo[];
  longVideos: LongVideo[];
  isOwner?: boolean;
  orders?: Order[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectShort: (short: ShortVideo) => void;
  onSelectLongVideo: (longVideo: LongVideo) => void;
  onStartChat: (creator: User) => void;
  onBackToShorts: () => void;
  onPromoteProduct?: (product: Product) => void;
  onOpenOrders?: () => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  creator,
  products,
  shorts,
  longVideos,
  isOwner = false,
  orders = [],
  onSelectProduct,
  onAddToCart,
  onSelectShort,
  onSelectLongVideo,
  onStartChat,
  onBackToShorts,
  onPromoteProduct,
  onOpenOrders,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'shorts' | 'long' | 'collections' | 'frames'>('shop');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter products for this creator or catalog
  const creatorProducts = products.filter(
    (p) => p.sellerId === creator.id || p.sellerHandle === creator.handle || p.sellerName === creator.name
  );
  const displayProducts = creatorProducts.length > 0 ? creatorProducts : products;

  // Search & category filter
  const filteredProducts = displayProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.deliveredOrdersCount - a.deliveredOrdersCount;
  });

  const categories = ['all', ...Array.from(new Set(displayProducts.map((p) => p.category.toLowerCase())))];

  // Filter videos for this creator
  const creatorShorts = shorts.filter((s) => s.creatorId === creator.id);
  const creatorLongVideos = longVideos.filter((v) => v.creatorId === creator.id);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="w-full h-full bg-[#02060E] flex flex-col text-[#F0F6FC] overflow-y-auto font-['Plus_Jakarta_Sans'] relative starry-grid-bg">
      {/* Ambient Starry Night & Midnight Blue lighting nodes */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-[#0356C5]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[350px] bg-[#0C1446]/60 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-0 w-[350px] h-[350px] bg-[#2B5C92]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Top sticky bar in Midnight Blue theme */}
      <div className="sticky top-0 z-30 bg-[#02060E]/90 backdrop-blur-2xl px-4 py-3 flex items-center justify-between border-b border-[#2B5C92]/30 shadow-[0_4px_25px_rgba(2,6,14,0.7)]">
        <button
          onClick={onBackToShorts}
          className="text-xs text-[#B3CDE0] hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>← Back to Video Feed</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0356C5] shadow-[0_0_8px_#0356C5] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
            Creator Store
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartChat(creator)}
            className="p-2 rounded-xl bg-[#0C1446]/80 hover:bg-[#0356C5]/30 text-[#B3CDE0] hover:text-white border border-[#2B5C92]/40 transition-all shadow-[0_0_15px_rgba(3,86,197,0.25)] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Encrypted Chat with Creator"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>

      {/* Creator Store Banner with Midnight Blue / Starry Night aesthetic */}
      <div className="relative h-40 sm:h-48 w-full bg-gradient-to-r from-[#0C1446] via-[#12285e] to-[#02060E] overflow-hidden border-b border-[#2B5C92]/30">
        <div className="absolute inset-0 bg-[#02060E]/50 backdrop-blur-[1px]" />

        {/* Ambient orbital decoration matching Starry Night reference */}
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full blur-3xl opacity-40 bg-[#0356C5]" />
        <div className="absolute left-1/3 bottom-0 w-40 h-40 rounded-full blur-2xl opacity-25 bg-[#B3CDE0]" />

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
          <div className="flex items-end gap-3.5">
            {/* Rule 81: Shop logo 88dp rounded square with 20dp corner radius */}
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-[88px] h-[88px] rounded-[20px] object-cover border-2 border-[#326BFF] shadow-[0_0_25px_rgba(50,107,255,0.4)]"
              />
              {creator.verifiedSeller && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#326BFF] text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#02060E] shadow-[0_0_10px_#326BFF]">
                  ✓
                </span>
              )}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-bold text-white drop-shadow font-['Syne']">
                  {creator.name}
                </h1>
                {creator.role === 'business' && (
                  <span className="text-[10px] bg-[#326BFF]/30 text-[#B3CDE0] font-semibold px-2 py-0.2 rounded-full border border-[#326BFF]/50 font-mono">
                    Official Brand
                  </span>
                )}
              </div>
              <p className="text-xs text-[#B3CDE0] font-mono mt-0.5">@{creator.handle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && onPromoteProduct && displayProducts.length > 0 && (
              <button
                type="button"
                onClick={() => onPromoteProduct(displayProducts[0])}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#326BFF] to-[#8B5CF6] hover:opacity-95 text-white shadow-[0_0_20px_rgba(50,107,255,0.5)] border border-[#326BFF]/40 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Promote Products</span>
              </button>
            )}
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isFollowing
                  ? 'bg-[#0C1446]/80 text-[#B3CDE0] hover:bg-[#0C1446] border border-[#2B5C92]/50'
                  : 'bg-gradient-to-r from-[#0356C5] to-[#2B5C92] hover:opacity-95 text-white shadow-[0_0_20px_rgba(3,86,197,0.55)] border border-[#B3CDE0]/40'
              }`}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* Verified Trust Metrics Ribbon in Midnight Blue */}
      {creator.trustMetrics && (
        <div className="bg-[#0C1446]/40 border-b border-[#2B5C92]/25 px-4 py-3 backdrop-blur-md">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[#02060E]/70 border border-[#2B5C92]/30">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{creator.trustMetrics.rating}</span>
              </div>
              <span className="text-[10px] text-[#B3CDE0] block mt-0.5">Rating</span>
            </div>

            <div className="p-2 rounded-xl bg-[#02060E]/70 border border-[#2B5C92]/30">
              <div className="text-xs font-bold text-[#38bdf8] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{creator.trustMetrics.deliveredOrders.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-[#B3CDE0] block mt-0.5">Delivered</span>
            </div>

            <div className="p-2 rounded-xl bg-[#02060E]/70 border border-[#2B5C92]/30">
              <div className="text-xs font-bold text-white font-mono">
                {creator.trustMetrics.deliverySuccessRate}%
              </div>
              <span className="text-[10px] text-[#B3CDE0] block mt-0.5">Fulfillment</span>
            </div>

            <div className="p-2 rounded-xl bg-[#02060E]/70 border border-[#2B5C92]/30">
              <div className="text-xs font-bold text-[#38bdf8] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#38bdf8]" />
                <span>Escrow</span>
              </div>
              <span className="text-[10px] text-[#B3CDE0] block mt-0.5">Protected</span>
            </div>
          </div>
        </div>
      )}

      {/* Bio & Details */}
      <div className="px-4 py-2.5 border-b border-[#2B5C92]/20 text-xs bg-[#02060E]/60">
        <p className="text-[#E2E8F0] leading-relaxed">{creator.bio}</p>
        <div className="flex items-center gap-4 mt-2 text-[#94A3B8] text-[11px]">
          <span>
            <strong className="text-white">{(creator.followersCount / 1000).toFixed(1)}k</strong> Followers
          </span>
          <span>
            <strong className="text-white">{creator.followingCount}</strong> Following
          </span>
          {creator.location && <span>📍 {creator.location}</span>}
        </div>
      </div>

      {/* Private Customer Previous Orders with this Shop (Rules 88, 89, 150) */}
      {!isOwner && (
        (() => {
          const shopOrders = (orders || []).filter((ord) =>
            ord.items?.some(
              (it) => it.product?.sellerId === creator.id || it.product?.sellerHandle === creator.handle
            )
          );
          if (shopOrders.length === 0) return null;
          return (
            <div className="mx-4 my-3 p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-2.5 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 font-['Syne']">
                  <ShoppingBag className="w-4 h-4 text-[#326BFF]" />
                  <span>Your Previous Orders with {creator.name}</span>
                </span>
                <span className="text-[10px] text-[#22C55E] font-medium font-mono">
                  {shopOrders.length} order{shopOrders.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2">
                {shopOrders.map((ord) => {
                  const firstItem = ord.items?.[0];
                  const itemProduct = firstItem?.product;
                  return (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-[#101217] border border-[#292E38] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={itemProduct?.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-[#292E38] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{itemProduct?.title || 'Purchased Item'}</div>
                          <div className="text-[11px] text-[#A7ADB8] font-mono mt-0.5">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')} • {ord.deliveryStatus?.toUpperCase()} • {ord.createdAt}
                          </div>
                        </div>
                      </div>

                      {/* Buy Again (Rule 90: opens live product detail to check current price/stock) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (itemProduct) onSelectProduct(itemProduct);
                          else if (displayProducts[0]) onSelectProduct(displayProducts[0]);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#326BFF] hover:bg-[#2558E8] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Buy Again
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      )}

      {/* Search Bar matching Rule 147 ("Search this Shop") */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="relative flex items-center rounded-2xl bg-[#0C1446]/70 border border-[#2B5C92]/40 px-3.5 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus-within:border-[#0356C5] focus-within:ring-2 focus-within:ring-[#0356C5]/30 transition-all">
          <Search className="w-4 h-4 text-[#B3CDE0] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${creator.name} products...`}
            className="w-full bg-transparent text-xs text-white placeholder:text-[#94A3B8] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-[#B3CDE0] hover:text-white px-1.5 py-0.5 rounded bg-[#02060E]/80"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#0356C5] to-[#2B5C92] text-white shadow-[0_0_12px_rgba(3,86,197,0.4)] border border-[#B3CDE0]/40'
                  : 'bg-[#0C1446]/50 text-[#B3CDE0] hover:text-white border border-[#2B5C92]/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Store Navigation Tabs per Rule 82: Products (default), Collections, Flicks, Frames */}
      <div className="sticky top-12 z-20 bg-[#02060E]/95 backdrop-blur-2xl px-4 border-b border-[#2B5C92]/30 flex justify-between items-center shadow-sm">
        <div className="flex">
          <button
            onClick={() => setActiveTab('shop')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shop'
                ? 'border-[#0356C5] text-[#38bdf8]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products</span>
            <span className="text-[10px] bg-[#0C1446] text-[#B3CDE0] border border-[#2B5C92]/40 px-1.5 py-0.2 rounded-full font-mono">
              {displayProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'collections'
                ? 'border-[#0356C5] text-[#38bdf8]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Collections</span>
          </button>

          <button
            onClick={() => setActiveTab('shorts')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shorts'
                ? 'border-[#0356C5] text-[#38bdf8]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Flicks</span>
            <span className="text-[10px] bg-[#0C1446] text-[#B3CDE0] border border-[#2B5C92]/40 px-1.5 py-0.2 rounded-full font-mono">
              {creatorShorts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('long')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'long'
                ? 'border-[#0356C5] text-[#38bdf8]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Videos</span>
            <span className="text-[10px] bg-[#0C1446] text-[#B3CDE0] border border-[#2B5C92]/40 px-1.5 py-0.2 rounded-full font-mono">
              {creatorLongVideos.length}
            </span>
          </button>
        </div>

        {activeTab === 'shop' && (
          <div className="flex items-center gap-1 text-[11px] text-[#B3CDE0]">
            <SlidersHorizontal className="w-3 h-3 text-[#38bdf8]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0C1446]/80 border border-[#2B5C92]/40 rounded-lg px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#0356C5] cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <div className="p-4 pb-12 flex-1">
        {/* TAB 1: Store Products matching Image 3 (Devicer PK clean 2-column cards with blue cart action) */}
        {activeTab === 'shop' && (
          <div className="space-y-4">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5">
                {sortedProducts.map((product) => {
                  const isJustAdded = addedProductId === product.id;
                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="bg-gradient-to-b from-[#0C1446]/80 via-[#0A1238]/90 to-[#02060E]/95 rounded-2xl overflow-hidden border border-[#2B5C92]/35 hover:border-[#0356C5]/70 transition-all flex flex-col justify-between group cursor-pointer shadow-[0_8px_25px_rgba(2,6,14,0.5)] backdrop-blur-xl"
                    >
                      <div>
                        {/* Product Image with soft blue studio lighting inspired by Image 3 */}
                        <div className="relative aspect-square w-full bg-gradient-to-b from-[#132766]/30 to-[#0C1446]/60 overflow-hidden p-2 flex items-center justify-center">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md rounded-xl"
                          />

                          {/* Escrow badge */}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-[#02060E]/85 backdrop-blur-md text-[9px] font-bold text-[#38bdf8] flex items-center gap-0.5 border border-[#2B5C92]/40">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Escrow
                          </span>

                          {/* Discount tag in electric blue */}
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#0356C5] to-[#2B5C92] text-white font-bold text-[9px] shadow-[0_0_8px_rgba(3,86,197,0.5)]">
                            {product.discountPct}% OFF
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                            <span className="uppercase font-semibold text-[#38bdf8] font-mono">
                              {product.category}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {product.rating}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-white line-clamp-2 mt-1 leading-snug group-hover:text-[#B3CDE0] transition-colors font-['Syne']">
                            {product.title}
                          </h3>

                          <p className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
                            {product.description.slice(0, 36)}...
                          </p>

                          <div className="flex items-baseline gap-1.5 mt-2">
                            <span className="text-sm font-black text-white font-mono">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-[#64748B] line-through font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Blue Circular Cart Button matching Image 3 */}
                      <div className="px-3 pb-3 pt-0 flex items-center justify-between border-t border-[#2B5C92]/20">
                        <span className="text-[10px] text-[#B3CDE0] font-mono">
                          {product.shippingDays}d Express
                        </span>

                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            isJustAdded
                              ? 'bg-emerald-500 text-black font-bold scale-110'
                              : 'bg-gradient-to-r from-[#0356C5] to-[#2B5C92] hover:from-[#2B5C92] hover:to-[#0356C5] text-white shadow-[0_2px_12px_rgba(3,86,197,0.5)] active:scale-95'
                          }`}
                          title="Add to Cart"
                        >
                          {isJustAdded ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#0C1446]/40 rounded-2xl border border-[#2B5C92]/30 text-[#B3CDE0] text-xs">
                No products found matching "{searchQuery}".
              </div>
            )}

            {/* TRUST BANNER AT BOTTOM (Matching Image 3 "Devicer PK" footer card) */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#0356C5] via-[#2B5C92] to-[#0C1446] border border-[#B3CDE0]/40 shadow-[0_8px_30px_rgba(3,86,197,0.35)] flex items-center gap-3.5 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                  Premium Tech & Apparel. Trusted Service.
                </h4>
                <p className="text-[11px] text-[#B3CDE0] leading-snug mt-0.5">
                  Dual-verification Escrow release. Genuine creator merch with 7-day verified return guarantee.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Shorts by this Creator */}
        {activeTab === 'shorts' && (
          <div className="space-y-3">
            {creatorShorts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {creatorShorts.map((short) => (
                  <div
                    key={short.id}
                    onClick={() => onSelectShort(short)}
                    className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-[#2B5C92]/30 group cursor-pointer shadow-md"
                  >
                    <img
                      src={short.thumbnailUrl}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                      <h4
                        className="text-xs font-bold text-white truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full"
                        title={short.title}
                      >
                        {short.title}
                      </h4>
                      <span className="text-[10px] text-[#B3CDE0] mt-1 font-mono">
                        {(short.likesCount / 1000).toFixed(1)}k likes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#0C1446]/40 rounded-2xl border border-[#2B5C92]/30 text-[#B3CDE0] text-xs">
                No short trailers uploaded by this creator yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Full Length Videos */}
        {activeTab === 'long' && (
          <div className="space-y-3">
            {creatorLongVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creatorLongVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onSelectLongVideo(video)}
                    className="rounded-2xl overflow-hidden bg-[#0C1446]/60 border border-[#2B5C92]/30 group cursor-pointer shadow-md"
                  >
                    <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] font-bold text-white">
                        {video.durationFormatted}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4
                        className="text-xs font-bold text-white truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full"
                        title={video.title}
                      >
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-1">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#0C1446]/40 rounded-2xl border border-[#2B5C92]/30 text-[#B3CDE0] text-xs">
                No full-length videos published yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
