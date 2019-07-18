const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./login'));
app.use(require('./uploads'));
app.use(require('./image'));
app.use(require('./equipment'));
app.use(require('./notice'));
app.use(require('./maintenance'));

module.exports = app;