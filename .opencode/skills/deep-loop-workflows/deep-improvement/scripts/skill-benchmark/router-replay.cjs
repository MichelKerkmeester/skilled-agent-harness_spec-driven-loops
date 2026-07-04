#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ router-replay — Mode A deterministic in-skill smart-router replay        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AMBIGUITY_DELTA = 1; // mirror the in-skill router: keep near-tied intents

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

function projectHubRouter(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const signals = data.routerSignals && typeof data.routerSignals === 'object' ? data.routerSignals : {};
  const vocabulary = data.vocabularyClasses && typeof data.vocabularyClasses === 'object'
    ? data.vocabularyClasses
    : {};
  const intentSignals = {};
  const resourceMap = {};

  for (const [mode, signal] of Object.entries(signals)) {
    const keywords = new Set();
    for (const className of signal.classes || []) {
      const klass = vocabulary[className];
      for (const keyword of klass && Array.isArray(klass.keywords) ? klass.keywords : []) {
        keywords.add(String(keyword).toLowerCase());
      }
    }
    for (const keyword of Array.isArray(signal.keywords) ? signal.keywords : []) {
      keywords.add(String(keyword).toLowerCase());
    }

    intentSignals[mode] = {
      weight: Number.isFinite(Number(signal.weight)) ? Number(signal.weight) : 1,
      keywords: [...keywords],
    };
    resourceMap[mode] = Array.isArray(signal.resources) ? signal.resources : [];
  }

  const policy = data.routerPolicy && typeof data.routerPolicy === 'object' ? data.routerPolicy : {};
  return {
    intentSignals,
    resourceMap,
    defaultResource: Array.isArray(policy.defaultResource) ? policy.defaultResource : [],
  };
}

function readJsonObject(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function buildRegistryIndex(skillRoot) {
  const registry = readJsonObject(path.join(skillRoot, 'mode-registry.json'));
  const modes = registry && Array.isArray(registry.modes) ? registry.modes : [];
  const byMode = {};
  for (const mode of modes) {
    if (!mode || typeof mode !== 'object' || !mode.workflowMode) continue;
    byMode[String(mode.workflowMode)] = mode;
  }
  return byMode;
}

function buildHubRouteTelemetry({ skillRoot, intents, router, taskLower }) {
  if (!router || router.routerSource !== 'hub-router.json') {
    return { observed: false, reason: 'no-hub-router' };
  }

  const hub = readJsonObject(path.join(skillRoot, 'hub-router.json')) || {};
  const policy = hub.routerPolicy && typeof hub.routerPolicy === 'object' ? hub.routerPolicy : {};
  const selectedModes = Array.isArray(intents) ? intents : [];
  const matchedAliases = [];

  for (const mode of selectedModes) {
    const signal = router.intentSignals && router.intentSignals[mode] ? router.intentSignals[mode] : {};
    for (const keyword of Array.isArray(signal.keywords) ? signal.keywords : []) {
      if (keywordHits(taskLower, keyword)) matchedAliases.push(keyword);
    }
  }

  const registry = buildRegistryIndex(skillRoot);
  const backendKind = [];
  const packet = [];
  for (const mode of selectedModes) {
    const entry = registry[mode];
    if (!entry) continue;
    if (entry.backendKind) backendKind.push(entry.backendKind);
    if (entry.packet) packet.push(entry.packet);
  }

  const defaultApplied = selectedModes.length === 0 && policy.defaultMode != null;
  const deferReason = selectedModes.length === 0
    ? 'no-mode-scored'
    : (selectedModes.length > 1 ? 'ambiguous-multi-axis' : null);

  return {
    observed: true,
    source: 'hub-router',
    workflowMode: selectedModes.length ? selectedModes : null,
    matchedAliases: [...new Set(matchedAliases)],
    defaultApplied,
    deferReason,
    backendKind,
    packet,
  };
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

/**
 * Extract the in-skill router (INTENT_SIGNALS + RESOURCE_MAP + DEFAULT_RESOURCE)
 * from SKILL.md, falling back to a referenced router doc when the inline block
 * is absent.
 *
 * @param {string} skillMdText - The SKILL.md text.
 * @param {string} skillRoot - Skill root dir (for resolving referenced docs).
 * @returns {{intentSignals:Object,resourceMap:Object,defaultResource:string[],parseable:boolean,routerSource:string}} Parsed router.
 */
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

    const routerStillEmpty = Object.keys(intentSignals).length === 0 && Object.keys(resourceMap).length === 0;
    const hubRouter = path.join(skillRoot, 'hub-router.json');
    if (routerStillEmpty && fs.existsSync(hubRouter)) {
      const projected = projectHubRouter(hubRouter);
      if (Object.keys(projected.intentSignals).length > 0 || Object.keys(projected.resourceMap).length > 0) {
        intentSignals = projected.intentSignals;
        resourceMap = projected.resourceMap;
        defaultResource = defaultResource.length ? defaultResource : projected.defaultResource;
        routerSource = 'hub-router.json';
      }
    }
  }

  const parseable = Object.keys(intentSignals).length > 0 || Object.keys(resourceMap).length > 0;
  return { intentSignals, resourceMap, defaultResource, parseable, routerSource };
}

/**
 * Score each intent by summing its weight for every keyword that is a substring
 * of the lowercased task, keeping only positive-scoring intents (sorted desc).
 *
 * @param {string} taskLower - Lowercased task text.
 * @param {Object} intentSignals - Map of intent -> {weight, keywords}.
 * @returns {Array<{intent:string,score:number}>} Scored intents, highest first.
 */
const WORD_BOUNDARY_KEYWORDS = new Set(['review']);

// A bare keyword like "review" gets swallowed by unrelated longer words
// ("preview" contains "review"), so match those on word boundaries. Path- and
// identifier-style keywords keep substring matching so "javascript" still
// matches inside "2_javascript".
function keywordHits(taskLower, kw) {
  if (!kw) return false;
  if (WORD_BOUNDARY_KEYWORDS.has(kw)) {
    return new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(taskLower);
  }
  return taskLower.includes(kw);
}

function scoreIntents(taskLower, intentSignals) {
  const scores = [];
  for (const [key, sig] of Object.entries(intentSignals)) {
    let score = 0;
    for (const kw of sig.keywords) {
      if (keywordHits(taskLower, kw)) score += sig.weight;
    }
    if (score > 0) scores.push({ intent: key, score });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

/**
 * Select intents within AMBIGUITY_DELTA of the top score (keeps near-tied
 * intents, mirroring the in-skill router).
 *
 * @param {Array<{intent:string,score:number}>} scores - Scored intents, highest first.
 * @returns {string[]} Selected intent keys.
 */
function selectIntents(scores) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((s) => top - s.score <= AMBIGUITY_DELTA).map((s) => s.intent);
}

// Which surface a resource belongs to, by its on-disk path prefix. Webflow,
// OpenCode, and Motion.dev resources live under their own folders, so the prefix
// IS the surface. Everything else (universal refs, the detection/router preamble)
// is surface-agnostic.
const SURFACE_PREFIXES = {
  WEBFLOW: ['references/webflow/', 'assets/webflow/'],
  OPENCODE: ['references/opencode/', 'assets/opencode/'],
  MOTION: ['references/motion_dev/', 'assets/motion_dev/'],
};
function resourceSurface(r) {
  for (const [surface, prefixes] of Object.entries(SURFACE_PREFIXES)) {
    if (prefixes.some((p) => r.startsWith(p))) return surface;
  }
  return 'UNIVERSAL';
}
// Detect the task's code surface from path / extension / marker signals, mirroring
// the prose stack-detection contract: OpenCode system code wins, then Webflow
// markers, else UNKNOWN. A task that names both is MIXED (cross-surface).
function detectSurface(taskLower) {
  const opencode = /\.opencode\/|\bskill\.md\b|\.cjs\b|\.mjs\b|\.tsx?\b|\.py\b|\.sh\b|\bspec-folder\b|\bargparse\b|graph-metadata/.test(taskLower);
  const webflow = /src\/2_javascript|\bwebflow\b|\.webflow\b|--vw-/.test(taskLower);
  if (opencode && webflow) return 'MIXED';
  if (opencode) return 'OPENCODE';
  if (webflow) return 'WEBFLOW';
  return 'UNKNOWN';
}
// OpenCode-only language sub-detection (mirrors SKILL.md §2). A `.opencode/` task
// is one language, so it needs only that language's guides — not every language
// folder. Webflow deliberately has no sub-detection (a frontend task spans
// css + html + js together).
const OPENCODE_LANGUAGES = ['typescript', 'python', 'shell', 'config', 'javascript'];
function detectOpencodeLanguage(taskLower) {
  if (/\.tsx?\b/.test(taskLower)) return 'typescript';
  if (/\.py\b|argparse/.test(taskLower)) return 'python';
  if (/\.sh\b|set -euo|shellcheck/.test(taskLower)) return 'shell';
  if (/\.jsonc?\b|graph-metadata|descriptor|spec-folder/.test(taskLower)) return 'config';
  if (/\.cjs\b|\.mjs\b/.test(taskLower)) return 'javascript';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// A parent hub selects the MODE in hub-router.json but keeps the flat
// surface/phase router (INTENT_SIGNALS + RESOURCE_MAP over the deep per-surface
// reference paths) as a retained shared doc. Resource recall must be replayed
// against THAT router: the hub router only emits packet pointers (a mode's
// SKILL.md), not the per-surface resource gold the scenarios assert. Probe the
// conventional locations; a skill with no such doc (every flat skill, and sibling
// hubs without one) yields null and is left on the normal path unchanged.
function loadSurfaceRouter(skillRoot) {
  const candidates = [
    path.join(skillRoot, 'shared', 'references', 'smart_routing.md'),
    path.join(skillRoot, 'references', 'smart_routing.md'),
  ];
  for (const doc of candidates) {
    if (!fs.existsSync(doc)) continue;
    const text = fs.readFileSync(doc, 'utf8');
    const intentSignals = parseIntentSignals(extractDictBody(text, 'INTENT_SIGNALS'));
    const resourceMap = parseResourceMap(extractDictBody(text, 'RESOURCE_MAP'));
    const defaultResource = parseDefaultResource(text);
    if (Object.keys(intentSignals).length > 0 || Object.keys(resourceMap).length > 0) {
      return { intentSignals, resourceMap, defaultResource, sourceRel: path.relative(skillRoot, doc) };
    }
  }
  return null;
}

// The roots a hub's surface resources resolve under, for the missing-resource
// report: the surface router's paths are relative to the shared preamble tier
// (stack/phase detection, universal baseline) or a mode packet (post-relocation),
// not the hub root. Returns [] for a non-hub skill (no registry).
function registryPacketRoots(skillRoot) {
  const byMode = buildRegistryIndex(skillRoot);
  const roots = Object.keys(byMode).length ? [path.join(skillRoot, 'shared')] : [];
  for (const mode of Object.values(byMode)) {
    if (mode && mode.packet) roots.push(path.join(skillRoot, String(mode.packet)));
  }
  return roots;
}

// Union the default preamble with each selected intent's resources, then apply
// surface-aware slicing when the map uses a per-surface layout (sk-code): keep the
// universal tier + Motion.dev overlay + only the DETECTED surface's slice, drop
// the other surface's resources (the documented over-routing source). Assets are
// deferred — never the routing gold. A MIXED task keeps both surfaces; UNKNOWN
// falls back to the universal + Motion tier only. Existence is checked against the
// skill root plus any extra roots (a hub's packet roots), since a hub's surface
// paths resolve under a packet rather than the hub root.
function assembleResources({ skillRoot, taskLower, intents, router, extraRoots = [] }) {
  const resourceSet = new Set();
  for (const r of router.defaultResource || []) resourceSet.add(r);
  for (const intent of intents) {
    for (const r of router.resourceMap[intent] || []) resourceSet.add(r);
  }
  let resources = [...resourceSet];

  const mapResources = Object.values(router.resourceMap).flat();
  const hasSurfaceLayout = mapResources.some((r) => r.startsWith('references/webflow/'))
    && mapResources.some((r) => r.startsWith('references/opencode/'));
  let surface;
  if (hasSurfaceLayout) {
    surface = detectSurface(taskLower);
    // Within OpenCode, slice further to the detected language so a TypeScript task
    // does not also pull the Python/shell/config guides. Non-language OpenCode
    // folders (e.g. `shared/`) are always kept.
    const ocLang = surface === 'OPENCODE' ? detectOpencodeLanguage(taskLower) : null;
    resources = resources.filter((r) => {
      if (r.startsWith('assets/')) return false;
      const rs = resourceSurface(r);
      if (rs === 'UNIVERSAL' || rs === 'MOTION') return true;
      if (surface === 'MIXED') return true;
      if (surface === 'UNKNOWN') return false;
      if (rs !== surface) return false;
      if (ocLang) {
        const m = /^references\/opencode\/([^/]+)\//.exec(r);
        if (m && OPENCODE_LANGUAGES.includes(m[1]) && m[1] !== ocLang) return false;
      }
      return true;
    });
  }

  const roots = [skillRoot, ...extraRoots];
  const missingResources = resources.filter((r) => !roots.some((root) => fs.existsSync(path.join(root, r))));
  return { resources, missingResources, surface };
}

/**
 * Replay the in-skill router for a task and return the routed resources.
 *
 * @param {Object} args - Routing inputs.
 * @param {string} args.skillRoot - Skill root dir containing SKILL.md.
 * @param {string} args.taskText - Task text to route.
 * @returns {{ parseable: boolean, intents: string[], resources: string[],
 *   missingResources: string[], scores: Array<{intent:string,score:number}>, surface?: string }}
 */
function routeSkillResources({ skillRoot, taskText }) {
  const skillMd = readSkillMd(skillRoot);
  const router = parseRouter(skillMd, skillRoot);
  if (!router.parseable) {
    return {
      parseable: false,
      intents: [],
      resources: [],
      missingResources: [],
      scores: [],
      routeTelemetry: { observed: false, reason: 'router-unparseable' },
    };
  }
  const taskLower = String(taskText || '').toLowerCase();
  const scores = scoreIntents(taskLower, router.intentSignals);
  const intents = selectIntents(scores);
  const routeTelemetry = buildHubRouteTelemetry({ skillRoot, intents, router, taskLower });

  // Parent-hub two-layer routing: the hub router chose the mode (telemetry above);
  // replay the retained surface router for the resource gold, which lives at the
  // surface layer. No-op unless a surface router is present, so every flat skill
  // and any sibling hub without one keeps the exact prior behavior.
  if (router.routerSource === 'hub-router.json') {
    const surfaceRouter = loadSurfaceRouter(skillRoot);
    if (surfaceRouter) {
      const surfaceIntents = selectIntents(scoreIntents(taskLower, surfaceRouter.intentSignals));
      const asm = assembleResources({
        skillRoot,
        taskLower,
        intents: surfaceIntents,
        router: surfaceRouter,
        extraRoots: registryPacketRoots(skillRoot),
      });
      return {
        parseable: true,
        intents,
        resources: asm.resources,
        missingResources: asm.missingResources,
        scores,
        ...(asm.surface ? { surface: asm.surface } : {}),
        routeTelemetry,
      };
    }
  }

  const asm = assembleResources({ skillRoot, taskLower, intents, router });
  return {
    parseable: true,
    intents,
    resources: asm.resources,
    missingResources: asm.missingResources,
    scores,
    ...(asm.surface ? { surface: asm.surface } : {}),
    routeTelemetry,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { routeSkillResources, parseRouter, scoreIntents, selectIntents, buildHubRouteTelemetry, loadSurfaceRouter, registryPacketRoots };

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
