'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Oletusarvot — näytetään välittömästi ennen kuin Supabase-kysely palauttaa,
// ja jäävät paikalleen jos Supabase ei vastaa (esim. paikallinen build ilman avaimia).
export const DEFAULT_CONTENT = {
  hero_title: 'Valokuvaaja Elias Kivimäki',
  phone: '040 720 9804',
  email: 'elias.kivimaki@gmail.com',
  address: 'Opaalikatu 4, 60100 Seinäjoki',
  about_text_1: 'Olen 19-vuotias juuri lukiosta valmistunut valokuvaaja Seinäjoelta. Olen kuvannut kahden vuoden ajan, ja lukio-opintojen ohella olen perehtynyt vapaa-ajallani markkinointiin sekä sosiaalisen median ja visuaalisen viestinnän rooliin brändityössä.',
  about_text_2: 'Tarjoan valokuvaus-, videotuotanto- ja some-palveluita yrityksille ja yksityisille asiakkaille. Valokuvauksessa kuvaan niin henkilöitä, yrityksiä, tapahtumia kuin tuotteitakin. Videotuotanto kattaa koko prosessin suunnittelusta editointiin – lyhyistä somevideoista pidempiin yrityssisältöihin.',
  service_photo_desc: 'Henkilökuvat, yrityskuvaukset ja sisältö someen.',
  service_video_desc: 'Liikkuvaa kuvaa, joka jää mieleen.',
  service_some_desc: 'Sosiaalisen median alustojen hallinnointi ja postaukset.',
  price_yo: '80 €',
  price_yritys: '240 €',
  price_video: '400 €',
  price_some: '350 €/kk'
};

export function useContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('content')
        .select('key, value');
      if (!mounted || error || !data) return;
      const map = { ...DEFAULT_CONTENT };
      for (const row of data) {
        if (row.value != null && row.value !== '') map[row.key] = row.value;
      }
      setContent(map);
    })();
    return () => { mounted = false; };
  }, []);

  return content;
}
