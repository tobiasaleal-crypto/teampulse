import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { teamData } = await req.json();

  const teamText = teamData.map((emp: any) =>
    `- ${emp.name} (${emp.role}): carga ${emp.workload}%, ${emp.meetings} reuniones, ${emp.focusHours}hs de foco, ${emp.emails} emails`
  ).join("\n");

  const prompt = `Sos un consultor de productividad analizando el estado semanal de un equipo de una startup tech.

Datos del equipo esta semana:
${teamText}

Generá un resumen ejecutivo en español con:
1. Estado general del equipo (2-3 oraciones)
2. Personas que necesitan atención (quiénes tienen sobrecarga y por qué es un riesgo)
3. Puntos positivos (quiénes están en buen estado)
4. 3 recomendaciones concretas y accionables para el manager esta semana

Sé directo, específico y útil. Usá nombres reales. Máximo 300 palabras.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Error al llamar a Claude API" }, { status: 500 });
  }

  const data = await response.json();
  const summary = data.content[0]?.text || "No se pudo generar el resumen.";

  return NextResponse.json({ summary });
}
