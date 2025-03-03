import { create } from "zustand"
import { persist } from "zustand/middleware"
import { login as apiLogin, logout as apiLogout, getCurrentUser, refreshToken, type User } from "./api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await apiLogin({ email, password })
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await apiLogout()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Logout failed",
          })
        }
      },

      refreshSession: async () => {
        const refreshTokenValue = localStorage.getItem("refreshToken")
        if (!refreshTokenValue) {
          set({ isAuthenticated: false, user: null })
          return
        }

        set({ isLoading: true })
        try {
          const response = await refreshToken({ refreshToken: refreshTokenValue })
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // If refresh token fails, log the user out
          await get().logout()
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token")
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return false
        }

        set({ isLoading: true })
        try {
          const user = await getCurrentUser()
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (error) {
          // Try to refresh the token if getting current user fails
          try {
            await get().refreshSession()
            return get().isAuthenticated
          } catch {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            })
            return false
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

