// Vendored from fast-jev-compaction (https://github.com/tamaratran/fast-jev-compaction), MIT.
// Upstream commit e3f262a7f4d42bd8dd32ced30d26176f7cb545b0 (2026-09-17). The HTTP client and
// `compactMessages` helper are not vendored: jev-cli supplies its own transport via `JevAsker`.
export * from './types.js';
export * from './request.js';
export * from './state.js';
export * from './compact.js';
