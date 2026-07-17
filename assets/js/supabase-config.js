/* LCC — Supabase 연결 설정
 *
 * Supabase 대시보드 → Project Settings → API 에서 값을 복사해 붙여넣으세요.
 *  - Project URL  → SUPABASE_URL
 *  - anon public  → SUPABASE_ANON_KEY  (anon key는 공개되어도 안전하도록 설계된 키입니다)
 */
export const SUPABASE_URL = 'https://vlzmjwfzojhlueglcepr.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsem1qd2Z6b2pobHVlZ2xjZXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODczOTksImV4cCI6MjA5OTg2MzM5OX0.WpPWMOasFC2Ak5XNQS1Dw0fk3faGShH7wRkHIaCKja4';

export const isConfigured =
  SUPABASE_URL.startsWith('https://') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
