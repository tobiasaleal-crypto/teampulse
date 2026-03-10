"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
      <div style={{ color:"var(--text-muted)" }}>Cargando...</div>
    </div>
  );

  return (
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"600px", background:"radial-gradient(circle, rgba(0,164,239,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div className="animate-in" style={{ width:"100%", maxWidth:"420px", padding:"0 24px", position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ marginBottom:"48px", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
            <div style={{ width:"40px", height:"40px", background:"linear-gradient(135deg, #00a4ef, #0078d4)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>⚡</div>
            <span style={{ fontFamily:"Syne, sans-serif", fontSize:"22px", fontWeight:"700", letterSpacing:"-0.03em" }}>TeamsPulse</span>
          </div>
          <p style={{ color:"var(--text-muted)", fontSize:"14px", lineHeight:"1.5" }}>
            Productividad inteligente para tu equipo.<br />Conectate con tu workspace para empezar.
          </p>
        </div>

        {/* Botones */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

          {/* Microsoft */}
          <LoginButton
            onClick={() => signIn("azure-ad", { callbackUrl:"/dashboard" })}
            hoverColor="#00a4ef"
            hoverBg="rgba(0,164,239,0.05)"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 6.5C14.5 7.88 13.38 9 12 9C10.62 9 9.5 7.88 9.5 6.5C9.5 5.12 10.62 4 12 4C13.38 4 14.5 5.12 14.5 6.5Z" fill="#00a4ef"/>
                <path d="M18 8.5C18 9.33 17.33 10 16.5 10C15.67 10 15 9.33 15 8.5C15 7.67 15.67 7 16.5 7C17.33 7 18 7.67 18 8.5Z" fill="#7B83EB"/>
                <path d="M8 16V11.5C8 10.67 8.67 10 9.5 10H14.5C15.33 10 16 10.67 16 11.5V16C16 18.21 14.21 20 12 20C9.79 20 8 18.21 8 16Z" fill="#00a4ef"/>
                <path d="M15 11H19C19.55 11 20 11.45 20 12V15.5C20 17.43 18.43 19 16.5 19C16.17 19 15.85 18.96 15.54 18.88C15.83 18.29 16 17.66 16 17V11.5C16 11.33 15.97 11.16 15.93 11H15Z" fill="#7B83EB" opacity="0.8"/>
              </svg>
            }
            title="Continuar con Microsoft Teams"
            subtitle="Outlook · Calendar · SharePoint"
          />

          {/* Google */}
          <LoginButton
            onClick={() => signIn("google", { callbackUrl:"/dashboard" })}
            hoverColor="#34a853"
            hoverBg="rgba(52,168,83,0.05)"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
            title="Continuar con Google Workspace"
            subtitle="Gmail · Calendar · Drive"
          />
        </div>

        <p style={{ textAlign:"center", marginTop:"32px", fontSize:"12px", color:"var(--text-muted)", lineHeight:"1.5" }}>
          Al continuar, aceptás nuestros{" "}
          <span style={{ color:"var(--text)", cursor:"pointer" }}>Términos de uso</span> y{" "}
          <span style={{ color:"var(--text)", cursor:"pointer" }}>Política de privacidad</span>.
          <br />Tus datos nunca se venden a terceros.
        </p>
      </div>
    </main>
  );
}

function LoginButton({ onClick, hoverColor, hoverBg, icon, title, subtitle }: any) {
  const base = { display:"flex", alignItems:"center", gap:"14px", width:"100%", padding:"16px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"14px", color:"var(--text)", cursor:"pointer", transition:"all 0.2s", fontFamily:"DM Sans, sans-serif", fontSize:"15px" };
  return (
    <button
      onClick={onClick}
      style={base}
      onMouseEnter={e => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor:hoverColor, background:hoverBg }); }}
      onMouseLeave={e => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor:"var(--border)", background:"var(--surface)" }); }}
    >
      {icon}
      <div style={{ textAlign:"left" }}>
        <div style={{ fontWeight:"500" }}>{title}</div>
        <div style={{ fontSize:"12px", color:"var(--text-muted)", marginTop:"2px" }}>{subtitle}</div>
      </div>
      <div style={{ marginLeft:"auto", color:"var(--text-muted)", fontSize:"18px" }}>→</div>
    </button>
  );
}
