import type { JsonValue } from '../domain/question.js';
import type { SourceSnippet } from './ports.js';

/** Snippets as Jev sees them: line numbers are labels for the reader, never something to count. */
export function sourcesField(snippets: readonly SourceSnippet[]): JsonValue {
  return snippets.map((snippet) => ({
    path: snippet.path,
    start_line: snippet.startLine,
    end_line: snippet.endLine,
    ...(snippet.truncated ? { note: 'truncated to fit the request' } : {}),
    content: snippet.content,
  }));
}
