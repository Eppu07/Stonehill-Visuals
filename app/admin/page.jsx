'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FIELD_LABELS = {
  hero_title: 'Hero-otsikko',
  about_text_1: 'Esittely – kappale 1 (FI)',
  about_text_1_en: 'Esittely – kappale 1 (EN)',
  about_text_2: 'Esittely – kappale 2 (FI)',
  about_text_2_en: 'Esittely – kappale 2 (EN)',
  some_note: 'Some – huomautus (FI)',
  some_note_en: 'Some – huomautus (EN)',
  price_yo: 'Hinta: yo-/rippikuvat',
  price_henkilo: 'Hinta: henkilökuvat',
  price_yritys: 'Hinta: yritysvalokuvat',
  price_video: 'Hinta: videotuotanto (alk.)',
  price_some: 'Hinta: somehallinnointi',
  phone: 'Puhelinnumero',
  email: 'Sähköposti',
  address: 'Osoite'
};

const LONG_FIELDS = new Set(['about_text_1', 'about_text_1_en', 'about_text_2', 'about_text_2_en', 'some_note', 'some_note_en']);

const FIELD_ORDER = Object.keys(FIELD_LABELS);

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [rows, setRows] = useState([]);
  const [edits, setEdits] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setBootLoading(false);
      setError('Supabase-yhteyttä ei ole konfiguroitu (NEXT_PUBLIC_SUPABASE_URL puuttuu).');
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setBootLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('content')
        .select('key, value, updated_at')
        .order('key');
      if (!mounted) return;
      if (error) setError(error.message);
      else setRows(data || []);
    })();
    return () => { mounted = false; };
  }, [session]);

  const login = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) setAuthError(error.message);
    else { setEmail(''); setPassword(''); }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRows([]);
    setEdits({});
  };

  const onChange = (key, value) => {
    setEdits(prev => ({ ...prev, [key]: value }));
    setSavedKey(null);
  };

  const save = async (key) => {
    if (!supabase) return;
    const newValue = edits[key];
    if (newValue === undefined) return;
    setSavingKey(key);
    setError(null);
    const { error } = await supabase
      .from('content')
      .upsert({ key, value: newValue, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setSavingKey(null);
    if (error) {
      setError(error.message);
      return;
    }
    setRows(prev => {
      const exists = prev.some(r => r.key === key);
      if (exists) return prev.map(r => r.key === key ? { ...r, value: newValue, updated_at: new Date().toISOString() } : r);
      return [...prev, { key, value: newValue, updated_at: new Date().toISOString() }];
    });
    setEdits(prev => { const { [key]: _, ...rest } = prev; return rest; });
    setSavedKey(key);
    setTimeout(() => setSavedKey(k => k === key ? null : k), 2500);
  };

  if (bootLoading) {
    return <div className="admin-shell"><p className="admin-status">Ladataan…</p></div>;
  }

  if (!session) {
    return (
      <div className="admin-shell">
        <div className="admin-card admin-login">
          <h1>Admin</h1>
          <p className="admin-sub">Kirjaudu sisään muokataksesi sivuston sisältöä.</p>
          <form onSubmit={login}>
            <label>Sähköposti
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Salasana
              <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {authError && <p className="admin-err">{authError}</p>}
            <button type="submit" disabled={authBusy}>
              {authBusy ? 'Kirjaudutaan…' : 'Kirjaudu sisään'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <h1>Sisällönhallinta</h1>
          <p className="admin-sub">Kirjautuneena: <strong>{session.user.email}</strong></p>
        </div>
        <button className="admin-logout" onClick={logout}>Kirjaudu ulos</button>
      </header>

      {error && <p className="admin-err">{error}</p>}

      <div className="admin-grid">
        {FIELD_ORDER.map((key) => {
          const row = rows.find(r => r.key === key) || { key, value: '' };
          const label = FIELD_LABELS[key] || key;
          const isLong = LONG_FIELDS.has(key);
          const draft = edits[key];
          const dirty = draft !== undefined && draft !== row.value;
          const value = draft !== undefined ? draft : (row.value ?? '');
          return (
            <div key={key} className={`admin-row${dirty ? ' dirty' : ''}`}>
              <div className="admin-row-head">
                <label htmlFor={`f-${key}`}>{label}</label>
                <span className="admin-key">{key}</span>
              </div>
              {isLong ? (
                <textarea id={`f-${key}`} rows={5} value={value} onChange={(e) => onChange(key, e.target.value)} />
              ) : (
                <input id={`f-${key}`} type="text" value={value} onChange={(e) => onChange(key, e.target.value)} />
              )}
              <div className="admin-row-foot">
                <button onClick={() => save(key)} disabled={!dirty || savingKey === key}>
                  {savingKey === key ? 'Tallennetaan…' : 'Tallenna'}
                </button>
                {savedKey === key && <span className="admin-ok">Tallennettu ✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
