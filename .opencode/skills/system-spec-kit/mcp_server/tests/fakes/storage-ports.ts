// -------------------------------------------------------------------
// MODULE: Storage Port Fakes
// -------------------------------------------------------------------

import {
  collectDirectedReachability,
  collectWeightedWalk,
  type DirectedReachabilityOptions,
  type DirectedTraversalEdge,
  type WeightedTraversalEdge,
  type WeightedWalkOptions,
  type WeightedWalkResult,
} from '../../lib/graph/bfs-traversal';
import { isSqliteContentionError } from '../../lib/storage/ports';
import type {
  CheckpointOptions,
  ContentionOperationOptions,
  ContentionPolicy,
  GraphTraversal,
  GraphTraversalNode,
  LexicalDocumentFields,
  LexicalSearch,
  LexicalSearchOptions,
  LexicalSearchResult,
  LexicalSearchStats,
  Maintenance,
  MaintenanceResult,
  StorageId,
  VectorMetadata,
  VectorRecord,
  VectorSearchOptions,
  VectorSearchResult,
  VectorStore,
} from '../../lib/storage/ports';
import type Database from 'better-sqlite3';

interface FakeCausalEdge {
  readonly sourceId: number;
  readonly targetId: number;
  readonly relation: string;
  readonly strength?: number;
}

interface FakeDependencyEdge {
  readonly parentPath: string;
  readonly childPath: string;
}

interface FakeGraphTraversalOptions {
  readonly causalEdges?: readonly FakeCausalEdge[];
  readonly dependencyEdges?: readonly FakeDependencyEdge[];
}

/** Storage-free graph traversal test double. */
export class FakeGraphTraversal implements GraphTraversal {
  private readonly causalEdges: readonly FakeCausalEdge[];
  private readonly dependencyEdges: readonly FakeDependencyEdge[];

  constructor(options: FakeGraphTraversalOptions = {}) {
    this.causalEdges = options.causalEdges ?? [];
    this.dependencyEdges = options.dependencyEdges ?? [];
  }

  collectWeightedWalk<TNode extends GraphTraversalNode>(
    options: WeightedWalkOptions<TNode>,
  ): Map<TNode, WeightedWalkResult<TNode>> {
    return collectWeightedWalk(options);
  }

  collectDirectedReachability<TNode extends GraphTraversalNode>(
    options: DirectedReachabilityOptions<TNode>,
  ): TNode[] {
    return collectDirectedReachability(options);
  }

  collectCausalWeightedNeighbors(
    seeds: readonly number[],
    maxHops: number,
    relationWeights: Readonly<Record<string, number>>,
  ): Map<number, WeightedWalkResult<number>> {
    return this.collectWeightedWalk({
      seeds,
      maxHops,
      readEdges: (nodeIds) => this.readCausalEdges(nodeIds, relationWeights),
    });
  }

  collectDependencyReachability(roots: readonly string[]): string[] {
    return this.collectDirectedReachability({
      roots,
      readEdges: (nodeIds) => this.readDependencyEdges(nodeIds),
    });
  }

  private readCausalEdges(
    nodeIds: readonly number[],
    relationWeights: Readonly<Record<string, number>>,
  ): WeightedTraversalEdge<number>[] {
    const nodeSet = new Set(nodeIds);
    const edges: WeightedTraversalEdge<number>[] = [];
    for (const edge of this.causalEdges) {
      const weight = relationWeights[edge.relation] ?? 1.0;
      const strength = edge.strength ?? 1.0;
      if (nodeSet.has(edge.sourceId)) {
        edges.push({ from: edge.sourceId, to: edge.targetId, weight, strength });
      }
      if (nodeSet.has(edge.targetId)) {
        edges.push({ from: edge.targetId, to: edge.sourceId, weight, strength });
      }
    }
    return edges;
  }

  private readDependencyEdges(nodeIds: readonly string[]): DirectedTraversalEdge<string>[] {
    const nodeSet = new Set(nodeIds);
    return this.dependencyEdges
      .filter((edge) => nodeSet.has(edge.parentPath))
      .map((edge) => ({ from: edge.parentPath, to: edge.childPath }));
  }
}

/** Storage-free lexical search test double. */
export class FakeLexicalSearch implements LexicalSearch {
  private readonly documents = new Map<string, string>();

  addDocument(id: string, text: string): void {
    this.documents.set(id, text);
  }

  addDocumentFields(id: string, fields: LexicalDocumentFields): void {
    this.addDocument(id, fieldsToText(fields));
  }

  removeDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  search(query: string, options: LexicalSearchOptions = {}): LexicalSearchResult[] {
    const queryTokens = tokenizeForFake(query);
    if (queryTokens.length === 0) {
      return [];
    }

    const results: LexicalSearchResult[] = [];
    for (const [id, text] of this.documents) {
      const textTokens = tokenizeForFake(text);
      const score = queryTokens.reduce(
        (sum, token) => sum + textTokens.filter((textToken) => textToken === token).length,
        0,
      );
      if (score > 0) {
        results.push({ id, score });
      }
    }

    return results
      .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
      .slice(0, options.limit ?? 10);
  }

  getStats(): LexicalSearchStats {
    const terms = new Set<string>();
    let totalLength = 0;
    for (const text of this.documents.values()) {
      const tokens = tokenizeForFake(text);
      totalLength += tokens.length;
      for (const token of tokens) {
        terms.add(token);
      }
    }
    const documentCount = this.documents.size;
    return {
      documentCount,
      termCount: terms.size,
      avgDocLength: documentCount === 0 ? 0 : totalLength / documentCount,
    };
  }

  clear(): void {
    this.documents.clear();
  }
}

/**
 * Storage-free vector store test double.
 *
 * Mirrors the real adapter's identity contract: records are identified
 * by (spec_folder, file_path, anchor_id) from the metadata and the store
 * assigns the canonical id. A caller-supplied id on upsert is advisory
 * and never honored, so get/delete by a caller-chosen id is not
 * guaranteed to resolve.
 */
export class FakeVectorStore<TMetadata extends VectorMetadata = VectorMetadata> implements VectorStore<TMetadata> {
  private readonly records = new Map<string, VectorRecord<TMetadata>>();
  private readonly idsByIdentity = new Map<string, string>();
  private nextId = 1;

  upsert(record: VectorRecord<TMetadata>): void {
    const identity = vectorIdentityKey(record.metadata);
    let id = this.idsByIdentity.get(identity);
    if (id === undefined) {
      id = String(this.nextId);
      this.nextId += 1;
      this.idsByIdentity.set(identity, id);
    }
    this.records.set(id, { ...record, id });
  }

  delete(id: StorageId): boolean {
    const key = String(id);
    const record = this.records.get(key);
    if (!record) {
      return false;
    }
    this.idsByIdentity.delete(vectorIdentityKey(record.metadata));
    return this.records.delete(key);
  }

  get(id: StorageId): VectorRecord<TMetadata> | null {
    return this.records.get(String(id)) ?? null;
  }

  search(
    embedding: readonly number[] | Float32Array,
    options: VectorSearchOptions,
  ): VectorSearchResult<TMetadata>[] {
    return Array.from(this.records.values())
      .map((record) => ({
        id: record.id,
        score: cosineSimilarity(embedding, record.embedding),
        metadata: record.metadata,
      }))
      .filter((result) => result.score >= (options.minScore ?? Number.NEGATIVE_INFINITY))
      .sort((left, right) => right.score - left.score)
      .slice(0, options.limit);
  }

  clear(): void {
    this.records.clear();
    this.idsByIdentity.clear();
  }
}

/** Storage-free maintenance test double. */
export class FakeMaintenance implements Maintenance {
  readonly calls: string[] = [];

  constructor(private readonly result: MaintenanceResult = { ok: true }) {}

  integrityCheck(): MaintenanceResult {
    this.calls.push('integrityCheck');
    return this.result;
  }

  vacuum(): MaintenanceResult {
    this.calls.push('vacuum');
    return this.result;
  }

  checkpoint(options: CheckpointOptions = {}): MaintenanceResult {
    this.calls.push(`checkpoint:${options.mode ?? 'passive'}`);
    return this.result;
  }
}

/**
 * Storage-free contention policy test double.
 *
 * Mirrors the real policy's retry semantics: attempts default to one more
 * than the configured retry-delay schedule, and shouldAbort is honored
 * both before each attempt and after each delay (resolving to undefined
 * when aborted).
 */
export class FakeContentionPolicy implements ContentionPolicy {
  readonly busyTimeouts: number[] = [];

  async withRetry<T>(
    operation: () => T | Promise<T>,
    options: ContentionOperationOptions = {},
  ): Promise<T> {
    const attempts = Math.max(1, options.attempts ?? ((options.retryDelaysMs?.length ?? 0) + 1));
    const retryable = options.retryable ?? isSqliteContentionError;
    for (let attemptIndex = 0; attemptIndex < attempts; attemptIndex += 1) {
      if (options.shouldAbort?.()) {
        return undefined as T;
      }
      try {
        return await operation();
      } catch (error: unknown) {
        const canRetry = retryable(error) && attemptIndex < attempts - 1;
        if (!canRetry) {
          throw error;
        }
        const delayMs = resolveFakeDelayMs(options, attemptIndex);
        options.onRetry?.(error, { attempt: attemptIndex + 1, delayMs, label: options.label });
        if (options.shouldAbort?.()) {
          return undefined as T;
        }
      }
    }
    throw new Error('FakeContentionPolicy.withRetry: unreachable');
  }

  withWriteLock<T>(
    operation: () => T | Promise<T>,
    options: ContentionOperationOptions = {},
  ): Promise<T> {
    return this.withRetry(operation, options);
  }

  setBusyTimeout(
    _database: Database.Database,
    timeoutMs: number,
  ): void {
    this.busyTimeouts.push(timeoutMs);
  }
}

function resolveFakeDelayMs(options: ContentionOperationOptions, attemptIndex: number): number {
  const configuredDelay = options.retryDelaysMs?.[attemptIndex] ?? options.delayMs ?? 0;
  const delay = typeof configuredDelay === 'function' ? configuredDelay() : configuredDelay;
  return Math.max(0, delay);
}

function vectorIdentityKey(metadata: VectorMetadata): string {
  const aliased = metadata as {
    spec_folder?: string;
    specFolder?: string;
    file_path?: string;
    filePath?: string;
    anchor_id?: string;
    anchorId?: string;
  };
  const specFolder = aliased.spec_folder || aliased.specFolder || '';
  const filePath = aliased.file_path || aliased.filePath || '';
  const anchorId = aliased.anchor_id || aliased.anchorId || null;
  if (!specFolder || !filePath) {
    throw new Error('metadata must include spec_folder and file_path');
  }
  return [specFolder, filePath, anchorId ?? ""].join("\u0000");
}

function fieldsToText(fields: LexicalDocumentFields): string {
  return [
    fields.title ?? '',
    arrayOrStringToText(fields.trigger_phrases),
    fields.content_generic ?? '',
    fields.body ?? '',
  ].filter((part) => part.trim().length > 0).join(' ');
}

function arrayOrStringToText(value: string | string[] | null | undefined): string {
  return Array.isArray(value) ? value.join(' ') : (value ?? '');
}

function tokenizeForFake(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9_-]+/g) ?? [];
}

function cosineSimilarity(
  left: readonly number[] | Float32Array,
  right: readonly number[] | Float32Array,
): number {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }
  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}
