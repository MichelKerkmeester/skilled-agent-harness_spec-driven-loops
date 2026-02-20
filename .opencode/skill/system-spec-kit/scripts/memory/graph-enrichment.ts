// ---------------------------------------------------------------
// MODULE: Graph Enrichment for Memory Indexing (TASK-204)
//
// Bridges the SGQS graph-builder into the memory indexing pipeline.
// Extracts skill graph metadata (node labels, descriptions, wikilink
// targets) and converts them into trigger phrases and a compact
// graph-context summary for template injection.
//
// Zero changes to retrieval interfaces — purely additive enrichment.
// ---------------------------------------------------------------

import * as fs from 'fs';
import { buildSkillGraph } from '../sgqs/graph-builder';
import type { SkillGraph, GraphNode } from '../sgqs/types';

/* -----------------------------------------------------------------
   INTERFACES
------------------------------------------------------------------*/

export interface GraphEnrichmentResult {
  /** Graph-derived trigger phrases for memory indexing */
  triggerPhrases: string[];
  /** Compact markdown section suitable for template injection */
  graphContext: string;
  /** Total nodes found in graph */
  nodeCount: number;
  /** Total edges found in graph */
  edgeCount: number;
  /** Skill directory names that contained nodes */
  skillsFound: string[];
}

/** Empty result returned when enrichment is skipped or fails (frozen to prevent mutation) */
const EMPTY_RESULT: Readonly<GraphEnrichmentResult> = Object.freeze({
  triggerPhrases: Object.freeze([]) as unknown as string[],
  graphContext: '',
  nodeCount: 0,
  edgeCount: 0,
  skillsFound: Object.freeze([]) as unknown as string[],
});

/* -----------------------------------------------------------------
   TRIGGER PHRASE EXTRACTION
------------------------------------------------------------------*/

/**
 * Extract searchable trigger phrases from a single graph node.
 * Sources: node name, title, description, labels (normalised), skill name.
 */
function extractNodePhrases(node: GraphNode): string[] {
  const phrases: string[] = [];

  const add = (value: unknown): void => {
    if (typeof value === 'string' && value.trim().length >= 3) {
      phrases.push(value.trim().toLowerCase());
    }
  };

  // Node identity
  add(node.skill);

  // Properties that carry semantic meaning
  const { name, title, description, summary } = node.properties as Record<string, unknown>;
  add(name);
  add(title);
  add(description);
  add(summary);

  // Normalise label tokens: ":Node" → "node", ":Entrypoint" → "entrypoint"
  for (const label of node.labels) {
    const token = label.replace(/^:/, '').toLowerCase();
    if (token.length >= 3) {
      phrases.push(token);
    }
  }

  // Decompose hyphenated skill name into individual tokens
  const skillTokens = node.skill
    .split(/[-_]/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length >= 3);
  for (const token of skillTokens) {
    phrases.push(token);
  }

  return phrases;
}

/**
 * Extract wikilink targets from outbound edge IDs.
 * Edge IDs have the shape "{source}--LINKS_TO--{target}".
 * The target segment is used as a trigger phrase.
 */
function extractEdgePhrases(graph: SkillGraph): string[] {
  const phrases: string[] = [];

  for (const edge of graph.edges) {
    if (edge.type !== ':LINKS_TO' && edge.type !== ':REFERENCES') continue;

    // Target node ID has shape "skill-name/path/to/node"
    const parts = edge.target.split('/');
    if (parts.length >= 2) {
      const skillName = parts[0];
      if (skillName.length >= 3) {
        // Add skill name tokens
        for (const token of skillName.split(/[-_]/).filter((t) => t.length >= 3)) {
          phrases.push(token.toLowerCase());
        }
      }
    }

    // Add edge label if present
    if (edge.properties.label && edge.properties.label.trim().length >= 3) {
      phrases.push(edge.properties.label.trim().toLowerCase());
    }
  }

  return phrases;
}

/* -----------------------------------------------------------------
   GRAPH CONTEXT SUMMARY
------------------------------------------------------------------*/

/**
 * Build a compact markdown summary of the skill graph for embedding
 * in the memory file template. Kept intentionally terse to avoid
 * bloating the memory file.
 */
function buildGraphContextSection(
  graph: SkillGraph,
  skillsFound: string[],
): string {
  if (graph.nodes.size === 0) return '';

  // Count nodes per skill and per label type
  const skillNodeCounts = new Map<string, number>();
  const labelCounts = new Map<string, number>();

  for (const [, node] of graph.nodes) {
    // Per-skill count
    const prev = skillNodeCounts.get(node.skill) ?? 0;
    skillNodeCounts.set(node.skill, prev + 1);

    // Per-label count
    for (const label of node.labels) {
      const lPrev = labelCounts.get(label) ?? 0;
      labelCounts.set(label, lPrev + 1);
    }
  }

  const lines: string[] = [
    '## Skill Graph Context',
    '',
    `Nodes: ${graph.nodes.size} | Edges: ${graph.edges.length} | Skills: ${skillsFound.length}`,
    '',
  ];

  // Per-skill node breakdown (sorted alphabetically)
  if (skillsFound.length > 0) {
    lines.push('**Skill breakdown:**');
    for (const skill of [...skillsFound].sort()) {
      const count = skillNodeCounts.get(skill) ?? 0;
      lines.push(`- ${skill}: ${count} node${count !== 1 ? 's' : ''}`);
    }
    lines.push('');
  }

  // Label type distribution
  if (labelCounts.size > 0) {
    const labelSummary = [...labelCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => `${label}(${count})`)
      .join(', ');
    lines.push(`**Node types:** ${labelSummary}`);
    lines.push('');
  }

  return lines.join('\n');
}

/* -----------------------------------------------------------------
   MAIN EXPORT
------------------------------------------------------------------*/

/**
 * Build skill graph and extract metadata for memory enrichment.
 *
 * Reads the skill directory specified by `skillRoot`, builds the
 * in-memory graph, and returns:
 * - Trigger phrases derived from node names, titles, descriptions,
 *   labels, skill names, and wikilink targets.
 * - A compact markdown "Skill Graph Context" section.
 * - Counts and skill list for metadata.
 *
 * If `specFolder` is provided, nodes belonging to a matching skill
 * are weighted first in the phrases list (best-effort heuristic).
 *
 * Falls back gracefully if `skillRoot` does not exist or graph
 * construction fails — always returns a safe EMPTY_RESULT.
 *
 * This function is pure and has no side effects beyond filesystem reads.
 *
 * @param skillRoot - Absolute path to the .opencode/skill/ directory
 * @param specFolder - Optional spec folder name (e.g. "036-skill-graphs")
 *                     used to weight relevant nodes first
 */
export function enrichWithGraphMetadata(
  skillRoot: string,
  specFolder?: string,
): GraphEnrichmentResult {
  // Guard: skill root must exist
  if (!fs.existsSync(skillRoot)) {
    return EMPTY_RESULT;
  }

  let graph: SkillGraph;
  try {
    graph = buildSkillGraph(skillRoot);
  } catch {
    // buildSkillGraph is not expected to throw, but be defensive
    return EMPTY_RESULT;
  }

  if (graph.nodes.size === 0) {
    return EMPTY_RESULT;
  }

  // Collect unique skill names
  const skillSet = new Set<string>();
  for (const [, node] of graph.nodes) {
    if (node.skill) skillSet.add(node.skill);
  }
  const skillsFound = [...skillSet].sort();

  // Determine if we have a relevant skill for the current spec folder
  // Simple heuristic: strip leading digits and match hyphen-separated tokens
  let relevantSkill: string | null = null;
  if (specFolder) {
    const folderBase = specFolder.replace(/^\d{1,3}-/, '').toLowerCase();
    for (const skill of skillsFound) {
      if (skill.toLowerCase().includes(folderBase) ||
          folderBase.includes(skill.toLowerCase())) {
        relevantSkill = skill;
        break;
      }
    }
  }

  // Extract trigger phrases from all nodes
  const allPhrases: string[] = [];
  const relevantPhrases: string[] = [];

  for (const [, node] of graph.nodes) {
    const phrases = extractNodePhrases(node);
    if (relevantSkill && node.skill === relevantSkill) {
      relevantPhrases.push(...phrases);
    } else {
      allPhrases.push(...phrases);
    }
  }

  // Also extract from edge metadata
  allPhrases.push(...extractEdgePhrases(graph));

  // Deduplicate, placing relevant phrases first
  const seen = new Set<string>();
  const finalPhrases: string[] = [];

  for (const phrase of [...relevantPhrases, ...allPhrases]) {
    const normalised = phrase.trim().toLowerCase();
    if (normalised.length >= 3 && !seen.has(normalised)) {
      seen.add(normalised);
      finalPhrases.push(normalised);
    }
  }

  const graphContext = buildGraphContextSection(graph, skillsFound);

  return {
    triggerPhrases: finalPhrases,
    graphContext,
    nodeCount: graph.nodes.size,
    edgeCount: graph.edges.length,
    skillsFound,
  };
}
