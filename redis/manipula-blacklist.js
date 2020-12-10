const blacklist = require('./blacklist');

const { promisify } = require('util');
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

function geraTokenHash(token) {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    adiciona: async token => {
        const dataEspiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await setAsync(tokenHash, '');
        blacklist.expireat(token, dataEspiracao);
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        const resultado = await existsAsync(tokenHash);
        return resultado === 1;
    }
}