// Universal Video Parsing Utility for YouTube and Instagram Reels

export function parseVideoUrl(input) {
  if (!input) {
    return {
      type: "none",
      id: null,
      embedUrl: "",
      raw: "",
      isReel: false,
      aspectRatio: "16/9",
    };
  }

  const url = String(input).trim();

  // 1. Instagram Reels / Posts / TV
  // Matches:
  // https://www.instagram.com/reel/C8qX-2Pv_8k/
  // https://instagram.com/reel/C8qX-2Pv_8k
  // https://www.instagram.com/p/C8qX-2Pv_8k/
  // https://www.instagram.com/tv/C8qX-2Pv_8k/
  const instaMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i
  );
  if (instaMatch) {
    const reelId = instaMatch[1];
    return {
      type: "instagram",
      id: reelId,
      embedUrl: `https://www.instagram.com/reel/${reelId}/embed`,
      raw: url,
      isReel: true,
      aspectRatio: "9/16",
    };
  }

  // 2. YouTube (Standard, Shortened, Shorts, Embed)
  // Matches:
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ
  // https://www.youtube.com/shorts/dQw4w9WgXcQ
  // https://www.youtube.com/embed/dQw4w9WgXcQ
  // https://m.youtube.com/watch?v=dQw4w9WgXcQ
  const ytMatch = url.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|(?:.*?[?&]v=)))([\w-]{11})/i
  );

  if (ytMatch) {
    const ytId = ytMatch[1];
    const isShorts = url.toLowerCase().includes("/shorts/");
    return {
      type: "youtube",
      id: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      hqThumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      raw: url,
      isReel: isShorts,
      aspectRatio: isShorts ? "9/16" : "16/9",
    };
  }

  // 3. Already an embed URL or custom player
  if (url.includes("/embed/")) {
    return {
      type: "custom",
      id: null,
      embedUrl: url,
      raw: url,
      isReel: false,
      aspectRatio: "16/9",
    };
  }

  // 4. Fallback
  return {
    type: "unknown",
    id: null,
    embedUrl: url,
    raw: url,
    isReel: false,
    aspectRatio: "16/9",
  };
}

export function getVideoCover(videoUrl, customCover, fallback = "/images/commercial.jpg") {
  if (customCover && customCover.trim()) {
    let cover = customCover.trim();
    if (cover.startsWith("http://prassana-backend")) {
      cover = cover.replace(/^http:\/\/prassana-backend/, "https://prassana-backend");
    }
    return cover;
  }

  const parsed = parseVideoUrl(videoUrl);
  if (parsed.type === "youtube" && parsed.thumbnailUrl) {
    return parsed.thumbnailUrl;
  }

  return fallback;
}

export function getVideoMeta(videoUrl) {
  const parsed = parseVideoUrl(videoUrl);
  if (parsed.type === "instagram") {
    return {
      type: "instagram",
      label: "Instagram Reel",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      borderColor: "border-pink-500/40",
      isReel: true,
    };
  }

  if (parsed.type === "youtube") {
    return {
      type: "youtube",
      label: parsed.isReel ? "YouTube Short" : "YouTube Video",
      badgeColor: "bg-red-600 text-white",
      borderColor: "border-red-500/40",
      isReel: parsed.isReel,
    };
  }

  return {
    type: "video",
    label: "Video",
    badgeColor: "bg-orange-500 text-white",
    borderColor: "border-orange-500/40",
    isReel: false,
  };
}
