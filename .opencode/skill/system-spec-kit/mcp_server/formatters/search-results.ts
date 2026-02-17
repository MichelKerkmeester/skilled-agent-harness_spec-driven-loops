// ---------------------------------------------------------------
// FORMATTERS: SEARCH RESULTS
// ---------------------------------------------------------------

// Node stdlib
import fs from 'fs';
import path from 'path';

// Internal modules
import { estimateTokens } from './token-metrics';

// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security';

// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser';

// REQ-019: Standardized Response Structure
import {
  createMCPSuccessResponse,
  createMCPEmptyResponse,
  type MCPResponse,
} from '../lib/response/envelope';

// Consolidated path validation from core/config.js (single source of truth)
import { ALLOWED_BASE_PATHS } from '../core/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Token metrics for anchor-filtered content */
export interface AnchorTokenMetrics {
  originalTokens: number;
  returnedTokens: number;
  savingsPercent: number;
  anchorsRequested: number;
  anchorsFound: number;
}

/** Raw search result from database/vector search */
export interface RawSearchResult {
  id: number;
  spec_folder: string;
  file_path: string;
  title: string | null;
  /** Raw vector cosine similarity (0-100 scale from sqlite-vec). */
  similarity?: number;
  /** Average similarity across multi-concept queries (0-100 scale). */
  averageSimilarity?: number;
  isConstitutional?: boolean;
  importance_tier?: string;
  triggerPhrases?: string | string[];
  created_at?: string;
  [key: string]: unknown;
}

/** Formatted search result */
export interface FormattedSearchResult {
  id: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  /** Raw vector cosine similarity (0-100 scale from sqlite-vec), or averageSimilarity for multi-concept. */
  similarity?: number;
  isConstitutional: boolean;
  importanceTier?: string;
  triggerPhrases: string[];
  createdAt?: string;
  content?: string | null;
  contentError?: string;
  tokenMetrics?: AnchorTokenMetrics;
}

/** Memory parser interface (for optional override) */
export interface MemoryParserLike {
  extractAnchors(content: string): Record<string, string>;
}

// MCPResponse type is imported from '../lib/response/envelope'
export type { MCPResponse };

/* ---------------------------------------------------------------
   2. PATH VALIDATION
   --------------------------------------------------------------- */

export function validateFilePathLocal(filePath: string): string {
  const result = validateFilePath(filePath, ALLOWED_BASE_PATHS);
  if (result === null) {
    throw new Error('Access denied: Path outside allowed directories');
  }
  // Additional check for .. patterns (not just null bytes which shared handles)
  if (filePath.includes('..')) {
    throw new Error('Access denied: Invalid path pattern');
  }
  return result;
}

/* ---------------------------------------------------------------
   3. HELPER UTILITIES
   --------------------------------------------------------------- */

export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/* ---------------------------------------------------------------
   4. SEARCH RESULTS FORMATTING
   --------------------------------------------------------------- */

export async function formatSearchResults(
  results: RawSearchResult[] | null,
  searchType: string,
  include_content: boolean = false,
  anchors: string[] | null = null,
  parserOverride: MemoryParserLike | null = null,
  startTime: number | null = null,
  extraData: Record<string, unknown> = {}
): Promise<MCPResponse> {
  const startMs = startTime || Date.now();
  const includeContent = include_content;

  if (!results || results.length === 0) {
    // REQ-019: Use standardized empty response envelope
    return createMCPEmptyResponse({
      tool: 'memory_search',
      summary: 'No matching memories found',
      data: {
        searchType: searchType,
        constitutionalCount: 0
      },
      hints: [
        'Try broadening your search query',
        'Use memory_list() to browse available memories',
        'Check if specFolder filter is too restrictive'
      ],
      startTime: startMs
    });
  }

  // Count constitutional results
  const constitutionalCount = results.filter(rawResult => rawResult.isConstitutional).length;

  const formatted: FormattedSearchResult[] = await Promise.all(results.map(async (rawResult: RawSearchResult) => {
    const formattedResult: FormattedSearchResult = {
      id: rawResult.id,
      specFolder: rawResult.spec_folder,
      filePath: rawResult.file_path,
      title: rawResult.title,
      similarity: rawResult.similarity || rawResult.averageSimilarity,
      isConstitutional: rawResult.isConstitutional || false,
      importanceTier: rawResult.importance_tier,
      triggerPhrases: Array.isArray(rawResult.triggerPhrases) ? rawResult.triggerPhrases :
                      safeJsonParse<string[]>(rawResult.triggerPhrases as string, []),
      createdAt: rawResult.created_at
    };

    // Include file content if requested
    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
    if (includeContent && rawResult.file_path) {
      try {
        const validatedPath = validateFilePathLocal(rawResult.file_path);
        let content = await fs.promises.readFile(validatedPath, 'utf-8');

        // SK-005: Anchor System Implementation
        const parser: MemoryParserLike = parserOverride || memoryParser;
        if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser) {
          // BUG-017 FIX: Capture original tokens BEFORE any content reassignment
          const originalTokens = estimateTokens(content);

          const extracted = parser.extractAnchors(content);
          const filteredParts: string[] = [];
          let foundCount = 0;

          for (const anchorId of anchors) {
            // SK-005 Prefix matching: try exact match first, then fall back to
            // prefix match for composite anchor IDs (e.g. 'summary' matches
            // 'summary-session-1770903150838-...'). Prefers shortest match to
            // select the most specific key when multiple keys share a prefix.
            const matchingKey = extracted[anchorId] !== undefined
              ? anchorId
              : Object.keys(extracted)
                  .filter(key => key.startsWith(anchorId + '-'))
                  .sort((a, b) => a.length - b.length)[0] ?? undefined;

            if (matchingKey !== undefined) {
              filteredParts.push(`<!-- ANCHOR:${matchingKey} -->\n${extracted[matchingKey]}\n<!-- /ANCHOR:${matchingKey} -->`);
              foundCount++;
            }
          }

          if (filteredParts.length > 0) {
            // SK-005 Fix: Warn about missing anchors in partial match
            // Use same prefix-matching logic for consistency
            const missingAnchors = anchors.filter(a => {
              if (extracted[a] !== undefined) return false;
              return !Object.keys(extracted).some(key => key.startsWith(a + '-'));
            });
            if (missingAnchors.length > 0) {
              filteredParts.push(`<!-- WARNING: Requested anchors not found: ${missingAnchors.join(', ')} -->`);
            }

            content = filteredParts.join('\n\n');
            const newTokens = estimateTokens(content);
            const savings = Math.round((1 - newTokens / Math.max(originalTokens, 1)) * 100);

            formattedResult.tokenMetrics = {
              originalTokens: originalTokens,
              returnedTokens: newTokens,
              savingsPercent: savings,
              anchorsRequested: anchors.length,
              anchorsFound: foundCount
            };
          } else {
            // No anchors found - return warning
            content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
            formattedResult.tokenMetrics = {
              originalTokens: originalTokens,
              returnedTokens: 0,
              savingsPercent: 100,
              anchorsRequested: anchors.length,
              anchorsFound: 0
            };
          }
        }

        formattedResult.content = content;
      } catch (err: unknown) {
        formattedResult.content = null;
        const message = err instanceof Error ? err.message : String(err);
        // BUG-023 FIX: Sanitize error messages to prevent information leakage
        formattedResult.contentError = message.includes('Access denied')
          ? 'Security: Access denied'
          : message.includes('ENOENT')
            ? 'File not found'
            : 'Failed to read file';
      }
    }

    return formattedResult;
  }));

  // REQ-019: Build summary based on result characteristics
  const summary = constitutionalCount > 0
    ? `Found ${formatted.length} memories (${constitutionalCount} constitutional)`
    : `Found ${formatted.length} memories`;

  // REQ-019: Build hints based on context
  const hints: string[] = [];
  if (includeContent && anchors && anchors.length > 0) {
    hints.push('Anchor filtering applied for token efficiency');
  }
  if (!includeContent && formatted.length > 0) {
    hints.push('Use includeContent: true to embed file contents in results');
  }
  if (formatted.some(r => r.contentError)) {
    hints.push('Some files could not be read - check file paths');
  }

  // REQ-019: Use standardized success response envelope
  const responseData: Record<string, unknown> = {
    searchType: searchType,
    count: formatted.length,
    constitutionalCount: constitutionalCount,
    results: formatted,
    ...extraData
  };

  return createMCPSuccessResponse({
    tool: 'memory_search',
    summary,
    data: responseData,
    hints,
    startTime: startMs
  });
}

/* ---------------------------------------------------------------
   5. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
