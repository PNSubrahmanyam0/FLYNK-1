import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderDeliveryStatus } from '../../types';

interface OrdersTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSimulateNextStep: (orderId: string) => void;
}

export const OrdersTrackerModal: React.FC<OrdersTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSimulateNextStep,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );

  if (!isOpen) return null;

  const currentOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0];

  const deliverySteps: { status: OrderDeliveryStatus; title: string; icon: any }[] = [
    { status: 'confirmed', title: 'Secured in Escrow', icon: ShieldCheck },
    { status: 'packed', title: 'Packed & Barcoded', icon: PackageCheck },
    { status: 'picked_up', title: 'Courier Picked Up', icon: Truck },
    { status: 'in_transit', title: 'Air/Hub Transit', icon: Plane },
    { status: 'out_for_delivery', title: 'Out for Delivery', icon: Clock },
    { status: 'delivered', title: 'Delivered & Escrow Released', icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = (status: OrderDeliveryStatus) => {
    return deliverySteps.findIndex((s) => s.status === status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-[#0e0406]/95 border border-red-500/30 rounded-t-[32px] sm:rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden animate-in slide-in-from-bottom duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-500/20 bg-[#140608]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-['Syne']">Shipment & Escrow Tracker</h2>
              <p className="text-[11px] text-neutral-400">
                Automated multi-carrier logistics & seller settlement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/25 transition-all shadow-sm"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders Selector if multiple */}
        {orders.length > 1 && (
          <div className="flex gap-2 p-3 bg-red-950/30 border-b border-red-500/20 overflow-x-auto">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  ord.id === currentOrder?.id
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30'
                    : 'bg-red-950/40 border border-red-500/20 text-neutral-400 hover:text-white'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        {currentOrder ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Order Card Overview */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-white text-sm">
                    {currentOrder.orderNumber}
                  </span>
                  <p className="text-neutral-400 text-[11px] mt-0.5 font-mono">
                    Placed {currentOrder.createdAt}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      currentOrder.escrowStatus === 'released_to_seller'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {currentOrder.escrowStatus === 'released_to_seller'
                      ? 'Escrow Released'
                      : 'Held in Escrow'}
                  </span>
                  <p className="text-xs font-bold text-white mt-1 font-mono">
                    ₹{currentOrder.totalAmount.toLocaleString('en-IN')} ({currentOrder.paymentMethod})
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-red-500/20 space-y-2">
                {currentOrder.items.map((it, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center">
                    <img
                      src={it.product.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-red-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-semibold text-white truncate font-['Syne']">{it.product.title}</h4>
                      <p className="text-[11px] text-neutral-400">
                        Qty: {it.quantity} • {it.selectedSize || 'Standard'} • Seller: @{it.product.sellerHandle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carrier info */}
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-2.5 text-[11px] flex justify-between items-center text-neutral-300">
                <span className="flex items-center gap-1.5 font-mono">
                  <Truck className="w-3.5 h-3.5 text-red-400" />
                  AWB: {currentOrder.awbNumber}
                </span>
                <span className="text-neutral-400">{currentOrder.courierName}</span>
              </div>
            </div>

            {/* Interactive Timeline Stepper */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-red-400">
                  Logistics & Settlement Journey
                </h3>
                <span className="text-neutral-400 font-mono text-[10px]">
                  Estimated: {currentOrder.estimatedDeliveryDate}
                </span>
              </div>

              <div className="relative pl-6 space-y-5 border-l-2 border-red-500/25 ml-3">
                {deliverySteps.map((step, idx) => {
                  const currentIdx = getCurrentStepIndex(currentOrder.deliveryStatus);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                            : 'bg-[#140608] border-red-500/30 text-neutral-500'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs font-bold ${
                              isDone ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {step.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded font-semibold font-mono animate-pulse">
                              ACTIVE STEP
                            </span>
                          )}
                        </div>

                        {idx === 0 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            ₹{currentOrder.totalAmount} locked in regulated escrow account.
                          </p>
                        )}
                        {idx === 1 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Creator prepares package with tamper-resistant barcode scan.
                          </p>
                        )}
                        {idx === 2 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Automated courier pickup scan generated by Shiprocket API.
                          </p>
                        )}
                        {idx === 3 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Air transit departed origin city hub -&gt; destination gateway.
                          </p>
                        )}
                        {idx === 4 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Assigned to delivery courier associate for final doorstep handover.
                          </p>
                        )}
                        {idx === 5 && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {currentOrder.escrowStatus === 'released_to_seller'
                              ? '🎉 Confirmed delivery! Escrow payout deposited to creator account.'
                              : 'Pending delivery completion or buyer OTP confirmation.'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Escrow Mechanism Explanation Box */}
            <div className="p-3.5 rounded-2xl bg-red-950/25 border border-red-500/20 text-xs space-y-2 backdrop-blur-xl">
              <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>FLYNK Safe-Commerce Rule:</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                As discussed in the core architecture: Platforms must not treat held customer funds as proprietary capital. Settlements are held strictly in compliance with RBI / payment aggregator guidelines and only dispersed upon courier delivery verification.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-neutral-400">
            No active orders. Purchase products from any creator store to test live escrow tracking!
          </div>
        )}

        {/* Simulator Button in Footer */}
        {currentOrder && (
          <div className="p-4 border-t border-red-500/20 bg-[#0e0406]/95 backdrop-blur-2xl flex items-center justify-between gap-3">
            <div className="text-[11px] text-neutral-400">
              <span>Test Real-Time Webhook:</span>
            </div>

            <button
              onClick={() => onSimulateNextStep(currentOrder.id)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_25px_rgba(220,38,38,0.45)] border border-red-400/30 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Next Courier Event</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
