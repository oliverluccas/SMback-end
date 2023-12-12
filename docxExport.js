const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const JSZip = require('jszip');

// Função para criar um arquivo Word (docx) com a formatação desejada
const createDocx = (listId, cards) => {
  const content = fs.readFileSync('template.docx', 'binary');
  const zip = new JSZip(content);
  const doc = new Docxtemplater();
  doc.loadZip(zip);

  // Dados para preencher o modelo
  const data = {
    listId,
    cards,
  };

  doc.setData(data);

  // Renderiza o documento
  try {
    doc.render();
  } catch (error) {
    throw error;
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  const fileName = `${listId}_export.docx`;

  fs.writeFileSync(fileName, buffer);

  return fileName;
};

module.exports = { createDocx };
