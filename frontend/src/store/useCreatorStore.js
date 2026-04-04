import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCreatorStore = create((set) => ({
  creators:       [],
  creator:        null,
  posts:          [],
  isSubscribed:   false,
  isOwner:        false,
  subscriberCount:0,
  isLoading:      false,
  feed:           [],
  notifications:  [],
  unreadNotifs:   0,

  fetchFeed: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/creators/feed");
      set({ feed: res.data });
    } catch { toast.error("Erreur chargement feed"); }
    finally { set({ isLoading: false }); }
  },

  fetchAllCreators: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/creators");
      set({ creators: res.data });
    } catch { toast.error("Erreur chargement créateurs"); }
    finally { set({ isLoading: false }); }
  },

  fetchCreatorProfile: async (creatorId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/creators/${creatorId}`);
      set({
        creator:         res.data.creator,
        posts:           res.data.posts,
        isSubscribed:    res.data.isSubscribed,
        isOwner:         res.data.isOwner,
        subscriberCount: res.data.subscriberCount,
      });
    } catch { toast.error("Erreur chargement profil"); }
    finally { set({ isLoading: false }); }
  },

  fetchNotifications: async () => {
    try {
      const res = await axiosInstance.get("/creators/notifications");
      const unread = res.data.filter((n) => !n.read).length;
      set({ notifications: res.data, unreadNotifs: unread });
    } catch { /* ignore */ }
  },

  markNotifsRead: async () => {
    try {
      await axiosInstance.put("/creators/notifications/read");
      set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadNotifs: 0 }));
    } catch { /* ignore */ }
  },

  becomeCreator: async (data) => {
    const res = await axiosInstance.post("/creators/become", data);
    return res.data;
  },

  updateCreatorProfile: async (data) => {
    const res = await axiosInstance.put("/creators/profile", data);
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

  verifySubscription: async (creatorId, transactionId) => {
    const res = await axiosInstance.post(`/subscriptions/subscribe/${creatorId}`, { transactionId });
    set({ isSubscribed: true });
    return res.data;
  },

  verifyTip: async (creatorId, transactionId, message) => {
    const res = await axiosInstance.post(`/subscriptions/tip/${creatorId}`, { transactionId, message });
    return res.data;
  },

  cancelSubscription: async (creatorId) => {
    const res = await axiosInstance.delete(`/subscriptions/cancel/${creatorId}`);
    return res.data;
  },
}));