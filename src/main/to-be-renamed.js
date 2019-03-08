
const execQuery = require('./exec-query');
const json2csv = require('json2csv');
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
]

async function start() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Termo de busca'
    }
  ]);
  const result = await execQuery(answers.query, onPreRequest, onPostRequest);
  saveCSV(result);
}

function onPreRequest(page) {
    console.log(chalk.yellow(`Buscando página ${page}`))
}

function onPostRequest(response) {
    console.log(chalk.green(`${response.body.pagina}/${Math.ceil(response.body.total/response.body.registrosPorPagina)} OK!`));
}

function saveCSV(data) {
    const csv = json2csv({ data, fields });
    const timestamp = new Date().getTime();
    const filename = path.join(__dirname, `${timestamp}.csv`);
    writeFile(filename, csv, { encoding: 'utf8' });
}

start();