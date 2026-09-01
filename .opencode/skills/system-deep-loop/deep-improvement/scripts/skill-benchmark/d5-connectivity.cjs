#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ d5-connectivity — static structural scan, the D5 hard gate               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * d5-connectivity.cjs — static structural scan, the D5 hard gate.
 *
 * Runs BEFORE any dispatch and caps the verdict regardless of weighted score.
 * Catches the failure class that makes a skill structurally unusable: a
 * RESOURCE_MAP path that does not exist (dead route), a RESOURCE_MAP key absent
 * from INTENT_SIGNALS (dead intent key), a routed path escaping the skill root,
 * and references present on disk but never reachable from any RESOURCE_MAP entry
 * (orphans — reported, not gated). A router that cannot be parsed at all is the
 * strongest gate failure.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_PENALTY = { P0: 40, P1: 12, P2: 3 };

/**
 * List every markdown reference under the skill's references/ and assets/ trees.
 *
 * @param {string} skillRoot - Absolute path to the skill root.
 * @returns {string[]} Skill-root-relative paths to each markdown file found.
 */
// Read a skill's optional routing-allowlist (skill-relative markdown paths that
// are intentionally not routed). Returns an empty Set when absent or malformed,
// so the default behavior for every skill without one is unchanged.
function readRoutingAllowlist(skillRoot) {
  const file = path.join(skillRoot, 'routing-allowlist.json');
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const entries = Array.isArray(raw) ? raw : (raw.intentionally_unrouted || []);
    return new Set(entries.map((e) => (typeof e === 'string' ? e : e && e.path)).filter(Boolean));
  } catch {
    return new Set();
  }
}

function listMarkdownRefs(skillRoot) {
  const out = [];
  for (const dir of ['references', 'assets']) {
    const base = path.join(skillRoot, dir);
    if (!fs.existsSync(base)) continue;
    const stack = [base];
    while (stack.length) {
      const cur = stack.pop();
      for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
        const full = path.join(cur, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.isFile() && /\.md$/.test(entry.name)) out.push(path.relative(skillRoot, full));
      }
    }
  }
  return out;
}

// A routed path is contained if it stays within the skill root, or within the
// sibling shared/ dir one level up. Nested mode packets load family-wide docs
// such as the operating register from the parent packet's shared/ dir, so that
// single hop into shared/ is a sanctioned cross-packet resource location, not an
// escape. Separator-bounded checks stop a sibling dir that merely shares the
// root's name prefix from being mistaken for "inside".
function resolveRoutedPath(skillRoot, r) {
  const root = path.resolve(skillRoot);
  const sharedRoot = path.resolve(skillRoot, '..', 'shared');
  const resolved = path.resolve(skillRoot, r);
  const inRoot = resolved === root || resolved.startsWith(root + path.sep);
  const inShared = resolved === sharedRoot || resolved.startsWith(sharedRoot + path.sep);
  return { resolved, escapes: !inRoot && !inShared };
}

// Pull the {...}-balanced body that follows `NAME = {`, mirroring how the replay
// finds a router dictionary in SKILL.md prose.
function extractDictBody(text, name) {
  const start = text.indexOf(`${name} = {`);
  if (start === -1) return null;
  const i = text.indexOf('{', start);
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

// A skill's own SKILL.md names its intent dictionary INTENT_MODEL; a hub-root
// router document names the same structure INTENT_SIGNALS. Both declare the same
// fact this scan needs — which intents exist — so read either when deciding
// whether a RESOURCE_MAP key is backed by a real intent. Only the key set is read
// here; keyword scoring semantics belong to the replay, not to a structural scan.
function readIntentKeys(skillMdText, name) {
  const body = extractDictBody(skillMdText, name);
  const keys = new Set();
  if (body === null) return keys;
  for (const m of body.matchAll(/["']([A-Z0-9_]+)["']\s*:\s*\{/g)) keys.add(m[1]);
  return keys;
}

// A router declares its always-loaded and keyword-gated tiers in a loading-levels
// dictionary alongside the intent map. Those are declared routes just as much as
// a RESOURCE_MAP entry is, so a resource named there is reachable and is not an
// orphan. Only quoted skill-relative markdown paths are taken; the same dictionary
// also holds trigger phrases and load-level labels, which name no resource.
function readLoadingLevelPaths(skillMdText) {
  const out = new Set();
  for (const name of ['LOADING_LEVELS', 'LOAD_LEVELS']) {
    const body = extractDictBody(skillMdText, name);
    if (body === null) continue;
    for (const m of body.matchAll(/["']([^"']+\.md)["']/g)) {
      if (/^(references|assets)\//.test(m[1])) out.add(m[1]);
    }
  }
  return out;
}

// A mode packet nested inside a parent hub does not own stage-two routing. The
// hub's root ROUTER.md maps intents to packet-qualified leaf paths, and that map
// is how a request reaches the packet's references at all. Scanning such a packet
// in isolation would read a router-less skill whose whole reference tree is
// unreachable — a structural verdict that contradicts the hub contract the packet
// is built to. Resolve the hub's stage-two map and project the entries owned by
// this packet down to packet-relative paths, so the packet is scanned against the
// router that actually routes it. A standalone skill has no parent hub here and
// is unaffected.
function readHubStageTwoRoute(skillRoot) {
  const empty = { present: false, routed: new Set(), source: null };
  const root = path.resolve(skillRoot);
  const hubRoot = path.dirname(root);
  const packet = path.basename(root);

  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(path.join(hubRoot, 'mode-registry.json'), 'utf8'));
  } catch {
    return empty;
  }
  const modes = Array.isArray(registry?.modes) ? registry.modes : [];
  if (!modes.some((mode) => mode && mode.packet === packet)) return empty;

  const routerPath = path.join(hubRoot, 'ROUTER.md');
  let text;
  try {
    text = fs.readFileSync(routerPath, 'utf8');
  } catch {
    return empty;
  }
  // A hub scaffold declares router_state: stage1-only with empty maps until a
  // concrete leaf map is authored. Only an active stage two routes anything.
  if (!/^router_state:\s*active\s*$/m.test(text)) return empty;

  // Parse the hub document's own dictionaries only: passing no skill root keeps
  // parseRouter from following pointers out of the document being read.
  const hubRouter = parseRouter(text, null);
  const prefix = `${packet}/`;
  const routed = new Set();
  for (const resources of Object.values(hubRouter.resourceMap)) {
    for (const r of resources) {
      if (r.startsWith(prefix)) routed.add(r.slice(prefix.length));
    }
  }
  if (routed.size === 0) return empty;
  return { present: true, routed, source: path.relative(root, routerPath) };
}

function emptyHubRegistryResult() {
  return {
    registryPresent: false,
    score: 100,
    gateFailed: false,
    verdict: null,
    findings: [],
    missingModes: [],
    deadPackets: [],
    packetNameMismatches: [],
    aliasCollisions: [],
    uncoveredIntentRate: null,
    uncoveredKeywords: [],
  };
}

function readJsonResult(filePath, label) {
  try {
    return { ok: true, value: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  } catch (err) {
    return {
      ok: false,
      finding: {
        class: 'registry_unparseable',
        severity: 'P0',
        locus: label,
        detail: `${label} could not be parsed: ${err.message}`,
      },
    };
  }
}

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeIntentKeyword(value) {
  return normalizeKeyword(value).replace(/[\s_-]+/g, ' ');
}

function extractFrontmatterName(skillMdPath) {
  if (!fs.existsSync(skillMdPath)) return null;
  const text = fs.readFileSync(skillMdPath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const name = match[1].match(/^name:\s*"?([^"\n]+)"?\s*$/m);
  return name ? name[1].trim() : null;
}

/**
 * Statically scan a hub registry and produce a hard gate for broken mode maps.
 *
 * @param {Object} args - Scan inputs.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @returns {{ registryPresent:boolean, score:number, gateFailed:boolean,
 *   verdict:string|null, findings:Array, missingModes:Array, deadPackets:Array,
 *   packetNameMismatches:Array, aliasCollisions:Array,
 *   uncoveredIntentRate:number|null, uncoveredKeywords:string[] }}
 */
function scanHubRegistry({ skillRoot }) {
  const modeRegistryPath = path.join(skillRoot, 'mode-registry.json');
  if (!fs.existsSync(modeRegistryPath)) return emptyHubRegistryResult();

  const findings = [];
  const hubRouterPath = path.join(skillRoot, 'hub-router.json');
  const registryResult = readJsonResult(modeRegistryPath, 'mode-registry.json');
  const routerResult = fs.existsSync(hubRouterPath)
    ? readJsonResult(hubRouterPath, 'hub-router.json')
    : {
      ok: false,
      finding: {
        class: 'registry_unparseable',
        severity: 'P0',
        locus: 'hub-router.json',
        detail: 'hub-router.json not found',
      },
    };

  if (!registryResult.ok || !routerResult.ok) {
    if (!registryResult.ok) findings.push(registryResult.finding);
    if (!routerResult.ok) findings.push(routerResult.finding);
    const penalty = findings.reduce((acc, f) => acc + (SEVERITY_PENALTY[f.severity] || 0), 0);
    return {
      registryPresent: true,
      score: Math.max(0, 100 - penalty),
      gateFailed: true,
      verdict: 'BLOCKED-BY-REGISTRY',
      findings,
      missingModes: [],
      deadPackets: [],
      packetNameMismatches: [],
      aliasCollisions: [],
      uncoveredIntentRate: null,
      uncoveredKeywords: [],
    };
  }

  const registry = registryResult.value;
  const hubRouter = routerResult.value;
  const modes = Array.isArray(registry.modes) ? registry.modes : [];
  const routerSignals = hubRouter.routerSignals && typeof hubRouter.routerSignals === 'object' ? hubRouter.routerSignals : {};
  const vocabularyClasses = hubRouter.vocabularyClasses && typeof hubRouter.vocabularyClasses === 'object' ? hubRouter.vocabularyClasses : {};
  const referencedPackets = new Set(modes.map((mode) => mode.packet).filter(Boolean));

  const missingModes = [];
  const packetNameMismatches = [];
  const aliasOwners = new Map();
  const rawAliases = new Set();
  const rawIntentAliases = new Set();

  for (const mode of modes) {
    const workflowMode = mode.workflowMode;
    const packet = mode.packet;
    const skillMdPath = packet ? path.join(skillRoot, packet, 'SKILL.md') : null;
    const hasPacket = Boolean(skillMdPath && fs.existsSync(skillMdPath));
    const signal = routerSignals[workflowMode];
    const hasRouterSignal = Boolean(signal);
    const classes = Array.isArray(signal?.classes) ? signal.classes : [];
    const missingVocabularyClasses = classes.filter((className) => !vocabularyClasses[className]);

    if (!hasPacket || !hasRouterSignal || missingVocabularyClasses.length > 0) {
      const missing = [];
      if (!hasPacket) missing.push('packet');
      if (!hasRouterSignal) missing.push('routerSignal');
      if (missingVocabularyClasses.length > 0) missing.push('vocabularyClasses');
      const defect = { workflowMode, packet, missing, missingVocabularyClasses };
      missingModes.push(defect);
      findings.push({
        class: 'missing_mode',
        severity: 'P0',
        locus: workflowMode,
        detail: `${workflowMode} is missing ${missing.join(', ')}`,
      });
    }

    if (hasPacket && mode.packetSkillName) {
      const actualName = extractFrontmatterName(skillMdPath);
      if (actualName !== mode.packetSkillName) {
        const mismatch = { workflowMode, packet, expected: mode.packetSkillName, actual: actualName };
        packetNameMismatches.push(mismatch);
        findings.push({
          class: 'packet_name_mismatch',
          severity: 'P1',
          locus: packet,
          detail: `${packet} declares ${actualName || 'no name'} instead of ${mode.packetSkillName}`,
        });
      }
    }

    for (const alias of Array.isArray(mode.aliases) ? mode.aliases : []) {
      const normalized = normalizeKeyword(alias);
      if (!normalized) continue;
      rawAliases.add(normalized);
      rawIntentAliases.add(normalizeIntentKeyword(alias));
      if (!aliasOwners.has(normalized)) aliasOwners.set(normalized, new Set());
      aliasOwners.get(normalized).add(workflowMode);
    }
  }

  const deadPackets = fs.readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^design-/.test(entry.name))
    .map((entry) => entry.name)
    .filter((packet) => !referencedPackets.has(packet));
  for (const packet of deadPackets) {
    findings.push({
      class: 'dead_packet',
      severity: 'P0',
      locus: packet,
      detail: `${packet} is present on disk but not referenced by the registry`,
    });
  }

  const aliasCollisions = [];
  for (const [alias, owners] of aliasOwners.entries()) {
    if (owners.size < 2) continue;
    const collision = { alias, workflowModes: Array.from(owners).sort() };
    aliasCollisions.push(collision);
    findings.push({
      class: 'alias_collision',
      severity: 'P0',
      locus: alias,
      detail: `${alias} is owned by ${collision.workflowModes.join(', ')}`,
    });
  }

  const typedKeywords = new Set();
  for (const [className, value] of Object.entries(vocabularyClasses)) {
    if (className.endsWith('-aliases')) continue;
    for (const keyword of Array.isArray(value?.keywords) ? value.keywords : []) {
      const normalized = normalizeIntentKeyword(keyword);
      if (normalized) typedKeywords.add(normalized);
    }
  }
  const uncoveredKeywords = Array.from(rawIntentAliases).filter((alias) => !typedKeywords.has(alias)).sort();
  const uncoveredIntentRate = rawIntentAliases.size > 0 ? uncoveredKeywords.length / rawIntentAliases.size : 0;

  const gateFailed = missingModes.length > 0 || deadPackets.length > 0 || aliasCollisions.length > 0;
  const penalty = findings.reduce((acc, f) => acc + (SEVERITY_PENALTY[f.severity] || 0), 0);
  return {
    registryPresent: true,
    score: Math.max(0, 100 - penalty),
    gateFailed,
    verdict: gateFailed ? 'BLOCKED-BY-REGISTRY' : null,
    findings,
    missingModes,
    deadPackets,
    packetNameMismatches,
    aliasCollisions,
    uncoveredIntentRate,
    uncoveredKeywords,
  };
}

/**
 * Statically scan a skill's router connectivity and produce the D5 gate verdict.
 *
 * @param {Object} args - Scan inputs.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @returns {{ score:number, gateFailed:boolean, findings:Array,
 *   deadResourcePaths:string[], deadIntentKeys:string[], orphanReferences:string[],
 *   pathEscapes:string[], routerParseable:boolean, hubStageTwoRouted:number }}
 */
function scanConnectivity({ skillRoot }) {
  const findings = [];
  const skillMdPath = path.join(skillRoot, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    // Score mirrors the normal penalty path (100 - one P0 of 40 = 60) so a
    // score-comparison consumer sees the same number for the same one-P0
    // condition; gateFailed is the authoritative verdict signal either way.
    return {
      score: 60, gateFailed: true, routerParseable: false, hubStageTwoRouted: 0,
      deadResourcePaths: [], deadIntentKeys: [], orphanReferences: [], pathEscapes: [],
      findings: [{ class: 'missing_skill_md', severity: 'P0', detail: 'SKILL.md not found' }],
    };
  }
  const skillMdText = fs.readFileSync(skillMdPath, 'utf8');
  const router = parseRouter(skillMdText, skillRoot);
  const hubStageTwo = readHubStageTwoRoute(skillRoot);
  const intentModelKeys = readIntentKeys(skillMdText, 'INTENT_MODEL');
  const intentKeys = new Set([...Object.keys(router.intentSignals), ...intentModelKeys]);
  const deadResourcePaths = [];
  const deadIntentKeys = [];
  const pathEscapes = [];
  const routedRefs = new Set();
  // Always-loaded default resources are reachable on every route, so they count
  // as covered (not orphans) even when no intent maps to them.
  for (const r of router.defaultResource || []) routedRefs.add(r);
  // A loading-level path counts as routed, so it is held to the same existence
  // bar as any other route: a tier that names a file which is not there loads
  // nothing.
  for (const r of readLoadingLevelPaths(skillMdText)) {
    routedRefs.add(r);
    const { resolved, escapes } = resolveRoutedPath(skillRoot, r);
    if (escapes) {
      pathEscapes.push(r);
      findings.push({ class: 'path_escape', severity: 'P0', locus: r, detail: `${r} resolves outside skill root (routed from a loading level)` });
    } else if (!fs.existsSync(resolved)) {
      deadResourcePaths.push(r);
      findings.push({ class: 'dead_resource_path', severity: 'P0', locus: r, detail: `routed path ${r} does not exist (routed from a loading level)` });
    }
  }

  for (const r of hubStageTwo.routed) {
    routedRefs.add(r);
    const { resolved, escapes } = resolveRoutedPath(skillRoot, r);
    if (escapes) {
      pathEscapes.push(r);
      findings.push({ class: 'path_escape', severity: 'P0', locus: r, detail: `${r} resolves outside skill root (routed from ${hubStageTwo.source})` });
    } else if (!fs.existsSync(resolved)) {
      deadResourcePaths.push(r);
      findings.push({ class: 'dead_resource_path', severity: 'P0', locus: r, detail: `routed path ${r} does not exist (routed from ${hubStageTwo.source})` });
    }
  }

  for (const [intent, resources] of Object.entries(router.resourceMap)) {
    if (!intentKeys.has(intent)) {
      deadIntentKeys.push(intent);
      findings.push({ class: 'dead_intent_key', severity: 'P1', locus: `RESOURCE_MAP.${intent}`, detail: `${intent} has no INTENT_SIGNALS entry` });
    }
    for (const r of resources) {
      routedRefs.add(r);
      const { resolved, escapes } = resolveRoutedPath(skillRoot, r);
      if (escapes) {
        pathEscapes.push(r);
        findings.push({ class: 'path_escape', severity: 'P0', locus: r, detail: `${r} resolves outside skill root` });
      } else if (!fs.existsSync(resolved)) {
        deadResourcePaths.push(r);
        findings.push({ class: 'dead_resource_path', severity: 'P0', locus: r, detail: `routed path ${r} does not exist` });
      }
    }
  }

  // Some markdown is legitimately not task-routable — directory-index READMEs,
  // reference-only archaeology, auto-generated dashboards. A skill may declare
  // those in a routing-allowlist so an honest "leave it unrouted" is not scored
  // as a coverage defect (and cannot be laundered into a fake intent to pass a
  // gate). Absent the file, behavior is unchanged.
  const allowlist = readRoutingAllowlist(skillRoot);
  const unrouted = listMarkdownRefs(skillRoot).filter((ref) => !routedRefs.has(ref));
  const orphanReferences = unrouted.filter((ref) => !allowlist.has(ref));
  for (const orphan of orphanReferences) {
    findings.push({ class: 'orphan_reference', severity: 'P2', locus: orphan, detail: `${orphan} is not reachable from any RESOURCE_MAP intent` });
  }
  for (const exempt of unrouted.filter((ref) => allowlist.has(ref))) {
    findings.push({ class: 'orphan_allowlisted', severity: 'info', locus: exempt, detail: `${exempt} is intentionally unrouted (routing-allowlist)` });
  }

  // Hard gate: any P0 (dead path / escape / unparseable). Dead intent keys (P1)
  // and orphans (P2) lower the score but do not gate by themselves. A packet
  // routed by its hub's stage-two map is routable even with no router of its own.
  const routerParseable = router.parseable || intentModelKeys.size > 0 || hubStageTwo.present;
  const p0 = findings.filter((f) => f.severity === 'P0').length;
  const gateFailed = p0 > 0 || !routerParseable;
  if (!routerParseable) {
    findings.push({ class: 'router_unparseable', severity: 'P0', detail: 'INTENT_SIGNALS / RESOURCE_MAP could not be parsed from SKILL.md, and no parent hub stage-two router routes this packet' });
  }
  // Score: start at 100, subtract per finding by severity, floor 0.
  const penalty = findings.reduce((acc, f) => acc + (SEVERITY_PENALTY[f.severity] || 0), 0);
  const score = Math.max(0, 100 - penalty);

  return { score, gateFailed, routerParseable, hubStageTwoRouted: hubStageTwo.routed.size, deadResourcePaths, deadIntentKeys, orphanReferences, pathEscapes, findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { scanConnectivity, scanHubRegistry, listMarkdownRefs };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill) {
    process.stderr.write('usage: d5-connectivity.cjs --skill <skill-root>\n');
    process.exit(2);
  }
  const res = scanConnectivity({ skillRoot: args.skill });
  const registry = scanHubRegistry({ skillRoot: args.skill });
  if (registry.registryPresent) {
    process.stdout.write(JSON.stringify({ connectivity: res, hubRegistry: registry }, null, 2) + '\n');
    process.exit(res.gateFailed || registry.gateFailed ? 1 : 0);
  }
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
  process.exit(res.gateFailed ? 1 : 0);
}
