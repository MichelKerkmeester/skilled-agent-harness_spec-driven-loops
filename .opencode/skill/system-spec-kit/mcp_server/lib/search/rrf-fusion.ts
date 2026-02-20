// ---------------------------------------------------------------
// MODULE: RRF Fusion
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  KEYWORD: 'keyword',
} as const;

const DEFAULT_K = 60;
const CONVERGENCE_BONUS = 0.10;
const GRAPH_WEIGHT_BOOST = 1.5;

/** Minimum character length for a query term to be considered for term matching. */
const MIN_QUERY_TERM_LENGTH = 2;

/* ---------------------------------------------------------------
   2. INTERFACES
   --------------------------------------------------------------- */

/** A single item from a ranked retrieval list, identified by its unique ID. */
interface RrfItem {
  id: number | string;
  [key: string]: unknown;
}

/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */
interface FusionResult extends RrfItem {
  /**
   * Reciprocal Rank Fusion score. Combines rankings from multiple retrieval
   * methods using the formula `1/(k + rank)`. Higher values indicate the
   * result was ranked highly by more methods. Includes convergence bonus
   * when a result appears in multiple ranked lists.
   */
  rrfScore: number;
  sources: string[];
  sourceScores: Record<string, number>;
  convergenceBonus: number;
}

/** A ranked result list from a single retrieval source (e.g., vector, BM25, graph). */
interface RankedList {
  source: string;
  results: RrfItem[];
  weight?: number;
}

/** Configuration options for multi-list RRF fusion. */
interface FuseMultiOptions {
  k?: number;
  convergenceBonus?: number;
  graphWeightBoost?: number;
}

/** Configuration options for advanced score fusion with term matching. */
interface FuseAdvancedOptions {
  termMatchBonus?: number;
}

/** A search function descriptor: source label, async retrieval function, and optional weight. */
interface SearchFunction {
  source: string;
  fn: () => Promise<RrfItem[]>;
  weight?: number;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Fuse two ranked result lists using Reciprocal Rank Fusion.
 */
function fuseResults(
  listA: RrfItem[],
  listB: RrfItem[],
  k: number = DEFAULT_K,
  sourceA: string = SOURCE_TYPES.VECTOR,
  sourceB: string = SOURCE_TYPES.FTS,
): FusionResult[] {
  const scoreMap = new Map<number | string, FusionResult>();

  // Process list A
  for (let i = 0; i < listA.length; i++) {
    const item = listA[i];
    const rrfScore = 1 / (k + i + 1);
    const existing = scoreMap.get(item.id);
    if (existing) {
      existing.rrfScore += rrfScore;
      existing.sources.push(sourceA);
    } else {
      scoreMap.set(item.id, {
        ...item,
        rrfScore,
        sources: [sourceA],
        sourceScores: {},
        convergenceBonus: 0,
      });
    }
  }

  // Process list B
  for (let i = 0; i < listB.length; i++) {
    const item = listB[i];
    const rrfScore = 1 / (k + i + 1);
    const existing = scoreMap.get(item.id);
    if (existing) {
      existing.rrfScore += rrfScore;
      existing.sources.push(sourceB);
      existing.convergenceBonus = CONVERGENCE_BONUS;
      existing.rrfScore += CONVERGENCE_BONUS;
    } else {
      scoreMap.set(item.id, {
        ...item,
        rrfScore,
        sources: [sourceB],
        sourceScores: {},
        convergenceBonus: 0,
      });
    }
  }

  return Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Fuse multiple ranked result lists with optional source weights.
 */
function fuseResultsMulti(
  lists: RankedList[],
  options: FuseMultiOptions = {}
): FusionResult[] {
  // Use ?? (not ||) so callers can explicitly pass 0 without falling back to defaults
  const k = options.k ?? DEFAULT_K;
  const convergenceBonus = options.convergenceBonus ?? CONVERGENCE_BONUS;
  const graphWeightBoost = options.graphWeightBoost ?? GRAPH_WEIGHT_BOOST;

  const scoreMap = new Map<number | string, FusionResult>();

  for (const list of lists) {
    // Use ?? so explicit weight=0 is honoured; graph source gets a boost when no weight is given
    const weight = list.weight ?? (list.source === SOURCE_TYPES.GRAPH ? graphWeightBoost : 1.0);
    for (let i = 0; i < list.results.length; i++) {
      const item = list.results[i];
      const rrfScore = weight * (1 / (k + i + 1));
      const existing = scoreMap.get(item.id);
      if (existing) {
        existing.rrfScore += rrfScore;
        existing.sources.push(list.source);
        existing.sourceScores[list.source] = rrfScore;
      } else {
        scoreMap.set(item.id, {
          ...item,
          rrfScore,
          sources: [list.source],
          sourceScores: { [list.source]: rrfScore },
          convergenceBonus: 0,
        });
      }
    }
  }

  // Apply convergence bonus for multi-source matches
  for (const result of scoreMap.values()) {
    if (result.sources.length >= 2) {
      const bonus = convergenceBonus * (result.sources.length - 1);
      result.convergenceBonus = bonus;
      result.rrfScore += bonus;
    }
  }

  return Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Advanced score fusion with original term match counting.
 */
function fuseScoresAdvanced(
  results: FusionResult[],
  query: string,
  options: FuseAdvancedOptions = {}
): Array<FusionResult & { termMatches: number }> {
  const termMatchBonus = options.termMatchBonus || 0.05;
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length >= MIN_QUERY_TERM_LENGTH);

  return results.map(r => {
    const termMatches = countOriginalTermMatches(r, queryTerms);
    const bonus = termMatches * termMatchBonus;
    return {
      ...r,
      rrfScore: r.rrfScore + bonus,
      termMatches,
    };
  }).sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Count how many query terms match in the result's text fields.
 */
function countOriginalTermMatches(
  result: Record<string, unknown>,
  queryTerms: string[]
): number {
  const searchableText = [
    (result.title as string) || '',
    (result.trigger_phrases as string) || '',
    (result.file_path as string) || '',
  ].join(' ').toLowerCase();

  let matches = 0;
  for (const term of queryTerms) {
    if (searchableText.includes(term)) {
      matches++;
    }
  }
  return matches;
}

/**
 * Unified search that combines vector, FTS, and BM25 results via RRF.
 */
async function unifiedSearch(
  searchFunctions: SearchFunction[],
  options: FuseMultiOptions = {}
): Promise<FusionResult[]> {
  const lists: RankedList[] = await Promise.all(
    searchFunctions.map(async (sf) => {
      try {
        const results = await sf.fn();
        return { source: sf.source, results, weight: sf.weight };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[rrf-fusion] ${sf.source} search failed: ${msg}`);
        return { source: sf.source, results: [], weight: sf.weight };
      }
    })
  );
  return fuseResultsMulti(lists, options);
}

/**
 * C138-P3: Cross-Variant RRF Fusion for multi-query RAG.
 *
 * Accepts multi-dimensional arrays (one RankedList[] per query variant),
 * groups identical memory IDs across variants, and applies a +0.10
 * cross-variant convergence bonus when the same ID appears in results
 * from different query variants.
 *
 * @param variantLists - Array of variant result sets, each containing
 *                       multiple RankedLists (e.g., vector + fts per variant)
 * @param options - Standard fusion options
 * @returns Fused results with cross-variant convergence bonuses
 */
function fuseResultsCrossVariant(
  variantLists: RankedList[][],
  options: FuseMultiOptions = {}
): FusionResult[] {
  // Use ?? so callers can explicitly pass 0 convergence bonus without falling back to default
  const convergenceBonusPerVariant = options.convergenceBonus ?? CONVERGENCE_BONUS;

  if (variantLists.length === 0) return [];

  // Step 1: Fuse each variant's lists independently
  const perVariantFused: FusionResult[][] = variantLists.map(lists =>
    fuseResultsMulti(lists, options)
  );

  // Step 2: Track which variants each ID appeared in
  const variantAppearances = new Map<number | string, Set<number>>();
  for (let vi = 0; vi < perVariantFused.length; vi++) {
    for (const result of perVariantFused[vi]) {
      let variants = variantAppearances.get(result.id);
      if (!variants) {
        variants = new Set<number>();
        variantAppearances.set(result.id, variants);
      }
      variants.add(vi);
    }
  }

  // Step 3: Merge all variant results, accumulating RRF scores
  const mergedMap = new Map<number | string, FusionResult>();
  for (const variantResults of perVariantFused) {
    for (const result of variantResults) {
      const existing = mergedMap.get(result.id);
      if (existing) {
        // Accumulate scores from additional variants
        existing.rrfScore += result.rrfScore;
        for (const src of result.sources) {
          if (!existing.sources.includes(src)) {
            existing.sources.push(src);
          }
        }
        for (const [key, val] of Object.entries(result.sourceScores)) {
          existing.sourceScores[key] = (existing.sourceScores[key] || 0) + val;
        }
      } else {
        mergedMap.set(result.id, { ...result });
      }
    }
  }

  // Step 4: Apply cross-variant convergence bonus
  for (const [id, result] of mergedMap) {
    const variantCount = variantAppearances.get(id)?.size || 1;
    if (variantCount >= 2) {
      const crossVariantBonus = convergenceBonusPerVariant * (variantCount - 1);
      result.convergenceBonus += crossVariantBonus;
      result.rrfScore += crossVariantBonus;
    }
  }

  return Array.from(mergedMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Check if RRF fusion is enabled.
 */
function isRrfEnabled(): boolean {
  return process.env.SPECKIT_RRF !== 'false';
}

/* ---------------------------------------------------------------
   4. EXPORTS
   --------------------------------------------------------------- */

export {
  SOURCE_TYPES,
  DEFAULT_K,
  CONVERGENCE_BONUS,
  GRAPH_WEIGHT_BOOST,

  fuseResults,
  fuseResultsMulti,
  fuseResultsCrossVariant,
  fuseScoresAdvanced,
  countOriginalTermMatches,
  unifiedSearch,
  isRrfEnabled,
};

export type {
  RrfItem,
  FusionResult,
  RankedList,
  FuseMultiOptions,
  FuseAdvancedOptions,
  SearchFunction,
};
