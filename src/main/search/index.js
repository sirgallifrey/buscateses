const request = require('./request.js');
const save = require('./save');
const { ipcMain, dialog, app } = require('electron');
const path = require('path');
const log = require('electron-log');
const limit = 50;
const sanitizeFilename = require('sanitize-filename');

const moduleState = {
    results: [],
    searching: false,
    analizing: false,
    shouldCancelSearch: false
}

exports.startIPCListener = () => {
    ipcMain.on('analyse-search', async (event, query) => {
        try {
            const { body } = await request(1 ,limit, query);
            const total = body.total;
            const totalPages = Math.ceil(total/limit);
            event.sender.send('analysis-result', { totalPages, total, query, error: null });
        } catch (e) {
            event.sender.send('analysis-result', { error: e, totalPages: 0, total: 0, query });
        }
    });

    ipcMain.on('start-search', async (event, query) => {
        const dateString = new Date().toLocaleString().replace(/[\/\:]/g, '-');
        const defaultName = sanitizeFilename(query + ' ' + dateString) + '.csv';
        const defaultPath = path.join(app.getPath('documents'), defaultName);
        dialog.showSaveDialog({
            defaultPath,
            filters: [ {extensions: ['csv']} ]
        }, async (fileName) => {
            if (!fileName) return;
            await searchAndSave(query, event.sender, fileName);
        });
    })

    ipcMain.on('cancel-search', (event, query) => {
        moduleState.shouldCancelSearch = true;
    });
}

async function searchAndSave(query, sender, fileName) {
    let results = [];
    sender.send('start-search', { searching: true, hasResults: false, error: null });
    try {
        moduleState.searching = true;
        results = await startSearchRequests(query, sender);
        moduleState.searching = false;
        moduleState.shouldCancelSearch = false;
        moduleState.results = results;
        save(results, fileName);
    } catch (e) {
        log.error(e);
        sender.send('start-search', { error: e.message });
    }
    sender.send('start-search', { searching: false, hasResults: results.length > 0, fileName, total: 0, totalPages: 0, page: 0 });
}

async function startSearchRequests (query, sender) {
    const firstRequest = await execRequest(1, query, sender);
    const total = firstRequest.total;
    const totalPages = Math.ceil(total/limit);
    let results = firstRequest.tesesDissertacoes.slice();

    for (let page = 2; page <= totalPages; page++) {
        if (moduleState.shouldCancelSearch) {
            break;
        }
        const { tesesDissertacoes } = await execRequest(page, query, sender);
        results = results.concat(tesesDissertacoes);
    }
    return results;
}

async function execRequest(page, query, sender) {
    sendIPC(sender, { page });
    const { body } = await request(page ,limit, query);
    const status = Object.assign({}, body, { query, totalPages: Math.ceil(body.total/limit) });
    sendIPC(sender, status);
    return body;
}

function sendIPC(sender, status) {
    sender.send('search-status', status);
}