#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parent-skill-check Doctor Script                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * parent-skill-check.cjs — read-only structural audit for the canonical
 * "parent hub with nested packets" pattern (the ONE method).
 *
 * A parent hub keeps ONE advisor identity at the hub and routes to N
 * non-discoverable packets through a declarative mode-registry, with a
 * hub-router describing how a prompt picks/bundles modes. Every packet is a
 * modes[] entry with a required packetKind discriminator (workflow | surface);
 * surface packets are read-only, advisor-invisible evidence bases. Deep-loop's
 * 3-tier machinery is expressed as named `extensions` that activate in-place
 * fields, so the checks are family-agnostic: they run FULL on every hub and
 * only demand extension-specific fields when the hub declares that extension.
 *
 * Usage:
 *   node parent-skill-check.cjs [parent-skill-dir]
 *   PARENT_HUB_CHECK_STRICT=1 node parent-skill-check.cjs [dir]   # 5-9 as FAIL
 *
 * The migration-window checks 5-9 (hub-router validity, registry/directory
 * reverse consistency, changelog shape, description.json, playbook + benchmark
 * baseline) emit WARN by default and FAIL under PARENT_HUB_CHECK_STRICT — the
 * default flips to strict once every hub carries the canon fields.
 *
 * Exit codes:
 *   0  — every hard invariant passed (warnings allowed)
 *   1  — at least one hard invariant failed
 *   2  — target directory missing or unreadable
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Families the skill-graph compiler accepts for a discoverable identity.
// Mirrors ALLOWED_FAMILIES in skill_graph_compiler.py / skill-graph-db.ts;
// a family outside this set makes the hub undiscoverable.
const ALLOWED_FAMILIES = ['cli', 'mcp', 'sk-code', 'deep-loop', 'sk-util', 'system'];

// The advisor reaches a mode through one of these classes; the registry
// declares it per mode so the projection maps stay auditable. 'metadata' is the
// default for new hubs and for every surface packet (advisor-invisible).
const VALID_ROUTING_CLASSES = ['lexical', 'alias-fold', 'metadata', 'command-bridge'];

// The graph-backed convergence loop keys consumed by a runtime-loop backend.
// null is the explicit value for host/adapter modes; only demanded when the hub
// declares the runtime-loop extension.
const VALID_RUNTIME_LOOP_TYPES = ['research', 'review', 'council', 'context', null];

// Which backend actually runs a mode. Covers both the runtime-loop family and
// the 2-tier surface family; 'evidence-base' is the required kind for a surface
// packet (read-only domain evidence, not a process).
const VALID_BACKEND_KINDS = [
  'runtime-loop-type', 'improvement-host', 'external-adapter',
  'surface-router', 'review-cache', 'evidence-base',
];

// Read-only tool set a surface packet's toolSurface.allowed must stay within.
const SURFACE_ALLOWED_TOOLS = ['Read', 'Bash', 'Grep', 'Glob'];
const SURFACE_FORBIDDEN_TOOLS = ['Write', 'Edit', 'Task'];

// Directories allowed at a hub root without being a registered packet.
const DIRECTORY_ALLOWLIST = new Set([
  'shared', 'changelog', 'benchmark', 'manual_testing_playbook',
  'references', 'assets', 'node_modules', 'scripts', 'templates', 'dist',
]);

// The deep-loop reference drift-guard. A hub with lexical/alias-fold modes must
// point at ITS OWN drift-guard (advisorRoutingContract.driftGuard or the
// advisor-projection extension); this is only the fallback for deep-loop.
const DEEP_LOOP_DRIFT_GUARD =
  '.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts';

// Advisor entrypoint for the optional dynamic cross-check of the registry's
// lexical projection against the live hardcoded map.
const ADVISOR_SCRIPT =
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py';

// The single global advisor projection map only mirrors this hub, so the
// dynamic 4b equality check applies to it; every other hub gets the inert-route
// coverage check (4c) instead. This is interpretation, not a gate — all hubs
// still run the check.
const GLOBAL_MAP_OWNER = 'deep-loop-workflows';

const DEFAULT_TARGET = '.opencode/skills/deep-loop-workflows';

// Migration-window checks fail only under strict; the default flips to strict
// once every hub carries the new canon fields (packetKind, toolSurface, ...).
const STRICT_HUB_CANON = process.env.PARENT_HUB_CHECK_STRICT === '1';

const IS_TTY = Boolean(process.stdout.isTTY);
function color(text, code) {
  return IS_TTY ? `[${code}m${text}[0m` : text;
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
// Migration-window severity: WARN by default, FAIL under strict.
function softFail(msg) {
  (STRICT_HUB_CANON ? fail : warn)(msg);
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

// A file/dir that is a symlink (changelog policy forbids symlinked changelogs).
function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

// Every changelog file that is a symlink, beneath a changelog/ directory.
function symlinkedChangelogs(root) {
  const out = [];
  const stack = [root];
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
      if (entry.isSymbolicLink()) {
        if (current.split(path.sep).includes('changelog') || entry.name.startsWith('CHANGELOG')) {
          out.push(full);
        }
      } else if (entry.isDirectory() && entry.name !== 'node_modules') {
        stack.push(full);
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
  info(`Mode 5-9:     ${STRICT_HUB_CANON ? 'STRICT (FAIL)' : 'migration (WARN)'}`);
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
  // 3. mode-registry.json: packets resolve, two-axis discriminator present
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

  const extensions = (registry && registry.extensions && typeof registry.extensions === 'object')
    ? registry.extensions : {};
  const hasRuntimeLoop = Object.prototype.hasOwnProperty.call(extensions, 'runtime-loop');
  const hasAdvisorProjection = Object.prototype.hasOwnProperty.call(extensions, 'advisor-projection');
  const hasSurfaceAxis = Object.prototype.hasOwnProperty.call(extensions, 'surface-axis');

  const registeredPackets = new Set();
  let surfaceCount = 0;

  if (registry) {
    const modes = Array.isArray(registry.modes) ? registry.modes : [];
    if (modes.length === 0) {
      fail('3b: mode-registry.json has no modes array');
    } else {
      pass(`3b: mode-registry.json declares ${modes.length} modes`);

      let packetOk = true;
      let discriminatorOk = true;   // hard: workflowMode + backendKind presence
      let canonOk = true;           // migration-gated: packetKind, toolSurface, grandfathered, runtimeLoopType
      let routingOk = true;
      let surfaceOk = true;

      for (const mode of modes) {
        const label = mode.workflowMode || '<unnamed>';
        const kind = mode.packetKind;
        const isSurface = kind === 'surface';
        if (isSurface) surfaceCount += 1;

        // 3c — every mode's packet value must be a DIRECT child sub-dir.
        const packet = mode.packet;
        if (!packet || typeof packet !== 'string') {
          fail(`3c: mode "${label}" has no packet value`);
          packetOk = false;
        } else if (path.isAbsolute(packet) || packet.split(/[\\/]/).includes('..')) {
          fail(`3c: mode "${label}" packet "${packet}" must be a direct child directory (no absolute or "../" paths)`);
          packetOk = false;
        } else {
          registeredPackets.add(packet.replace(/[\\/]+$/, ''));
          const packetDir = path.join(target, packet);
          const rel = path.relative(target, packetDir);
          if (rel.startsWith('..') || path.isAbsolute(rel)) {
            fail(`3c: mode "${label}" packet "${packet}" resolves outside the hub directory`);
            packetOk = false;
          } else if (!fs.existsSync(packetDir) || !fs.statSync(packetDir).isDirectory()) {
            fail(`3c: mode "${label}" packet "${packet}" is not an existing sub-directory`);
            packetOk = false;
          }
        }

        // 3d — two-axis discriminator. HARD: workflowMode + backendKind presence
        // (every hub already satisfies these, so CI stays green). MIGRATION-GATED
        // (softFail until every hub carries them and strict becomes the default):
        // packetKind, toolSurface, grandfatheredFolderMismatch, runtimeLoopType —
        // the canon fields each hub adds as it migrates to the two-axis shape.
        if (typeof mode.workflowMode !== 'string' || mode.workflowMode.length === 0) {
          fail(`3d: mode "${label}" is missing workflowMode`);
          discriminatorOk = false;
        }
        // backendKind is presence-checked only — hub families name their own
        // descriptive backends (sk-design's reference-base, playwright-extract);
        // the one constrained case is a surface packet, enforced in 3g.
        if (typeof mode.backendKind !== 'string' || mode.backendKind.length === 0) {
          fail(`3d: mode "${label}" is missing backendKind`);
          discriminatorOk = false;
        }
        if (kind !== 'workflow' && kind !== 'surface') {
          softFail(`3d: mode "${label}" has invalid packetKind ${JSON.stringify(kind)} (expected "workflow" or "surface")`);
          canonOk = false;
        }
        if (typeof mode.grandfatheredFolderMismatch !== 'boolean') {
          softFail(`3d: mode "${label}" is missing the grandfatheredFolderMismatch boolean`);
          canonOk = false;
        }
        // toolSurface shape required on every mode (migration-gated).
        const ts = mode.toolSurface;
        if (!ts || typeof ts !== 'object' || !Array.isArray(ts.allowed) || !Array.isArray(ts.forbidden) ||
            typeof ts.mutatesWorkspace !== 'boolean' || !Array.isArray(ts.bashAllowlist)) {
          softFail(`3d: mode "${label}" has a malformed toolSurface (need {allowed[], forbidden[], mutatesWorkspace:bool, bashAllowlist[]})`);
          canonOk = false;
        }
        // runtimeLoopType demanded ONLY when the runtime-loop extension is declared.
        if (hasRuntimeLoop && mode.packetKind === 'workflow') {
          if (!('runtimeLoopType' in mode)) {
            softFail(`3d: mode "${label}" is missing runtimeLoopType (runtime-loop extension declared; null is allowed, absence is not)`);
            canonOk = false;
          } else if (!VALID_RUNTIME_LOOP_TYPES.includes(mode.runtimeLoopType)) {
            softFail(`3d: mode "${label}" has invalid runtimeLoopType ${JSON.stringify(mode.runtimeLoopType)} (expected one of {research, review, council, context, null})`);
            canonOk = false;
          }
        } else if ('runtimeLoopType' in mode && !VALID_RUNTIME_LOOP_TYPES.includes(mode.runtimeLoopType)) {
          softFail(`3d: mode "${label}" declares runtimeLoopType ${JSON.stringify(mode.runtimeLoopType)} outside the valid set`);
          canonOk = false;
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

        // 3g — surface packets are read-only, evidence-base, advisor-invisible.
        if (isSurface) {
          if (mode.backendKind !== 'evidence-base') {
            softFail(`3g: surface packet "${label}" must be backendKind "evidence-base" (got ${JSON.stringify(mode.backendKind)})`);
            surfaceOk = false;
          }
          if (routing && routing.routingClass !== 'metadata') {
            softFail(`3g: surface packet "${label}" must be routingClass "metadata" (advisor-invisible)`);
            surfaceOk = false;
          }
          if (ts && typeof ts === 'object') {
            if (ts.mutatesWorkspace !== false) {
              softFail(`3g: surface packet "${label}" toolSurface must be read-only (mutatesWorkspace:false)`);
              surfaceOk = false;
            }
            const strayAllowed = (ts.allowed || []).filter((t) => !SURFACE_ALLOWED_TOOLS.includes(t));
            if (strayAllowed.length > 0) {
              softFail(`3g: surface packet "${label}" allows non-read-only tools [${strayAllowed.join(', ')}] (allowed ⊆ {${SURFACE_ALLOWED_TOOLS.join(', ')}})`);
              surfaceOk = false;
            }
            const missingForbidden = SURFACE_FORBIDDEN_TOOLS.filter((t) => !(ts.forbidden || []).includes(t));
            if (missingForbidden.length > 0) {
              softFail(`3g: surface packet "${label}" must forbid [${missingForbidden.join(', ')}]`);
              surfaceOk = false;
            }
          }
        }
      }

      if (packetOk) pass('3c: every mode packet resolves to an existing sub-directory');
      if (discriminatorOk) pass('3d: every mode carries the hard discriminator (workflowMode + backendKind)');
      if (canonOk) pass('3d-canon: every mode carries packetKind + toolSurface + grandfatheredFolderMismatch');
      if (routingOk) pass('3e: every mode has an advisorRouting block with a valid routingClass');
      if (surfaceCount === 0) {
        info('3g: hub declares no surface packets');
      } else if (surfaceOk) {
        pass(`3g: all ${surfaceCount} surface packet(s) are read-only evidence-base and advisor-invisible`);
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 3f. extensions-consistency: a declared extension activates its fields
  // ───────────────────────────────────────────────────────────────
  if (registry) {
    let extOk = true;
    if (hasSurfaceAxis && surfaceCount === 0) {
      fail('3f: surface-axis extension declared but no packetKind "surface" mode exists');
      extOk = false;
    }
    if (!hasSurfaceAxis && surfaceCount > 0) {
      softFail('3f: surface packets present but the surface-axis extension is not declared');
    }
    if (hasRuntimeLoop) {
      const cfg = extensions['runtime-loop'];
      if (!cfg || typeof cfg !== 'object') {
        fail('3f: runtime-loop extension must be an object describing the convergence backend');
        extOk = false;
      }
    }
    if (hasAdvisorProjection) {
      const cfg = extensions['advisor-projection'];
      const guard = cfg && typeof cfg === 'object' ? cfg.driftGuard : null;
      if (!guard || typeof guard !== 'string') {
        fail('3f: advisor-projection extension must declare a driftGuard test path');
        extOk = false;
      }
    }
    if (extOk && Object.keys(extensions).length > 0) {
      pass(`3f: extensions {${Object.keys(extensions).join(', ')}} are internally consistent`);
    } else if (Object.keys(extensions).length === 0) {
      info('3f: hub declares no extensions (pure 2-tier)');
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 4. drift-guard wired when the hub has lexical/alias-fold modes
  // ───────────────────────────────────────────────────────────────
  const projectedModes = [];
  const lexicalIds = {};
  if (registry && Array.isArray(registry.modes)) {
    for (const mode of registry.modes) {
      const routing = mode.advisorRouting;
      if (routing && (routing.routingClass === 'lexical' || routing.routingClass === 'alias-fold')) {
        projectedModes.push(mode.workflowMode);
      }
      if (routing && routing.routingClass === 'lexical' && routing.legacyAdvisorId) {
        lexicalIds[routing.legacyAdvisorId] = mode.workflowMode;
      }
    }
  }

  // The hub's own declared drift-guard path (falls back to the deep-loop
  // reference only for the global-map owner).
  const rawGuard =
    (registry && registry.advisorRoutingContract && registry.advisorRoutingContract.driftGuard) ||
    (hasAdvisorProjection && extensions['advisor-projection'] && extensions['advisor-projection'].driftGuard) ||
    (basename === GLOBAL_MAP_OWNER ? DEEP_LOOP_DRIFT_GUARD : null);
  // The registry driftGuard field may carry a path followed by descriptive prose;
  // the path is the first whitespace-delimited token.
  const declaredGuard = typeof rawGuard === 'string' ? rawGuard.trim().split(/\s+/)[0] : rawGuard;

  if (projectedModes.length === 0) {
    info('4a: hub declares no lexical/alias-fold modes — no advisor drift-guard required');
  } else if (!declaredGuard) {
    fail(`4a: hub has ${projectedModes.length} lexical/alias-fold mode(s) [${projectedModes.join(', ')}] but declares no driftGuard path (advisorRoutingContract.driftGuard or advisor-projection extension)`);
  } else if (fs.existsSync(path.resolve(declaredGuard))) {
    pass(`4a: routing-registry drift-guard present at ${declaredGuard}`);
  } else {
    fail(`4a: declared drift-guard test missing at ${declaredGuard} — registry/maps parity is unguarded`);
  }

  // 4b/4c — optional dynamic cross-check against the live advisor map.
  if (Object.keys(lexicalIds).length === 0) {
    info('4b: registry declares no lexical modes; nothing to cross-check against the advisor');
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
      if (basename === GLOBAL_MAP_OWNER) {
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
          warn(`4c: ${inert.length} lexical mode(s) are INERT — legacyAdvisorId(s) [${inert.join(', ')}] absent from the advisor's map; wire them into the Python/TS maps + a per-skill drift-guard or they will not route`);
        }
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 5. hub-router.json validity (migration-window: WARN)
  // ───────────────────────────────────────────────────────────────
  const routerPath = path.join(target, 'hub-router.json');
  const registryModeSet = new Set(
    (registry && Array.isArray(registry.modes) ? registry.modes : []).map((m) => m.workflowMode).filter(Boolean),
  );
  if (!fs.existsSync(routerPath)) {
    softFail('5a: hub-router.json is missing — vocab-sync silently no-ops without it');
  } else {
    let router = null;
    try {
      router = readJson(routerPath);
      pass('5a: hub-router.json exists and parses as JSON');
    } catch (e) {
      softFail(`5a: hub-router.json is not valid JSON: ${e.message}`);
    }
    if (router) {
      const signals = router.routerSignals && typeof router.routerSignals === 'object' ? router.routerSignals : {};
      const classes = router.vocabularyClasses && typeof router.vocabularyClasses === 'object' ? router.vocabularyClasses : {};
      const signalKeys = new Set(Object.keys(signals));

      // 5b — routerSignals keys ↔ registry workflowModes, bidirectional.
      const missingSignals = [...registryModeSet].filter((m) => !signalKeys.has(m));
      const straySignals = [...signalKeys].filter((m) => !registryModeSet.has(m));
      if (missingSignals.length === 0 && straySignals.length === 0) {
        pass(`5b: routerSignals keys match the registry workflowMode set (${signalKeys.size})`);
      } else {
        softFail(`5b: routerSignals ↔ registry mismatch — missing signals for [${missingSignals.join(', ') || 'none'}], stray signals [${straySignals.join(', ') || 'none'}]`);
      }

      // 5c — every class referenced by a signal exists in vocabularyClasses.
      const referenced = new Set();
      for (const sig of Object.values(signals)) {
        for (const c of (sig && Array.isArray(sig.classes) ? sig.classes : [])) referenced.add(c);
      }
      const missingClasses = [...referenced].filter((c) => !(c in classes));
      if (missingClasses.length === 0) {
        pass(`5c: all ${referenced.size} referenced vocabulary classes are defined`);
      } else {
        softFail(`5c: routerSignals reference undefined vocabulary class(es): [${missingClasses.join(', ')}]`);
      }

      // 5d — resources referenced by signals resolve on disk.
      const missingResources = [];
      for (const sig of Object.values(signals)) {
        for (const r of (sig && Array.isArray(sig.resources) ? sig.resources : [])) {
          if (!fs.existsSync(path.join(target, r))) missingResources.push(r);
        }
      }
      for (const r of (router.routerPolicy && Array.isArray(router.routerPolicy.defaultResource) ? router.routerPolicy.defaultResource : [])) {
        if (!fs.existsSync(path.join(target, r))) missingResources.push(r);
      }
      if (missingResources.length === 0) {
        pass('5d: every router resource path resolves on disk');
      } else {
        softFail(`5d: router resource path(s) missing on disk: [${[...new Set(missingResources)].join(', ')}]`);
      }

      // 5e — tieBreak covers every registered mode.
      const tieBreak = router.routerPolicy && Array.isArray(router.routerPolicy.tieBreak) ? router.routerPolicy.tieBreak : [];
      const tieMissing = [...registryModeSet].filter((m) => !tieBreak.includes(m));
      if (registryModeSet.size > 0 && tieMissing.length === 0 && tieBreak.length >= registryModeSet.size) {
        pass('5e: routerPolicy.tieBreak covers every registered mode');
      } else {
        softFail(`5e: routerPolicy.tieBreak is missing mode(s): [${tieMissing.join(', ') || '(no registry modes)'}]`);
      }

      // 5f — bundleRules (if any) reference real modes; surfaceBundle present when surfaces exist.
      const bundleRules = router.routerPolicy && Array.isArray(router.routerPolicy.bundleRules) ? router.routerPolicy.bundleRules : [];
      const badRefs = [];
      for (const rule of bundleRules) {
        const refs = [].concat(rule.modes || [], rule.primary || [], rule.evidence || []).filter((x) => typeof x === 'string');
        for (const m of refs) if (!registryModeSet.has(m)) badRefs.push(m);
      }
      if (badRefs.length > 0) {
        softFail(`5f: bundleRules reference unknown mode(s): [${[...new Set(badRefs)].join(', ')}]`);
      } else if (surfaceCount > 0) {
        const hasSurfaceBundle = router.routerPolicy && router.routerPolicy.outcomes && router.routerPolicy.outcomes.surfaceBundle;
        if (hasSurfaceBundle) pass('5f: surfaceBundle outcome declared and bundleRules reference real modes');
        else softFail('5f: hub has surface packets but routerPolicy.outcomes.surfaceBundle is not declared');
      } else {
        pass('5f: bundleRules reference real modes');
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 6. registry ↔ directory reverse consistency (migration-window: WARN)
  // ───────────────────────────────────────────────────────────────
  let childDirs = [];
  try {
    childDirs = fs.readdirSync(target, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch { /* ignore */ }
  const unregistered = childDirs.filter((d) => !DIRECTORY_ALLOWLIST.has(d) && !registeredPackets.has(d) && !d.startsWith('.'));
  if (childDirs.length === 0) {
    info('6a: no child directories to reconcile');
  } else if (unregistered.length === 0) {
    pass('6a: every hub child directory is a registered packet or an allowlisted support dir');
  } else {
    softFail(`6a: child director(ies) neither registered as a packet nor allowlisted: [${unregistered.join(', ')}]`);
  }

  // ───────────────────────────────────────────────────────────────
  // 7. changelog shape — real files, no symlinks (migration-window: WARN)
  // ───────────────────────────────────────────────────────────────
  const hubChangelog = path.join(target, 'changelog');
  if (!fs.existsSync(hubChangelog)) {
    softFail('7a: hub has no changelog/ directory');
  } else if (isSymlink(hubChangelog)) {
    softFail('7a: hub changelog/ is a symlink (policy: real directories only)');
  } else {
    const links = symlinkedChangelogs(target);
    if (links.length === 0) {
      pass('7a: all changelog entries are real files (no symlinks)');
    } else {
      const rel = links.map((f) => path.relative(target, f));
      softFail(`7a: symlinked changelog entr(ies) found (policy: real files only): [${rel.join(', ')}]`);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 8. description.json present + well-formed (migration-window: WARN)
  // ───────────────────────────────────────────────────────────────
  const descPath = path.join(target, 'description.json');
  if (!fs.existsSync(descPath)) {
    softFail('8a: description.json is missing (required for all hubs)');
  } else {
    try {
      const desc = readJson(descPath);
      const missing = ['name', 'description', 'version', 'keywords'].filter((k) => !(k in desc));
      if (missing.length === 0 && Array.isArray(desc.keywords)) {
        pass('8a: description.json present with the required fields');
      } else {
        softFail(`8a: description.json missing field(s): [${missing.join(', ')}]`);
      }
    } catch (e) {
      softFail(`8a: description.json is not valid JSON: ${e.message}`);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 9. manual_testing_playbook/ + benchmark baseline (migration-window: WARN)
  // ───────────────────────────────────────────────────────────────
  if (fs.existsSync(path.join(target, 'manual_testing_playbook'))) {
    pass('9a: manual_testing_playbook/ present');
  } else {
    softFail('9a: manual_testing_playbook/ is missing');
  }
  if (fs.existsSync(path.join(target, 'benchmark'))) {
    pass('9b: benchmark/ baseline present');
  } else {
    softFail('9b: benchmark/ baseline is missing');
  }

  // ───────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────
  console.log('');
  console.log('─────────────────────────────────────────────────────────────────');
  if (fails === 0) {
    console.log(`${green('OK')}: parent-skill-check — all hard invariants passed, ${warns} warnings`);
    return 0;
  }
  console.error(`${red('FAIL')}: parent-skill-check — ${fails} invariant failures, ${warns} warnings`);
  return 1;
}

process.exit(main());
