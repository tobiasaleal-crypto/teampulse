"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const MOCK_TEAM_DATA = [
  { name: "Juan García", role: "Dev Backend", workload: 90, meetings: 12, focusHours: 3, emails: 47, status: "high" },
  { name: "Laura Pérez", role: "Product Manager", workload: 45, meetings: 5, focusHours: 18, emails: 23, status: "ok" },
  { name: "Pedro Sánchez", role: "Dev Frontend", workload: 70, meetings: 8, focusHours: 12, emails: 31, status: "medium" },
  { name: "Ana López", role: "Diseñadora UX", workload: 55, meetings: 6, focusHours: 15, emails: 19, status: "ok" },
  { name: "Carlos Ruiz", role: "Dev Backend", workload: 85, meetings: 11, focusHours: 5, emails: 52, status: "high" },
];

export default function ResumenPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {}, []);

  const generateSummary = async () => {
    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("/api/resumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamData: MOCK_TEAM_DATA }),
      });
      const data = await res.json();
      setSummary(data.summary);
      setGenerated(true);
    } catch (err) {
      setSummary("Error al generar el resumen. Verificá que la API key de Anthropic esté configurada en .env.local");
    } finally {
      setLoading(false);
    }
  };

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "40px 48px", background: "var(--bg)" }}>

        {/* Header */}
        <div className="animate-in stagger-1" style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Semana del {weekStart.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "6px" }}>Resumen semanal con IA</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Análisis automático del estado del equipo generado por Claude.
          </p>
        </div>

        {/* Team data preview */}
        <div className="animate-in stagger-2" style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Datos de esta semana</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
            {MOCK_TEAM_DATA.map((emp, i) => (
              <div key={i} style={{
                padding: "16px",
                background: "var(--surface)",
                border: `1px solid ${emp.status === "high" ? "rgba(255,77,109,0.25)" : "var(--border)"}`,
                borderRadius: "12px",
              }}>
                <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>{emp.name.split(" ")[0]}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>{emp.role}</div>
                <div style={{ fontSize: "22px", fontFamily: "Syne, sans-serif", fontWeight: "700", color: emp.status === "high" ? "#ff4d6d" : emp.status === "medium" ? "#ffd166" : "#06d6a0" }}>
                  {emp.workload}%
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>carga</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div className="animate-in stagger-3" style={{ marginBottom: "32px" }}>
          <button
            onClick={generateSummary}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              background: loading ? "var(--surface-2)" : "var(--text)",
              color: loading ? "var(--text-muted)" : "var(--bg)",
              border: "none",
              borderRadius: "12px",
              fontFamily: "Syne, sans-serif",
              fontWeight: "700",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                Analizando equipo...
              </>
            ) : (
              <>
                ✦ {generated ? "Regenerar resumen" : "Generar resumen con IA"}
              </>
            )}
          </button>
        </div>

        {/* Summary output */}
        {summary && (
          <div className="animate-in" style={{
            padding: "32px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            lineHeight: "1.8",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span style={{ fontSize: "16px" }}>✦</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resumen generado por Claude</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)" }}>
                {new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div style={{ fontSize: "15px", whiteSpace: "pre-wrap", color: "var(--text)" }}>
              {summary}
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </main>
    </div>
  );
}
