// ───────────────────────────────────────────────────────────────
// MODULE: Bounded Memory Cache
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

interface TtlEntry<V> {
  readonly value: V;
  readonly expiresAt: number | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function normalizeMaxSize(maxSize: number): number {
  if (!Number.isFinite(maxSize) || maxSize < 1) {
    throw new Error(`Cache maxSize must be a positive finite number, got ${maxSize}`);
  }

  return Math.floor(maxSize);
}

export class BoundedMap<K, V> extends Map<K, V> {
  readonly maxSize: number;

  constructor(maxSize: number, entries?: readonly (readonly [K, V])[] | null) {
    super();
    this.maxSize = normalizeMaxSize(maxSize);

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  override get(key: K): V | undefined {
    const value = super.get(key);
    if (value === undefined && !super.has(key)) {
      return undefined;
    }

    super.delete(key);
    super.set(key, value as V);
    return value;
  }

  override set(key: K, value: V): this {
    if (super.has(key)) {
      super.delete(key);
    }

    super.set(key, value);
    while (this.size > this.maxSize) {
      const first = this.entries().next();
      if (first.done) break;
      super.delete(first.value[0]);
    }

    return this;
  }
}

export class TtlMap<K, V> {
  private readonly entries: BoundedMap<K, TtlEntry<V>>;
  private readonly now: () => number;

  constructor(maxSize: number, now: () => number = Date.now) {
    this.entries = new BoundedMap<K, TtlEntry<V>>(maxSize);
    this.now = now;
  }

  get size(): number {
    this.pruneExpired();
    return this.entries.size;
  }

  get maxSize(): number {
    return this.entries.maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    const entry = this.entries.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.entries.delete(key);
      return false;
    }

    return true;
  }

  set(key: K, value: V, ttlMs: number = Number.POSITIVE_INFINITY): this {
    const expiresAt = Number.isFinite(ttlMs) ? this.now() + Math.max(0, ttlMs) : null;
    this.entries.set(key, { value, expiresAt });
    return this;
  }

  delete(key: K): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  pruneExpired(now: number = this.now()): number {
    let pruned = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        this.entries.delete(key);
        pruned += 1;
      }
    }
    return pruned;
  }

  keys(): IterableIterator<K> {
    this.pruneExpired();
    return this.entries.keys();
  }

  entriesIterator(): IterableIterator<[K, V]> {
    this.pruneExpired();
    const iterator = this.entries.entries();
    return (function* mapEntries(): IterableIterator<[K, V]> {
      for (const [key, entry] of iterator) {
        yield [key, entry.value];
      }
    })();
  }

  private isExpired(entry: TtlEntry<V>): boolean {
    return entry.expiresAt !== null && entry.expiresAt <= this.now();
  }
}
