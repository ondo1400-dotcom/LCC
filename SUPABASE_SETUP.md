# Supabase 연동 가이드

로그인/회원가입이 동작하려면 Supabase 프로젝트를 만들고 키를 연결해야 합니다. 5분이면 끝납니다.

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 접속 → 로그인 (GitHub 계정으로 가능)
2. **New Project** 클릭
   - Name: `lcc` (아무 이름이나 가능)
   - Database Password: 강력한 비밀번호 설정 (따로 저장해두세요)
   - Region: `Northeast Asia (Seoul)` 선택
3. 프로젝트 생성 완료까지 1~2분 대기

## 2. API 키 복사해서 붙여넣기

1. Supabase 대시보드 → 왼쪽 하단 **Project Settings**(톱니바퀴) → **API**
2. 두 값을 복사:
   - **Project URL** (예: `https://abcdefgh.supabase.co`)
   - **anon public** 키 (`eyJ...`로 시작하는 긴 문자열)
3. `assets/js/supabase-config.js` 파일을 열어 붙여넣기:

```js
export const SUPABASE_URL = 'https://abcdefgh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJ...';
```

> anon key는 브라우저에 노출되어도 안전하도록 설계된 공개 키입니다. (비공개 `service_role` 키는 절대 여기에 넣으면 안 됩니다.)

## 3. 인증 설정

1. 대시보드 → **Authentication** → **Sign In / Up** (또는 Providers)
2. **Email**이 켜져 있는지 확인 (기본으로 켜져 있음)
3. **이메일 인증(Confirm email)** 선택:
   - 켜두면: 가입 시 인증 메일의 링크를 눌러야 로그인 가능 (기본값, 권장)
   - 끄면: 가입 즉시 로그인됨 (테스트할 때 편함)
4. **Authentication → URL Configuration**에서 Site URL을 실제 배포 주소로 설정:
   - `https://lifecodecompany.co.kr`
   - 인증 메일의 링크가 이 주소로 연결됩니다. 로컬 테스트 중이면 `http://localhost:8000`을 Redirect URLs에 추가하세요.

## 4. 로컬에서 테스트

```bash
cd LCC-master
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000/signup.html` 접속 → 가입 → 로그인 확인.
(`file://`로 직접 열면 모듈 스크립트가 차단되므로 반드시 로컬 서버로 여세요.)

가입한 회원은 대시보드 → **Authentication** → **Users**에서 확인할 수 있습니다.

## 5. (선택) 회원 프로필 테이블

지금은 이름을 auth 메타데이터(`full_name`)에 저장합니다. 나중에 회원별 데이터(프로그램 신청 내역 등)를 저장하려면 대시보드 → **SQL Editor**에서 아래를 실행해 프로필 테이블을 만들어두면 좋습니다:

```sql
-- 회원 프로필 테이블
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);

-- 본인 데이터만 읽고 수정 가능하도록 보호 (RLS)
alter table public.profiles enable row level security;

create policy "본인 프로필 조회" on public.profiles
  for select using (auth.uid() = id);

create policy "본인 프로필 수정" on public.profiles
  for update using (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 구현된 것

| 파일 | 역할 |
|---|---|
| `signup.html` | 회원가입 (이름·이메일·비밀번호, 개인정보 동의) |
| `login.html` | 로그인 |
| `mypage.html` | 마이페이지 (로그인 필요, 미로그인 시 로그인 페이지로 이동) |
| `assets/js/supabase-config.js` | Supabase URL·anon key 설정 |
| `assets/js/auth.js` | 인증 로직 + 모든 페이지 헤더에 Login/Join ↔ My Page/Logout 표시 |

모든 페이지 헤더 오른쪽(Contact 버튼 옆)에 로그인 상태가 자동 표시되고, 모바일 메뉴에도 Account 항목이 추가됩니다.
