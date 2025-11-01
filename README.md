# 🏠 Sistema Check-in Casa Vacanze

Applicazione web completa per la gestione automatizzata del check-in degli ospiti in case vacanze e B&B, con invio automatico di email personalizzate.

## ✨ Caratteristiche Principali

### 🎯 Per l'Amministratore (Host):
- Login sicuro con Google
- Gestione multiple strutture (B&B)
- Creazione link prenotazioni univoci
- Istruzioni di check-in personalizzate per ogni struttura
- Ricezione automatica email con dati passaporto ospiti
- Dashboard con storico prenotazioni

### 👤 Per l'Ospite:
- Accesso via link univoco
- Login con Google (sicuro e veloce)
- Form multilingua (🇮🇹 🇬🇧 🇫🇷 🇩🇪 🇪🇸)
- Compilazione dati passaporto e anagrafici
- Validazione in tempo reale
- Ricezione automatica email con istruzioni check-in
- Design mobile-friendly

---

## 🎬 Come Funziona

```
1. HOST crea prenotazione → Genera link
2. HOST invia link via WhatsApp/Email
3. OSPITE apre link → Login Google → Compila dati
4. OSPITE invia form
   ↓
   AUTOMATICAMENTE:
   ├─→ Email all'HOST con dati passaporto
   └─→ Email all'OSPITE con istruzioni check-in
```

---

## 🚀 Setup Rapido (30 minuti)

### Requisiti

- Account Google
- Progetto Firebase (già configurato)
- Node.js installato (per Cloud Functions)

### 1. Configurazione Firebase

#### A. Firestore Database

1. [Firebase Console](https://console.firebase.google.com/) → `passport-manager-85f02`
2. **Firestore Database** → **Crea database** → **Produzione**
3. Scegli località: `europe-west1`

#### B. Security Rules

In **Firestore Rules**, incolla:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties
    match /properties/{propertyId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    
    // Guest Data
    match /guestData/{dataId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

#### C. Authentication

1. **Authentication** → **Sign-in method**
2. Abilita **Google**
3. Aggiungi il dominio GitHub Pages in **Authorized domains**

### 2. Setup Cloud Functions

**IMPORTANTE**: Le Cloud Functions sono essenziali per l'invio automatico delle email!

Segui la guida dettagliata: **[CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md)**

Riassunto:
1. Attiva piano Blaze Firebase (costa < €1/mese)
2. Genera App Password Gmail
3. Installa Firebase CLI
4. Deploy delle functions
5. Test del sistema

### 3. Deploy Webapp su GitHub Pages

```bash
# 1. Crea repository su GitHub

# 2. Nella cartella del progetto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/TUO_REPO.git
git push -u origin main

# 3. GitHub → Settings → Pages
# Seleziona: Branch "main" → Folder "/ (root)" → Save
```

### 4. Abilita Dominio su Firebase

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Aggiungi: `TUO_USERNAME.github.io`

---

## 📱 Utilizzo

### Come Host:

1. Vai sulla webapp
2. Login con Google
3. **Aggiungi Struttura**:
   - Nome (es: "Villa Mare")
   - Istruzioni check-in (WiFi, parcheggio, chiavi, ecc.)
4. **Crea Prenotazione**:
   - Seleziona struttura
   - Inserisci nome ospite e date
   - Genera link
5. **Invia il link** all'ospite via WhatsApp/Email

### Come Ospite:

1. Apri il link ricevuto
2. Login con Google
3. Compila tutti i dati:
   - Email (riceverai le istruzioni qui)
   - Dati documento
   - Dati personali
4. Invia
5. Ricevi email con istruzioni check-in

---

## 📧 Sistema Email Automatico

### Email all'Host (Tu)

**Quando**: Appena l'ospite completa il form  
**Contenuto**:
- Nome struttura
- Dati ospite completi
- Tutti i dati del passaporto
- Date soggiorno

**Mittente**: `tua-email@gmail.com`

### Email all'Ospite

**Quando**: Subito dopo l'invio all'host  
**Contenuto**:
- Conferma check-in ricevuto
- Date soggiorno
- **Istruzioni personalizzate** della struttura

**Mittente**: `tua-email@gmail.com` (dal nome della struttura)

---

## 📁 Struttura Progetto

```
checkin-webapp/
├── index.html              # Applicazione SPA completa
├── firebase-config.js      # Configurazione Firebase (NON committare!)
├── firebase-config.example.js
├── .gitignore
├── README.md               # Questa guida
├── CLOUD_FUNCTIONS_SETUP.md # Guida Cloud Functions
└── functions/              # Cloud Functions per email
    ├── index.js           # Logica invio email
    └── package.json       # Dependencies
```

---

## 🔒 Sicurezza

✅ **Autenticazione Google OAuth** - Solo utenti autenticati  
✅ **Firebase Security Rules** - Accesso controllato ai dati  
✅ **Link univoci** - Ogni prenotazione ha il suo link  
✅ **API Keys protette** - `.gitignore` per chiavi sensibili  
✅ **Email sicure** - Inviate solo dal tuo account Gmail verificato  
✅ **GDPR Compliant** - Dati salvati in Europa (se scegli `europe-west1`)

---

## 💰 Costi

### Firebase (Piano Blaze)

**Quota Gratuita Mensile:**
- 2M invocazioni functions
- 400K GB-secondi compute
- 5GB Firestore storage
- 10GB transfer out

**Costo stimato per 50 check-in/mese: €0.10 - €0.50**  
**Costo stimato per 200 check-in/mese: €0.50 - €1.50**

### GitHub Pages

✅ **Completamente GRATUITO**

### Gmail

✅ **GRATUITO** (usi il tuo account)

---

## 🛠️ Troubleshooting

### Email non arrivano

1. Controlla i log Cloud Functions: `firebase functions:log`
2. Verifica App Password Gmail
3. Controlla cartella spam
4. Verifica che il deploy functions sia completato

### Errore "Firebase: Error (auth/unauthorized-domain)"

→ Aggiungi il dominio GitHub Pages in Firebase Auth Authorized domains

### Form non si invia

1. Apri Console browser (F12)
2. Controlla errori JavaScript
3. Verifica connessione Firebase

### Cloud Functions non funzionano

→ Segui **[CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md)** passo passo

---

## 🎨 Personalizzazione

### Modifica Template Email

Apri `functions/index.js` e modifica l'HTML delle email.

### Modifica Colori Webapp

Modifica le classi Tailwind in `index.html`.

### Aggiungi Lingue

Aggiungi nuove traduzioni nell'oggetto `translations` in `index.html`.

---

## 🔄 Aggiornamenti Futuri

Funzionalità che possono essere aggiunte:

- 📸 Upload foto/scan passaporto
- 📊 Dashboard con statistiche
- 📤 Export dati Excel/PDF
- 🔔 Notifiche push
- 🌐 Dominio personalizzato
- 📱 App mobile nativa

---

## 📞 Link Utili

- 🔥 [Firebase Console](https://console.firebase.google.com/)
- 📧 [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- 📄 [GitHub Pages](https://pages.github.com/)
- 📖 [Firebase Docs](https://firebase.google.com/docs)
- 🛠️ [Firebase CLI](https://firebase.google.com/docs/cli)

---

## 📄 Licenza

Questo progetto è fornito "as-is" per uso personale o commerciale.

---

**Sviluppato per gestori di case vacanze e B&B 🏡**

Per supporto: Leggi [CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md) per la guida dettagliata.
