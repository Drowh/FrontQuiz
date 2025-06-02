import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Основной клиент для обычных операций
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Клиент с service role key только для разработки
// В продакшене этот клиент будет undefined
export const supabaseAdmin = import.meta.env.DEV
  ? createClient(
      supabaseUrl,
      import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string
    )
  : undefined;

// Тип для безопасного использования админского клиента
export type SupabaseAdminClient = NonNullable<typeof supabaseAdmin>;
