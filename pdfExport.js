const HummusRecipe = require('hummus-recipe');

function exportToPDF(listId) {
    // Substitua 'yourTemplate.pdf' pelo caminho do seu template PDF
    const templatePath = 'yourTemplate.pdf';
    const outputPath = `${listId}_export.pdf`;

    // Suponha que você tem uma função que retorna os dados dos cartões para o listId fornecido
    const cardsData = getCardsData(listId); // Implemente esta função conforme suas necessidades

    const pdfDoc = new HummusRecipe(templatePath, outputPath);

    // Adicionar os dados do cartão ao PDF
    cardsData.forEach((card, index) => {
        pdfDoc.editPage(1)
            .text(`Card Title: ${card.cardTitle}`, 100, 100 + (index * 30))
            .text(`Description: ${card.cardDescription}`, 100, 120 + (index * 30))
            .endPage();
    });

    // Finalizar a edição do PDF
    pdfDoc.endPDF();

    return outputPath;
}

module.exports = { exportToPDF };
