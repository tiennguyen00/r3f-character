import { useEffect } from "react";
import { useCategories } from "../store";

const AssetsBox = () => {
  const {
    fetchCategories,
    categories,
    fetchAssets,
    assets,
    setCurrentCategory,
    currentCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentCategory) fetchAssets(currentCategory);
  }, [currentCategory]);
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl drop-shadow-md">
      <div className="flex items-center gap-6 pointer-events-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCurrentCategory(category)}
            className={`transition-colors duration-200 font-medium ${
              currentCategory === category
                ? "text-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {assets.map((asset: string, index: number) => (
          <button
            key={index}
            className={`w-20 h-20 rounded-md overflow-hidden bg-gray-200 pointer-events-auto hover:opacity-100 transition-all border-2 duration-500`}
          >
            <img src={asset} />
          </button>
        ))}
      </div>
    </div>
  );
};

const DownloadButton = () => {
  return (
    <button className="px-4 py-3 font-medium text-white transition-colors duration-300 bg-indigo-500 rounded-lg pointer-events-auto hover:bg-indigo-600">
      Download
    </button>
  );
};

const UI = () => {
  return (
    <main className="fixed inset-0 z-10 p-10 pointer-events-none">
      <div className="flex flex-col justify-between w-full h-full max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-white uppercase">Hello world</h1>
          <DownloadButton />
        </div>
        <div className="flex flex-col gap-6">
          <AssetsBox />
        </div>
      </div>
    </main>
  );
};

export default UI;
