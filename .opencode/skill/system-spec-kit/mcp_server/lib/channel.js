// ───────────────────────────────────────────────────────────────
// LIB: CHANNEL (RE-EXPORT WRAPPER)
// ───────────────────────────────────────────────────────────────
// MIGRATED: Implementation moved to lib/session/channel.js
// Channel handles git branch context switching, which is session-related.
// This file kept for backward compatibility.
// ───────────────────────────────────────────────────────────────
'use strict';

module.exports = require('./session/channel.js');
