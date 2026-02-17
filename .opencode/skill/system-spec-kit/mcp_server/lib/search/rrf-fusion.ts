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

/* ---------------------------------------------------------------
   2. INTERFACES
   --------------------------------------------------------------- */

interface RrfItem {
  id: number | string;
  [key: string]: unknown;
}

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

interface RankedList {
  source: string;
  results: RrfItem[];
  weight?: number;
}

interface FuseMultiOptions {
  k?: number;
  convergenceBonus?: number;
  graphWeightBoost?: number;
}

interface FuseAdvancedOptions {
  termMatchBonus?: number;
}

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
  k: number = DEFAULT_K
): FusionResult[] {
  const scoreMap = new Map<number | string, FusionResult>();

  // Process list A
  for (let i = 0; i < listA.length; i++) {
    const item = listA[i];
    const rrfScore = 1 / (k + i + 1);
    const existing = scoreMap.get(item.id);
    if (existing) {
      existing.rrfScore += rrfScore;
      existing.sources.push(SOURCE_TYPES.VECTOR);
    } else {
      scoreMap.set(item.id, {
        ...item,
        rrfScore,
        sources: [SOURCE_TYPES.VECTOR],
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
      existing.sources.push(SOURCE_TYPES.FTS);
      existing.convergenceBonus = CONVERGENCE_BONUS;
      existing.rrfScore += CONVERGENCE_BONUS;
    } else {
      scoreMap.set(item.id, {
        ...item,
        rrfScore,
        sources: [SOURCE_TYPES.FTS],
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
  const k = options.k || DEFAULT_K;
  const convergenceBonus = options.convergenceBonus || CONVERGENCE_BONUS;
  const graphWeightBoost = options.graphWeightBoost || GRAPH_WEIGHT_BOOST;

  const scoreMap = new Map<number | string, FusionResult>();

  for (const list of lists) {
    const weight = list.weight || (list.source === SOURCE_TYPES.GRAPH ? graphWeightBoost : 1.0);
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
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);

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
