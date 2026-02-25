import React, { useState } from "react";
import { useVideos } from "../context/VideoContext";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Image as ImageIcon, Plus, X } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  const { uploadVideo, loading } = useVideos();
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: ["", ""],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""],
    });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || !thumbnail) {
      alert("Please select video and thumbnail");
      return;
    }
    try {
      const data = new FormData();
      data.append("video", video);
      data.append("thumbnail", thumbnail);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      formData.tags.forEach(tag => {
        if (tag.trim()) {
          data.append("tags", tag);
        }
      });
      await uploadVideo(data);
      alert("Video uploaded successfully");
      navigate("/"); // redirect to home
    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100 h-fit">

        <div className="border-b border-gray-200 pb-5 mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Media Uploads */}
            <div className="space-y-6">
              {/* Video Upload area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video File</label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl overflow-hidden relative hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 text-center relative z-10 w-full">
                    {video ? (
                      <div className="w-full flex flex-col items-center">
                        <video src={URL.createObjectURL(video)} controls className="w-full max-h-48 rounded-lg object-contain bg-black" />
                        <p className="mt-2 text-sm text-gray-500 truncate max-w-[200px]">{video.name}</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a video</span>
                            <input id="video-upload" name="video-upload" type="file" accept="video/*" className="sr-only" onChange={(e) => setVideo(e.target.files[0])} required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, WebM up to 2GB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail</label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl overflow-hidden relative hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 text-center relative z-10 w-full">
                    {thumbnail ? (
                      <div className="w-full flex flex-col items-center">
                        <img src={URL.createObjectURL(thumbnail)} alt="thumbnail" className="w-full max-h-48 rounded-lg object-contain bg-gray-100" />
                        <p className="mt-2 text-sm text-gray-500 truncate max-w-[200px]">{thumbnail.name}</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="thumbnail-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload an image</span>
                            <input id="thumbnail-upload" name="thumbnail-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => setThumbnail(e.target.files[0])} required />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Area */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title (required)</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Add a title that describes your video"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Tell viewers about your video"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category (required)</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm bg-white"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Education">Education</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="News">News</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        placeholder={`Tag ${index + 1}`}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                      {formData.tags.length > 1 && (
                        <button type="button" onClick={() => removeTag(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 px-1"
                >
                  <Plus size={16} /> Add another tag
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-200 pt-6 mt-8 gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;