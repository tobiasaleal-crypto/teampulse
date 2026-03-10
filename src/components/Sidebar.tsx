"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: "◈", label: "Dashboard" },
  { href: "/teammail", icon: "✉", label: "TeamMail" },
  { href: "/resumen", icon: "✦", label: "Resumen IA" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", paddingLeft: "8px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: "linear-gradient(135deg, #00a4ef, #0078d4)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>⚡</div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "16px" }}>TeamsPulse</span>
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400",
                transition: "all 0.15s",
                cursor: "pointer",
                border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              }}>
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Provider badge */}
      {session?.provider && (
        <div style={{
          marginBottom: "12px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          fontSize: "11px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          <span style={{ color: session.provider === "azure-ad" ? "#00a4ef" : "#34a853" }}>●</span>
          {session.provider === "azure-ad" ? "Microsoft 365" : "Google Workspace"}
        </div>
      )}

      {/* User + Logout */}
      <div style={{
        padding: "12px",
        borderRadius: "10px",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {session?.user?.name || "Usuario"}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "10px" }}>
          {session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            width: "100%",
            padding: "6px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            color: "var(--text-muted)",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
