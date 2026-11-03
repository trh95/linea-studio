/**
 * Linea Studio - Admin Portfolio Management Component
 * Supports file upload / drag-and-drop, category tagging, deletion, and reordering.
 */

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { apiService } from '../services/apiService';

interface PortfolioUploadProps {
  portfolio: PortfolioItem[];
  onRefresh: () => void;
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ portfolio, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Természetes' | 'Elegáns' | 'Volume' | 'Különleges & Wispy'>('Természetes');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Kérjük, kizárólag képet válassz ki (JPG, PNG, WebP).' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setStatusMessage({ type: 'error', text: 'Kérjük, tölts fel egy képet.' });
      return;
    }
    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Kérjük, add meg a kép címét.' });
      return;
    }

    try {
      setIsUploading(true);
      await apiService.addPortfolioImage({
        title,
        category,
        image_url: previewUrl,
        description,
        sort_order: portfolio.length + 1,
        is_visible: true,
      });

      setStatusMessage({ type: 'success', text: 'A fotó sikeresen hozzáadva a nyilvános portfólióhoz!' });
      setTitle('');
      setDescription('');
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onRefresh();

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Hiba a kép mentése során.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a képet a portfólióból?')) return;
    try {
      await apiService.deletePortfolioImage(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div className="bg-white border border-[#E8E5DD] p-6 md:p-8 rounded-sm shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <UploadCloud className="w-5 h-5 text-[#C6A86A]" />
          <h3 className="font-serif text-lg font-bold text-[#001D50]">
            Új Munka Feltöltése a Portfólióba
          </h3>
        </div>

        {statusMessage && (
          <div
            className={`p-4 mb-6 rounded-xs text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Drag & drop upload area */}
          <div className="md:col-span-5">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all h-64 flex flex-col items-center justify-center relative overflow-hidden ${
                dragActive
                  ? 'border-[#C6A86A] bg-[#C6A86A]/10'
                  : 'border-[#E8E5DD] hover:border-[#C6A86A] bg-[#F8F7F2]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                className="hidden"
              />

              {previewUrl ? (
                <div className="w-full h-full relative group">
                  <img
                    src={previewUrl}
                    alt="Feltöltött előnézet"
                    className="w-full h-full object-cover rounded-xs"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    Kattints a cseréhez
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#C6A86A] mx-auto shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-[#001D50]">
                    Húzd ide a fotót vagy kattints
                  </p>
                  <p className="text-[11px] text-[#001D50]/60">
                    JPG, PNG vagy WebP (ajánlott: 800×800 px)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata form - MOBIL-OPTIMALIZÁLÁS (4. Elvárás): text-base md:text-xs (16px mobilon az auto-zoom ellen) és (3. Irányelv): min-h-[44px] touch target */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
                Kép Megnevezése / Címe *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pl. 3D Soft Light Volume Szett"
                className="w-full px-3.5 py-3 min-h-[44px] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-base md:text-xs text-[#001D50] rounded-xl outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
                Kategória *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'Természetes' | 'Elegáns' | 'Volume' | 'Különleges & Wispy')
                }
                className="w-full px-3.5 py-3 min-h-[44px] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-base md:text-xs text-[#001D50] rounded-xl outline-none cursor-pointer transition-colors"
              >
                <option value="Természetes">Természetes</option>
                <option value="Elegáns">Elegáns</option>
                <option value="Volume">Volume</option>
                <option value="Különleges & Wispy">Különleges & Wispy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
                Leírás / Styling paraméterek (opcionális)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Pl. C és D ív, 9-12 mm, szupervékony 0.07 mm selyem pillák..."
                className="w-full p-3.5 min-h-[96px] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-base md:text-xs text-[#001D50] rounded-xl outline-none resize-none font-sans transition-colors"
              />
            </div>

            {/* MOBIL-OPTIMALIZÁLÁS (3. Irányelv): Érintésbarát akció gomb legalább 44px magassággal */}
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center justify-center gap-2 w-full min-h-[44px] py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] active:scale-[0.99] transition-all rounded-xl shadow-xs disabled:opacity-60 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C6A86A]" />
              <span>{isUploading ? 'Mentés...' : 'Fotó Hozzáadása a Portfólióhoz'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing portfolio items */}
      <div className="bg-white border border-[#E8E5DD] p-6 md:p-8 rounded-sm shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-bold text-[#001D50]">
            Jelenlegi Portfólió Képek ({portfolio.length} db)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((img) => (
            <div
              key={img.id}
              className="border border-[#E8E5DD] rounded-sm overflow-hidden bg-[#F8F7F2] group hover:border-[#C6A86A] transition-all"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-[#001D50]/90 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs tracking-wider">
                  {img.category}
                </div>
              </div>

              <div className="p-4 bg-white">
                <h4 className="font-serif text-sm font-bold text-[#001D50] truncate">{img.title}</h4>
                {img.description && (
                  <p className="text-xs text-[#001D50]/70 mt-1 line-clamp-2 font-sans">
                    {img.description}
                  </p>
                )}

                {/* MOBIL-OPTIMALIZÁLÁS (3. Irányelv): Érintésbarát kártya akció gomb min-h-[44px] mérettel */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8E5DD]">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    #{img.id}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50/80 active:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Törlés</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
