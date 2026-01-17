/**
 * Master barrel export for lib/
 * Re-exports all modules from subfolders
 */

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

// Root-level modules
module.exports.errors = require('./errors');
module.exports.channel = require('./channel');
