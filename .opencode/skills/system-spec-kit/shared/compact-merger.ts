// ---------------------------------------------------------------
// MODULE: Compact Merger
// ---------------------------------------------------------------

import { allocateBudget, createDefaultSources, type AllocationResult } from './budget-allocator.js';

type SharedPayloadSourceKind = 'memory' | 'code-graph' | 'semantic' | 'session';

export interface SharedPayloadSection {
  key: string;
  title: string;
  content: string;
  source: SharedPayloadSourceKind;
}

export interface SharedPayloadProvenance {
  producer: 'compact_merger';
  sourceSurface: string;
  trustState: 'live';
  generatedAt: string;
  lastUpdated: string | null;
  sourceRefs: string[];
}

export interface PreMergeSelectionMetadata {
  strategy: 'pre-merge';
  selectedFrom: string[];
  fileCount: number;
  topicCount: number;
  attentionSignalCount: number;
  notes: string[];
  antiFeedbackGuards: string[];
}

export interface SharedPayloadEnvelope {
  kind: 'compaction';
  summary: string;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  selection?: PreMergeSelectionMetadata;
}

function createCompactPayloadEnvelope(input: SharedPayloadEnvelope): SharedPayloadEnvelope {
  return {
    ...input,
    sections: input.sections.filter((section) => section.content.trim().length > 0),
  };
}

export interface MergeInput {
  constitutional: string;
  codeGraph: string;
  triggered: string;
  sessionState: string;
}

export interface SourceFreshness {
  source: string;
  lastUpdated: string | null;
  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
}

export interface MergedBrief {
  text: string;
  sections: {
    name: string;
    content: string;
    tokenEstimate: number;
    source: string;
  }[];
  allocation: AllocationResult;
  payloadContract: SharedPayloadEnvelope;
  metadata: {
    totalTokenEstimate: number;
    sourceCount: number;
    mergedAt: string;
    mergeDurationMs: number;
    deduplicatedFiles: number;
    freshness: SourceFreshness[];
    selection?: PreMergeSelectionMetadata;
  };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function truncateToTokens(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return '';
  if (estimateTokens(text) <= maxTokens) return text;

  const marker = '\n[...truncated]';
  const maxChars = maxTokens * 4;
  if (marker.length >= maxChars) {
    return text.slice(0, maxChars);
  }
  return text.slice(0, Math.max(0, maxChars - marker.length)) + marker;
}

function extractFilePathsFromText(text: string): Set<string> {
  const paths = new Set<string>();
  const matches = text.match(/(?:\/[\w.-]+){2,}(?:\.\w+)/g);
  if (matches) {
    matches.forEach((match) => paths.add(match));
  }
  return paths;
}

function deduplicateFilePaths(sections: MergedBrief['sections']): number {
  const seenFiles = new Set<string>();
  let removedCount = 0;

  for (const section of sections) {
    const filePaths = extractFilePathsFromText(section.content);
    const duplicates: string[] = [];

    for (const filePath of filePaths) {
      if (seenFiles.has(filePath)) {
        duplicates.push(filePath);
        removedCount++;
      } else {
        seenFiles.add(filePath);
      }
    }

    if (duplicates.length === 0) continue;
    let content = section.content;
    for (const duplicate of duplicates) {
      const escaped = duplicate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(`^.*${escaped}.*$\\n?`, 'gm'), '');
    }
    section.content = content.trim();
    section.tokenEstimate = estimateTokens(section.content);
  }

  return removedCount;
}

export function mergeCompactBrief(
  input: MergeInput,
  totalBudget: number = 4000,
  freshness?: SourceFreshness[],
  selection?: PreMergeSelectionMetadata,
): MergedBrief {
  const startTime = performance.now();
  const sources = createDefaultSources(
    estimateTokens(input.constitutional),
    estimateTokens(input.codeGraph),
    estimateTokens(input.triggered),
    estimateTokens(input.sessionState),
  );
  const allocation = allocateBudget(sources, totalBudget);
  const allocationMap = new Map(allocation.allocations.map((entry) => [entry.name, entry]));
  const sections: MergedBrief['sections'] = [];

  const pushSection = (
    inputText: string,
    allocationName: string,
    sectionName: string,
    source: string,
  ): void => {
    if (!inputText.trim()) return;
    const granted = allocationMap.get(allocationName)?.granted ?? 0;
    if (granted <= 0) return;

    const content = truncateToTokens(inputText, granted);
    if (!content.trim()) return;
    sections.push({
      name: sectionName,
      content,
      tokenEstimate: estimateTokens(content),
      source,
    });
  };

  pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
  pushSection(input.codeGraph, 'codeGraph', 'Active Files & Structural Context', 'code-graph');
  pushSection(input.sessionState, 'sessionState', 'Session State / Next Steps', 'session');
  pushSection(input.triggered, 'triggered', 'Triggered Memories', 'memory');

  const deduplicatedFiles = deduplicateFilePaths(sections);
  const text = sections.map((section) => `## ${section.name}\n${section.content}`).join('\n\n');
  const totalTokenEstimate = sections.reduce((sum, section) => sum + section.tokenEstimate, 0);

  return {
    text,
    sections,
    allocation,
    payloadContract: createCompactPayloadEnvelope({
      kind: 'compaction',
      sections: sections.map((section) => ({
        key: section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: section.name,
        content: section.content,
        source: section.source === 'code-graph'
          ? 'code-graph'
          : section.source === 'session'
              ? 'session'
              : 'memory',
      })),
      summary: `Compaction payload merged ${sections.length} sections within ${totalBudget} tokens`,
      provenance: {
        producer: 'compact_merger',
        sourceSurface: 'compaction',
        trustState: 'live',
        generatedAt: new Date().toISOString(),
        lastUpdated: null,
        sourceRefs: ['budget-allocator', 'compact-merger'],
      },
      ...(selection ? { selection } : {}),
    }),
    metadata: {
      totalTokenEstimate,
      sourceCount: sections.length,
      mergedAt: new Date().toISOString(),
      mergeDurationMs: Math.round(performance.now() - startTime),
      deduplicatedFiles,
      freshness: freshness ?? [
        { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
        { source: 'codeGraph', lastUpdated: null, staleness: 'unknown' },
        { source: 'triggered', lastUpdated: null, staleness: 'unknown' },
      ],
      ...(selection ? { selection } : {}),
    },
  };
}
