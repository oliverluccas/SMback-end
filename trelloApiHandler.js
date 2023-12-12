const fetch = require('node-fetch');

const TRELLO_API_KEY = '439bc549320a1624c2f6f0e405da9768'; // Sua Chave API
const TRELLO_TOKEN = 'ATTA38cf085f17b713f1654f3220bfdf9da66e2a027028d438ad1f36ec3c490d938b4D0579E4'; // Seu Token
const FIXED_BOARD_ID = 'TTjd6zI0'; // ID fixo do quadro específico

// Função para obter os dados das listas e cards do quadro específico
const getBoardListsAndCards = async () => {
  const url = `https://api.trello.com/1/boards/${FIXED_BOARD_ID}/lists?cards=all&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    const lists = await response.json();

    // Mapeando as listas e cards, incluindo apenas os cards não arquivados
    const listsWithNonArchivedCards = lists.map(list => {
      const nonArchivedCards = list.cards.filter(card => !card.closed); // Filtra os cards não arquivados
      return {
        listId: list.id,
        listName: list.name,
        cards: nonArchivedCards.map(card => {
          return {
            cardId: card.id,
            cardTitle: card.name,
            cardDescription: card.desc
          };
        })
      };
    });

    return listsWithNonArchivedCards;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

module.exports = { getBoardListsAndCards };
