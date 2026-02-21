// ---------------------------------------------------------------
// MODULE: Memory Surface
// ---------------------------------------------------------------

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';

import type { Database } from '../../shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ConstitutionalMemory {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
  importanceTier: string;
}

interface AutoSurfaceResult {
  constitutional: ConstitutionalMemory[];
  triggered: {
    memory_id: number;
    spec_folder: string;
    title: string;
    matched_phrases: string[];
  }[];
  surfaced_at: string;
  latencyMs: number;
}

/* ---------------------------------------------------------------
   2. MEMORY SURFACE HOOK CONFIGURATION
--------------------------------------------------------------- */

const MEMORY_AWARE_TOOLS: Set<string> = new Set([
  'memory_search',
  'memory_match_triggers',
  'memory_list',
  'memory_save',
  'memory_index_scan'
]);

// Constitutional memory cache
let constitutionalCache: ConstitutionalMemory[] | null = null;
let constitutionalCacheTime = 0;
const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute

/* ---------------------------------------------------------------
   3. CONTEXT EXTRACTION
--------------------------------------------------------------- */

function extractContextHint(args: Record<string, unknown> | null | undefined): string | null {
  if (!args || typeof args !== 'object') return null;

  const contextFields = ['query', 'prompt', 'specFolder', 'filePath'];
  for (const field of contextFields) {
    if (args[field] && typeof args[field] === 'string' && (args[field] as string).length >= 3) {
      return args[field] as string;
    }
  }

  // Join concepts array if present
  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
    return (args.concepts as string[]).join(' ');
  }

  return null;
}

/* ---------------------------------------------------------------
   4. CONSTITUTIONAL MEMORIES
--------------------------------------------------------------- */

async function getConstitutionalMemories(): Promise<ConstitutionalMemory[]> {
  const now = Date.now();

  if (constitutionalCache && (now - constitutionalCacheTime) < CONSTITUTIONAL_CACHE_TTL) {
    return constitutionalCache;
  }

  try {
    const db: Database | null = vectorIndex.getDb();
    if (!db) return [];

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
      FROM memory_index
      WHERE importance_tier = 'constitutional'
      AND embedding_status = 'success'
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    constitutionalCache = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as number,
      specFolder: r.spec_folder as string,
      filePath: r.file_path as string,
      title: r.title as string,
      importanceTier: r.importance_tier as string
    }));
    constitutionalCacheTime = now;

    return constitutionalCache;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[SK-004] Failed to fetch constitutional memories:', message);
    return [];
  }
}

function clearConstitutionalCache(): void {
  constitutionalCache = null;
  constitutionalCacheTime = 0;
}

/* ---------------------------------------------------------------
   5. AUTO-SURFACE MEMORIES
--------------------------------------------------------------- */

async function autoSurfaceMemories(contextHint: string): Promise<AutoSurfaceResult | null> {
  const startTime = Date.now();

  try {
    // Get constitutional memories (always surface)
    const constitutional = await getConstitutionalMemories();

    // Get triggered memories via fast phrase matching
    const triggered = triggerMatcher.matchTriggerPhrases(contextHint, 5);

    const latencyMs = Date.now() - startTime;

    // Only return if we have something to surface
    if (constitutional.length === 0 && triggered.length === 0) {
      return null;
    }

    return {
      constitutional: constitutional,
      triggered: triggered.map((t: triggerMatcher.TriggerMatch) => ({
        memory_id: t.memoryId,
        spec_folder: t.specFolder,
        title: t.title ?? 'Untitled',
        matched_phrases: t.matchedPhrases,
      })),
      surfaced_at: new Date().toISOString(),
      latencyMs: latencyMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[SK-004] Auto-surface failed:', message);
    return null;
  }
}

/* ---------------------------------------------------------------
   6. EXPORTS
--------------------------------------------------------------- */

export {
  // Constants
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,

  // Functions
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
};
