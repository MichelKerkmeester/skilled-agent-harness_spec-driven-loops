#!/usr/bin/env node
/**
 * parent-skill-check.cjs — read-only structural audit for the
 * "parent skill with nested mode packets" pattern.
 *
 * A parent skill keeps ONE advisor identity at the hub and routes to N
 * non-discoverable mode packets through a declarative mode-registry. The
 * skill-graph compiler keys discovery on graph-metadata.json and throws
 * when a nested packet declares its own identity, so the structure has a
 * single hard invariant: exactly one graph-metadata.json per parent skill.
 * This checker asserts that invariant plus the registry contract that the
 * advisor's hardcoded projection maps are tested against, reporting PASS
 * or FAIL per check without mutating anything.
 *
 * Usage:
 *   node parent-skill-check.cjs [parent-skill-dir]
 *
 * Default target is the canonical reference implementation so the script
 * self-tests against a structure that must always be clean.
 *
 * Exit codes:
 *   0  — every invariant passed
 *   1  — at least one invariant failed
 *   2  — target directory missing or unreadable
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Families the skill-graph compiler accepts for a discoverable identity.
// Mirrors ALLOWED_FAMILIES in skill_graph_compiler.py / skill-graph-db.ts;
// a family outside this set makes the hub undiscoverable.
const ALLOWED_FAMILIES = ['cli', 'mcp', 'sk-code', 'deep-loop', 'sk-util', 'system'];

// The advisor reaches a mode through one of these classes; the registry
// declares it per mode so the projection maps stay auditable.
const VALID_ROUTING_CLASSES = ['lexical', 'alias-fold', 'metadata', 'command-bridge'];

// The graph-backed convergence loop keys consumed by the runtime backend.
// null is the explicit, load-bearing value for host/adapter modes that do not
// run a convergence loop — it is never inferred from the workflow mode.
const VALID_RUNTIME_LOOP_TYPES = ['research', 'review', 'council', 'context', null];

// Which backend actually runs a mode. Any other value points at a backend the
// router cannot dispatch to.
const VALID_BACKEND_KINDS = ['runtime-loop-type', 'improvement-host', 'external-adapter'];

// The canonical reference implementation. Some cross-checks compare against the
// single global advisor projection map, which only mirrors this one skill; for
// any other target the per-skill drift-guard test is the authoritative parity
// guard, so those checks scope themselves to this basename.
const CANONICAL_BASENAME = 'deep-loop-workflows';

// The drift-guard that keeps the advisor's hardcoded projection maps equal
// to the registry projection. Its presence is the structural guarantee that
// the registry is the single source of truth, not a parallel copy.
const DRIFT_GUARD_TEST =
  '.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts';

// Advisor entrypoint for the optional dynamic cross-check of the registry's
// lexical projection against the live hardcoded map.
const ADVISOR_SCRIPT =
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py';

const DEFAULT_TARGET = '.opencode/skills/deep-loop-workflows';

const IS_TTY = Boolean(process.stdout.isTTY);
function color(text, code) {
  return IS_TTY ? `[${code}m${text}[0m` : text;
}
const red = (s) => color(s, '31');
const green = (s) => color(s, '32');
const yellow = (s) => color(s, '33');
const blue = (s) => color(s, '34');

let fails = 0;
let warns = 0;
function pass(msg) {
  console.log(`${green('PASS')}: ${msg}`);
}
function fail(msg) {
  console.error(`${red('FAIL')}: ${msg}`);
  fails += 1;
}
function warn(msg) {
  console.error(`${yellow('WARN')}: ${msg}`);
  warns += 1;
}
function info(msg) {
  console.log(`${blue('INFO')}: ${msg}`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Recursively collect every graph-metadata.json beneath a directory.
function findGraphMetadata(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'graph-metadata.json') {
        out.push(full);
      }
    }
  }
  return out;
}

function main() {
  const argTarget = process.argv[2] || DEFAULT_TARGET;
  const target = path.resolve(argTarget);
  const basename = path.basename(target);

  info(`Parent skill: ${argTarget}`);
  info(`Resolved:     ${target}`);
  console.log('');

  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    console.error(`${red('ERROR')}: parent skill directory not found: ${target}`);
    return 2;
  }

  // ───────────────────────────────────────────────────────────────
  // 1. EXACTLY ONE graph-metadata.json (the hub's), well-formed identity
  // ───────────────────────────────────────────────────────────────
  const metaFiles = findGraphMetadata(target);
  const hubMeta = path.join(target, 'graph-metadata.json');

  if (metaFiles.length === 1 && metaFiles[0] === hubMeta) {
    pass('1a: exactly one graph-metadata.json, located at the hub root');
  } else if (metaFiles.length === 0) {
    fail('1a: no graph-metadata.json found — the hub has no discoverable identity');
  } else {
    const rel = metaFiles.map((f) => path.relative(target, f) || '.');
    fail(`1a: expected exactly one graph-metadata.json at the hub root; found ${metaFiles.length}: ${rel.join(', ')}`);
  }

  if (fs.existsSync(hubMeta)) {
    let meta;
    try {
      meta = readJson(hubMeta);
    } catch (e) {
      fail(`1b: hub graph-metadata.json is not valid JSON: ${e.message}`);
      meta = null;
    }
    if (meta) {
      if (meta.skill_id === basename) {
        pass(`1b: hub skill_id "${meta.skill_id}" matches directory name`);
      } else {
        fail(`1b: hub skill_id "${meta.skill_id}" does not match directory name "${basename}"`);
      }
      if (ALLOWED_FAMILIES.includes(meta.family)) {
        pass(`1c: hub family "${meta.family}" is in the allowed set`);
      } else {
        fail(`1c: hub family "${meta.family}" not in allowed set {${ALLOWED_FAMILIES.join(', ')}}`);
      }
    }
  } else {
    fail('1b: no hub graph-metadata.json at the root — cannot check identity');
  }

  // ───────────────────────────────────────────────────────────────
  // 2. NO graph-metadata.json inside any mode packet or shared/
  // ───────────────────────────────────────────────────────────────
  const nested = metaFiles.filter((f) => f !== hubMeta);
  if (nested.length === 0) {
    pass('2a: no nested graph-metadata.json inside any packet or shared/');
  } else {
    const rel = nested.map((f) => path.relative(target, f));
    fail(`2a: nested graph-metadata.json found (re-introduces a second identity): ${rel.join(', ')}`);
  }

  // ───────────────────────────────────────────────────────────────
  // 3. mode-registry.json: packets resolve, discriminator + routing present
  // ───────────────────────────────────────────────────────────────
  const registryPath = path.join(target, 'mode-registry.json');
  let registry = null;
  if (!fs.existsSync(registryPath)) {
    fail('3a: mode-registry.json is missing');
  } else {
    try {
      registry = readJson(registryPath);
      pass('3a: mode-registry.json exists and parses as JSON');
    } catch (e) {
      fail(`3a: mode-registry.json is not valid JSON: ${e.message}`);
    }
  }

  if (registry) {
    const modes = Array.isArray(registry.modes) ? registry.modes : [];
    if (modes.length === 0) {
      fail('3b: mode-registry.json has no modes array');
    } else {
      pass(`3b: mode-registry.json declares ${modes.length} modes`);

      let packetOk = true;
      let discriminatorOk = true;
      let routingOk = true;

      for (const mode of modes) {
        const label = mode.workflowMode || '<unnamed>';

        // 3c — every mode's packet value must be a DIRECT child sub-dir. An
        // absolute path or one that escapes the hub (e.g. "../sk-code") would
        // otherwise resolve to a real directory outside the skill and pass.
        const packet = mode.packet;
        if (!packet || typeof packet !== 'string') {
          fail(`3c: mode "${label}" has no packet value`);
          packetOk = false;
        } else if (path.isAbsolute(packet) || packet.split(/[\\/]/).includes('..')) {
          fail(`3c: mode "${label}" packet "${packet}" must be a direct child directory (no absolute or "../" paths)`);
          packetOk = false;
        } else {
          const packetDir = path.join(target, packet);
          // Confirm the resolved path is still contained within the hub.
          const rel = path.relative(target, packetDir);
          if (rel.startsWith('..') || path.isAbsolute(rel)) {
            fail(`3c: mode "${label}" packet "${packet}" resolves outside the hub directory`);
            packetOk = false;
          } else if (!fs.existsSync(packetDir) || !fs.statSync(packetDir).isDirectory()) {
            fail(`3c: mode "${label}" packet "${packet}" is not an existing sub-directory`);
            packetOk = false;
          }
        }

        // 3d — three-tier discriminator: workflowMode + backendKind required;
        // runtimeLoopType must be present as a key but may be null. Values are
        // validated against the allowed sets, not merely checked for presence —
        // an out-of-set value silently breaks dispatch.
        if (typeof mode.workflowMode !== 'string' || mode.workflowMode.length === 0) {
          fail(`3d: mode "${label}" is missing workflowMode`);
          discriminatorOk = false;
        }
        if (!('runtimeLoopType' in mode)) {
          fail(`3d: mode "${label}" is missing the runtimeLoopType key (null is allowed, absence is not)`);
          discriminatorOk = false;
        } else if (!VALID_RUNTIME_LOOP_TYPES.includes(mode.runtimeLoopType)) {
          fail(`3d: mode "${label}" has invalid runtimeLoopType ${JSON.stringify(mode.runtimeLoopType)} (expected one of {research, review, council, context, null})`);
          discriminatorOk = false;
        }
        if (typeof mode.backendKind !== 'string' || mode.backendKind.length === 0) {
          fail(`3d: mode "${label}" is missing backendKind`);
          discriminatorOk = false;
        } else if (!VALID_BACKEND_KINDS.includes(mode.backendKind)) {
          fail(`3d: mode "${label}" has invalid backendKind ${JSON.stringify(mode.backendKind)} (expected one of {${VALID_BACKEND_KINDS.join(', ')}})`);
          discriminatorOk = false;
        }

        // 3e — advisorRouting block with a valid routingClass.
        const routing = mode.advisorRouting;
        if (!routing || typeof routing !== 'object') {
          fail(`3e: mode "${label}" is missing an advisorRouting block`);
          routingOk = false;
        } else if (!VALID_ROUTING_CLASSES.includes(routing.routingClass)) {
          fail(`3e: mode "${label}" has invalid routingClass ${JSON.stringify(routing.routingClass)} (expected one of {${VALID_ROUTING_CLASSES.join(', ')}})`);
          routingOk = false;
        }
      }

      if (packetOk) pass('3c: every mode packet resolves to an existing sub-directory');
      if (discriminatorOk) pass('3d: every mode carries the 3-tier discriminator (workflowMode, runtimeLoopType, backendKind)');
      if (routingOk) pass('3e: every mode has an advisorRouting block with a valid routingClass');
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 4. The drift-guard is wired (registry == hardcoded advisor maps)
  // ───────────────────────────────────────────────────────────────
  const driftGuardPath = path.resolve(DRIFT_GUARD_TEST);
  if (basename === CANONICAL_BASENAME) {
    if (fs.existsSync(driftGuardPath)) {
      pass('4a: routing-registry drift-guard test is present');
    } else {
      fail(`4a: drift-guard test is missing at ${DRIFT_GUARD_TEST} — registry/maps parity is unguarded`);
    }
  } else {
    info('4a: drift-guard presence is canonical-scoped; a non-canonical parent skill must author its own drift-guard test scoped to its mode-registry (not verified here — see 4c for inert-routing coverage)');
  }

  // 4b — optional dynamic cross-check: compare the registry's lexical
  // projection {legacyAdvisorId -> workflowMode} against the advisor's live
  // DEEP_ROUTING_MODE_BY_KEY. Soft: a missing interpreter or dump just skips,
  // because the drift-guard test (4a) is the authoritative parity assertion.
  //
  // Scoped to the canonical skill only. The advisor's projection map is a single
  // global table that mirrors the canonical reference; running this against any
  // other skill compares its registry to a map that never mentions it and
  // false-fails. For every non-canonical skill the per-skill drift-guard test
  // (4a) is the authoritative guard, so 4b explicitly skips them.
  // The drift-guard test (4a) is the authoritative parity assertion. This dynamic
  // check additionally surfaces the inert-routing gap: a lexical mode
  // whose legacyAdvisorId is absent from the advisor's hardcoded map will not route
  // until it is wired into the Python/TS projection maps + a per-skill drift-guard
  // (the advisor-sync step). For the canonical skill it asserts exact equality.
  const lexicalIds = {};
  if (registry && Array.isArray(registry.modes)) {
    for (const mode of registry.modes) {
      const routing = mode.advisorRouting;
      if (routing && routing.routingClass === 'lexical' && routing.legacyAdvisorId) {
        lexicalIds[routing.legacyAdvisorId] = mode.workflowMode;
      }
    }
  }
  if (Object.keys(lexicalIds).length === 0) {
    info('4b: registry declares no lexical modes; nothing to wire into the advisor');
  } else if (!fs.existsSync(path.resolve(ADVISOR_SCRIPT))) {
    warn(`4b: advisor script not found at ${ADVISOR_SCRIPT}; skipping advisor coverage check`);
  } else {
    let dumped = null;
    try {
      const raw = execFileSync('python3', [ADVISOR_SCRIPT, '--dump-routing-maps'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 15000,
      });
      dumped = JSON.parse(raw).DEEP_ROUTING_MODE_BY_KEY || {};
    } catch (e) {
      warn(`4b: could not dump advisor routing maps (${e.message.split('\n')[0]}); skipping advisor coverage check`);
    }
    if (dumped) {
      // Only the canonical skill is expected to fully own the live global map.
      if (basename === CANONICAL_BASENAME) {
        const expectedKeys = Object.keys(lexicalIds).sort();
        const dumpedKeys = Object.keys(dumped).sort();
        const match = expectedKeys.length === dumpedKeys.length && expectedKeys.every((k) => dumped[k] === lexicalIds[k]);
        if (match) {
          pass(`4b: registry lexical projection matches advisor DEEP_ROUTING_MODE_BY_KEY (${expectedKeys.length} keys)`);
        } else {
          fail(`4b: registry lexical projection ${JSON.stringify(lexicalIds)} != advisor DEEP_ROUTING_MODE_BY_KEY ${JSON.stringify(dumped)}`);
        }
      } else {
        const inert = Object.keys(lexicalIds).filter((id) => !(id in dumped));
        if (inert.length === 0) {
          pass(`4c: all ${Object.keys(lexicalIds).length} lexical mode(s) are wired into the advisor projection map`);
        } else {
          warn(`4c: ${inert.length} lexical mode(s) are INERT — legacyAdvisorId(s) [${inert.join(', ')}] are absent from the advisor's routing map; wire them into the Python/TS maps + a per-skill drift-guard or they will not route`);
        }
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────
  console.log('');
  console.log('─────────────────────────────────────────────────────────────────');
  if (fails === 0) {
    console.log(`${green('OK')}: parent-skill-check — all invariants passed, ${warns} warnings`);
    return 0;
  }
  console.error(`${red('FAIL')}: parent-skill-check — ${fails} invariant failures, ${warns} warnings`);
  return 1;
}

process.exit(main());
