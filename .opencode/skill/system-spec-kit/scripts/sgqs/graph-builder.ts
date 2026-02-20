// ---------------------------------------------------------------
// MODULE: SGQS Graph Builder
// Constructs a SkillGraph from the filesystem by scanning skill directories
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { GraphNode, GraphEdge, SkillGraph } from './types';

// ---------------------------------------------------------------
// 1. MAIN ENTRY POINT
// ---------------------------------------------------------------

/**
 * Build a complete SkillGraph by scanning skill directories.
 *
 * @param skillRoot - Absolute path to the skill root directory
 *                    (e.g., "/path/to/.opencode/skill")
 * @returns Complete SkillGraph ready for SGQS query execution
 */
export function buildSkillGraph(skillRoot: string): SkillGraph {
  const graph: SkillGraph = {
    nodes: new Map(),
    edges: [],
    outbound: new Map(),
    inbound: new Map(),
  };

  // Stage 1: Scan filesystem for skill directories
  const skillDirs = scanSkillDirectories(skillRoot);

  for (const skillDir of skillDirs) {
    const skillName = path.basename(skillDir);

    // Create virtual :Skill root node
    const skillNode: GraphNode = {
      id: skillName,
      labels: [':Skill'],
      properties: { name: skillName },
      skill: skillName,
      path: path.relative(path.resolve(skillRoot, '..', '..'), skillDir) + '/',
    };
    graph.nodes.set(skillNode.id, skillNode);

    // Stage 2-3: Scan files, parse frontmatter, extract links
    const files = scanSkillFiles(skillDir);

    for (const filePath of files) {
      const relativePath = path.relative(skillRoot, filePath);
      const content = readFileSafe(filePath);
      if (content === null) continue;

      // Create node from file
      const node = buildNodeFromFile(skillName, relativePath, content, skillRoot);
      if (node) {
        graph.nodes.set(node.id, node);
      }
    }

    // Extract links from all files and create edges
    for (const filePath of files) {
      const relativePath = path.relative(skillRoot, filePath);
      const content = readFileSafe(filePath);
      if (content === null) continue;

      const nodeId = filePathToNodeId(relativePath);
      const sourceNode = graph.nodes.get(nodeId);
      if (!sourceNode) continue;

      const bodyContent = stripFrontmatter(content);
      const edges = extractEdges(sourceNode, bodyContent, skillName, graph);
      for (const edge of edges) {
        addEdge(graph, edge);
      }
    }

    // Stage 4: Generate structural edges
    generateStructuralEdges(graph, skillName);
  }

  // Stage 5: Validate -- remove dangling edges
  removeDanglingEdges(graph);

  return graph;
}

// ---------------------------------------------------------------
// 2. FILESYSTEM SCANNING
// ---------------------------------------------------------------

/** Find all skill directories under the root */
function scanSkillDirectories(skillRoot: string): string[] {
  if (!fs.existsSync(skillRoot)) {
    return [];
  }

  const entries = fs.readdirSync(skillRoot, { withFileTypes: true });
  const dirs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'scripts') {
      dirs.push(path.join(skillRoot, entry.name));
    }
  }

  return dirs;
}

/** Find all .md files in a skill directory */
function scanSkillFiles(skillDir: string): string[] {
  const files: string[] = [];

  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip hidden directories and common non-content dirs
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' &&
            entry.name !== 'scripts' && entry.name !== 'dist') {
          walk(fullPath);
        }
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(skillDir);
  return files;
}

/** Read a file safely, returning null on error */
function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// 3. NODE CONSTRUCTION
// ---------------------------------------------------------------

/** Convert a relative file path to a node ID */
function filePathToNodeId(relativePath: string): string {
  // Remove .md extension and normalize separators
  return relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
}

/** Infer node labels from file location */
function inferLabels(relativePath: string): string[] {
  const parts = relativePath.replace(/\\/g, '/').split('/');
  const filename = parts[parts.length - 1];

  // Check filename-based labels first
  if (filename === 'index.md' && parts.length === 2) {
    return [':Index'];
  }
  if (filename === 'SKILL.md' && parts.length === 2) {
    return [':Entrypoint'];
  }

  // Check directory-based labels
  if (parts.length >= 3) {
    const parentDir = parts[1];
    if (parentDir === 'nodes') return [':Node'];
    if (parentDir === 'references') return [':Reference'];
    if (parentDir === 'assets') return [':Asset'];
  }

  return [':Document'];
}

/** Build a GraphNode from a file */
function buildNodeFromFile(
  skillName: string,
  relativePath: string,
  content: string,
  skillRoot: string,
): GraphNode | null {
  const nodeId = filePathToNodeId(relativePath);
  const labels = inferLabels(relativePath);
  const properties = parseFrontmatter(content);

  // Add computed properties
  properties.skill = skillName;
  properties.path = relativePath;

  // Derive name from filename if not in frontmatter
  if (!properties.name) {
    const parts = relativePath.replace(/\\/g, '/').split('/');
    const filename = parts[parts.length - 1].replace(/\.md$/, '');
    properties.name = filename;
  }

  // Derive type from labels
  if (!properties.type) {
    const label = labels[0].replace(/^:/, '').toLowerCase();
    properties.type = label;
  }

  // Extract title from first heading if not in frontmatter
  if (!properties.title) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      properties.title = titleMatch[1].trim();
    }
  }

  return {
    id: nodeId,
    labels,
    properties,
    skill: skillName,
    path: relativePath,
  };
}

// ---------------------------------------------------------------
// 4. YAML FRONTMATTER PARSING (No external dependencies)
// ---------------------------------------------------------------

/** Strip frontmatter from content, returning only body text */
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (match) {
    return match[2];
  }
  return content;
}

/**
 * Parse YAML frontmatter into a flat property record.
 * Simple regex-based parser -- handles strings, arrays, bare values, numbers.
 */
function parseFrontmatter(content: string): Record<string, string | string[] | number | boolean | null> {
  const properties: Record<string, string | string[] | number | boolean | null> = {};

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return properties;

  const yaml = match[1];
  const lines = yaml.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Match key: value patterns
    const kvMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_\-]*)\s*:\s*(.*)$/);
    if (!kvMatch) continue;

    const key = normalizeKey(kvMatch[1]);
    const rawValue = kvMatch[2].trim();

    properties[key] = parseYamlValue(rawValue);
  }

  return properties;
}

/** Normalize YAML keys: convert kebab-case to camelCase where appropriate */
function normalizeKey(key: string): string {
  // Special mappings
  const keyMap: Record<string, string> = {
    'allowed-tools': 'tools',
    'argument-hint': 'argumentHint',
  };
  if (keyMap[key]) return keyMap[key];
  return key;
}

/** Parse a single YAML value */
function parseYamlValue(raw: string): string | string[] | number | boolean | null {
  if (!raw || raw === '~' || raw === 'null') return null;

  // Boolean
  if (raw === 'true' || raw === 'True' || raw === 'TRUE') return true;
  if (raw === 'false' || raw === 'False' || raw === 'FALSE') return false;

  // Array: [item1, item2, ...]
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1);
    if (!inner.trim()) return [];
    return inner.split(',').map(s => {
      const trimmed = s.trim();
      // Strip quotes
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
          (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
      }
      return trimmed;
    });
  }

  // Quoted string
  if ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }

  // Number
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    const num = parseFloat(raw);
    if (Number.isInteger(num)) return num;
    return num;
  }

  // Bare string
  return raw;
}

// ---------------------------------------------------------------
// 5. LINK EXTRACTION
// ---------------------------------------------------------------

/** Regex for wikilinks: [[target]] or [[target|label]] */
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/** Regex for standard markdown links to local .md files */
const MDLINK_RE = /\[([^\]]+)\]\((\.[^)]+\.md)\)/g;

/**
 * Extract edges from file body content.
 * Creates LINKS_TO, CONTAINS, REFERENCES, and DEPENDS_ON edges.
 */
function extractEdges(
  sourceNode: GraphNode,
  bodyContent: string,
  skillName: string,
  graph: SkillGraph,
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seenEdgeIds = new Set<string>();

  // Extract wikilinks
  let match: RegExpExecArray | null;
  const wikiRe = new RegExp(WIKILINK_RE.source, 'g');

  while ((match = wikiRe.exec(bodyContent)) !== null) {
    const targetPath = match[1].trim();
    const displayLabel = match[2]?.trim() || '';

    // Resolve target: wikilinks are relative to current skill
    const targetId = resolveWikilinkTarget(targetPath, skillName);

    // Create LINKS_TO edge
    const linksToId = `${sourceNode.id}--LINKS_TO--${targetId}`;
    if (!seenEdgeIds.has(linksToId)) {
      seenEdgeIds.add(linksToId);
      const edgeProps: Record<string, string> = {};
      if (displayLabel) edgeProps.label = displayLabel;
      edges.push({
        id: linksToId,
        type: ':LINKS_TO',
        source: sourceNode.id,
        target: targetId,
        properties: edgeProps,
      });
    }

    // CONTAINS: if source is Index and target is in nodes/
    if (sourceNode.labels.includes(':Index') && targetPath.startsWith('nodes/')) {
      const containsId = `${sourceNode.id}--CONTAINS--${targetId}`;
      if (!seenEdgeIds.has(containsId)) {
        seenEdgeIds.add(containsId);
        edges.push({
          id: containsId,
          type: ':CONTAINS',
          source: sourceNode.id,
          target: targetId,
          properties: displayLabel ? { label: displayLabel } : {},
        });
      }
    }

    // DEPENDS_ON: if target crosses skill boundary
    const targetSkill = targetId.split('/')[0];
    if (targetSkill !== skillName) {
      const dependsId = `${sourceNode.id}--DEPENDS_ON--${targetId}`;
      if (!seenEdgeIds.has(dependsId)) {
        seenEdgeIds.add(dependsId);
        edges.push({
          id: dependsId,
          type: ':DEPENDS_ON',
          source: sourceNode.id,
          target: targetId,
          properties: displayLabel ? { label: displayLabel } : {},
        });
      }
    }
  }

  // Extract standard markdown links
  const mdRe = new RegExp(MDLINK_RE.source, 'g');

  while ((match = mdRe.exec(bodyContent)) !== null) {
    const displayText = match[1].trim();
    const relativePath = match[2].trim();

    // Resolve relative path from source file location
    const targetId = resolveMarkdownLinkTarget(relativePath, sourceNode, skillName);
    if (!targetId) continue;

    // Create REFERENCES edge
    const refsId = `${sourceNode.id}--REFERENCES--${targetId}`;
    if (!seenEdgeIds.has(refsId)) {
      seenEdgeIds.add(refsId);
      edges.push({
        id: refsId,
        type: ':REFERENCES',
        source: sourceNode.id,
        target: targetId,
        properties: { label: displayText },
      });
    }

    // DEPENDS_ON for cross-skill markdown links
    const targetSkill = targetId.split('/')[0];
    if (targetSkill !== skillName) {
      const dependsId = `${sourceNode.id}--DEPENDS_ON--${targetId}`;
      if (!seenEdgeIds.has(dependsId)) {
        seenEdgeIds.add(dependsId);
        edges.push({
          id: dependsId,
          type: ':DEPENDS_ON',
          source: sourceNode.id,
          target: targetId,
          properties: { label: displayText },
        });
      }
    }
  }

  return edges;
}

/** Resolve a wikilink target path to a full node ID */
function resolveWikilinkTarget(targetPath: string, skillName: string): string {
  // If target already includes a skill prefix (contains /), check if it crosses skills
  // Wikilinks are relative to current skill directory
  const cleaned = targetPath.replace(/\.md$/, '');
  if (cleaned.includes('/') && !cleaned.startsWith('nodes/') &&
      !cleaned.startsWith('references/') && !cleaned.startsWith('assets/')) {
    // Might be a cross-skill reference like "other-skill/nodes/foo"
    return cleaned;
  }
  return `${skillName}/${cleaned}`;
}

/** Resolve a markdown link relative path to a node ID */
function resolveMarkdownLinkTarget(
  relativePath: string,
  sourceNode: GraphNode,
  skillName: string,
): string | null {
  // Remove .md extension
  let cleaned = relativePath.replace(/\.md$/, '');

  // Handle relative paths
  if (cleaned.startsWith('./')) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('../')) {
    // Cross-skill reference: ../other-skill/file
    const parts = cleaned.split('/');
    // Remove leading '..' segments
    const upCount = parts.filter(p => p === '..').length;
    const remaining = parts.slice(upCount);

    if (remaining.length >= 1) {
      return remaining.join('/');
    }
    return null;
  }

  // Same-skill relative path
  // Determine source directory context
  const sourceParts = sourceNode.path.replace(/\\/g, '/').split('/');
  // The source path is like "skill-name/nodes/file.md" or "skill-name/SKILL.md"
  if (sourceParts.length >= 2) {
    // If source is at skill root (SKILL.md, index.md), resolve from skill root
    if (sourceParts.length === 2) {
      return `${skillName}/${cleaned}`;
    }
    // If source is in a subdirectory, resolve from that directory
    const sourceDir = sourceParts.slice(0, -1).join('/');
    // But sourceDir already includes skillName, so use it directly
    return `${sourceDir}/${cleaned}`.replace(/\\/g, '/');
  }

  return `${skillName}/${cleaned}`;
}

// ---------------------------------------------------------------
// 6. STRUCTURAL EDGES
// ---------------------------------------------------------------

/** Generate HAS_ENTRYPOINT and HAS_INDEX edges for a skill */
function generateStructuralEdges(graph: SkillGraph, skillName: string): void {
  // HAS_ENTRYPOINT
  const entrypointId = `${skillName}/SKILL`;
  if (graph.nodes.has(entrypointId)) {
    addEdge(graph, {
      id: `${skillName}--HAS_ENTRYPOINT--${entrypointId}`,
      type: ':HAS_ENTRYPOINT',
      source: skillName,
      target: entrypointId,
      properties: {},
    });
  }

  // HAS_INDEX
  const indexId = `${skillName}/index`;
  if (graph.nodes.has(indexId)) {
    addEdge(graph, {
      id: `${skillName}--HAS_INDEX--${indexId}`,
      type: ':HAS_INDEX',
      source: skillName,
      target: indexId,
      properties: {},
    });
  }
}

// ---------------------------------------------------------------
// 7. GRAPH UTILITIES
// ---------------------------------------------------------------

/** Add an edge to the graph and update adjacency indexes */
function addEdge(graph: SkillGraph, edge: GraphEdge): void {
  // Deduplicate by edge ID
  const existing = graph.edges.find(e => e.id === edge.id);
  if (existing) return;

  graph.edges.push(edge);

  // Update outbound index
  if (!graph.outbound.has(edge.source)) {
    graph.outbound.set(edge.source, []);
  }
  graph.outbound.get(edge.source)!.push(edge.id);

  // Update inbound index
  if (!graph.inbound.has(edge.target)) {
    graph.inbound.set(edge.target, []);
  }
  graph.inbound.get(edge.target)!.push(edge.id);
}

/** Remove edges whose source or target nodes don't exist in the graph */
function removeDanglingEdges(graph: SkillGraph): void {
  const validEdges: GraphEdge[] = [];

  for (const edge of graph.edges) {
    if (graph.nodes.has(edge.source) && graph.nodes.has(edge.target)) {
      validEdges.push(edge);
    }
  }

  // Rebuild if we removed any edges
  if (validEdges.length !== graph.edges.length) {
    graph.edges = validEdges;

    // Rebuild adjacency indexes
    graph.outbound.clear();
    graph.inbound.clear();

    for (const edge of graph.edges) {
      if (!graph.outbound.has(edge.source)) {
        graph.outbound.set(edge.source, []);
      }
      graph.outbound.get(edge.source)!.push(edge.id);

      if (!graph.inbound.has(edge.target)) {
        graph.inbound.set(edge.target, []);
      }
      graph.inbound.get(edge.target)!.push(edge.id);
    }
  }
}
