"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  /** Current image URL */
  value?: string | null;
  /** Callback when image is uploaded */
  onChange: (url: string | null) => void;
  /** Storage bucket name */
  bucket?: string;
  /** Folder path within bucket */
  folder?: string;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Accepted file types */
  accept?: string;
  /** Shape of the upload area */
  shape?: "circle" | "square" | "rectangle";
  /** Size of the upload area */
  size?: "sm" | "md" | "lg";
  /** Show remove button */
  showRemove?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const sizeClasses = {
  sm: { container: "w-20 h-20", icon: "h-6 w-6" },
  md: { container: "w-32 h-32", icon: "h-8 w-8" },
  lg: { container: "w-40 h-40", icon: "h-10 w-10" },
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-2xl",
  rectangle: "rounded-2xl aspect-video w-full h-auto",
};

/**
 * Image Upload Component
 * Handles file selection, upload to Supabase Storage, and preview
 */
export function ImageUpload({
  value,
  onChange,
  bucket = "images",
  folder = "uploads",
  maxSizeMB = 2,
  accept = "image/png,image/jpeg,image/webp",
  shape = "circle",
  size = "md",
  showRemove = true,
  placeholder = "העלה תמונה",
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const sizeClass = sizeClasses[size];
  const shapeClass = shapeClasses[shape];

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      const allowedTypes = accept.split(",").map((t) => t.trim());
      if (!allowedTypes.includes(file.type)) {
        setError("סוג קובץ לא נתמך. השתמש ב-PNG, JPG או WebP");
        return;
      }

      // Validate file size
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`הקובץ גדול מדי. מקסימום ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);

      try {
        // Generate unique filename
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError("שגיאה בהעלאת הקובץ. נסה שוב.");
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        onChange(urlData.publicUrl);
      } catch (err) {
        console.error("Upload error:", err);
        setError("שגיאה בהעלאת הקובץ. נסה שוב.");
      } finally {
        setIsUploading(false);
      }
    },
    [supabase, bucket, folder, maxSizeMB, accept, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    if (!value || disabled) return;

    // Extract path from URL to delete from storage
    try {
      const url = new URL(value);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      if (pathMatch) {
        const [, bucketName, filePath] = pathMatch;
        await supabase.storage.from(bucketName).remove([filePath]);
      }
    } catch (err) {
      console.error("Error removing file:", err);
    }

    onChange(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden cursor-pointer
          ${shape === "rectangle" ? "w-full" : sizeClass.container}
          ${shapeClass}
          ${dragActive ? "ring-4 ring-amber-300 border-amber-400" : "border-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-amber-400 hover:bg-amber-50/50"}
          ${value ? "" : "border-2 border-dashed bg-gray-50"}
          transition-all duration-200
        `}
      >
        {/* Image preview */}
        {value ? (
          <img
            src={value}
            alt="Uploaded"
            className={`w-full h-full object-cover ${shapeClass}`}
          />
        ) : (
          <div className={`flex flex-col items-center justify-center h-full p-4 ${shape === "rectangle" ? "py-12" : ""}`}>
            {isUploading ? (
              <Loader2 className={`${sizeClass.icon} text-amber-500 animate-spin`} />
            ) : (
              <>
                <ImageIcon className={`${sizeClass.icon} text-gray-400 mb-2`} />
                <span className="text-xs text-gray-500 text-center">{placeholder}</span>
              </>
            )}
          </div>
        )}

        {/* Overlay on hover when image exists */}
        {value && !isUploading && !disabled && (
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="h-8 w-8 text-white" />
          </div>
        )}

        {/* Loading overlay */}
        {isUploading && value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Remove button */}
      {value && showRemove && !disabled && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Size hint */}
      {!value && !error && (
        <p className="mt-2 text-xs text-gray-400 text-center">
          מקסימום {maxSizeMB}MB, PNG/JPG
        </p>
      )}
    </div>
  );
}

/**
 * Gallery Upload Component
 * For uploading multiple images (e.g., business gallery)
 */
interface GalleryUploadProps {
  /** Current image URLs */
  values: string[];
  /** Callback when images change */
  onChange: (urls: string[]) => void;
  /** Maximum number of images */
  maxImages?: number;
  /** Storage bucket name */
  bucket?: string;
  /** Folder path within bucket */
  folder?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function GalleryUpload({
  values = [],
  onChange,
  maxImages = 10,
  bucket = "images",
  folder = "gallery",
  disabled = false,
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (files: FileList) => {
    if (values.length >= maxImages) {
      setError(`מקסימום ${maxImages} תמונות`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (values.length + newUrls.length >= maxImages) break;

      // Validate file type
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        continue;
      }

      // Validate file size (max 5MB for gallery)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      try {
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);
          newUrls.push(urlData.publicUrl);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
    }

    setIsUploading(false);
  };

  const handleRemove = async (index: number) => {
    const url = values[index];

    // Try to delete from storage
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      if (pathMatch) {
        const [, bucketName, filePath] = pathMatch;
        await supabase.storage.from(bucketName).remove([filePath]);
      }
    } catch (err) {
      console.error("Error removing file:", err);
    }

    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      {/* Image grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {values.map((url, index) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            {!disabled && (
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        {values.length < maxImages && !disabled && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-2 transition-all"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500">הוסף</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-gray-400">
        {values.length}/{maxImages} תמונות
      </p>
    </div>
  );
}
