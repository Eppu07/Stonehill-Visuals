'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const SERVICE_DEFAULTS = {
  valokuvaus: {
    fi: {
      title: 'Valokuvaus',
      intro: 'Ihmiset, brändit ja hetket — kuvina, jotka kestävät aikaa.',
      h1: 'Tarinaa kuvan takana.',
      p1: 'Valokuva ei ole pelkkä hetki — se on tunne, joka jää. Stonehill Architect kuvaa henkilöitä, yrityksiä ja tapahtumia tavalla, jossa jokainen kuva tukee laajempaa visuaalista tarinaa. Tavoitteemme ei ole vain dokumentoida, vaan tulkita.',
      h2: 'Räätälöityjä kokonaisuuksia.',
      p2: 'Yo- ja henkilökuvauksista yritysten brändi- ja edustuskuviin — jokainen kuvaus suunnitellaan asiakkaan tarpeiden ehdoilla. Lopputuloksena on harkittu kokonaisuus, joka istuu kanaviin, painotuotteisiin ja brändin pidempään kaareen.'
    },
    en: {
      title: 'Photography',
      intro: 'People, brands and moments — captured as images that stand the test of time.',
      h1: 'A story behind the image.',
      p1: 'A photograph is more than a moment — it is a feeling that lingers. Stonehill Architect photographs people, businesses and events in a way where every image supports a broader visual narrative. Our aim is not just to document, but to interpret.',
      h2: 'Tailored sets, not single shots.',
      p2: 'From graduation and portrait sessions to brand and editorial shoots for businesses — each session is designed around the client’s needs. The result is a considered body of work that fits across channels, print and the longer arc of the brand.'
    }
  },
  videotuotanto: {
    fi: {
      title: 'Videotuotanto',
      intro: 'Liikkuva kuva, joka herättää brändin eloon.',
      h1: 'Suunnittelusta valmiiseen kuvaan.',
      p1: 'Hyvä video ei synny kameran takana — se syntyy ajatuksesta. Viemme jokaisen tuotannon läpi konseptista käsikirjoitukseen, kuvauksiin ja editointiin asti, jotta lopputulos puhuu samaa kieltä kuin brändisi.',
      h2: 'Häistä markkinointiin.',
      p2: 'Häävideot, tapahtumavideot ja markkinointisisällöt — yhtä huolellisesti tuotettuna. Olipa kyseessä intiimi hetki tai laajempi yrityskampanja, lopputuloksena on visuaalinen tarina, joka tuntuu aidolta.'
    },
    en: {
      title: 'Video production',
      intro: 'Moving images that bring a brand to life.',
      h1: 'From concept to final cut.',
      p1: 'A good video doesn’t start behind the camera — it starts as an idea. We guide every production from concept and script to shooting and editing, so the final piece speaks the same language as your brand.',
      h2: 'From weddings to marketing.',
      p2: 'Wedding films, event coverage and marketing content — each crafted with the same care. Whether it is an intimate moment or a wider brand campaign, the result is a visual story that feels honest.'
    }
  },
  some: {
    fi: {
      title: 'Sosiaalinen media',
      intro: 'Sisältöä, joka erottuu — ei sattumalta vaan suunnittelulla.',
      h1: 'Strategiaa, ei kohinaa.',
      p1: 'Sosiaalinen media on brändin näkyvin pinta. Hyvä sisältö ei ole vain kauniita kuvia, vaan harkittua kokonaisuutta, joka rakentaa luottamusta ja tunnistettavuutta. Lähdemme aina liikkeelle siitä, mitä haluat sanoa ja kenelle.',
      h2: 'Sisältöä, joka kestää selailun.',
      p2: 'Sisältösuunnittelusta julkaisuihin asti hoidamme kanavasi puolestasi. Kuvaus, leikkaus, copy ja aikataulu — yhtenä yhtenäisenä pakettina. Sovimme volyymin ja kanavat yhdessä, jotta some on osa brändityötä eikä erillinen suoritus.'
    },
    en: {
      title: 'Social media',
      intro: 'Content that stands out — by design, not by chance.',
      h1: 'Strategy, not noise.',
      p1: 'Social media is the most visible surface of a brand. Good content isn’t just beautiful imagery — it is a considered whole that builds trust and recognition. We always start from what you want to say, and to whom.',
      h2: 'Content that holds up to scrolling.',
      p2: 'From planning to publishing, we run the channels for you. Photography, editing, copy and scheduling — as one coherent package. We agree the volume and platforms together so social becomes part of the brand work, not a separate task.'
    }
  }
};

const buildServiceDefaults = () => {
  const out = {};
  for (const [slug, langs] of Object.entries(SERVICE_DEFAULTS)) {
    for (const [field, val] of Object.entries(langs.fi)) {
      out[`service_${slug}_${field}`] = val;
    }
    for (const [field, val] of Object.entries(langs.en)) {
      out[`service_${slug}_${field}_en`] = val;
    }
    for (const block of ['intro', 'b1_text', 'b2_text']) {
      out[`service_${slug}_${block}_x`] = '0';
      out[`service_${slug}_${block}_y`] = '0';
    }
  }
  return out;
};

export const DEFAULT_CONTENT = {
  hero_title: 'Valokuvaaja Elias Kivimäki',
  phone: '040 720 9804',
  email: 'elias.kivimaki@gmail.com',
  address: 'Opaalikatu 4, 60100 Seinäjoki',
  about_text_1: 'Jokaisen vahvan brändin taustalla on selkeä visio ja harkittu suunnittelu. Stonehill Architect rakentaa visuaalisia ja tarinallisia kokonaisuuksia arkkitehdin tarkkuudella – yhdistäen estetiikan, strategian ja tunteen yhdeksi ajattomaksi kokonaisuudeksi.',
  about_text_2: 'Me uskomme, että onnistunut viestintä ei synny sattumalta. Se syntyy ymmärryksestä, yksityiskohdista ja kyvystä nähdä kokonaisuus ennen kuin se on olemassa. Tavoitteemme on luoda sisältöjä ja visuaalisia ratkaisuja, jotka eivät vain näytä hyvältä tänään, vaan tuntuvat oikeilta vielä vuosien päästä.',
  about_text_1_en: 'Behind every strong brand lies a clear vision and considered design. Stonehill Architect builds visual and narrative compositions with an architect’s precision — bringing together aesthetics, strategy and emotion into one timeless whole.',
  about_text_2_en: 'We believe successful communication doesn’t happen by chance. It comes from understanding, attention to detail and the ability to see the whole before it exists. Our aim is to create content and visual solutions that not only look good today, but still feel right years from now.',
  about_heading: 'Ajatonta viestintää.',
  about_heading_en: 'Timeless communication.',
  about_heading_x: '0',
  about_heading_y: '0',
  some_note: 'Paketin sisältö katsotaan tarkemmin asiakkaan kanssa.',
  some_note_en: 'Package contents agreed in more detail together with the client.',
  price_yo: '80 €',
  price_henkilo: '80 €',
  price_yritys: '240 €',
  price_valokuvaus: '80 €',
  price_video: '400 €',
  price_some: '350 €/kk',
  ...buildServiceDefaults()
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
