const json2csv = require('json2csv');
const { app } = require('electron');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);

const fields = [
  'id',
  'instituicao',
  'nomePrograma',
  'municipioPrograma',
  'titulo',
  'autor',
  'dataDefesa',
  'volumes',
  'paginas',
  'biblioteca',
  'grauAcademico',
  'link'
];

function saveCSV(data, filename) {
  const csv = json2csv.parse(data, { fields });
  const timestamp = new Date().getTime();
  writeFile(filename, csv, { encoding: 'utf8' });
}

module.exports = saveCSV;
