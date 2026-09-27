"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  FolderKanban,
  Search,
  PlusCircle,
  Trash2,
  ExternalLink,
  Film,
  Video,
  CheckCircle2,
  RotateCw,
  Filter,
  Pencil,
  X,
  Save,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Shuffle,
} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";
import { parseVideoUrl, getVideoCover } from "@/lib/videoUtils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getProjectThumbnail(p) {
  return getVideoCover(p.youtube_url, p.cover_image, "/images/commercial.jpg");
}

export default function ManageProjects() {
  const { isDark } = useAdminTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("custom"); // Default: custom display order (reflects live site order)

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    id: "",
    type: "commercial",
    title: "",
    category: "",
    youtube_url: "",
    cover_image: "",
    description: "",
    role: "",
    year: "2025",
  });
  const [editLoading, setEditLoading] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        setMessage("Failed to load projects from server.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title || 'this project'}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const handleEditClick = (p) => {
    setEditingProject(p);
    setEditForm({
      id: p.id,
      type: p.type || "commercial",
      title: p.title || "",
      category: p.category || "",
      youtube_url: p.youtube_url || "",
      cover_image: p.cover_image || "",
      description: p.description || "",
      role: p.role || "",
      year: p.year || "2025",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/projects/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Project updated successfully!");
        setProjects((prev) =>
          prev.map((item) => (item.id === editForm.id ? { ...item, ...editForm } : item))
        );
        setEditingProject(null);
      } else {
        alert(data.message || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not save changes.");
    } finally {
      setEditLoading(false);
    }
  };

  // Reorder: Shuffle Projects Order
  const handleShuffleProjects = async () => {
    if (projects.length <= 1) return;
    let newProjects = [...projects];

    if (selectedType === "all") {
      // Shuffle all projects
      for (let i = newProjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newProjects[i], newProjects[j]] = [newProjects[j], newProjects[i]];
      }
    } else {
      // Shuffle only the selected type while preserving positions of others
      const matchingIndices = [];
      const matchingItems = [];
      newProjects.forEach((p, i) => {
        if (p.type === selectedType) {
          matchingIndices.push(i);
          matchingItems.push(p);
        }
      });
      for (let i = matchingItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matchingItems[i], matchingItems[j]] = [matchingItems[j], matchingItems[i]];
      }
      matchingIndices.forEach((idx, i) => {
        newProjects[idx] = matchingItems[i];
      });
    }

    setSortOrder("custom");
    setProjects(newProjects);

    try {
      const res = await fetch(`${API_BASE}/api/projects/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newProjects.map((p) => p.id),
        }),
      });
      if (res.ok) {
        setMessage(`Shuffled ${selectedType === "all" ? "all" : selectedType} projects successfully! Live portfolio updated.`);
      }
    } catch (err) {
      console.error("Failed to shuffle projects:", err);
    }
  };

  // Reorder: Move Project Up (-1) or Down (+1)
  const handleMoveProject = async (project, direction) => {
    // Current visible list under current filter & sort
    const currentList = sortedProjects;
    const currentPos = currentList.findIndex((p) => p.id === project.id);
    if (currentPos === -1) return;

    const targetPos = currentPos + direction;
    if (targetPos < 0 || targetPos >= currentList.length) return;

    const targetProject = currentList[targetPos];

    // Find indices in master projects array
    const idx1 = projects.findIndex((p) => p.id === project.id);
    const idx2 = projects.findIndex((p) => p.id === targetProject.id);
    if (idx1 === -1 || idx2 === -1) return;

    const newProjects = [...projects];
    const temp = newProjects[idx1];
    newProjects[idx1] = newProjects[idx2];
    newProjects[idx2] = temp;

    setSortOrder("custom");
    setProjects(newProjects);

    try {
      const res = await fetch(`${API_BASE}/api/projects/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newProjects.map((p) => p.id),
        }),
      });
      if (res.ok) {
        setMessage(`Order updated! "${project.title || "Project"}" moved ${direction < 0 ? "up" : "down"}. Live portfolio updated.`);
      }
    } catch (err) {
      console.error("Failed to reorder projects:", err);
    }
  };

  // Filter projects by type and search term
  const filteredProjects = projects.filter((p) => {
    const matchesType =
      selectedType === "all" || p.type === selectedType;
    const matchesSearch =
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.role && p.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.year && String(p.year).includes(searchTerm));
    return matchesType && matchesSearch;
  });

  // Sort projects: custom display order (default) or by ID if explicitly toggled
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "asc") {
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    }
    if (sortOrder === "desc") {
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    }
    return 0; // "custom" order preserved as returned by backend / updated by user
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Portfolio CMS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 uppercase">
                {projects.length} Total Projects
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Manage Portfolio Projects
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Edit, sort, preview covers, and delete video projects displayed across Commercial & Personal portfolio pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProjects}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isDark
                  ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
              }`}
              title="Refresh projects list"
            >
              <RotateCw size={15} />
            </button>
            <Link
              href="/admin/projects"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage("")} className="hover:opacity-75">✕</button>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark
              ? "bg-[#141A26] border-gray-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-white/5 w-full md:w-auto">
            <button
              onClick={() => setSelectedType("all")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedType === "all"
                  ? "bg-orange-500 text-white shadow"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setSelectedType("commercial")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedType === "commercial"
                  ? "bg-blue-600 text-white shadow"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Film size={12} />
              <span>Commercial ({projects.filter((p) => p.type === "commercial").length})</span>
            </button>
            <button
              onClick={() => setSelectedType("personal")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedType === "personal"
                  ? "bg-emerald-600 text-white shadow"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Video size={12} />
              <span>Personal ({projects.filter((p) => p.type === "personal").length})</span>
            </button>
          </div>

          {/* Right Controls: Shuffle, Sort Order & Search Input */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Shuffle Button */}
            <button
              onClick={handleShuffleProjects}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isDark
                  ? "bg-[#182033] hover:bg-[#202b44] text-orange-400 border-gray-700"
                  : "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200 shadow-sm"
              }`}
              title="Shuffle order of projects on live site"
            >
              <Shuffle size={13} />
              <span>Shuffle</span>
            </button>

            {/* Sort Order Toggle */}
            <button
              onClick={() => {
                if (sortOrder === "custom") setSortOrder("asc");
                else if (sortOrder === "asc") setSortOrder("desc");
                else setSortOrder("custom");
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isDark
                  ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
              }`}
              title="Click to toggle display order vs ID sorting"
            >
              <ArrowUpDown size={13} className="text-orange-500" />
              <span>Order:</span>
              <span className="text-orange-500 font-mono">
                {sortOrder === "custom"
                  ? "Live Order"
                  : sortOrder === "asc"
                  ? "ID: 1➔10"
                  : "ID: 10➔1"}
              </span>
            </button>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border outline-none transition ${
                  isDark
                    ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div
            className={`p-20 rounded-3xl border flex justify-center items-center ${
              isDark ? "bg-[#141A26] border-gray-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedProjects.length === 0 ? (
          <div
            className={`p-16 rounded-3xl border text-center ${
              isDark ? "bg-[#141A26] border-gray-800" : "bg-white border-slate-200"
            }`}
          >
            <FolderKanban size={36} className="mx-auto text-orange-500 mb-3 opacity-60" />
            <h3 className="font-bold text-base text-current">No projects match your filter</h3>
            <p className="text-xs opacity-60 mt-1 mb-6">
              {searchTerm ? "Try searching with a different term" : "Add your first video project to get started"}
            </p>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition"
            >
              <PlusCircle size={15} />
              <span>Add New Project</span>
            </Link>
          </div>
        ) : (
          <div
            className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
              isDark ? "bg-[#141A26] border-gray-800" : "bg-white border-slate-200"
            }`}
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b uppercase text-[10px] font-black tracking-wider ${
                    isDark
                      ? "bg-[#182033] border-gray-800 text-gray-400"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                >
                  <tr>
                    <th
                      onClick={() => {
                        if (sortOrder === "custom") setSortOrder("asc");
                        else if (sortOrder === "asc") setSortOrder("desc");
                        else setSortOrder("custom");
                      }}
                      className="py-3.5 px-3.5 w-16 text-center cursor-pointer hover:text-orange-500 transition select-none"
                      title="Click to toggle sorting"
                    >
                      <div className="inline-flex items-center justify-center gap-1">
                        <span>ID</span>
                        <span className="font-mono text-orange-500 font-bold">
                          {sortOrder === "asc" ? "▲" : sortOrder === "desc" ? "▼" : "•"}
                        </span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3.5 w-20">Cover</th>
                    <th className="py-3.5 px-3.5 min-w-[180px]">Project Title</th>
                    <th className="py-3.5 px-3.5 w-28 whitespace-nowrap">Type</th>
                    <th className="py-3.5 px-3.5 w-28 whitespace-nowrap">Category</th>
                    <th className="py-3.5 px-3.5 w-28 whitespace-nowrap">Role & Year</th>
                    <th className="py-3.5 px-3.5 w-32 whitespace-nowrap">Video Media</th>
                    <th className="py-3.5 px-4 w-44 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800/80" : "divide-slate-200"}`}>
                  {sortedProjects.map((p) => {
                    const parsed = parseVideoUrl(p.youtube_url);
                    return (
                      <tr
                        key={p.id}
                        className={`transition ${
                          isDark ? "hover:bg-[#182033]/60" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3.5 px-3.5 text-center font-mono text-orange-500 font-bold">
                          #{p.id}
                        </td>
                        <td className="py-3.5 px-3.5">
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-sm">
                            <img
                              src={getProjectThumbnail(p)}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/commercial.jpg";
                              }}
                            />
                          </div>
                          <div className="mt-1">
                            {p.cover_image ? (
                              <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/25">
                                Custom
                              </span>
                            ) : (
                              <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-400 border border-white/10">
                                Auto
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3.5 min-w-[180px]">
                          <div className="font-bold text-current text-sm">
                            {p.title || "(Untitled Project)"}
                          </div>
                          {p.description && (
                            <p className="text-[11px] opacity-60 line-clamp-1 max-w-xs mt-0.5">
                              {p.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              p.type === "commercial"
                                ? "bg-blue-500/15 text-blue-500 border border-blue-500/25"
                                : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                            }`}
                          >
                            {p.type === "commercial" ? <Film size={10} /> : <Video size={10} />}
                            <span>{p.type}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3.5 font-medium text-current opacity-80 whitespace-nowrap">
                          {p.category || "-"}
                        </td>
                        <td className="py-3.5 px-3.5 whitespace-nowrap">
                          <div className="font-medium text-current">{p.role || "-"}</div>
                          <div className="text-[10px] opacity-50 font-mono">{p.year || "-"}</div>
                        </td>
                        <td className="py-3.5 px-3.5 whitespace-nowrap font-mono text-[11px]">
                          {p.youtube_url ? (
                            <a
                              href={p.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 hover:underline truncate max-w-[190px]"
                            >
                              {parsed.isReel || parsed.type === "instagram" ? (
                                <span className="inline-flex items-center gap-1 text-pink-400 font-bold">
                                  <FaInstagram size={13} />
                                  <span>Reel</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                                  <FaYoutube size={13} />
                                  <span>YouTube</span>
                                </span>
                              )}
                              <ExternalLink size={10} className="opacity-60" />
                            </a>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Reorder Up / Down */}
                            <div className="inline-flex items-center gap-0.5 bg-black/20 dark:bg-white/5 rounded-lg p-0.5 border border-inherit/20 mr-1">
                              <button
                                onClick={() => handleMoveProject(p, -1)}
                                disabled={sortedProjects.findIndex((item) => item.id === p.id) === 0}
                                className="p-1 rounded hover:bg-orange-500 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit transition cursor-pointer"
                                title="Move Up (Display earlier on frontend)"
                              >
                                <ChevronUp size={13} />
                              </button>
                              <button
                                onClick={() => handleMoveProject(p, 1)}
                                disabled={sortedProjects.findIndex((item) => item.id === p.id) === sortedProjects.length - 1}
                                className="p-1 rounded hover:bg-orange-500 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit transition cursor-pointer"
                                title="Move Down (Display later on frontend)"
                              >
                                <ChevronDown size={13} />
                              </button>
                            </div>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClick(p)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/15 hover:bg-blue-600 text-blue-400 hover:text-white transition cursor-pointer shadow-sm"
                              title="Edit Project"
                            >
                              <Pencil size={12} />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(p.id, p.title)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white transition cursor-pointer shadow-sm"
                              title="Delete Project"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Bar */}
            <div
              className={`hidden md:flex items-center justify-between p-4 border-t text-xs ${
                isDark ? "bg-[#182033]/60 border-gray-800 text-gray-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-current font-bold">{sortedProjects.length}</strong> of{" "}
                  <strong className="text-current font-bold">{projects.length}</strong> projects
                </span>
                {searchTerm && <span className="text-orange-500 font-semibold">(Search active)</span>}
              </div>
              <div className="flex items-center gap-4 text-[11px] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{projects.filter((p) => p.type === "commercial").length} Commercial</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{projects.filter((p) => p.type === "personal").length} Personal</span>
                </span>
              </div>
            </div>

            {/* Mobile Responsive Cards View for phones (e.g. Nothing Phone) */}
            <div className="md:hidden divide-y divide-inherit">
              {sortedProjects.map((p) => {
                const parsed = parseVideoUrl(p.youtube_url);
                return (
                  <div key={`mobile-card-${p.id}`} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        <img
                          src={getProjectThumbnail(p)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/commercial.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-orange-500 font-bold text-xs">
                            #{p.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              p.type === "commercial"
                                ? "bg-blue-500/15 text-blue-500 border border-blue-500/25"
                                : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                            }`}
                          >
                            {p.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm truncate mt-0.5">
                          {p.title || "(Untitled Project)"}
                        </h4>
                        <p className="text-[11px] opacity-60 truncate">
                          {p.category || "-"} • {p.role || "-"} {p.year ? `(${p.year})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {p.youtube_url ? (
                        <a
                          href={p.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                        >
                          {parsed.isReel || parsed.type === "instagram" ? (
                            <span className="inline-flex items-center gap-1 text-pink-400 font-bold">
                              <FaInstagram size={12} />
                              <span>Instagram Reel</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                              <FaYoutube size={12} />
                              <span>YouTube</span>
                            </span>
                          )}
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[11px] opacity-40">No Video</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-0.5 bg-black/20 dark:bg-white/5 rounded-lg p-0.5 border border-inherit/20 mr-0.5">
                          <button
                            onClick={() => handleMoveProject(p, -1)}
                            disabled={sortedProjects.findIndex((item) => item.id === p.id) === 0}
                            className="p-1.5 rounded hover:bg-orange-500 hover:text-white disabled:opacity-20 transition cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            onClick={() => handleMoveProject(p, 1)}
                            disabled={sortedProjects.findIndex((item) => item.id === p.id) === sortedProjects.length - 1}
                            className="p-1.5 rounded hover:bg-orange-500 hover:text-white disabled:opacity-20 transition cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown size={13} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleEditClick(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {editingProject && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setEditingProject(null)}
          >
            <div
              className={`relative w-full max-w-2xl rounded-3xl border p-5 sm:p-8 shadow-2xl transition my-4 sm:my-8 max-h-[88vh] overflow-y-auto ${
                isDark ? "bg-[#141A26] border-gray-700 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingProject(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                  Editing Project #{editForm.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-current mb-6">
                Update Project Details
              </h2>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-2">
                    Project Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, type: "commercial" })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                        editForm.type === "commercial"
                          ? "border-blue-500 bg-blue-500/15 text-blue-400 font-bold"
                          : isDark
                          ? "border-gray-800 bg-[#182033]/60 opacity-60"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      <Film size={16} />
                      <span className="text-xs">Commercial Project</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, type: "personal" })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                        editForm.type === "personal"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold"
                          : isDark
                          ? "border-gray-800 bg-[#182033]/60 opacity-60"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      <Video size={16} />
                      <span className="text-xs">Personal Project</span>
                    </button>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Video URL (YouTube or Instagram Reel) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase font-bold opacity-75">
                      Video Link (YouTube or Instagram Reel) *
                    </label>
                    {editForm.youtube_url && (
                      <span className="text-[10px] font-bold">
                        {parseVideoUrl(editForm.youtube_url).isReel || parseVideoUrl(editForm.youtube_url).type === "instagram" ? (
                          <span className="inline-flex items-center gap-1 text-pink-400">
                            <FaInstagram size={11} />
                            <span>Instagram Reel detected</span>
                          </span>
                        ) : parseVideoUrl(editForm.youtube_url).type === "youtube" ? (
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <FaYoutube size={11} />
                            <span>YouTube Video detected</span>
                          </span>
                        ) : null}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                    value={editForm.youtube_url}
                    onChange={(e) => setEditForm({ ...editForm, youtube_url: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                  <p className="text-[10px] opacity-50 mt-1">
                    Paste any standard YouTube video link or Instagram Reel link. Automatically converted to embed player.
                  </p>
                </div>

                {/* Custom Cover Image with ImageUpload */}
                <div>
                  <ImageUpload
                    label="Custom Cover Image (Optional)"
                    value={editForm.cover_image}
                    onChange={(url) => setEditForm({ ...editForm, cover_image: url })}
                    helperText="Leave empty to use automatic video thumbnail / fallback cover"
                  />
                </div>

                {/* Story Description */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* Role & Year */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Role
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Release Year
                    </label>
                    <input
                      type="text"
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      isDark ? "border-gray-700 hover:bg-gray-800" : "border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
