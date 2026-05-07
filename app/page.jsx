'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from './lib/supabase';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdylnpv';
const MAPS_QUERY = 'Opaalikatu+4,+60100+Sein%C3%A4joki';
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

const PORTFOLIO = [
  { src: '/portfolio/_DSC9541.jpg', alt: 'Yrityskuvaus henkilökuva' },
  { src: '/portfolio/_DSC9582-2.jpg', alt: 'Yrityskuvaus ulkona' },
  { src: '/portfolio/_DSC9556-3.jpg', alt: 'Yrityskuvaus autolla' },
  { src: '/portfolio/_DSC9485.jpg', alt: 'Yrityskuvaus toimisto' },
  { src: '/portfolio/_DSC9458.jpg', alt: 'Yrityskuvaus koulutus' },
  { src: '/portfolio/_DSC9641.jpg', alt: 'Yrityskuvaus brändikuva' },
  { src: '/portfolio/_DSC9646.jpg', alt: 'Yrityskuvaus brändikuva' },
  { src: '/portfolio/_DSC9661.jpg', alt: 'Yrityskuvaus edustuskuva' },
  { src: '/portfolio/C8053T01.jpg', alt: 'Yrityskuvaus tilakuvaus' },
  { src: '/portfolio/_DSC1765.jpg', alt: 'Henkilökuvaus ylioppilaskuva' },
  { src: '/portfolio/_DSC1736.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/_DSC1945.jpg', alt: 'Henkilökuvaus ulkona' },
  { src: '/portfolio/_DSC1769.jpg', alt: 'Henkilökuvaus luonnossa' },
  { src: '/portfolio/_DSC0947.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/_DSC0950.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/_DSC0951.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/_DSC0959-2.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/_DSC0965.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/DSC09871.jpg', alt: 'Henkilökuvaus muotokuva' },
  { src: '/portfolio/DSC09896.jpg', alt: 'Henkilökuvaus muotokuva' }
];

const FAQ = [
  {
    fi: { q: 'Mitä yrityskuvaus maksaa Seinäjoella?', a: 'Yritysvalokuvaus alkaa 240 eurosta. Lopullinen hinta riippuu kuvauksen kestosta, lokaatiosta ja toimitettavien kuvien määrästä. Jokainen projekti hinnoitellaan yksilöllisesti – pyydä tarjous lomakkeella tai sähköpostitse.' },
    en: { q: 'How much does business photography cost in Seinäjoki?', a: 'Business photography starts from €240. The final price depends on duration, location and number of delivered photos. Each project is priced individually – request a quote via the form or by email.' }
  },
  {
    fi: { q: 'Mitä videotuotanto maksaa?', a: 'Videotuotannot alkavat 400 eurosta. Hinta määräytyy keston, lokaatioiden, jälkikäsittelyn ja toimitettavan materiaalin laajuuden mukaan. Pyydä räätälöity tarjous.' },
    en: { q: 'How much does video production cost?', a: 'Video productions start from €400. The price depends on the length, locations, post-production and the scope of the deliverables. Request a tailored quote.' }
  },
  {
    fi: { q: 'Kuinka nopeasti saan valmiit kuvat tai videot?', a: 'Valmiit, editoidut kuvat toimitetaan yleensä 5–7 arkipäivässä kuvauksesta. Videoiden toimitusaika on tyypillisesti 1–3 viikkoa projektin laajuudesta riippuen.' },
    en: { q: 'How quickly will I receive the finished material?', a: 'Edited photos are usually delivered within 5–7 business days. Videos typically take 1–3 weeks depending on project scope.' }
  },
  {
    fi: { q: 'Missä päin Suomea kuvaatte?', a: 'Kuvaamme pääasiassa Seinäjoella ja koko Etelä-Pohjanmaan alueella. Voimme tulla kuvaamaan myös muualle Suomeen – ota yhteyttä ja sovitaan yksityiskohdat.' },
    en: { q: 'Where in Finland do you shoot?', a: 'We primarily shoot in Seinäjoki and throughout South Ostrobothnia. We can also travel elsewhere in Finland – get in touch and we will arrange the details.' }
  },
  {
    fi: { q: 'Miten kuvaajan varaaminen toimii?', a: 'Täytä varauslomake sivustollamme tai lähetä sähköpostia osoitteeseen elias.kivimaki@gmail.com. Vastaamme yleensä saman päivän aikana ja sovimme yhdessä kuvauksen ajankohdan, paikan ja tarpeet.' },
    en: { q: 'How does booking a photographer work?', a: 'Fill in the booking form on our site or email elias.kivimaki@gmail.com. We usually reply the same day and agree on timing, location and details together.' }
  },
  {
    fi: { q: 'Mitä somehallinnointi sisältää?', a: 'Sosiaalisen median hallinnointi (350 €/kk) sisältää sisältösuunnittelun, postausten tuotannon ja julkaisut yrityksesi some-kanavissa. Sovitaan yhdessä volyymi ja kanavat.' },
    en: { q: 'What does social media management include?', a: 'Social media management (€350/mo) covers content planning, post production and publishing on your channels. We agree the volume and platforms together.' }
  },
  {
    fi: { q: 'Voinko peruuttaa tai siirtää varaukseni?', a: 'Kyllä – peruutus tai siirto onnistuu, kun ilmoitat siitä viimeistään edellisenä päivänä ennen sovittua kuvausta.' },
    en: { q: 'Can I cancel or reschedule my booking?', a: 'Yes – you can cancel or reschedule as long as you let us know by the day before the shoot.' }
  },
  {
    fi: { q: 'Voiko kuvia ja videoita käyttää kaupallisesti?', a: 'Kyllä. Toimitetut materiaalit sisältävät käyttöoikeuden kaupalliseen käyttöön verkkosivuilla, sosiaalisessa mediassa ja painomateriaalissa.' },
    en: { q: 'Can the photos and videos be used commercially?', a: 'Yes. Delivered materials include a commercial licence for use on websites, social media and print.' }
  }
];

function T({ fi, en, lang, html = false }) {
  const v = lang === 'fi' ? fi : en;
  return html ? <span dangerouslySetInnerHTML={{ __html: v }} /> : <>{v}</>;
}

export default function Page() {
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('fi');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [bookType, setBookType] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [cbValues, setCbValues] = useState([]);
  const [privateMuu, setPrivateMuu] = useState('');
  const [privateTyyppi, setPrivateTyyppi] = useState('');
  const formPrivate = useRef(null);
  const formBusiness = useRef(null);

  const t = (fi, en) => (lang === 'fi' ? fi : en);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(
      'Valokuvaaja Seinäjoki – Elias Kivimäki | stonehill.architect',
      'Photographer Seinäjoki – Elias Kivimäki | stonehill.architect'
    );
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
  }, [lightbox]);

  const goHome = () => { setPage('home'); setMenuOpen(false); };
  const goPortfolio = () => { setPage('portfolio'); setMenuOpen(false); };
  const goBooking = () => { setPage('booking'); setMenuOpen(false); setSuccess(false); setBookType(null); };

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCb = (val) => {
    setCbValues(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const formatDate = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 2 && v.length <= 4) v = v.slice(0, 2) + '.' + v.slice(2);
    else if (v.length > 4) v = v.slice(0, 2) + '.' + v.slice(2, 4) + '.' + v.slice(4, 8);
    e.target.value = v;
  };

  const submitForm = async (e, type) => {
    e.preventDefault();
    const isPrivate = type === 'yksityinen';
    setSending(true);
    const form = isPrivate ? formPrivate.current : formBusiness.current;
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || '').toString().trim() || null;

    const row = {
      booking_type: isPrivate ? 'yksityinen' : 'yritys',
      etunimi: get('etunimi'),
      sukunimi: get('sukunimi'),
      sahkoposti: get('sahkoposti'),
      puhelin: get('puhelin'),
      yritys: get('yritys'),
      palvelu: get('palvelu'),
      kuvaustyyppi: get('kuvaustyyppi') === 'Muu' ? get('kuvaustyyppiMuu') : get('kuvaustyyppi'),
      sijainti: get('sijainti'),
      pvm: get('pvm'),
      kaytto: !isPrivate && cbValues.length
        ? [...cbValues, get('kayttoMuu')].filter(Boolean).join(', ')
        : null,
      lisatiedot: get('lisatiedot'),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 250) : null
    };

    try {
      // 1) Tallennetaan ensin Supabaseen (varsinainen rekisteri)
      let supabaseOk = false;
      if (supabase) {
        const { error } = await supabase.from('bookings').insert(row);
        if (!error) supabaseOk = true;
        else console.error('Supabase insert failed:', error);
      }

      // 2) Email-ilmoitus Formspreen kautta (rinnalla)
      const fsData = new FormData(form);
      fsData.append('varaustyyppi', isPrivate ? 'Yksityishenkilö' : 'Yritys / Organisaatio');
      if (!isPrivate && cbValues.length) fsData.append('kaytto', cbValues.join(', '));
      fsData.append('_subject', isPrivate
        ? 'Uusi varaus (yksityishenkilö) – stonehill.architect'
        : 'Uusi varaus (yritys) – stonehill.architect');
      if (row.sahkoposti) fsData.append('_replyto', row.sahkoposti);
      let formspreeOk = false;
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST', body: fsData, headers: { Accept: 'application/json' }
        });
        formspreeOk = res.ok;
      } catch (e) {
        console.warn('Formspree failed:', e);
      }

      if (supabaseOk || formspreeOk) {
        setSuccess(true);
        setBookType(null);
      } else {
        throw new Error('molemmat lähetysreitit epäonnistuivat');
      }
    } catch (err) {
      console.error(err);
      alert(t(
        'Lomakkeen lähetys epäonnistui. Yritä uudelleen tai ota yhteyttä osoitteeseen elias.kivimaki@gmail.com.',
        'Sending the form failed. Please try again or contact us at elias.kivimaki@gmail.com.'
      ));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <nav id="mainNav">
        <button className="nav-logo" onClick={goHome}>STONEHILL.ARCHITECT</button>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li><button className={page === 'portfolio' ? 'active' : ''} onClick={goPortfolio}>{t('Portfolio', 'Portfolio')}</button></li>
          <li><button onClick={() => scrollTo('palvelut')}>{t('Palvelut', 'Services')}</button></li>
          <li><button onClick={() => scrollTo('yhteystiedot')}>{t('Ota yhteyttä', 'Contact')}</button></li>
        </ul>
        <div className="nav-right">
          <button className="lang-btn" onClick={() => setLang(lang === 'fi' ? 'en' : 'fi')}>{lang === 'fi' ? 'ENG' : 'FI'}</button>
          <button className="nav-btn" onClick={goBooking}>{t('Varaa kuvaus', 'Book a shoot')}</button>
          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label={t('Valikko', 'Menu')}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HOME */}
      <div id="page-home" className={`page${page === 'home' ? ' active' : ''}`}>
        <section className="hero">
          <iframe
            className="hero-video"
            src="https://www.youtube-nocookie.com/embed/CxOth6NddFo?autoplay=1&mute=1&loop=1&playlist=CxOth6NddFo&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&playsinline=1&fs=0&cc_load_policy=0&vq=hd1080&hd=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            aria-hidden="true"
            tabIndex="-1"
            frameBorder="0"
            title="hero"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>{t('Valokuvaaja', 'Photographer')}<br />Elias Kivimäki</h1>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about-section">
          <div className="wrap">
            <div className="about-inner">
              <span className="tag">{t('Minä', 'About')}</span>
              <h2>{t('Elias Kivimäki', 'Elias Kivimäki')}</h2>
              <p className="about-text">
                {t(
                  'Olen 19-vuotias juuri lukiosta valmistunut valokuvaaja Seinäjoelta. Olen kuvannut kahden vuoden ajan, ja lukio-opintojen ohella olen perehtynyt vapaa-ajallani markkinointiin sekä sosiaalisen median ja visuaalisen viestinnän rooliin brändityössä.',
                  'I’m a 19-year-old photographer from Seinäjoki, just graduated from upper secondary school. I’ve been shooting for two years, and alongside my studies I’ve spent my free time learning about marketing and the role of social media and visual communication in brand building.'
                )}
              </p>
              <p className="about-text">
                {t(
                  'Tarjoan valokuvaus-, videotuotanto- ja some-palveluita yrityksille ja yksityisille asiakkaille. Valokuvauksessa kuvaan niin henkilöitä, yrityksiä, tapahtumia kuin tuotteitakin. Videotuotanto kattaa koko prosessin suunnittelusta editointiin – lyhyistä somevideoista pidempiin yrityssisältöihin.',
                  'I offer photography, video production and social media services for both businesses and private clients. In photography I shoot portraits, businesses, events and products alike. Video production covers the entire process from planning to editing – from short social videos to longer corporate content.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* PALVELUT */}
        <section id="palvelut" style={{ background: '#000' }}>
          <div className="wrap">
            <h2>{t('Ammattimaiset kuvauspalvelut Seinäjoella', 'Professional photography services in Seinäjoki')}</h2>
            <div className="svc-grid">
              {/* Valokuvaus */}
              <div className="svc-card">
                <h3>{t('Valokuvaus', 'Photography')}</h3>
                <p>{t('Henkilökuvat, yrityskuvaukset ja sisältö someen.', 'Portraits, business shoots and content for social media.')}</p>
                <ul className="svc-list">
                  <li><span>{t('Yo- ja rippikuvat', 'Graduation photos')}</span><span className="svc-price">80 €</span></li>
                  <li><span>{t('Yritysvalokuvat', 'Business photos')}</span><span className="svc-price">240 €</span></li>
                  <li><span>{t('Somekuvat', 'Social media photos')}</span><span className="svc-price">{t('Sopimuksen mukaan', 'On request')}</span></li>
                </ul>
              </div>

              {/* Videotuotanto — featured */}
              <div className="svc-card svc-featured">
                <h3>{t('Videotuotanto', 'Video production')}</h3>
                <p>{t('Liikkuvaa kuvaa, joka jää mieleen.', 'Motion that sticks.')}</p>
                <ul className="svc-list">
                  <li><span>{t('Häävideot', 'Wedding videos')}</span></li>
                  <li><span>{t('Tapahtumavideot', 'Event videos')}</span></li>
                  <li><span>{t('Markkinointivideot', 'Marketing videos')}</span></li>
                </ul>
                <div className="svc-foot">
                  <span className="svc-foot-unit">{t('Hinta alkaen', 'From')}</span>
                  <span className="svc-foot-price">400 €</span>
                </div>
              </div>

              {/* Some */}
              <div className="svc-card">
                <h3>{t('Some', 'Social media')}</h3>
                <p>{t('Sosiaalisen median alustojen hallinnointi ja postaukset.', 'Social media management and publishing.')}</p>
                <ul className="svc-list">
                  <li><span>{t('Sisältösuunnittelu', 'Content planning')}</span></li>
                  <li><span>{t('Postausten tuotanto', 'Post production')}</span></li>
                  <li><span>{t('Julkaisu kanavissa', 'Publishing on channels')}</span></li>
                </ul>
                <div className="svc-foot">
                  <span className="svc-foot-unit">{t('Kuukausihinta', 'Monthly')}</span>
                  <span className="svc-foot-price">350 €/kk</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="ukk" style={{ background: '#07070c' }}>
          <div className="wrap">
            <h2 style={{ color: '#fff' }}>{t('Usein kysytyt kysymykset', 'Frequently asked questions')}</h2>
            <div className="faq-grid">
              <div className="faq-list">
                {FAQ.map((item, i) => (
                  <details key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.06)', padding: '20px 0', cursor: 'pointer' }}>
                    <summary style={{ fontSize: '1rem', fontWeight: 500, color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {t(item.fi.q, item.en.q)}
                      <span style={{ color: '#00AEEF', fontSize: '1.2rem' }}>+</span>
                    </summary>
                    <p style={{ color: '#fff', fontSize: '.93rem', lineHeight: 1.8, marginTop: 14, fontWeight: 300 }}>{t(item.fi.a, item.en.a)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* OTA YHTEYTTÄ */}
        <section id="yhteystiedot" className="cta-section">
          <div className="wrap">
            <div className="cta-blk">
              <h2>{t('Ota yhteyttä', 'Get in touch')}</h2>
              <div className="contact-info">
                <div><strong>stonehill.architect</strong> · Elias Kivimäki</div>
                <div>Opaalikatu 4, 60100 Seinäjoki</div>
                <div>
                  <a href="mailto:elias.kivimaki@gmail.com">elias.kivimaki@gmail.com</a>
                </div>
                <div className="contact-call">
                  {t('Soita tai jätä viestiä: ', 'Call or leave a message: ')}
                  <a href="tel:+358407209804"><strong>040 720 9804</strong></a>
                </div>
              </div>
              <div className="cta-row">
                <button className="btn-p" onClick={goBooking}>{t('Varaa kuvaus →', 'Book a shoot →')}</button>
              </div>
              <div className="map-wrap">
                <iframe
                  src={MAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Opaalikatu 4, Seinäjoki"
                  allowFullScreen
                />
              </div>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="map-link">
                {t('Avaa Google Mapsissa →', 'Open in Google Maps →')}
              </a>
            </div>
          </div>
        </section>

        <div className="footer">
          <div className="ft-inner">
            <button className="ft-logo" onClick={goHome}>STONEHILL.ARCHITECT</button>
            <div className="ft-copy">
              {t(
                '© 2025 Elias Kivimäki | stonehill.architect · Opaalikatu 4, Seinäjoki · elias.kivimaki@gmail.com',
                '© 2025 Elias Kivimäki | stonehill.architect · Opaalikatu 4, Seinäjoki · elias.kivimaki@gmail.com'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div id="page-portfolio" className={`page${page === 'portfolio' ? ' active' : ''}`}>
        <div className="port-header">
          <div className="wrap">
            <button className="back-btn" onClick={goHome}>{t('← Takaisin etusivulle', '← Back to home')}</button>
            <h1 className="port-title">
              <span>{t('Viimeisimmät', 'Latest')}</span><br />
              <span>{t('Työt', 'Work')}</span>
            </h1>
          </div>
        </div>
        <div className="port-grid-wrap">
          <div className="wrap">
            <div className="port-grid">
              {PORTFOLIO.map((item, i) => (
                <div key={i} className="pi">
                  <div className="ph">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width:900px) 50vw, 33vw"
                      quality={88}
                      priority={i < 6}
                      loading={i < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING */}
      <div id="page-booking" className={`page${page === 'booking' ? ' active' : ''}`}>
        <div className="book-wrap">
          <div className="book-inner">
            <button className="back-btn" onClick={goHome}>{t('← Takaisin etusivulle', '← Back to home')}</button>
            <h1 className="book-title">{t('Varaa kuvaus', 'Book a shoot')}</h1>

            {success ? (
              <div className="success-box">
                <div className="ico">✓</div>
                <h3>{t('Varaus lähetetty!', 'Booking sent!')}</h3>
                <p>{t('Kiitos yhteydenotostasi! Olemme sinuun yhteydessä mahdollisimman pian.\n\n– stonehill.architect', 'Thank you for getting in touch! We will contact you as soon as possible.\n\n– stonehill.architect')}</p>
                <br />
                <button className="btn-p" onClick={goHome} style={{ margin: '0 auto' }}>{t('← Etusivulle', '← Back to home')}</button>
              </div>
            ) : !bookType ? (
              <div className="book-chooser">
                <p className="chooser-intro">
                  {t(
                    'Valitse haluamasi varaustyyppi – yksityishenkilöille nopea varaus, yrityksille tarkempi projektilomake.',
                    'Choose your booking type – a quick form for individuals, or a detailed project form for businesses.'
                  )}
                </p>
                <div className="chooser-grid">
                  <button type="button" className="chooser-card" onClick={() => setBookType('yksityinen')}>
                    <h3>{t('Yksityishenkilö', 'Individual')}</h3>
                    <p>{t('Nopea varaus muutamassa kentässä. Sopii esim. ylioppilas-, henkilö- tai perhekuvauksiin.', 'A quick booking with just a few fields. Ideal for graduation, portrait or family shoots.')}</p>
                    <span className="chooser-arrow">{t('Nopea varaus →', 'Quick booking →')}</span>
                  </button>
                  <button type="button" className="chooser-card" onClick={() => setBookType('yritys')}>
                    <h3>{t('Yritys / Organisaatio', 'Business / Organisation')}</h3>
                    <p>{t('Tarkempi projektilomake video-, brändi- ja yrityskuvauksia varten.', 'A detailed project form for video, brand and business shoots.')}</p>
                    <span className="chooser-arrow">{t('Yrityslomakkeeseen →', 'To business form →')}</span>
                  </button>
                </div>
              </div>
            ) : bookType === 'yksityinen' ? (
              <div>
                <button type="button" className="back-btn-sub" onClick={() => setBookType(null)}>{t('← Vaihda varaustyyppiä', '← Change booking type')}</button>
                <form ref={formPrivate} onSubmit={(e) => submitForm(e, 'yksityinen')}>
                  <div className="fsec">
                    <div className="fsec-ttl">{t('Yhteystiedot', 'Contact details')}</div>
                    <div className="frow">
                      <div className="fg"><label>{t('Etunimi', 'First name')} <span className="req">*</span></label><input name="etunimi" required /></div>
                      <div className="fg"><label>{t('Sukunimi', 'Last name')} <span className="req">*</span></label><input name="sukunimi" required /></div>
                    </div>
                    <div className="frow">
                      <div className="fg"><label>{t('Sähköposti', 'Email')} <span className="req">*</span></label><input type="email" name="sahkoposti" required /></div>
                      <div className="fg"><label>{t('Puhelin', 'Phone')} <span className="req">*</span></label><input name="puhelin" required /></div>
                    </div>
                  </div>
                  <div className="fsec">
                    <div className="fsec-ttl">{t('Kuvauksen tiedot', 'Shoot details')}</div>
                    <div className="fg">
                      <label>{t('Kuvaustyyppi', 'Type of shoot')} <span className="req">*</span></label>
                      <select name="kuvaustyyppi" required value={privateTyyppi} onChange={(e) => { setPrivateTyyppi(e.target.value); if (e.target.value !== 'Muu') setPrivateMuu(''); }}>
                        <option value="">{t('Valitse...', 'Select...')}</option>
                        <option value="Yo- ja rippikuvat">{t('Yo- ja rippikuvat (80 €)', 'Graduation photos (€80)')}</option>
                        <option value="Henkilökuvaus">{t('Henkilökuvaus', 'Portrait')}</option>
                        <option value="Pari- ja perhekuvaus">{t('Pari- ja perhekuvaus', 'Couple / family')}</option>
                        <option value="LinkedIn / profiilikuva">{t('LinkedIn / profiilikuva', 'LinkedIn / profile photo')}</option>
                        <option value="Muu">{t('Muu', 'Other')}</option>
                      </select>
                      {privateTyyppi === 'Muu' && (
                        <input name="kuvaustyyppiMuu" value={privateMuu} onChange={(e) => setPrivateMuu(e.target.value)} placeholder={t('Mikä kuvaustyyppi?', 'What type of shoot?')} required style={{ marginTop: 10 }} />
                      )}
                    </div>
                    <div className="fg"><label>{t('Toivottu ajankohta', 'Preferred date')} <span className="req">*</span></label><input type="text" name="pvm" placeholder="pp.kk.vvvv" required onInput={formatDate} /></div>
                    <div className="fg"><label>{t('Lyhyt viesti (valinnainen)', 'Short message (optional)')}</label><textarea name="lisatiedot" rows="3" style={{ minHeight: 80 }} /></div>
                  </div>
                  <p className="f-note">{t('Lähettämällä lomakkeen hyväksyt, että tietosi tallennetaan yhteydenottoa varten. Vastaamme yleensä saman päivän aikana.', 'By submitting this form you agree that your details will be stored so we can respond. We usually reply the same day.')}</p>
                  <button type="submit" className="btn-sub" disabled={sending}>{sending ? t('Lähetetään...', 'Sending...') : t('Lähetä varaus →', 'Send booking →')}</button>
                </form>
              </div>
            ) : (
              <div>
                <button type="button" className="back-btn-sub" onClick={() => setBookType(null)}>{t('← Vaihda varaustyyppiä', '← Change booking type')}</button>
                <form ref={formBusiness} onSubmit={(e) => submitForm(e, 'yritys')}>
                  <div className="fsec">
                    <div className="fsec-ttl">{t('Yhteystiedot', 'Contact details')}</div>
                    <div className="frow">
                      <div className="fg"><label>{t('Etunimi', 'First name')} <span className="req">*</span></label><input name="etunimi" required /></div>
                      <div className="fg"><label>{t('Sukunimi', 'Last name')} <span className="req">*</span></label><input name="sukunimi" required /></div>
                    </div>
                    <div className="frow">
                      <div className="fg"><label>{t('Sähköposti', 'Email')} <span className="req">*</span></label><input type="email" name="sahkoposti" required /></div>
                      <div className="fg"><label>{t('Puhelin', 'Phone')}</label><input name="puhelin" /></div>
                    </div>
                    <div className="fg"><label>{t('Yritys / organisaatio', 'Company / organisation')}</label><input name="yritys" /></div>
                  </div>
                  <div className="fsec">
                    <div className="fsec-ttl">{t('Projektin tiedot', 'Project details')}</div>
                    <div className="fg">
                      <label>{t('Palvelu', 'Service')} <span className="req">*</span></label>
                      <select name="palvelu" required defaultValue="">
                        <option value="">{t('Valitse...', 'Select...')}</option>
                        <option value="Videotuotanto">{t('Videotuotanto (alk. 400 €)', 'Video production (from €400)')}</option>
                        <option value="Yritysvalokuvaus">{t('Yritysvalokuvaus (240 €)', 'Business photography (€240)')}</option>
                        <option value="Tapahtumakuvaus">{t('Tapahtumakuvaus / -video', 'Event photo / video')}</option>
                        <option value="Somehallinnointi">{t('Somehallinnointi (350 €/kk)', 'Social media management (€350/mo)')}</option>
                        <option value="Muu">{t('Muu', 'Other')}</option>
                      </select>
                    </div>
                    <div className="fg"><label>{t('Paikkakunta / sijainti', 'Location / city')} <span className="req">*</span></label><input name="sijainti" required /></div>
                    <div className="fg"><label>{t('Toivottu ajankohta', 'Preferred date')} <span className="req">*</span></label><input type="text" name="pvm" required onInput={formatDate} /></div>
                    <div className="fg">
                      <label>{t('Mihin materiaali tulee?', 'Where will the material be used?')}</label>
                      <div className="cb-group">
                        {['Verkkosivut', 'Some', 'Painomateriaalit', 'Markkinointi', 'Muu'].map(v => (
                          <label key={v} className="cb-item" onClick={() => toggleCb(v)}>
                            <div className={`cb-box${cbValues.includes(v) ? ' checked' : ''}`} />
                            <span>{v}</span>
                          </label>
                        ))}
                      </div>
                      {cbValues.includes('Muu') && (
                        <input name="kayttoMuu" placeholder={t('Mihin muuhun käyttötarkoitukseen?', 'What other purpose?')} style={{ marginTop: 10 }} />
                      )}
                    </div>
                    <div className="fg"><label>{t('Kerro lisää projektistasi', 'Tell us more about your project')} <span className="req">*</span></label><textarea name="lisatiedot" required /></div>
                  </div>
                  <p className="f-note">{t('Lähettämällä lomakkeen hyväksyt, että tietosi tallennetaan yhteydenottoa varten. Vastaamme viimeistään seuraavan päivän aikana.', 'By submitting this form you agree that your details will be stored. We will reply within the next business day.')}</p>
                  <button type="submit" className="btn-sub" disabled={sending}>{sending ? t('Lähetetään...', 'Sending...') : t('Lähetä varaus →', 'Send booking →')}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div className={`lightbox${lightbox ? ' open' : ''}`} onClick={(e) => { if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) setLightbox(null); }}>
        <div className="lightbox-inner">
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          {lightbox && (
            <div className="yt-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${lightbox}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1&color=white`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="video"
              />
              <div className="yt-mask-top" />
              <div className="yt-mask-bottom-right" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
