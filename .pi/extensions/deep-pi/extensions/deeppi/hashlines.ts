// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Hashline Editing
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { chmod, lstat, open, readFile, rename, unlink } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

import { annotateContent, lineHash } from './utils.js';

import type {
  ExtensionAPI,
  ExtensionContext,
  ToolDefinition,
  ToolResultEvent,
} from '@earendil-works/pi-coding-agent';

/**
 * Hashline editing replaces exact-string editing with hash-anchored editing.
 *
 * The `tool_result` hook annotates read output with per-line content hashes,
 * and the `edit_lines` tool verifies those hashes before applying changes.
 */

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/**
 * One inclusive line-range replacement guarded by endpoint hashes.
 *
 * @remarks Property names mirror the `edit_lines` JSON schema consumed by the tool runtime.
 */
export interface HashEdit {
  from: number;
  from_hash: string;
  to: number;
  to_hash: string;
  new_text: string;
}

/** Runtime counters reported by the `/harness-hashlines` command. */
export interface HashlineStats {
  /** Number of read results annotated. */
  readsAnnotated: number;
  /** Number of `edit_lines` calls. */
  editCalls: number;
  /** Number of `edit_lines` hash mismatches. */
  hashMismatches: number;
  /** Number of successful `edit_lines` applications. */
  editSuccesses: number;
}

/** Predicate used to enable hashline features for an active model. */
type Eligible = (model: { provider: string; id: string } | undefined) => boolean;

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const writeQueues = new Map<string, Promise<void>>();

/**
 * JSON Schema for the `edit_lines` tool parameters.
 *
 * The schema remains a plain JSON Schema object because the runtime only
 * exposes JSON Schema to the model; TypeBox symbols are not needed here.
 */
export const editLinesSchema = {
  type: 'object',
  properties: {
    path: {
      type: 'string',
      description: 'Path to the file to edit (relative to cwd or absolute).',
    },
    edits: {
      type: 'array',
      description: 'Hash-anchored edits to apply. Each edit replaces lines from..to ' +
        '(inclusive, 1-based) with new_text.',
      items: {
        type: 'object',
        properties: {
          from: { type: 'integer', description: '1-based start line number.' },
          from_hash: {
            type: 'string',
            description: '8-char hex hash of the from line (from the read annotation).',
          },
          to: {
            type: 'integer',
            description: '1-based end line number (inclusive).',
          },
          to_hash: {
            type: 'string',
            description: '8-char hex hash of the to line (from the read annotation).',
          },
          new_text: {
            type: 'string',
            description: 'Replacement text for lines from..to. May contain multiple lines ' +
              '(newline-separated).',
          },
        },
        required: ['from', 'from_hash', 'to', 'to_hash', 'new_text'],
      },
    },
  },
  // NOTE: `edits` is intentionally NOT required at the schema level.
  // A confused call that carries the sibling `edit` tool's vocabulary
  // (top-level `oldText`/`newText`) would otherwise be hard-rejected by the
  // framework's schema validator before `execute` runs, yielding an opaque
  // "edits: must have required properties edits" error. By keeping `edits`
  // optional here, such a call reaches `execute`, which detects the mix-up
  // and returns a corrective, self-steering error (see detectConfusedEditArgs).
  required: ['path'],
} as const;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

async function withWriteQueue<T>(path: string, work: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(path) ?? Promise.resolve();
  // The promise executor assigns the resolver synchronously before `turn` can settle.
  let release!: () => void;
  const turn = new Promise<void>((resolve) => {
    release = resolve;
  });
  const tail = previous.catch(() => undefined).then(() => turn);
  writeQueues.set(path, tail);
  await previous.catch(() => undefined);
  try {
    return await work();
  } finally {
    release();
    if (writeQueues.get(path) === tail) writeQueues.delete(path);
  }
}

/**
 * Atomically replace a file while serializing writes within this process.
 *
 * @param path - File path to replace.
 * @param content - New file content.
 * @param expectedContent - Optional compare-and-swap content from the last read.
 * @returns A promise that resolves after the replacement is verified on disk.
 * @throws {@link Error} If the target is a symbolic link or changed during the write.
 */
export async function atomicWriteFile(
  path: string,
  content: string,
  expectedContent?: string,
): Promise<void> {
  const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`);
  let created = false;
  try {
    await withWriteQueue(path, async () => {
      const handle = await open(temporary, 'wx', 0o600);
      created = true;
      try {
        await handle.writeFile(content, 'utf8');
        await handle.sync();
      } finally {
        await handle.close();
      }
      const linkStat = await lstat(path);
      if (linkStat.isSymbolicLink()) {
        throw new Error(
          `Refusing to replace symbolic link at ${path}; edit its target instead.`,
        );
      }
      const mode = linkStat.mode & 0o777;
      await chmod(temporary, mode);
      if (expectedContent !== undefined) {
        const current = await readFile(path, 'utf-8');
        if (current !== expectedContent) {
          throw new Error(
            `File changed since it was read; refusing to overwrite. Re-read ${path} and retry.`,
          );
        }
      }
      await rename(temporary, path);
      created = false;
      // Verify the rename actually landed: if a non-cooperating writer
      // replaced the target right after our rename, don't report success
      // while the on-disk content is someone else's.
      const landed = await readFile(path, 'utf-8');
      if (landed !== content) {
        throw new Error(
          `File changed during replacement; refusing to report success. Re-read ${path} and retry.`,
        );
      }
    });
  } finally {
    if (created) await unlink(temporary).catch(() => undefined);
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Register hashline editing hooks and the `edit_lines` tool.
 * Active only for eligible direct DeepSeek V4 models.
 *
 * @param pi - Extension API used to register hooks and tools.
 * @param eligible - Predicate identifying models that may use hashline editing.
 * @returns Mutable runtime counters for the registered hooks and tool.
 */
export function registerHashlines(
  pi: ExtensionAPI,
  eligible: Eligible,
): HashlineStats {
  const stats: HashlineStats = {
    readsAnnotated: 0,
    editCalls: 0,
    hashMismatches: 0,
    editSuccesses: 0,
  };

  // ── Hook 1: Annotate read tool results with line hashes (eligible only) ─
  pi.on(
    'tool_result',
    async (event: ToolResultEvent, ctx: ExtensionContext) => {
      if (!eligible(ctx.model)) return;
      if (event.toolName !== 'read') return;
      if (event.isError) return;
      const textContent = event.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text' && typeof c.text === 'string',
      );
      if (!textContent) return;
      // The SDK supplies tool input as an open object; only the optional read offset is used here.
      const input = event.input as
        | { offset?: number }
        | Record<string, unknown>;
      const offset = typeof input?.offset === 'number' && input.offset > 0 ? input.offset : 1;
      const annotated = annotateContent(textContent.text, offset);
      if (annotated === textContent.text) return;
      stats.readsAnnotated++;
      return {
        content: event.content.map((c) =>
          c.type === 'text' && typeof c.text === 'string'
            ? { type: 'text' as const, text: annotated }
            : c
        ),
        // Preserve details unchanged so Pi's built-in renderer keeps its display data.
        details: event.details,
      };
    },
  );

  // ── Register the edit_lines tool (eligible only) ───────────────────
  const editLinesTool: ToolDefinition = {
    name: 'edit_lines',
    label: 'edit lines',
    description:
      'Edit a file using hash-anchored line ranges. Each edit specifies a line range (from..to, ' +
      '1-based inclusive) with the expected content hashes at both endpoints. The tool reads the ' +
      'file fresh, verifies the hashes match, and rejects on mismatch with a precise error ' +
      'showing the actual vs. claimed hash.\n\n' +
      'When to use which:\n' +
      "- Use edit_lines when you have a RECENT 'read' of the file whose output shows per-line " +
      'hash annotations (format: N:HHHHHHHH→content). It is robust to nearby edits and avoids ' +
      'reproducing large unchanged blocks.\n' +
      "- Use 'edit' when you only have the text and want exact-string replacement " +
      '(its params are path + edits[] of {oldText, newText}).\n' +
      '- Do NOT mix the two tools: edit_lines takes `edits` of {from, from_hash, to, to_hash, ' +
      'new_text} — NEVER top-level oldText/newText.\n\n' +
      'Example call:\n' +
      '  { "path": "lib/foo.ex", "edits": [\n' +
      '    { "from": 42, "from_hash": "a1b2c3d4", "to": 48, "to_hash": "8b4c1d9e", ' +
      '"new_text": "    new body" }\n' +
      '  ] }\n\n' +
      "If you do not have current hashes, call 'read' first (its output is annotated with " +
      '#<hash> at each line), then build edits from those annotations.',
    promptSnippet: 'Edit file using hash-anchored line ranges (preferred when you have a recent ' +
      'read with hash annotations)',
    promptGuidelines: [
      "Prefer edit_lines for edits to files you've recently read with 'read'. The read output " +
      'includes per-line hashes (format: N:HHHHHHHH→content). Use these hashes with edit_lines ' +
      'to avoid character-perfect old_string reproduction.',
      "Use 'edit' only when you don't have a fresh read with hash annotations, or when you need " +
      'to match a specific string without line numbers.',
      'edit_lines and edit are different tools with different parameter shapes. edit_lines takes ' +
      '`edits` of {from, from_hash, to, to_hash, new_text} — never top-level oldText/newText. ' +
      "If you find yourself passing oldText/newText to edit_lines, stop and call 'edit' instead.",
    ],
    // The SDK's schema field uses a generic parameter type; this tool intentionally exposes
    // plain JSON Schema.
    parameters: editLinesSchema as any,
    executionMode: 'sequential',
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      stats.editCalls++;
      if (!eligible(ctx.model)) {
        return {
          content: [{ type: 'text' as const, text: 'edit_lines is dormant for the active model.' }],
          isError: true,
          details: undefined,
        };
      }
      const confused = detectConfusedEditArgs(params);
      if (confused) {
        return {
          content: [{ type: 'text' as const, text: confused }],
          isError: true,
          details: undefined,
        };
      }
      // The schema and earlier array validation establish the tool's path and edit fields.
      const { path: rawPath, edits } = params as {
        path: string;
        edits: HashEdit[];
      };
      if (!Array.isArray(edits) || edits.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'edit_lines: `edits` is required and must be a non-empty ' +
                'array of {from, from_hash, ' +
                "to, to_hash, new_text}.\n\nIf you meant exact-text replacement, call 'edit' " +
                '(path + edits[] of {oldText, newText}).\nIf you want hash-anchored edits, call ' +
                "'read' first to get per-line hashes, then pass `edits` here.",
            },
          ],
          isError: true,
          details: undefined,
        };
      }
      const absolutePath = resolve(ctx.cwd, rawPath);
      let content: string;
      try {
        content = await readFile(absolutePath, 'utf-8');
      } catch (err: unknown) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reading file: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
          details: undefined,
        };
      }
      const lines = content.split('\n');
      const validationError = validateEdits(lines, edits);
      if (validationError) {
        stats.hashMismatches++;
        return {
          content: [{ type: 'text' as const, text: validationError }],
          isError: true,
          details: undefined,
        };
      }
      const newLines = applyEditsToLines(lines, edits);
      const newContent = newLines.join('\n');
      try {
        await atomicWriteFile(absolutePath, newContent, content);
      } catch (err: unknown) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error writing file: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
          details: undefined,
        };
      }
      stats.editSuccesses++;
      const linesChanged = edits.reduce(
        (sum, e) => sum + (e.to - e.from + 1),
        0,
      );
      const newLinesAdded = edits.reduce(
        (sum, e) => sum + e.new_text.split('\n').length,
        0,
      );
      return {
        content: [
          {
            type: 'text' as const,
            text: buildEditSummary(edits, rawPath),
          },
        ],
        details: {
          editsApplied: edits.length,
          linesChanged,
          linesAdded: newLinesAdded,
        },
      };
    },
  };
  pi.registerTool(editLinesTool);
  return stats;
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

/**
 * Detect a call to edit_lines that carries the sibling `edit` tool's
 * parameter shape (top-level oldText/newText) instead of `edits`.
 *
 * Models that have just used `edit` frequently reach for `edit_lines` and
 * carry edit's vocabulary across. Rather than failing with an opaque
 * schema-validation message, the edit_lines tool calls this guard from
 * `execute` (enabled by keeping `edits` optional in the schema) and returns
 * a corrective, self-steering error.
 *
 * @returns Corrective error string if the args look edit-shaped, else null.
 */
export function detectConfusedEditArgs(params: unknown): string | null {
  if (!params || typeof params !== 'object') return null;
  // The object guard ensures property lookup is safe; the helper only reads string-keyed fields.
  const p = params as Record<string, unknown>;

  // If a valid-looking `edits` array is present, this is a real edit_lines
  // call (or a different kind of misuse handled by validateEdits).
  if (Array.isArray(p.edits)) return null;

  // Detect the sibling edit tool's top-level vocabulary before schema validation obscures
  // the mistake.
  const editToolKeys = ['oldText', 'newText', 'old_string', 'new_string'];
  const hasEditVocab = editToolKeys.some((k) => k in p);
  if (!hasEditVocab) return null;

  return [
    "edit_lines received `oldText`/`newText` (the `edit` tool's parameters), but " +
    'edit_lines does not accept those.',
    '',
    'edit_lines requires `edits`: an array of { from, from_hash, to, to_hash, new_text }, ' +
    'where each hash comes from the per-line annotations in a prior `read` of `path` ' +
    '(format: N:HHHHHHHH→content).',
    '',
    '  → If you want exact-text replacement: call `edit` instead (path + edits[] of ' +
    '{oldText, newText}).',
    '  → If you want hash-anchored edits: `read` the file first, then build each edit from the ' +
    '#<hash> annotations shown at each line.',
    '',
    'Example edit_lines call:',
    '  { "path": "lib/foo.ex", "edits": [',
    '    { "from": 42, "from_hash": "a1b2c3d4", "to": 48, "to_hash": "8b4c1d9e", ' +
    '"new_text": "    new body" }',
    '  ] }',
  ].join('\n');
}

/**
 * Validate a set of hash-anchored edits against the current file lines.
 * Pure function extracted from the edit_lines tool for testing.
 *
 * @returns Error string if invalid, or null if all edits pass validation.
 */
export function validateEdits(
  lines: string[],
  edits: HashEdit[],
): string | null {
  for (const edit of edits) {
    const fromIdx = edit.from - 1;
    const toIdx = edit.to - 1;

    if (fromIdx < 0 || fromIdx >= lines.length) {
      return `edit_lines: line ${edit.from} is out of range (file has ${lines.length} lines).`;
    }
    if (toIdx < 0 || toIdx >= lines.length || toIdx < fromIdx) {
      return `edit_lines: line ${edit.to} is out of range or before 'from' ` +
        `(file has ${lines.length} lines).`;
    }

    // The range check above guarantees that the indexed line exists.
    const actualFromHash = lineHash(lines[fromIdx]!);
    if (actualFromHash !== edit.from_hash) {
      return (
        `edit_lines: line ${edit.from} hash mismatch — claimed "${edit.from_hash}", ` +
        `actual "${actualFromHash}".\nCurrent line: "${lines[fromIdx]}"\n\n` +
        "The file may have changed since you last read it. Use 'read' to get fresh content " +
        'with current hashes, then retry.'
      );
    }

    if (edit.to !== edit.from) {
      // The range check above guarantees that the indexed end line exists.
      const actualToHash = lineHash(lines[toIdx]!);
      if (actualToHash !== edit.to_hash) {
        return (
          `edit_lines: line ${edit.to} hash mismatch — claimed "${edit.to_hash}", ` +
          `actual "${actualToHash}".\nCurrent line: "${lines[toIdx]}"\n\n` +
          "The file may have changed since you last read it. Use 'read' to get fresh content " +
          'with current hashes, then retry.'
        );
      }
    }
  }
  // Reject overlapping ranges so reverse-order application cannot clobber another replacement.
  // (applyEditsToLines sorts by descending `to` and would silently clobber
  // overlapping replacements).
  for (let i = 0; i < edits.length; i++) {
    for (let j = i + 1; j < edits.length; j++) {
      // Loop bounds guarantee that both indexed edits exist.
      const first = edits[i]!;
      const second = edits[j]!;
      if (first.from <= second.to && second.from <= first.to) {
        return `edit_lines: edit ${i + 1} (lines ${first.from}-${first.to}) overlaps edit ${
          j + 1
        } (lines ${second.from}-${second.to}). Ranges must not overlap.`;
      }
    }
  }
  return null;
}

/**
 * Apply hash-anchored edits to file lines (after validation).
 * Applies edits in reverse order to preserve line numbers for subsequent edits.
 * Pure function extracted for testing.
 */
export function applyEditsToLines(
  lines: string[],
  edits: HashEdit[],
): string[] {
  const result = [...lines];
  const sortedEdits = [...edits].sort((a, b) => b.to - a.to);
  for (const edit of sortedEdits) {
    const fromIdx = edit.from - 1;
    const toIdx = edit.to - 1;
    const newLines = edit.new_text.split('\n');
    result.splice(fromIdx, toIdx - fromIdx + 1, ...newLines);
  }
  return result;
}

/**
 * Build an edit summary string for the model.
 * Pure function extracted for testing.
 */
export function buildEditSummary(edits: HashEdit[], path: string): string {
  const linesChanged = edits.reduce((sum, e) => sum + (e.to - e.from + 1), 0);
  const newLinesAdded = edits.reduce(
    (sum, e) => sum + e.new_text.split('\n').length,
    0,
  );
  return `Successfully applied ${edits.length} edit${
    edits.length !== 1 ? 's' : ''
  } to ${path} (${linesChanged} line${
    linesChanged !== 1 ? 's' : ''
  } replaced, ${newLinesAdded} line${newLinesAdded !== 1 ? 's' : ''} added).`;
}
