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
}

export const useCategories = create<CategoriesProps>((set) => ({
  categories: [],
  currentCategory: null,
  assets: [],
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
    const value = Object.values(assetsRef.val()).filter(
      (i: any) => i.type === v.toLocaleLowerCase()
    );

    console.log("assetsRef: ", value);

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
            console.log(thumbnail);

            // const urlModel = await getDownloadURL(pathReference);
            const urlModel = "";

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
      console.log("assetsResult: ", assetsResult);
      set({ assets: assetsResult });
    } catch (error) {
      console.error("Error listing files: ", error);
    }
  },
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
}));
