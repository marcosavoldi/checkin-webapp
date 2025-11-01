# 🔥 Setup Firebase Cloud Functions con Gmail

## 📋 Panoramica

Le Cloud Functions inviano automaticamente:
1. **Email all'Host** (tu) - Con tutti i dati del passaporto dell'ospite
2. **Email all'Ospite** - Con le istruzioni di check-in specifiche del B&B

Tutto avviene automaticamente quando l'ospite completa il form!

---

## 🚀 Setup Iniziale (15 minuti)

### Step 1: Abilita Piano Blaze su Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il progetto `passport-manager-85f02`
3. In basso a sinistra, clicca su **Upgrade** → **Blaze Plan**
4. **Non preoccuparti**: il piano Blaze è pay-as-you-go con quota gratuita generosa:
   - ✅ 2 milioni di invocazioni/mese GRATIS
   - ✅ 400.000 GB-secondi/mese GRATIS
   - ✅ Per un B&B, costerà circa **€0.10-0.50/mese**

### Step 2: Genera App Password per Gmail

Per permettere alle Cloud Functions di inviare email dal tuo account Gmail:

1. Vai su [myaccount.google.com](https://myaccount.google.com)
2. **Sicurezza** → **Verifica in due passaggi** (abilitala se non è già attiva)
3. Torna su **Sicurezza** → **Password per le app**
4. Seleziona:
   - App: **Mail**
   - Dispositivo: **Altro** (scrivi "Firebase Functions")
5. Clicca **Genera**
6. **COPIA LA PASSWORD** (16 caratteri) - non potrai più vederla!

### Step 3: Installa Firebase CLI

Apri il terminale e installa Firebase CLI:

```bash
npm install -g firebase-tools
```

Verifica l'installazione:

```bash
firebase --version
```

### Step 4: Login Firebase

```bash
firebase login
```

Si aprirà il browser per autenticarti con Google.

### Step 5: Inizializza il Progetto

Nella cartella del progetto:

```bash
firebase init functions
```

Seleziona:
- ✅ Use an existing project → `passport-manager-85f02`
- ✅ Language: **JavaScript**
- ✅ ESLint: **No** (o Sì, come preferisci)
- ✅ Install dependencies: **Yes**

### Step 6: Copia i File Functions

1. Copia il contenuto della cartella `functions/` che ti ho fornito
2. Sovrascrivi i file nella cartella `functions/` del tuo progetto

### Step 7: Configura le Credenziali Gmail

Nel terminale, nella cartella del progetto:

```bash
firebase functions:config:set gmail.email="tua-email@gmail.com" gmail.password="PASSWORDDI16CARATTERI"
```

Sostituisci:
- `tua-email@gmail.com` con la tua email Gmail
- `PASSWORDDI16CARATTERI` con l'App Password generata prima

Verifica la configurazione:

```bash
firebase functions:config:get
```

Dovresti vedere:

```json
{
  "gmail": {
    "email": "tua-email@gmail.com",
    "password": "xxxxxxxxxxxxx"
  }
}
```

### Step 8: Deploy delle Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

Il deploy richiederà 2-5 minuti. Alla fine vedrai:

```
✔  functions: Finished running predeploy script.
✔  functions[sendGuestDataToHost(us-central1)]: Successful create operation.
✔  functions[sendCheckInInstructionsToGuest(us-central1)]: Successful create operation.
✔  Deploy complete!
```

---

## ✅ Test del Sistema

### Test 1: Crea una Prenotazione di Prova

1. Accedi alla webapp come admin
2. Crea una struttura con istruzioni (es: "WiFi: password123")
3. Crea una prenotazione di test
4. Copia il link

### Test 2: Compila il Form Ospite

1. Apri il link in navigazione anonima
2. Fai login con Google
3. Inserisci i dati (usa dati fittizi per il test)
4. **IMPORTANTE**: Usa una tua email di test nel campo email
5. Invia il form

### Test 3: Controlla le Email

Entro **30 secondi** dovresti ricevere:

1. **Email all'Host** (tua email Gmail principale)
   - Oggetto: ✅ Nuovi dati check-in - [Nome B&B] - [Nome Ospite]
   - Contenuto: Tutti i dati del passaporto

2. **Email all'Ospite** (email inserita nel form)
   - Oggetto: 🏠 Conferma Check-in - [Nome B&B]
   - Contenuto: Istruzioni di check-in che hai salvato

---

## 🔍 Monitoraggio e Debug

### Visualizza i Log

```bash
firebase functions:log
```

Oppure nella Firebase Console:
**Functions** → Seleziona una function → **Logs**

### Errori Comuni e Soluzioni

**Errore: "Billing account not configured"**
→ Devi attivare il piano Blaze (Step 1)

**Errore: "Invalid login: 535-5.7.8 Username and Password not accepted"**
→ La App Password è sbagliata. Rigenerala e riconfigura:
```bash
firebase functions:config:set gmail.password="NUOVAPASSWORD"
firebase deploy --only functions
```

**Email non arrivano dopo 1 minuto**
→ Controlla i log: `firebase functions:log`
→ Verifica che la App Password sia corretta
→ Controlla lo spam

**Errore: "Function returned undefined"**
→ Normale, è un warning innocuo. Le email vengono comunque inviate.

---

## 🎨 Personalizzazione Email

### Modificare il Template Email Host

Apri `functions/index.js` e modifica la sezione HTML dentro `sendGuestDataToHost`.

Puoi cambiare:
- Colori (cerca `#667eea`, `#764ba2`, ecc.)
- Testo
- Struttura

### Modificare il Template Email Ospite

Modifica la sezione HTML dentro `sendCheckInInstructionsToGuest`.

### Modificare le Istruzioni per B&B

Le istruzioni si configurano direttamente nella dashboard admin quando crei/modifichi una struttura.

---

## 💰 Costi Previsti

Con uso normale (es: 50 check-in/mese):

- **Invocazioni Functions**: 100 chiamate/mese → **GRATIS** (dentro quota)
- **Bandwidth**: < 1 GB/mese → **GRATIS**
- **Storage Firestore**: < 1 GB → **GRATIS**

**Totale mensile stimato: €0.00 - €0.20**

Solo se superi 2.000 check-in/mese inizierai a pagare (pochissimo).

---

## 🔒 Sicurezza

✅ App Password protetta lato server (non esposta nel browser)
✅ Solo utenti autenticati possono usare il sistema
✅ Email inviate solo dal tuo account Gmail verificato
✅ Impossibile per altri inviare email a tuo nome

---

## 📞 Comandi Utili

```bash
# Deploy solo functions
firebase deploy --only functions

# Visualizza log in tempo reale
firebase functions:log --only sendGuestDataToHost

# Cancella una function
firebase functions:delete sendGuestDataToHost

# Vedi configurazione attuale
firebase functions:config:get

# Testa localmente (opzionale)
firebase emulators:start --only functions
```

---

## 🆘 Problemi?

Se qualcosa non funziona:

1. Controlla i log: `firebase functions:log`
2. Verifica la App Password Gmail
3. Assicurati che il piano Blaze sia attivo
4. Controlla che il deploy sia completato con successo

---

## ✨ Vantaggi di Questa Soluzione

✅ **Zero servizi esterni** - Tutto in Firebase  
✅ **Email dal tuo Gmail** - Professionale e riconoscibile  
✅ **Istruzioni personalizzate** - Diverse per ogni B&B  
✅ **Automatico al 100%** - Zero interventi manuali  
✅ **Costo quasi zero** - < €1/mese per uso normale  
✅ **Scalabile** - Funziona anche con 100+ B&B  

---

**Pronto? Inizia dallo Step 1! 🚀**
