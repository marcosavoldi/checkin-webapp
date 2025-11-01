# 🚀 GUIDA RAPIDA - Avvio in 30 Minuti

## ✅ Checklist Pre-Deploy

### 📋 Prima di iniziare, assicurati di avere:

- [ ] Account Google
- [ ] Progetto Firebase `passport-manager-85f02` (già hai le credenziali)
- [ ] Node.js installato (per Cloud Functions)
- [ ] Repository GitHub (da creare)

---

## 🎯 3 Passi Principali

```
1. Configura Firebase (5 min)
2. Setup Cloud Functions per Email (15 min) ← ESSENZIALE
3. Deploy su GitHub Pages (5 min)
```

---

## 1️⃣ Configura Firebase (5 minuti)

### A. Firestore Database

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Apri progetto `passport-manager-85f02`
3. Menu laterale → **Firestore Database** → **Crea database**
4. Seleziona **Modalità Produzione**
5. Località: **europe-west1** → Abilita

### B. Regole di Sicurezza

1. Tab **Regole**
2. Copia le regole da `README.md` (sezione Security Rules)
3. **Pubblica**

### C. Authentication

1. Menu laterale → **Authentication** → **Inizia**
2. Tab **Sign-in method**
3. **Google** → Abilita → Salva

✅ Firebase Base Configurato!

---

## 2️⃣ Setup Cloud Functions (15 minuti) - IMPORTANTE!

Le Cloud Functions sono il CUORE del sistema: inviano le email automatiche!

### Passo 1: Attiva Piano Blaze

1. Firebase Console → In basso a sinistra: **Upgrade**
2. Seleziona **Piano Blaze (Pay as you go)**
3. Inserisci carta di credito
4. **Non preoccuparti**: costerà max €0.50/mese per uso normale

### Passo 2: Gmail App Password

1. Vai su [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Se non trovi la voce, attiva prima la **Verifica in 2 Passaggi**
3. **Password per le app**:
   - App: Mail
   - Dispositivo: Altro → scrivi "Firebase"
4. **COPIA la password di 16 caratteri** generata!

### Passo 3: Installa Firebase CLI

Terminal:

```bash
npm install -g firebase-tools
firebase login
```

### Passo 4: Deploy Functions

Nella cartella del progetto (dove hai i file):

```bash
# Inizializza Firebase
firebase init functions
```

Selezioni:
- ✅ Use existing project → `passport-manager-85f02`
- ✅ Language: **JavaScript**
- ✅ ESLint: No
- ✅ Install dependencies: **Yes**

```bash
# Configura Gmail
firebase functions:config:set gmail.email="tua-email@gmail.com" gmail.password="PASSWORD16CARATTERI"

# Verifica
firebase functions:config:get

# Deploy!
firebase deploy --only functions
```

Attendi 3-5 minuti. Vedrai:

```
✔  functions[sendGuestDataToHost]: Successful create
✔  functions[sendCheckInInstructionsToGuest]: Successful create
✔  Deploy complete!
```

✅ Email Automatiche Configurate!

---

## 3️⃣ Deploy su GitHub Pages (5 minuti)

### A. Crea Repository

1. Vai su [github.com/new](https://github.com/new)
2. Nome: `checkin-webapp` (o quello che vuoi)
3. **Public**
4. Create repository

### B. Push del Codice

Nel terminale, nella cartella del progetto:

```bash
git init
git add .
git commit -m "First commit - Check-in webapp"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/checkin-webapp.git
git push -u origin main
```

**⚠️ IMPORTANTE**: Assicurati che `firebase-config.js` sia nel `.gitignore` per non esporre le chiavi!

### C. Abilita GitHub Pages

1. Repository → **Settings** → **Pages**
2. Source: **Branch: main** → **/ (root)**
3. **Save**
4. Attendi 1-2 minuti

La tua webapp sarà su: `https://TUO_USERNAME.github.io/checkin-webapp/`

### D. Autorizza Dominio Firebase

1. Torna su Firebase Console
2. **Authentication** → **Settings** → **Authorized domains**
3. **Add domain**: `TUO_USERNAME.github.io`
4. Save

✅ Webapp Online!

---

## 🎉 Test del Sistema

### Test Completo (5 minuti)

1. **Accedi alla webapp** (link GitHub Pages)
2. **Login con Google**
3. **Dashboard Admin**:
   - Clicca "+ Aggiungi Struttura"
   - Nome: "Test B&B"
   - Istruzioni: "WiFi: test123, Parcheggio libero"
   - Salva
4. **Crea Prenotazione**:
   - Seleziona "Test B&B"
   - Nome ospite: "Mario Rossi"
   - Date: oggi → domani
   - **Genera Link** → **Copia**
5. **Apri in Incognito** (simulando l'ospite):
   - Incolla il link
   - Login Google
   - Compila form (dati fittizi)
   - **Importante**: nel campo Email metti la TUA email di test
   - Invia

### Controlla Email

Entro 30 secondi riceverai **2 email**:

1. **Email Host** (sulla tua Gmail principale)
   - Oggetto: ✅ Nuovi dati check-in...
   - Tutti i dati del passaporto

2. **Email Ospite** (sull'email che hai inserito nel form)
   - Oggetto: 🏠 Conferma Check-in...
   - Istruzioni: "WiFi: test123, Parcheggio libero"

✅ Se ricevi entrambe le email → **TUTTO FUNZIONA!** 🎉

---

## ⚠️ Problemi Comuni

### ❌ Email NON arrivano

**Soluzione**:
```bash
firebase functions:log
```

Cerca errori. Probabilmente:
- App Password Gmail sbagliata → Rigenerarla
- Piano Blaze non attivo → Attivarlo

### ❌ "Firebase: Error (auth/unauthorized-domain)"

**Soluzione**: Aggiungi dominio GitHub Pages in Firebase Auth

### ❌ "firebase: command not found"

**Soluzione**:
```bash
npm install -g firebase-tools
```

### ❌ Funzioni non si deployano

**Soluzione**: Verifica di essere nella cartella giusta e di aver fatto `firebase login`

---

## 📖 Prossimi Passi

Una volta che tutto funziona:

1. **Personalizza le email** → Modifica `functions/index.js`
2. **Aggiungi le tue strutture reali**
3. **Inizia a usarlo con gli ospiti!**

---

## 🆘 Serve Aiuto?

Leggi le guide complete:

- 📖 [README.md](./README.md) - Documentazione completa
- 🔥 [CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md) - Guida dettagliata Functions

---

## 💡 Consigli Pro

✅ **Testa sempre** con email personali prima di usarlo con ospiti reali  
✅ **Salva l'App Password** Gmail in un posto sicuro  
✅ **Monitora i log** periodicamente: `firebase functions:log`  
✅ **Backup dati**: Firebase fa backup automatici, ma puoi esportare da console  
✅ **Personalizza istruzioni**: Ogni B&B può avere istruzioni diverse!

---

**Buon lavoro! 🚀**

Se hai domande, rileggi le guide o controlla i log Firebase!
