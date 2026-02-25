export const authStore = {
    getToken: () => (typeof window !== "undefined" ? localStorage.getItem("token") : null),
    setToken: (token: string) => localStorage.setItem("token", token),
    clear: () => localStorage.removeItem("token")
};
