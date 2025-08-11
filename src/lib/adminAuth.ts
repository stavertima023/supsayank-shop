import { cookies } from "next/headers";
import crypto from "crypto";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "admin";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export function computeAdminToken(password: string, salt: string): string {
  const h = crypto.createHash("sha256");
  h.update(`${password}:${salt}`);
  return h.digest("hex");
}

export function getExpectedAdminToken(): string {
  const password = getEnv("ADMIN_PASSWORD");
  const salt = getEnv("ADMIN_TOKEN_SALT");
  return computeAdminToken(password, salt);
}

export function setAdminCookie(): void {
  const token = getExpectedAdminToken();
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminCookie(): void {
  cookies().delete(ADMIN_COOKIE_NAME);
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const expected = getExpectedAdminToken();
    return token === expected;
  } catch {
    return false;
  }
}

export function requireAdminOrRedirect(): void {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
}


