"use strict";
// ---------------------------------------------------------------
// SHARED: CENTRAL TYPE DEFINITIONS
// ---------------------------------------------------------------
// Single source of truth for cross-workspace types.
// Used across shared/, mcp_server/, and scripts/.
//
// DB normalization types (MemoryDbRow, Memory, conversion fns)
// live in ./normalization.ts — import from there for DB ↔ App
// conversions.
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialDbRowToMemory = exports.memoryToDbRow = exports.dbRowToMemory = void 0;
var normalization_1 = require("./normalization");
Object.defineProperty(exports, "dbRowToMemory", { enumerable: true, get: function () { return normalization_1.dbRowToMemory; } });
Object.defineProperty(exports, "memoryToDbRow", { enumerable: true, get: function () { return normalization_1.memoryToDbRow; } });
Object.defineProperty(exports, "partialDbRowToMemory", { enumerable: true, get: function () { return normalization_1.partialDbRowToMemory; } });
//# sourceMappingURL=types.js.map