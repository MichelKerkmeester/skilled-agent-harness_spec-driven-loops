#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parent-hub-vocab-sync — design family vocabulary drift guard             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Build a classified projection from a parent hub's typed vocabulary and check
 * that user-facing aliases still agree across the registry, hub, metadata, and
 * mode packets.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HARD_VERDICT = 'VOCAB-DRIFT';
const SCORE_PENALTY = { P0: 40, P1: 12, P2: 3 };
const MODE_PREFIXES = [
  ['md-generator-', 'md-generator'],
  ['interface-', 'interface'],
  ['foundations-', 'foundations'],
  ['motion-', 'motion'],
  ['audit-', 'audit'],
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emptyResult(overrides = {}) {
  return {
    familyPresent: false,
    projectionParsed: false,
    typedKeywordCount: 0,
    score: 100,
    driftDetected: false,
    verdict: null,
    findings: [],
    orphanAliases: [],
    aliasCollisions: [],
    ownershipDrift: [],
    untypedKeywords: [],
    untypedKeywordRate: null,
    phantomTypedKeywords: [],
    triggerPhraseCoverage: null,
    ...overrides,
  };
}

function normalizePhrase(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/^[^\w]+|[^\w]+$/g, '')
    .replace(/[-\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function addSet(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function addEntry(map, raw, value) {
  const key = normalizePhrase(raw);
  if (!key) return;
  addSet(map, key, value);
}

function sortedValues(set) {
  return [...set].sort();
}

function readJson(filePath, findings, label, required) {
  try {
    if (!fs.existsSync(filePath)) {
      if (required) {
        findings.push({
          class: 'unparseable-input',
          severity: 'P0',
          locus: label,
          detail: `${label} is missing`,
        });
      }
      return null;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch (err) {
    findings.push({
      class: 'unparseable-input',
      severity: 'P0',
      locus: label,
      detail: err.message,
    });
    return null;
  }
}

function ownerModeForClass(className) {
  if (className === 'hub-identity') return null;
  for (const [prefix, mode] of MODE_PREFIXES) {
    if (className.startsWith(prefix)) return mode;
  }
  return null;
}

function extractHubKeywords(skillMd) {
  const match = /<!--\s*keywords\s*:\s*([\s\S]*?)-->/i.exec(skillMd || '');
  if (!match) return [];
  const body = match[1].trim();
  return body.includes(',')
    ? body.split(',').map((item) => item.trim()).filter(Boolean)
    : body.split(/\s+/).map((item) => item.trim()).filter(Boolean);
}

function graphTriggerPhrases(graph) {
  const phrases = [];
  if (Array.isArray(graph && graph.trigger_phrases)) phrases.push(...graph.trigger_phrases);
  if (Array.isArray(graph && graph.derived && graph.derived.trigger_phrases)) {
    phrases.push(...graph.derived.trigger_phrases);
  }
  return [...new Set(phrases.map(String))];
}

function buildProjection(vocabularyClasses) {
  const projection = new Map();
  const typedKeywordRaw = new Map();
  const typedAliasKeys = new Set();

  for (const [className, klass] of Object.entries(vocabularyClasses || {})) {
    const ownerMode = ownerModeForClass(className);
    const keywords = Array.isArray(klass && klass.keywords) ? klass.keywords : [];
    for (const raw of keywords) {
      const normalized = normalizePhrase(raw);
      if (!normalized) continue;
      if (!projection.has(normalized)) {
        projection.set(normalized, { phrases: new Set(), classes: new Set(), modes: new Set() });
      }
      const entry = projection.get(normalized);
      entry.phrases.add(String(raw));
      entry.classes.add(className);
      if (ownerMode) entry.modes.add(ownerMode);
      addSet(typedKeywordRaw, normalized, String(raw));
      if (className.endsWith('-aliases')) typedAliasKeys.add(normalized);
    }
  }

  return { projection, typedKeywordRaw, typedAliasKeys };
}

function buildRegistryAliases(registry) {
  const aliases = [];
  const ownerMap = new Map();
  const modes = Array.isArray(registry && registry.modes) ? registry.modes : [];
  for (const mode of modes) {
    const workflowMode = mode && mode.workflowMode ? String(mode.workflowMode) : '';
    if (!workflowMode || !Array.isArray(mode.aliases)) continue;
    for (const raw of mode.aliases) {
      const normalized = normalizePhrase(raw);
      if (!normalized) continue;
      aliases.push({ mode: workflowMode, phrase: String(raw), normalized });
      addSet(ownerMap, normalized, workflowMode);
    }
  }
  return { aliases, ownerMap };
}

function buildIntentSignalOwners(skillRoot, registry, findings) {
  const owners = new Map();
  const modes = Array.isArray(registry && registry.modes) ? registry.modes : [];

  for (const mode of modes) {
    const workflowMode = mode && mode.workflowMode ? String(mode.workflowMode) : '';
    const packet = mode && mode.packet ? String(mode.packet) : '';
    if (!workflowMode || !packet) continue;

    const skillMdPath = path.join(skillRoot, packet, 'SKILL.md');
    try {
      if (!fs.existsSync(skillMdPath)) continue;
      const skillMd = fs.readFileSync(skillMdPath, 'utf8');
      const router = parseRouter(skillMd, path.join(skillRoot, packet));
      for (const signal of Object.values(router.intentSignals || {})) {
        for (const keyword of Array.isArray(signal.keywords) ? signal.keywords : []) {
          addEntry(owners, keyword, workflowMode);
        }
      }
    } catch (err) {
      findings.push({
        class: 'mode-intent-unparseable',
        severity: 'P2',
        locus: packet,
        detail: err.message,
      });
    }
  }

  return owners;
}

function sourceKeys({ registryAliases, hubKeywords, triggerPhrases, intentSignalOwners }) {
  const keys = new Set(registryAliases.map((alias) => alias.normalized));
  for (const phrase of hubKeywords) {
    const normalized = normalizePhrase(phrase);
    if (normalized) keys.add(normalized);
  }
  for (const phrase of triggerPhrases) {
    const normalized = normalizePhrase(phrase);
    if (normalized) keys.add(normalized);
  }
  for (const key of intentSignalOwners.keys()) keys.add(key);
  return keys;
}

function makeFinding(item, className, detail) {
  return {
    class: className,
    severity: 'P0',
    locus: item.phrase || item.normalized,
    detail,
  };
}

function scoreFromFindings(findings) {
  const penalty = findings.reduce((sum, finding) => {
    return sum + (SCORE_PENALTY[finding.severity] || 0);
  }, 0);
  return Math.max(0, 100 - penalty);
}

function formatCollision(normalized, modes, sources) {
  return {
    normalized,
    modes: sortedValues(modes),
    sources: sortedValues(sources),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check a parent design hub for vocabulary drift across its user-facing copies.
 *
 * @param {Object} args - Scan inputs.
 * @param {string} args.skillRoot - Skill root containing hub-router.json.
 * @returns {Object} Drift report and reported vocabulary metrics.
 */
function checkVocabSync({ skillRoot }) {
  if (!skillRoot || typeof skillRoot !== 'string') {
    return emptyResult({
      findings: [{
        class: 'invalid-input',
        severity: 'P0',
        locus: 'skillRoot',
        detail: 'skillRoot must be a path string',
      }],
      score: 60,
    });
  }

  const hubPath = path.join(skillRoot, 'hub-router.json');
  const registryPath = path.join(skillRoot, 'mode-registry.json');
  if (!fs.existsSync(hubPath) || !fs.existsSync(registryPath)) return emptyResult();

  const findings = [];
  const hub = readJson(hubPath, findings, 'hub-router.json', true);
  const registry = readJson(registryPath, findings, 'mode-registry.json', true);
  const graph = readJson(path.join(skillRoot, 'graph-metadata.json'), findings, 'graph-metadata.json', false) || {};
  const projectionParsed = Boolean(
    hub && hub.vocabularyClasses && typeof hub.vocabularyClasses === 'object',
  );

  if (!hub || !registry || !projectionParsed) {
    if (!projectionParsed) {
      findings.push({
        class: 'unparseable-input',
        severity: 'P0',
        locus: 'hub-router.json',
        detail: 'vocabularyClasses is missing or not an object',
      });
    }
    return emptyResult({
      familyPresent: true,
      projectionParsed,
      findings,
      score: scoreFromFindings(findings),
    });
  }

  const skillMdPath = path.join(skillRoot, 'SKILL.md');
  const hubSkillMd = fs.existsSync(skillMdPath) ? fs.readFileSync(skillMdPath, 'utf8') : '';
  const hubKeywords = extractHubKeywords(hubSkillMd);
  const triggerPhrases = graphTriggerPhrases(graph);
  const { projection, typedKeywordRaw, typedAliasKeys } = buildProjection(hub.vocabularyClasses);
  const { aliases: registryAliases, ownerMap: registryAliasOwners } = buildRegistryAliases(registry);
  const intentSignalOwners = buildIntentSignalOwners(skillRoot, registry, findings);

  const orphanAliases = [];
  const ownershipDrift = [];
  for (const alias of registryAliases) {
    const typed = projection.get(alias.normalized);
    const typedModes = typed ? typed.modes : new Set();
    if (!typed || typedModes.size === 0) {
      orphanAliases.push(alias);
    } else if (!typedModes.has(alias.mode)) {
      ownershipDrift.push({
        ...alias,
        typedModes: sortedValues(typedModes),
        classes: sortedValues(typed.classes),
      });
    }
  }

  const aliasCollisions = [];
  const collisionKeys = new Set([...typedAliasKeys, ...registryAliasOwners.keys()]);

  for (const key of collisionKeys) {
    const modes = new Set();
    const sources = new Set();
    if (registryAliasOwners.has(key)) {
      for (const mode of registryAliasOwners.get(key)) modes.add(mode);
      sources.add('mode-registry');
    }
    const typed = projection.get(key);
    if (typed) {
      for (const mode of typed.modes) modes.add(mode);
      sources.add('hub-router');
    }
    if (modes.size > 1) aliasCollisions.push(formatCollision(key, modes, sources));
  }

  const hubKeywordKeys = hubKeywords.map(normalizePhrase).filter(Boolean);
  const untypedKeywords = hubKeywords.filter((keyword) => !projection.has(normalizePhrase(keyword)));
  const untypedKeywordRate = hubKeywordKeys.length
    ? untypedKeywords.length / hubKeywordKeys.length
    : null;

  const allSourceKeys = sourceKeys({ registryAliases, hubKeywords, triggerPhrases, intentSignalOwners });
  const phantomTypedKeywords = [...typedKeywordRaw.entries()]
    .filter(([key]) => {
      const typed = projection.get(key);
      if (typed && typed.classes.has('hub-identity')) return false;
      return !allSourceKeys.has(key);
    })
    .map(([, raw]) => sortedValues(raw)[0])
    .sort();

  const coveredTriggerCount = triggerPhrases.filter((phrase) => {
    const normalized = normalizePhrase(phrase);
    return normalized && (projection.has(normalized) || registryAliasOwners.has(normalized));
  }).length;
  const triggerPhraseCoverage = triggerPhrases.length
    ? coveredTriggerCount / triggerPhrases.length
    : null;

  for (const item of orphanAliases) {
    findings.push(makeFinding(item, 'orphan-alias', `${item.mode} alias is not typed by the hub vocabulary`));
  }
  for (const item of aliasCollisions) {
    findings.push(makeFinding(item, 'alias-collision', `phrase belongs to multiple modes: ${item.modes.join(', ')}`));
  }
  for (const item of ownershipDrift) {
    findings.push(makeFinding(item, 'ownership-drift', `${item.mode} alias is typed as ${item.typedModes.join(', ')}`));
  }

  const driftDetected = orphanAliases.length > 0 || aliasCollisions.length > 0 || ownershipDrift.length > 0;

  return {
    familyPresent: true,
    projectionParsed: true,
    typedKeywordCount: projection.size,
    score: scoreFromFindings(findings),
    driftDetected,
    verdict: driftDetected ? HARD_VERDICT : null,
    findings,
    orphanAliases,
    aliasCollisions,
    ownershipDrift,
    untypedKeywords,
    untypedKeywordRate,
    phantomTypedKeywords,
    triggerPhraseCoverage,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  checkVocabSync,
  normalizePhrase,
  ownerModeForClass,
};

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill) {
    process.stderr.write('usage: parent-hub-vocab-sync.cjs --skill <skill-root>\n');
    process.exit(2);
  }

  try {
    const result = checkVocabSync({ skillRoot: args.skill });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (result.findings.some((finding) => finding.class === 'unparseable-input' || finding.class === 'invalid-input')) {
      process.exit(2);
    }
    process.exit(result.driftDetected ? 1 : 0);
  } catch (err) {
    process.stderr.write(`[parent-hub-vocab-sync] ${err.message}\n`);
    process.exit(2);
  }
}
