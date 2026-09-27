import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Music,
  Users,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Share2,
  Lock,
  Globe,
  Smile,
  ShieldCheck,
  CheckCircle,
  Volume2,
  ChevronRight,
  UserPlus,
  Send,
} from 'lucide-react';
import { SingSong, SingParticipant, AccountContext } from '../../types/account';

interface SingTogetherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext: AccountContext;
  onPublishPerformance?: (data: {
    type: 'flick' | 'long_video';
    title: string;
    songTitle: string;
    participants: string[];
  }) => void;
}

const MOCK_SONGS: SingSong[] = [
  {
    id: 'song_1',
    title: 'Nee Kannullo (Cinematic Soul)',
    artist: 'Devin & AR Sound Collective',
    duration: '03:42',
    durationSeconds: 222,
    genre: 'Melodic Indie',
    coverUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioUrl: '',
    languages: [
      {
        code: 'telugu_translit',
        label: 'Telugu (Transliteration)',
        lyrics: [
          { timeMs: 0, text: '♪ Instrumental intro...', nextText: 'Nee kannullo kaatuka' },
          { timeMs: 4000, text: 'Nee kannullo kaatuka velige vela...', nextText: 'Naa hrudayam lo aalochana' },
          { timeMs: 9000, text: 'Naa hrudayam lo kottha aalochana...', nextText: 'Challani gali veeche vela' },
          { timeMs: 14000, text: 'Challani gaali nannu thake vela...', nextText: 'FLYNK Beat drops now' },
          { timeMs: 19000, text: 'Kalale nijamai edhurayyevela...', nextText: 'Refrain together' },
          { timeMs: 25000, text: '♪ Chorus: Sing Together now! ♪' },
        ],
      },
      {
        code: 'hindi_translit',
        label: 'Hindi (Transliteration)',
        lyrics: [
          { timeMs: 0, text: '♪ Instrumental intro...', nextText: 'Teri aankhon mein' },
          { timeMs: 4000, text: 'Teri aankhon mein jo khwaab hai...', nextText: 'Dil mein nayi umeed' },
          { timeMs: 9000, text: 'Dil mein nayi ek baat hai...', nextText: 'Hawaayein gungunaaye' },
          { timeMs: 14000, text: 'Hawaayein bhi gungunaaye re...', nextText: 'Sath milkar gao' },
          { timeMs: 19000, text: 'Saath milkar hum gaayein re...', nextText: 'FLYNK Harmonies' },
          { timeMs: 25000, text: '♪ Chorus: Hum sab saath mein! ♪' },
        ],
      },
      {
        code: 'english',
        label: 'English Lyrics',
        lyrics: [
          { timeMs: 0, text: '♪ Instrumental intro...', nextText: 'In your eyes I see the spark' },
          { timeMs: 4000, text: 'In your eyes I see the spark of night...', nextText: 'A brand new rhythm in my heart' },
          { timeMs: 9000, text: 'A brand new rhythm waking in my heart...', nextText: 'Feel the morning breeze' },
          { timeMs: 14000, text: 'Feel the morning breeze across the hills...', nextText: 'Harmonize together now' },
          { timeMs: 19000, text: 'Harmonize together in this vibe...', nextText: 'FLYNK Sing Live' },
          { timeMs: 25000, text: '♪ Chorus: Lift your voice in unison! ♪' },
        ],
      },
    ],
  },
  {
    id: 'song_2',
    title: 'Midnight Monsoon Vibes',
    artist: 'Aria Vance & Synthwave Project',
    duration: '02:58',
    durationSeconds: 178,
    genre: 'Synth Lo-Fi',
    coverUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: '',
    languages: [
      {
        code: 'english',
        label: 'English Lyrics',
        lyrics: [
          { timeMs: 0, text: '♪ Neon rain pouring softly...', nextText: 'Footsteps on wet pavement' },
          { timeMs: 5000, text: 'Footsteps echo on the midnight boulevard...', nextText: 'Sing the monsoon chord' },
          { timeMs: 12000, text: 'Lost inside the purple haze and city lights...', nextText: 'We sing as one' },
          { timeMs: 18000, text: '♪ Chorus: Under the glowing FLYNK umbrella! ♪' },
        ],
      },
    ],
  },
];

export const SingTogetherModal: React.FC<SingTogetherModalProps> = ({
  isOpen,
  onClose,
  activeContext,
  onPublishPerformance,
}) => {
  // Step: 'select_mode' | 'select_song' | 'waiting_room' | 'live_room' | 'post_preview'
  const [step, setStep] = useState<'select_mode' | 'select_song' | 'waiting_room' | 'live_room' | 'post_preview'>('select_mode');
  const [singMode, setSingMode] = useState<'solo' | 'together'>('solo');
  const [togetherPrivacy, setTogetherPrivacy] = useState<'friends' | 'followers' | 'specific'>('friends');

  const [selectedSong, setSelectedSong] = useState<SingSong>(MOCK_SONGS[0]);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('telugu_translit');

  // Media Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [avatarFilter, setAvatarFilter] = useState<'camera' | 'cyber_avatar' | 'neon_mask' | 'audio_wave'>('camera');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Participants in Together Room (Rule 32: max 6)
  const [participants, setParticipants] = useState<SingParticipant[]>([
    {
      id: 'p_me',
      name: activeContext.name,
      avatar: activeContext.avatar,
      handle: activeContext.handle,
      isHost: true,
      isMicOn: true,
      isCameraOn: true,
      avatarMode: 'camera',
      audioLevel: 75,
    },
    {
      id: 'p_aria',
      name: 'Aria Vance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      handle: 'aria_vance',
      isHost: false,
      isMicOn: true,
      isCameraOn: true,
      avatarMode: 'camera',
      audioLevel: 82,
    },
    {
      id: 'p_nikhil',
      name: 'Nikhil Sen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      handle: 'nikhilsen',
      isHost: false,
      isMicOn: false,
      isCameraOn: false,
      avatarMode: 'audio_wave',
      audioLevel: 0,
    },
    {
      id: 'p_meera',
      name: 'Meera Rao',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      handle: 'meera_sound',
      isHost: false,
      isMicOn: true,
      isCameraOn: true,
      avatarMode: 'neon_mask',
      audioLevel: 64,
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Synchronized lyric timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'live_room' && isPlayingMusic) {
      timer = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= selectedSong.durationSeconds) {
            setIsPlayingMusic(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, isPlayingMusic, selectedSong.durationSeconds]);

  if (!isOpen) return null;

  // Active lyrics calculation
  const currentLangObj =
    selectedSong.languages.find((l) => l.code === selectedLangCode) || selectedSong.languages[0];
  const currentMs = playbackSeconds * 1000;
  const currentLyricLine =
    [...currentLangObj.lyrics].reverse().find((item) => currentMs >= item.timeMs) ||
    currentLangObj.lyrics[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-['Plus_Jakarta_Sans']">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-red-500/50 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-lg bg-[#0a0306] border border-red-500/40 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)] flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-['Syne'] flex items-center gap-1.5">
                <span>Sing Together</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 border border-red-500/30">
                  {singMode === 'solo' ? 'Solo' : 'Room'}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Synchronized lyrics • Multilingual transliteration • AR Avatars
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

        {/* ================= STEP 1: SELECT MODE (Solo vs Together) ================= */}
        {step === 'select_mode' && (
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white font-['Syne']">Choose Your Sing Style</h4>
              <p className="text-xs text-neutral-400">
                Sing solo with synced lyrics & camera filters, or join friends in a collaborative live room.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Solo Card */}
              <div
                onClick={() => {
                  setSingMode('solo');
                  setStep('select_song');
                }}
                className="p-5 rounded-3xl bg-[#14060c] border border-neutral-800 hover:border-red-500/60 p-4 cursor-pointer transition-all hover:scale-[1.02] group shadow-lg space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-sm text-white font-['Syne']">Solo Performance</h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Pick any licensed track, view timed transliterated lyrics, record with camera or avatar, and export.
                  </p>
                </div>
                <div className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Solo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Together Card */}
              <div
                onClick={() => {
                  setSingMode('together');
                  setStep('select_song');
                }}
                className="p-5 rounded-3xl bg-[#0a121c] border border-neutral-800 hover:border-sky-500/60 p-4 cursor-pointer transition-all hover:scale-[1.02] group shadow-lg space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-sm text-white font-['Syne']">Sing Together Room</h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Host or join a multi-cam live jam (up to 6 singers), with host controls, approvals, and shared audio.
                  </p>
                </div>
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Room</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                All sing sessions include persistent recording notice. Published performances credit every singer automatically.
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SELECT SONG & LYRIC LANGUAGE ================= */}
        {step === 'select_song' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-['Syne']">1. Select Licensed Track</h4>
              <button
                onClick={() => setStep('select_mode')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Back
              </button>
            </div>

            {/* Song List */}
            <div className="space-y-2">
              {MOCK_SONGS.map((song) => {
                const isSelected = selectedSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'bg-[#12050a] border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white font-['Syne']">
                          {song.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {song.artist} • <span className="font-mono">{song.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded text-neutral-300">
                        {song.genre}
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Language & Transliteration Selector (Rule 35) */}
            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <label className="text-[11px] font-bold text-neutral-300 block">
                2. Lyrics & Transliteration Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedSong.languages.map((lang) => {
                  const isSel = selectedLangCode === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLangCode(lang.code)}
                      className={`py-2 px-3 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-red-600 text-white border-red-400 shadow-md'
                          : 'bg-[#160a10] text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Privacy if 'together' */}
            {singMode === 'together' && (
              <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                <label className="text-[11px] font-bold text-neutral-300 block">
                  3. Who Can Join This Room?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'friends', label: 'Friends Only', icon: Users },
                    { id: 'followers', label: 'Followers', icon: Globe },
                    { id: 'specific', label: 'Invite Only', icon: Lock },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setTogetherPrivacy(p.id as any)}
                      className={`p-2 rounded-xl text-center border text-[11px] font-bold flex flex-col items-center gap-1 ${
                        togetherPrivacy === p.id
                          ? 'bg-sky-600/30 border-sky-400 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <p.icon className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('waiting_room')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer mt-2"
            >
              Continue to Waiting Room →
            </button>
          </div>
        )}

        {/* ================= STEP 3: WAITING ROOM & MEDIA SETUP (Rule 30) ================= */}
        {step === 'waiting_room' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="text-center space-y-0.5">
              <h4 className="text-base font-bold text-white font-['Syne']">Audio & Camera Check</h4>
              <p className="text-[11px] text-neutral-400">
                Verify mic, camera, and choose an optional AR avatar filter before entering.
              </p>
            </div>

            {/* Video / Avatar Preview Box */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-red-500/30 flex items-center justify-center shadow-lg">
              {isCameraOn ? (
                <div className="relative w-full h-full">
                  <img
                    src={activeContext.avatar}
                    alt="Camera Preview"
                    className="w-full h-full object-cover"
                  />
                  {avatarFilter !== 'camera' && (
                    <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-black/75 text-xs font-bold text-purple-300 border border-purple-500/40">
                        ✨ AR Mode: {avatarFilter.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Camera OFF: Audio waveform + avatar (Rule 33) */
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full border-2 border-red-500/50 p-1">
                    <img
                      src={activeContext.avatar}
                      alt={activeContext.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-white">{activeContext.name}</span>
                  {/* Animated Waveform */}
                  <div className="flex items-center gap-1 h-5">
                    {[40, 70, 95, 60, 85, 45, 90, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Top Warning Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold font-mono flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>● REC DISCLOSURE ON</span>
              </div>
            </div>

            {/* Media Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  isMicOn
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-red-950/60 border-red-500 text-red-300'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                <span>{isMicOn ? 'Mic: Ready' : 'Mic: Muted'}</span>
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  isCameraOn
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-red-950/60 border-red-500 text-red-300'
                }`}
              >
                {isCameraOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                <span>{isCameraOn ? 'Camera: ON' : 'Camera: OFF'}</span>
              </button>
            </div>

            {/* Avatar / Filter options (Rule 34) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                Visual Filter / On-Device Avatar
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'camera', label: 'Raw Cam' },
                  { id: 'cyber_avatar', label: 'Cyber Avatar' },
                  { id: 'neon_mask', label: 'Neon Mask' },
                  { id: 'audio_wave', label: 'Audio Wave' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAvatarFilter(f.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all truncate ${
                      avatarFilter === f.id
                        ? 'bg-red-600 text-white border-red-400'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recording disclosure consent */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
              By joining, you agree that your audio/video will be recorded for this performance and tagged with your handle.
            </div>

            <button
              onClick={() => {
                setStep('live_room');
                setIsPlayingMusic(true);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-xl cursor-pointer"
            >
              Enter Sing Stage Now 🎤
            </button>
          </div>
        )}

        {/* ================= STEP 4: LIVE ROOM (Rules 31, 32, 33, 35, 36) ================= */}
        {step === 'live_room' && (
          <div className="p-4 space-y-3 overflow-y-auto flex-1 flex flex-col justify-between">
            {/* Top Bar: Song Info, Playback Timer & REC Indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                  ● REC ({Math.floor(playbackSeconds / 60)}:
                  {(playbackSeconds % 60).toString().padStart(2, '0')} / {selectedSong.duration})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                  <span>{isPlayingMusic ? 'Pause Music' : 'Resume'}</span>
                </button>

                <button
                  onClick={() => setStep('post_preview')}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
                >
                  Finish
                </button>
              </div>
            </div>

            {/* Dynamic Timed Lyrics Banner (Rule 31, 35) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/80 via-black to-neutral-900 border border-red-500/40 text-center space-y-1 shadow-md">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
                Synchronized Lyrics ({currentLangObj.label})
              </span>
              <p className="text-sm sm:text-base font-extrabold text-white font-['Syne'] animate-in fade-in">
                {currentLyricLine.text}
              </p>
              {currentLyricLine.nextText && (
                <p className="text-[11px] text-neutral-400 italic">
                  Next: {currentLyricLine.nextText}
                </p>
              )}
            </div>

            {/* Participants Grid (Rule 32: max 6 visible feeds) */}
            <div
              className={`grid gap-2 flex-1 my-1 ${
                participants.length <= 2
                  ? 'grid-cols-2'
                  : participants.length <= 4
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md flex items-center justify-center group"
                >
                  {p.isCameraOn ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 p-2 text-center">
                      <div className="w-10 h-10 rounded-full border border-red-500/50 p-0.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white truncate max-w-[90px]">
                        {p.name}
                      </span>
                      {/* Audio Level bars */}
                      <div className="flex items-center gap-0.5 h-3">
                        {[20, 60, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-red-400 rounded-full animate-pulse"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Left: Name tag & Host badge */}
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1">
                    <span>{p.name.split(' ')[0]}</span>
                    {p.isHost && (
                      <span className="text-[8px] bg-red-600 px-1 rounded text-white font-mono">
                        HOST
                      </span>
                    )}
                  </div>

                  {/* Bottom Right: Mic Status */}
                  <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white">
                    {p.isMicOn ? (
                      <Mic className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Controls Bar (Rule 31) */}
            <div className="p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-around">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-2.5 rounded-xl text-white transition-all ${
                  isMicOn ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-red-600'
                }`}
                title="Toggle Mic"
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-2.5 rounded-xl text-white transition-all ${
                  isCameraOn ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-red-600'
                }`}
                title="Toggle Camera"
              >
                {isCameraOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => showToast('Switched to Front Camera')}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white"
                title="Flip Camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => showToast('Invite link copied')}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white"
                title="Invite Singer"
              >
                <UserPlus className="w-4 h-4 text-sky-400" />
              </button>

              <button
                onClick={() => setStep('post_preview')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                End & Save
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: POST & EXPORT PERFORMANCE (Rule 26, 38) ================= */}
        {step === 'post_preview' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white font-['Syne']">Performance Ready!</h4>
              <p className="text-xs text-neutral-400">
                Session recorded with {participants.length} singers tagged. Export or post directly.
              </p>
            </div>

            {/* Preview Card with Watermark */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-red-500/30">
              <img
                src={selectedSong.coverUrl}
                alt="Finished Recording"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

              {/* Watermark badge (Rule 26) */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-red-500" />
                <span>FLYNK SING • 2026</span>
              </div>

              {/* Participants Tag List */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                {participants.map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt={p.name}
                    className="w-6 h-6 rounded-full border border-white/40 object-cover"
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Publish Options */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onPublishPerformance?.({
                    type: 'flick',
                    title: `${selectedSong.title} (Sing Together Jam)`,
                    songTitle: selectedSong.title,
                    participants: participants.map((p) => p.name),
                  });
                  showToast('Published as Flick with all participants credited!');
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                Post as Collaborative Flick
              </button>

              <button
                onClick={() => {
                  onPublishPerformance?.({
                    type: 'long_video',
                    title: `${selectedSong.title} - Full Performance`,
                    songTitle: selectedSong.title,
                    participants: participants.map((p) => p.name),
                  });
                  showToast('Published as Long Video!');
                  onClose();
                }}
                className="w-full py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs"
              >
                Post as Full Video
              </button>

              <button
                onClick={() => {
                  showToast('Downloading MP4 with FLYNK watermark...');
                  setTimeout(onClose, 1000);
                }}
                className="w-full py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Export with FLYNK Watermark (Download)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
