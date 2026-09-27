import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Video,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
  Building,
  Utensils,
  Scissors,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { BookingAppointment, BusinessSector, ProfessionalSpecialization } from '../../types/masterFlynk';

interface UniversalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetHandle: string;
  targetAvatar: string;
  sector?: BusinessSector;
  specialization?: ProfessionalSpecialization;
  customServiceTitle?: string;
  onBookingConfirmed?: (appointment: BookingAppointment) => void;
}

export const UniversalBookingModal: React.FC<UniversalBookingModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetHandle,
  targetAvatar,
  sector = 'doctor_clinic',
  specialization,
  customServiceTitle,
  onBookingConfirmed,
}) => {
  const [selectedService, setSelectedService] = useState<string>(
    customServiceTitle ||
      (sector === 'doctor_clinic'
        ? 'General Medical Consultation'
        : sector === 'real_estate'
        ? 'VIP Physical Site Visit'
        : sector === 'restaurant'
        ? 'Table Reservation'
        : sector === 'salon_beauty'
        ? 'Hair Styling & Treatment'
        : specialization === 'video_editor'
        ? 'Commercial Video Editing'
        : specialization === 'developer'
        ? 'Full-Stack Web App Development'
        : 'Professional Consultation')
  );

  const [bookingMode, setBookingMode] = useState<'in_person' | 'online' | 'on_site'>('in_person');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 2');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [customerName, setCustomerName] = useState<string>('Nani Kumar');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98490 12345');
  const [customerEmail, setCustomerEmail] = useState<string>('nani.kumar@example.com');
  const [notes, setNotes] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [budgetRange, setBudgetRange] = useState<string>('₹25,000 – ₹50,000');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedId, setConfirmedId] = useState<string>('');

  if (!isOpen) return null;

  // Services catalog based on Sector / Specialization
  const getAvailableServices = () => {
    if (sector === 'doctor_clinic') {
      return [
        { id: 's1', title: 'General Medical Consultation', fee: '₹800', duration: '20 mins', online: true },
        { id: 's2', title: 'Cardiology Assessment & ECG', fee: '₹1,500', duration: '30 mins', online: false },
        { id: 's3', title: 'Telehealth Video Consultation', fee: '₹600', duration: '15 mins', online: true },
      ];
    }
    if (sector === 'real_estate') {
      return [
        { id: 's1', title: 'VIP Physical Site Visit', fee: 'Complimentary', duration: '45 mins', online: false },
        { id: 's2', title: 'Architectural Blueprint Discussion', fee: 'Complimentary', duration: '30 mins', online: true },
        { id: 's3', title: 'Floor Plan & Pricing Consultation', fee: 'Complimentary', duration: '20 mins', online: true },
      ];
    }
    if (sector === 'restaurant') {
      return [
        { id: 's1', title: 'Indoor Dining Table', fee: '₹500 Deposit', duration: '1.5 hrs', online: false },
        { id: 's2', title: 'Rooftop Lounge Experience', fee: '₹1,000 Deposit', duration: '2 hrs', online: false },
        { id: 's3', title: 'Chef’s Special Degustation', fee: '₹2,500 / person', duration: '2.5 hrs', online: false },
      ];
    }
    if (sector === 'salon_beauty') {
      return [
        { id: 's1', title: 'Hair Styling & Keratin Treatment', fee: '₹2,200', duration: '60 mins', online: false },
        { id: 's2', title: 'Bridal Makeover Trial', fee: '₹3,500', duration: '90 mins', online: false },
        { id: 's3', title: 'Skin Glow Facial & Massage', fee: '₹1,800', duration: '45 mins', online: false },
      ];
    }
    // Professional specializations
    if (specialization === 'video_editor') {
      return [
        { id: 's1', title: 'Reels / Flicks Viral Cut (Pack of 5)', fee: '₹15,000', duration: '3 days turnaround', online: true },
        { id: 's2', title: 'Commercial Brand Film Editing & Sound', fee: '₹45,000', duration: '1 week', online: true },
        { id: 's3', title: 'Color Grading & Sound Mixing', fee: '₹12,000', duration: '2 days', online: true },
      ];
    }
    if (specialization === 'developer') {
      return [
        { id: 's1', title: 'Full-Stack Web App MVP Sprint', fee: '₹60,000', duration: '2 weeks', online: true },
        { id: 's2', title: 'API Integration & Cloud Database Setup', fee: '₹25,000', duration: '4 days', online: true },
        { id: 's3', title: 'Technical Architecture & Code Review', fee: '₹10,000', duration: '1 day', online: true },
      ];
    }
    return [
      { id: 's1', title: '1-on-1 Consultation Session', fee: '₹2,500', duration: '45 mins', online: true },
      { id: 's2', title: 'Custom Project Milestone Scoping', fee: 'Custom Quote', duration: 'Flexible', online: true },
    ];
  };

  const services = getAvailableServices();

  const dates = [
    'Today, Oct 1',
    'Tomorrow, Oct 2',
    'Thursday, Oct 3',
    'Friday, Oct 4',
    'Saturday, Oct 5',
  ];

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:30 PM',
    '04:15 PM',
    '06:00 PM',
    '07:30 PM',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedId(newId);

    const booking: BookingAppointment = {
      id: newId,
      type:
        sector === 'doctor_clinic'
          ? 'doctor_appointment'
          : sector === 'real_estate'
          ? 'site_visit'
          : sector === 'restaurant'
          ? 'table_reservation'
          : sector === 'salon_beauty'
          ? 'salon_service'
          : 'project_quote',
      targetEntityId: targetHandle,
      targetEntityName: targetName,
      serviceName: selectedService,
      customerName,
      customerPhone,
      customerEmail,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      mode: bookingMode,
      notes,
      guestsCount,
      budgetRange,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setIsSuccess(true);
    onBookingConfirmed?.(booking);
  };

  const getSectorTitle = () => {
    if (sector === 'doctor_clinic') return 'Doctor Appointment';
    if (sector === 'real_estate') return 'Property Site Visit';
    if (sector === 'restaurant') return 'Table Reservation';
    if (sector === 'salon_beauty') return 'Salon & Beauty Booking';
    if (specialization === 'video_editor') return 'Hire Video Editor';
    if (specialization === 'developer') return 'Discuss Tech Project';
    return 'Book Consultation / Service';
  };

  const getSectorIcon = () => {
    if (sector === 'doctor_clinic') return Stethoscope;
    if (sector === 'real_estate') return Building;
    if (sector === 'restaurant') return Utensils;
    if (sector === 'salon_beauty') return Scissors;
    return Briefcase;
  };

  const SectorIcon = getSectorIcon();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#0e060d] border border-neutral-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <SectorIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white font-['Syne']">
                  {getSectorTitle()}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                with <span className="text-neutral-200 font-medium">{targetName}</span> ({targetHandle})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-neutral-200 text-xs">
          {!isSuccess ? (
            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                  Select Service / Scope
                </label>
                <div className="space-y-2">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc.title)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedService === svc.title
                          ? 'bg-sky-950/40 border-sky-500/80 text-white shadow-[0_0_15px_rgba(14,165,233,0.25)]'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-white">{svc.title}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                          <span>⏱ {svc.duration}</span>
                          {svc.online && <span className="text-sky-400">🎥 Online Available</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sky-300 text-xs">{svc.fee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation / Visit Mode Toggle */}
              {sector !== 'restaurant' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                    Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingMode('in_person')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        bookingMode === 'in_person'
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>In-Person / On-Site</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingMode('online')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        bookingMode === 'online'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Online Video Call</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Restaurant Guests */}
              {sector === 'restaurant' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                          guestsCount === num
                            ? 'bg-amber-600 text-white border-amber-500'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                  Select Preferred Date
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 border transition-all ${
                        selectedDate === d
                          ? 'bg-sky-600 text-white border-sky-400 shadow-sm font-bold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-bold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient / Contact Details */}
              <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono">
                  Contact & Confirmation Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800">
                    <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-transparent border-none text-white text-xs focus:outline-none w-full"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile Phone"
                      className="bg-transparent border-none text-white text-xs focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      sector === 'doctor_clinic'
                        ? 'Brief symptoms or reason for visit (optional)'
                        : sector === 'real_estate'
                        ? 'Interested in 3BHK or Penthouse / budget (optional)'
                        : 'Notes or project brief (optional)'
                    }
                    className="bg-transparent border-none text-white text-xs focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white font-bold text-xs sm:text-sm font-['Syne'] shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm {getSectorTitle()}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
                <p className="text-[10px] text-neutral-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>No upfront payment required • Instant confirmation voucher sent</span>
                </p>
              </div>
            </form>
          ) : (
            /* Success Ticket */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white font-['Syne']">
                  Booking Confirmed!
                </h4>
                <p className="text-xs text-neutral-400">
                  Your appointment pass has been issued and linked to your FLYNK profile.
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[10px] text-neutral-400 uppercase">Booking ID</span>
                  <span className="text-xs font-bold text-sky-400">{confirmedId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Provider</span>
                  <span className="text-xs text-white font-semibold">{targetName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Service</span>
                  <span className="text-xs text-neutral-200">{selectedService}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Date & Slot</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    {selectedDate} at {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Mode</span>
                  <span className="text-xs uppercase text-neutral-300">{bookingMode}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
