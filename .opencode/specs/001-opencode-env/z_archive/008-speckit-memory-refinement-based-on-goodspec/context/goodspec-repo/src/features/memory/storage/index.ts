/**
 * Storage Layer Barrel Export
 * @module features/memory/storage
 */

export { MemoryStorage } from "./sqlite.js";
export { VectorStorage } from "./vector.js";
export { EmbeddingGenerator } from "./embeddings.js";
export {
  initializeSchema,
  migrateSchema,
  getSchemaVersion,
  optimizeFts,
  rebuildFts,
  getStats,
  SCHEMA_VERSION,
} from "./schema.js";
