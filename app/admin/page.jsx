'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TYPE_LONG = 'long';
const TYPE_OFFSET = 'offset';

const SERVICE_SECTIONS = ['valokuvaus', 'videotuotanto', 'some'].map(slug => {
  const SLUG_LABEL = { valokuvaus: 'Valokuvaus', videotuotanto: 'Videotuotanto', some: 'Some' };
  return {
    title: `Palvelusivu: ${SLUG_LABEL[slug]}`,
    fields: [
      { key: `service_${slug}_title`,    label: 'Otsikko (FI)' },
      { key: `service_${slug}_title_en`, label: 'Otsikko (EN)' },
      { key: `service_${slug}_intro`,    label: 'Intro (FI)', type: TYPE_LONG },
      { key: `service_${slug}_intro_en`, label: 'Intro (EN)', type: TYPE_LONG },
      { kind: 'offset', label: 'Intro – siirto', xKey: `service_${slug}_intro_x`, yKey: `service_${slug}_intro_y` },
      { key: `service_${slug}_h1`,       label: 'Lohko 1 – otsikko (FI)' },
      { key: `service_${slug}_h1_en`,    label: 'Lohko 1 – otsikko (EN)' },
      { key: `service_${slug}_p1`,       label: 'Lohko 1 – teksti (FI)', type: TYPE_LONG },
      { key: `service_${slug}_p1_en`,    label: 'Lohko 1 – teksti (EN)', type: TYPE_LONG },
      { kind: 'offset', label: 'Lohko 1 – tekstin siirto', xKey: `service_${slug}_b1_text_x`, yKey: `service_${slug}_b1_text_y` },
      { key: `service_${slug}_h2`,       label: 'Lohko 2 – otsikko (FI)' },
      { key: `service_${slug}_h2_en`,    label: 'Lohko 2 – otsikko (EN)' },
      { key: `service_${slug}_p2`,       label: 'Lohko 2 – teksti (FI)', type: TYPE_LONG },
      { key: `service_${slug}_p2_en`,    label: 'Lohko 2 – teksti (EN)', type: TYPE_LONG },
      { kind: 'offset', label: 'Lohko 2 – tekstin siirto', xKey: `service_${slug}_b2_text_x`, yKey: `service_${slug}_b2_text_y` }
    ]
  };
});

const SECTIONS = [
  {
    title: 'Hero & yhteystiedot',
    fields: [
      { key: 'hero_title', label: 'Hero-otsikko' },
      { key: 'phone',      label: 'Puhelinnumero' },
      { key: 'email',      label: 'Sähköposti' },
      { key: 'address',    label: 'Osoite' }
    ]
  },
  {
    title: 'Tietoa-osio',
    fields: [
      { key: 'about_heading',    label: 'Pääotsikko (FI)' },
      { key: 'about_heading_en', label: 'Pääotsikko (EN)' },
      { kind: 'offset', label: 'Pääotsikko – siirto', xKey: 'about_heading_x', yKey: 'about_heading_y' },
      { key: 'about_text_1',     label: 'Kappale 1 (FI)', type: TYPE_LONG },
      { key: 'about_text_1_en',  label: 'Kappale 1 (EN)', type: TYPE_LONG },
      { key: 'about_text_2',     label: 'Kappale 2 (FI)', type: TYPE_LONG },
      { key: 'about_text_2_en',  label: 'Kappale 2 (EN)', type: TYPE_LONG }
    ]
  },
  {
    title: 'Hinnat',
    fields: [
      { key: 'price_valokuvaus', label: 'Valokuvaus – alkaen' },
      { key: 'price_video',      label: 'Videotuotanto – alkaen' },
      { key: 'price_some',       label: 'Some – kuukausihinta' }
    ]
  },
  ...SERVICE_SECTIONS
];

const ALL_KEYS = Array.from(new Set(SECTIONS.flatMap(s => s.fields.flatMap(f => f.kind === 'offset' ? [f.xKey, f.yKey] : [f.key]))));

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
  const [openSections, setOpenSections] = useState(() => new Set([SECTIONS[0].title]));

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

  const valueFor = (key) => {
    const draft = edits[key];
    if (draft !== undefined) return draft;
    const row = rows.find(r => r.key === key);
    return row?.value ?? '';
  };
  const isDirty = (key) => {
    if (edits[key] === undefined) return false;
    const row = rows.find(r => r.key === key);
    return edits[key] !== (row?.value ?? '');
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
    setTimeout(() => setSavedKey(k => k === key ? null : k), 2200);
  };

  const saveBoth = async (xKey, yKey) => {
    if (edits[xKey] !== undefined) await save(xKey);
    if (edits[yKey] !== undefined) await save(yKey);
  };

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

  const toggleSection = (title) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
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

      <div className="admin-sections">
        {SECTIONS.map(section => {
          const open = openSections.has(section.title);
          return (
            <section key={section.title} className={`admin-section${open ? ' open' : ''}`}>
              <button type="button" className="admin-section-head" onClick={() => toggleSection(section.title)}>
                <span>{section.title}</span>
                <span className="admin-section-chev">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="admin-section-body">
                  {section.fields.map((f, i) => {
                    if (f.kind === 'offset') {
                      const xVal = valueFor(f.xKey);
                      const yVal = valueFor(f.yKey);
                      const dirty = isDirty(f.xKey) || isDirty(f.yKey);
                      const saving = savingKey === f.xKey || savingKey === f.yKey;
                      const saved = savedKey === f.xKey || savedKey === f.yKey;
                      return (
                        <div key={`o-${i}`} className={`admin-row admin-offset${dirty ? ' dirty' : ''}`}>
                          <div className="admin-row-head">
                            <label>{f.label}</label>
                            <span className="admin-key">{f.xKey} / {f.yKey}</span>
                          </div>
                          <OffsetEditor
                            xValue={xVal}
                            yValue={yVal}
                            onXChange={(v) => onChange(f.xKey, v)}
                            onYChange={(v) => onChange(f.yKey, v)}
                            onReset={() => { onChange(f.xKey, '0'); onChange(f.yKey, '0'); }}
                          />
                          <div className="admin-row-foot">
                            <button onClick={() => saveBoth(f.xKey, f.yKey)} disabled={!dirty || saving}>
                              {saving ? 'Tallennetaan…' : 'Tallenna siirto'}
                            </button>
                            {saved && <span className="admin-ok">Tallennettu ✓</span>}
                          </div>
                        </div>
                      );
                    }
                    const dirty = isDirty(f.key);
                    const saving = savingKey === f.key;
                    const saved = savedKey === f.key;
                    const val = valueFor(f.key);
                    return (
                      <div key={f.key} className={`admin-row${dirty ? ' dirty' : ''}`}>
                        <div className="admin-row-head">
                          <label htmlFor={`f-${f.key}`}>{f.label}</label>
                          <span className="admin-key">{f.key}</span>
                        </div>
                        {f.type === TYPE_LONG ? (
                          <textarea id={`f-${f.key}`} rows={5} value={val} onChange={(e) => onChange(f.key, e.target.value)} />
                        ) : (
                          <input id={`f-${f.key}`} type="text" value={val} onChange={(e) => onChange(f.key, e.target.value)} />
                        )}
                        <div className="admin-row-foot">
                          <button onClick={() => save(f.key)} disabled={!dirty || saving}>
                            {saving ? 'Tallennetaan…' : 'Tallenna'}
                          </button>
                          {saved && <span className="admin-ok">Tallennettu ✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function OffsetEditor({ xValue, yValue, onXChange, onYChange, onReset }) {
  const x = parseFloat(xValue) || 0;
  const y = parseFloat(yValue) || 0;
  const RANGE = 200;
  const SIZE = 160;
  const dotX = SIZE / 2 + (x / RANGE) * (SIZE / 2);
  const dotY = SIZE / 2 + (y / RANGE) * (SIZE / 2);
  const onPad = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const nx = Math.round(((px - SIZE / 2) / (SIZE / 2)) * RANGE);
    const ny = Math.round(((py - SIZE / 2) / (SIZE / 2)) * RANGE);
    onXChange(String(Math.max(-RANGE, Math.min(RANGE, nx))));
    onYChange(String(Math.max(-RANGE, Math.min(RANGE, ny))));
  };
  return (
    <div className="offset-grid">
      <div className="offset-pad" onMouseDown={onPad} onClick={onPad} role="presentation" aria-label="Siirrä raahaamalla">
        <div className="offset-pad-cross" />
        <div className="offset-pad-dot" style={{ left: dotX, top: dotY }} />
      </div>
      <div className="offset-controls">
        <label>X (px)
          <div className="offset-row">
            <input type="range" min={-RANGE} max={RANGE} step={1} value={x} onChange={(e) => onXChange(e.target.value)} />
            <input type="number" value={x} onChange={(e) => onXChange(e.target.value)} />
          </div>
        </label>
        <label>Y (px)
          <div className="offset-row">
            <input type="range" min={-RANGE} max={RANGE} step={1} value={y} onChange={(e) => onYChange(e.target.value)} />
            <input type="number" value={y} onChange={(e) => onYChange(e.target.value)} />
          </div>
        </label>
        <button type="button" className="offset-reset" onClick={onReset}>Nollaa (0, 0)</button>
      </div>
    </div>
  );
}
