"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth()
      setIsChecking(false)
    }

    verifyAuth()
  }, [checkAuth])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isChecking && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isChecking, isLoading, isAuthenticated, router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading: isLoading || isChecking }}>
      {children}
    </AuthContext.Provider>
  )
}

