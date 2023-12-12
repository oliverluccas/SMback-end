const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch'); // Adicionei o 'node-fetch'
const pdfMake = require('pdfmake'); // Adicionei o 'pdfmake'
const { getBoardListsAndCards } = require('./trelloApiHandler');

dotenv.config();

const app = express();

// Configurações do CORS
const corsOptions = {
  origin: 'https://nextmark.com.br',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rota padrão
app.get('/', (req, res) => {
  res.send('Servidor do Power-Up Trello funcionando!');
});

// Rota para buscar dados do quadro
app.get('/board-data', async (req, res) => {
  try {
    // Aqui você precisa implementar a função getBoardListsAndCards
    const data = await getBoardListsAndCards();
    res.json(data);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao buscar dados');
  }
});

// Função para buscar os dados dos cards da lista selecionada
async function getSelectedListCards(listId) {
  try {
    // Implemente a lógica para buscar os cards da lista com o ID listId
    // Formate os dados em um array de objetos
    // Exemplo de requisição à API do Trello para buscar os cards da lista:
    const response = await fetch(`https://api.trello.com/1/lists/${listId}/cards?key=APIKey&token=APIToken`);
    const cardsData = await response.json();
    return cardsData;
  } catch (error) {
    console.error('Erro ao buscar os cards da lista:', error);
    throw error;
  }
}

// Função para gerar o PDF com os dados dos cards
function generatePDF(docDefinition) {
  try {
    // Use a biblioteca 'pdfmake' para criar o PDF com base nos dados passados em docDefinition
    const pdfDoc = pdfMake.createPdf(docDefinition);
    return pdfDoc;
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    throw error;
  }
}

// Rota para exportar cards da lista selecionada em PDF
app.get('/export-cards/:listId', async (req, res) => {
  try {
    const listId = req.params.listId;

    // Obtenha os dados dos cards da lista selecionada
    const selectedListCards = await getSelectedListCards(listId);

    // Crie um documento PDF com os dados dos cards usando pdfmake
    const docDefinition = {
      content: selectedListCards.map(card => [
        { text: card.name, style: 'header' },
        card.desc
      ]),
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      }
    };

    // Gere o PDF e envie como resposta
    const pdfDoc = generatePDF(docDefinition);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).send('Erro ao exportar dados');
  }
});

// Definição da porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
