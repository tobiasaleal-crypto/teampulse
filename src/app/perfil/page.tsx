"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";

const MOCK_TEAM = [
  { name: "Juan García", role: "Dev Backend", email: "juan@empresa.com", workload: 90, meetings: 12, focusHours: 3, emails: 47, status: "high", responseTime: "~4hs", collaboratesWith: ["Laura Pérez", "Carlos Ruiz"], projects: ["API v2", "Auth Module"] },
  { name: "Laura Pérez", role: "Product Manager", email: "laura@empresa.com", workload: 45, meetings: 5, focusHours: 18, emails: 23, status: "ok", responseTime: "~1hs", collaboratesWith: ["Juan García", "Ana López"], projects: ["Sprint Q1", "Roadmap 2026"] },
  { name: "Pedro Sánchez", role: "Dev Frontend", email: "pedro@empresa.com", workload: 70, meetings: 8, focusHours: 12, emails: 31, status: "medium", responseTime: "~2hs", collaboratesWith: ["Ana López", "Laura Pérez"], projects: ["Dashboard UI", "Mobile App"] },
  { name: "Ana López", role: "Diseñadora UX", email: "ana@empresa.com", workload: 55, meetings: 6, focusHours: 15, emails: 19, status: "ok", responseTime: "~3hs", collaboratesWith: ["Pedro Sánchez", "Laura Pérez"], projects: ["Design System", "Onboarding"] },
  { name: "Carlos Ruiz", role: "Dev Backend", email: "carlos@empresa.com", workload: 85, meetings: 11, focusHours: 5, emails: 52, status: "high", responseTime: "~3hs", collaboratesWith: ["Juan García"], projects: ["API v2", "DB Migration"] },
];

function ProfileContent() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const employee = MOCK_TEAM.find(e => e.email === email) || MOCK_TEAM[0];
  const initials = employee.name.split(" ").map(n => n[0]).join("");
  const idx = MOCK_TEAM.findIndex(e => e.email === employee.email);
  const statusColor = employee.status === "high" ? "#ff4d6d" : employee.status === "medium" ? "#ffd166" : "#06d6a0";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "40px 48px", background: "var(--bg)" }}>

        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px", marginBottom: "24px", padding: 0, fontFamily: "DM Sans, sans-serif" }}
        >
          ← Volver al dashboard
        </button>

        {/* Header del perfil */}
        <div className="animate-in stagger-1" style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: `hsl(${idx * 60}, 50%, 20%)`,
            border: `2px solid hsl(${idx * 60}, 50%, 40%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: "700", fontFamily: "Syne, sans-serif",
            color: `hsl(${idx * 60}, 70%, 70%)`,
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "4px" }}>{employee.name}</h1>
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>{employee.role} · {employee.email}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "36px", fontFamily: "Syne, sans-serif", fontWeight: "800", color: statusColor }}>{employee.workload}%</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>carga esta semana</div>
          </div>
        </div>

        {/* Workload bar grande */}
        <div className="animate-in stagger-2" style={{ marginBottom: "40px", padding: "24px", background: "var(--surface)", border: `1px solid ${employee.status === "high" ? "rgba(255,77,109,0.2)" : "var(--border)"}`, borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Carga de trabajo</span>
            <span style={{ fontSize: "13px", color: statusColor, fontWeight: "600" }}>
              {employee.status === "high" ? "Alta — necesita atención" : employee.status === "medium" ? "Moderada" : "Normal"}
            </span>
          </div>
          <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${employee.workload}%`, background: statusColor, borderRadius: "4px", transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Métricas */}
        <div className="animate-in stagger-3" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Reuniones", value: employee.meetings, sub: "esta semana", icon: "📅" },
            { label: "Horas de foco", value: employee.focusHours, sub: "tiempo real de trabajo", icon: "🎯" },
            { label: "Emails", value: employee.emails, sub: "recibidos esta semana", icon: "✉️" },
            { label: "Tiempo de resp.", value: employee.responseTime, sub: "promedio", icon: "⚡" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px" }}>
              <div style={{ fontSize: "20px", marginBottom: "10px" }}>{m.icon}</div>
              <div style={{ fontSize: "26px", fontFamily: "Syne, sans-serif", fontWeight: "700", marginBottom: "4px" }}>{m.value}</div>
              <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "2px" }}>{m.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Colaboración y proyectos */}
        <div className="animate-in stagger-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Colabora más con</div>
            {employee.collaboratesWith.map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "600" }}>
                  {name.split(" ").map(n => n[0]).join("")}
                </div>
                <span style={{ fontSize: "14px" }}>{name}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Proyectos activos</div>
            {employee.projects.map((proj, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a4ef", flexShrink: 0 }} />
                <span style={{ fontSize: "14px" }}>{proj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enviar mensaje */}
        <div className="animate-in stagger-5">
          <button
            onClick={() => router.push(`/teammail?to=${employee.email}`)}
            style={{ padding: "12px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontFamily: "DM Sans, sans-serif", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            ✉ Enviar mensaje interno
          </button>
        </div>
      </main>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div style={{ color: "var(--text-muted)" }}>Cargando...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
