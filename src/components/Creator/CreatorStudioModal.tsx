import React, { useState } from 'react';
import {
  X,
  Upload,
  Film,
  Sparkles,
  Link,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Play,
  Users,
  Lock,
  Globe,
  Trash2,
  Link2,
  Unlink,
  ExternalLink,
  FileText,
  Search,
  Check,
  ShieldCheck,
  Image as ImageIcon,
  Camera,
  Layers,
  ArrowUp,
  ArrowDown,
  Plus,
  ListOrdered,
  FolderPlus,
  Edit3,
  GripVertical,
  Eye,
} from 'lucide-react';
import { LongVideo, Product, ShortVideo, User, Series } from '../../types';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  existingLongVideos: LongVideo[];
  existingShorts?: ShortVideo[];
  products: Product[];
  allCreators?: User[];
  seriesList?: Series[];
  onPublishShort: (short: ShortVideo) => void;
  onPublishLongVideo: (video: LongVideo) => void;
  onDeleteVideo?: (videoId: string, type: 'short' | 'long') => void;
  onTogglePrivacy?: (videoId: string, type: 'short' | 'long', visibility: 'public' | 'private') => void;
  onConnectShortToLong?: (shortId: string, longId: string | null) => void;
  onCreateSeries?: (newSeries: Series) => void;
  onUpdateSeries?: (updatedSeries: Series) => void;
  onDeleteSeries?: (seriesId: string) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  existingLongVideos,
  existingShorts = [],
  products,
  allCreators = [],
  seriesList = [],
  onPublishShort,
  onPublishLongVideo,
  onDeleteVideo,
  onTogglePrivacy,
  onConnectShortToLong,
  onCreateSeries,
  onUpdateSeries,
  onDeleteSeries,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'series'>('upload');
  const [contentType, setContentType] = useState<'short' | 'long'>('short');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [locationTag, setLocationTag] = useState('');
  const [intentActionType, setIntentActionType] = useState<string>('none');
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [linkedLongVideoId, setLinkedLongVideoId] = useState<string>(
    existingLongVideos[0]?.id || ''
  );
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [attachedDocumentName, setAttachedDocumentName] = useState<string | null>(null);

  // Draft Sync to LocalStorage (survives app restart, mode switching, interrupted network)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('flynk_creator_draft');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.externalLink) setExternalLink(data.externalLink);
        if (data.locationTag) setLocationTag(data.locationTag);
        if (data.intentActionType) setIntentActionType(data.intentActionType);
        if (data.selectedThumbnail) setSelectedThumbnail(data.selectedThumbnail);
        setDraftRestored(true);
        setTimeout(() => setDraftRestored(false), 4000);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      if (title || description || locationTag || externalLink) {
        localStorage.setItem(
          'flynk_creator_draft',
          JSON.stringify({
            title,
            description,
            externalLink,
            locationTag,
            intentActionType,
            selectedThumbnail,
            updatedAt: Date.now(),
          })
        );
      }
    } catch (e) {
      // ignore
    }
  }, [title, description, externalLink, locationTag, intentActionType, selectedThumbnail]);

  const clearDraft = () => {
    localStorage.removeItem('flynk_creator_draft');
    setTitle('');
    setDescription('');
    setExternalLink('');
    setLocationTag('');
    setIntentActionType('none');
    setSelectedThumbnail('');
    showFeedback('Draft cleared!');
  };

  // Cross-store product search
  const [productSearch, setProductSearch] = useState('');

  // Video Thumbnail / Cover page image selection (Instagram & YouTube style)
  const shortThumbnailPresets = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  ];

  const longThumbnailPresets = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setSelectedThumbnail(resultUrl);
          showFeedback('Custom cover image loaded from device!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI 1-Tap Clip Extractor Simulation
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPeakDetected, setAiPeakDetected] = useState<{
    start: string;
    end: string;
    title: string;
  } | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  // Series Management State
  const [isCreatingSeries, setIsCreatingSeries] = useState(false);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const [seriesCategory, setSeriesCategory] = useState('Cinema & Travel');
  const [seriesCover, setSeriesCover] = useState('');
  const [seriesContentItems, setSeriesContentItems] = useState<string[]>([]);
  const [seriesFilterType, setSeriesFilterType] = useState<'all' | 'long' | 'short'>('all');
  const [previewSeries, setPreviewSeries] = useState<Series | null>(null);

  const handleStartCreateSeries = () => {
    setEditingSeriesId(null);
    setSeriesTitle('');
    setSeriesDescription('');
    setSeriesCategory('Cinema & Travel');
    setSeriesCover(existingLongVideos[0]?.thumbnailUrl || existingShorts[0]?.thumbnailUrl || '');
    setSeriesContentItems([]);
    setIsCreatingSeries(true);
  };

  const handleStartEditSeries = (s: Series) => {
    setEditingSeriesId(s.id);
    setSeriesTitle(s.title);
    setSeriesDescription(s.description);
    setSeriesCategory(s.category || 'Cinema & Travel');
    setSeriesCover(s.coverImage || '');
    setSeriesContentItems([...s.contentItems]);
    setIsCreatingSeries(true);
  };

  const handleToggleContentInSeries = (contentId: string) => {
    setSeriesContentItems((prev) =>
      prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId]
    );
  };

  const handleMoveSeriesItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= seriesContentItems.length) return;
    const updated = [...seriesContentItems];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setSeriesContentItems(updated);
  };

  // Drag and drop reordering state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) {
      setDraggedItemIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...seriesContentItems];
    const [movedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setSeriesContentItems(updated);
    showFeedback(`Reordered: Ep ${draggedItemIndex + 1} moved to Ep ${targetIndex + 1}`);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleRemoveSeriesItem = (contentId: string) => {
    setSeriesContentItems((prev) => prev.filter((id) => id !== contentId));
  };

  const getContentItemDetail = (id: string) => {
    const longVideo = existingLongVideos.find((v) => v.id === id);
    if (longVideo) {
      return {
        id: longVideo.id,
        title: longVideo.title,
        type: 'long' as const,
        typeLabel: 'Full Video (▭)',
        duration: longVideo.durationFormatted,
        thumbnailUrl: longVideo.thumbnailUrl,
      };
    }
    const short = existingShorts.find((s) => s.id === id);
    if (short) {
      return {
        id: short.id,
        title: short.title,
        type: 'short' as const,
        typeLabel: 'Flick (▯)',
        duration: '0:30',
        thumbnailUrl: short.thumbnailUrl,
      };
    }
    return {
      id,
      title: 'Linked Video Item',
      type: 'long' as const,
      typeLabel: 'Video',
      duration: '',
      thumbnailUrl: '',
    };
  };

  const handleSaveSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesTitle.trim()) {
      showFeedback('Please provide a Series Title.');
      return;
    }
    if (seriesContentItems.length === 0) {
      showFeedback('Please select at least 1 video or Flick for the series.');
      return;
    }

    if (editingSeriesId) {
      const updated: Series = {
        id: editingSeriesId,
        title: seriesTitle.trim(),
        description: seriesDescription.trim(),
        creatorId: currentUser.id,
        contentItems: seriesContentItems,
        coverImage: seriesCover || existingLongVideos[0]?.thumbnailUrl || existingShorts[0]?.thumbnailUrl || '',
        category: seriesCategory,
        isPublic: true,
        updatedAt: 'Just now',
      };
      onUpdateSeries?.(updated);
      showFeedback(`Series "${updated.title}" updated!`);
    } else {
      const created: Series = {
        id: `series_${Date.now()}`,
        title: seriesTitle.trim(),
        description: seriesDescription.trim(),
        creatorId: currentUser.id,
        contentItems: seriesContentItems,
        coverImage: seriesCover || existingLongVideos[0]?.thumbnailUrl || existingShorts[0]?.thumbnailUrl || '',
        category: seriesCategory,
        isPublic: true,
        createdAt: 'Just now',
        updatedAt: 'Just now',
      };
      onCreateSeries?.(created);
      showFeedback(`Created series "${created.title}"!`);
    }

    setIsCreatingSeries(false);
    setEditingSeriesId(null);
  };

  const handleToggleProduct = (prodId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleAiAutoExtract = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiPeakDetected({
        start: '04:12',
        end: '04:42',
        title: 'The Ice Bridge Breakdown Scene (96% Audience Retention Peak)',
      });
      setTitle('The ice under our snowshoes shattered at -24°C in Zanskar 😱');
      setDescription(
        'Minute 4 of our 14-day frozen gorge trek. Swipe left to launch the full 19-minute cinema cut! Check gear at https://flynk.app/c/gear #Himalayas #Survival'
      );
      setExternalLink('https://zanskarexpeditions.org/chaddar-trek');
    }, 1100);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 5) {
      setFeedbackMessage('Video title is too short (Minimum 5 characters required).');
      setTimeout(() => setFeedbackMessage(null), 3500);
      return;
    }
    if (trimmedTitle.length > 70) {
      setFeedbackMessage('Video title is too long (Maximum 70 characters allowed).');
      setTimeout(() => setFeedbackMessage(null), 3500);
      return;
    }

    const tagged = products.filter((p) => selectedProductIds.includes(p.id));
    const collaboratorUser = allCreators.find((c) => c.id === selectedCollaboratorId);

    // Append external link to description if provided
    let finalDescription = description.trim();
    if (externalLink.trim() && !finalDescription.includes(externalLink.trim())) {
      finalDescription = `${finalDescription}\n\n🔗 Official Link: ${externalLink.trim()}`;
    }

    if (contentType === 'short') {
      const parentLong = existingLongVideos.find((v) => v.id === linkedLongVideoId);
      const newShort: ShortVideo = {
        id: `short_${Date.now()}`,
        creatorId: currentUser.id,
        creator: currentUser,
        collaborator: collaboratorUser,
        title: title.trim(),
        description: finalDescription,
        durationSeconds: 30,
        videoUrl:
          parentLong?.videoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl:
          selectedThumbnail ||
          parentLong?.thumbnailUrl ||
          shortThumbnailPresets[0],
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        savesCount: 0,
        isLiked: true,
        visibility,
        attachedProofDocument: attachedDocumentName || undefined,
        copyrightStatus: 'clean',
        audioTrack: {
          title: `Original Audio - @${currentUser.handle}`,
          artist: currentUser.name,
          isOriginal: true,
        },
        linkedLongVideoId: linkedLongVideoId || undefined,
        linkedLongVideo: parentLong,
        taggedProducts: tagged,
        tags: ['#FLYNK', '#Original', '#Cinema'],
        intentAction:
          intentActionType !== 'none'
            ? {
                type: intentActionType as any,
                label:
                  intentActionType === 'save_place'
                    ? 'Save Place'
                    : intentActionType === 'get_directions'
                    ? 'Directions'
                    : intentActionType === 'view_product'
                    ? 'View Product'
                    : intentActionType === 'request_quote'
                    ? 'Request Quote'
                    : intentActionType === 'book_appointment'
                    ? 'Book Consultation'
                    : intentActionType === 'reserve_table'
                    ? 'Reserve Table'
                    : 'Watch Full',
                targetTitle: locationTag || title.trim(),
              }
            : undefined,
        geoTag: locationTag
          ? {
              placeName: locationTag,
              locality: locationTag.split(',')[0] || locationTag,
              city: 'Hyderabad',
              distanceKm: 2.5,
            }
          : undefined,
      };

      onPublishShort(newShort);
    } else {
      const newLong: LongVideo = {
        id: `long_${Date.now()}`,
        creatorId: currentUser.id,
        creator: currentUser,
        collaborator: collaboratorUser,
        title: title.trim(),
        description: finalDescription,
        durationSeconds: 960,
        durationFormatted: '16:00',
        videoUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnailUrl:
          selectedThumbnail ||
          longThumbnailPresets[0],
        viewsCount: 1,
        likesCount: 1,
        publishedAt: 'Just now',
        category: 'Cinema & Travel',
        visibility,
        attachedProofDocument: attachedDocumentName || undefined,
        copyrightStatus: 'clean',
        tags: ['filmmaking', 'original', 'flynk', currentUser.handle.toLowerCase()],
        chapters: [
          { title: 'Intro & Origin', time: '00:00', timestamp: 0 },
          { title: 'Main Sequence', time: '04:30', timestamp: 270 },
          { title: 'Climax & Takeaway', time: '11:15', timestamp: 675 },
        ],
        linkedShortIds: [],
        taggedProducts: tagged,
        heatmap: [
          { timestamp: 0, timestampFormatted: '00:00', retentionPct: 100 },
          { timestamp: 270, timestampFormatted: '04:30', retentionPct: 94 },
          { timestamp: 675, timestampFormatted: '11:15', retentionPct: 88 },
        ],
        intentAction:
          intentActionType !== 'none'
            ? {
                type: intentActionType as any,
                label:
                  intentActionType === 'save_place'
                    ? 'Save Place'
                    : intentActionType === 'get_directions'
                    ? 'Directions'
                    : intentActionType === 'view_product'
                    ? 'View Product'
                    : intentActionType === 'request_quote'
                    ? 'Request Quote'
                    : intentActionType === 'book_appointment'
                    ? 'Book Consultation'
                    : 'Watch Full',
                targetTitle: locationTag || title.trim(),
              }
            : undefined,
        geoTag: locationTag
          ? {
              placeName: locationTag,
              locality: locationTag.split(',')[0] || locationTag,
              city: 'Hyderabad',
              distanceKm: 2.5,
            }
          : undefined,
      };

      onPublishLongVideo(newLong);
    }

    localStorage.removeItem('flynk_creator_draft');
    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      onClose();
    }, 1400);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-[#0e0406]/95 border border-red-500/30 rounded-t-[32px] sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden animate-in slide-in-from-bottom duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-red-500/20 bg-[#140608]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-['Syne']">Creator Studio & Publisher</h2>
              <p className="text-[11px] text-neutral-400">
                1-Click Video Linker, Commerce Tags & Copyright Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/25 transition-all shadow-sm cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Upload vs Manage My Videos vs Series & Playlists */}
        <div className="px-4 py-2 bg-red-950/40 border-b border-red-500/20 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400/40'
                  : 'bg-red-950/40 text-neutral-400 hover:text-white border border-red-500/20'
              }`}
            >
              + Post Video
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400/40'
                  : 'bg-red-950/40 text-neutral-400 hover:text-white border border-red-500/20'
              }`}
            >
              Manage Videos ({existingLongVideos.length + existingShorts.length})
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'series'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400/40'
                  : 'bg-red-950/40 text-neutral-400 hover:text-white border border-red-500/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Series & Playlists ({seriesList.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline ml-2 whitespace-nowrap">
            @{currentUser.handle}
          </span>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="bg-red-600/90 text-white text-xs px-4 py-2 text-center font-bold shadow-md">
            {feedbackMessage}
          </div>
        )}

        {/* TAB 1: UPLOAD FLOW */}
        {activeTab === 'upload' && (
          <>
            {/* Format Selector: Short Trailer vs Full Video */}
            <div className="p-3 bg-red-950/20 border-b border-red-500/15 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setContentType('short')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  contentType === 'short'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30'
                    : 'bg-red-950/40 border border-red-500/20 text-neutral-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>30s Short Trailer (▯)</span>
              </button>

              <button
                type="button"
                onClick={() => setContentType('long')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  contentType === 'long'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30'
                    : 'bg-red-950/40 border border-red-500/20 text-neutral-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Full-Length Video (▭)</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Draft Restored Banner */}
              {draftRestored && (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Draft synced from earlier session • Survives app restart & mode switching</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="text-[10px] text-emerald-400 hover:text-white underline cursor-pointer shrink-0 ml-2"
                  >
                    Clear Draft
                  </button>
                </div>
              )}

              {/* AI 1-Tap Trailer Extractor Feature */}
              {contentType === 'short' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 to-rose-950/30 border border-red-500/30 space-y-2 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                      <Sparkles className="w-3.5 h-3.5 text-red-400" />
                      AI Smart Moment Extractor
                    </span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                      Heatmap AI
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Auto-scan retention peaks from your existing catalog and cut a high-conversion 30-second teaser.
                  </p>

                  <button
                    type="button"
                    onClick={handleAiAutoExtract}
                    disabled={isAiGenerating}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/30 cursor-pointer"
                  >
                    {isAiGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing Heatmap Retention Curves...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>1-Tap Extract 30s Trailer from Peak Moment</span>
                      </>
                    )}
                  </button>

                  {aiPeakDetected && (
                    <div className="mt-2 p-2 rounded-xl bg-red-950/50 border border-red-500/40 text-[11px] text-red-200">
                      <span className="font-bold text-white block">
                        ✓ Peak Scene Detected ({aiPeakDetected.start} - {aiPeakDetected.end})
                      </span>
                      {aiPeakDetected.title}
                    </div>
                  )}
                </div>
              )}

              {/* Title with Minimum (5) and Maximum (70) Character Limits */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-300">
                    {contentType === 'short' ? 'Short Trailer Hook / Caption *' : 'Full Video Title *'}
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      title.length > 0 && title.length < 5
                        ? 'text-amber-400'
                        : title.length >= 70
                        ? 'text-rose-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {title.length}/70 chars (Min 5, Max 70)
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  maxLength={70}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    contentType === 'short'
                      ? 'e.g. Something unbelievable happened at minute 4... (Swipe left)'
                      : 'e.g. 14 Days Inside the Frozen Chaddar Gorge: Anamorphic Documentary'
                  }
                  className={`w-full bg-red-950/30 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all ${
                    title.length > 0 && title.length < 5
                      ? 'border-amber-500/60 focus:border-amber-400'
                      : title.length >= 70
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-red-500/25 focus:border-red-400'
                  }`}
                  required
                />
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  {title.length > 0 && title.length < 5 ? (
                    <span className="text-amber-400">
                      ⚠ Need at least {5 - title.length} more character{5 - title.length > 1 ? 's' : ''} (Min: 5)
                    </span>
                  ) : title.length >= 70 ? (
                    <span className="text-rose-400">
                      ⚠ Maximum limit of 70 characters reached
                    </span>
                  ) : (
                    <span className="text-neutral-400">
                      Title fits on 1 line across short and full players
                    </span>
                  )}
                  <span className="text-neutral-500">
                    {70 - title.length} remaining
                  </span>
                </div>
              </div>

              {/* VIDEO THUMBNAIL / COVER PAGE IMAGE (Instagram & YouTube style selection) */}
              <div className="p-3.5 rounded-2xl bg-black/80 border border-red-500/30 space-y-3 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                    <ImageIcon className="w-4 h-4 text-red-400" />
                    <span>Video Thumbnail / Cover Page (Instagram & YouTube)</span>
                  </label>
                  <span className="text-[10px] text-red-300 font-mono bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded-full">
                    {contentType === 'short' ? '9:16 Portrait' : '16:9 Cinema'}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400">
                  Select an auto-extracted video frame or upload a custom cover thumbnail image from your gallery.
                </p>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-5 gap-2 items-center">
                  {/* Upload custom thumbnail button */}
                  <label className="relative aspect-[9/16] sm:aspect-square rounded-xl border border-dashed border-red-500/50 hover:border-red-400 bg-red-950/30 hover:bg-red-900/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all p-1 text-center group shadow-sm">
                    <Camera className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-neutral-300 group-hover:text-white leading-tight">
                      + Custom Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomThumbnailUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Frame presets */}
                  {(contentType === 'short' ? shortThumbnailPresets : longThumbnailPresets).map((preset, idx) => {
                    const activePreset = selectedThumbnail || (contentType === 'short' ? shortThumbnailPresets[0] : longThumbnailPresets[0]);
                    const isSelected = activePreset === preset;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedThumbnail(preset)}
                        className={`relative ${
                          contentType === 'short' ? 'aspect-[9/16]' : 'aspect-video sm:aspect-square'
                        } rounded-xl overflow-hidden cursor-pointer border transition-all ${
                          isSelected
                            ? 'border-red-500 ring-2 ring-red-500/50 scale-105 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                            : 'border-white/10 opacity-70 hover:opacity-100 hover:border-red-500/40'
                        }`}
                      >
                        <img src={preset} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                              ✓
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-white">
                          F{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cover preview info */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/25">
                  <div className={`relative ${contentType === 'short' ? 'w-10 h-16' : 'w-20 h-12'} rounded-lg overflow-hidden border border-red-500/30 shrink-0 bg-neutral-900`}>
                    <img
                      src={selectedThumbnail || (contentType === 'short' ? shortThumbnailPresets[0] : longThumbnailPresets[0])}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-bold text-white block truncate">
                      Active Cover Thumbnail:
                    </span>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {selectedThumbnail.startsWith('data:')
                        ? 'Custom cover artwork loaded from device ✓'
                        : 'Video frame cover selected for high click-through rate ✓'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description (with Clickable Links support) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-300">
                    Description & Context (URLs automatically clickable)
                  </label>
                  <span className="text-[10px] text-red-400/80 font-mono">
                    Markdown / Links supported
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Tell your audience about this video. Any links (https://...) you paste here will be clickable for viewers!"
                  className="w-full bg-red-950/30 border border-red-500/25 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Dedicated External Website / Project Link */}
              <div>
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1">
                  <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                  <span>Featured Project / Website Link (Optional)</span>
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://yourwebsite.com or https://kickstarter.com/..."
                  className="w-full bg-red-950/30 border border-red-500/25 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400 font-mono"
                />
              </div>

              {/* CONTEXTUAL INTENT ACTION & LOCATION (FLYNK Distinctive Feature) */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-['Syne'] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intent Action & Location (Transform Engagement to Action)</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    High Conversion
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                      Action Button on Content
                    </label>
                    <select
                      value={intentActionType}
                      onChange={(e) => setIntentActionType(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="none">No Intent Button (Standard Likes/Comments)</option>
                      <option value="save_place">Save Place (Travel / Scenic Spot)</option>
                      <option value="get_directions">Directions & Menu (Food & Cafe)</option>
                      <option value="view_product">View Product (Fashion & Merch)</option>
                      <option value="request_quote">Request Quote (Professional / Freelance)</option>
                      <option value="book_appointment">Book Consultation (Doctor / Clinic)</option>
                      <option value="book_site_visit">Book Site Visit (Real Estate Villa)</option>
                      <option value="reserve_table">Reserve Table (Restaurant / Dining)</option>
                      <option value="watch_full_video">Watch Full Video (Creator Episode)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                      Location Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={locationTag}
                      onChange={(e) => setLocationTag(e.target.value)}
                      placeholder="e.g. Jubilee Hills, Hyderabad"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings: "More Options" toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowMoreOptions((prev) => !prev)}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                    <span>More Options (Collaborator, Anti-Piracy License, Visibility)</span>
                  </span>
                  <span className="text-[11px] font-mono text-red-400">
                    {showMoreOptions ? '− Collapse' : '+ Expand'}
                  </span>
                </button>
              </div>

              {showMoreOptions && (
                <div className="space-y-4 pt-1 animate-fade-in">
                  {/* Instagram-Style Collaborator Selection */}
                  <div>
                    <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tag Collaborator (Instagram Co-Author Style)</span>
                    </label>
                    <p className="text-[11px] text-neutral-400 mb-1.5">
                      Both creator handles will appear together (@you x @collaborator) and share video discovery.
                    </p>
                    <select
                      value={selectedCollaboratorId}
                      onChange={(e) => setSelectedCollaboratorId(e.target.value)}
                      className="w-full bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400 cursor-pointer font-mono"
                    >
                      <option value="">-- No Collaborator (Solo Creator) --</option>
                      {allCreators
                        .filter((c) => c.id !== currentUser.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            @{c.handle} ({c.name}) - {c.role}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* ORIGINAL CONTENT OWNERSHIP & PRIVACY SETTINGS */}
                  <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3 backdrop-blur-xl">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Original Content Declaration (Anti-Piracy)</span>
                      </label>
                      <p className="text-[11px] text-neutral-400 mb-2">
                        Declare ownership to prevent unauthorized re-uploads by 3rd-party rippers.
                      </p>
                      <div
                        onClick={() =>
                          setAttachedDocumentName(
                            attachedDocumentName
                              ? null
                              : `License-RAW-Footage-Declaration-${currentUser.handle}.pdf`
                          )
                        }
                        className="p-2.5 rounded-xl bg-red-950/40 border border-dashed border-red-500/40 hover:border-red-500/70 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-neutral-300">
                          <FileText className="w-3.5 h-3.5 text-red-400" />
                          <span className="truncate">
                            {attachedDocumentName || 'Attach Rights License or Ownership Certificate (PDF)'}
                          </span>
                        </div>
                        <span className="text-[10px] text-red-400 font-bold font-mono">
                          {attachedDocumentName ? 'Attached ✓' : '+ Upload'}
                        </span>
                      </div>
                    </div>

                    {/* Privacy Visibility: Public vs Private vs Unlisted */}
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Privacy Setting
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setVisibility('public')}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            visibility === 'public'
                              ? 'border-red-500 bg-red-600/30 text-white shadow-sm'
                              : 'border-red-500/20 bg-red-950/20 text-neutral-400'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Public</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVisibility('unlisted')}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            visibility === 'unlisted'
                              ? 'border-red-500 bg-red-600/30 text-white shadow-sm'
                              : 'border-red-500/20 bg-red-950/20 text-neutral-400'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Unlisted</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVisibility('private')}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            visibility === 'private'
                              ? 'border-red-500 bg-red-600/30 text-white shadow-sm'
                              : 'border-red-500/20 bg-red-950/20 text-neutral-400'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Private</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {publishedSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Published successfully to FLYNK live feed!</span>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow-[0_4px_25px_rgba(220,38,38,0.45)] border border-red-400/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {contentType === 'short'
                    ? 'Publish 30s Short Trailer with Full Link'
                    : 'Publish Full-Length Video to Catalog'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* TAB 2: MANAGE MY VIDEOS (CONNECT SHORTS, CHANGE PRIVACY, DELETE) */}
        {activeTab === 'manage' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
                Your Published Catalog & Attached Trailers
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Connect or disconnect your 30-second shorts to your full videos with one click anytime. Manage privacy or delete videos you uploaded.
              </p>
            </div>

            {/* List of Long Videos */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-red-400 font-['Syne'] block">
                Full-Length Videos ({existingLongVideos.length})
              </span>

              {existingLongVideos.map((lv) => (
                <div
                  key={lv.id}
                  className="p-3 rounded-2xl bg-red-950/25 border border-red-500/20 space-y-2.5 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={lv.thumbnailUrl}
                        alt=""
                        className="w-16 h-11 rounded-xl object-cover border border-red-500/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate font-['Syne']">
                          {lv.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                          <span>{lv.durationFormatted}</span>
                          <span>•</span>
                          <span>{lv.viewsCount.toLocaleString()} views</span>
                          <span>•</span>
                          <span className="text-emerald-400 uppercase font-semibold">
                            {lv.visibility || 'public'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Privacy toggle */}
                      {onTogglePrivacy && (
                        <button
                          onClick={() => {
                            const newVis = lv.visibility === 'private' ? 'public' : 'private';
                            onTogglePrivacy(lv.id, 'long', newVis);
                            showFeedback(`Privacy updated to ${newVis}!`);
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-neutral-300 hover:text-white border border-red-500/20 text-[10px] flex items-center gap-1 cursor-pointer"
                          title="Toggle Privacy"
                        >
                          {lv.visibility === 'private' ? (
                            <>
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>Private</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 text-emerald-400" />
                              <span>Public</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Delete video */}
                      {onDeleteVideo && (
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this video from your catalog? This cannot be undone.')) {
                              onDeleteVideo(lv.id, 'long');
                              showFeedback('Video deleted from catalog.');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 border border-red-500/20 cursor-pointer"
                          title="Delete Video (Creator Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* List of Short Trailers */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-red-400 font-['Syne'] block">
                30-Second Short Trailers ({existingShorts.length})
              </span>

              {existingShorts.map((short) => {
                const isConnected = !!short.linkedLongVideoId;
                return (
                  <div
                    key={short.id}
                    className="p-3 rounded-2xl bg-red-950/25 border border-red-500/20 space-y-2.5 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={short.thumbnailUrl}
                          alt=""
                          className="w-10 h-14 rounded-xl object-cover border border-red-500/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate font-['Syne']">
                            {short.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">
                            {short.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono mt-1">
                            {isConnected ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                <Link2 className="w-3 h-3" />
                                <span>Attached to Full Video</span>
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                                <Unlink className="w-3 h-3" />
                                <span>Standalone Short</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {/* 1-Click Connect / Disconnect */}
                        {onConnectShortToLong && (
                          <select
                            value={short.linkedLongVideoId || ''}
                            onChange={(e) => {
                              const targetLongId = e.target.value || null;
                              onConnectShortToLong(short.id, targetLongId);
                              showFeedback(
                                targetLongId
                                  ? 'Connected short to full video with 1 click!'
                                  : 'Disconnected short.'
                              );
                            }}
                            className="bg-red-950/70 border border-red-500/30 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-red-400 font-mono cursor-pointer"
                          >
                            <option value="">-- Disconnected (Standalone) --</option>
                            {existingLongVideos.map((lv) => (
                              <option key={lv.id} value={lv.id}>
                                Connect to: {lv.title.slice(0, 24)}…
                              </option>
                            ))}
                          </select>
                        )}

                        {onDeleteVideo && (
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this short trailer?')) {
                                onDeleteVideo(short.id, 'short');
                                showFeedback('Short trailer deleted.');
                              }
                            }}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SERIES & PLAYLISTS MANAGEMENT (Binge-Viewing Narrative Engine) */}
        {activeTab === 'series' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Top Header & Create CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/20 border border-red-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-['Syne']">
                    Series & Playlists (Binge Viewing Engine)
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed max-w-md">
                  Organize your long-form videos and 30s Flicks into ordered narratives (e.g. Learn Photoshop, Goa Trip, Hyderabad Food, Startup Journey) for seamless binge playback.
                </p>
              </div>

              {!isCreatingSeries && (
                <button
                  type="button"
                  onClick={handleStartCreateSeries}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 cursor-pointer shrink-0 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Create Series</span>
                </button>
              )}
            </div>

            {/* CREATE / EDIT SERIES FORM */}
            {isCreatingSeries ? (
              <form onSubmit={handleSaveSeries} className="p-4 rounded-2xl bg-black/80 border border-red-500/40 space-y-4 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-red-400" />
                    <h4 className="text-xs font-bold text-white font-['Syne']">
                      {editingSeriesId ? 'Edit Series & Sequence' : 'Create New Named Series'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSeries(false);
                      setEditingSeriesId(null);
                    }}
                    className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Series Title */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Series Title *
                  </label>
                  <input
                    type="text"
                    value={seriesTitle}
                    onChange={(e) => setSeriesTitle(e.target.value)}
                    placeholder="e.g. Hyderabad Food Series, Goa Trip, Learn Photoshop"
                    className="w-full bg-red-950/30 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400"
                    required
                  />
                </div>

                {/* Category & Cover Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={seriesCategory}
                      onChange={(e) => setSeriesCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="Cinema & Travel">Cinema & Travel</option>
                      <option value="Culinary Masterclass">Culinary Masterclass</option>
                      <option value="Technology & Startup">Technology & Startup</option>
                      <option value="Fashion & Design">Fashion & Design</option>
                      <option value="Creative Education">Creative Education</option>
                      <option value="Music & Performance">Music & Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Cover Artwork Image URL
                    </label>
                    <input
                      type="url"
                      value={seriesCover}
                      onChange={(e) => setSeriesCover(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-red-950/30 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Series Description
                  </label>
                  <textarea
                    value={seriesDescription}
                    onChange={(e) => setSeriesDescription(e.target.value)}
                    rows={2}
                    placeholder="Describe this series storyline, lessons, or travel route..."
                    className="w-full bg-red-950/30 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400"
                  />
                </div>

                {/* STEP A: Select Videos & Flicks to Include */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                      <span>1. Select Videos to Include in Series</span>
                      <span className="text-[10px] text-red-400 font-mono">
                        ({seriesContentItems.length} selected)
                      </span>
                    </label>

                    {/* Filter buttons */}
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setSeriesFilterType('all')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          seriesFilterType === 'all'
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeriesFilterType('long')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          seriesFilterType === 'long'
                            ? 'bg-sky-600 text-white font-bold'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Full (▭)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeriesFilterType('short')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          seriesFilterType === 'short'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Flicks (▯)
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400">
                    Mix both long-form master videos and high-energy Flicks. Click any item to add or remove it from the series.
                  </p>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {/* Long Videos */}
                    {(seriesFilterType === 'all' || seriesFilterType === 'long') &&
                      existingLongVideos.map((lv) => {
                        const isSelected = seriesContentItems.includes(lv.id);
                        return (
                          <div
                            key={lv.id}
                            onClick={() => handleToggleContentInSeries(lv.id)}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-sky-950/40 border-sky-500/60 shadow-sm'
                                : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={lv.thumbnailUrl}
                                alt=""
                                className="w-12 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] text-sky-400 font-mono font-bold block">
                                  Full Video (▭) • {lv.durationFormatted}
                                </span>
                                <h5 className="text-xs font-bold text-white truncate">
                                  {lv.title}
                                </h5>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-sky-500 border-sky-400 text-white'
                                  : 'border-neutral-700 bg-black/40 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </div>
                        );
                      })}

                    {/* Short Flicks */}
                    {(seriesFilterType === 'all' || seriesFilterType === 'short') &&
                      existingShorts.map((short) => {
                        const isSelected = seriesContentItems.includes(short.id);
                        return (
                          <div
                            key={short.id}
                            onClick={() => handleToggleContentInSeries(short.id)}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-rose-950/40 border-rose-500/60 shadow-sm'
                                : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={short.thumbnailUrl}
                                alt=""
                                className="w-7 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] text-rose-400 font-mono font-bold block">
                                  Flick (▯) • 0:30
                                </span>
                                <h5 className="text-xs font-bold text-white truncate">
                                  {short.title}
                                </h5>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-rose-500 border-rose-400 text-white'
                                  : 'border-neutral-700 bg-black/40 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* STEP B: Reorder Sequence / Episodes */}
                <div className="space-y-2 pt-2 border-t border-red-500/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                      <ListOrdered className="w-4 h-4 text-amber-400" />
                      <span>2. Reorder Sequence & Episode Order</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      <GripVertical className="w-3 h-3" />
                      <span>Drag & Drop Enabled</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 bg-neutral-900/60 p-2 rounded-xl border border-neutral-800/80">
                    <GripVertical className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      Drag any episode card by the grip handle to reposition it, or use the <strong>↑</strong> and <strong>↓</strong> buttons.
                    </span>
                  </p>

                  {seriesContentItems.length === 0 ? (
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800 text-center text-xs text-neutral-400">
                      Select videos from section 1 above to sequence your series episodes.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                      {seriesContentItems.map((contentId, index) => {
                        const detail = getContentItemDetail(contentId);
                        const isFirst = index === 0;
                        const isLast = index === seriesContentItems.length - 1;
                        const isDragging = draggedItemIndex === index;
                        const isOver = dragOverIndex === index && !isDragging;

                        return (
                          <div
                            key={contentId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 shadow-sm transition-all group select-none cursor-grab active:cursor-grabbing ${
                              isDragging
                                ? 'opacity-40 scale-[0.98] border-amber-500/70 bg-amber-950/40 ring-2 ring-amber-500/50'
                                : isOver
                                ? 'border-amber-400 bg-amber-950/30 scale-[1.01] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                : 'bg-neutral-900 border-neutral-800 hover:border-amber-500/40 hover:bg-neutral-850'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Drag Handle Grip Icon */}
                              <div
                                className="p-1 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0"
                                title="Drag to reorder episode"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
                                {index + 1}
                              </span>

                              {detail.thumbnailUrl ? (
                                <img
                                  src={detail.thumbnailUrl}
                                  alt=""
                                  className="w-10 h-7 rounded object-cover border border-white/10 shrink-0"
                                />
                              ) : null}

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                      detail.type === 'long'
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    }`}
                                  >
                                    {detail.typeLabel}
                                  </span>
                                  {detail.duration && (
                                    <span className="text-[10px] text-neutral-400 font-mono">
                                      {detail.duration}
                                    </span>
                                  )}
                                </div>
                                <h6 className="text-xs font-semibold text-white truncate">
                                  {detail.title}
                                </h6>
                              </div>
                            </div>

                            {/* Reorder Buttons: Up, Down, Remove */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveSeriesItem(index, 'up')}
                                disabled={isFirst}
                                className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
                                title="Move Earlier in Sequence"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMoveSeriesItem(index, 'down')}
                                disabled={isLast}
                                className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
                                title="Move Later in Sequence"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveSeriesItem(contentId)}
                                className="w-6 h-6 rounded-md bg-red-950/60 hover:bg-rose-900/60 text-red-300 flex items-center justify-center cursor-pointer transition-colors ml-1"
                                title="Remove from Series"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {editingSeriesId ? 'Save Sequence & Changes' : 'Create & Publish Series'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSeries(false);
                      setEditingSeriesId(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold border border-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* LIST OF CREATOR'S SERIES */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 font-['Syne'] block">
                    Curated Series ({seriesList.length})
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Shown prominently on your profile
                  </span>
                </div>

                {seriesList.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-neutral-900/30 border border-dashed border-neutral-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Syne']">
                        No Series Created Yet
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                        Group your episodes and short clips into named playlists to build cohesive narratives and boost viewer retention.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartCreateSeries}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      + Create First Series
                    </button>
                  </div>
                ) : (
                  seriesList.map((series) => {
                    const isOwner = series.creatorId === currentUser.id;
                    return (
                      <div
                        key={series.id}
                        className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/20 hover:border-red-500/40 space-y-3 backdrop-blur-xl transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {series.coverImage ? (
                              <img
                                src={series.coverImage}
                                alt={series.title}
                                className="w-16 h-16 rounded-xl object-cover border border-red-500/30 shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                                <Layers className="w-6 h-6" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold">
                                  {series.category || 'Series'}
                                </span>
                                {series.totalDuration && (
                                  <span className="text-[10px] text-neutral-400 font-mono">
                                    • {series.totalDuration}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-white truncate font-['Syne'] mt-1">
                                {series.title}
                              </h4>
                              <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                                {series.description}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-1">
                                <span className="text-emerald-400 font-bold">
                                  {series.contentItems.length} Episode{series.contentItems.length !== 1 ? 's' : ''} sequenced
                                </span>
                                <span>•</span>
                                <span>Updated {series.updatedAt || 'Recently'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions: Edit Sequence, Delete */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditSeries(series)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-white text-xs font-bold border border-red-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Edit Sequence"
                            >
                              <Edit3 className="w-3 h-3 text-red-400" />
                              <span>Edit</span>
                            </button>

                            {onDeleteSeries && isOwner && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete series "${series.title}"?`)) {
                                    onDeleteSeries(series.id);
                                    showFeedback('Series deleted.');
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 border border-red-500/20 cursor-pointer transition-colors"
                                title="Delete Series"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Sequence preview badges */}
                        <div className="pt-2 border-t border-red-500/15">
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            {series.contentItems.map((cId, epIdx) => {
                              const item = getContentItemDetail(cId);
                              return (
                                <div
                                  key={cId}
                                  className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 flex items-center gap-1.5 text-[10px]"
                                >
                                  <span className="font-bold text-red-400 font-mono">
                                    Ep {epIdx + 1}:
                                  </span>
                                  <span
                                    className={`px-1 py-0.2 rounded font-mono text-[9px] ${
                                      item.type === 'long'
                                        ? 'bg-sky-500/20 text-sky-300'
                                        : 'bg-rose-500/20 text-rose-300'
                                    }`}
                                  >
                                    {item.type === 'long' ? 'Full' : 'Flick'}
                                  </span>
                                  <span className="text-white max-w-[100px] truncate">
                                    {item.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
