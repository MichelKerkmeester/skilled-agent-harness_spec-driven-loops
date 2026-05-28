#!/usr/bin/env node
/**
 * grader/harness.cjs
 *
 * Primary grader dispatcher for D4 Hallucination dimension. Builds the prompt,
 * dispatches via Claude Code CLI (operator constraint: claude-only), parses
 * the JSON response, caches the result.
 *
 * IMPORTANT: this module BUILDS the dispatch command but does NOT execute it
 * during the 002-eval-rig dry-run gate. 003-eval-loop calls dispatchReal()
 * at iteration time. The dry-run uses dispatchMock() to verify parsing logic.
 *
 * Usage (programmatic):
 *   const { gradeD4 } = require('./grader/harness.cjs');
 *   const result = await gradeD4({ fixture, swe16_output_text, variant_hash, rubric_version });
 *
 * Usage (CLI smoke):
 *   node grader/harness.cjs <fixture.json> <output.md>
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const cache = require('../lib/cache.cjs');

const VERSION = '1.0.0';
const PACKET_ROOT = path.resolve(__dirname, '..');
const SYSTEM_PROMPT_PATH = path.join(__dirname, 'prompts', 'system-grader.md');
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';
const GRADER_MODEL = process.env.GRADER_MODEL || 'claude-sonnet-4-5';
const DISPATCH_TIMEOUT_MS = 120 * 1000;

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function readSystemPrompt() {
  return fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
}

function composeGraderPrompt(fixture, swe16OutputText) {
  const systemPrompt = readSystemPrompt();
  const userPrompt = [
    '# Fixture metadata',
    '```json',
    JSON.stringify(fixture, null, 2),
    '```',
    '',
    '# SWE 1.6 output to grade',
    '```',
    swe16OutputText,
    '```',
    '',
    'Score D4 Hallucination only. Return JSON only per the system prompt.',
  ].join('\n');
  return { systemPrompt, userPrompt };
}

function parseGraderResponse(rawText) {
  // Try strict JSON parse first
  const trimmed = rawText.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.score === 'number' && parsed.dim_id) {
      return { parse_status: 'ok', parsed };
    }
  } catch (_) {
    // fall through to fallback extraction
  }
  // Fallback: try to extract JSON object inside ```json ... ``` or first { ... }
  const fenced = rawText.match(/```json\s*([\s\S]+?)```/);
  if (fenced) {
    try {
      const parsed = JSON.parse(fenced[1].trim());
      if (typeof parsed.score === 'number') {
        return { parse_status: 'fallback_fenced', parsed };
      }
    } catch (_) {
      // continue
    }
  }
  const objMatch = rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (typeof parsed.score === 'number') {
        return { parse_status: 'fallback_regex', parsed };
      }
    } catch (_) {
      // continue
    }
  }
  // Last resort: extract score via regex only
  const scoreMatch = rawText.match(/"score"\s*:\s*([\d.]+)/);
  if (scoreMatch) {
    return {
      parse_status: 'fallback_score_only',
      parsed: {
        dim_id: 'D4',
        score: parseFloat(scoreMatch[1]),
        confidence: 0.3,
        rationale: 'parse fallback; full JSON not extracted',
        evidence: [],
        version: VERSION,
      },
    };
  }
  return { parse_status: 'failed', parsed: null };
}

function dispatchReal(prompt) {
  // Executes claude CLI with the composed prompt. Operator constraint: claude only.
  // Returns stdout text. Errors propagate.
  const args = ['--print', '--model', GRADER_MODEL, '-p', prompt.systemPrompt + '\n\n' + prompt.userPrompt];
  return execFileSync(CLAUDE_BIN, args, {
    timeout: DISPATCH_TIMEOUT_MS,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function dispatchMock(prompt, mockMode) {
  // Used by 002 dry-run gate to verify parser without hitting real CLI.
  if (mockMode === 'high-confidence') {
    return JSON.stringify({
      dim_id: 'D4',
      score: 0.95,
      confidence: 0.9,
      rationale: 'all symbols and flags in output verified against allowlist',
      evidence: [],
      version: VERSION,
    });
  }
  if (mockMode === 'low-confidence') {
    return JSON.stringify({
      dim_id: 'D4',
      score: 0.5,
      confidence: 0.4,
      rationale: 'unable to verify several symbols',
      evidence: ['unknownFunction1', '--maybe-flag'],
      version: VERSION,
    });
  }
  if (mockMode === 'parse-failure') {
    return 'I cannot grade this. The output is malformed and lacks structure. ' +
           'In any case, my best guess is that some symbols appear hallucinated.';
  }
  if (mockMode === 'fenced') {
    return 'Here is my grade:\n```json\n' + JSON.stringify({
      dim_id: 'D4', score: 0.7, confidence: 0.8, rationale: 'mixed', evidence: [], version: VERSION,
    }) + '\n```';
  }
  // default fall-through
  return JSON.stringify({
    dim_id: 'D4',
    score: 0.85,
    confidence: 0.85,
    rationale: 'mock default',
    evidence: [],
    version: VERSION,
  });
}

async function gradeD4(opts) {
  const {
    fixture,
    swe16_output_text,
    variant_hash,
    rubric_version,
    grader_model_build_hash,
    mode, // 'real' | 'mock-high-confidence' | 'mock-low-confidence' | etc.
    mock_mode,
  } = opts;

  const swe16OutputHash = sha256Hex(swe16_output_text);
  const cacheKey = cache.derive_grader_key({
    variant_hash,
    fixture_id: fixture.id,
    rubric_version: rubric_version || 'v1.0.0',
    grader_model_build_hash,
    dim_id: 'D4',
    swe16_output_hash: swe16OutputHash,
  });

  const cached = cache.read('grader', cacheKey);
  if (cached) {
    return { cache_hit: true, cache_key: cacheKey, ...JSON.parse(cached.body) };
  }

  const prompt = composeGraderPrompt(fixture, swe16_output_text);
  let rawResponse;
  if (mode === 'real') {
    rawResponse = dispatchReal(prompt);
  } else {
    rawResponse = dispatchMock(prompt, mock_mode || 'default');
  }

  const { parse_status, parsed } = parseGraderResponse(rawResponse);
  const result = {
    cache_hit: false,
    cache_key: cacheKey,
    raw_grader_output: rawResponse,
    parse_status,
    ...(parsed || { score: 0.0, confidence: 0.0, rationale: 'parse failed', evidence: [], dim_id: 'D4', version: VERSION }),
  };

  // Cache the result body (excluding cache_key + cache_hit for cleaner blob)
  const blobBody = JSON.stringify({
    score: result.score,
    confidence: result.confidence,
    rationale: result.rationale,
    evidence: result.evidence,
    dim_id: result.dim_id,
    parse_status: result.parse_status,
    raw_grader_output: result.raw_grader_output,
    version: VERSION,
  });
  cache.write_atomic('grader', cacheKey, blobBody, {
    dim_id: 'D4',
    fixture_id: fixture.id,
    variant_hash,
    rubric_version: rubric_version || 'v1.0.0',
    grader_model: GRADER_MODEL,
    parse_status,
  });

  return result;
}

function main() {
  const [fixturePath, outputPath, modeArg] = process.argv.slice(2);
  if (!fixturePath || !outputPath) {
    process.stderr.write('usage: harness.cjs <fixture.json> <output.md> [mode]\n');
    process.stderr.write('  mode: real | mock-default | mock-high-confidence | mock-low-confidence | mock-parse-failure | mock-fenced\n');
    process.exit(2);
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const outputText = fs.readFileSync(outputPath, 'utf8');
  const mode = modeArg && modeArg.startsWith('mock') ? 'mock' : (modeArg || 'mock');
  const mockMode = modeArg && modeArg.startsWith('mock-') ? modeArg.slice('mock-'.length) : 'default';
  const opts = {
    fixture,
    swe16_output_text: outputText,
    variant_hash: 'cli-smoke-test',
    rubric_version: 'v1.0.0',
    mode,
    mock_mode: mockMode,
  };
  gradeD4(opts).then((result) => {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  }).catch((err) => {
    process.stderr.write('grader error: ' + err.message + '\n');
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  gradeD4,
  composeGraderPrompt,
  parseGraderResponse,
  dispatchReal,
  dispatchMock,
  VERSION,
};
