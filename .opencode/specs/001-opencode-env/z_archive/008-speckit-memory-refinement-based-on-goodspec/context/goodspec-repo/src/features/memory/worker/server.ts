/**
 * Memory Worker HTTP Server
 * Provides REST API for memory operations
 * @module features/memory/worker/server
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type {
  MemoryInput,
  MemoryUpdate,
  SearchOptions,
  SearchResult,
  MemoryType,
  RawEvent,
} from "../types.js";
import { MemoryStorage } from "../storage/sqlite.js";
import { VectorStorage } from "../storage/vector.js";
import { EmbeddingGenerator } from "../storage/embeddings.js";

// Server configuration
export interface ServerConfig {
  dbPath: string;
  dimensions?: number;
}

// Server state
let storage: MemoryStorage | null = null;
let vectors: VectorStorage | null = null;
let embeddings: EmbeddingGenerator | null = null;
let initialized = false;

function normalizeImportance(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value > 0 && value < 1) {
    return value * 10;
  }

  return value;
}

function normalizeMemoryInput(input: MemoryInput): MemoryInput {
  const importance = normalizeImportance(input.importance);

  if (importance === undefined || importance === input.importance) {
    return input;
  }

  return {
    ...input,
    importance,
  };
}

/**
 * Initialize storage systems
 */
async function initializeStorage(config: ServerConfig): Promise<void> {
  if (initialized) return;

  console.log(`[Memory Worker] Initializing storage at: ${config.dbPath}`);

  storage = new MemoryStorage(config.dbPath);
  vectors = new VectorStorage(storage.getDatabase(), config.dimensions ?? 384);
  embeddings = new EmbeddingGenerator({ dimensions: config.dimensions ?? 384 });

  // Pre-warm embedding model
  try {
    await embeddings.initialize();
    console.log("[Memory Worker] Embedding model loaded");
  } catch (error) {
    console.warn("[Memory Worker] Embedding model failed to load, vector search disabled:", error);
  }

  initialized = true;
  console.log("[Memory Worker] Storage initialized");
}

/**
 * Create the Hono app with all routes
 */
export function createApp(config: ServerConfig): Hono {
  const app = new Hono();

  // Middleware
  app.use("*", cors());
  app.use("*", logger());

  // Health check
  app.get("/health", (c) => {
    return c.json({
      status: "ok",
      version: "1.0.0",
      initialized,
      storage: storage !== null,
      vectors: vectors?.isAvailable() ?? false,
    });
  });

  // Initialize storage on first request if needed
  app.use("*", async (_c, next) => {
    if (!initialized) {
      await initializeStorage(config);
    }
    await next();
  });

  // ============================================================================
  // Memory CRUD Operations
  // ============================================================================

  /**
   * Create a new memory
   * POST /memories
   */
  app.post("/memories", async (c) => {
    try {
      const input = normalizeMemoryInput((await c.req.json()) as MemoryInput);

      if (!input.title || !input.content) {
        return c.json({ error: "title and content are required" }, 400);
      }

      const memory = storage!.create(input);

      // Generate and store embedding asynchronously
      // Note: Embedding generation is async but awaited to ensure consistency
      // For bulk operations, use the /memories/batch endpoint instead
      if (embeddings && vectors?.isAvailable()) {
        const text = EmbeddingGenerator.combineForEmbedding(
          memory.title,
          memory.content,
          memory.facts,
          memory.concepts
        );
        const embedding = await embeddings.generate(text);
        vectors.storeEmbedding(memory.id, embedding);
      }

      return c.json(memory, 201);
    } catch (error) {
      console.error("[Memory Worker] Create error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Create multiple memories in batch
   * POST /memories/batch
   */
  app.post("/memories/batch", async (c) => {
    try {
      const inputs = (await c.req.json()) as MemoryInput[];

      if (!Array.isArray(inputs)) {
        return c.json({ error: "Expected array of memory inputs" }, 400);
      }

      const memories = inputs.map((input) => storage!.create(normalizeMemoryInput(input)));

      // Generate embeddings in parallel (non-blocking)
      if (embeddings && vectors?.isAvailable()) {
        const embeddingGen = embeddings;
        const vectorStore = vectors;
        Promise.all(
          memories.map(async (memory) => {
            try {
              const text = EmbeddingGenerator.combineForEmbedding(
                memory.title,
                memory.content,
                memory.facts,
                memory.concepts
              );
              const embedding = await embeddingGen.generate(text);
              vectorStore.storeEmbedding(memory.id, embedding);
            } catch (error) {
              console.warn(`[Memory Worker] Failed to generate embedding for memory ${memory.id}:`, error);
            }
          })
        ).catch(error => {
          console.error("[Memory Worker] Batch embedding generation failed:", error);
        });
      }

      return c.json({ memories, count: memories.length }, 201);
    } catch (error) {
      console.error("[Memory Worker] Batch create error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Get a memory by ID
   * GET /memories/:id
   */
  app.get("/memories/:id", (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Invalid memory ID" }, 400);
      }

      const memory = storage!.getById(id);
      if (!memory) {
        return c.json({ error: "Memory not found" }, 404);
      }

      return c.json(memory);
    } catch (error) {
      console.error("[Memory Worker] Get error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Update a memory
   * PATCH /memories/:id
   */
  app.patch("/memories/:id", async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Invalid memory ID" }, 400);
      }

      const updates = (await c.req.json()) as MemoryUpdate;
      const normalizedUpdates: MemoryUpdate = {
        ...updates,
        importance: normalizeImportance(updates.importance),
      };
      const memory = storage!.update(id, normalizedUpdates);

      if (!memory) {
        return c.json({ error: "Memory not found" }, 404);
      }

      // Update embedding if content changed
      if ((updates.title || updates.content) && embeddings && vectors?.isAvailable()) {
        const text = EmbeddingGenerator.combineForEmbedding(
          memory.title,
          memory.content,
          memory.facts,
          memory.concepts
        );
        const embedding = await embeddings.generate(text);
        vectors.storeEmbedding(memory.id, embedding);
      }

      return c.json(memory);
    } catch (error) {
      console.error("[Memory Worker] Update error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Delete a memory
   * DELETE /memories/:id
   */
  app.delete("/memories/:id", (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Invalid memory ID" }, 400);
      }

      const deleted = storage!.delete(id);
      if (!deleted) {
        return c.json({ error: "Memory not found" }, 404);
      }

      // Also delete embedding
      vectors?.deleteEmbedding(id);

      return c.json({ deleted: true, id });
    } catch (error) {
      console.error("[Memory Worker] Delete error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  // ============================================================================
  // Search Operations
  // ============================================================================

  /**
   * Search memories (hybrid FTS + vector)
   * POST /search
   */
  app.post("/search", async (c) => {
    try {
      const options = (await c.req.json()) as SearchOptions;

      if (!options.query) {
        return c.json({ error: "query is required" }, 400);
      }

      const limit = Math.min(Math.max(options.limit ?? 10, 1), 50);
      const ftsWeight = options.hybridWeight?.fts ?? 0.4;
      const vecWeight = options.hybridWeight?.vector ?? 0.6;

      // FTS search
      const ftsResults = storage!.searchFTS(options.query, limit * 2, {
        types: options.types,
        minImportance: options.minImportance,
        includePrivate: options.includePrivate,
      });

      // Vector search if available
      let vecResults: Array<{ memory_id: number; distance: number }> = [];
      if (embeddings && vectors?.isAvailable()) {
        try {
          const queryEmbedding = await embeddings.generate(options.query);
          vecResults = vectors.searchSimilar(queryEmbedding, limit * 2);
        } catch (error) {
          console.warn("[Memory Worker] Vector search failed:", error);
        }
      }

      // Reciprocal Rank Fusion
      const results = hybridMerge(ftsResults, vecResults, ftsWeight, vecWeight, limit, storage!);

      return c.json({ results, count: results.length });
    } catch (error) {
      console.error("[Memory Worker] Search error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Get recent memories
   * GET /memories/recent
   */
  app.get("/recent", (c) => {
    try {
      const limit = parseInt(c.req.query("limit") ?? "10");
      const typesParam = c.req.query("types");
      const types = typesParam ? (typesParam.split(",") as MemoryType[]) : undefined;

      const memories = storage!.getRecent(limit, types);
      return c.json({ memories, count: memories.length });
    } catch (error) {
      console.error("[Memory Worker] Recent error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  // ============================================================================
  // Distillation (placeholder for Phase 4)
  // ============================================================================

  /**
   * Distill a raw event into a memory
   * POST /distill
   */
  app.post("/distill", async (c) => {
    try {
      const event = (await c.req.json()) as RawEvent;
      void event;

      // TODO: Implement distillation in Phase 4
      // For now, return 501 Not Implemented
      return c.json(
        { 
          error: "Not Implemented",
          message: "Distillation feature is planned for a future release" 
        }, 
        501
      );
    } catch (error) {
      console.error("[Memory Worker] Distill error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  // ============================================================================
  // Maintenance Operations
  // ============================================================================

  /**
   * Get storage statistics
   * GET /stats
   */
  app.get("/stats", (c) => {
    try {
      const memoryCount = storage!.count({ includePrivate: true });
      const vectorCount = vectors?.count() ?? 0;

      return c.json({
        memories: memoryCount,
        vectors: vectorCount,
        vectorsAvailable: vectors?.isAvailable() ?? false,
      });
    } catch (error) {
      console.error("[Memory Worker] Stats error:", error);
      return c.json({ error: String(error) }, 500);
    }
  });

  /**
   * Graceful shutdown
   * POST /shutdown
   */
  app.post("/shutdown", (c) => {
    console.log("[Memory Worker] Shutdown requested");

    // Close storage in background
    setTimeout(() => {
      storage?.close();
      process.exit(0);
    }, 100);

    return c.json({ status: "shutting_down" });
  });

  return app;
}

/**
 * Hybrid merge using Reciprocal Rank Fusion
 */
function hybridMerge(
  ftsResults: SearchResult[],
  vecResults: Array<{ memory_id: number; distance: number }>,
  ftsWeight: number,
  vecWeight: number,
  k: number,
  storage: MemoryStorage
): SearchResult[] {
  const RRF_K = 60;
  const scores = new Map<number, { score: number; result: SearchResult }>();

  // Score FTS results
  ftsResults.forEach((r, rank) => {
    const score = ftsWeight * (1 / (RRF_K + rank + 1));
    scores.set(r.memory.id, { score, result: { ...r, matchType: "fts" } });
  });

  // Score and merge vector results
  vecResults.forEach((r, rank) => {
    const vecScore = vecWeight * (1 / (RRF_K + rank + 1));
    const existing = scores.get(r.memory_id);

    if (existing) {
      existing.score += vecScore;
      existing.result.matchType = "hybrid";
    } else {
      // Fetch memory for vector-only match
      const memory = storage.getById(r.memory_id);
      if (memory) {
        scores.set(r.memory_id, {
          score: vecScore,
          result: { memory, score: vecScore, matchType: "vector" },
        });
      }
    }
  });

  // Sort by combined score and return top k
  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => ({ ...s.result, score: s.score }));
}

export { initializeStorage };
