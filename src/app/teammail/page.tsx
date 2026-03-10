"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const MOCK_CONTACTS = [
  { name: "Juan García", email: "juan@empresa.com", role: "Dev Backend", workload: 90, status: "high", responseTime: "~4hs" },
  { name: "Laura Pérez", email: "laura@empresa.com", role: "Product Manager", workload: 45, status: "ok", responseTime: "~1hs" },
  { name: "Pedro Sánchez", email: "pedro@empresa.com", role: "Dev Frontend", workload: 70, status: "medium", responseTime: "~2hs" },
  { name: "Ana López", email: "ana@empresa.com", role: "Diseñadora UX", workload: 55, status: "ok", responseTime: "~3hs" },
];

const MOCK_MESSAGES = [
  { id: 1, from: "Laura Pérez", email: "laura@empresa.com", subject: "Review del sprint", preview: "Hola, ¿podemos revisar los tickets antes del standup?", time: "hace 20 min", read: false },
  { id: 2, from: "Ana López", email: "ana@empresa.com", subject: "Wireframes v2 listos", preview: "Subí los wireframes actualizados al Drive. Avisame cuando los puedas ver.", time: "hace 2hs", read: true },
  { id: 3, from: "Pedro Sánchez", email: "pedro@empresa.com", subject: "Bug en producción", preview: "Encontré un error en el módulo de auth, lo estoy mirando.", time: "hace 5hs", read: true },
];

export default function TeamMailPage() {
  const { status } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedContact, setSelectedContact] = useState<typeof MOCK_CONTACTS[0] | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const handleSelectContact = (email: string) => {
    const contact = MOCK_CONTACTS.find(c => c.email === email);
    setSelectedContact(contact || null);
    setTo(email);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, display: "flex", background: "var(--bg)" }}>

        {/* Lista de mensajes */}
        <div style={{ width: "320px", borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Syne, sans-serif" }}>TeamMail</h2>
              <button
                onClick={() => { setComposing(true); setSelected(null); }}
                style={{ background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontFamily: "Syne, sans-serif", fontWeight: "600", cursor: "pointer" }}
              >
                + Nuevo
              </button>
            </div>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "var(--text-muted)" }}>
              🔍 Buscar mensajes...
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {MOCK_MESSAGES.map(msg => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg.id); setComposing(false); }}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: selected === msg.id ? "var(--surface-2)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (selected !== msg.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={e => { if (selected !== msg.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  {!msg.read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00a4ef", flexShrink: 0 }} />}
                  <span style={{ fontSize: "13px", fontWeight: msg.read ? "400" : "600", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.from}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel principal */}
        <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
          {composing ? (
            <div className="animate-in">
              <h3 style={{ fontSize: "18px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>Nuevo mensaje</h3>

              {/* Para: con contexto del perfil */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Para</label>
                <select
                  value={to}
                  onChange={e => handleSelectContact(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontFamily: "DM Sans, sans-serif", fontSize: "14px", cursor: "pointer" }}
                >
                  <option value="">Seleccioná un destinatario...</option>
                  {MOCK_CONTACTS.map(c => (
                    <option key={c.email} value={c.email}>{c.name} — {c.role}</option>
                  ))}
                </select>
              </div>

              {/* Contexto del perfil del destinatario */}
              {selectedContact && (
                <div style={{ marginBottom: "16px", padding: "14px 16px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Contexto del destinatario</div>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontFamily: "Syne, sans-serif", fontWeight: "700", color: selectedContact.status === "high" ? "#ff4d6d" : selectedContact.status === "medium" ? "#ffd166" : "#06d6a0" }}>{selectedContact.workload}%</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Carga actual</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", fontFamily: "Syne, sans-serif", fontWeight: "700" }}>{selectedContact.responseTime}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tiempo de respuesta</div>
                    </div>
                    {selectedContact.status === "high" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.2)", borderRadius: "6px", alignSelf: "center" }}>
                        <span style={{ fontSize: "12px", color: "#ff4d6d" }}>⚠️ Carga alta esta semana</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Asunto</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="¿De qué se trata?"
                  style={{ width: "100%", padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontFamily: "DM Sans, sans-serif", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Mensaje</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Escribí tu mensaje..."
                  rows={8}
                  style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontFamily: "DM Sans, sans-serif", fontSize: "14px", outline: "none", resize: "vertical", lineHeight: "1.6" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => alert("Mensaje enviado ✓ (conectá Supabase para persistir)")}
                  style={{ padding: "10px 24px", background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: "8px", fontFamily: "Syne, sans-serif", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                >
                  Enviar
                </button>
                <button
                  onClick={() => setComposing(false)}
                  style={{ padding: "10px 20px", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", fontFamily: "DM Sans, sans-serif", fontSize: "14px", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className="animate-in">
              {(() => {
                const msg = MOCK_MESSAGES.find(m => m.id === selected)!;
                return (
                  <>
                    <div style={{ marginBottom: "24px" }}>
                      <h3 style={{ fontSize: "20px", fontFamily: "Syne, sans-serif", marginBottom: "8px" }}>{msg.subject}</h3>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>De: <strong style={{ color: "var(--text)" }}>{msg.from}</strong> · {msg.time}</div>
                    </div>
                    <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
                      {msg.preview} Este es el cuerpo completo del mensaje. Conectá Supabase para persistir mensajes reales.
                    </div>
                    <button
                      onClick={() => { setComposing(true); setTo(msg.email); setSubject(`Re: ${msg.subject}`); }}
                      style={{ padding: "10px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontFamily: "DM Sans, sans-serif", fontSize: "14px", cursor: "pointer" }}
                    >
                      ↩ Responder
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>✉</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", marginBottom: "8px" }}>TeamMail</div>
              <div style={{ fontSize: "13px", textAlign: "center" }}>Seleccioná un mensaje o creá uno nuevo.<br />Cada mensaje muestra el contexto del destinatario.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
