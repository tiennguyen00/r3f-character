import { create } from "zustand";
import { firebaseConfigApp } from "./firebaseconfig";
import { get, getDatabase, onValue, ref } from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  ref as refStorage,
} from "firebase/storage";

export const database = getDatabase(firebaseConfigApp);
export const storage = getStorage(firebaseConfigApp);

interface CategoriesProps {
  categories: string[];
  currentCategory: string | null;
  assets: Record<string, string>[];
  fetchCategories: () => void;
  setCurrentCategory: (v: string) => void;
  fetchAssets: (v: string) => void;
  customization: { name: string; model: string }[];
  setCustomization: (v: { name: string; model: string }) => void;
}

export const useCategories = create<CategoriesProps>((set) => ({
  categories: [],
  currentCategory: null,
  assets: [],
  customization: [],
  setCustomization: (v) => {
    set((state) => {
      const index = state.customization.findIndex((i) => i.name === v.name);
      if (index !== -1) {
        const innerCustomization = [...state.customization];
        innerCustomization[index] = v;
        return {
          customization: innerCustomization,
        };
      } else
        return {
          customization: [...state.customization, v],
        };
    });
  },
  fetchCategories: () => {
    const categoriesRef = ref(database, "CustomizationGroup");

    onValue(
      categoriesRef,
      (snapshot) => {
        const dataItem = snapshot.val();
        set({
          categories: dataItem,
          currentCategory: dataItem[0],
        });
      },
      (err) => {
        console.log("Error in fetching data: ", err);
      }
    );
  },
  fetchAssets: async (v: string) => {
    const assetsRef = await get(ref(database, "CustomizationAssets"));
    const value = Object.values(assetsRef.val()).filter((i: any) => {
      return i.type === v.toLocaleLowerCase();
    });

    try {
      const assetsResult: Record<string, string>[] = [];

      // Use map to return an array of promises and await Promise.all
      await Promise.all(
        value.map(async (v: any) => {
          const pathReference = refStorage(
            storage,
            `gs://r3f-character.appspot.com/${v.url}`
          );
          const thumbnail = refStorage(
            storage,
            `gs://r3f-character.appspot.com/${v.thumbnail}`
          );

          try {
            const urlModel = await getDownloadURL(pathReference);
            // console.log(urlModel);
            // const urlModel = "";

            const thumbnailUrl = v.thumbnail
              ? await getDownloadURL(thumbnail)
              : undefined;
            assetsResult.push({
              thumbnail: thumbnailUrl ?? "",
              model: urlModel,
            });
          } catch (error) {
            console.error("Error fetching file URL: ", error);
          }
        })
      );

      // This line will run only after all URLs are fetched
      set({ assets: assetsResult });
    } catch (error) {
      console.error("Error listing files: ", error);
    }
  },
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
}));
