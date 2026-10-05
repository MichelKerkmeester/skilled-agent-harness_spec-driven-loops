// ───────────────────────────────────────────────────────────────────
// MODULE: Fetched-Text Injection Screen
// ───────────────────────────────────────────────────────────────────
// Screens text a tool fetched from the web for language that tries to
// instruct an AI agent, so a hook can warn about a page without blocking
// the fetch. The screening protocol is the one the offline measurement
// selected: the sectioning, the question and the flag line come from the
// injection-screen scorer itself, two calls answer each section, a pair
// that straddles the flag line needs a readable third, and the mean of the
// readable answers decides the flag.
//
// Advisory by construction: an unreadable answer counts as unmeasured, a
// straddling pair is never decided without its third answer, and a spent
// budget leaves its remaining sections unchecked instead of failing.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import process from 'node:process';

import {
  FLAG_AT,
  INSTRUCTION,
  JEV_CONFIRM_CALLS,
  MAX_SECTION_LINES,
  MIN_SECTION_LINES,
  sectionText,
  splitSections,
  toLines,
} from '../../../skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs';
import { spawnClassifierCall } from '../../../skills/cli-classifier/shared/scripts/jev-transport.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// One hook run keeps its calls and its latency bounded: at most this many
// sections are screened at all, and at most this many screen at once.
const MAX_SCREENED_SECTIONS = 12;
const MAX_CONCURRENT_SECTIONS = 4;

const TOP_OF_PAGE = '(top of page)';

// ───────────────────────────────────────────────────────────────────
// 3. SECTION PREPARATION
// ───────────────────────────────────────────────────────────────────

// The first heading line of one piece, or the page-top label when the piece
// carries none. Fence tracking keeps a comment inside a code block from
// reading as a heading.
function headingOf(lines, start, end) {
  let fence = null;
  for (let index = start - 1; index < end; index += 1) {
    const line = lines[index];
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence === null && /^ {0,3}#{1,6}(\s|$)/.test(line)) return line.trim();
  }
  return TOP_OF_PAGE;
}

// A section shorter than the scoring band carries too little text to judge on
// its own, so it joins the section after it; the last one joins its
// predecessor because it has no successor. A lone undersized section stays
// as it is, since there is nothing to merge it into.
function mergeShortSections(ranges) {
  const merged = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous !== undefined && previous.end - previous.start + 1 < MIN_SECTION_LINES) {
      previous.end = range.end;
      continue;
    }
    merged.push({ start: range.start, end: range.end });
  }
  const last = merged[merged.length - 1];
  if (merged.length > 1 && last.end - last.start + 1 < MIN_SECTION_LINES) {
    merged.pop();
    merged[merged.length - 1].end = last.end;
  }
  return merged;
}

// No screened piece exceeds the scoring band's ceiling: a longer section is
// cut into consecutive pieces of at most MAX_SECTION_LINES lines.
function cutSections(ranges) {
  const pieces = [];
  for (const range of ranges) {
    let start = range.start;
    while (start <= range.end) {
      const end = Math.min(start + MAX_SECTION_LINES - 1, range.end);
      pieces.push({ start, end });
      start = end + 1;
    }
  }
  return pieces;
}

function prepareSections(text) {
  const lines = toLines(text);
  const sections = [];
  for (const { start, end } of cutSections(mergeShortSections(splitSections(text)))) {
    const body = sectionText(lines, start, end);
    // Whitespace between headings carries nothing to judge.
    if (body.trim() === '') continue;
    sections.push({ heading: headingOf(lines, start, end), text: body });
  }
  return sections;
}

// ───────────────────────────────────────────────────────────────────
// 4. ANSWER READING
// ───────────────────────────────────────────────────────────────────

// The probability one call printed, or null when the call failed or its body
// does not carry one. This is the scorer's reader: exit 0, a parseable body
// and a finite `noul` inside 0..1.
function probabilityOf(result) {
  if (result === null || typeof result !== 'object' || result.code !== 0 || typeof result.stdout !== 'string') return null;
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    return null;
  }
  const noul = parsed?.answers?.answer?.noul;
  return typeof noul === 'number' && Number.isFinite(noul) && noul >= 0 && noul <= 1 ? noul : null;
}

async function callOnce(classify, request, deadline) {
  try {
    const result = await classify({ ...request, timeoutMs: Math.max(0, deadline - Date.now()) });
    return probabilityOf(result);
  } catch {
    // A call that cannot run is a missed measurement, not a screen failure.
    return null;
  }
}

async function measureSection(section, options, deadline) {
  const request = {
    file: options.gate.path,
    args: ['noul', '--provider', options.gate.provider, '-q', INSTRUCTION],
    stdin: section.text,
    env: options.env,
    // Every transport line would corrupt the hook's own stdout, which carries
    // the advisory and nothing else.
    report: () => {},
  };
  const call = () => callOnce(options.classify, request, deadline);

  const pair = await Promise.all([call(), call()]);
  const answers = pair.filter((value) => value !== null);
  // A pair that straddles the flag line needs a third answer to be decided.
  // A spent budget or a failed call keeps that answer unreadable as a null,
  // which the caller counts as unmeasured instead of letting the pair decide.
  if (answers.length === 2 && (answers[0] >= FLAG_AT) !== (answers[1] >= FLAG_AT)) {
    const third = Date.now() < deadline ? await call() : null;
    answers.push(third);
  }
  return answers;
}

// ───────────────────────────────────────────────────────────────────
// 5. SCREEN
// ───────────────────────────────────────────────────────────────────

/**
 * Screens fetched text for instructions aimed at an AI agent.
 *
 * Sections are split, short ones merged and long ones cut as the scorer's
 * corpus is; each scheduled section gets two parallel `noul` calls with the
 * scorer's question, plus a third when the pair splits across FLAG_AT. A
 * section is measured with at least JEV_CONFIRM_CALLS readable probabilities
 * and flagged when their mean reaches FLAG_AT, and a pair that splits across
 * the flag line counts as unmeasured unless its third answer is readable.
 * Sections beyond MAX_SCREENED_SECTIONS, and any whose turn comes after the
 * budget, stay unchecked; sections whose calls produce too few readable
 * answers count as unmeasured.
 *
 * @param {string} text Fetched text to screen.
 * @param {{
 *   env?: Record<string, string | undefined>,
 *   gate: { path: string, provider: string },
 *   classify?: Function,
 *   budgetMs?: number,
 * }} options Environment for the calls, the passing jev gate, a call seam for tests, and the total time the screen may spend starting calls.
 * @returns {Promise<{
 *   checked: number,
 *   flagged: { heading: string, mean: number, position: number }[],
 *   unchecked: number,
 *   unmeasured: number,
 * }>} Section counts and every flagged section's heading, mean and 1-based position among the checked sections, highest mean first.
 */
export async function screenText(text, { env, gate, classify = spawnClassifierCall, budgetMs = 20000 } = {}) {
  const result = { checked: 0, flagged: [], unchecked: 0, unmeasured: 0 };
  if (typeof text !== 'string' || text.trim() === '') return result;

  const environment = env ?? process.env;
  const sections = prepareSections(text);
  const scheduled = sections.slice(0, MAX_SCREENED_SECTIONS);
  result.unchecked = sections.length - scheduled.length;

  const deadline = Date.now() + Math.max(0, budgetMs);
  const checkedOrdinals = [];
  let next = 0;

  async function runWorker() {
    while (next < scheduled.length) {
      if (Date.now() >= deadline) {
        result.unchecked += scheduled.length - next;
        next = scheduled.length;
        return;
      }
      const ordinal = next + 1;
      const section = scheduled[next];
      next += 1;
      const answers = await measureSection(section, { classify, env: environment, gate }, deadline);
      if (answers.length >= JEV_CONFIRM_CALLS && answers.every((value) => value !== null)) {
        result.checked += 1;
        checkedOrdinals.push(ordinal);
        const mean = answers.reduce((sum, value) => sum + value, 0) / answers.length;
        if (mean >= FLAG_AT) result.flagged.push({ heading: section.heading, mean, ordinal });
      } else {
        result.unmeasured += 1;
      }
    }
  }

  const workers = Math.min(MAX_CONCURRENT_SECTIONS, scheduled.length);
  await Promise.all(Array.from({ length: workers }, () => runWorker()));
  // The advisory names a flagged section by position, so each one is ranked
  // among the checked sections in page order.
  const checkedOrder = [...checkedOrdinals].sort((left, right) => left - right);
  result.flagged = result.flagged
    .map(({ heading, mean, ordinal }) => ({ heading, mean, position: checkedOrder.indexOf(ordinal) + 1 }))
    .sort((left, right) => right.mean - left.mean);
  return result;
}
