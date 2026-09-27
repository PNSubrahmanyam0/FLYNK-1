import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle, ChevronRight, ShieldCheck, User } from 'lucide-react';

export interface AvailabilitySlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  isAvailable: boolean;
}

export interface AvailabilityEngineProps {
  entityName: string;
  entityRole: string; // e.g. "Cardiologist", "Video Editor", "Real Estate Specialist", "Salon Stylist"
  serviceName: string;
  durationMinutes?: number;
  feeOrPrice?: string;
  isOnlineAvailable?: boolean;
  isInPersonAvailable?: boolean;
  locationAddress?: string;
  onConfirmSlot: (bookingDetails: {
    date: string;
    slot: string;
    mode: 'in_person' | 'online' | 'on_site';
    notes?: string;
  }) => void;
  onCancel?: () => void;
}

export const AvailabilityEngine: React.FC<AvailabilityEngineProps> = ({
  entityName,
  entityRole,
  serviceName,
  durationMinutes = 30,
  feeOrPrice = 'Free',
  isOnlineAvailable = true,
  isInPersonAvailable = true,
  locationAddress,
  onConfirmSlot,
  onCancel,
}) => {
  // Generate next 7 dates
  const dates = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const fullDate = d.toISOString().split('T')[0];
    return { dayName, dayNum, month, fullDate };
  });

  const [selectedDate, setSelectedDate] = useState<string>(dates[0].fullDate);
  const [selectedMode, setSelectedMode] = useState<'in_person' | 'online' | 'on_site'>(
    isInPersonAvailable ? 'in_person' : 'online'
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('11:30 AM');
  const [patientOrClientNotes, setPatientOrClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SLOTS: { period: 'morning' | 'afternoon' | 'evening'; label: string; slots: string[] }[] = [
    {
      period: 'morning',
      label: 'Morning (09:00 AM – 12:30 PM)',
      slots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
    },
    {
      period: 'afternoon',
      label: 'Afternoon (02:00 PM – 05:30 PM)',
      slots: ['02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM', '05:00 PM'],
    },
    {
      period: 'evening',
      label: 'Evening (06:00 PM – 08:30 PM)',
      slots: ['06:00 PM', '06:45 PM', '07:30 PM', '08:00 PM'],
    },
  ];

  const handleBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmSlot({
        date: selectedDate,
        slot: selectedSlot,
        mode: selectedMode,
        notes: patientOrClientNotes,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-5 text-white font-['Plus_Jakarta_Sans']">
      {/* Service Header Card */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start justify-between gap-3">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            FLYNK Universal Availability Engine
          </span>
          <h3 className="font-bold text-base font-['Syne'] text-white mt-1.5">{serviceName}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            With <strong className="text-neutral-200">{entityName}</strong> ({entityRole})
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-extrabold text-emerald-400 font-mono">{feeOrPrice}</div>
          <div className="text-[10px] text-neutral-400 flex items-center justify-end gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{durationMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div>
        <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-2">
          Consultation / Service Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {isInPersonAvailable && (
            <button
              type="button"
              onClick={() => setSelectedMode('in_person')}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedMode === 'in_person'
                  ? 'bg-neutral-800 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedMode === 'in_person' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">In-Person Visit</div>
                <div className="text-[10px] text-neutral-400 truncate">
                  {locationAddress || 'Clinic / Studio premises'}
                </div>
              </div>
            </button>
          )}

          {isOnlineAvailable && (
            <button
              type="button"
              onClick={() => setSelectedMode('online')}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedMode === 'online'
                  ? 'bg-neutral-800 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedMode === 'online' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">FLYNK Video Room</div>
                <div className="text-[10px] text-neutral-400 truncate">HD Tele-health & screen share</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Date Picker Strip */}
      <div>
        <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-2">
          Select Date
        </label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {dates.map((item) => {
            const isSelected = selectedDate === item.fullDate;
            return (
              <button
                key={item.fullDate}
                type="button"
                onClick={() => setSelectedDate(item.fullDate)}
                className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
                    : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.dayName}</span>
                <span className="text-base font-extrabold font-mono my-0.5">{item.dayNum}</span>
                <span className="text-[10px] opacity-75">{item.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <label className="text-xs font-bold font-['Syne'] text-neutral-300 block">
          Available Time Slots
        </label>

        {SLOTS.map((group) => (
          <div key={group.period} className="space-y-1.5">
            <div className="text-[11px] font-semibold text-neutral-400">{group.label}</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {group.slots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Notes or Symptoms / Brief */}
      <div>
        <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
          Special Notes, Symptoms, or Project Context (Optional)
        </label>
        <textarea
          rows={2}
          value={patientOrClientNotes}
          onChange={(e) => setPatientOrClientNotes(e.target.value)}
          placeholder="E.g., Prior report review, initial concept discussion, or dietary preferences..."
          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Escrow & Privacy Guarantee */}
      <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-center gap-2.5 text-[11px] text-neutral-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <span>Instant calendar hold • 100% refund on cancellation up to 2 hours prior.</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleBooking}
          disabled={isSubmitting || !selectedSlot}
          className="flex-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-['Syne'] shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Securing Appointment...</span>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Confirm for {selectedSlot}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
