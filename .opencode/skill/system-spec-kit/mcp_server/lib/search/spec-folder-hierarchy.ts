// ─── MODULE: Spec Folder Hierarchy ───
// Builds a spec folder hierarchy from stored spec_folder paths
// and enables hierarchy-aware retrieval (REQ-S6-006).
//
// Parses folder paths like "003-system-spec-kit/140-hybrid-rag/006-sprint-5"
// into a tree structure where each path segment is a node, allowing child
// folders to discover and retrieve memories from parent/sibling folders.

import type Database from 'better-sqlite3';

// ─── 1. TYPES ───

export interface HierarchyNode {
  path: string;
  children: HierarchyNode[];
  parent: string | null;
  memoryCount: number;
}

export interface HierarchyTree {
  roots: HierarchyNode[];
  nodeMap: Map<string, HierarchyNode>;
}

// ─── 2. TREE CONSTRUCTION ───

/**
 * Build a spec folder hierarchy tree from all spec_folder values in the database.
 *
 * Parses folder paths like "003-system-spec-kit/140-hybrid-rag/006-sprint-5"
 * into a tree structure where each path segment is a node.
 */
export function buildHierarchyTree(database: Database.Database): HierarchyTree {
  const rows = (database.prepare(`
    SELECT spec_folder, COUNT(*) as count
    FROM memory_index
    WHERE spec_folder IS NOT NULL AND spec_folder != ''
    GROUP BY spec_folder
  `) as Database.Statement).all() as Array<{ spec_folder: string; count: number }>;

  const nodeMap = new Map<string, HierarchyNode>();
  const roots: HierarchyNode[] = [];

  // First pass: create all nodes (including implicit parent nodes)
  for (const row of rows) {
    const folderPath = row.spec_folder;
    ensureNodeExists(nodeMap, folderPath, row.count);
  }

  // Second pass: link parents and identify roots
  for (const [path, node] of nodeMap) {
    const parentPath = getParentPath(path);
    if (parentPath && nodeMap.has(parentPath)) {
      node.parent = parentPath;
      const parentNode = nodeMap.get(parentPath)!;
      if (!parentNode.children.some(c => c.path === path)) {
        parentNode.children.push(node);
      }
    } else {
      // This is a root node (or orphan — parent not in DB)
      if (!roots.some(r => r.path === path)) {
        roots.push(node);
      }
    }
  }

  return { roots, nodeMap };
}

function ensureNodeExists(
  nodeMap: Map<string, HierarchyNode>,
  folderPath: string,
  memoryCount: number,
): HierarchyNode {
  if (nodeMap.has(folderPath)) {
    const existing = nodeMap.get(folderPath)!;
    existing.memoryCount = Math.max(existing.memoryCount, memoryCount);
    return existing;
  }

  const node: HierarchyNode = {
    path: folderPath,
    children: [],
    parent: null,
    memoryCount,
  };
  nodeMap.set(folderPath, node);

  // Ensure parent chain exists (with 0 memoryCount for implicit parents)
  const parentPath = getParentPath(folderPath);
  if (parentPath) {
    ensureNodeExists(nodeMap, parentPath, 0);
  }

  return node;
}

// ─── 3. PATH UTILITIES ───

/**
 * Get the parent path of a spec folder path.
 * "003-foo/140-bar/006-baz" -> "003-foo/140-bar"
 * "003-foo" -> null (no parent)
 */
export function getParentPath(folderPath: string): string | null {
  const normalized = folderPath.replace(/\/+$/, ''); // strip trailing slash
  if (!normalized) return null;
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash <= 0) return null;
  return normalized.slice(0, lastSlash);
}

/**
 * Get all ancestor folder paths for a given spec folder.
 * "003-foo/140-bar/006-baz" -> ["003-foo/140-bar", "003-foo"]
 */
export function getAncestorPaths(folderPath: string): string[] {
  const ancestors: string[] = [];
  let current = getParentPath(folderPath);
  while (current) {
    ancestors.push(current);
    current = getParentPath(current);
  }
  return ancestors;
}

// ─── 4. TREE TRAVERSAL ───

/**
 * Get all sibling folder paths (same parent) for a given spec folder.
 */
export function getSiblingPaths(
  folderPath: string,
  tree: HierarchyTree,
): string[] {
  const parentPath = getParentPath(folderPath);
  if (!parentPath) return [];

  const parentNode = tree.nodeMap.get(parentPath);
  if (!parentNode) return [];

  return parentNode.children
    .filter(c => c.path !== folderPath)
    .map(c => c.path);
}

/**
 * Get all descendant folder paths for a given spec folder.
 */
export function getDescendantPaths(
  folderPath: string,
  tree: HierarchyTree,
): string[] {
  const node = tree.nodeMap.get(folderPath);
  if (!node) return [];

  const descendants: string[] = [];
  function collect(n: HierarchyNode): void {
    for (const child of n.children) {
      descendants.push(child.path);
      collect(child);
    }
  }
  collect(node);
  return descendants;
}

/**
 * Get related spec folders for hierarchy-aware retrieval.
 * Returns the folder itself + ancestors + siblings, ordered by relevance.
 *
 * Relevance order: self > parent > grandparent > siblings
 */
export function getRelatedFolders(
  folderPath: string,
  tree: HierarchyTree,
): string[] {
  const related: string[] = [folderPath];

  // Add ancestors (parent, grandparent, etc.)
  const ancestors = getAncestorPaths(folderPath);
  related.push(...ancestors);

  // Add siblings
  const siblings = getSiblingPaths(folderPath, tree);
  related.push(...siblings);

  return related;
}

// ─── 5. HIERARCHY-AWARE QUERY ───

/**
 * Query memories from related spec folders using hierarchy traversal.
 * Returns memory IDs from the target folder plus parent/sibling folders.
 */
export function queryHierarchyMemories(
  database: Database.Database,
  specFolder: string,
  limit: number = 50,
): Array<{ id: number; spec_folder: string; title: string | null; relevance: number }> {
  const tree = buildHierarchyTree(database);
  const relatedFolders = getRelatedFolders(specFolder, tree);

  if (relatedFolders.length === 0) return [];

  // Build relevance scoring: self=1.0, parent=0.8, grandparent=0.6, sibling=0.5
  const relevanceMap = new Map<string, number>();
  relevanceMap.set(specFolder, 1.0);

  const ancestors = getAncestorPaths(specFolder);
  ancestors.forEach((a, i) => relevanceMap.set(a, Math.max(0.3, 0.8 - i * 0.2)));

  const siblings = getSiblingPaths(specFolder, tree);
  siblings.forEach(s => relevanceMap.set(s, 0.5));

  const placeholders = relatedFolders.map(() => '?').join(',');
  const rows = (database.prepare(`
    SELECT id, spec_folder, title FROM memory_index
    WHERE spec_folder IN (${placeholders})
      AND parent_id IS NULL
      AND importance_tier != 'deprecated'
    ORDER BY created_at DESC
    LIMIT ?
  `) as Database.Statement).all(...relatedFolders, limit) as Array<{
    id: number;
    spec_folder: string;
    title: string | null;
  }>;

  return rows.map(row => ({
    ...row,
    relevance: relevanceMap.get(row.spec_folder) ?? 0.3,
  })).sort((a, b) => b.relevance - a.relevance);
}
