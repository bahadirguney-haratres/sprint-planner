# Sprint Planner — Vercel Deploy Rehberi

## Deploy Adımları

### 1. Vercel hesabı oluşturun
https://vercel.com adresine gidin ve GitHub ile giriş yapın.

### 2. Bu klasörü GitHub'a yükleyin
```bash
git init
git add .
git commit -m "Initial sprint planner"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/sprint-planner.git
git push -u origin main
```

### 3. Vercel'e bağlayın
- vercel.com → "Add New Project"
- GitHub reponuzu seçin
- "Deploy" butonuna basın
- Birkaç dakika içinde URL alırsınız (örn: sprint-planner.vercel.app)

### 4. Uygulamayı açın
Vercel'in verdiği URL'yi açın ve Ayarlar bölümünü doldurun:
- Jira URL: https://adilisikgroup.atlassian.net
- E-posta: Jira hesabınızın e-postası
- API Token: https://id.atlassian.com/manage-profile/security/api-tokens
- Proje: SUP

## Proje Yapısı
```
sprint-planner/
├── api/
│   └── jira.js          ← Vercel serverless proxy (CORS çözümü)
├── public/
│   └── index.html       ← Uygulama
├── vercel.json          ← Vercel yapılandırması
└── package.json
```

## Jira API Token Nasıl Alınır?
1. https://id.atlassian.com/manage-profile/security/api-tokens
2. "Create API token" butonuna tıklayın
3. Token'ı kopyalayın ve uygulamaya yapıştırın

## Custom Field ID'leri Nasıl Bulunur?
Jira'da giriş yapıkken şu URL'yi açın:
https://adilisikgroup.atlassian.net/rest/api/3/field

Sayfada "BE Effort" ve "FE Effort" aratın, `customfield_XXXXX` formatındaki ID'yi kopyalayın.
