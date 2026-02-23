import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getVideoByIdApi,
    editVideoApi
} from "../api/videoApi";

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
                    tags: video.tags || [],
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
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };
    if (loading)
        return (
            <div className="text-center mt-10">
                Loading...
            </div>
        );
    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">
                Edit Video
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    rows="4"
                />
                <div>
                    <label className="block mb-2 font-medium">
                        Tags
                    </label>
                    {form.tags.map((tag, index) => (
                        <input
                            key={index}
                            type="text"
                            value={tag}
                            placeholder={`Tag ${index + 1}`}
                            onChange={(e) =>
                                handleTagChange(index, e.target.value)
                            }
                            className="w-full border p-2 rounded-lg mb-2"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={addTag}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        + Add Tag
                    </button>
                </div>
                <select
                    name="category"
                    value={form.category}
                    onChange={(e) =>
                        setForm(prev => ({
                            ...prev,
                            category: e.target.value
                        }))
                    }
                    className="w-full border p-3 rounded-lg"
                    required
                >
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Entertainment">Entertainment</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Update Video
                </button>
            </form>
        </div>
    );
};

export default EditPage;