# 🏡 Benvenuto nel Sistema Check-in Casa Vacanze v2.0!

## 🎉 Sistema Completamente Ridisegnato!

Hai richiesto un sistema **modulare e autonomo**, ed eccolo qui!

---

## ✨ Cosa è Cambiato

### ❌ ELIMINATO: EmailJS
Nessun servizio esterno da configurare!

### ✅ NUOVO: Sistema Email Integrato
- Email inviate dal TUO Gmail
- Completamente automatico
- Zero limitazioni
- Controllo totale

### ✅ NUOVO: Email Automatica all'Ospite
- Conferma check-in
- Istruzioni personalizzate per ogni B&B
- Totalmente automatico

### ✅ NUOVO: Istruzioni Check-in Personalizzate
Ogni struttura può avere:
- Password WiFi
- Info parcheggio
- Codice cancello
- Indicazioni specifiche

### ✅ NUOVO: Campo Email Ospite
L'ospite può usare l'email che preferisce

---

## 🚀 INIZIA DA QUI!

### 1️⃣ Leggi questo file per capire la struttura

👉 **[STRUTTURA_FILE.md](./STRUTTURA_FILE.md)**

### 2️⃣ Segui la guida rapida (30 minuti)

👉 **[QUICK_START.md](./QUICK_START.md)**

### 3️⃣ Setup Cloud Functions (essenziale!)

👉 **[CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md)**

---

## 📦 Cosa Trovi in Questa Cartella

### 🌐 File Webapp (Frontend)

- **`index.html`** (52KB) - L'intera applicazione
- **`firebase-config.js`** - Configurazione con le TUE chiavi
- **`firebase-config.example.js`** - Template senza chiavi
- **`gitignore.txt`** - Rinomina in `.gitignore`

### ☁️ Cloud Functions (Backend per Email)

- **`functions/index.js`** (12KB) - Logica invio email
- **`functions/package.json`** - Dipendenze Node.js

### 📚 Documentazione Completa

- **`README.md`** - Guida completa del progetto
- **`QUICK_START.md`** - 🚀 Guida rapida (inizia da qui!)
- **`CLOUD_FUNCTIONS_SETUP.md`** - Setup email automatiche
- **`STRUTTURA_FILE.md`** - Spiegazione file
- **`CHANGELOG.md`** - Differenze con versione precedente

---

## ⚡ Quick Setup (30 minuti totali)

```
1. Configura Firebase Firestore (5 min)
   └─ Crea database + regole

2. Setup Cloud Functions (15 min) ← CRITICO!
   ├─ Attiva piano Blaze (~€0.50/mese)
   ├─ Gmail App Password
   └─ Deploy functions

3. Deploy su GitHub Pages (5 min)
   └─ Push codice + attiva Pages

4. Test finale (5 min)
   └─ Crea prenotazione di prova
```

Dettagli completi in **[QUICK_START.md](./QUICK_START.md)**

---

## 🎯 Come Funziona

```
┌─────────────┐
│    HOST     │ Crea prenotazione → Genera link
│    (TU)     │ Invia link all'ospite
└─────────────┘
      ↓
┌─────────────┐
│   OSPITE    │ Apre link → Login Google
│             │ Compila dati passaporto + email
│             │ Clicca "Invia"
└─────────────┘
      ↓
   ✨ MAGIA AUTOMATICA ✨
      ↓
┌─────────────┬─────────────┐
│  📧 EMAIL   │  📧 EMAIL   │
│  ALL'HOST   │  ALL'OSPITE │
│             │             │
│ - Dati      │ - Conferma  │
│   passaporto│ - Istruzioni│
│ - Info      │   check-in  │
│   personali │             │
└─────────────┴─────────────┘
```

Tutto avviene in **automatico** quando l'ospite invia il form!

---

## 💰 Costi

| Servizio | Costo |
|----------|-------|
| Firebase (piano Blaze) | ~€0.50/mese* |
| GitHub Pages | GRATIS |
| Gmail | GRATIS |
| **TOTALE** | **~€0.50/mese** |

*Per 50-200 check-in/mese. Sotto questa soglia potrebbe essere €0!

---

## ⚠️ IMPORTANTE: Cloud Functions

Le **Cloud Functions sono ESSENZIALI** per il funzionamento!

Senza di esse:
- ❌ Non partono le email
- ❌ Il sistema non funziona

Con le Functions:
- ✅ Email automatiche all'host (dati passaporto)
- ✅ Email automatiche all'ospite (istruzioni)
- ✅ Sistema completamente autonomo

**Dedica 15 minuti al setup**: **[CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md)**

---

## 🎓 Ordine di Lettura Consigliato

Per iniziare subito:

1. **QUESTO FILE** - Panoramica generale ← SEI QUI
2. **[STRUTTURA_FILE.md](./STRUTTURA_FILE.md)** - Capire i file (3 min)
3. **[QUICK_START.md](./QUICK_START.md)** - Setup rapido (segui passo-passo)
4. **[CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md)** - Setup email (critico!)

Per approfondire:

5. **[README.md](./README.md)** - Documentazione completa
6. **[CHANGELOG.md](./CHANGELOG.md)** - Differenze con v1.0

---

## 🆘 Aiuto?

**Problema durante il setup?**

1. Controlla **[QUICK_START.md](./QUICK_START.md)** - Sezione "Problemi Comuni"
2. Leggi i log: `firebase functions:log`
3. Verifica ogni passo della guida Cloud Functions

**Email non arrivano?**

→ 90% delle volte è la configurazione Gmail App Password
→ Segui [CLOUD_FUNCTIONS_SETUP.md](./CLOUD_FUNCTIONS_SETUP.md) attentamente

---

## ✅ Vantaggi di Questa Soluzione

✅ **Zero servizi esterni** - Tutto su Firebase  
✅ **Email illimitate** - Nessun limite mensile  
✅ **Completamente automatico** - Zero interventi manuali  
✅ **Modulare** - Come richiesto!  
✅ **Scalabile** - Funziona con 1 o 100 B&B  
✅ **Professionale** - Email dal tuo Gmail ufficiale  
✅ **Personalizzabile** - Istruzioni diverse per ogni struttura  
✅ **Economico** - ~€0.50/mese  

---

## 🎯 Checklist Pre-Deploy

Prima di iniziare, assicurati di avere:

- [ ] Account Google
- [ ] Carta di credito (per piano Blaze, costa ~€0.50/mese)
- [ ] Node.js installato sul computer
- [ ] 30 minuti di tempo libero
- [ ] Pazienza per seguire le guide passo-passo

---

## 🚀 Pronto?

Apri **[QUICK_START.md](./QUICK_START.md)** e inizia!

**Tempo stimato per avere tutto funzionante: 30 minuti**

---

## 🎉 Buon Lavoro!

Questa è la versione più completa, modulare e professionale del sistema.

Hai il controllo totale, zero dipendenze esterne, e un'esperienza ottima sia per te che per i tuoi ospiti!

**Domande?** Leggi le guide! Ogni dubbio ha una risposta nella documentazione.

**Inizia ora** → **[QUICK_START.md](./QUICK_START.md)** 🚀

---

*Sistema Check-in v2.0 - Sviluppato per gestori professionali di case vacanze* 🏡
