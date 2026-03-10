-- ==============================================
-- TEAMSPULSE - Schema de Base de Datos (Supabase)
-- Ejecutar en el SQL Editor de Supabase
-- ==============================================

-- Tabla de empleados/perfiles
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT,
  department TEXT,
  provider TEXT NOT NULL, -- 'azure-ad' o 'google'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de métricas semanales (se actualiza cada semana)
CREATE TABLE weekly_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  meetings_count INTEGER DEFAULT 0,
  focus_hours DECIMAL DEFAULT 0,
  emails_total INTEGER DEFAULT 0,
  emails_unread INTEGER DEFAULT 0,
  workload_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, week_start)
);

-- Tabla de TeamMail (mensajería interna)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de resúmenes semanales generados por IA
CREATE TABLE weekly_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_email TEXT NOT NULL,
  week_start DATE NOT NULL,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_messages_to_email ON messages(to_email);
CREATE INDEX idx_messages_from_email ON messages(from_email);
CREATE INDEX idx_weekly_metrics_employee ON weekly_metrics(employee_id);
CREATE INDEX idx_employees_email ON employees(email);

-- Row Level Security (RLS) - cada usuario solo ve sus datos
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
