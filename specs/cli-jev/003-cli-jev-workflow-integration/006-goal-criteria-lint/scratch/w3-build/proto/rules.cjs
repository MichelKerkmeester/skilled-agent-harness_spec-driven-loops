'use strict';
// Orchestrator planning prototype only. Not a build target: it fixes the
// expected outputs the briefs quote, and measures the rules on the corpus.

const QREF = 'QREF';
const DETERMINERS = new Set(['the', 'this', 'these', 'those', 'its', 'their', 'every', 'each']);
const LOCALITY = new Set(['repo', 'repository', 'packet', 'phase', 'goal', 'child', 'line', 'command', 'operator', 'test']);
const MODIFIERS = new Set(['same', 'own', 'new', 'old', 'final', 'first', 'last', 'next', 'other', 'whole', 'full', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
const FUNCTION_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'into', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'no', 'not', 'none', 'each', 'every', 'all', 'any', 'both', 'only', 'per', 'its', 'their', 'this', 'that', 'these', 'those', 'when', 'if', 'then', 'than', 'as', 'after', 'before', 'while', 'which', 'where', 'it', 'they', 'exits', 'prints', 'passes', 'returns', 'reports', 'holds', 'matches', 'contains', 'exists', 'lists', 'shows', 'validates', 'resolve', 'resolves', 'runs', 'fails', 'writes', 'reads', 'present', 'zero', 'one']);
const RULE5_ALWAYS = [
  /\bas (?:described|defined|listed|specified|documented|stated|shown|required) (?:in|by|under)\b/giu,
  /\b(?:see|refer to|per) (?:the )?(?:spec|plan|tasks|checklist|section|table|appendix|research|synthesis|decision record|requirements?)\b/giu,
  /\b(?:REQ|SC|CHK|NFR|AC)-\d+\b/gu,
  /\bevery (?:kept|listed|named|required|relevant|affected|applicable)\b/giu,
  /\bwhere (?:they|these|those)\b/giu
];
const RULE5_UNNAMED = [
  /\b(?:is|are) listed\b/giu,
  /\bthe (?:rows|items|entries|cases|steps) (?:in|of|from|under)\b/giu
];

function mask(line) {
  return String(line).replace(/`[^`]*`/gu, ' ' + QREF + ' ').replace(/"[^"]*"/gu, ' ' + QREF + ' ');
}
function bare(token) {
  return token.replace(/^[("'[]+/u, '').replace(/[.,;:!?)"'\]]+$/u, '').replace(/['\u2019]s$/u, '');
}
function isNamed(token) {
  const word = bare(token);
  return word === QREF || word.includes('/') || /^[\w.-]+\.[a-z0-9]{1,6}$/iu.test(word) || /^\d/u.test(word);
}
function hasNamedArtifact(line) {
  return mask(line).split(/\s+/u).filter(Boolean).some(isNamed);
}

function rule4DanglingRefs(line) {
  const words = mask(line).split(/\s+/u).filter(Boolean);
  const spans = [];
  if (words.length > 0 && /^(?:It|They)$/u.test(bare(words[0]))) spans.push(bare(words[0]));
  for (let i = 0; i < words.length; i += 1) {
    if (!DETERMINERS.has(bare(words[i]).toLowerCase())) continue;
    let start = i + 1;
    while (start < words.length && MODIFIERS.has(bare(words[start]).toLowerCase())) start += 1;
    const window = words.slice(start, start + 3);
    if (window.length === 0) continue;
    const head = bare(window[0]).toLowerCase();
    if (head === '' || FUNCTION_WORDS.has(head)) continue;
    const single = head.endsWith('s') ? head.slice(0, -1) : head;
    if (window.some(isNamed)) continue;
    if (LOCALITY.has(head) || LOCALITY.has(single)) continue;
    if (/[:=]$/u.test(window[0])) continue;
    spans.push(words.slice(i, start + 1).map(bare).join(' '));
  }
  return spans;
}

function rule5ExternalFile(line) {
  const text = String(line);
  const spans = [];
  for (const pattern of RULE5_ALWAYS) {
    for (const match of text.matchAll(pattern)) spans.push(match[0]);
  }
  if (!hasNamedArtifact(text)) {
    for (const pattern of RULE5_UNNAMED) {
      for (const match of text.matchAll(pattern)) spans.push(match[0]);
    }
  }
  return spans;
}

function classifyCriterion(text) {
  const trimmed = String(text).trim();
  if (/^\[[^\]]*\]$/u.test(trimmed)) return 'placeholder';
  const words = mask(trimmed).split(/\s+/u).map((w) => bare(w).toLowerCase()).filter(Boolean);
  if (!words.some((w) => FUNCTION_WORDS.has(w))) return 'lexical_unscored';
  return 'scored';
}

module.exports = { rule4DanglingRefs, rule5ExternalFile, classifyCriterion, mask };
