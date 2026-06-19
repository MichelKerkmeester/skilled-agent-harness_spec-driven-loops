// -------------------------------------------------------------------
// MODULE: Doc Symbol Extractor
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 1. IMPORTS
// -------------------------------------------------------------------

import {
  DEFAULT_EDGE_WEIGHTS,
  generateContentHash,
  generateSymbolId,
} from './indexer-types.js';

import type {
  CodeEdge,
  CodeNode,
  DetectorProvenance,
  EdgeType,
} from './indexer-types.js';

// -------------------------------------------------------------------
// 2. TYPE DEFINITIONS
// -------------------------------------------------------------------

export type DocConfigFormat = 'json' | 'jsonc' | 'yaml' | 'yml' | 'toml';

export interface DocSymbolExtraction {
  nodes: CodeNode[];
  edges: CodeEdge[];
  detectorProvenance: DetectorProvenance;
}

interface DocExtractionOptions {
  filePath?: string;
  contentHash?: string;
  containsWeight?: number;
}

interface KeyLocation {
  line: number;
  column: number;
}

interface KeyEntry {
  path: string[];
  key: string;
  line: number;
  column: number;
}

interface MarkdownHeading {
  level: number;
  text: string;
  startLine: number;
  endLine: number;
  column: number;
}

// -------------------------------------------------------------------
// 3. CONSTANTS
// -------------------------------------------------------------------

const DEFAULT_FILE_PATH = '<doc>';
const MAX_CONFIG_DEPTH = 24;
const JSON_COMMENT_OR_STRING =
  /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\/\/[^\n\r]*|\/\*[\s\S]*?\*\//g;

// -------------------------------------------------------------------
// 4. HELPERS
// -------------------------------------------------------------------

function docEdgeMetadata(detectorProvenance: DetectorProvenance): NonNullable<CodeEdge['metadata']> {
  return {
    confidence: 1,
    detectorProvenance,
    evidenceClass: 'EXTRACTED',
    reason: detectorProvenance === 'regex' ? 'doc-structure-scan' : 'config-key-scan',
    step: 'extract',
  };
}

function normalizeSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]()#]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'untitled';
}

function makeNode(input: {
  filePath: string;
  fqName: string;
  kind: 'heading' | 'key';
  name: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  contentHash: string;
  signature?: string;
}): CodeNode {
  return {
    symbolId: generateSymbolId(input.filePath, input.fqName, input.kind),
    filePath: input.filePath,
    fqName: input.fqName,
    kind: input.kind,
    name: input.name,
    startLine: input.startLine,
    endLine: input.endLine,
    startColumn: input.startColumn,
    endColumn: input.endColumn,
    language: 'doc',
    signature: input.signature,
    contentHash: input.contentHash,
  };
}

function makeContainsEdge(
  sourceId: string,
  targetId: string,
  weight: number,
  detectorProvenance: DetectorProvenance,
): CodeEdge {
  return {
    sourceId,
    targetId,
    edgeType: 'CONTAINS',
    weight,
    metadata: docEdgeMetadata(detectorProvenance),
  };
}

function stripAtxClosingHashes(text: string): string {
  return text.replace(/[ \t]+#+[ \t]*$/, '').trim();
}

function isFenceStart(line: string): { marker: '`' | '~'; length: number } | null {
  const match = line.match(/^\s{0,3}(`{3,}|~{3,})/);
  if (!match) return null;
  return {
    marker: match[1][0] as '`' | '~',
    length: match[1].length,
  };
}

function isFenceEnd(line: string, fence: { marker: '`' | '~'; length: number }): boolean {
  const escapedMarker = fence.marker === '`' ? '`' : '~';
  const match = line.match(new RegExp(`^\\s{0,3}(${escapedMarker}{${fence.length},})`));
  return Boolean(match);
}

function collectMarkdownHeadings(content: string): MarkdownHeading[] {
  const lines = content.split(/\r?\n/);
  const headings: MarkdownHeading[] = [];
  let fence: { marker: '`' | '~'; length: number } | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (fence) {
      if (isFenceEnd(line, fence)) {
        fence = null;
      }
      continue;
    }

    const nextFence = isFenceStart(line);
    if (nextFence) {
      fence = nextFence;
      continue;
    }

    const atx = line.match(/^(\s{0,3})(#{1,6})[ \t]+(.+?)\s*$/);
    if (atx) {
      const text = stripAtxClosingHashes(atx[3]);
      if (text.length > 0) {
        headings.push({
          level: atx[2].length,
          text,
          startLine: index + 1,
          endLine: index + 1,
          column: atx[1].length,
        });
      }
      continue;
    }

    if (index + 1 >= lines.length) continue;
    const nextLine = lines[index + 1];
    if (isFenceStart(nextLine)) continue;
    const setext = nextLine.match(/^\s{0,3}(=+|-+)\s*$/);
    const text = line.trim();
    if (setext && text.length > 0 && !line.match(/^\s{4,}/)) {
      headings.push({
        level: setext[1][0] === '=' ? 1 : 2,
        text,
        startLine: index + 1,
        endLine: index + 2,
        column: line.search(/\S/),
      });
      index += 1;
    }
  }

  return headings;
}

function stripJsonCommentsPreservingStrings(content: string): string {
  return content.replace(JSON_COMMENT_OR_STRING, (match) => {
    if (match.startsWith('//')) return '';
    if (match.startsWith('/*')) return match.replace(/[^\n\r]/g, '');
    return match;
  });
}

function stripTrailingJsonCommas(content: string): string {
  return content.replace(/,\s*([}\]])/g, '$1');
}

function parseJsonConfig(content: string, format: DocConfigFormat): unknown | null {
  try {
    const normalized = format === 'jsonc'
      ? stripTrailingJsonCommas(stripJsonCommentsPreservingStrings(content))
      : content;
    return JSON.parse(normalized) as unknown;
  } catch {
    return null;
  }
}

function findKeyLocation(lines: string[], key: string, startLine: number): KeyLocation {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const quotedKeyPattern = new RegExp(`["']${escaped}["']\\s*:`);
  const bareKeyPattern = new RegExp(`(^|\\s)${escaped}\\s*[:=]`);

  for (let index = Math.max(0, startLine - 1); index < lines.length; index += 1) {
    const quotedMatch = lines[index].match(quotedKeyPattern);
    if (quotedMatch?.index !== undefined) {
      return { line: index + 1, column: quotedMatch.index };
    }
    const bareMatch = lines[index].match(bareKeyPattern);
    if (bareMatch?.index !== undefined) {
      return { line: index + 1, column: bareMatch.index + bareMatch[1].length };
    }
  }

  return { line: Math.max(1, startLine), column: 0 };
}

function collectJsonKeys(
  value: unknown,
  lines: string[],
  path: string[] = [],
  entries: KeyEntry[] = [],
  depth = 0,
  searchFromLine = 1,
): KeyEntry[] {
  if (depth > MAX_CONFIG_DEPTH || value === null || typeof value !== 'object') {
    return entries;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectJsonKeys(item, lines, [...path, `[${index}]`], entries, depth + 1, searchFromLine);
    });
    return entries;
  }

  for (const [key, childValue] of Object.entries(value as Record<string, unknown>)) {
    const location = findKeyLocation(lines, key, searchFromLine);
    const nextPath = [...path, key];
    entries.push({
      path: nextPath,
      key,
      line: location.line,
      column: location.column,
    });
    collectJsonKeys(childValue, lines, nextPath, entries, depth + 1, location.line);
  }

  return entries;
}

function parseYamlKey(rawKey: string): string {
  const key = rawKey.trim();
  if (
    (key.startsWith('"') && key.endsWith('"'))
    || (key.startsWith("'") && key.endsWith("'"))
  ) {
    return key.slice(1, -1);
  }
  return key;
}

function collectYamlKeys(content: string): KeyEntry[] {
  const entries: KeyEntry[] = [];
  const stack: Array<{ indent: number; path: string[] }> = [];
  const lines = content.split(/\r?\n/);
  let blockScalarIndent: number | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (blockScalarIndent !== null) {
      const indent = line.match(/^\s*/)?.[0].length ?? 0;
      if (line.trim().length > 0 && indent > blockScalarIndent) {
        continue;
      }
      blockScalarIndent = null;
    }

    if (/^\s*(#.*)?$/.test(line) || /^\s*(---|\.\.\.)\s*$/.test(line)) {
      continue;
    }

    const match = line.match(/^(\s*)(?:-\s+)?([^:[\]{}#][^:#]*?)\s*:\s*(.*)$/);
    if (!match) continue;

    const indent = match[1].length;
    const key = parseYamlKey(match[2]);
    if (key.length === 0) continue;
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parentPath = stack.length > 0 ? stack[stack.length - 1].path : [];
    const path = [...parentPath, key];
    entries.push({
      path,
      key,
      line: index + 1,
      column: indent + line.slice(indent).indexOf(match[2]),
    });
    stack.push({ indent, path });

    if (match[3].trim() === '|' || match[3].trim() === '>') {
      blockScalarIndent = indent;
    }
  }

  return entries;
}

function stripTomlComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = line[index - 1];
    if (char === "'" && !inDouble) inSingle = !inSingle;
    if (char === '"' && !inSingle && previous !== '\\') inDouble = !inDouble;
    if (char === '#' && !inSingle && !inDouble) return line.slice(0, index);
  }
  return line;
}

function parseTomlPath(value: string): string[] {
  return value
    .split('.')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function collectTomlKeys(content: string): KeyEntry[] {
  const entries: KeyEntry[] = [];
  const seen = new Set<string>();
  const lines = content.split(/\r?\n/);
  let currentTable: string[] = [];

  function addEntry(path: string[], key: string, line: number, column: number): void {
    const pathKey = path.join('.');
    if (seen.has(pathKey)) return;
    seen.add(pathKey);
    entries.push({ path, key, line, column });
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = stripTomlComment(rawLine).trim();
    if (!line) continue;

    const tableMatch = line.match(/^\[\[?([^\]]+)\]\]?$/);
    if (tableMatch) {
      currentTable = parseTomlPath(tableMatch[1]);
      let path: string[] = [];
      for (const part of currentTable) {
        path = [...path, part];
        addEntry(path, part, index + 1, rawLine.indexOf(part));
      }
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_.-]+|"[^"]+"|'[^']+')\s*=/);
    if (!keyMatch) continue;
    const parts = parseTomlPath(keyMatch[1]);
    if (parts.length === 0) continue;
    let path = [...currentTable];
    for (const part of parts) {
      path = [...path, part];
      addEntry(path, part, index + 1, rawLine.indexOf(part));
    }
  }

  return entries;
}

function entriesToExtraction(
  entries: KeyEntry[],
  options: Required<DocExtractionOptions>,
): DocSymbolExtraction {
  const nodes: CodeNode[] = [];
  const edges: CodeEdge[] = [];
  const nodesByPath = new Map<string, CodeNode>();

  for (const entry of entries) {
    const pathKey = entry.path.join('.');
    if (nodesByPath.has(pathKey)) continue;
    const fqName = `key:${pathKey}`;
    const node = makeNode({
      filePath: options.filePath,
      fqName,
      kind: 'key',
      name: entry.key,
      startLine: entry.line,
      endLine: entry.line,
      startColumn: entry.column,
      endColumn: entry.column + entry.key.length,
      contentHash: options.contentHash,
      signature: entry.path.join('.'),
    });
    nodes.push(node);
    nodesByPath.set(pathKey, node);

    if (entry.path.length > 1) {
      const parentPath = entry.path.slice(0, -1).join('.');
      const parent = nodesByPath.get(parentPath);
      if (parent) {
        edges.push(makeContainsEdge(parent.symbolId, node.symbolId, options.containsWeight, 'structured'));
      }
    }
  }

  return { nodes, edges, detectorProvenance: 'structured' };
}

function resolveOptions(content: string, options: DocExtractionOptions): Required<DocExtractionOptions> {
  return {
    filePath: options.filePath ?? DEFAULT_FILE_PATH,
    contentHash: options.contentHash ?? generateContentHash(content),
    containsWeight: options.containsWeight ?? DEFAULT_EDGE_WEIGHTS.CONTAINS,
  };
}

// -------------------------------------------------------------------
// 5. CORE LOGIC
// -------------------------------------------------------------------

/** Extract markdown heading nodes and heading-nesting edges. */
export function extractMarkdownHeadings(
  content: string,
  options: DocExtractionOptions = {},
): DocSymbolExtraction {
  const resolvedOptions = resolveOptions(content, options);
  const headings = collectMarkdownHeadings(content);
  const nodes: CodeNode[] = [];
  const edges: CodeEdge[] = [];
  const stack: Array<CodeNode | null> = [null, null, null, null, null, null, null];
  const seenPaths = new Map<string, number>();

  for (const heading of headings) {
    const parent = stack.slice(1, heading.level).reverse().find((candidate): candidate is CodeNode => Boolean(candidate));
    const parentFqName = parent?.fqName ?? 'heading:root';
    const slugBase = `${parentFqName}/${normalizeSlug(heading.text)}`;
    const occurrence = (seenPaths.get(slugBase) ?? 0) + 1;
    seenPaths.set(slugBase, occurrence);
    const fqName = `${slugBase}#${occurrence}`;
    const node = makeNode({
      filePath: resolvedOptions.filePath,
      fqName,
      kind: 'heading',
      name: heading.text,
      startLine: heading.startLine,
      endLine: heading.endLine,
      startColumn: heading.column,
      endColumn: heading.column + heading.text.length,
      contentHash: resolvedOptions.contentHash,
      signature: '#'.repeat(heading.level),
    });

    nodes.push(node);
    if (parent) {
      edges.push(makeContainsEdge(parent.symbolId, node.symbolId, resolvedOptions.containsWeight, 'regex'));
    }
    stack[heading.level] = node;
    for (let level = heading.level + 1; level < stack.length; level += 1) {
      stack[level] = null;
    }
  }

  return { nodes, edges, detectorProvenance: 'regex' };
}

/** Extract structured config key nodes and nesting edges without executing config. */
export function extractConfigKeys(
  content: string,
  format: DocConfigFormat,
  options: DocExtractionOptions = {},
): DocSymbolExtraction {
  const resolvedOptions = resolveOptions(content, options);
  const lines = content.split(/\r?\n/);

  if (format === 'json' || format === 'jsonc') {
    const parsed = parseJsonConfig(content, format);
    if (parsed === null) {
      return { nodes: [], edges: [], detectorProvenance: 'structured' };
    }
    return entriesToExtraction(collectJsonKeys(parsed, lines), resolvedOptions);
  }

  if (format === 'yaml' || format === 'yml') {
    return entriesToExtraction(collectYamlKeys(content), resolvedOptions);
  }

  return entriesToExtraction(collectTomlKeys(content), resolvedOptions);
}

/** Extract doc symbols for the supported doc extensions. */
export function extractDocSymbols(
  filePath: string,
  content: string,
  edgeWeights?: Partial<Record<EdgeType, number>>,
): DocSymbolExtraction {
  const extension = filePath.split('.').pop()?.toLowerCase();
  const options = {
    filePath,
    contentHash: generateContentHash(content),
    containsWeight: edgeWeights?.CONTAINS ?? DEFAULT_EDGE_WEIGHTS.CONTAINS,
  };

  switch (extension) {
    case 'md':
      return extractMarkdownHeadings(content, options);
    case 'json':
    case 'jsonc':
    case 'yaml':
    case 'yml':
    case 'toml':
      return extractConfigKeys(content, extension, options);
    default:
      return { nodes: [], edges: [], detectorProvenance: 'structured' };
  }
}
