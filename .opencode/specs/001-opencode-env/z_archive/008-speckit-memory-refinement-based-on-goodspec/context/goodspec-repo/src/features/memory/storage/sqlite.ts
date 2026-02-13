/**
 * SQLite Memory Storage Implementation
 * @module features/memory/storage/sqlite
 */

import { Database, type Statement } from "bun:sqlite";
import { initializeSchema, migrateSchema } from "./schema.js";
import type {
  Memory,
  MemoryInput,
  MemoryUpdate,
  MemoryRow,
  MemoryType,
  SearchResult,
  FtsSearchRow,
} from "../types.js";

type NamedBindings = Record<string, string | bigint | NodeJS.TypedArray | number | boolean | null>;

/**
 * Convert a database row to a Memory object
 */
function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    type: row.type as MemoryType,
    title: row.title,
    content: row.content,
    facts: JSON.parse(row.facts || "[]"),
    concepts: JSON.parse(row.concepts || "[]"),
    sourceFiles: JSON.parse(row.source_files || "[]"),
    importance: row.importance,
    visibility: row.visibility as "public" | "private",
    phase: row.phase ?? undefined,
    sessionId: row.session_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    accessedAt: row.accessed_at,
    accessCount: row.access_count,
  };
}

/**
 * SQLite-based memory storage with FTS5 full-text search
 */
export class MemoryStorage {
  private db: Database;
  private statements: Map<string, Statement> = new Map();

  constructor(dbPath: string) {
    this.db = new Database(dbPath, { create: true, strict: true });
    initializeSchema(this.db);
    migrateSchema(this.db);
  }

  /**
   * Get the underlying database instance
   * Used by VectorStorage to share the same connection
   */
  getDatabase(): Database {
    return this.db;
  }

  /**
   * Get or create a prepared statement
   */
  private stmt<T>(name: string, sql: string): Statement<T> {
    if (!this.statements.has(name)) {
      this.statements.set(name, this.db.query(sql));
    }
    return this.statements.get(name)! as Statement<T>;
  }

  /**
   * Create a new memory
   */
  create(input: MemoryInput): Memory {
    const now = Math.floor(Date.now() / 1000);

    const insert = this.stmt<MemoryRow>(
      "insert",
      `
      INSERT INTO memories (
        type, title, content, facts, concepts, source_files,
        importance, visibility, phase, session_id,
        created_at, updated_at, accessed_at, access_count
      ) VALUES (
        $type, $title, $content, $facts, $concepts, $sourceFiles,
        $importance, $visibility, $phase, $sessionId,
        $createdAt, $updatedAt, $accessedAt, 0
      )
      RETURNING *
    `
    );

    const row = insert.get({
      $type: input.type,
      $title: input.title,
      $content: input.content,
      $facts: JSON.stringify(input.facts ?? []),
      $concepts: JSON.stringify(input.concepts ?? []),
      $sourceFiles: JSON.stringify(input.sourceFiles ?? []),
      $importance: input.importance ?? 5,
      $visibility: input.visibility ?? "public",
      $phase: input.phase ?? null,
      $sessionId: input.sessionId ?? null,
      $createdAt: now,
      $updatedAt: now,
      $accessedAt: now,
    }) as MemoryRow;

    return rowToMemory(row);
  }

  /**
   * Get a memory by ID
   */
  getById(id: number): Memory | null {
    const query = this.stmt<MemoryRow>(
      "getById",
      "SELECT * FROM memories WHERE id = $id"
    );

    const row = query.get({ $id: id }) as MemoryRow | null;
    if (!row) return null;

    // Update access stats
    this.db
      .query<unknown, NamedBindings>(
        `UPDATE memories SET accessed_at = unixepoch(), access_count = access_count + 1 WHERE id = $id`
      )
      .run({ $id: id });

    return rowToMemory(row);
  }

  /**
   * Update a memory
   */
  update(id: number, updates: MemoryUpdate): Memory | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const setClauses: string[] = ["updated_at = unixepoch()"];
    const params: NamedBindings = { $id: id };

    if (updates.title !== undefined) {
      setClauses.push("title = $title");
      params.$title = updates.title;
    }
    if (updates.content !== undefined) {
      setClauses.push("content = $content");
      params.$content = updates.content;
    }
    if (updates.facts !== undefined) {
      setClauses.push("facts = $facts");
      params.$facts = JSON.stringify(updates.facts);
    }
    if (updates.concepts !== undefined) {
      setClauses.push("concepts = $concepts");
      params.$concepts = JSON.stringify(updates.concepts);
    }
    if (updates.sourceFiles !== undefined) {
      setClauses.push("source_files = $sourceFiles");
      params.$sourceFiles = JSON.stringify(updates.sourceFiles);
    }
    if (updates.importance !== undefined) {
      setClauses.push("importance = $importance");
      params.$importance = updates.importance;
    }
    if (updates.visibility !== undefined) {
      setClauses.push("visibility = $visibility");
      params.$visibility = updates.visibility;
    }

    const sql = `UPDATE memories SET ${setClauses.join(", ")} WHERE id = $id RETURNING *`;
    const row = this.db.query<MemoryRow, NamedBindings>(sql).get(params) as MemoryRow;

    return rowToMemory(row);
  }

  /**
   * Delete a memory
   */
  delete(id: number): boolean {
    const result = this.db
      .query<unknown, NamedBindings>("DELETE FROM memories WHERE id = $id")
      .run({ $id: id });
    return result.changes > 0;
  }

  /**
   * Search memories using FTS5 full-text search
   */
  searchFTS(
    query: string,
    limit: number = 10,
    options?: {
      types?: MemoryType[];
      minImportance?: number;
      includePrivate?: boolean;
    }
  ): SearchResult[] {
    // Escape special FTS5 characters and build query
    const escapedQuery = query
      .replace(/[*"()]/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .map((w) => `"${w}"*`)
      .join(" OR ");

    if (!escapedQuery) return [];

    let whereClause = "";
    const params: NamedBindings = {
      $query: escapedQuery,
      $limit: limit,
    };

    // Add type filter
    if (options?.types?.length) {
      whereClause += ` AND m.type IN (${options.types.map((_, i) => `$type${i}`).join(", ")})`;
      options.types.forEach((t, i) => {
        params[`$type${i}`] = t;
      });
    }

    // Add importance filter
    if (options?.minImportance) {
      whereClause += " AND m.importance >= $minImportance";
      params.$minImportance = options.minImportance;
    }

    // Add visibility filter
    if (!options?.includePrivate) {
      whereClause += " AND m.visibility = 'public'";
    }

    const sql = `
      SELECT 
        m.*,
        bm25(memories_fts, 10.0, 5.0, 1.0, 1.0) as rank,
        highlight(memories_fts, 0, '<mark>', '</mark>') as highlighted_title,
        highlight(memories_fts, 1, '<mark>', '</mark>') as highlighted_content
      FROM memories m
      JOIN memories_fts ON m.id = memories_fts.rowid
      WHERE memories_fts MATCH $query ${whereClause}
      ORDER BY rank
      LIMIT $limit
    `;

    const rows = this.db.query<FtsSearchRow, NamedBindings>(sql).all(params) as FtsSearchRow[];

    return rows.map((row) => ({
      memory: rowToMemory(row),
      score: Math.abs(row.rank), // BM25 returns negative scores (lower is better)
      matchType: "fts" as const,
      highlighted: row.highlighted_content || row.highlighted_title,
    }));
  }

  /**
   * Get recent memories
   */
  getRecent(
    limit: number = 10,
    types?: MemoryType[],
    includePrivate: boolean = false
  ): Memory[] {
    let whereClause = includePrivate ? "" : "WHERE visibility = 'public'";
    const params: NamedBindings = { $limit: limit };

    if (types?.length) {
      const typeCondition = `type IN (${types.map((_, i) => `$type${i}`).join(", ")})`;
      whereClause = whereClause
        ? `${whereClause} AND ${typeCondition}`
        : `WHERE ${typeCondition}`;
      types.forEach((t, i) => {
        params[`$type${i}`] = t;
      });
    }

    const sql = `
      SELECT * FROM memories
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $limit
    `;

    const rows = this.db.query<MemoryRow, NamedBindings>(sql).all(params) as MemoryRow[];
    return rows.map(rowToMemory);
  }

  /**
   * Get memories by concepts
   */
  getByConcepts(concepts: string[], limit: number = 10): Memory[] {
    // Build a query that matches any of the concepts
    const conditions = concepts.map(
      (_, i) => `concepts LIKE '%' || $concept${i} || '%'`
    );
    const params: NamedBindings = { $limit: limit };
    concepts.forEach((c, i) => {
      params[`$concept${i}`] = c;
    });

    const sql = `
      SELECT * FROM memories
      WHERE (${conditions.join(" OR ")})
        AND visibility = 'public'
      ORDER BY importance DESC, created_at DESC
      LIMIT $limit
    `;

    const rows = this.db.query<MemoryRow, NamedBindings>(sql).all(params) as MemoryRow[];
    return rows.map(rowToMemory);
  }

  /**
   * Get memories by phase
   */
  getByPhase(phase: string, limit: number = 10): Memory[] {
    const sql = `
      SELECT * FROM memories
      WHERE phase = $phase AND visibility = 'public'
      ORDER BY created_at DESC
      LIMIT $limit
    `;

    const rows = this.db
      .query<MemoryRow, NamedBindings>(sql)
      .all({ $phase: phase, $limit: limit }) as MemoryRow[];
    return rows.map(rowToMemory);
  }

  /**
   * Get memories by session
   */
  getBySession(sessionId: string): Memory[] {
    const sql = `
      SELECT * FROM memories
      WHERE session_id = $sessionId
      ORDER BY created_at ASC
    `;

    const rows = this.db
      .query<MemoryRow, NamedBindings>(sql)
      .all({ $sessionId: sessionId }) as MemoryRow[];
    return rows.map(rowToMemory);
  }

  /**
   * Count memories
   */
  count(options?: { types?: MemoryType[]; includePrivate?: boolean }): number {
    let whereClause = options?.includePrivate ? "" : "WHERE visibility = 'public'";
    const params: NamedBindings = {};

    if (options?.types?.length) {
      const typeCondition = `type IN (${options.types.map((_, i) => `$type${i}`).join(", ")})`;
      whereClause = whereClause
        ? `${whereClause} AND ${typeCondition}`
        : `WHERE ${typeCondition}`;
      options.types.forEach((t, i) => {
        params[`$type${i}`] = t;
      });
    }

    const sql = `SELECT COUNT(*) as count FROM memories ${whereClause}`;
    const row = this.db
      .query<{ count: number }, NamedBindings>(sql)
      .get(params) as { count: number };
    return row.count;
  }

  /**
   * Delete old memories based on retention policy
   */
  deleteOlderThan(days: number): number {
    const cutoff = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
    const result = this.db
      .query<unknown, NamedBindings>("DELETE FROM memories WHERE created_at < $cutoff")
      .run({ $cutoff: cutoff });
    return result.changes;
  }

  /**
   * Delete memories exceeding max count (keeps most important/recent)
   */
  trimToMax(maxCount: number): number {
    const count = this.count({ includePrivate: true });
    if (count <= maxCount) return 0;

    const toDelete = count - maxCount;
    const result = this.db
      .query<unknown, NamedBindings>(
        `
      DELETE FROM memories WHERE id IN (
        SELECT id FROM memories
        ORDER BY importance ASC, accessed_at ASC
        LIMIT $toDelete
      )
    `
      )
      .run({ $toDelete: toDelete });
    return result.changes;
  }

  /**
   * Batch create memories
   */
  createBatch(inputs: MemoryInput[]): Memory[] {
    const memories: Memory[] = [];

    const tx = this.db.transaction((items: MemoryInput[]) => {
      for (const input of items) {
        const memory = this.create({
          ...input,
          // Override timestamps for batch consistency
        });
        memories.push(memory);
      }
    });

    tx(inputs);
    return memories;
  }

  /**
   * Close the database connection
   */
  close(): void {
    for (const stmt of this.statements.values()) {
      stmt.finalize();
    }
    this.statements.clear();
    this.db.close();
  }
}
