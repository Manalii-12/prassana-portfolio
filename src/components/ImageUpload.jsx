"use client";

import { useState, useRef } from "react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ImageUpload({
  label = "Upload Image",
  value = "",
  onChange,
  required = false,
  presetOptions = [],
  helperText = "Supports JPG, PNG, WebP (up to 15MB)",
  compact = false,
}) {
  const { isDark } = useAdminTheme();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image size exceeds 15MB limit.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.message || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error: Could not connect to backend upload service.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label & Toggle */}
      <div className="flex items-center justify-between gap-1">
        <label className="block text-xs uppercase font-bold opacity-75 truncate">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-orange-500 hover:underline flex items-center gap-1 font-medium shrink-0"
        >
          <LinkIcon size={11} />
          <span>{showManualUrl ? "Upload File" : compact ? "URL / Preset" : "Or enter URL / Preset"}</span>
        </button>
      </div>

      {/* Manual URL Input (Optional / Collapsible) */}
      {showManualUrl && (
        <div className="space-y-1.5 animate-fadeIn">
          <input
            type="text"
            placeholder="/images/hero.png or https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none transition ${
              isDark
                ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
            }`}
          />
          {presetOptions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presetOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 font-medium transition cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Zone / Preview */}
      {!value ? (
        // Empty State: Click or Drag to Upload
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl ${
            compact ? "p-4 aspect-square" : "p-6"
          } text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-orange-500 bg-orange-500/10 scale-[1.01]"
              : isDark
              ? "border-gray-700 hover:border-orange-500/60 bg-[#131B2E]/60 hover:bg-[#131B2E]"
              : "border-slate-300 hover:border-orange-500/60 bg-slate-50 hover:bg-slate-100/80"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
              <p className="text-xs font-bold text-orange-500">Uploading Image...</p>
              <p className="text-[10px] opacity-60">Saving to server</p>
            </div>
          ) : (
            <>
              <div
                className={`${
                  compact ? "w-10 h-10 rounded-xl" : "w-12 h-12 rounded-2xl"
                } flex items-center justify-center transition ${
                  isDark ? "bg-white/5 text-orange-400" : "bg-orange-50 text-orange-500"
                }`}
              >
                <UploadCloud className={compact ? "w-5 h-5" : "w-6 h-6"} />
              </div>
              <div>
                <p className="text-xs font-bold text-current">
                  {compact ? "Click or Drag Image" : "Click to browse or drag & drop image"}
                </p>
                <p className="text-[10px] opacity-60 mt-0.5">{helperText}</p>
              </div>
              {!compact && (
                <button
                  type="button"
                  className="mt-1 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow-md"
                >
                  Select Image File
                </button>
              )}
            </>
          )}
        </div>
      ) : compact ? (
        // Compact Grid State: Square preview with side-by-side action buttons
        <div
          className={`relative rounded-2xl border p-3 flex flex-col items-stretch gap-2.5 transition ${
            isDark ? "bg-[#131B2E] border-gray-700" : "bg-slate-50 border-slate-200"
          }`}
        >
          {/* Square Image Thumbnail */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-green-400 border border-green-500/30">
              <CheckCircle2 size={11} />
              <span>Ready</span>
            </div>
            {value.startsWith("http://localhost:5000/uploads/") && (
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-green-500 text-black text-[9px] font-bold">
                Uploaded
              </span>
            )}
          </div>

          {/* Details & Actions */}
          <div className="w-full space-y-1.5 min-w-0">
            <p className="text-[10px] font-mono opacity-50 truncate" title={value}>
              {value}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-500 text-xs font-bold transition cursor-pointer"
              >
                {uploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Standard Value Selected: Display Thumbnail with Actions
        <div
          className={`relative rounded-2xl border p-3 flex flex-col sm:flex-row items-center gap-4 transition ${
            isDark ? "bg-[#131B2E] border-gray-700" : "bg-slate-50 border-slate-200"
          }`}
        >
          {/* Image Thumbnail */}
          <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition group-hover:scale-105"
            />
            {value.startsWith("http://localhost:5000/uploads/") && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-green-500 text-black text-[9px] font-bold">
                Uploaded
              </span>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 w-full space-y-2 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
              <CheckCircle2 size={14} />
              <span>Image Ready</span>
            </div>
            <p className="text-[11px] font-mono opacity-60 truncate max-w-xs sm:max-w-md">
              {value}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-500 text-xs font-semibold transition cursor-pointer"
              >
                {uploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                <span>Change File</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
