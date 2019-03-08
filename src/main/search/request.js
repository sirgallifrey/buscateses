const got = require('got');
const promiseRetry = require('promise-retry');
const log = require('electron-log');

module.exports = (page = 1, limit = 20, query = "", filters = []) => { 
  return promiseRetry((retry, number) => {
    return got.post('http://catalogodeteses.capes.gov.br/catalogo-teses/rest/busca', {
      body: {
        "pagina": page,
        "filtros": filters,
        "registrosPorPagina": limit,
        "termo": query
      },
      json: true
    }).catch((err) => {
      log.error(err);
      if (err.statusCode === 500) {
        return retry(err);
      }
      throw err;
    });
  }, {
    retries: 15,
    minTimeout: 50,
    maxTimeout: 2000
  });
}
