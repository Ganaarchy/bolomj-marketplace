import type { AuthUser } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/types";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.accessToken, token);
}

export function clearToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.accessToken);
}

export function getStoredUser(): AuthUser | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(STORAGE_KEYS.user);
    return rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearStoredUser() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.user);
}

export function logout() {
  clearToken();
  clearStoredUser();
}

export function isAuthenticated() {
  return Boolean(getToken());
}
