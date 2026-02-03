// ───────────────────────────────────────────────────────────────
// MODULE: LIB INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

// Search modules
module.exports.search = require('./search');

// Scoring modules
module.exports.scoring = require('./scoring');

// Cognitive modules
module.exports.cognitive = require('./cognitive');

// Storage modules
module.exports.storage = require('./storage');

// Parsing modules
module.exports.parsing = require('./parsing');

// Providers
module.exports.providers = require('./providers');

// Utils
module.exports.utils = require('./utils');

// Cache modules
module.exports.cache = require('./cache');

// Session modules (T001-T004: Session deduplication)
module.exports.session = require('./session');

// Validation modules (T067-T070: Pre-flight quality gates)
module.exports.validation = require('./validation');

// Learning modules (T052-T055: Learning from corrections)
module.exports.learning = require('./learning');

// Root-level modules
module.exports.errors = require('./errors');
module.exports.channel = require('./session/channel'); // Moved to session folder

// Response envelope (REQ-019: Standardized Response Structure)
module.exports.response = require('./response');

// Embeddings (REQ-030: Fallback Embedding Provider Chain)
module.exports.embeddings = require('./embeddings');

// Architecture (T060-T063: 7-Layer MCP Architecture)
module.exports.architecture = require('./architecture');
