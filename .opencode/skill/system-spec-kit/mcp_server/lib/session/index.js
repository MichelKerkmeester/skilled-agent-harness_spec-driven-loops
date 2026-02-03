// ───────────────────────────────────────────────────────────────
// MODULE: SESSION INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const sessionManager = require('./session-manager.js');
const channel = require('./channel.js');

module.exports = {
  ...sessionManager,
  ...channel,
};
