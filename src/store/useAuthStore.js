import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticate: false,
      logIn: () => set({ isAuthenticate: true }),
      logOut: () => set({ isAuthenticate: false }),
      checkAuth: () => {
        get().isAuthenticate;
      },
    }),
    {
      name: "auth-User",
    }
  )
);
