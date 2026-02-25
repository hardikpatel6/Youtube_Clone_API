import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

import {
    getVideoByIdApi,
    editVideoApi
} from "../api/videoApi";

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        tags: [],
    });

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await getVideoByIdApi(id);
                const video = res.data;
                setForm({
                    title: video.title || "",
                    description: video.description || "",
                    category: video.category || "",
                    tags: video.tags?.length ? video.tags : [""],
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagChange = (index, value) => {
        const updatedTags = [...form.tags];
        updatedTags[index] = value;
        setForm(prev => ({
            ...prev,
            tags: updatedTags
        }));
    };

    const addTag = () => {
        setForm(prev => ({
            ...prev,
            tags: [...prev.tags, ""]
        }));
    };

    const removeTag = (index) => {
        const newTags = form.tags.filter((_, i) => i !== index);
        setForm(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);
            form.tags.forEach(tag => {
                if (tag.trim()) {
                    formData.append("tags", tag);
                }
            });
            await editVideoApi(id, formData);
            alert("Video updated successfully");
            navigate(`/videos/${id}`);
        } catch (error) {
            console.error(error);
            alert("Update failed");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center mt-20 text-gray-500 font-medium text-lg">
                Loading details...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-fit">

                <div className="border-b border-gray-200 pb-5 mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Edit Video Details
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title (required)</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Add a title that describes your video"
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Tell viewers about your video"
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm resize-none"
                            rows="5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category (required)</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm bg-white"
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Education">Education</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Sports">Sports</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="News">News</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="space-y-2">
                            {form.tags.map((tag, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tag}
                                        placeholder={`Tag ${index + 1}`}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    />
                                    {form.tags.length > 1 && (
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

                    <div className="flex items-center justify-end border-t border-gray-200 pt-6 mt-8 gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/videos/${id}`)}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {submitLoading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPage;