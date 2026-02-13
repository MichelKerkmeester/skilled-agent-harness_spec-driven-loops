/**
 * Hybrid Memory Retrieval
 * Combines FTS5 and vector search using Reciprocal Rank Fusion
 * @module features/memory/retrieval
 */

import type {
  Memory,
  MemoryType,
  SearchResult,
  SearchOptions,
  VectorSearchRow,
} from "./types.js";
import { MemoryStorage } from "./storage/sqlite.js";
import { VectorStorage } from "./storage/vector.js";
import { EmbeddingGenerator } from "./storage/embeddings.js";

/**
 * Configuration for hybrid retrieval
 */
export interface RetrievalConfig {
  ftsWeight: number;      // Weight for FTS results (0-1)
  vectorWeight: number;   // Weight for vector results (0-1)
  rrfK: number;           // RRF constant (typically 60)
  reranking: boolean;     // Whether to re-rank by semantic similarity
}

export const DEFAULT_RETRIEVAL_CONFIG: RetrievalConfig = {
  ftsWeight: 0.4,
  vectorWeight: 0.6,
  rrfK: 60,
  reranking: false,
};

/**
 * Memory Retrieval System
 * Provides hybrid search combining keyword (FTS5) and semantic (vector) search
 */
export class MemoryRetrieval {
  private storage: MemoryStorage;
  private vectors: VectorStorage;
  private embeddings: EmbeddingGenerator;
  private config: RetrievalConfig;

  constructor(
    storage: MemoryStorage,
    vectors: VectorStorage,
    embeddings: EmbeddingGenerator,
    config?: Partial<RetrievalConfig>
  ) {
    this.storage = storage;
    this.vectors = vectors;
    this.embeddings = embeddings;
    this.config = { ...DEFAULT_RETRIEVAL_CONFIG, ...config };
  }

  /**
   * Perform hybrid search
   */
  async search(options: SearchOptions): Promise<SearchResult[]> {
    const k = options.limit ?? 10;
    const ftsWeight = options.hybridWeight?.fts ?? this.config.ftsWeight;
    const vecWeight = options.hybridWeight?.vector ?? this.config.vectorWeight;

    // Run FTS and vector search in parallel
    const [ftsResults, vecResults] = await Promise.all([
      this.searchFTS(options, k * 2),
      this.searchVector(options.query, k * 2),
    ]);

    // Merge using Reciprocal Rank Fusion
    const merged = this.rrfMerge(ftsResults, vecResults, ftsWeight, vecWeight, k);

    // Optional: Re-rank by semantic similarity
    if (this.config.reranking && merged.length > 0) {
      return this.rerank(merged, options.query);
    }

    return merged;
  }

  /**
   * FTS5 full-text search
   */
  private searchFTS(options: SearchOptions, limit: number): SearchResult[] {
    return this.storage.searchFTS(options.query, limit, {
      types: options.types,
      minImportance: options.minImportance,
      includePrivate: options.includePrivate,
    });
  }

  /**
   * Vector similarity search
   */
  private async searchVector(
    query: string,
    limit: number
  ): Promise<VectorSearchRow[]> {
    if (!this.vectors.isAvailable()) {
      return [];
    }

    try {
      const queryEmbedding = await this.embeddings.generate(query);
      return this.vectors.searchSimilar(queryEmbedding, limit);
    } catch (error) {
      console.warn("[Memory Retrieval] Vector search failed:", error);
      return [];
    }
  }

  /**
   * Reciprocal Rank Fusion
   * Combines results from multiple ranking systems
   */
  private rrfMerge(
    ftsResults: SearchResult[],
    vecResults: VectorSearchRow[],
    ftsWeight: number,
    vecWeight: number,
    k: number
  ): SearchResult[] {
    const scores = new Map<number, { score: number; result: SearchResult }>();
    const RRF_K = this.config.rrfK;

    // Score FTS results
    ftsResults.forEach((r, rank) => {
      const score = ftsWeight * (1 / (RRF_K + rank + 1));
      scores.set(r.memory.id, {
        score,
        result: { ...r, matchType: "fts", score },
      });
    });

    // Score and merge vector results
    vecResults.forEach((r, rank) => {
      const vecScore = vecWeight * (1 / (RRF_K + rank + 1));
      const existing = scores.get(r.memory_id);

      if (existing) {
        // Found in both - this is a hybrid match
        existing.score += vecScore;
        existing.result.matchType = "hybrid";
        existing.result.score = existing.score;
      } else {
        // Vector-only match - need to fetch the memory
        const memory = this.storage.getById(r.memory_id);
        if (memory) {
          scores.set(r.memory_id, {
            score: vecScore,
            result: {
              memory,
              score: vecScore,
              matchType: "vector",
            },
          });
        }
      }
    });

    // Sort by combined score and return top k
    return Array.from(scores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((s) => s.result);
  }

  /**
   * Re-rank results by semantic similarity to query
   */
  private async rerank(
    results: SearchResult[],
    query: string
  ): Promise<SearchResult[]> {
    if (!this.vectors.isAvailable() || results.length === 0) {
      return results;
    }

    try {
      const queryEmbedding = await this.embeddings.generate(query);

      // Calculate semantic scores for each result
      const scored = await Promise.all(
        results.map(async (r) => {
          const memoryEmbedding = this.vectors.getEmbedding(r.memory.id);
          if (!memoryEmbedding) {
            return { result: r, semanticScore: 0 };
          }

          const similarity = this.cosineSimilarity(queryEmbedding, memoryEmbedding);
          return { result: r, semanticScore: similarity };
        })
      );

      // Combine RRF score with semantic score
      return scored
        .map(({ result, semanticScore }) => ({
          ...result,
          score: result.score * 0.7 + semanticScore * 0.3,
        }))
        .sort((a, b) => b.score - a.score);
    } catch (error) {
      console.warn("[Memory Retrieval] Re-ranking failed:", error);
      return results;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  /**
   * Get memories related to given concepts
   */
  getRelatedByConcepts(concepts: string[], limit: number = 10): Memory[] {
    return this.storage.getByConcepts(concepts, limit);
  }

  /**
   * Get recent memories
   */
  getRecent(limit: number = 10, types?: MemoryType[]): Memory[] {
    return this.storage.getRecent(limit, types);
  }

  /**
   * Get memories from a specific workflow phase
   */
  getByPhase(phase: string, limit: number = 10): Memory[] {
    return this.storage.getByPhase(phase, limit);
  }

  /**
   * Get memories from a specific session
   */
  getBySession(sessionId: string): Memory[] {
    return this.storage.getBySession(sessionId);
  }
}
