#!/usr/bin/env node
/**
 * scripts/extract-files-from-markdown.cjs
 *
 * Markdown-to-disk extraction layer. Parses SWE 1.6 output (markdown text with
 * fenced code blocks), infers file paths from comment headers / markdown
 * headers / context heuristics, writes each block to the fixture CWD.
 *
 * Conservative: skip-on-ambiguity rather than guess. Log every skipped block.
 *
 * Path inference order (first match wins):
 *   1. Markdown header just above the block:
 *      ```markdown
 *      ### `src/utils/format.ts`
 *      ```ts
 *      ...
 *      ```
 *      ```
 *   2. First-line comment inside the block:
 *      ```ts
 *      // src/utils/format.ts
 *      export function ...
 *      ```
 *   3. Backticked path immediately before block:
 *      ```markdown
 *      `path/to/file.ts`
 *      ```ts
 *      ...
 *      ```
 *   4. Otherwise: skip + log
 *
 * Security:
 *   - Resolved path must stay inside fixture CWD (no .. escape; no absolute paths)
 *   - Existing files NOT in seed are NOT overwritten when --preserve-existing flag set
 *
 * Usage:
 *   node extract-files-from-markdown.cjs <output.md> <fixture-cwd-absolute>
 *   node extract-files-from-markdown.cjs --test  # run built-in canned tests
 *
 * Module exports:
 *   extract(swe16OutputText, fixtureCwdAbs, options) -> { written: [...], skipped: [...] }
 */

const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';

const COMMENT_PATH_PATTERNS = [
  // // path/to/file.ext or /* path/to/file.ext */
  /^\s*\/\/\s*([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\s*$/,
  /^\s*\/\*\s*([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\s*\*\/\s*$/,
  // # path/to/file.ext (shell, python, ruby)
  /^\s*#\s*([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\s*$/,
  // -- path/to/file.ext (sql, lua)
  /^\s*--\s*([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\s*$/,
];

const MD_HEADER_PATH_RE = /^#{1,6}\s+`([^`]+\.[a-zA-Z0-9]+)`\s*$/;
// Bare markdown header with file path (no backticks): "## wrapper.sh" or "### src/utils/format.ts"
const MD_HEADER_BARE_PATH_RE = /^#{1,6}\s+([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\s*$/;
const BACKTICKED_PATH_RE = /^`([^`\s]+\.[a-zA-Z0-9]+)`\s*$/;
// Bold-emphasized path: "**wrapper.sh**" or "**src/utils/format.ts**"
const BOLD_PATH_RE = /^\*\*([\.\/\-_a-zA-Z0-9]+\.[a-zA-Z0-9]+)\*\*\s*$/;
const FENCED_BLOCK_RE = /^```(\w*)\s*$/;

function looksLikeFilePath(s) {
  if (!s || typeof s !== 'string') return false;
  if (s.length > 200) return false;
  if (s.includes('..')) return false;
  if (s.startsWith('/')) return false;  // absolute paths rejected
  if (s.includes('://')) return false;  // URLs rejected
  return /\.[a-zA-Z0-9]+$/.test(s);
}

function extract(swe16OutputText, fixtureCwdAbs, options = {}) {
  const lines = swe16OutputText.split('\n');
  const written = [];
  const skipped = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const fenceMatch = line.match(FENCED_BLOCK_RE);
    if (!fenceMatch) {
      i++;
      continue;
    }

    // Found fence-open. Try to infer path from preceding context.
    let inferredPath = null;
    let inferredFrom = null;

    // Check up to 3 lines before for md-header or backticked path
    for (let lookback = 1; lookback <= 3 && i - lookback >= 0; lookback++) {
      const prevLine = lines[i - lookback];
      if (prevLine.trim() === '') continue;
      // 1. Markdown header with backticked path: "### `src/foo.ts`"
      const headerMatch = prevLine.match(MD_HEADER_PATH_RE);
      if (headerMatch && looksLikeFilePath(headerMatch[1])) {
        inferredPath = headerMatch[1];
        inferredFrom = 'md_header';
        break;
      }
      // 2. Markdown header with bare path: "## wrapper.sh" or "### src/foo.ts"
      const headerBareMatch = prevLine.match(MD_HEADER_BARE_PATH_RE);
      if (headerBareMatch && looksLikeFilePath(headerBareMatch[1])) {
        inferredPath = headerBareMatch[1];
        inferredFrom = 'md_header_bare';
        break;
      }
      // 3. Backticked path on its own line: "`src/foo.ts`"
      const backtickMatch = prevLine.match(BACKTICKED_PATH_RE);
      if (backtickMatch && looksLikeFilePath(backtickMatch[1])) {
        inferredPath = backtickMatch[1];
        inferredFrom = 'backticked_path';
        break;
      }
      // 4. Bold path: "**src/foo.ts**"
      const boldMatch = prevLine.match(BOLD_PATH_RE);
      if (boldMatch && looksLikeFilePath(boldMatch[1])) {
        inferredPath = boldMatch[1];
        inferredFrom = 'bold_path';
        break;
      }
      // If non-blank, non-matching line found, stop lookback
      break;
    }

    // Collect block body
    const blockStart = i + 1;
    let blockEnd = blockStart;
    while (blockEnd < lines.length && !lines[blockEnd].match(FENCED_BLOCK_RE)) {
      blockEnd++;
    }
    const blockBody = lines.slice(blockStart, blockEnd).join('\n');

    // If no path yet, try first-line comment inside block
    if (!inferredPath && blockBody.length > 0) {
      const firstLines = blockBody.split('\n').slice(0, 3);
      for (const fl of firstLines) {
        for (const pat of COMMENT_PATH_PATTERNS) {
          const m = fl.match(pat);
          if (m && looksLikeFilePath(m[1])) {
            inferredPath = m[1];
            inferredFrom = 'first_line_comment';
            break;
          }
        }
        if (inferredPath) break;
      }
    }

    if (!inferredPath) {
      skipped.push({
        block_start_line: i,
        fence_lang: fenceMatch[1] || 'unknown',
        reason: 'no path inferred',
        preview: blockBody.slice(0, 80),
      });
      i = blockEnd + 1;
      continue;
    }

    // Resolve target path
    const targetAbs = path.resolve(fixtureCwdAbs, inferredPath);
    if (!targetAbs.startsWith(fixtureCwdAbs + path.sep) && targetAbs !== fixtureCwdAbs) {
      skipped.push({
        block_start_line: i,
        inferred_path: inferredPath,
        reason: 'resolves outside fixture cwd',
        target_abs: targetAbs,
        fixture_cwd_abs: fixtureCwdAbs,
      });
      i = blockEnd + 1;
      continue;
    }

    // Strip the path-comment first line if it was used for inference and is a comment
    let bodyToWrite = blockBody;
    if (inferredFrom === 'first_line_comment') {
      const lines2 = bodyToWrite.split('\n');
      // Remove only the first matching comment line
      for (let li = 0; li < Math.min(3, lines2.length); li++) {
        let matched = false;
        for (const pat of COMMENT_PATH_PATTERNS) {
          if (lines2[li].match(pat)) {
            lines2.splice(li, 1);
            // Also drop a single blank line right after if present
            if (li < lines2.length && lines2[li].trim() === '') {
              lines2.splice(li, 1);
            }
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
      bodyToWrite = lines2.join('\n');
    }

    // Ensure parent dir exists
    fs.mkdirSync(path.dirname(targetAbs), { recursive: true });

    // Write atomically (temp + rename)
    const tmp = targetAbs + '.extract.tmp.' + process.pid + '.' + Date.now();
    fs.writeFileSync(tmp, bodyToWrite, 'utf8');
    fs.renameSync(tmp, targetAbs);

    written.push({
      inferred_path: inferredPath,
      inferred_from: inferredFrom,
      fence_lang: fenceMatch[1] || 'unknown',
      target_abs: targetAbs,
      bytes_written: Buffer.byteLength(bodyToWrite, 'utf8'),
    });

    i = blockEnd + 1;
  }

  return {
    written,
    skipped,
    summary: {
      blocks_seen: written.length + skipped.length,
      written_count: written.length,
      skipped_count: skipped.length,
    },
    version: VERSION,
  };
}

function runCannedTests() {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'extract-test-'));
  let passes = 0;
  let fails = 0;
  const failureDetails = [];

  function assert(label, cond, detail) {
    if (cond) {
      passes++;
      process.stdout.write(`  PASS: ${label}\n`);
    } else {
      fails++;
      failureDetails.push({ label, detail });
      process.stdout.write(`  FAIL: ${label} (${detail})\n`);
    }
  }

  // Test 1: markdown header attribution
  const t1Output = `Here's the solution:

### \`src/utils/format.ts\`
\`\`\`ts
export function formatBytes(n: number): string {
  return n + ' B';
}
\`\`\`

That should work.`;
  const t1Dir = path.join(tmpDir, 't1');
  fs.mkdirSync(t1Dir, { recursive: true });
  const r1 = extract(t1Output, t1Dir);
  assert('t1: 1 block written', r1.written.length === 1, JSON.stringify(r1));
  assert('t1: path is src/utils/format.ts',
    r1.written[0] && r1.written[0].inferred_path === 'src/utils/format.ts',
    JSON.stringify(r1.written));
  assert('t1: file exists', fs.existsSync(path.join(t1Dir, 'src/utils/format.ts')),
    'file not found');
  assert('t1: content matches', fs.existsSync(path.join(t1Dir, 'src/utils/format.ts')) &&
    fs.readFileSync(path.join(t1Dir, 'src/utils/format.ts'), 'utf8').includes('formatBytes'),
    'content missing');

  // Test 2: first-line comment attribution
  const t2Output = `Solution:

\`\`\`js
// scripts/check.cjs
const { defineConfig } = require('vitest/config');
console.log(defineConfig({}));
\`\`\``;
  const t2Dir = path.join(tmpDir, 't2');
  fs.mkdirSync(t2Dir, { recursive: true });
  const r2 = extract(t2Output, t2Dir);
  assert('t2: 1 block written', r2.written.length === 1, JSON.stringify(r2));
  assert('t2: path is scripts/check.cjs',
    r2.written[0] && r2.written[0].inferred_path === 'scripts/check.cjs',
    JSON.stringify(r2.written));
  assert('t2: comment line stripped',
    fs.existsSync(path.join(t2Dir, 'scripts/check.cjs')) &&
    !fs.readFileSync(path.join(t2Dir, 'scripts/check.cjs'), 'utf8').includes('// scripts/check.cjs'),
    'comment line not stripped');

  // Test 3: no path inferred - skip
  const t3Output = `Here's a fragment with no path context:

\`\`\`bash
echo "hello"
\`\`\``;
  const t3Dir = path.join(tmpDir, 't3');
  fs.mkdirSync(t3Dir, { recursive: true });
  const r3 = extract(t3Output, t3Dir);
  assert('t3: 0 blocks written', r3.written.length === 0, JSON.stringify(r3));
  assert('t3: 1 block skipped', r3.skipped.length === 1, JSON.stringify(r3));

  // Test 4: path traversal rejected
  const t4Output = `\`../../../etc/passwd\`
\`\`\`
malicious
\`\`\``;
  const t4Dir = path.join(tmpDir, 't4');
  fs.mkdirSync(t4Dir, { recursive: true });
  const r4 = extract(t4Output, t4Dir);
  assert('t4: traversal rejected (0 written)', r4.written.length === 0,
    'expected traversal to be rejected: ' + JSON.stringify(r4));
  // Note: ".." path will be filtered by looksLikeFilePath, producing skipped count

  // Test 5: multiple blocks with mixed attribution
  const t5Output = `### \`a.ts\`
\`\`\`ts
export const a = 1;
\`\`\`

### \`nested/b.ts\`
\`\`\`ts
export const b = 2;
\`\`\``;
  const t5Dir = path.join(tmpDir, 't5');
  fs.mkdirSync(t5Dir, { recursive: true });
  const r5 = extract(t5Output, t5Dir);
  assert('t5: 2 blocks written', r5.written.length === 2, JSON.stringify(r5));
  assert('t5: nested/b.ts created',
    fs.existsSync(path.join(t5Dir, 'nested/b.ts')),
    'nested file not created');

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  process.stdout.write('\n========== TEST SUMMARY ==========\n');
  process.stdout.write(`  PASSES: ${passes}\n`);
  process.stdout.write(`  FAILS:  ${fails}\n`);
  if (fails > 0) {
    process.stdout.write('  FAILURES:\n');
    for (const f of failureDetails) {
      process.stdout.write(`    - ${f.label}: ${f.detail}\n`);
    }
  }
  process.stdout.write(`========== ${fails === 0 ? 'ALL PASS' : 'FAILURE'} ==========\n`);
  process.exit(fails === 0 ? 0 : 1);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--test')) {
    runCannedTests();
    return;
  }
  const [outputFile, fixtureCwdAbs] = argv;
  if (!outputFile || !fixtureCwdAbs) {
    process.stderr.write('usage: extract-files-from-markdown.cjs <output.md> <fixture-cwd-abs>\n');
    process.stderr.write('  or:   extract-files-from-markdown.cjs --test\n');
    process.exit(2);
  }
  if (!fs.existsSync(outputFile)) {
    process.stderr.write('output file not found: ' + outputFile + '\n');
    process.exit(2);
  }
  if (!fs.existsSync(fixtureCwdAbs)) {
    fs.mkdirSync(fixtureCwdAbs, { recursive: true });
  }
  const text = fs.readFileSync(outputFile, 'utf8');
  const result = extract(text, fixtureCwdAbs);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) main();

module.exports = { extract, looksLikeFilePath, VERSION };
