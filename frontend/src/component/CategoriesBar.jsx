import { useState } from "react";

const CategoriesBar = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All", "Music", "Gaming", "Live", "Mixes",
        "News", "Tractors", "Cooking", "Gadgets",
        "Computer programming", "Podcasts", "Comedies", "Recently uploaded"
    ];

    return (
        <div className="sticky top-[60px] z-30 bg-white px-4 py-3 border-b border-gray-100 flex items-center overflow-x-auto custom-scrollbar no-scrollbar w-full">
            <div className="flex gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === category
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesBar;
