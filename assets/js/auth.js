/* LCC — Supabase 인증 (회원가입 · 로그인 · 로그아웃 · 헤더 상태 표시) */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from './supabase-config.js';

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/* ---- 공통: 폼 메시지 표시 ---- */
function showMsg(form, text, type) {
  let el = form.querySelector('.auth-msg');
  if (!el) {
    el = document.createElement('p');
    el.className = 'auth-msg';
    form.prepend(el);
  }
  el.textContent = text;
  el.classList.toggle('is-error', type === 'error');
  el.classList.toggle('is-ok', type === 'ok');
}

/* Supabase 에러 메시지 한글화 */
function translateError(message) {
  const map = {
    'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'Email not confirmed': '이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해주세요.',
    'User already registered': '이미 가입된 이메일입니다.',
    'Password should be at least 6 characters.': '비밀번호는 6자 이상이어야 합니다.',
  };
  return map[message] || message;
}

function requireConfig(form) {
  if (supabase) return true;
  showMsg(form, 'Supabase가 아직 연결되지 않았습니다. assets/js/supabase-config.js에 프로젝트 URL과 anon key를 입력해주세요.', 'error');
  return false;
}

/* ---- 헤더에 로그인 상태 반영 ---- */
async function renderHeaderAuth() {
  const headerInner = document.querySelector('.header__inner');
  if (!headerInner) return;

  let session = null;
  if (supabase) {
    ({ data: { session } } = await supabase.auth.getSession());
  }

  let slot = document.getElementById('authSlot');
  if (!slot) {
    slot = document.createElement('div');
    slot.id = 'authSlot';
    slot.className = 'auth-slot';
    const cta = headerInner.querySelector('.cta-pill');
    headerInner.insertBefore(slot, cta);
  }

  if (session) {
    const name = session.user.user_metadata?.full_name || session.user.email;
    slot.innerHTML =
      '<a class="auth-link" href="mypage.html" title="' + name + '">My Page</a>' +
      '<button type="button" class="auth-link auth-link--logout" id="headerLogout">Logout</button>';
    slot.querySelector('#headerLogout').addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.href = 'index.html';
    });
  } else {
    slot.innerHTML =
      '<a class="auth-link" href="login.html">Login</a>' +
      '<a class="auth-link auth-link--strong" href="signup.html">Join</a>';
  }

  /* 모바일 메뉴에도 추가 */
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav && !mobileNav.querySelector('.group--auth')) {
    const g = document.createElement('div');
    g.className = 'group group--auth';
    g.innerHTML = session
      ? '<strong>Account</strong><a href="mypage.html">My Page</a><a href="index.html" id="mobileLogout">로그아웃</a>'
      : '<strong>Account</strong><a href="login.html">로그인</a><a href="signup.html">회원가입</a>';
    mobileNav.appendChild(g);
    const mLogout = g.querySelector('#mobileLogout');
    if (mLogout) mLogout.addEventListener('click', () => supabase.auth.signOut());
  }
}

/* ---- 회원가입 (signup.html) ---- */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireConfig(signupForm)) return;

    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const passwordCheck = signupForm.password_check.value;

    if (password !== passwordCheck) {
      showMsg(signupForm, '비밀번호가 서로 일치하지 않습니다.', 'error');
      return;
    }

    const btn = signupForm.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    btn.disabled = false;

    if (error) {
      showMsg(signupForm, translateError(error.message), 'error');
      return;
    }

    if (data.session) {
      /* 이메일 확인이 꺼져 있으면 바로 로그인됨 */
      location.href = 'mypage.html';
    } else {
      showMsg(signupForm, '가입 확인 메일을 보냈습니다. 받은 편지함에서 인증 링크를 눌러 가입을 완료해주세요.', 'ok');
      signupForm.reset();
    }
  });
}

/* ---- 로그인 (login.html) ---- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireConfig(loginForm)) return;

    const btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email.value.trim(),
      password: loginForm.password.value,
    });

    btn.disabled = false;

    if (error) {
      showMsg(loginForm, translateError(error.message), 'error');
      return;
    }
    location.href = 'mypage.html';
  });
}

/* ---- 마이페이지 (mypage.html) ---- */
const mypageEl = document.getElementById('mypage');
if (mypageEl) {
  (async () => {
    if (!supabase) { location.href = 'login.html'; return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { location.href = 'login.html'; return; }

    const u = session.user;
    document.getElementById('mypageName').textContent = u.user_metadata?.full_name || '회원';
    document.getElementById('mypageEmail').textContent = u.email;
    document.getElementById('mypageJoined').textContent =
      new Date(u.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('mypageLogout').addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.href = 'index.html';
    });
  })();
}

renderHeaderAuth();
