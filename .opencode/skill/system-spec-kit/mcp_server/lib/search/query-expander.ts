// ---------------------------------------------------------------
// MODULE: Query Expander (C138-P3)
// Rule-based synonym expansion for mode="deep" multi-query RAG.
// No LLM calls — purely rule-based template substitution.
// T010: Semantic Bridge Discovery via SGQS skill graph wikilinks.
// ---------------------------------------------------------------

// Local interfaces matching SGQS types to avoid rootDir import issues
interface GraphNodeLike {
  id: string;
  properties: Record<string, string | string[] | number | boolean | null>;
}
interface GraphEdgeLike {
  source: string;
  target: string;
}
interface SkillGraphLike {
  nodes: Map<string, GraphNodeLike>;
  edges: GraphEdgeLike[];
}

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

const MAX_VARIANTS = 3;

/**
 * Domain vocabulary map for server-side synonym expansion.
 * No LLM calls — purely rule-based template substitution.
 */
export const DOMAIN_VOCABULARY_MAP: Record<string, string[]> = {
  // Auth domain
  login: ['authentication', 'sign-in'],
  auth: ['authentication', 'authorization'],
  password: ['credential', 'secret'],
  token: ['jwt', 'session-key'],
  // Error domain
  error: ['exception', 'failure'],
  bug: ['defect', 'issue'],
  crash: ['fatal-error', 'unhandled-exception'],
  fix: ['patch', 'resolve'],
  // Architecture domain
  api: ['endpoint', 'route'],
  database: ['db', 'datastore'],
  cache: ['memoize', 'store'],
  deploy: ['release', 'ship'],
  // Code domain
  refactor: ['restructure', 'clean-up'],
  test: ['spec', 'assertion'],
  config: ['configuration', 'settings'],
};

/* ---------------------------------------------------------------
   2. CORE FUNCTION
   --------------------------------------------------------------- */

/**
 * Expand a query into multiple search variants using synonym maps.
 *
 * - Original query is always included as the first variant.
 * - Splits compound terms via word boundary matching.
 * - Looks up synonyms from `DOMAIN_VOCABULARY_MAP` (case-insensitive).
 * - Returns at most `MAX_VARIANTS` (3) strings.
 *
 * @param query - The input search query string.
 * @returns Array of query variants, original first, max 3 total.
 */
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().match(/\b\w+\b/g) || [];
  const variants: Set<string> = new Set([query]);

  for (const word of words) {
    if (variants.size >= MAX_VARIANTS) break;
    const synonyms = DOMAIN_VOCABULARY_MAP[word];
    if (synonyms && synonyms.length > 0) {
      // Replace the matched word with its first synonym (case-insensitive)
      const expanded = query.replace(new RegExp(`\\b${word}\\b`, 'i'), synonyms[0]);
      variants.add(expanded);
    }
  }

  return Array.from(variants).slice(0, MAX_VARIANTS);
}

/* ---------------------------------------------------------------
   3. SEMANTIC BRIDGE DISCOVERY (T010 — Pattern 4)
   --------------------------------------------------------------- */

/**
 * Extract wikilink-derived synonyms from an SGQS skill graph.
 * Builds a map where each node name maps to the names of directly
 * connected nodes (via edges). These serve as curated synonyms
 * that bridge vocabulary mismatch between user queries and spec
 * terminology.
 *
 * @param graph - A resolved SkillGraph from the cache
 * @returns Map of lowercase node name → array of adjacent node names
 */
export function buildSemanticBridgeMap(
  graph: SkillGraphLike
): Map<string, string[]> {
  const bridgeMap = new Map<string, string[]>();

  for (const [, node] of graph.nodes) {
    const nodeName = getNodeName(node);
    if (!nodeName) continue;
    const key = nodeName.toLowerCase();

    // Find adjacent node names via edges (edges is an array, not a Map)
    const neighbors: string[] = [];
    for (const edge of graph.edges) {
      let neighborId: string | null = null;
      if (edge.source === node.id) neighborId = edge.target;
      else if (edge.target === node.id) neighborId = edge.source;

      if (neighborId) {
        const neighbor = graph.nodes.get(neighborId);
        if (neighbor) {
          const neighborName = getNodeName(neighbor);
          if (neighborName && neighborName.toLowerCase() !== key) {
            neighbors.push(neighborName.toLowerCase());
          }
        }
      }
    }

    if (neighbors.length > 0) {
      bridgeMap.set(key, neighbors);
    }
  }

  return bridgeMap;
}

/**
 * Expand query using semantic bridges from the skill graph.
 * When a query word matches a node name in the bridge map,
 * adjacent node names are added as synonym expansions.
 *
 * @param query - The input search query
 * @param bridgeMap - Map from buildSemanticBridgeMap()
 * @returns Array of expanded query variants (original first, max 3)
 */
export function expandQueryWithBridges(
  query: string,
  bridgeMap: Map<string, string[]>
): string[] {
  const words = query.toLowerCase().match(/\b\w[\w-]*\b/g) || [];
  const variants: Set<string> = new Set([query]);

  for (const word of words) {
    if (variants.size >= MAX_VARIANTS) break;
    const bridges = bridgeMap.get(word);
    if (bridges && bridges.length > 0) {
      // Replace the matched word with its first bridge synonym
      const expanded = query.replace(
        new RegExp(`\\b${word}\\b`, 'i'),
        bridges[0]
      );
      variants.add(expanded);
    }
  }

  return Array.from(variants).slice(0, MAX_VARIANTS);
}

function getNodeName(node: GraphNodeLike): string | null {
  if (typeof node.properties['name'] === 'string') return node.properties['name'];
  return node.id || null;
}
