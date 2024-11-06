import { create } from "zustand";
import { firebaseConfigApp } from "./firebaseconfig";
import {
  get as getFirebase,
  getDatabase,
  onValue,
  ref,
} from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  ref as refStorage,
} from "firebase/storage";

export const database = getDatabase(firebaseConfigApp);
export const storage = getStorage(firebaseConfigApp);

interface CategoriesProps {
  categories: string[];
  palettes: {
    mappingtoGroup: {};
    data: {};
  };
  currentCategory: string | null;
  assets: Record<string, string>[];
  fetchCategories: () => void;
  setCurrentCategory: (v: string) => void;
  fetchAssets: (v: string) => void;
  customization: { name: string; model: string; color: string[] }[];
  setCustomization: (v: {
    name: string;
    model: string;
    color: string[];
  }) => void;
}

export const mappingColorGroupToPalettes = (
  groupName: string,
  mappingtoGroup: Record<string, string>,
  data: Record<string, string>
): string[] => {
  return mappingtoGroup[groupName]
    ? Object.values(data[mappingtoGroup[groupName]])
    : [];
};

export const useCategories = create<CategoriesProps>((set) => ({
  categories: [],
  currentCategory: null,
  assets: [],
  customization: [],
  palettes: {
    mappingtoGroup: {},
    data: {},
  },
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
  fetchCategories: async () => {
    const categoriesRef = ref(database, "CustomizationGroup");
    const palettesRef = await getFirebase(
      ref(database, "CustomizationPalettes")
    );
    const joinCategoriesAndPalettes = await getFirebase(
      ref(database, "JoinGroupAndPalettes")
    );

    set({
      palettes: {
        mappingtoGroup: joinCategoriesAndPalettes.val(),
        data: palettesRef.val(),
      },
    });

    onValue(
      categoriesRef,
      (snapshot) => {
        const dataItem = snapshot.val();
        set({
          categories: dataItem,
        });

        // Set the default assets for character.
        const result = [] as any;
        Promise.all(
          dataItem.map(async (v: any) => {
            try {
              const pathReference = refStorage(
                storage,
                `gs://r3f-character.appspot.com/${v + ".001.glb"}`
              );

              const urlModel = await getDownloadURL(pathReference);

              result.push({
                name: v,
                model: urlModel,
                color: mappingColorGroupToPalettes(
                  v,
                  joinCategoriesAndPalettes.val(),
                  palettesRef.val()
                ),
              });
            } catch (err) {
              console.error("Error while fetching assets: ", err);
            }
          })
        ).then(() => {
          set({
            customization: result,
          });
        });
      },
      (err) => {
        console.log("Error in fetching data: ", err);
      }
    );
  },
  fetchAssets: async (v: string) => {
    const assetsRef = await getFirebase(ref(database, "CustomizationAssets"));
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

      set({ assets: assetsResult });
    } catch (error) {
      console.error("Error listing files: ", error);
    }
  },
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
}));
