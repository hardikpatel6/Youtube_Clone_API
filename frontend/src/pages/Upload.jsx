import React, { useState } from "react";
import { useVideos } from "../context/VideoContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="w-full border p-2 rounded-lg"
              required
            />
            {video && ( <video src={URL.createObjectURL(video)} controls className="mt-3 rounded-lg w-full max-h-64" /> )}
          </div>
          <div>
            <label className="block font-semibold mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full border p-2 rounded-lg"
              required
            />
            {thumbnail && ( <img src={URL.createObjectURL(thumbnail)} alt="thumbnail" className="mt-3 rounded-lg w-64" /> )}
          </div>
          <input
            type="text"
            name="title"
            placeholder="Enter video title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select category</option>
            <option value="Education">Education</option>
            <option value="Gaming">Gaming</option>
            <option value="Technology">Technology</option>
          </select>
          {formData.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              placeholder={`Tag ${index + 1}`}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="w-full border p-2 rounded-lg mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addTag}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Tag
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;