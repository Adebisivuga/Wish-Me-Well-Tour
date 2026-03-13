import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile, UserRole } from "@/lib/types/database"

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getProfile()
  
  if (!profile) {
    redirect("/auth/login")
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/dashboard")
  }

  return profile
}

export async function requireAdmin() {
  return requireRole(["admin", "manager"])
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
