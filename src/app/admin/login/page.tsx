import { redirect } from "next/navigation";
import { isAdminAuthenticated, setAdminCookie, computeAdminToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }
  async function login(formData: FormData) {
    'use server';
    const password = String(formData.get("password") || "");
    const salt = process.env.ADMIN_TOKEN_SALT || "";
    const expected = process.env.ADMIN_PASSWORD || "";
    if (!salt || !expected) {
      throw new Error("ADMIN_PASSWORD/ADMIN_TOKEN_SALT are not configured");
    }
    const candidateToken = computeAdminToken(password, salt);
    const expectedToken = computeAdminToken(expected, salt);
    if (candidateToken === expectedToken) {
      await setAdminCookie();
      redirect("/admin");
    }
    // fallthrough -> redirect with failure
    redirect("/admin/login?error=1");
  }
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Вход</h1>
      <form action={login} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Пароль администратора</label>
          <input name="password" type="password" className="w-full px-3 py-2 rounded-md bg-muted border border-border" placeholder="Введите пароль" required />
        </div>
        <button type="submit" className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm">Войти</button>
      </form>
    </div>
  );
}


