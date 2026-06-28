#!/usr/bin/env node
/**
 * scripts/extract-with-grader.cjs
 *
 * Optional second-pass extraction for blocks that the regex-based extractor
 * skipped (no path inferred). Dispatches a small claude-sonnet call asking
 * "what file path should this block be at?" for each skipped block that has
 * semantic signal (TypeScript class declaration, shell script with shebang,
 * Python class/def, etc.). Caches responses keyed on
 * sha256(block_content + fixture_id) so re-runs are free.
 *
 * Conservative: skip blocks that are clearly not source code (raw text,
 * markdown prose, JSON-only data). Skip blocks under 50 chars. Skip blocks
 * the regex extractor already wrote.
 *
 * Usage:
 *   node extract-with-grader.cjs <output.md> <fixture-cwd-abs> [--mock]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const { extract: regexExtract } = require('./extract-files-from-markdown.cjs');

const VERSION = '1.0.0';
const PACKET_ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(PACKET_ROOT, 'state', 'extraction-grader-cache');
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';
const GRADER_MODEL = process.env.GRADER_MODEL || 'claude-sonnet-4-5';

// Semantic signals: block has SOMETHING that looks like code-and-needs-a-path
const SEMANTIC_PATTERNS = [
  /^(export\s+)?(async\s+)?(function|class|const|let|var)\s+[A-Za-z_$]/m, // JS/TS declarations
  /^def\s+[A-Za-z_]/m,                       // Python def
  /^class\s+[A-Z]/m,                          // Class declaration
  /^#!\/(usr\/)?bin\/(bash|sh|zsh|env)/,      // shell shebang
  /^(import|from)\s+/m,                       // import statement
  /^(package|use|namespace)\s+/m,             // package declaration
  /^module\.exports\s*=/m,                    // CommonJS
];

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function hasSemanticSignal(blockBody) {
  if (!blockBody || blockBody.length < 50) return false;
  return SEMANTIC_PATTERNS.some((re) => re.test(blockBody));
}

function cacheKey(blockBody, fixtureId) {
  return sha256Hex(blockBody + '\x00' + (fixtureId || '')).slice(0, 32);
}

function readCache(key) {
  const file = path.join(CACHE_DIR, key + '.json');
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return null; }
}

function writeCache(key, value) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, key + '.json'), JSON.stringify(value, null, 2));
}

function composeGraderPrompt(blockBody, fenceLang, fixtureId) {
  const truncated = blockBody.length > 2000 ? blockBody.slice(0, 2000) + '\n... [truncated]' : blockBody;
  return [
    'You are inferring a file path for a code block extracted from a markdown response.',
    '',
    `Fixture context: ${fixtureId || 'unknown'}`,
    `Fence language: ${fenceLang || 'unknown'}`,
    '',
    'Block content:',
    '```',
    truncated,
    '```',
    '',
    'Return JSON ONLY in this exact shape (no preamble, no commentary outside the JSON):',
    '{"inferred_path": "<relative path or null>", "confidence": <0.0_to_1.0>, "reason": "<one short sentence>"}',
    '',
    'Rules:',
    '- Path must be RELATIVE (no leading /, no ..)',
    '- Path must include the extension matching the fence language',
    '- If you cannot confidently infer a path, return null',
    '- Confidence < 0.7 means low certainty (the harness will discard)',
    '- Common patterns: src/<name>.<ext>, scripts/<name>.<ext>, lib/<name>.<ext>',
  ].join('\n');
}

function parseGraderResponse(rawText) {
  const trimmed = rawText.trim();
  // Try strict parse
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.inferred_path !== undefined) return parsed;
  } catch (_) {}
  // Try fenced JSON
  const fenced = rawText.match(/```(?:json)?\s*([\s\S]+?)```/);
  if (fenced) {
    try {
      const parsed = JSON.parse(fenced[1].trim());
      if (parsed.inferred_path !== undefined) return parsed;
    } catch (_) {}
  }
  // Try first object
  const objMatch = rawText.match(/\{[\s\S]*?"inferred_path"[\s\S]*?\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch (_) {}
  }
  return null;
}

function dispatchGraderReal(prompt) {
  const out = execFileSync(CLAUDE_BIN, ['--print', '--model', GRADER_MODEL, '-p', prompt], {
    encoding: 'utf8',
    timeout: 60000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return out;
}

function dispatchGraderMock(prompt) {
  // Return a sensible mock for testing without real API spend
  const blockMatch = prompt.match(/```\n([\s\S]+?)\n```/);
  const body = blockMatch ? blockMatch[1] : '';
  if (/function\s+formatBytes/.test(body)) {
    return JSON.stringify({ inferred_path: 'src/utils/format.ts', confidence: 0.85, reason: 'TS function declaration suggests src/utils' });
  }
  if (/#!\/.*bash/.test(body)) {
    return JSON.stringify({ inferred_path: 'scripts/run.sh', confidence: 0.7, reason: 'bash shebang' });
  }
  return JSON.stringify({ inferred_path: null, confidence: 0.5, reason: 'mock default' });
}

function extractFullBodies(swe16OutputText) {
  // Re-parse to get FULL block bodies (regexExtract returns truncated previews in `skipped`).
  // Returns array of { start_line, fence_lang, body }.
  const lines = swe16OutputText.split('\n');
  const FENCE_RE = /^```(\w*)\s*$/;
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(FENCE_RE);
    if (!m) { i++; continue; }
    const start = i;
    const lang = m[1] || 'unknown';
    let end = i + 1;
    while (end < lines.length && !lines[end].match(FENCE_RE)) end++;
    out.push({ start_line: start, fence_lang: lang, body: lines.slice(start + 1, end).join('\n') });
    i = end + 1;
  }
  return out;
}

function extractWithGrader(swe16OutputText, fixtureCwdAbs, opts = {}) {
  const mock = opts.mock === true;
  const fixtureId = opts.fixture_id || null;
  const confidenceFloor = opts.confidence_floor !== undefined ? opts.confidence_floor : 0.7;

  // First pass: regex extraction
  const firstPass = regexExtract(swe16OutputText, fixtureCwdAbs, opts);

  // Build a set of block-start-lines that the regex pass already wrote, so we don't re-write them.
  // (regexExtract doesn't currently expose block_start_line for written blocks; for now we
  // dedupe by re-running fence detection and excluding skipped previews that match.)
  const allBlocks = extractFullBodies(swe16OutputText);
  const skippedStartLines = new Set(firstPass.skipped.map((s) => s.block_start_line));

  // Second pass: for each skipped block with semantic signal, try grader
  const graderWritten = [];
  const graderSkipped = [];
  for (const block of allBlocks) {
    if (!skippedStartLines.has(block.start_line)) continue;  // already-written, skip
    if (!hasSemanticSignal(block.body)) {
      graderSkipped.push({ block_start_line: block.start_line, fence_lang: block.fence_lang, grader_reason: 'no semantic signal' });
      continue;
    }
    const key = cacheKey(block.body, fixtureId);
    let cached = readCache(key);
    if (!cached) {
      const prompt = composeGraderPrompt(block.body, block.fence_lang, fixtureId);
      try {
        const raw = mock ? dispatchGraderMock(prompt) : dispatchGraderReal(prompt);
        const parsed = parseGraderResponse(raw);
        cached = { raw, parsed, when: new Date().toISOString() };
        writeCache(key, cached);
      } catch (err) {
        graderSkipped.push({ block_start_line: block.start_line, grader_reason: 'dispatch error: ' + err.message });
        continue;
      }
    }
    const parsed = cached.parsed;
    if (!parsed || !parsed.inferred_path || (parsed.confidence !== undefined && parsed.confidence < confidenceFloor)) {
      graderSkipped.push({ block_start_line: block.start_line, grader_reason: 'low confidence or null path', grader_response: parsed });
      continue;
    }
    // Write the file based on grader's inferred path
    const targetAbs = path.resolve(fixtureCwdAbs, parsed.inferred_path);
    if (!targetAbs.startsWith(fixtureCwdAbs + path.sep) && targetAbs !== fixtureCwdAbs) {
      graderSkipped.push({ block_start_line: block.start_line, grader_reason: 'path traversal rejected', grader_response: parsed });
      continue;
    }
    fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
    fs.writeFileSync(targetAbs, block.body);
    graderWritten.push({
      inferred_path: parsed.inferred_path,
      inferred_from: 'grader_inference',
      confidence: parsed.confidence,
      target_abs: targetAbs,
      bytes_written: Buffer.byteLength(block.body, 'utf8'),
    });
  }

  return {
    regex_written: firstPass.written,
    regex_skipped: firstPass.skipped,
    grader_written: graderWritten,
    grader_skipped: graderSkipped,
    summary: {
      total_blocks: firstPass.written.length + firstPass.skipped.length,
      regex_written_count: firstPass.written.length,
      grader_written_count: graderWritten.length,
      grader_skipped_count: graderSkipped.length,
    },
    version: VERSION,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const mock = argv.includes('--mock');
  const args = argv.filter((a) => !a.startsWith('--'));
  const [outputFile, fixtureCwdAbs] = args;
  if (!outputFile || !fixtureCwdAbs) {
    process.stderr.write('usage: extract-with-grader.cjs <output.md> <fixture-cwd-abs> [--mock]\n');
    process.exit(2);
  }
  if (!fs.existsSync(fixtureCwdAbs)) fs.mkdirSync(fixtureCwdAbs, { recursive: true });
  const text = fs.readFileSync(outputFile, 'utf8');
  const result = extractWithGrader(text, fixtureCwdAbs, { mock, fixture_id: path.basename(outputFile, '.md') });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) main();

module.exports = { extractWithGrader, hasSemanticSignal, composeGraderPrompt, parseGraderResponse, extractFullBodies, VERSION };
