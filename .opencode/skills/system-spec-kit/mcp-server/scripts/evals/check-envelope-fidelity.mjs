#!/usr/bin/env node

// ── envelope-fidelity check: the post-render verdict replay ──────────────────
//
// The 029 model benchmark caught soft spot B: the memory-search tool always
// ships requestQuality and citationPolicy on a non-empty result, the verdict is
// correct, but a weaker model drops the two fields from the rendered block. A
// reader of a weak render cannot tell whether the verdict was withheld or simply
// dropped, so the correct verdict is robust only when a strong model renders it.
//
// This check is deterministic and runs on a captured verdict plus a rendered
// string with no live retrieval. It replays each field the tool shipped against
// the render and asserts the field is present and unmodified. A renamed field
// reads as dropped, an altered verdict value reads as altered, and the two are
// reported distinctly so a clean omission and a wrong value never blur together.
//
// Two modes. Fail mode (default) exits non-zero when a shipped field is dropped
// or altered, so it can gate. Grandfather report mode lists the same
// non-conforming render and exits zero, so the existing render corpus does not
// block adoption before the default-on flip, which is gated on a clean
// grandfather report. The check measures render fidelity, it never moves the
// verdict.
//
// The tool ships no verdict on an empty result set or when confidence is
// disabled. The check treats a missing label and policy as nothing-to-replay
// and passes, so a legitimately absent verdict is never a fidelity failure.

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// Render-side field names the verdict pair maps to. The fragment the formatter
// emits and the presentation asset both render these exact names, so the replay
// keys on them.
const FIELD_REQUEST_QUALITY = 'requestQuality';
const FIELD_CITATION_POLICY = 'citationPolicy';

/**
 * Pull the verdict pair off a captured tool envelope or a bare verdict object.
 * Accepts either the full response data ({ requestQuality: { label }, citationPolicy })
 * or a flattened ({ label, citationPolicy }) shape, and returns nulls for a
 * verdict the tool did not ship.
 */
export function extractVerdict(input) {
  if (!input || typeof input !== 'object') {
    return { label: null, policy: null };
  }
  const data = typeof input.data === 'object' && input.data !== null ? input.data : input;
  const label = typeof data.requestQuality?.label === 'string'
    ? data.requestQuality.label
    : (typeof data.label === 'string' ? data.label : null);
  const policy = typeof data.citationPolicy === 'string' ? data.citationPolicy : null;
  return { label, policy };
}

/**
 * Read a named trailing field value off a rendered block. Matches the exact
 * field name followed by its value token, so a renamed field (quality instead of
 * requestQuality) is not matched and reads downstream as dropped. Returns the
 * value token, or null when the field name is absent.
 */
export function readRenderedField(rendered, fieldName) {
  if (typeof rendered !== 'string') return null;
  const pattern = new RegExp(`(?:^|\\n)\\s*${fieldName}\\s+(\\S+)`);
  const match = rendered.match(pattern);
  return match ? match[1] : null;
}

/**
 * Replay the shipped verdict against a rendered block. Returns a report with the
 * mode, a conforming flag, an ok flag (ok is conforming OR grandfather mode), a
 * status, and the per-field findings. A dropped field and an altered value are
 * distinct finding kinds.
 */
export function checkEnvelopeFidelity(verdictInput, rendered, options = {}) {
  const mode = options.mode === 'grandfather' ? 'grandfather' : 'fail';
  const { label, policy } = extractVerdict(verdictInput);

  // Nothing-to-replay: the tool shipped no verdict (empty result set or
  // confidence disabled), so the render has nothing to keep.
  if (label === null && policy === null) {
    return { mode, conforming: true, ok: true, status: 'nothing_to_replay', findings: [] };
  }

  const findings = [];

  if (label !== null) {
    const rendered_value = readRenderedField(rendered, FIELD_REQUEST_QUALITY);
    if (rendered_value === null) {
      findings.push({ field: FIELD_REQUEST_QUALITY, kind: 'dropped', expected: label });
    } else if (rendered_value !== label) {
      findings.push({ field: FIELD_REQUEST_QUALITY, kind: 'altered', expected: label, actual: rendered_value });
    }
  }

  if (policy !== null) {
    const rendered_value = readRenderedField(rendered, FIELD_CITATION_POLICY);
    if (rendered_value === null) {
      findings.push({ field: FIELD_CITATION_POLICY, kind: 'dropped', expected: policy });
    } else if (rendered_value !== policy) {
      findings.push({ field: FIELD_CITATION_POLICY, kind: 'altered', expected: policy, actual: rendered_value });
    }
  }

  const conforming = findings.length === 0;
  const ok = conforming || mode === 'grandfather';
  return {
    mode,
    conforming,
    ok,
    status: conforming ? 'conforming' : 'non_conforming',
    findings,
  };
}

function parseGrandfather(argv = process.argv) {
  return argv.includes('--grandfather') || argv.includes('--report');
}

function readArg(flag, argv = process.argv) {
  const index = argv.indexOf(flag);
  if (index === -1 || index + 1 >= argv.length) return undefined;
  return argv[index + 1];
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const mode = parseGrandfather() ? 'grandfather' : 'fail';
  const verdictPath = readArg('--verdict');
  const renderedPath = readArg('--rendered');

  let verdictInput;
  let rendered;

  if (verdictPath && renderedPath) {
    verdictInput = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    rendered = fs.readFileSync(renderedPath, 'utf8');
  } else {
    // Single JSON payload on stdin: { verdict, rendered }.
    const raw = readStdin().trim();
    if (!raw) {
      process.stderr.write('Provide --verdict <file> --rendered <file>, or a { verdict, rendered } JSON on stdin.\n');
      process.exit(2);
      return;
    }
    const payload = JSON.parse(raw);
    verdictInput = payload.verdict ?? payload;
    rendered = typeof payload.rendered === 'string' ? payload.rendered : '';
  }

  const report = checkEnvelopeFidelity(verdictInput, rendered, { mode });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.ok ? 0 : 1);
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main();
}
