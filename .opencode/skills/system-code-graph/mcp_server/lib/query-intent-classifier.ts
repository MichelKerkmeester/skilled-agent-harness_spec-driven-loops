// ───────────────────────────────────────────────────────────────
// MODULE: Query Intent Classifier
// ───────────────────────────────────────────────────────────────
// Heuristic pre-classifier for structural code-graph routing.

export type QueryIntent = 'structural';

export interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  structuralScore: number;
  semanticScore: number;
  matchedKeywords: string[];
}

// ── Keyword dictionaries ───────────────────────────────────────

const STRUCTURAL_KEYWORDS = new Set([
  // Relationship queries
  'calls', 'call', 'imports', 'exports', 'extends', 'implements',
  'contains', 'overrides', 'decorates', 'inherits',
  'invoke', 'invokes', 'invoked',
  // Symbol queries (singular + plural)
  'function', 'functions', 'class', 'classes', 'method', 'methods',
  'interface', 'interfaces', 'type', 'types',
  'enum', 'enums', 'variable', 'variables', 'parameter', 'parameters',
  'module', 'modules',
  // Navigation
  'callers', 'callees', 'dependencies', 'dependents',
  'references', 'definition', 'declaration', 'signature', 'signatures',
  // Graph operations
  'neighborhood', 'outline', 'impact', 'graph',
  'edges', 'nodes', 'symbols', 'hierarchy',
  // Structural patterns
  'inheritance', 'call chain', 'import tree', 'export map',
  // F038: Missing inflections
  'import', 'export', 'caller', 'callee', 'decorator',
  'type_alias', 'defined', 'inherit', 'override',
  'superclass', 'subclass',
]);

const STRUCTURAL_PATTERNS = [
  /who\s+calls/i,
  /what\s+(?:calls|imports|exports|extends|implements)/i,
  // F052: "what {functions|classes|...} {call|import|...} X" — allow a noun between "what" and the verb
  /what\s+(?:functions?|classes|methods?|modules?|interfaces?|types?)\s+(?:call|calls|import|imports|extend|extends|implement|implements|override|overrides|reference|references|use|uses|invoke|invokes)/i,
  /(?:show|list|get)\s+(?:callers|callees|dependencies|imports|exports)/i,
  /(?:class|function|method)\s+(?:hierarchy|tree)/i,
  /(?:impact|blast\s+radius)\s+of/i,
  /(?:outline|structure)\s+of/i,
];

// ── Classification logic ───────────────────────────────────────

function tokenize(query: string): string[] {
  return query.toLowerCase().split(/[\s,;:.()\[\]{}'"]+/).filter(Boolean);
}

function countKeywordHits(tokens: string[], keywords: Set<string>): { count: number; matched: string[] } {
  const matched: string[] = [];
  for (const token of tokens) {
    if (keywords.has(token)) matched.push(token);
  }
  // F036: Multi-word phrases with word-boundary matching to avoid false positives
  const lowerQuery = tokens.join(' ');
  for (const kw of keywords) {
    if (kw.includes(' ')) {
      const pattern = new RegExp('\\b' + kw.replace(/\s+/g, '\\s+') + '\\b', 'i');
      if (pattern.test(lowerQuery)) {
        matched.push(kw);
      }
    }
  }
  return { count: matched.length, matched };
}

function countPatternHits(query: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(query)) count++;
  }
  return count;
}

/**
 * Classify a query's intent for structural code-graph routing.
 *
 * The structural skill no longer owns a concept-search backend, so this
 * classifier keeps the response shape stable while returning structural-only
 * verdicts.
 */
export function classifyQueryIntent(query: string): ClassificationResult {
  if (!query?.trim()) {
    return { intent: 'structural', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
  }

  const tokens = tokenize(query);
  const structuralHits = countKeywordHits(tokens, STRUCTURAL_KEYWORDS);
  const structuralPatterns = countPatternHits(query, STRUCTURAL_PATTERNS);

  // Weighted scoring: keywords count 1x, patterns count 2x
  const structuralScore = structuralHits.count + structuralPatterns * 2;
  const semanticScore = 0;
  const total = structuralScore;

  const matchedKeywords = [...structuralHits.matched];

  // No signals at all → structural with low confidence.
  if (total === 0) {
    return { intent: 'structural', confidence: 0.5, structuralScore: 0, semanticScore, matchedKeywords };
  }

  const structuralRatio = structuralScore / total;

  // F037: Confidence depends on BOTH ratio AND absolute count.
  // Single-hit max ~0.60, requires multiple signals to reach 0.95.
  // Formula: 0.5 + ratio * 0.25 + min(total, 5) * 0.05
  const computeConfidence = (ratio: number): number =>
    Math.min(0.95, 0.5 + ratio * 0.25 + Math.min(total, 5) * 0.05);

  return {
    intent: 'structural',
    confidence: computeConfidence(structuralRatio),
    structuralScore,
    semanticScore,
    matchedKeywords,
  };
}
