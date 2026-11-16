import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nasaVeri, setNasaVeri] = useState(null);
  const [secilenTarih, setSecilenTarih] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [issKonum, setIssKonum] = useState(null);
  const [astronotlar, setAstronotlar] = useState([]);

  // Çeviri State'leri
  const [turkceAciklama, setTurkceAciklama] = useState('');
  const [turkceBaslik, setTurkceBaslik] = useState('');
  const [turkceGoster, setTurkceGoster] = useState(false);
  const [ceviriliyor, setCeviriliyor] = useState(false);

  const ingilizceAylar = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const veriyiIsle = (item, tarih) => {
    const gorsel = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

    const baslikDiv = document.createElement('div');
    baslikDiv.innerHTML = item.title.rendered;
    const hamBaslik = baslikDiv.textContent || item.title.rendered;
    const temizBaslik = hamBaslik.replace(/^APOD:\s*\d{4}\s+[A-Za-z]+\s+\d{1,2}\s*[–-]\s*/i, '').trim();

    const icerikDiv = document.createElement('div');
    icerikDiv.innerHTML = item.content.rendered;
    const hamMetin = (icerikDiv.textContent || '').replace(/\s+/g, ' ');

    // "Explanation:" ile "Tomorrow's picture", "Date" veya "Credit" arasındaki gerçek açıklamayı ayıklar
    let temizAciklama = hamMetin;
    const aciklamaEslesme = hamMetin.match(/Explanation:\s*([\s\S]*?)(?=\s*(?:Tomorrow['’]s\s+picture|Date\s*:|Date\s+[A-Z]|Credit\s*:|Image\s+Credit|Authors\s*&|$))/i);
    if (aciklamaEslesme && aciklamaEslesme[1]) {
      temizAciklama = aciklamaEslesme[1].trim();
    }

    const aktifTarih = tarih || item.date.split('T')[0];
    setSecilenTarih(aktifTarih);

    setTurkceAciklama('');
    setTurkceBaslik('');
    setTurkceGoster(false);

    setNasaVeri({
      title: temizBaslik,
      explanation: temizAciklama,
      url: gorsel,
      date: aktifTarih
    });
  };

  const nasaGetir = async (tarih = '') => {
    setYukleniyor(true);

    try {
      if (!tarih || tarih.length !== 10) {
        const yanit = await fetch('https://science.nasa.gov/wp-json/wp/v2/image-article?search=APOD:&per_page=1&_embed&orderby=date&order=desc');
        const veriler = await yanit.json();
        if (Array.isArray(veriler) && veriler.length > 0) {
          veriyiIsle(veriler[0], '');
        } else {
          setNasaVeri(null);
        }
        setYukleniyor(false);
        return;
      }

      const [yil, ay, gun] = tarih.split('-');
      const ayAdi = ingilizceAylar[parseInt(ay, 10) - 1];
      const gunSayi = parseInt(gun, 10);
      const arananIfade = `${yil} ${ayAdi} ${gunSayi}`;

      const yanit = await fetch(
        `https://science.nasa.gov/wp-json/wp/v2/image-article?search=${encodeURIComponent(`APOD: ${arananIfade}`)}&per_page=10&_embed`
      );
      const veriler = await yanit.json();

      if (Array.isArray(veriler) && veriler.length > 0) {
        const tamEslesen = veriler.find((v) => v.title?.rendered?.includes(arananIfade));
        if (tamEslesen) {
          veriyiIsle(tamEslesen, tarih);
        } else {
          setNasaVeri(null);
        }
      } else {
        setNasaVeri(null);
      }
    } catch {
      setNasaVeri(null);
    }

    setYukleniyor(false);
  };

  const metniCevir = async (metin) => {
    const temizMetin = metin.replace(/\s+/g, ' ').trim();
    if (!temizMetin) return '';

    const parcalar = (temizMetin.match(/.{1,450}(?:\s|$)/g) || [temizMetin])
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const cevrilenParcalar = await Promise.all(
      parcalar.map(async (parca) => {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(parca)}&langpair=en|tr`
        );
        const data = await res.json();
        return data.responseData?.translatedText || parca;
      })
    );
    return cevrilenParcalar.join(' ');
  };

  const ceviriyiTetikle = async () => {
    if (!nasaVeri) return;

    if (turkceAciklama) {
      setTurkceGoster(!turkceGoster);
      return;
    }

    setCeviriliyor(true);
    try {
      const [ceviriBaslik, ceviriMetin] = await Promise.all([
        metniCevir(nasaVeri.title),
        metniCevir(nasaVeri.explanation)
      ]);
      setTurkceBaslik(ceviriBaslik);
      setTurkceAciklama(ceviriMetin);
      setTurkceGoster(true);
    } catch {
      alert('Çeviri şu an yapılamadı, lütfen tekrar deneyin.');
    }
    setCeviriliyor(false);
  };

  const issGetir = () => {
    fetch('https://api.wheretheiss.at/v1/satellites/25544')
      .then((yanit) => yanit.json())
      .then((veri) => setIssKonum(veri))
      .catch((hata) => console.error('ISS verisi alınamadı:', hata));
  };

  useEffect(() => {
    nasaGetir();
    issGetir();

    fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json')
      .then((yanit) => yanit.json())
      .then((veri) => setAstronotlar(veri.people || []))
      .catch((hata) => console.error('Astronot verisi alınamadı:', hata));
  }, []);

  const tarihDegisti = (e) => {
    const yeniTarih = e.target.value;
    setSecilenTarih(yeniTarih);
    if (yeniTarih && yeniTarih.length === 10) {
      nasaGetir(yeniTarih);
    }
  };

  return (
    <div className="konteyner">
      <header>
        <h1>🚀 Canlı Uzay Panosu</h1>
        <p>Gerçek zamanlı uzay verileri ve astronomi takip merkezi</p>
      </header>

      <div className="izgara">
        <div className="kart">
          <h2>🛰️ Uluslararası Uzay İstasyonu (ISS)</h2>
          {issKonum ? (
            <div>
              <p><strong>Enlem (Latitude):</strong> {issKonum.latitude.toFixed(4)}°</p>
              <p><strong>Boylam (Longitude):</strong> {issKonum.longitude.toFixed(4)}°</p>
              <p><strong>Hız:</strong> {Math.round(issKonum.velocity)} km/saat</p>
              <p><strong>Yükseklik:</strong> {Math.round(issKonum.altitude)} km</p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="buton" onClick={issGetir}>
                  Konumu Güncelle
                </button>
                <a
                  href={`https://www.google.com/maps?q=${issKonum.latitude},${issKonum.longitude}&z=4`}
                  target="_blank"
                  rel="noreferrer"
                  className="buton"
                  style={{ backgroundColor: '#1f243a', color: '#64ffda', border: '1px solid #64ffda' }}
                >
                  Haritada Gör ↗
                </a>
              </div>
            </div>
          ) : (
            <p>ISS koordinatları alınıyor...</p>
          )}
        </div>

        <div className="kart">
          <h2>👨‍🚀 Şu An Uzaydaki İnsanlar ({astronotlar.length})</h2>
          {astronotlar.length > 0 ? (
            <ul className="astronot-liste">
              {astronotlar.map((kisi, index) => (
                <li key={index}>
                  <span>{kisi.name}</span>
                  <span style={{ color: '#64ffda' }}>{kisi.craft}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Astronot listesi yükleniyor...</p>
          )}
        </div>
      </div>

      <div className="kart">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>🌌 NASA Astronomi Arşivi</h2>
          <div>
            <label style={{ marginRight: '8px', fontSize: '0.9rem', color: '#b0b8d1' }}>
              Tarih Seç ({secilenTarih ? secilenTarih.split('-').reverse().join('.') : ''}):
            </label>
            <input
              type="date"
              value={secilenTarih}
              max={new Date().toISOString().split('T')[0]}
              onChange={tarihDegisti}
              style={{
                backgroundColor: '#0b0d17',
                color: '#64ffda',
                border: '1px solid #64ffda',
                padding: '6px 10px',
                borderRadius: '6px',
                colorScheme: 'dark'
              }}
            />
          </div>
        </div>

        {yukleniyor ? (
          <p>Günün NASA fotoğrafı çekiliyor...</p>
        ) : nasaVeri && nasaVeri.url ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: '8px 0' }}>
                {turkceGoster && turkceBaslik ? turkceBaslik : nasaVeri.title} ({nasaVeri.date.split('-').reverse().join('.')})
              </h3>

              <button
                onClick={ceviriyiTetikle}
                disabled={ceviriliyor}
                className="buton"
                style={{
                  backgroundColor: turkceGoster ? '#1f243a' : '#64ffda',
                  color: turkceGoster ? '#64ffda' : '#0b0d17',
                  border: '1px solid #64ffda',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  marginTop: 0
                }}
              >
                {ceviriliyor
                  ? 'Çevriliyor...'
                  : turkceGoster
                  ? '🇬🇧 Orijinal İngilizce Göster'
                  : '🇹🇷 Türkçe\'ye Çevir'}
              </button>
            </div>

            <img
              src={nasaVeri.url}
              alt={nasaVeri.title}
              className="nasa-gorsel"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', margin: '12px 0' }}
            />
            <p className="aciklama">
              {turkceGoster && turkceAciklama ? turkceAciklama : nasaVeri.explanation}
            </p>
          </div>
        ) : (
          <p style={{ color: '#ff6b6b' }}>Bu tarih için NASA APOD arşivinde görsel kaydı bulunamadı (o gün video yayınlanmış olabilir), başka bir gün seçebilirsin.</p>
        )}
      </div>
    </div>
  );
}

export default App;