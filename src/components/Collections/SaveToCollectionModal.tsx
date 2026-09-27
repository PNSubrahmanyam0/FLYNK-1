import React, { useState } from 'react';
import { X, Plus, Check, Bookmark, Globe, Lock, FolderPlus } from 'lucide-react';
import { Collection, CollectionItem } from '../../types';

interface SaveToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: {
    id: string;
    itemType: any;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    metadata?: string;
  } | null;
  item?: {
    id: string;
    itemType: any;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    metadata?: string;
  } | null;
  collections: Collection[];
  onToggleItemInCollection?: (collectionId: string, item: CollectionItem) => void;
  onSaveToCollection?: (collectionId: string, item: CollectionItem) => void;
  onCreateCollection: (name: string, isPublicOrEmoji: any, optionalEmoji?: any) => any;
}

const EMOJI_PRESETS = ['📍', '🍛', '🧥', '🛍️', '🌴', '💍', '🏋️', '🎬', '💡', '✨'];

export const SaveToCollectionModal: React.FC<SaveToCollectionModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  item,
  collections,
  onToggleItemInCollection,
  onSaveToCollection,
  onCreateCollection,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionEmoji, setNewCollectionEmoji] = useState('✨');
  const [isPublic, setIsPublic] = useState(false);

  const activeTarget = targetItem || item;
  if (!isOpen || !activeTarget) return null;

  const saveAction = onSaveToCollection || onToggleItemInCollection;

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newId = onCreateCollection(newCollectionName.trim(), isPublic, newCollectionEmoji);

    const collectionItem: CollectionItem = {
      id: `ci_${Date.now()}`,
      itemType: activeTarget.itemType,
      itemId: activeTarget.id,
      title: activeTarget.title,
      subtitle: activeTarget.subtitle,
      imageUrl: activeTarget.imageUrl,
      metadata: activeTarget.metadata,
      addedAt: 'Just now',
    };

    if (newId && saveAction) {
      saveAction(newId, collectionItem);
    }
    setNewCollectionName('');
    setIsCreatingNew(false);
  };

  const handleItemToggle = (collection: Collection) => {
    const collectionItem: CollectionItem = {
      id: `ci_${Date.now()}`,
      itemType: activeTarget.itemType,
      itemId: activeTarget.id,
      title: activeTarget.title,
      subtitle: activeTarget.subtitle,
      imageUrl: activeTarget.imageUrl,
      metadata: activeTarget.metadata,
      addedAt: 'Just now',
    };
    if (saveAction) {
      saveAction(collection.id, collectionItem);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md bg-[#0d040a] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-red-500 fill-red-500" />
            <div>
              <h3 className="font-bold text-sm text-white font-['Syne']">Save to Collection</h3>
              <p className="text-[11px] text-neutral-400">Organize places, flicks, products & talent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="p-3 mx-4 mt-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex items-center gap-3">
          <img
            src={activeTarget.imageUrl}
            alt={activeTarget.title}
            className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs text-white truncate font-['Syne']">
              {activeTarget.title}
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              {activeTarget.subtitle || activeTarget.itemType.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Collections List */}
        <div className="p-4 space-y-2 overflow-y-auto no-scrollbar flex-1">
          {collections.map((col) => {
            const isSavedInCol = col.items.some(
              (it) => it.itemId === activeTarget.id || it.title === activeTarget.title
            );
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => handleItemToggle(col)}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                  isSavedInCol
                    ? 'bg-red-950/20 border-red-500/50 text-white'
                    : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{col.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate flex items-center gap-1.5">
                      <span>{col.name}</span>
                      {col.isPublic ? (
                        <Globe className="w-3 h-3 text-neutral-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-neutral-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {col.items.length} {col.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSavedInCol
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'border-neutral-700 bg-neutral-800'
                  }`}
                >
                  {isSavedInCol && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* New Collection Form / Button */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 shrink-0">
          {!isCreatingNew ? (
            <button
              type="button"
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-neutral-700 hover:border-red-500 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 text-xs font-bold font-['Syne'] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Collection</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAndAdd} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name (e.g. Hyderabad Street Food)"
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              {/* Emoji bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {EMOJI_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewCollectionEmoji(emoji)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                      newCollectionEmoji === emoji
                        ? 'bg-red-500/30 border border-red-500'
                        : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Public vs Private toggle */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span>Make Public (Shareable on FLYNK)</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Syne'] shadow-md shadow-red-600/30 disabled:opacity-50"
                >
                  Create & Save
                </button>
              </div>
            </form>
          )}

          <div className="mt-3 text-center">
            <button
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
