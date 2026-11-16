# 🚀 Canlı Uzay Panosu (Live Space Dashboard)

Gerçek zamanlı Uluslararası Uzay İstasyonu (ISS) konum takibi, uzaydaki aktif astronot listesi ve tek tıkla Türkçe çeviri destekli NASA Astronomi Arşivi (APOD) sunan modern bir React web sitesi.

🔗 **Canlı Demo:** [canli-uzay-deposu.netlify.app](https://canli-uzay-deposu.netlify.app)

---

## ✨ Özellikler

* 🛰️ **Gerçek Zamanlı ISS Takibi:** Uluslararası Uzay İstasyonu'nun anlık enlem, boylam, hız (km/saat) ve yükseklik (km) verilerini çeker; Google Haritalar üzerinden mevcut konumunu görüntüleme imkânı sunar.
* 👨‍🚀 **Uzaydaki İnsanlar:** O an dünya yörüngesinde bulunan astronotların toplam sayısını, isimlerini ve görev yaptıkları uzay araçlarını canlı olarak listeler.
* 🌌 **NASA Astronomi Arşivi (APOD):** Günün astronomi fotoğrafını veya seçilen geçmiş bir tarihe ait NASA arşiv görselini bilimsel açıklamasıyla birlikte getirir.
* 🇹🇷 **Tek Tıkla Türkçe Çeviri:** NASA'nın İngilizce fotoğraf başlıklarını ve bilimsel açıklamalarını entegre çeviri servisi aracılığıyla anında Türkçe'ye çevirir ve orijinal metne geri dönüş sağlar.

---

## 🛠️ Kullanılan Teknolojiler ve API'ler

* **Frontend:** React, Vite, JavaScript (ES6+), CSS3
* **Yayınlama (Deployment):** Netlify
* **Veri Kaynakları & API'ler:**
  * [NASA WordPress / APOD Image Archive API](https://science.nasa.gov/) – Günün astronomi görseli ve açıklamaları
  * [WhereTheISS.at API](https://wheretheiss.at/) – ISS anlık telemetri ve koordinat verileri
  * [People in Space API](https://github.com/corquaid/international-space-station-APIs) – Uzaydaki aktif astronot listesi
  * [MyMemory Translation API](https://mymemory.translated.net/) – İngilizce–Türkçe metin çevirisi

---

## 💻 Yerel Ortamda Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Depoyu klonlayın:**
   ```bash
   git clone [https://github.com/sudenisaakbulut/canli-uzay-panosu.git](https://github.com/sudenisaakbulut/canli-uzay-panosu.git)
