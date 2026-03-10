// ==============================================
// CAPA DE ABSTRACCIÓN DE SERVICIOS
// Esto permite que la app funcione igual con
// Microsoft y Google sin duplicar código
// ==============================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: number;
}

export interface EmailSummary {
  total: number;
  unread: number;
  avgResponseTime: string;
}

export interface EmployeeMetrics {
  name: string;
  email: string;
  avatar?: string;
  meetingsThisWeek: number;
  focusHours: number;
  emailsTotal: number;
  workloadPercent: number;
  provider: "microsoft" | "google";
}

// --- MICROSOFT GRAPH API ---
async function getMicrosoftCalendarEvents(
  accessToken: string
): Promise<CalendarEvent[]> {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now.toISOString()}&endDateTime=${weekEnd.toISOString()}&$top=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error("Error al obtener eventos de Microsoft");

  const data = await res.json();
  return data.value.map((event: any) => ({
    id: event.id,
    title: event.subject,
    start: event.start.dateTime,
    end: event.end.dateTime,
    attendees: event.attendees?.length || 0,
  }));
}

async function getMicrosoftEmailSummary(
  accessToken: string
): Promise<EmailSummary> {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=50&$select=isRead,receivedDateTime`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error("Error al obtener emails de Microsoft");

  const data = await res.json();
  const emails = data.value;
  const unread = emails.filter((e: any) => !e.isRead).length;

  return {
    total: emails.length,
    unread,
    avgResponseTime: "~2hs", // TODO: calcular real
  };
}

async function getMicrosoftProfile(accessToken: string) {
  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Error al obtener perfil de Microsoft");
  return res.json();
}

// --- GOOGLE APIS ---
async function getGoogleCalendarEvents(
  accessToken: string
): Promise<CalendarEvent[]> {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${weekEnd.toISOString()}&maxResults=50&singleEvents=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error("Error al obtener eventos de Google");

  const data = await res.json();
  return (data.items || []).map((event: any) => ({
    id: event.id,
    title: event.summary || "Sin título",
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    attendees: event.attendees?.length || 0,
  }));
}

async function getGoogleEmailSummary(
  accessToken: string
): Promise<EmailSummary> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&labelIds=INBOX`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error("Error al obtener emails de Google");

  const data = await res.json();
  const unreadRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&labelIds=INBOX,UNREAD`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const unreadData = await unreadRes.json();

  return {
    total: data.resultSizeEstimate || 0,
    unread: unreadData.resultSizeEstimate || 0,
    avgResponseTime: "~3hs",
  };
}

async function getGoogleProfile(accessToken: string) {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Error al obtener perfil de Google");
  return res.json();
}

// ==============================================
// SERVICIO UNIFICADO — La app siempre llama esto
// No importa si el usuario usa Microsoft o Google
// ==============================================

export const workspaceService = {
  async getCalendarEvents(
    accessToken: string,
    provider: string
  ): Promise<CalendarEvent[]> {
    if (provider === "azure-ad") {
      return getMicrosoftCalendarEvents(accessToken);
    }
    return getGoogleCalendarEvents(accessToken);
  },

  async getEmailSummary(
    accessToken: string,
    provider: string
  ): Promise<EmailSummary> {
    if (provider === "azure-ad") {
      return getMicrosoftEmailSummary(accessToken);
    }
    return getGoogleEmailSummary(accessToken);
  },

  async getProfile(accessToken: string, provider: string) {
    if (provider === "azure-ad") {
      return getMicrosoftProfile(accessToken);
    }
    return getGoogleProfile(accessToken);
  },

  // Calcular métricas de carga de trabajo
  calculateWorkload(events: CalendarEvent[]): number {
    const meetingHours = events.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    // Asumiendo 40hs semanales = 100%
    return Math.min(Math.round((meetingHours / 40) * 100), 100);
  },

  calculateFocusHours(events: CalendarEvent[]): number {
    const meetingHours = events.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    return Math.max(0, Math.round(40 - meetingHours));
  },
};
