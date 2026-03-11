"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

// Datos de ejemplo hasta conectar las APIs reales
const MOCK_TEAM = [
  { name: "Juan García", role: "Dev Backend", email: "juan@empresa.com", workload: 90, meetings: 12, focusHours: 3, emails: 47, status: "high" },
  { name: "Laura Pérez", role: "Product Manager", email: "laura@empresa.com", workload: 45, meetings: 5, focusHours: 18, emails: 23, status: "ok" },
  { name: "Pedro Sánchez", role: "Dev Frontend", email: "pedro@empresa.com", workload: 70, meetings: 8, focusHours: 12, emails: 31, status: "medium" },
  { name: "Ana López", role: "Diseñadora UX", email: "ana@empresa.com", workload: 55, meetings: 6, focusHours: 15, emails: 19, status: "ok" },
  { name: "Carlos Ruiz", role: "Dev Backend", email: "carlos@empresa.com", workload: 85, meetings: 11, focusHours: 5, emails: 52, status: "high" },
];

function WorkloadBar({ percent, status }: { percent: number; status: string }) {
  const color = status === "high" ? "#ff4d6d" : status === "medium" ? "#ffd166" : "#06d6a0";
  return (
    <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden", marginTop: "8px" }}>
      <div style={{ height: "100%", width: `${percent}%`, background: color, borderRadius: "2px", transition: "width 1s ease" }} />
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "high" ? "#ff4d6d" : status === "medium" ? "#ffd166" : "#06d6a0";
  return <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: color, marginRight: "6px" }} />;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Cargando dashboard...</div>
      </div>
    );
  }

  const highLoad = MOCK_TEAM.filter(e => e.status === "high").length;
  const avgLoad = Math.round(MOCK_TEAM.reduce((a, e) => a + e.workload, 0) / MOCK_TEAM.length);
  const totalMeetings = MOCK_TEAM.reduce((a, e) => a + e.meetings, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "40px 48px", background: "var(--bg)" }}>

        {/* Header */}
        <div className="animate-in stagger-1" style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "6px" }}>
            Buen día, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Tu equipo tiene <strong style={{ color: highLoad > 0 ? "#ff4d6d" : "var(--text)" }}>{highLoad} personas con carga alta</strong> esta semana.
          </p>
        </div>

        {/* Stats rápidas */}
        <div className="animate-in stagger-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Carga promedio del equipo", value: `${avgLoad}%`, sub: "esta semana", color: avgLoad > 70 ? "#ff4d6d" : "#06d6a0" },
            { label: "Total de reuniones", value: totalMeetings, sub: "en el equipo esta semana", color: "#00a4ef" },
            { label: "Personas con sobrecarga", value: highLoad, sub: "necesitan atención", color: highLoad > 0 ? "#ffd166" : "#06d6a0" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
              <div style={{ fontSize: "36px", fontFamily: "Syne, sans-serif", fontWeight: "700", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Team grid */}
        <div className="animate-in stagger-3" style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Estado del equipo</h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{MOCK_TEAM.length} personas</span>
        </div>

        <div className="animate-in stagger-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {MOCK_TEAM.map((emp, i) => (
            <div
              key={emp.email}
              onClick={() => router.push(`/perfil?email=${emp.email}`)}
              style={{
                background: "var(--surface)",
                border: `1px solid ${emp.status === "high" ? "rgba(255,77,109,0.3)" : "var(--border)"}`,
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.borderColor = "#3a3a50"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = emp.status === "high" ? "rgba(255,77,109,0.3)" : "var(--border)"; }}
            >
              {/* Avatar + nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: `hsl(${i * 60}, 50%, 25%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: "600", fontFamily: "Syne, sans-serif",
                  color: `hsl(${i * 60}, 70%, 70%)`,
                }}>
                  {emp.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>{emp.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.role}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <StatusDot status={emp.status} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.workload}%</span>
                </div>
              </div>

              {/* Workload bar */}
              <WorkloadBar percent={emp.workload} status={emp.status} />

              {/* Métricas */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "16px" }}>
                {[
                  { label: "Reuniones", value: emp.meetings },
                  { label: "Foco (hs)", value: emp.focusHours },
                  { label: "Emails", value: emp.emails },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontFamily: "Syne, sans-serif", fontWeight: "600" }}>{m.value}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alerta */}
        {highLoad > 0 && (
          <div className="animate-in stagger-5" style={{
            marginTop: "32px",
            padding: "16px 20px",
            background: "rgba(255,77,109,0.07)",
            border: "1px solid rgba(255,77,109,0.2)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#ff4d6d" }}>Atención requerida</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {MOCK_TEAM.filter(e => e.status === "high").map(e => e.name.split(" ")[0]).join(" y ")} tienen carga superior al 80%. Considerá redistribuir tareas o reducir reuniones.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
