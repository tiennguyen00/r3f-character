import { create } from "zustand";
import { firebaseConfigApp } from "./firebaseconfig";
import { get, getDatabase, onValue, ref } from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  listAll,
  ref as refStorage,
} from "firebase/storage";

export const database = getDatabase(firebaseConfigApp);
export const storage = getStorage(firebaseConfigApp);

interface CategoriesProps {
  categories: string[];
  currentCategory: string | null;
  assets: string[];
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
    const folderRef = refStorage(storage); // Reference to Firebase Storage

    try {
      const res = await listAll(folderRef);
      const assetsResult: string[] = [];

      // Use map to return an array of promises and await Promise.all
      await Promise.all(
        res.items.map(async (itemRef) => {
          if (!v || itemRef.name.toLowerCase().includes(v.toLowerCase())) {
            try {
              const url = await getDownloadURL(itemRef);
              assetsResult.push(url); // Add URL to result array
            } catch (error) {
              console.error("Error fetching file URL: ", error);
            }
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
