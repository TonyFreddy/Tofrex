import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCreatorStore = create((set) => ({
  creator: null,
  posts: [],
  isSubscribed: false,
  isOwner: false,
  isLoading: false,

  fetchCreatorProfile: async (creatorId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/creators/${creatorId}`);
      set({
        creator:      res.data.creator,
        posts:        res.data.posts,
        isSubscribed: res.data.isSubscribed,
        isOwner:      res.data.isOwner,
      });
    } catch (err) {
      console.error("fetchCreatorProfile:", err);
      toast.error("Impossible de charger le profil");
    } finally {
      set({ isLoading: false });
    }
  },

  becomeCreator: async (formData) => {
    const res = await axiosInstance.post("/creators/become", formData);
    return res.data;
  },

  updateCreatorProfile: async (profileData) => {
    const res = await axiosInstance.put("/creators/profile", profileData);
    set((s) => ({ creator: { ...s.creator, ...res.data.creator } }));
    return res.data;
  },

  uploadPost: async (postData) => {
    const res = await axiosInstance.post("/creators/posts", postData);
    set((s) => ({ posts: [res.data.post, ...s.posts] }));
    return res.data;
  },

  deletePost: async (postId) => {
    await axiosInstance.delete(`/creators/posts/${postId}`);
    set((s) => ({ posts: s.posts.filter((p) => p._id !== postId) }));
  },

  subscribeToCreator: async (creatorId) => {
    const res = await axiosInstance.post(`/subscriptions/subscribe/${creatorId}`);
    window.location.href = res.data.url;
  },

  sendTip: async (creatorId, amount, message) => {
    const res = await axiosInstance.post(`/subscriptions/tip/${creatorId}`, { amount, message });
    window.location.href = res.data.url;
  },

  getMySubscriptions: async () => {
    const res = await axiosInstance.get("/subscriptions/my");
    return res.data;
  },

  cancelSubscription: async (creatorId) => {
    const res = await axiosInstance.delete(`/subscriptions/cancel/${creatorId}`);
    return res.data;
  },
}));