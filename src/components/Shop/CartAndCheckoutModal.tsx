import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  QrCode,
  Truck,
  Building2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, PaymentMethod, User } from '../../types';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: User;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderCreated: (order: Order) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCreated,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address
  const [name, setName] = useState(currentUser.name || 'Devin Subbu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [street, setStreet] = useState('Flat 402, Lotus Greens, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [pinCode, setPinCode] = useState('560038');

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = paymentMethod === 'COD' ? 90 : 60; // India COD vs Prepaid shipping
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#38bdf8', '#10b981'],
        });
      } catch (e) {}

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: `FLYNK-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: 'Just now',
        items: [...cart],
        totalAmount: total,
        shippingFee,
        discountAmount: 0,
        paymentMethod,
        escrowStatus: 'held_in_escrow',
        deliveryStatus: 'confirmed',
        awbNumber: `SHIP-${Math.floor(10000000 + Math.random() * 90000000)}-IN`,
        courierName: 'Shiprocket X / BlueDart Air',
        estimatedDeliveryDate: 'In 2 days',
        shippingAddress: {
          fullName: name,
          phone,
          street,
          city,
          pincode: pinCode,
          state: 'Karnataka',
        },
        timeline: [
          {
            status: 'confirmed',
            title: 'Order Placed & Escrow Secured',
            description: `₹${total.toLocaleString('en-IN')} held securely in FLYNK Escrow. Seller payout is frozen until verified delivery.`,
            timestamp: 'Just now',
            completed: true,
          },
          {
            status: 'packed',
            title: 'Seller Preparing Package',
            description: 'Seller packing with tamper-evident security barcode.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'picked_up',
            title: 'Courier Pickup Scheduled',
            description: 'BlueDart courier vehicle assigned for hub transit.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'in_transit',
            title: 'In Flight / Hub Transit',
            description: 'Automated GPS and AWB scan tracking.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Doorstep Delivery',
            description: 'Driver OTP or verified delivery scan.',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'delivered',
            title: 'Delivery Confirmed & Escrow Released',
            description: 'Buyer confirms or courier scan clears. Seller receives settlement.',
            timestamp: 'Pending',
            completed: false,
          },
        ],
      };

      onOrderCreated(newOrder);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-[#02060E]/95 border border-[#2B5C92]/40 rounded-t-[32px] sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(3,86,197,0.3)] overflow-hidden animate-in slide-in-from-bottom duration-200 backdrop-blur-2xl">
        {/* Header in Midnight Blue theme */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2B5C92]/30 bg-[#0C1446]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0356C5]/20 text-[#38bdf8] flex items-center justify-center border border-[#0356C5]/40 shadow-[0_0_10px_rgba(3,86,197,0.3)]">
              <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-['Syne']">
                {step === 'cart'
                  ? 'Your Creator Cart'
                  : step === 'checkout'
                  ? 'Escrow Checkout'
                  : 'Order Confirmed!'}
              </h2>
              <p className="text-[11px] text-[#B3CDE0]">
                {step === 'cart'
                  ? `${cart.length} item(s) • Protected by FLYNK`
                  : 'Regulated escrow payment pipeline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#02060E]/80 hover:bg-[#0356C5]/30 text-[#B3CDE0] hover:text-white border border-[#2B5C92]/30 transition-all shadow-sm cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CART VIEW */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-[#0C1446]/40 border border-[#2B5C92]/30 flex gap-3.5 items-center justify-between backdrop-blur-xl"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-[#2B5C92]/40 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[#38bdf8] font-semibold uppercase font-mono">
                        @{item.product.sellerHandle}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate font-['Syne']">
                        {item.product.title}
                      </h4>
                      <div className="text-[11px] text-[#B3CDE0] mt-0.5">
                        {item.selectedSize && <span>Size: {item.selectedSize} </span>}
                        {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-bold text-white font-mono">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#94A3B8] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="text-[#B3CDE0] hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="text-[#B3CDE0] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#94A3B8] text-xs">
                  Your cart is empty. Add featured products from shorts or creator stores!
                </div>
              )}

              {cart.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#0356C5]/15 border border-[#0356C5]/30 text-xs text-[#E2E8F0] space-y-1 backdrop-blur-xl">
                  <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>How FLYNK Escrow Protects You:</span>
                  </div>
                  <p className="text-[11px] text-[#B3CDE0]">
                    Seller does NOT receive payment immediately. Funds are held safely until courier delivers your order and you inspect it.
                  </p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-[#2B5C92]/30 bg-[#02060E]/95 backdrop-blur-2xl space-y-3">
                <div className="flex justify-between text-xs text-[#B3CDE0]">
                  <span>Subtotal</span>
                  <span className="text-white font-bold font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#B3CDE0]">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-400">Prepaid ₹60 / COD ₹90</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0356C5] via-[#1a62d6] to-[#2B5C92] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(3,86,197,0.5)] border border-[#B3CDE0]/40 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Proceed to Escrow Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT & ESCROW PAYMENT */}
        {step === 'checkout' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Shipping Address */}
              <div className="bg-[#0C1446]/40 border border-[#2B5C92]/30 rounded-2xl p-3.5 space-y-2.5 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 font-['Syne']">
                    <Truck className="w-4 h-4 text-[#38bdf8]" />
                    Delivery Destination
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-xl px-3 py-2 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#0356C5]"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-xl px-3 py-2 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#0356C5]"
                  />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street / Flat"
                    className="col-span-2 bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-xl px-3 py-2 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#0356C5]"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-xl px-3 py-2 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#0356C5]"
                  />
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="PIN Code"
                    className="bg-[#02060E]/70 border border-[#2B5C92]/40 rounded-xl px-3 py-2 text-white font-mono placeholder:text-[#64748B] focus:outline-none focus:border-[#0356C5]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E2E8F0] block font-['Syne']">
                  Select Regulated Payment Route
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#0356C5] bg-[#0356C5]/25 text-white shadow-[0_0_15px_rgba(3,86,197,0.4)]'
                        : 'border-[#2B5C92]/30 bg-[#0C1446]/40 text-[#B3CDE0] hover:border-[#2B5C92]/60'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#38bdf8]" />
                    <span className="text-xs font-bold">UPI / QR</span>
                    <span className="text-[10px] text-emerald-400 font-medium">₹60 Ship</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#0356C5] bg-[#0356C5]/25 text-white shadow-[0_0_15px_rgba(3,86,197,0.4)]'
                        : 'border-[#2B5C92]/30 bg-[#0C1446]/40 text-[#B3CDE0] hover:border-[#2B5C92]/60'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold">Cards / Net</span>
                    <span className="text-[10px] text-emerald-400 font-medium">₹60 Ship</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#0356C5] bg-[#0356C5]/25 text-white shadow-[0_0_15px_rgba(3,86,197,0.4)]'
                        : 'border-[#2B5C92]/30 bg-[#0C1446]/40 text-[#B3CDE0] hover:border-[#2B5C92]/60'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold">Cash on Del.</span>
                    <span className="text-[10px] text-amber-400 font-medium">₹90 Ship</span>
                  </button>
                </div>
              </div>

              {/* Escrow Settlement Flow Diagram */}
              <div className="p-3.5 rounded-2xl bg-[#0C1446]/50 border border-[#2B5C92]/30 space-y-2 text-xs backdrop-blur-xl">
                <div className="flex items-center justify-between text-[#B3CDE0]">
                  <span>Product Subtotal</span>
                  <span className="text-white font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[#B3CDE0]">
                  <span>Logistics Carrier Fee</span>
                  <span className="text-white font-mono">₹{shippingFee}</span>
                </div>
                <div className="flex items-center justify-between text-[#B3CDE0]">
                  <span>FLYNK Escrow Security</span>
                  <span className="text-emerald-400 font-semibold font-mono">₹0 (Included)</span>
                </div>
                <div className="pt-2 border-t border-[#2B5C92]/30 flex items-center justify-between text-sm font-bold">
                  <span className="text-white">Total Amount to Pay</span>
                  <span className="text-[#38bdf8] font-mono">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#2B5C92]/30 bg-[#02060E]/95 backdrop-blur-2xl flex gap-2">
              <button
                onClick={() => setStep('cart')}
                className="py-3 px-4 rounded-xl bg-[#0C1446]/60 hover:bg-[#0C1446] text-xs font-semibold text-[#B3CDE0] hover:text-white border border-[#2B5C92]/40 cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#0356C5] via-[#1a62d6] to-[#2B5C92] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(3,86,197,0.5)] border border-[#B3CDE0]/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Securing in Escrow...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{total.toLocaleString('en-IN')} & Secure in Escrow</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="p-6 text-center space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-['Syne']">Order Confirmed & Escrow Held</h3>
              <p className="text-xs text-[#B3CDE0] mt-1 max-w-sm">
                Your payment of ₹{total.toLocaleString('en-IN')} is locked in escrow. The seller has been notified to pack and assign courier pickup.
              </p>
            </div>

            <div className="w-full p-3.5 rounded-2xl bg-[#0C1446]/50 border border-[#2B5C92]/30 text-left text-xs space-y-1.5 font-mono backdrop-blur-xl">
              <div className="flex justify-between text-[#B3CDE0]">
                <span>Escrow Status:</span>
                <span className="text-emerald-400 font-bold">HELD_SAFE</span>
              </div>
              <div className="flex justify-between text-[#B3CDE0]">
                <span>Courier:</span>
                <span className="text-white">Shiprocket X / BlueDart</span>
              </div>
              <div className="flex justify-between text-[#B3CDE0]">
                <span>Estimated Arrival:</span>
                <span className="text-white">2 business days</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0356C5] via-[#1a62d6] to-[#2B5C92] hover:opacity-95 text-white font-bold text-xs shadow-[0_4px_25px_rgba(3,86,197,0.5)] border border-[#B3CDE0]/40 transition-all cursor-pointer"
            >
              Track Shipment & Escrow Release
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
