// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Hash-Verified Edits Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import { createJiti } from 'jiti';

import {
  annotateContent,
  applyEditsToLines,
  buildEditSummary,
  detectConfusedEditArgs,
  isAnnotatedLine,
  lineHash,
  validateEdits,
} from '#extension';

import type { HashEdit } from '#extension';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

// ───────────────────────────────────────────────────────────────────
// 2. LINE HASHING AND READ ANNOTATION
// ───────────────────────────────────────────────────────────────────

describe('line hashing', () => {
  test('lineHash is an 8-char hex digest, stable for identical content', () => {
    const hash = lineHash('line one');
    assert.match(hash, /^[0-9a-f]{8}$/);
    assert.equal(lineHash('line one'), hash);
    assert.notEqual(lineHash('line two'), hash);
  });

  test('lineHash ignores trailing whitespace only', () => {
    assert.equal(lineHash('line one  \t'), lineHash('line one'));
    assert.notEqual(lineHash('line one'), lineHash('line onex'));
  });
});

describe('read annotation', () => {
  const sample = ['line one', 'line two', 'line three'];

  test('annotateContent prefixes every content line with number and hash', () => {
    const annotated = annotateContent(sample.join('\n'));
    const lines = annotated.split('\n');
    assert.equal(lines.length, sample.length);
    lines.forEach((line, i) => {
      assert.match(line, /^\s{4}\d+:[0-9a-f]{8}\u2192/);
      assert.equal(line.slice(6), `${lineHash(sample[i]!)}\u2192${sample[i]}`);
      assert.equal(line.slice(0, 5), String(i + 1).padStart(5, ' '));
    });
  });

  test('annotateContent honors a read offset for the first line number', () => {
    const annotated = annotateContent('x\ny', 41);
    const lines = annotated.split('\n');
    assert.ok(lines[0]!.startsWith('   41:'));
    assert.ok(lines[1]!.startsWith('   42:'));
  });

  test('annotateContent skips read notice lines and their preceding blank', () => {
    const annotated = annotateContent('a\n\n[Showing lines 1-50 of 200]\nb');
    const lines = annotated.split('\n');
    assert.equal(lines[0]!.slice(0, 5), '    1');
    assert.equal(lines[1], '');
    assert.equal(lines[2], '[Showing lines 1-50 of 200]');
    // The blank + notice do not consume line numbers: b stays line 2.
    assert.equal(lines[3]!.slice(0, 5), '    2');
  });

  test('annotateContent is idempotent on already-annotated content', () => {
    const annotated = annotateContent(sample.join('\n'));
    assert.equal(annotateContent(annotated), annotated);
    assert.ok(isAnnotatedLine(annotated.split('\n')[0]!));
    assert.ok(!isAnnotatedLine('plain content'));
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. HASH-VERIFIED EDIT VALIDATION
// ───────────────────────────────────────────────────────────────────

describe('hash-verified edit validation', () => {
  const lines = ['zero', 'one', 'two', 'three'];

  function editFor(from: number, to: number, newText = 'replacement'): HashEdit {
    return {
      from,
      from_hash: lineHash(lines[from - 1]!),
      to,
      to_hash: lineHash(lines[to - 1]!),
      new_text: newText,
    };
  }

  test('refuses an identical line that shifted into the target position', () => {
    // The failure a content hash cannot see on its own: line 3 is one of two
    // identical closing braces, a line is inserted above, and the OTHER brace
    // now sits at line 3 hashing exactly the same.
    const before = ['section A', '}', '}', 'section B'];
    const edit: HashEdit = {
      from: 3,
      from_hash: lineHash(before[2]!),
      to: 3,
      to_hash: lineHash(before[2]!),
      new_text: 'REPLACED',
    };
    const after = ['section A', 'inserted', '}', '}', 'section B'];
    assert.equal(lineHash(after[2]!), edit.from_hash, 'precondition: the hash still matches');
    const error = validateEdits(after, [edit], before.length);
    assert.ok(error, 'the shifted line must be refused, not silently edited');
    assert.match(error!, /5 lines but the read saw 4/);
  });

  test('requires the line count so a moved line cannot be edited blind', () => {
    const error = validateEdits(lines, [editFor(2, 2)], undefined);
    assert.ok(error);
    assert.match(error!, /line_count is required/);
  });

  test('refuses an edit whose interior drifted, not just its endpoints', () => {
    const wide = ['a', 'b', 'c', 'd'];
    const edit: HashEdit = {
      from: 1,
      from_hash: lineHash('a'),
      to: 4,
      to_hash: lineHash('d'),
      new_text: 'x',
      line_hashes: [lineHash('a'), lineHash('b'), lineHash('c'), lineHash('d')],
    };
    const drifted = ['a', 'b', 'CHANGED', 'd'];
    const error = validateEdits(drifted, [edit], drifted.length);
    assert.ok(error, 'interior drift must refuse');
    assert.match(error!, /line 3 hash mismatch/);
  });

  test('accepts an edit whose endpoint hashes still match', () => {
    assert.equal(validateEdits(lines, [editFor(2, 3)], lines.length), null);
    assert.equal(validateEdits(lines, [editFor(2, 2)], lines.length), null);
  });

  test('refuses an edit whose from endpoint drifted', () => {
    const edit = editFor(2, 3);
    edit.from_hash = lineHash('something else');
    const error = validateEdits(lines, [edit], lines.length);
    assert.ok(error);
    assert.match(error!, /line 2 hash mismatch/);
  });

  test('refuses an edit whose to endpoint drifted', () => {
    const edit = editFor(1, 4);
    edit.to_hash = lineHash('drifted');
    const error = validateEdits(lines, [edit], lines.length);
    assert.ok(error);
    assert.match(error!, /line 4 hash mismatch/);
  });

  test('refusal names the drifted line, claimed hash, actual hash, and current content', () => {
    const edit = editFor(2, 3);
    edit.from_hash = 'deadbeef';
    const error = validateEdits(lines, [edit], lines.length)!;
    assert.match(error, /line 2/);
    assert.match(error, /claimed "deadbeef"/);
    assert.match(error, new RegExp(`actual "${lineHash('one')}"`));
    assert.match(error, /Current line: "one"/);
  });

  test('a near-miss hash still refuses — no fuzzy fallback', () => {
    const driftedLines = ['one', 'two!', 'three'];
    const edit: HashEdit = {
      from: 2,
      from_hash: lineHash('two'), // actual line is 'two!'
      to: 2,
      to_hash: lineHash('two!'),
      new_text: 'TWO',
    };
    const error = validateEdits(driftedLines, [edit], driftedLines.length);
    assert.ok(error);
    assert.match(error!, /line 2 hash mismatch/);
    assert.match(error!, new RegExp(`claimed "${lineHash('two')}"`));
    assert.match(error!, new RegExp(`actual "${lineHash('two!')}"`));
  });

  test('refuses out-of-range and inverted ranges', () => {
    // Range checks fire before hashes are consulted, so the hash fields are
    // placeholders and never matter for these refusals.
    const stub = (from: number, to: number): HashEdit => ({
      from,
      from_hash: '00000000',
      to,
      to_hash: '00000000',
      new_text: 'x',
    });
    assert.ok(validateEdits(lines, [stub(0, 2)], lines.length));
    assert.ok(validateEdits(lines, [stub(5, 5)], lines.length));
    assert.ok(validateEdits(lines, [stub(3, 2)], lines.length));
  });

  test('refuses overlapping edits', () => {
    assert.ok(validateEdits(lines, [editFor(1, 2), editFor(2, 3)], lines.length));
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. EDIT APPLICATION
// ───────────────────────────────────────────────────────────────────

describe('edit application', () => {
  test('an unchanged target applies normally', () => {
    const lines = ['a', 'b', 'c', 'd'];
    const edits: HashEdit[] = [
      { from: 2, from_hash: lineHash('b'), to: 3, to_hash: lineHash('c'), new_text: 'B\nC' },
    ];
    assert.deepEqual(applyEditsToLines(lines, edits), ['a', 'B', 'C', 'd']);
  });

  test('multiple edits keep their line numbers via reverse-order application', () => {
    const lines = ['a', 'b', 'c', 'd'];
    const edits: HashEdit[] = [
      { from: 1, from_hash: lineHash('a'), to: 1, to_hash: lineHash('a'), new_text: 'A' },
      { from: 4, from_hash: lineHash('d'), to: 4, to_hash: lineHash('d'), new_text: 'D' },
    ];
    assert.deepEqual(applyEditsToLines(lines, edits), ['A', 'b', 'c', 'D']);
  });

  test('buildEditSummary reports counts', () => {
    const edits: HashEdit[] = [
      { from: 2, from_hash: 'a', to: 3, to_hash: 'b', new_text: 'x\ny' },
    ];
    assert.equal(
      buildEditSummary(edits, 'target.txt'),
      'Successfully applied 1 edit to target.txt (2 lines replaced, 2 lines added).',
    );
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. ARGUMENT DISAMBIGUATION
// ───────────────────────────────────────────────────────────────────

describe('edit_lines argument disambiguation', () => {
  test('detects the sibling edit tool vocabulary', () => {
    const error = detectConfusedEditArgs({ path: 'x.ts', oldText: 'a', newText: 'b' });
    assert.ok(error);
    assert.match(error!, /edit_lines/);
    assert.match(error!, /oldText/);
  });

  test('does not flag a valid edits array', () => {
    assert.equal(detectConfusedEditArgs({ path: 'x.ts', edits: [] }), null);
    assert.equal(detectConfusedEditArgs(null), null);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. REGISTERED HOOK AND TOOL (END TO END)
// ───────────────────────────────────────────────────────────────────

/**
 * Register the real extension against a fake host and capture the hash-verified
 * editing hook and tool.
 *
 * A fresh module instance per capture keeps extension state isolated between
 * tests; interopDefault: false exposes the raw default export instead of
 * jiti's interop wrapper. The annotation hook is registered before the
 * retry-loop guard's tool_result handler, so the first captured tool_result
 * handler is the annotation hook.
 */
async function captureHashVerifiedEditing() {
  type Hook = (event: any, ctx: any) => unknown;
  const hooksByName = new Map<string, Hook[]>();
  let registeredTool: {
    name: string;
    execute: (
      toolCallId: string,
      params: Record<string, unknown>,
      signal: AbortSignal | undefined,
      onUpdate: unknown,
      ctx: { cwd?: string },
    ) => Promise<{ content: { type: string; text?: string }[]; isError?: boolean }>;
  } | undefined;
  const jiti = createJiti(join(process.cwd(), 'tests', 'hash-verified-edits.test.ts'), {
    interopDefault: false,
    moduleCache: false,
  });
  const freshModule = await jiti.import<typeof import('../index.ts')>(
    join(process.cwd(), 'index.ts'),
  );
  const pi = {
    on(type: string, hook: Hook) {
      const list = hooksByName.get(type) ?? [];
      list.push(hook);
      hooksByName.set(type, list);
    },
    registerCommand() {},
    registerTool(tool: unknown) {
      registeredTool = tool as typeof registeredTool;
    },
  } as unknown as ExtensionAPI;
  freshModule.default(pi);
  const toolResultHandlers = hooksByName.get('tool_result') ?? [];
  assert.ok(toolResultHandlers.length >= 1, 'tool_result handler registered');
  assert.ok(registeredTool, 'edit_lines tool registered');
  return { annotationHook: toolResultHandlers[0]!, editLinesTool: registeredTool! };
}

describe('read annotation hook', () => {
  test('annotates a read result with per-line hashes', async () => {
    const { annotationHook } = await captureHashVerifiedEditing();
    const result = await annotationHook(
      {
        toolName: 'read',
        isError: false,
        input: {},
        content: [{ type: 'text', text: 'hello\nworld' }],
        details: undefined,
      },
      {},
    );
    const text =
      (result as { content: { type: string; text?: string }[] }).content[0]?.text ?? '';
    assert.match(text, /^\s{4}1:[0-9a-f]{8}\u2192hello\n\s{4}2:[0-9a-f]{8}\u2192world$/);
    assert.equal(text.split('\n')[0]!.slice(6, 14), lineHash('hello'));
  });

  test('passes through error results and non-read tools', async () => {
    const { annotationHook } = await captureHashVerifiedEditing();
    const errorResult = await annotationHook(
      { toolName: 'read', isError: true, content: [{ type: 'text', text: 'boom' }] },
      {},
    );
    assert.equal(errorResult, undefined);
    const grepResult = await annotationHook(
      { toolName: 'grep', isError: false, content: [{ type: 'text', text: 'x' }] },
      {},
    );
    assert.equal(grepResult, undefined);
  });
});

describe('edit_lines tool end to end', () => {
  test('applies an edit against an unchanged target', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'pi-hash-edit-ok-'));
    try {
      const file = join(tempDir, 'target.txt');
      await writeFile(file, 'one\ntwo\nthree', 'utf8');
      const { editLinesTool } = await captureHashVerifiedEditing();
      const result = await editLinesTool.execute(
        'c1',
        {
          path: file,
          line_count: 3,
          edits: [
            {
              from: 2,
              from_hash: lineHash('two'),
              to: 2,
              to_hash: lineHash('two'),
              new_text: 'TWO',
            },
          ],
        },
        undefined,
        undefined,
        { cwd: tempDir },
      );
      assert.equal(result.isError, undefined);
      const text = result.content.map((c) => c.text ?? '').join('\n');
      assert.match(text, /Successfully applied 1 edit/);
      assert.equal(await readFile(file, 'utf8'), 'one\nTWO\nthree');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('refuses when the target drifted between read and write', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'pi-hash-edit-drift-'));
    try {
      const file = join(tempDir, 'target.txt');
      await writeFile(file, 'one\ntwo\nthree', 'utf8');
      // The model "read" the file and built hashes for line 2 = 'two'.
      const { editLinesTool } = await captureHashVerifiedEditing();
      // The file drifts before the edit applies.
      await writeFile(file, 'one\ntwo!\nthree', 'utf8');
      const result = await editLinesTool.execute(
        'c1',
        {
          path: file,
          line_count: 3,
          edits: [
            {
              from: 2,
              from_hash: lineHash('two'),
              to: 2,
              to_hash: lineHash('two'),
              new_text: 'TWO',
            },
          ],
        },
        undefined,
        undefined,
        { cwd: tempDir },
      );
      assert.equal(result.isError, true);
      const text = result.content.map((c) => c.text ?? '').join('\n');
      // The refusal names what drifted: line, claimed vs actual hash, content.
      assert.match(text, /line 2 hash mismatch/);
      assert.match(text, new RegExp(`claimed "${lineHash('two')}"`));
      assert.match(text, new RegExp(`actual "${lineHash('two!')}"`));
      assert.match(text, /Current line: "two!"/);
      // The drifted file is untouched.
      assert.equal(await readFile(file, 'utf8'), 'one\ntwo!\nthree');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('a near-miss hash still refuses through the tool — no fuzzy fallback', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'pi-hash-edit-near-'));
    try {
      const file = join(tempDir, 'target.txt');
      await writeFile(file, 'one\ntwo!\nthree', 'utf8');
      const { editLinesTool } = await captureHashVerifiedEditing();
      const result = await editLinesTool.execute(
        'c1',
        {
          path: file,
          line_count: 3,
          edits: [
            {
              from: 2,
              from_hash: lineHash('two'), // near miss: actual is 'two!'
              to: 2,
              to_hash: lineHash('two!'),
              new_text: 'TWO',
            },
          ],
        },
        undefined,
        undefined,
        { cwd: tempDir },
      );
      assert.equal(result.isError, true);
      const text = result.content.map((c) => c.text ?? '').join('\n');
      assert.match(text, /line 2 hash mismatch/);
      assert.equal(await readFile(file, 'utf8'), 'one\ntwo!\nthree');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('corrects a confused edit-vocabulary call', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'pi-hash-edit-confused-'));
    try {
      const file = join(tempDir, 'target.txt');
      await writeFile(file, 'one\ntwo\nthree', 'utf8');
      const { editLinesTool } = await captureHashVerifiedEditing();
      const result = await editLinesTool.execute(
        'c1',
        { path: file, oldText: 'two', newText: 'TWO' },
        undefined,
        undefined,
        { cwd: tempDir },
      );
      assert.equal(result.isError, true);
      const text = result.content.map((c) => c.text ?? '').join('\n');
      assert.match(text, /edit_lines received `oldText`\/`newText`/);
      assert.equal(await readFile(file, 'utf8'), 'one\ntwo\nthree');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
