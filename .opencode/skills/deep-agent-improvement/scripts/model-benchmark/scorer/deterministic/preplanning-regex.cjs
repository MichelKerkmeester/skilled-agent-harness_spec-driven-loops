#!/usr/bin/env node
'use strict';

/**
 * scripts/deterministic/preplanning-regex.cjs
 *
 * D5 Pre-plan structure check (rubric weight 0.10, never a hard gate).
 *
 * Looks for a <pre-plan> ... </pre-plan> block in the output. Scores the
 * block on three signals:
 *   1. Block presence (open and close tags).
 *   2. >= 3 numbered steps inside.
 *   3. Each numbered step has both an acceptance criterion line and a
 *      verification command line (heuristic regex; case-insensitive).
 *
 * Score policy:
 *   1.0 = block present, >= 3 numbered steps, every step has both
 *         acceptance criterion + verification command.
 *   0.6 = block present, >= 3 numbered steps, but some steps are missing
 *         acceptance OR verification.
 *   0.6 = block present, >= 3 numbered steps, but only 2 of 3 quality
 *         signals satisfied overall.
 *   0.0 = no <pre-plan> block.
 *
 * Usage:
 *   node scripts/deterministic/preplanning-regex.cjs <fixture.json> <output.md>
 */

const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';

function emit(payload) {
  process.stdout.write(JSON.stringify(payload) + '\n');
}

function loadOutput(outputPath) {
  if (!fs.existsSync(outputPath)) {
    return null;
  }
  return fs.readFileSync(outputPath, 'utf8');
}

function findPrePlanBlock(text) {
  const re = /<pre-plan>([\s\S]*?)<\/pre-plan>/i;
  const m = text.match(re);
  return m ? m[1] : null;
}

function extractNumberedSteps(block) {
  // Match numbered step starters like "1.", "1)", "Step 1:".
  // Steps are split on a line beginning with a number-dot or number-paren
  // or "Step N:" pattern.
  const lines = block.split('\n');
  const stepStartRe = /^\s*(?:step\s+)?(\d+)\s*[\.\):]\s+/i;
  const steps = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(stepStartRe);
    if (m) {
      if (current) steps.push(current);
      current = { number: parseInt(m[1], 10), body: [line] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) steps.push(current);
  return steps;
}

function stepHasAcceptance(step) {
  const joined = step.body.join('\n');
  return /\b(acceptance|criterion|criteria|pass(es)?\s*when|success)\b/i.test(joined);
}

function stepHasVerification(step) {
  const joined = step.body.join('\n');
  // Look for verification line OR an inline command (fenced code, $ prefix, npm/node/bash invocation).
  if (/\b(verif(y|ication)|validate|run\b.*(test|check)|`?(npm|node|bash|sh|npx|vitest|pytest|cargo)\b)/i.test(joined)) {
    return true;
  }
  if (/`\$\s+\S+/.test(joined)) return true;
  return false;
}

function scoreBlock(text) {
  const block = findPrePlanBlock(text);
  if (!block) {
    return {
      score: 0.0,
      passed: false,
      details: {
        block_present: false,
        steps_found: 0,
        steps_complete: 0,
        reason: 'no <pre-plan> block found',
      },
      version: VERSION,
    };
  }
  const steps = extractNumberedSteps(block);
  const stepsFound = steps.length;
  const stepsComplete = steps.filter((s) => stepHasAcceptance(s) && stepHasVerification(s)).length;
  let signals = 0;
  signals += 1; // block present
  signals += stepsFound >= 3 ? 1 : 0;
  signals += stepsComplete === stepsFound && stepsFound >= 3 ? 1 : 0;

  let score = 0.0;
  if (signals === 3) score = 1.0;
  else if (signals === 2) score = 0.6;
  else if (signals === 1) score = 0.3;
  else score = 0.0;

  return {
    score,
    passed: score >= 0.6,
    details: {
      block_present: true,
      steps_found: stepsFound,
      steps_complete: stepsComplete,
      signals_satisfied: signals,
    },
    version: VERSION,
  };
}

function main() {
  const [fixturePath, outputPath] = process.argv.slice(2);
  if (!fixturePath || !outputPath) {
    process.stderr.write('usage: preplanning-regex.cjs <fixture.json> <output.md>\n');
    process.exit(2);
  }
  const text = loadOutput(outputPath);
  if (text === null) {
    emit({
      score: 0.0,
      passed: false,
      details: { error: 'output file missing', path: outputPath },
      version: VERSION,
    });
    process.exit(0);
  }
  emit(scoreBlock(text));
}

if (require.main === module) {
  main();
}

module.exports = { scoreBlock, VERSION };
