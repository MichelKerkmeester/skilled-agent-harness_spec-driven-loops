#!/usr/bin/env node
'use strict';

/**
 * router-replay.cjs — Mode A deterministic in-skill smart-router replay.
 *
 * The converged design needs the intra-skill router replayed deterministically
 * (zero leakage, CI-friendly) as the D1-intra signal and the D2 discovery proxy.
 * The router lives as INTENT_SIGNALS + RESOURCE_MAP inside a fenced block in the
 * target SKILL.md; it is documentation, not an importable module, so this script
 * extracts the dictionaries and reproduces the exact substring-scoring semantics:
 * lowercase the task, score each intent by whether each keyword is a substring,
 * keep intents within an ambiguity delta of the top score, then union the default
 * resource + RESOURCE_MAP[intent] for the selected intents.
 *
 * Exit: 0 on a successful replay (even with zero intents), 2 on unparseable router.
 */

const fs = require('fs');
const path = require('path');

const AMBIGUITY_DELTA = 1; // mirror the in-skill router: keep near-tied intents

function readSkillMd(skillRoot) {
  const p = path.join(skillRoot, 'SKILL.md');
  if (!fs.existsSync(p)) throw new Error(`SKILL.md not found under ${skillRoot}`);
  return fs.readFileSync(p, 'utf8');
}

// Pull the {...}-balanced body that follows `NAME = {` from the SKILL.md text.
function extractDictBody(text, name) {
  const start = text.indexOf(`${name} = {`);
  if (start === -1) return null;
  let i = text.indexOf('{', start);
  let depth = 0;
  for (let j = i; j < text.length; j += 1) {
    const ch = text[j];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(i + 1, j);
    }
  }
  return null;
}

function quotedStrings(segment) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'/g;
  let m;
  while ((m = re.exec(segment)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
  return out;
}

// INTENT_SIGNALS = { "KEY": {"weight": N, "keywords": ["a","b"]}, ... }
function parseIntentSignals(body) {
  const signals = {};
  if (!body) return signals;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\{([^}]*)\}/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    const key = m[1];
    const inner = m[2];
    const weightMatch = /["']weight["']\s*:\s*(\d+(?:\.\d+)?)/.exec(inner);
    const kwMatch = /["']keywords["']\s*:\s*\[([^\]]*)\]/.exec(inner);
    signals[key] = {
      weight: weightMatch ? Number(weightMatch[1]) : 1,
      keywords: kwMatch ? quotedStrings(kwMatch[1]).map((k) => k.toLowerCase()) : [],
    };
  }
  return signals;
}

// RESOURCE_MAP = { "KEY": ["path/a.md", "path/b.md"], ... }
function parseResourceMap(body) {
  const map = {};
  if (!body) return map;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) map[m[1]] = quotedStrings(m[2]);
  return map;
}

// DEFAULT_RESOURCE may be a single quoted path or a list of them. A skill's
// always-loaded routing preamble (e.g. stack/phase detection plus the router
// doc) is genuinely consulted on every route, so the replay seeds every result
// with the whole set. Always returns an array; [] when absent.
function parseDefaultResource(text) {
  const listM = /DEFAULT_RESOURCE\s*=\s*\[([\s\S]*?)\]/.exec(text);
  if (listM) {
    return [...listM[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
  }
  const strM = /DEFAULT_RESOURCE\s*=\s*["']([^"']+)["']/.exec(text);
  return strM ? [strM[1]] : [];
}

// Some skills keep the authoritative router in a referenced doc (e.g.
// references/smart_routing.md) rather than inlining it in SKILL.md. When the
// inline dictionaries are absent we follow that pointer and parse the same
// INTENT_SIGNALS / RESOURCE_MAP block from the referenced file. Inline always
// wins; a skill with no inline block and no parseable referenced doc stays
// unparseable, so a genuinely router-less skill is still reported as such.
const ROUTER_REF_HINT = /(resource_map|intent_signals|intent_model|smart[ _-]?rout|routing logic)/i;

function findReferencedRouterDoc(skillMdText, skillRoot) {
  const pathRe = /(?:\.\/)?(references\/[A-Za-z0-9_./-]+\.md)/;
  for (const line of skillMdText.split('\n')) {
    if (!ROUTER_REF_HINT.test(line)) continue;
    const m = pathRe.exec(line);
    if (m) {
      const candidate = path.join(skillRoot, m[1]);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  // Convention fallback: a router doc at the well-known location.
  const conventional = path.join(skillRoot, 'references', 'smart_routing.md');
  return fs.existsSync(conventional) ? conventional : null;
}

function parseRouter(skillMdText, skillRoot) {
  let intentSignals = parseIntentSignals(extractDictBody(skillMdText, 'INTENT_SIGNALS'));
  let resourceMap = parseResourceMap(extractDictBody(skillMdText, 'RESOURCE_MAP'));
  let defaultResource = parseDefaultResource(skillMdText);
  let routerSource = 'inline';

  const inlineEmpty = Object.keys(intentSignals).length === 0 && Object.keys(resourceMap).length === 0;
  if (inlineEmpty && skillRoot) {
    const refDoc = findReferencedRouterDoc(skillMdText, skillRoot);
    if (refDoc) {
      const refText = fs.readFileSync(refDoc, 'utf8');
      const refSignals = parseIntentSignals(extractDictBody(refText, 'INTENT_SIGNALS'));
      const refMap = parseResourceMap(extractDictBody(refText, 'RESOURCE_MAP'));
      if (Object.keys(refSignals).length > 0 || Object.keys(refMap).length > 0) {
        intentSignals = refSignals;
        resourceMap = refMap;
        defaultResource = defaultResource.length ? defaultResource : parseDefaultResource(refText);
        routerSource = path.relative(skillRoot, refDoc);
      }
    }
  }

  const parseable = Object.keys(intentSignals).length > 0 || Object.keys(resourceMap).length > 0;
  return { intentSignals, resourceMap, defaultResource, parseable, routerSource };
}

function scoreIntents(taskLower, intentSignals) {
  const scores = [];
  for (const [key, sig] of Object.entries(intentSignals)) {
    let score = 0;
    for (const kw of sig.keywords) {
      if (kw && taskLower.includes(kw)) score += sig.weight;
    }
    if (score > 0) scores.push({ intent: key, score });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

function selectIntents(scores) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((s) => top - s.score <= AMBIGUITY_DELTA).map((s) => s.intent);
}

/**
 * @returns {{ parseable: boolean, intents: string[], resources: string[],
 *   missingResources: string[], scores: Array<{intent:string,score:number}> }}
 */
function routeSkillResources({ skillRoot, taskText }) {
  const skillMd = readSkillMd(skillRoot);
  const router = parseRouter(skillMd, skillRoot);
  if (!router.parseable) {
    return { parseable: false, intents: [], resources: [], missingResources: [], scores: [] };
  }
  const scores = scoreIntents(String(taskText || '').toLowerCase(), router.intentSignals);
  const intents = selectIntents(scores);
  const resourceSet = new Set();
  for (const r of router.defaultResource || []) resourceSet.add(r);
  for (const intent of intents) {
    for (const r of router.resourceMap[intent] || []) resourceSet.add(r);
  }
  const resources = [...resourceSet];
  const missingResources = resources.filter((r) => !fs.existsSync(path.join(skillRoot, r)));
  return { parseable: true, intents, resources, missingResources, scores };
}

module.exports = { routeSkillResources, parseRouter, scoreIntents, selectIntents };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args.task) {
    process.stderr.write('usage: router-replay.cjs --skill <skill-root> --task "<task text>"\n');
    process.exit(2);
  }
  try {
    const result = routeSkillResources({ skillRoot: args.skill, taskText: args.task });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(result.parseable ? 0 : 2);
  } catch (err) {
    process.stderr.write(`router-replay: ${err.message}\n`);
    process.exit(2);
  }
}
