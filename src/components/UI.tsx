import { useEffect } from "react";
import { mappingColorGroupToPalettes, useCategories } from "../store";

const AssetsBox = () => {
  const {
    fetchCategories,
    categories,
    fetchAssets,
    assets,
    setCurrentCategory,
    currentCategory,
    setCustomization,
    palettes: { mappingtoGroup, data },
    customization,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentCategory) fetchAssets(currentCategory);
  }, [currentCategory]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-t-lg rounded-2xl bg-gradient-to-br from-black/30 to-indigo-900/20 drop-shadow-md">
      <div className="flex items-center w-full gap-6 pointer-events-auto scroll-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCurrentCategory(category)}
            className={`transition-colors duration-200 font-medium ${
              currentCategory === category
                ? "text-indigo-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex space-x-1">
        {customization
          .find((c) => c.name === currentCategory)
          ?.color?.map((c) => (
            <div
              key={c}
              className="relative w-4 h-4 cursor-pointer"
              style={{
                background: c,
              }}
              onClick={() => {
                if (currentCategory) {
                  setCustomization({
                    name: currentCategory,
                    selectedColor: c,
                  });
                }
              }}
            >
              {customization.find((c) => c.name === currentCategory)
                ?.selectedColor === c && (
                <div className="absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-black top-1/2 left-1/2" />
              )}
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {assets.map((asset: any, index: number) => (
          <button
            key={index}
            className={`w-20 h-20 overflow-hidden bg-gray-200 pointer-events-auto hover:opacity-100 transition-all border-2 duration-500 ${
              customization.find((i) => i.name === currentCategory)?.model ===
              asset.model
                ? " border-emerald-500"
                : ""
            }`}
            onClick={() => {
              if (currentCategory) {
                const colors = mappingColorGroupToPalettes(
                  currentCategory,
                  mappingtoGroup,
                  data
                );
                setCustomization({
                  name: currentCategory,
                  model: asset.model,
                  color: colors,
                });
              }
            }}
          >
            <img src={asset.thumbnail} className="object-cover w-full h-full" />
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

const RandomizeButton = () => {
  const randomize = useCategories((s) => s.randomize);
  return (
    <button
      onClick={randomize}
      className="px-4 py-3 font-medium text-white transition-colors duration-300 bg-indigo-500 rounded-lg pointer-events-auto hover:bg-indigo-600"
    >
      Random
    </button>
  );
};

const UI = () => {
  return (
    <main className="fixed inset-0 z-10 p-10 ">
      <div className="flex flex-col justify-between w-full h-full max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between pointer-events-none select-none">
          <h1 className="font-bold text-white uppercase">Hello world</h1>
          <div className="flex space-x-1">
            <DownloadButton />
            <RandomizeButton />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <AssetsBox />
        </div>
      </div>
    </main>
  );
};

export default UI;
