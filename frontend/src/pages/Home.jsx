import VideoGrid from "../component/VideoGrid";
import CategoriesBar from "../component/CategoriesBar";

const Home = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      <CategoriesBar />
      <div className="p-4 md:p-6 pb-20 mt-2">
        <VideoGrid />
      </div>
    </div>
  );
};

export default Home;
