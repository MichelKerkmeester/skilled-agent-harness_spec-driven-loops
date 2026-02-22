// ---------------------------------------------------------------
// MODULE: Frontmatter Migration Utilities
// ---------------------------------------------------------------
// Shared helpers for safe markdown frontmatter normalization.

import * as path from 'path';

/* -----------------------------------------------------------------
   1. TYPES
------------------------------------------------------------------*/

export type FrontmatterValue = string | string[];

export interface FrontmatterSection {
  key: string;
  lines: string[];
}

export interface FrontmatterDetection {
  found: boolean;
  start: number;
  end: number;
  sections: FrontmatterSection[];
  rawBlock: string;
}

export type DocumentKind = 'template' | 'memory' | 'spec_doc' | 'unknown';

export interface ClassifiedDocument {
  kind: DocumentKind;
  documentType: string;
  filePath: string;
  fileName: string;
  fileStem: string;
  specLeaf: string | null;
  templateRelativePath: string | null;
  suffix: string;
}

export interface ManagedFrontmatter {
  title: string;
  description?: string;
  trigger_phrases?: string[];
  importance_tier: string;
  contextType: string;
  importanceTierAlias?: string;
}

export interface BuildFrontmatterOptions {
  templatesRoot: string;
  maxTitleLength?: number;
}

export interface BuildFrontmatterResult {
  changed: boolean;
  content: string;
  classification: ClassifiedDocument;
  managed: ManagedFrontmatter;
  hadFrontmatter: boolean;
}

/* -----------------------------------------------------------------
   2. CONSTANTS
------------------------------------------------------------------*/

const GENERIC_TITLES = new Set([
  'session summary',
  'session context',
  'context summary',
  'memory summary',
  'conversation summary',
  'summary',
  'untitled',
]);

const VALID_IMPORTANCE_TIERS = new Set([
  'constitutional',
  'critical',
  'important',
  'normal',
  'temporary',
  'deprecated',
]);

const VALID_CONTEXT_TYPES = new Set([
  'implementation',
  'research',
  'decision',
  'discovery',
  'general',
]);

const SPEC_DOC_BASENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'research.md',
  'handover.md',
]);

const DOC_DEFAULT_IMPORTANCE: Record<string, string> = {
  spec: 'important',
  plan: 'important',
  tasks: 'normal',
  checklist: 'normal',
  decision_record: 'important',
  implementation_summary: 'normal',
  research: 'normal',
  handover: 'normal',
  template: 'normal',
  memory: 'normal',
  unknown: 'normal',
};

const DOC_DEFAULT_CONTEXT: Record<string, string> = {
  spec: 'decision',
  plan: 'decision',
  tasks: 'implementation',
  checklist: 'implementation',
  decision_record: 'decision',
  implementation_summary: 'implementation',
  research: 'research',
  handover: 'general',
  template: 'general',
  memory: 'general',
  unknown: 'general',
};

const TITLE_MAX_LENGTH = 120;

/* -----------------------------------------------------------------
   3. BASIC HELPERS
------------------------------------------------------------------*/

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function lower(value: string): string {
  return value.toLowerCase().trim();
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return trimmed;
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function normalizeTitleCandidate(raw: string): string | null {
  if (!raw) {
    return null;
  }

  const cleaned = raw
    .replace(/`+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');

  if (!cleaned) {
    return null;
  }

  return cleaned;
}

function isGenericTitle(rawTitle: string): boolean {
  const normalized = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return GENERIC_TITLES.has(normalized);
}

function truncateWithSuffix(base: string, suffix: string, maxLength: number): string {
  const normalizedBase = normalizeTitleCandidate(base) || 'Untitled';
  const normalizedSuffix = suffix.trim();

  if (!normalizedSuffix) {
    if (normalizedBase.length <= maxLength) {
      return normalizedBase;
    }
    const truncated = normalizedBase.slice(0, maxLength).trim();
    return `${truncated}...`;
  }

  const required = normalizedSuffix.length + 1;
  if (required >= maxLength) {
    return normalizedSuffix.slice(0, maxLength);
  }

  const allowedBaseLength = maxLength - required;
  let outBase = normalizedBase;

  if (outBase.length > allowedBaseLength) {
    const hardCut = outBase.slice(0, allowedBaseLength).trim();
    const lastSpace = hardCut.lastIndexOf(' ');
    if (lastSpace >= Math.floor(allowedBaseLength * 0.6)) {
      outBase = hardCut.slice(0, lastSpace).trim();
    } else {
      outBase = hardCut;
    }
  }

  return `${outBase} ${normalizedSuffix}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function dedupeStrings(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(value.trim());
  }
  return out;
}

/* -----------------------------------------------------------------
   4. FRONTMATTER DETECTION + PARSING
------------------------------------------------------------------*/

function skipLeadingCommentsAndWhitespace(content: string): number {
  let index = 0;

  if (content.charCodeAt(0) === 0xfeff) {
    index = 1;
  }

  const nextLineIndex = (from: number): number => {
    const lineEnd = content.indexOf('\n', from);
    if (lineEnd === -1) {
      return content.length;
    }
    return lineEnd + 1;
  };

  while (index < content.length) {
    const lineEnd = content.indexOf('\n', index);
    const line = (lineEnd === -1 ? content.slice(index) : content.slice(index, lineEnd)).replace(/\r$/, '');

    if (line.trim() === '') {
      index = nextLineIndex(index);
      continue;
    }

    if (content.startsWith('<!--', index)) {
      const endComment = content.indexOf('-->', index + 4);
      if (endComment === -1) {
        break;
      }
      index = endComment + 3;
      while (index < content.length && (content[index] === ' ' || content[index] === '\t')) {
        index += 1;
      }
      if (content[index] === '\r' && content[index + 1] === '\n') {
        index += 2;
      } else if (content[index] === '\n') {
        index += 1;
      }
      continue;
    }

    break;
  }

  return index;
}

function isLikelyYamlFrontmatter(block: string): boolean {
  const lines = block.replace(/\r/g, '').split('\n');
  if (lines.length === 0 || lines.length > 120) {
    return false;
  }

  let topLevelCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      return false;
    }

    if (/^\|/.test(trimmed) || /^```/.test(trimmed) || /^<!--/.test(trimmed)) {
      return false;
    }

    if (/^#/.test(trimmed)) {
      continue;
    }

    if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(trimmed)) {
      topLevelCount += 1;
      continue;
    }

    if (/^\s*-\s+/.test(line) || /^\s{2,}\S+/.test(line)) {
      continue;
    }

    return false;
  }

  return topLevelCount > 0;
}

export function detectFrontmatter(content: string): FrontmatterDetection {
  if (!content) {
    return { found: false, start: -1, end: -1, sections: [], rawBlock: '' };
  }

  const start = skipLeadingCommentsAndWhitespace(content);

  const firstLineEnd = content.indexOf('\n', start);
  if (firstLineEnd === -1) {
    return { found: false, start: -1, end: -1, sections: [], rawBlock: '' };
  }

  const firstLine = content.slice(start, firstLineEnd).replace(/\r$/, '').trim();
  if (firstLine !== '---') {
    return { found: false, start: -1, end: -1, sections: [], rawBlock: '' };
  }

  const closingRegex = /^---\s*$/gm;
  closingRegex.lastIndex = firstLineEnd + 1;
  const closingMatch = closingRegex.exec(content);
  if (!closingMatch) {
    return { found: false, start: -1, end: -1, sections: [], rawBlock: '' };
  }

  const blockStart = firstLineEnd + 1;
  const blockEnd = closingMatch.index;
  const rawBlock = content.slice(blockStart, blockEnd);

  if (!isLikelyYamlFrontmatter(rawBlock)) {
    return { found: false, start: -1, end: -1, sections: [], rawBlock: '' };
  }

  let end = closingMatch.index + closingMatch[0].length;
  if (content[end] === '\r' && content[end + 1] === '\n') {
    end += 2;
  } else if (content[end] === '\n') {
    end += 1;
  }

  return {
    found: true,
    start,
    end,
    sections: parseFrontmatterSections(rawBlock),
    rawBlock,
  };
}

export function parseFrontmatterSections(rawBlock: string): FrontmatterSection[] {
  const lines = rawBlock.replace(/\r/g, '').split('\n');
  const sections: FrontmatterSection[] = [];

  let current: FrontmatterSection | null = null;

  for (const line of lines) {
    const topLevel = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (topLevel) {
      if (current) {
        sections.push(current);
      }
      current = {
        key: topLevel[1],
        lines: [line],
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

function parseInlineArray(value: string): string[] {
  const inner = value.trim().slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  return inner
    .split(',')
    .map((part) => stripWrappingQuotes(part.trim()))
    .filter((part) => part.length > 0);
}

export function parseSectionValue(section: FrontmatterSection): FrontmatterValue | undefined {
  if (!section.lines.length) {
    return undefined;
  }

  const firstLine = section.lines[0];
  const match = firstLine.match(/^[A-Za-z_][A-Za-z0-9_-]*\s*:\s*(.*)$/);
  if (!match) {
    return undefined;
  }

  const firstValue = match[1].trim();

  if (firstValue.startsWith('[') && firstValue.endsWith(']')) {
    return parseInlineArray(firstValue);
  }

  if (firstValue.length > 0) {
    return stripWrappingQuotes(firstValue);
  }

  const listValues: string[] = [];
  let allList = section.lines.length > 1;

  for (const line of section.lines.slice(1)) {
    if (!line.trim()) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (!listMatch) {
      allList = false;
      break;
    }

    listValues.push(stripWrappingQuotes(listMatch[1].trim()));
  }

  if (allList && listValues.length > 0) {
    return listValues;
  }

  return undefined;
}

function sectionToLines(key: string, value: FrontmatterValue): string[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [`${key}: []`];
    }

    return [
      `${key}:`,
      ...value.map((entry) => `  - "${escapeYamlString(entry)}"`),
    ];
  }

  return [`${key}: "${escapeYamlString(value)}"`];
}

/* -----------------------------------------------------------------
   5. CLASSIFICATION + INFERENCE
------------------------------------------------------------------*/

function mapSpecDocType(fileName: string): string {
  switch (fileName) {
    case 'spec.md':
      return 'spec';
    case 'plan.md':
      return 'plan';
    case 'tasks.md':
      return 'tasks';
    case 'checklist.md':
      return 'checklist';
    case 'decision-record.md':
      return 'decision_record';
    case 'implementation-summary.md':
      return 'implementation_summary';
    case 'research.md':
      return 'research';
    case 'handover.md':
      return 'handover';
    default:
      return 'unknown';
  }
}

export function classifyDocument(filePath: string, templatesRoot: string): ClassifiedDocument {
  const normalized = normalizePath(filePath);
  const normalizedTemplatesRoot = normalizePath(templatesRoot).replace(/\/+$/, '');

  const fileName = path.basename(normalized).toLowerCase();
  const fileStem = path.basename(normalized, path.extname(normalized));

  if (normalized.startsWith(`${normalizedTemplatesRoot}/`) || normalized === normalizedTemplatesRoot) {
    const relative = normalized
      .replace(`${normalizedTemplatesRoot}/`, '')
      .replace(/^\/+/, '');

    return {
      kind: 'template',
      documentType: 'template',
      filePath,
      fileName,
      fileStem,
      specLeaf: null,
      templateRelativePath: relative || fileName,
      suffix: `[template:${relative || fileName}]`,
    };
  }

  if (/\/memory\/[^/]+\.md$/i.test(normalized)) {
    const specFolderDir = path.dirname(path.dirname(normalized));
    const specLeaf = path.basename(specFolderDir);
    return {
      kind: 'memory',
      documentType: 'memory',
      filePath,
      fileName,
      fileStem,
      specLeaf,
      templateRelativePath: null,
      suffix: `[${specLeaf}/${fileStem}]`,
    };
  }

  if (SPEC_DOC_BASENAMES.has(fileName)) {
    const specLeaf = path.basename(path.dirname(normalized));
    const documentType = mapSpecDocType(fileName);
    return {
      kind: 'spec_doc',
      documentType,
      filePath,
      fileName,
      fileStem,
      specLeaf,
      templateRelativePath: null,
      suffix: `[${specLeaf}/${fileStem}]`,
    };
  }

  return {
    kind: 'unknown',
    documentType: 'unknown',
    filePath,
    fileName,
    fileStem,
    specLeaf: null,
    templateRelativePath: null,
    suffix: `[${fileStem}]`,
  };
}

function sectionValueByKeys(
  sections: FrontmatterSection[],
  keys: string[]
): FrontmatterValue | undefined {
  for (const key of keys) {
    const section = sections.find((entry) => entry.key === key);
    if (!section) {
      continue;
    }

    const value = parseSectionValue(section);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function normalizeImportanceTier(rawValue: string | null | undefined): string | null {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.toLowerCase().replace(/[^a-z_]/g, '');
  const mapped = normalized === 'high' ? 'important' : normalized;

  if (VALID_IMPORTANCE_TIERS.has(mapped)) {
    return mapped;
  }

  return null;
}

function normalizeContextType(rawValue: string | null | undefined): string | null {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.toLowerCase().trim();

  const aliasMap: Record<string, string> = {
    debug: 'implementation',
    analysis: 'research',
    planning: 'decision',
    bug: 'discovery',
    feature: 'implementation',
  };

  const mapped = aliasMap[normalized] || normalized;
  if (VALID_CONTEXT_TYPES.has(mapped)) {
    return mapped;
  }

  return null;
}

function normalizeTriggerPhrases(value: FrontmatterValue | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return dedupeStrings(
      value
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry.length >= 3)
    );
  }

  if (typeof value === 'string') {
    return dedupeStrings(
      value
        .split(',')
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry.length >= 3)
    );
  }

  return [];
}

function extractFirstHeading(content: string): string | null {
  const h1 = content.match(/^\s*#\s+(.+)$/m);
  if (!h1) {
    return null;
  }

  return normalizeTitleCandidate(h1[1]);
}

function extractFirstMeaningfulSentence(content: string): string | null {
  const lines = content.replace(/\r/g, '').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (
      /^#{1,6}\s+/.test(trimmed) ||
      /^\|/.test(trimmed) ||
      /^-\s+/.test(trimmed) ||
      /^>/.test(trimmed) ||
      /^<!--/.test(trimmed) ||
      /^```/.test(trimmed)
    ) {
      continue;
    }

    const normalized = normalizeTitleCandidate(trimmed);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function filenameFallback(fileStem: string): string {
  const text = fileStem.replace(/[-_]+/g, ' ').trim();
  return normalizeTitleCandidate(text) || 'Untitled';
}

function inferTitleBase(
  content: string,
  existingTitle: string | null,
  classification: ClassifiedDocument
): string {
  if (existingTitle && !isGenericTitle(existingTitle)) {
    return existingTitle;
  }

  const h1 = extractFirstHeading(content);
  if (h1 && !isGenericTitle(h1)) {
    return h1;
  }

  const sentence = extractFirstMeaningfulSentence(content);
  if (sentence && !isGenericTitle(sentence)) {
    return sentence;
  }

  return filenameFallback(classification.fileStem);
}

function inferDescription(
  content: string,
  existingDescription: string | null,
  classification: ClassifiedDocument
): string | undefined {
  if (classification.kind === 'memory') {
    return undefined;
  }

  if (existingDescription) {
    return existingDescription;
  }

  const sentence = extractFirstMeaningfulSentence(content);
  if (sentence) {
    return sentence.length > 180 ? `${sentence.slice(0, 177)}...` : sentence;
  }

  if (classification.kind === 'template') {
    const rel = classification.templateRelativePath || classification.fileName;
    return `Template document for ${rel}.`;
  }

  const docType = classification.documentType.replace(/_/g, ' ');
  const scope = classification.specLeaf || 'spec folder';
  return `${docType} document for ${scope}.`;
}

function inferTriggerPhrases(
  title: string,
  existingTriggers: string[],
  classification: ClassifiedDocument
): string[] | undefined {
  if (classification.kind === 'memory') {
    return existingTriggers.length > 0 ? existingTriggers : undefined;
  }

  if (existingTriggers.length > 0) {
    return existingTriggers;
  }

  const generated: string[] = [];
  const titleNoSuffix = title.replace(/\s*\[[^\]]+\]\s*$/, '').trim();
  const titleTokens = tokenize(titleNoSuffix).slice(0, 5);
  generated.push(...titleTokens);

  if (classification.kind === 'template') {
    generated.push('template');
    generated.push(classification.fileStem.replace(/[-_]+/g, ' '));
  } else {
    generated.push(classification.documentType.replace(/_/g, ' '));
    if (classification.specLeaf) {
      generated.push(...tokenize(classification.specLeaf).slice(0, 2));
    }
  }

  const deduped = dedupeStrings(
    generated
      .map((entry) => entry.toLowerCase().trim())
      .filter((entry) => entry.length >= 3)
  );

  if (deduped.length === 0) {
    return ['memory', 'indexing', 'context'];
  }

  return deduped.slice(0, 8);
}

function inferImportanceTier(
  content: string,
  existingTier: string | null,
  classification: ClassifiedDocument
): string {
  if (existingTier) {
    return existingTier;
  }

  if (classification.kind === 'memory') {
    const tableMatch = content.match(/\|\s*Importance\s*Tier\s*\|\s*([^|\n]+)\|/i);
    const parsed = normalizeImportanceTier(tableMatch?.[1]?.trim());
    if (parsed) {
      return parsed;
    }
  }

  return DOC_DEFAULT_IMPORTANCE[classification.documentType] || 'normal';
}

function inferContextType(
  content: string,
  existingContext: string | null,
  classification: ClassifiedDocument
): string {
  if (existingContext) {
    return existingContext;
  }

  if (classification.kind === 'memory') {
    const tableMatch = content.match(/\|\s*Context\s*Type\s*\|\s*([^|\n]+)\|/i);
    const parsed = normalizeContextType(tableMatch?.[1]?.trim());
    if (parsed) {
      return parsed;
    }
  }

  return DOC_DEFAULT_CONTEXT[classification.documentType] || 'general';
}

function frontmatterForContextTemplate(
  classification: ClassifiedDocument,
  existingDescription: string | null,
  existingTriggers: string[],
  existingTier: string | null,
  existingContext: string | null
): ManagedFrontmatter {
  const trigger_phrases = existingTriggers.length > 0
    ? existingTriggers
    : ['memory dashboard', 'session summary', 'context template'];

  return {
    title: '{{MEMORY_DASHBOARD_TITLE}}',
    description: existingDescription || 'Session context memory template for Spec Kit indexing.',
    trigger_phrases,
    importance_tier: existingTier || 'normal',
    contextType: existingContext || 'general',
    importanceTierAlias: '{{IMPORTANCE_TIER}}',
  };
}

export function buildManagedFrontmatter(
  content: string,
  sections: FrontmatterSection[],
  classification: ClassifiedDocument,
  maxTitleLength: number = TITLE_MAX_LENGTH
): ManagedFrontmatter {
  const existingTitleValue = sectionValueByKeys(sections, ['title']);
  const existingDescriptionValue = sectionValueByKeys(sections, ['description']);
  const existingTriggersValue = sectionValueByKeys(sections, ['trigger_phrases', 'triggerPhrases']);
  const existingImportanceValue = sectionValueByKeys(sections, ['importance_tier', 'importanceTier']);
  const existingContextValue = sectionValueByKeys(sections, ['contextType', 'context_type']);

  const existingTitle = typeof existingTitleValue === 'string'
    ? normalizeTitleCandidate(existingTitleValue)
    : null;

  const existingDescription = typeof existingDescriptionValue === 'string'
    ? normalizeTitleCandidate(existingDescriptionValue)
    : null;

  const existingTriggers = normalizeTriggerPhrases(existingTriggersValue);
  const existingTier = typeof existingImportanceValue === 'string'
    ? normalizeImportanceTier(existingImportanceValue)
    : null;

  const existingContext = typeof existingContextValue === 'string'
    ? normalizeContextType(existingContextValue)
    : null;

  if (
    classification.kind === 'template' &&
    classification.fileName === 'context_template.md'
  ) {
    return frontmatterForContextTemplate(
      classification,
      existingDescription,
      existingTriggers,
      existingTier,
      existingContext
    );
  }

  const titleBase = inferTitleBase(content, existingTitle, classification);
  const title = truncateWithSuffix(titleBase, classification.suffix, maxTitleLength);

  const description = inferDescription(content, existingDescription, classification);
  const trigger_phrases = inferTriggerPhrases(title, existingTriggers, classification);
  const importance_tier = inferImportanceTier(content, existingTier, classification);
  const contextType = inferContextType(content, existingContext, classification);

  return {
    title,
    description,
    trigger_phrases,
    importance_tier,
    contextType,
  };
}

/* -----------------------------------------------------------------
   6. MERGE + SERIALIZE
------------------------------------------------------------------*/

const MANAGED_KEYS = new Set([
  'title',
  'description',
  'trigger_phrases',
  'triggerPhrases',
  'importance_tier',
  'importanceTier',
  'contextType',
  'context_type',
]);

function serializeFrontmatter(
  managed: ManagedFrontmatter,
  existingSections: FrontmatterSection[]
): string {
  const lines: string[] = [];

  lines.push('---');
  lines.push(...sectionToLines('title', managed.title));

  if (managed.description) {
    lines.push(...sectionToLines('description', managed.description));
  }

  if (managed.trigger_phrases && managed.trigger_phrases.length > 0) {
    lines.push(...sectionToLines('trigger_phrases', managed.trigger_phrases));
  }

  lines.push(...sectionToLines('importance_tier', managed.importance_tier));

  if (managed.importanceTierAlias) {
    lines.push(...sectionToLines('importanceTier', managed.importanceTierAlias));
  }

  lines.push(...sectionToLines('contextType', managed.contextType));

  const unknownSections = existingSections
    .filter((section) => !MANAGED_KEYS.has(section.key))
    .slice()
    .sort((left, right) => left.key.localeCompare(right.key));

  for (const section of unknownSections) {
    lines.push(...section.lines);
  }

  lines.push('---');
  lines.push('');

  return `${lines.join('\n')}`;
}

export function buildFrontmatterContent(
  originalContent: string,
  options: BuildFrontmatterOptions,
  filePath: string
): BuildFrontmatterResult {
  const templatesRoot = options.templatesRoot;
  const maxTitleLength = options.maxTitleLength || TITLE_MAX_LENGTH;

  const detection = detectFrontmatter(originalContent);
  const existingSections = detection.found ? detection.sections : [];

  const classification = classifyDocument(filePath, templatesRoot);
  const managed = buildManagedFrontmatter(
    originalContent,
    existingSections,
    classification,
    maxTitleLength
  );

  const frontmatterText = serializeFrontmatter(managed, existingSections);

  let content: string;
  if (detection.found) {
    content = `${originalContent.slice(0, detection.start)}${frontmatterText}${originalContent.slice(detection.end)}`;
  } else {
    content = `${frontmatterText}${originalContent}`;
  }

  return {
    changed: content !== originalContent,
    content,
    classification,
    managed,
    hadFrontmatter: detection.found,
  };
}

/* -----------------------------------------------------------------
   7. EXPORTS
------------------------------------------------------------------*/

export {
  TITLE_MAX_LENGTH,
  SPEC_DOC_BASENAMES,
};
