// ───────────────────────────────────────────────────────────────
// MODULE: Query Intent Classifier
// ───────────────────────────────────────────────────────────────
// Heuristic pre-classifier for structural code-graph routing.

export type QueryIntent = 'structural';
export type QueryExpansionClass = 'single_hop' | 'multi_hop' | 'entity' | 'ambiguous';
export type QueryModeHint = 'neighborhood' | 'outline' | 'impact';

export interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  structuralScore: number;
  semanticScore: number;
  matchedKeywords: string[];
  queryClass: QueryExpansionClass;
  seededPprEligible: boolean;
}

export interface QueryExpansionClassification {
  queryClass: QueryExpansionClass;
  confidence: number;
  seededPprEligible: boolean;
  matchedSignals: string[];
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
  // Missing inflections
  'import', 'export', 'caller', 'callee', 'decorator',
  'type_alias', 'defined', 'inherit', 'override',
  'superclass', 'subclass',
]);

const STRUCTURAL_PATTERNS = [
  /who\s+calls/i,
  /what\s+(?:calls|imports|exports|extends|implements)/i,
  // "what {functions|classes|...} {call|import|...} X" — allow a noun between "what" and the verb
  /what\s+(?:functions?|classes|methods?|modules?|interfaces?|types?)\s+(?:call|calls|import|imports|extend|extends|implement|implements|override|overrides|reference|references|use|uses|invoke|invokes)/i,
  /(?:show|list|get)\s+(?:callers|callees|dependencies|imports|exports)/i,
  /(?:class|function|method)\s+(?:hierarchy|tree)/i,
  /(?:impact|blast\s+radius)\s+of/i,
  /(?:outline|structure)\s+of/i,
];

const SINGLE_HOP_PATTERNS = [
  /\bwho\s+calls\b/i,
  /\bshow\s+(?:direct\s+)?(?:callers|callees|imports|exports)\b/i,
  /\blist\s+(?:direct\s+)?(?:callers|callees|imports|exports)\b/i,
  /\b(?:outline|structure|definition|declaration|signature|neighborhood)\s+of\b/i,
  /\bdirect\s+(?:callers|callees|imports|exports|references|dependencies)\b/i,
];

const MULTI_HOP_PATTERNS = [
  /\bimpact\s+of\b/i,
  /\bblast\s+radius\b/i,
  /\bcall\s+chain\b/i,
  /\b(?:transitive|recursive|multi[-\s]?hop)\b/i,
  /\b(?:upstream|downstream)\s+(?:impact|dependencies|dependents)\b/i,
  /\bwhat\s+(?:breaks|is\s+affected)\b/i,
];

const ENTITY_PATTERNS = [
  /\b(?:symbol|entity|function|method|class|module|file)\b.*\b(?:impact|blast\s+radius|dependents|references)\b/i,
  /\b(?:impact|blast\s+radius|dependents|references)\b.*\b(?:symbol|entity|function|method|class|module|file)\b/i,
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
  // Multi-word phrases with word-boundary matching to avoid false positives
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

function expansionFromMode(mode: QueryModeHint | undefined): QueryExpansionClassification | null {
  if (mode === 'impact') {
    return {
      queryClass: 'multi_hop',
      confidence: 0.95,
      seededPprEligible: true,
      matchedSignals: ['mode:impact'],
    };
  }
  if (mode === 'neighborhood' || mode === 'outline') {
    return {
      queryClass: 'single_hop',
      confidence: 0.95,
      seededPprEligible: false,
      matchedSignals: [`mode:${mode}`],
    };
  }
  return null;
}

export function classifyQueryExpansion(
  query: string,
  mode?: QueryModeHint,
): QueryExpansionClassification {
  const modeClassification = expansionFromMode(mode);
  if (modeClassification) {
    return modeClassification;
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return {
      queryClass: 'ambiguous',
      confidence: 0.5,
      seededPprEligible: false,
      matchedSignals: [],
    };
  }

  const entityHits = countPatternHits(trimmed, ENTITY_PATTERNS);
  if (entityHits > 0) {
    return {
      queryClass: 'entity',
      confidence: Math.min(0.95, 0.7 + entityHits * 0.1),
      seededPprEligible: true,
      matchedSignals: ['entity'],
    };
  }

  const multiHopHits = countPatternHits(trimmed, MULTI_HOP_PATTERNS);
  const singleHopHits = countPatternHits(trimmed, SINGLE_HOP_PATTERNS);
  if (multiHopHits > singleHopHits) {
    return {
      queryClass: 'multi_hop',
      confidence: Math.min(0.95, 0.65 + multiHopHits * 0.1),
      seededPprEligible: true,
      matchedSignals: ['multi-hop'],
    };
  }
  if (singleHopHits > multiHopHits) {
    return {
      queryClass: 'single_hop',
      confidence: Math.min(0.95, 0.65 + singleHopHits * 0.1),
      seededPprEligible: false,
      matchedSignals: ['single-hop'],
    };
  }

  return {
    queryClass: 'ambiguous',
    confidence: 0.5,
    seededPprEligible: false,
    matchedSignals: [],
  };
}

/**
 * Classify a query's intent for structural code-graph routing.
 *
 * The structural skill no longer owns a concept-search backend, so this
 * classifier keeps the response shape stable while returning structural-only
 * verdicts.
 */
export function classifyQueryIntent(query: string): ClassificationResult {
  const expansion = classifyQueryExpansion(query);
  if (!query?.trim()) {
    return {
      intent: 'structural',
      confidence: 0.5,
      structuralScore: 0,
      semanticScore: 0,
      matchedKeywords: [],
      queryClass: expansion.queryClass,
      seededPprEligible: expansion.seededPprEligible,
    };
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
    return {
      intent: 'structural',
      confidence: 0.5,
      structuralScore: 0,
      semanticScore,
      matchedKeywords,
      queryClass: expansion.queryClass,
      seededPprEligible: expansion.seededPprEligible,
    };
  }

  const structuralRatio = structuralScore / total;

  // Confidence depends on BOTH ratio AND absolute count.
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
    queryClass: expansion.queryClass,
    seededPprEligible: expansion.seededPprEligible,
  };
}
