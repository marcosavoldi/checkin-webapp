const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/**
 * Invia email all'host con i dati del passaporto
 * Triggered quando un ospite completa il form
 */
exports.sendGuestDataToHost = functions.firestore
  .document('guestData/{guestDataId}')
  .onCreate(async (snap, context) => {
    const guestData = snap.data();
    
    // Configura transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().gmail.email,
        pass: functions.config().gmail.password
      }
    });
    
    try {
      // Recupera i dati della prenotazione
      const bookingDoc = await admin.firestore()
        .collection('bookings')
        .doc(guestData.bookingId)
        .get();
      
      const booking = bookingDoc.data();
      
      // Email HTML all'host
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .section { background: white; margin-bottom: 20px; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h2 { color: #667eea; margin-top: 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .field { margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; }
            .label { font-weight: bold; color: #555; display: inline-block; width: 150px; }
            .value { color: #333; }
            .dates-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .emoji { font-size: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Nuovi Dati Check-in Ricevuti</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <h2><span class="emoji">🏠</span> Informazioni Prenotazione</h2>
              <div class="field">
                <span class="label">Struttura:</span>
                <span class="value"><strong>${booking.propertyName}</strong></span>
              </div>
              <div class="field">
                <span class="label">Nome Ospite:</span>
                <span class="value">${guestData.firstName} ${guestData.lastName}</span>
              </div>
              <div class="field">
                <span class="label">Email Ospite:</span>
                <span class="value">${guestData.email}</span>
              </div>
            </div>

            <div class="dates-box">
              <div class="field">
                <span class="label">📅 Check-in:</span>
                <span class="value"><strong>${booking.checkIn}</strong></span>
              </div>
              <div class="field">
                <span class="label">📅 Check-out:</span>
                <span class="value"><strong>${booking.checkOut}</strong></span>
              </div>
            </div>

            <div class="section">
              <h2><span class="emoji">🛂</span> Dati Documento</h2>
              <div class="field">
                <span class="label">Numero Documento:</span>
                <span class="value"><strong>${guestData.documentNumber}</strong></span>
              </div>
              <div class="field">
                <span class="label">Data Rilascio:</span>
                <span class="value">${guestData.issueDate}</span>
              </div>
              <div class="field">
                <span class="label">Data Scadenza:</span>
                <span class="value">${guestData.expiryDate}</span>
              </div>
              <div class="field">
                <span class="label">Luogo Rilascio:</span>
                <span class="value">${guestData.issuePlace}</span>
              </div>
            </div>

            <div class="section">
              <h2><span class="emoji">👤</span> Dati Personali</h2>
              <div class="field">
                <span class="label">Nome Completo:</span>
                <span class="value">${guestData.firstName} ${guestData.lastName}</span>
              </div>
              <div class="field">
                <span class="label">Indirizzo:</span>
                <span class="value">${guestData.address}</span>
              </div>
              <div class="field">
                <span class="label">Nazionalità:</span>
                <span class="value">${guestData.nationality}</span>
              </div>
              <div class="field">
                <span class="label">Telefono:</span>
                <span class="value">${guestData.phone}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>✉️ Email generata automaticamente dal sistema di check-in</p>
            <p>🏠 Casa Vacanze Management System</p>
          </div>
        </body>
        </html>
      `;

      // Invia email all'host
      await transporter.sendMail({
        from: `"Check-in System" <${functions.config().gmail.email}>`,
        to: booking.ownerEmail,
        subject: `✅ Nuovi dati check-in - ${booking.propertyName} - ${guestData.firstName} ${guestData.lastName}`,
        html: htmlContent
      });

      console.log(`Email inviata all'host: ${booking.ownerEmail}`);
      
      // Aggiorna il documento con lo stato dell'invio
      await snap.ref.update({
        hostEmailSent: true,
        hostEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error('Errore invio email host:', error);
      await snap.ref.update({
        hostEmailSent: false,
        hostEmailError: error.message
      });
      throw error;
    }
  });

/**
 * Invia email all'ospite con le istruzioni di check-in
 * Triggered dopo l'invio dell'email all'host
 */
exports.sendCheckInInstructionsToGuest = functions.firestore
  .document('guestData/{guestDataId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Esegui solo se l'email all'host è stata appena inviata
    if (newData.hostEmailSent && !previousData.hostEmailSent && !newData.guestEmailSent) {
      
      // Configura transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: functions.config().gmail.email,
          pass: functions.config().gmail.password
        }
      });
      
      try {
        // Recupera i dati della prenotazione
        const bookingDoc = await admin.firestore()
          .collection('bookings')
          .doc(newData.bookingId)
          .get();
        
        const booking = bookingDoc.data();
        
        // Recupera la proprietà con le istruzioni
        const propertyDoc = await admin.firestore()
          .collection('properties')
          .doc(booking.propertyId)
          .get();
        
        const property = propertyDoc.data();
        
        // Prepara le istruzioni (usa quelle salvate o default)
        const instructions = property.checkInInstructions || `
          <p>Benvenuto/a presso ${property.name}!</p>
          <p>Maggiori dettagli sul check-in ti verranno comunicati a breve.</p>
        `;

        // Email HTML all'ospite
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background-color: #f9f9f9; padding: 20px; }
              .welcome { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .dates-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; border-radius: 4px; }
              .instructions { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: pre-line; }
              .instructions h2 { color: #11998e; margin-top: 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .field { margin: 10px 0; }
              .label { font-weight: bold; color: #555; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Conferma Check-in Ricevuta!</h1>
            </div>
            
            <div class="content">
              <div class="welcome">
                <h2>Ciao ${newData.firstName}! 👋</h2>
                <p>Grazie per aver completato la registrazione per il tuo soggiorno presso <strong>${property.name}</strong>.</p>
                <p>I tuoi dati sono stati ricevuti correttamente e il check-in è confermato!</p>
              </div>

              <div class="dates-box">
                <div class="field">
                  <span class="label">📅 Check-in:</span> <strong>${booking.checkIn}</strong>
                </div>
                <div class="field">
                  <span class="label">📅 Check-out:</span> <strong>${booking.checkOut}</strong>
                </div>
              </div>

              <div class="instructions">
                <h2>📋 Istruzioni per il Check-in</h2>
                ${instructions}
              </div>

              <div class="welcome" style="margin-top: 20px; background: #fff3e0; border-left: 4px solid #ff9800;">
                <p><strong>📞 Hai domande?</strong></p>
                <p>Non esitare a contattarci. Ti aspettiamo!</p>
              </div>
            </div>
            
            <div class="footer">
              <p>✉️ Email generata automaticamente dal sistema di check-in</p>
              <p>🏠 ${property.name}</p>
            </div>
          </body>
          </html>
        `;

        // Invia email all'ospite
        await transporter.sendMail({
          from: `"${property.name}" <${functions.config().gmail.email}>`,
          to: newData.email,
          subject: `🏠 Conferma Check-in - ${property.name}`,
          html: htmlContent
        });

        console.log(`Email istruzioni inviata all'ospite: ${newData.email}`);
        
        // Aggiorna il documento
        await change.after.ref.update({
          guestEmailSent: true,
          guestEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return null;
      } catch (error) {
        console.error('Errore invio email ospite:', error);
        await change.after.ref.update({
          guestEmailSent: false,
          guestEmailError: error.message
        });
        throw error;
      }
    }
    
    return null;
  });
