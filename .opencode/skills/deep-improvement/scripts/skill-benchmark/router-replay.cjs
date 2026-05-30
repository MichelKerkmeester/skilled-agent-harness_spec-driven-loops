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

function parseDefaultResource(text) {
  const m = /DEFAULT_RESOURCE\s*=\s*["']([^"']+)["']/.exec(text);
  return m ? m[1] : null;
}

function parseRouter(skillMdText) {
  const intentSignals = parseIntentSignals(extractDictBody(skillMdText, 'INTENT_SIGNALS'));
  const resourceMap = parseResourceMap(extractDictBody(skillMdText, 'RESOURCE_MAP'));
  const defaultResource = parseDefaultResource(skillMdText);
  const parseable = Object.keys(intentSignals).length > 0 || Object.keys(resourceMap).length > 0;
  return { intentSignals, resourceMap, defaultResource, parseable };
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
  const router = parseRouter(skillMd);
  if (!router.parseable) {
    return { parseable: false, intents: [], resources: [], missingResources: [], scores: [] };
  }
  const scores = scoreIntents(String(taskText || '').toLowerCase(), router.intentSignals);
  const intents = selectIntents(scores);
  const resourceSet = new Set();
  if (router.defaultResource) resourceSet.add(router.defaultResource);
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
