// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
// Change le port par défaut de 8080 à 3000
const port = process.env.PORT || 5000; // Utilise le port spécifié par l'environnement, sinon 3000 par défaut

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint pour traiter les messages
app.post('/api/translate', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: 'Please enter a message.' });
  }

  // URL de votre service de traduction (exemple ici)
  const apiUrl = 'https://d918-105-76-169-233.ngrok-free.app/TranslateService/api/translate'; // Remplacer par l'URL de votre API de traduction
  
  try {
    const response = await axios.post(apiUrl, {
      inputText: userMessage,
    });

    const translatedText = response.data.translatedText || 'No translation available';
    res.json({ reply: translatedText });
  } catch (error) {
    res.status(500).json({ reply: 'Error processing the request.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
