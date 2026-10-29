// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ root-router-contract — two-state root ROUTER.md contract                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * root-router-contract.cjs — pure validator for the root ROUTER.md contract a
 * parent hub, a standalone skill and a mode packet each must satisfy.
 *
 * Every skill root owns one router document, ROUTER.md, that declares one or
 * two routing postures, depending on the target:
 *
 *   active      — the target owns leaf selection. INTENT_SIGNALS and
 *                 RESOURCE_MAP must both be non-empty, their key sets must be
 *                 identical, and every mapped resource path must be a
 *                 root-contained relative path that resolves on disk and
 *                 dual-reads to a typed (workflowMode, leafResourceId) pair
 *                 registered in leaf-manifest.json, unless the path is
 *                 deliberately declared in SHARED_CONTROL_RESOURCES as a
 *                 shared control document and thus exempted from the
 *                 typed-pair check. A path whose packet maps to several modes
 *                 (an N-to-1 fan-out) is registered when the mode that
 *                 actually owns the leaf declares it, not merely when the
 *                 first packet-prefixed mode does. Every RESOURCE_MAP key must
 *                 own at least one resource path.
 *   stage1-only — the hub owns no second stage. INTENT_SIGNALS, RESOURCE_MAP,
 *                 the stage-two DEFAULT_RESOURCE and SHARED_CONTROL_RESOURCES
 *                 must all be declared and empty, and routing delegates to
 *                 hub-router.json plus mode-registry.json. Only a hub may
 *                 declare it; a standalone skill or packet has no mode
 *                 registry to stage against, so both must declare active with
 *                 their own non-empty maps.
 *
 * Both states require the root file itself, a root SKILL.md pointer that is
 * exactly `SKILL.md` and resolves, one four-part numeric version, and the
 * absence of the two legacy router locations. The hub-router.json
 * defaultResource needs no ROUTER.md entry — it is only ever rejected when it
 * literally names a legacy smart-router path. A hub target keeps the wording
 * its findings have always printed; every other target names itself and the
 * skill root instead.
 *
 * Failures use one frozen negative code each (RRC-001..RRC-009); an unexpected
 * internal failure is surfaced by the caller as RRC-UNKNOWN with a nonzero
 * exit, never as a silent pass. RRC-002 covers the whole machine-declaration
 * block, not just the state discriminator: a missing, duplicated, or unreadable
 * version, and a missing or unreadable stage-two collection declaration in a
 * stage1-only router, are the same malformed-declaration family and reuse the
 * existing code so the frozen code set stays untouched.
 *
 * This module parses only the state declaration and the machine-map shape. It
 * never evaluates intent keywords, never scores a prompt, and never imports
 * the deterministic replay or any scorer module — those stay frozen
 * evaluation bytes. Path identity is delegated to leaf-resource-contract.cjs,
 * the single conversion boundary from a packet-qualified or shared-alias
 * resource string to a typed pair; for a non-hub target, the manifest also
 * supplies the mode that owns a bare local leaf path.
 *
 * No filesystem access happens here. Callers own reading the ROUTER.md,
 * mode-registry.json, leaf-aliases.json, leaf-manifest.json and hub-router.json
 * files, and supply a resolveOnDisk probe for the two remaining disk facts
 * (resource-path existence and the SKILL.md pointer resolution).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const leafContract = require('./leaf-resource-contract.cjs');

// The shared frontmatter parser is built, not committed, so a tree that has
// never been provisioned fails to resolve it. Only that exact failure is
// relabeled with the provision command; every other load error keeps its name.
const SHARED_FRONTMATTER_MODULE = '@spec-kit/shared/frontmatter/parse-frontmatter.js';
const PROVISION_COMMAND = 'bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .';

// Load the shared frontmatter parser, naming the provision command when the
// shared package is not built here.
function loadSharedFrontmatterParser() {
  try {
    return require(SHARED_FRONTMATTER_MODULE);
  } catch (err) {
    const isMissingSharedPackage = err && err.code === 'MODULE_NOT_FOUND'
      && typeof err.message === 'string'
      && err.message.includes(`'${SHARED_FRONTMATTER_MODULE}'`);
    if (!isMissingSharedPackage) throw err;
    const failure = new Error(
      `${SHARED_FRONTMATTER_MODULE} is not built here; run ${PROVISION_COMMAND} from the repository root`,
    );
    failure.code = 'SHARED_NOT_BUILT';
    throw failure;
  }
}

// One shared fence parser for every skill: leading-fence position, closing-fence
// and CRLF rules stay identical across readers of the same documents.
const { parseFrontmatter } = loadSharedFrontmatterParser();

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** The two legal router states. */
const VALID_STATES = Object.freeze(['active', 'stage1-only']);

/**
 * The target classes the contract distinguishes. A hub keeps the stage-one
 * posture because it has a registry to delegate to; a standalone skill and a
 * mode packet own their leaves directly, so both must declare active.
 */
const TARGET_CLASS_HUB = 'H';
const TARGET_CLASS_STANDALONE = 'S';
const TARGET_CLASS_PACKET = 'P';

/**
 * The two legacy router locations a hub may still carry before migration.
 * Root ROUTER.md must not coexist with either one (dual-source ambiguity), and
 * no live default resource may literally name either one after migration.
 */
const LEGACY_ROUTER_PATHS = Object.freeze([
  'shared/references/smart-routing.md',
  'references/smart-routing.md',
]);

/**
 * The only prefix a SHARED_CONTROL_RESOURCES declaration may use. A hub-shared
 * control document lives under the hub's shared/ tier; anything else declared
 * there is a shape violation and is never exempted from typed-pair checks.
 */
const SHARED_CONTROL_PREFIX = 'shared/';
// The package-index docs the leaf-manifest generator leaves out of a standalone
// manifest: each one is the navigation page of its own root directory, so a
// standalone skill may route to it while no manifest ever lists it as a leaf.
// The folder name must equal the file stem, because that pairing is what makes
// the page the index of its own directory; the same stem under any other folder
// is an ordinary document that still needs a typed leaf pair.
const PACKAGE_INDEX_DOCS = new Set([
  'feature-catalog/feature-catalog.md',
  'manual-testing-playbook/manual-testing-playbook.md',
]);

function isPackageIndexDoc(raw) {
  return PACKAGE_INDEX_DOCS.has(toPosix(raw));
}

/** The one legal root skill pointer: the hub's own root SKILL.md. */
const ROOT_POINTER = 'SKILL.md';

/**
 * A document version is exactly four numeric dot-separated parts (X.Y.Z.W).
 * Any other arity, or a non-numeric part, is a malformed declaration.
 */
const VERSION_PATTERN = /^\d+(\.\d+){3}$/;

/** Stable negative codes, library-owned so every consumer prints the same set. */
const CODES = Object.freeze({
  MISSING_ROOT_ROUTER: 'RRC-001',
  MALFORMED_STATE: 'RRC-002',
  DUAL_SOURCE: 'RRC-003',
  ACTIVE_MAP_INVALID: 'RRC-004',
  STAGE1_NONEMPTY: 'RRC-005',
  UNRESOLVED_LEAF: 'RRC-006',
  MISSING_SKILL_POINTER: 'RRC-007',
  LEGACY_DEFAULT_RESIDUE: 'RRC-008',
  MISSING_PROSE_SECTION: 'RRC-009',
  UNKNOWN: 'RRC-UNKNOWN',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PARSING (shape only, no scoring)
// ─────────────────────────────────────────────────────────────────────────────

/** The YAML frontmatter block of a markdown document, or '' when absent. */
function extractFrontmatter(text) {
  const parsed = parseFrontmatter(text || '');
  if (parsed.raw === null) return '';
  return parsed.raw.split(/\r?\n/).slice(1, -1).join('\n');
}

/** Every value of one `name:` field in a frontmatter block, in order. */
function frontmatterValues(frontmatter, name) {
  const values = [];
  const re = new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'gm');
  let m;
  while ((m = re.exec(frontmatter)) !== null) values.push(m[1]);
  return values;
}

/**
 * Pull the {...}-balanced body that follows `NAME = {`. The deterministic
 * replay parses the machine block with exactly this shape, so a validator
 * that disagrees here would bless documents the runtime cannot read.
 */
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

/**
 * The inner body of a balanced {...} or [...] block that starts at
 * `openerIndex`, or null when the opener is never closed. A declaration whose
 * opener never closes would make the runtime read the rest of the document as
 * the value, so the validator treats it as unreadable instead.
 */
function balancedBody(source, openerIndex, open, close) {
  let depth = 0;
  for (let j = openerIndex; j < source.length; j += 1) {
    const ch = source[j];
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return source.slice(openerIndex + 1, j);
    }
  }
  return null;
}

/** The keys a dictionary body declares, in encounter order. */
function dictKeys(body) {
  const keys = [];
  if (!body) return keys;
  const re = /["']([A-Z0-9_]+)["']\s*:/g;
  let m;
  while ((m = re.exec(body)) !== null) keys.push(m[1]);
  return keys;
}

function quotedStrings(segment) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'/g;
  let m;
  while ((m = re.exec(segment)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
  return out;
}

/**
 * Every machine-collection header the contract recognizes. A balanced block
 * whose inner body still contains another collection header is structurally
 * impossible for this grammar (values are quoted keys and quoted strings), so
 * its presence means an opener borrowed a later closer and the declaration is
 * really unreadable, not empty.
 */
const DECL_HEADER_RE = /(?:^|\n)\s*(?:DEFAULT_RESOURCES?|INTENT_SIGNALS|RESOURCE_MAP|SHARED_CONTROL_RESOURCES)\s*=/;

/**
 * Classify one machine collection declaration as absent, malformed, empty, or
 * valid. The distinction matters because a declaration the runtime cannot read
 * silently parses as an empty collection — hiding the author's intent — so a
 * validator that collapses it to empty would bless an unreadable document.
 *
 * @param {string} text - The whole ROUTER.md text.
 * @param {string} name - The declaration name (may carry a trailing `?` for
 *   the DEFAULT_RESOURCE/DEFAULT_RESOURCES tolerated spellings).
 * @param {'dict'|'list'} kind - Whether the value is a {...} dictionary or a
 *   [...] list (a single-quoted-string value is a legal list-kind default).
 * @returns {'absent'|'malformed'|'empty'|'valid'}
 */
function classifyDeclaration(text, name, kind) {
  const source = text || '';
  const declaredRe = new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, 'm');
  if (!declaredRe.test(source)) return 'absent';

  let body = null;
  if (kind === 'dict') {
    const start = source.indexOf(`${name} = {`);
    if (start === -1) return 'malformed';
    body = balancedBody(source, source.indexOf('{', start), '{', '}');
  } else {
    const headerRe = new RegExp(`${name}\\s*=\\s*\\[`);
    const header = headerRe.exec(source);
    if (!header) {
      const strRe = new RegExp(`${name}\\s*=\\s*["'][^"']*["']`);
      return strRe.test(source) ? 'valid' : 'malformed';
    }
    body = balancedBody(source, header.index + header[0].length - 1, '[', ']');
  }
  if (body === null) return 'malformed';
  if (DECL_HEADER_RE.test(body)) return 'malformed';
  const hasContent = kind === 'dict'
    ? dictKeys(body).length > 0
    : quotedStrings(body).length > 0;
  return hasContent ? 'valid' : 'empty';
}

/**
 * True when `value` is a hub-relative POSIX path with no absolute, dot, parent,
 * or empty segments. A resource string outside this shape cannot be contained
 * inside the hub directory, so the caller must reject it before any disk probe
 * (an unrestricted join would otherwise resolve `..`/absolute segments outside
 * the hub and hand a foreign file the identity of a leaf).
 */
function isHubContainedPath(value) {
  const posix = toPosix(value);
  if (posix.length === 0) return false;
  if (posix.startsWith('/') || /^[A-Za-z]:/.test(posix)) return false;
  const segments = posix.split('/');
  return segments.every((s) => s.length > 0 && s !== '.' && s !== '..');
}

/**
 * Parse RESOURCE_MAP as intent key -> ordered resource-path list, using the
 * same entry grammar the replay reads. An entry that is not a list is not
 * captured here; the caller still sees its key in dictKeys() of the same body
 * when one exists, so a malformed entry surfaces as a key-set mismatch instead
 * of a silent shape.
 */
function parseResourceMap(text) {
  const map = {};
  const body = extractDictBody(text, 'RESOURCE_MAP');
  if (!body) return map;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) map[m[1]] = quotedStrings(m[2]);
  return map;
}

/**
 * Detailed RESOURCE_MAP parse that also reports every declared key whose entry
 * is missing, not a list, or an empty list, so the validator can demand that
 * every active key actually owns routed leaf paths.
 *
 * @returns {{map: Object, declaredKeys: string[], emptyKeys: string[], malformedKeys: string[]}}
 */
function parseResourceMapDetailed(text) {
  const body = extractDictBody(text, 'RESOURCE_MAP');
  const map = {};
  const emptyKeys = [];
  const malformedKeys = [];
  if (!body) return { map, declaredKeys: [], emptyKeys, malformedKeys };
  const keyRe = /["']([A-Z0-9_]+)["']\s*:/g;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\[([^\]]*)\]/g;
  const entries = new Map();
  let m;
  while ((m = entryRe.exec(body)) !== null) entries.set(m[1], quotedStrings(m[2]));
  const declaredKeys = [];
  const seen = new Set();
  let k;
  while ((k = keyRe.exec(body)) !== null) {
    const key = k[1];
    if (seen.has(key)) continue;
    seen.add(key);
    declaredKeys.push(key);
    if (!entries.has(key)) malformedKeys.push(key);
    else if (entries.get(key).length === 0) emptyKeys.push(key);
    else map[key] = entries.get(key);
  }
  return { map, declaredKeys, emptyKeys, malformedKeys };
}

/**
 * Parse the stage-two DEFAULT_RESOURCE: a list form, a single-string form, or
 * absent (empty). Mirrors the replay's parse so the two never disagree on what
 * a router declares as its always-loaded preamble.
 */
function parseDefaultResources(text) {
  const listM = /DEFAULT_RESOURCES?\s*=\s*\[([\s\S]*?)\]/.exec(text || '');
  if (listM) return [...listM[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
  const strM = /DEFAULT_RESOURCES?\s*=\s*["']([^"']+)["']/.exec(text || '');
  return strM ? [strM[1]] : [];
}

/**
 * Parse SHARED_CONTROL_RESOURCES as the ordered list of hub-shared control
 * paths the router deliberately exempts from typed-pair enforcement. Uses the
 * same list grammar as parseDefaultResources; absent means empty.
 */
function parseSharedControlResources(text) {
  const m = /SHARED_CONTROL_RESOURCES\s*=\s*\[([\s\S]*?)\]/.exec(text || '');
  return m ? [...m[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]) : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

/**
 * The union of every typed pair a committed leaf-manifest.json declares, as
 * composite keys, so "present in the manifest" is one exact set membership
 * test per resource.
 */
function manifestPairKeys(manifest) {
  const keys = new Set();
  if (manifest && Array.isArray(manifest.modes)) {
    for (const mode of manifest.modes) {
      for (const leaf of (Array.isArray(mode.leaves) ? mode.leaves : [])) {
        if (typeof mode.workflowMode === 'string' && typeof leaf === 'string') {
          keys.add(leafContract.compositeKey({ workflowMode: mode.workflowMode, leafResourceId: leaf }));
        }
      }
    }
  }
  return keys;
}

/**
 * leafResourceId -> the set of workflowModes whose manifest entry declares
 * that leaf. A packet-qualified ROUTER path names a packet, not a mode, so
 * when several modes fan out from one packet the manifest's per-mode leaf
 * ownership is the authority on which mode actually routes the leaf.
 */
function manifestLeafOwners(manifest) {
  const owners = new Map();
  if (manifest && Array.isArray(manifest.modes)) {
    for (const mode of manifest.modes) {
      if (!mode || typeof mode.workflowMode !== 'string') continue;
      for (const leaf of (Array.isArray(mode.leaves) ? mode.leaves : [])) {
        if (typeof leaf !== 'string') continue;
        let set = owners.get(leaf);
        if (!set) {
          set = new Set();
          owners.set(leaf, set);
        }
        set.add(mode.workflowMode);
      }
    }
  }
  return owners;
}

/**
 * Whether a leaf resolved through a packet prefix is registered under its own
 * mode when that packet maps to several modes. The prefix names the
 * first-declared mode, which is not necessarily the mode whose manifest entry
 * scopes the leaf; a same-packet owner is the registration that matters.
 * Returns false when the resolved mode, its packet, or every candidate owner
 * is unknown, so an unregistered leaf still fails the check.
 *
 * @param {Object} args - Resolution inputs.
 * @param {{workflowMode:string, leafResourceId:string}} args.pair - Pair the prefix resolved to.
 * @param {Array<{workflowMode:string, packet:string}>} args.declaredModes - mode-registry.json modes.
 * @param {Map<string, Set<string>>} args.leafOwners - manifestLeafOwners() index.
 * @returns {boolean} True when a mode of the same packet declares the leaf.
 */
function manifestOwnsLeafForPacket({ pair, declaredModes = [], leafOwners }) {
  const declared = (declaredModes || []).find((mode) => mode && mode.workflowMode === pair.workflowMode);
  if (!declared || !declared.packet) return false;
  const owners = leafOwners.get(pair.leafResourceId);
  if (!owners) return false;
  for (const owner of owners) {
    const ownerMode = (declaredModes || []).find((mode) => mode && mode.workflowMode === owner);
    if (ownerMode && ownerMode.packet === declared.packet) return true;
  }
  return false;
}

/**
 * Report every default-resource entry — hub-router defaultResource plus the
 * router's own stage-two DEFAULT_RESOURCE — that literally names a legacy
 * smart-router path. Zero-signal fallback semantics are otherwise untouched:
 * nothing here requires or forbids a default pointing at ROUTER.md.
 */
function pushLegacyDefaultResidue(violations, hubDefaultResource, stageTwoDefault) {
  const offending = [
    ...(hubDefaultResource || [])
      .filter((p) => LEGACY_ROUTER_PATHS.includes(toPosix(p)))
      .map((p) => `hub-router defaultResource ${JSON.stringify(p)}`),
    ...stageTwoDefault
      .filter((p) => LEGACY_ROUTER_PATHS.includes(toPosix(p)))
      .map((p) => `stage-two DEFAULT_RESOURCE ${JSON.stringify(p)}`),
  ];
  if (offending.length > 0) {
    violations.push({
      code: CODES.LEGACY_DEFAULT_RESIDUE,
      message: `a live default resource literally names a legacy smart-router path: ${offending.join(', ')}`,
    });
  }
}

/**
 * Validate one root ROUTER.md against the two-state contract.
 *
 * @param {Object} args - Validation inputs; the caller owns all filesystem reads.
 * @param {string|null} [args.routerText] - ROUTER.md file contents, or null when the file is missing.
 * @param {string} [args.targetClass] - 'H' for a hub, 'S' for a standalone skill, 'P' for a mode packet.
 * @param {string|null} [args.targetName] - Label every non-hub finding names, usually the skill or packet path.
 * @param {Array<{workflowMode:string, packet:string}>} [args.declaredModes] - mode-registry.json modes.
 * @param {Array<{workflowMode:string, leafResourceId:string, diskPath:string}>} [args.aliasEntries] - leaf-aliases.json entries.
 * @param {Object|null} [args.manifest] - leaf-manifest.json object, or null when absent.
 * @param {Array<string>} [args.hubRouterDefaultResource] - hub-router.json routerPolicy.defaultResource.
 * @param {Array<string>} [args.legacyFiles] - relative legacy router paths present on disk.
 * @param {Function} [args.resolveOnDisk] - (relativePath) => boolean probe for disk existence.
 * @returns {{ok:boolean, state:(string|null), violations:Array<{code:string, message:string}>}}
 *   `ok` is false exactly when violations is non-empty; `state` is the parsed
 *   router_state when it was well-formed, else null.
 */
function validateRootRouter({
  routerText = null,
  targetClass = TARGET_CLASS_HUB,
  targetName = null,
  declaredModes = [],
  aliasEntries = [],
  manifest = null,
  hubRouterDefaultResource = null,
  legacyFiles = [],
  resolveOnDisk = null,
} = {}) {
  const resolve = typeof resolveOnDisk === 'function' ? resolveOnDisk : () => true;
  const violations = [];
  const stateInfo = { state: null };
  const isHub = targetClass === TARGET_CLASS_HUB;
  const targetNoun = targetClass === TARGET_CLASS_PACKET ? 'mode packet' : 'standalone skill';
  const targetStates = isHub ? VALID_STATES : ['active'];
  const targetLabel = typeof targetName === 'string' && targetName.length > 0 ? `${targetName}: ` : '';

  // A hub keeps the wording its findings have always printed. A standalone
  // skill or a packet is not a hub, so every finding names that target and
  // speaks of the skill root instead.
  const applyTargetWording = () => {
    if (isHub) return;
    for (const violation of violations) {
      violation.message = `${targetLabel}${violation.message
        .replace(/\bhub root\b/g, 'skill root')
        .replace(/\bhub-contained\b/g, 'skill-contained')}`;
    }
  };

  if (routerText == null) {
    // Nothing to parse without the file; the default-residue fact is still
    // reportable because it lives in hub-router.json, not in the router, but
    // the missing file is always the primary finding.
    violations.push({
      code: CODES.MISSING_ROOT_ROUTER,
      message: isHub
        ? 'no root ROUTER.md at the hub root'
        : 'no sibling ROUTER.md at the skill root',
    });
    pushLegacyDefaultResidue(violations, hubRouterDefaultResource, []);
    applyTargetWording();
    return { ok: false, state: null, violations };
  }

  // Dual-source ambiguity stops before any other reading: a target carrying a
  // legacy router alongside its root router has two answers to "which router
  // owns stage two", so no migration decision may proceed from it.
  if (legacyFiles.length > 0) {
    violations.push({
      code: CODES.DUAL_SOURCE,
      message: `root ROUTER.md coexists with legacy router file(s): ${legacyFiles.join(', ')}`,
    });
  }

  // State: the discriminator that decides which set of map rules applies.
  // A non-hub target may only be active: stage one belongs to the hub, and a
  // skill or packet that declared stage1-only would carry no routing decision.
  const frontmatter = extractFrontmatter(routerText);
  const stateValues = frontmatterValues(frontmatter, 'router_state');
  if (stateValues.length === 0) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `router_state is absent from the ROUTER.md frontmatter (must be ${targetStates.join(' or ')})`,
    });
  } else if (stateValues.length > 1) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `router_state is declared more than once: ${stateValues.join(', ')}`,
    });
  } else if (!isHub && stateValues[0] === 'stage1-only') {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `router_state "stage1-only" is reserved for a hub; a ${targetNoun} ROUTER.md must declare active with its own non-empty maps`,
    });
  } else if (!VALID_STATES.includes(stateValues[0])) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `router_state ${JSON.stringify(stateValues[0])} is not one of ${targetStates.join(', ')}`,
    });
  } else {
    stateInfo.state = stateValues[0];
  }

  // Version: exactly one four-part numeric declaration, in both states. The
  // version is part of the same machine-declaration block as router_state, so
  // a missing, duplicated, or malformed version reuses the malformed-state
  // code instead of widening the frozen code set.
  const versionValues = frontmatterValues(frontmatter, 'version');
  if (versionValues.length === 0) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: 'version is absent from the ROUTER.md frontmatter (must be a four-part numeric version like 1.0.0.0)',
    });
  } else if (versionValues.length > 1) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `version is declared more than once: ${versionValues.join(', ')}`,
    });
  } else if (!VERSION_PATTERN.test(versionValues[0])) {
    violations.push({
      code: CODES.MALFORMED_STATE,
      message: `version ${JSON.stringify(versionValues[0])} is not a four-part numeric version (expected X.Y.Z.W with numeric parts)`,
    });
  }

  // SKILL.md pointer: the root pointer is a resolvable entry point in both
  // states. The value must be exactly the root SKILL.md name — a pointer to
  // any other path would name a foreign or nested document as the skill entry
  // point, and an unrestricted disk probe would resolve `..`/absolute segments
  // outside the skill root. A missing pointer, a non-root pointer, or a
  // pointer that does not resolve on disk is the same failure because an
  // unreadable skill entry point cannot back the router.
  const pointerValues = frontmatterValues(frontmatter, 'skill_pointer');
  if (pointerValues.length === 0) {
    violations.push({
      code: CODES.MISSING_SKILL_POINTER,
      message: `skill_pointer is absent from the ROUTER.md frontmatter (must be exactly ${JSON.stringify(ROOT_POINTER)})`,
    });
  } else if (pointerValues.length > 1) {
    violations.push({
      code: CODES.MISSING_SKILL_POINTER,
      message: `skill_pointer is declared more than once: ${pointerValues.join(', ')}`,
    });
  } else if (toPosix(pointerValues[0]) !== ROOT_POINTER) {
    violations.push({
      code: CODES.MISSING_SKILL_POINTER,
      message: `skill_pointer must be exactly ${JSON.stringify(ROOT_POINTER)} at the hub root (got ${JSON.stringify(pointerValues[0])})`,
    });
  } else if (!resolve(pointerValues[0])) {
    violations.push({
      code: CODES.MISSING_SKILL_POINTER,
      message: `skill_pointer ${JSON.stringify(pointerValues[0])} does not resolve on disk`,
    });
  }

  if (stateInfo.state === 'active') {
    const intentStatus = classifyDeclaration(routerText, 'INTENT_SIGNALS', 'dict');
    const resourceStatus = classifyDeclaration(routerText, 'RESOURCE_MAP', 'dict');
    const defaultStatus = classifyDeclaration(routerText, 'DEFAULT_RESOURCES?', 'list');

    if (intentStatus === 'absent' || intentStatus === 'empty') {
      violations.push({
        code: CODES.ACTIVE_MAP_INVALID,
        message: 'active INTENT_SIGNALS must be a non-empty dictionary',
      });
    } else if (intentStatus === 'malformed') {
      violations.push({
        code: CODES.MALFORMED_STATE,
        message: 'active INTENT_SIGNALS declaration is unreadable (must be a balanced INTENT_SIGNALS = {...} block)',
      });
    }
    if (resourceStatus === 'absent' || resourceStatus === 'empty') {
      violations.push({
        code: CODES.ACTIVE_MAP_INVALID,
        message: 'active RESOURCE_MAP must be a non-empty dictionary',
      });
    } else if (resourceStatus === 'malformed') {
      violations.push({
        code: CODES.MALFORMED_STATE,
        message: 'active RESOURCE_MAP declaration is unreadable (must be a balanced RESOURCE_MAP = {...} block)',
      });
    }
    if (defaultStatus === 'malformed') {
      violations.push({
        code: CODES.MALFORMED_STATE,
        message: 'active DEFAULT_RESOURCE declaration is unreadable (must be a balanced DEFAULT_RESOURCE = [...] list or a single quoted path)',
      });
    }

    const intentBody = extractDictBody(routerText, 'INTENT_SIGNALS');
    const resourceBody = extractDictBody(routerText, 'RESOURCE_MAP');
    const intentKeys = dictKeys(intentBody);
    const resourceKeys = dictKeys(resourceBody);

    const intentSet = new Set(intentKeys);
    const resourceSet = new Set(resourceKeys);
    const signalsOnly = [...intentSet].filter((k) => !resourceSet.has(k));
    const mapOnly = [...resourceSet].filter((k) => !intentSet.has(k));
    if (signalsOnly.length > 0 || mapOnly.length > 0) {
      violations.push({
        code: CODES.ACTIVE_MAP_INVALID,
        message: `active INTENT_SIGNALS and RESOURCE_MAP keys do not match (signals-only: [${signalsOnly.join(', ') || 'none'}], map-only: [${mapOnly.join(', ') || 'none'}])`,
      });
    }

    // An active router routes leaves; a key that owns no resource path would
    // select nothing at stage two. A declared key whose entry is missing or
    // not a list, and a key whose list is empty, both fail closed here.
    const resourceDetail = parseResourceMapDetailed(routerText);
    for (const key of resourceDetail.malformedKeys) {
      violations.push({
        code: CODES.ACTIVE_MAP_INVALID,
        message: `active RESOURCE_MAP entry ${JSON.stringify(key)} must map to a list of resource paths`,
      });
    }
    for (const key of resourceDetail.emptyKeys) {
      violations.push({
        code: CODES.ACTIVE_MAP_INVALID,
        message: `active RESOURCE_MAP key ${JSON.stringify(key)} must own at least one resource path`,
      });
    }
    const resourceMap = resourceDetail.map;

    // Hub-shared control documents are the one deliberate carve-out: a path
    // declared in SHARED_CONTROL_RESOURCES may load from the shared tier
    // without a typed manifest pair, but only when it is a hub-contained
    // `shared/...` path, is actually referenced by some RESOURCE_MAP entry,
    // and resolves on disk. Every other `shared/`-prefixed path stays under
    // the full typed-pair enforcement below — an undeclared shared path is
    // never silently exempt.
    const sharedControls = parseSharedControlResources(routerText);
    const mappedValues = new Set();
    for (const key of resourceKeys) {
      for (const raw of resourceMap[key] || []) mappedValues.add(raw);
    }
    const sharedExemptions = new Set();
    for (const raw of sharedControls) {
      const posix = toPosix(raw);
      if (!isHubContainedPath(posix) || !posix.startsWith(SHARED_CONTROL_PREFIX)) {
        violations.push({
          code: CODES.ACTIVE_MAP_INVALID,
          message: `declared shared control resource ${JSON.stringify(raw)} must be a hub-contained ${JSON.stringify(SHARED_CONTROL_PREFIX)}... path (no absolute, dot, or parent segments)`,
        });
        continue;
      }
      if (!mappedValues.has(raw)) {
        violations.push({
          code: CODES.ACTIVE_MAP_INVALID,
          message: `declared shared control resource ${JSON.stringify(raw)} is not referenced by any RESOURCE_MAP entry`,
        });
        continue;
      }
      sharedExemptions.add(raw);
    }

    // Every mapped resource must be a real packet leaf: it is hub-contained,
    // resolves on disk, dual-reads to one typed pair through the
    // leaf-resource contract, and that pair is registered in the committed
    // manifest. Containment is checked before the disk probe so a `..` or
    // absolute path is rejected without ever being resolved against the hub
    // directory. The manifest's typed membership is what keeps a control
    // document from ever being treated as a routable leaf — a declared
    // hub-shared control resource is the one path deliberately outside that
    // rule. For a packet shared by several modes, the prefix names only the
    // first-declared mode; registration follows the manifest's owner, so a
    // lane-scoped leaf in a fan-out packet is still registered.
    const manifestKeys = manifestPairKeys(manifest);
    const leafOwners = manifestLeafOwners(manifest);
    for (const key of resourceKeys) {
      for (const raw of resourceMap[key] || []) {
        if (!isHubContainedPath(raw)) {
          violations.push({
            code: CODES.UNRESOLVED_LEAF,
            message: `resource path ${JSON.stringify(raw)} (intent ${key}) must be a hub-contained relative path (no absolute, dot, or parent segments)`,
          });
          continue;
        }
        if (!resolve(raw)) {
          violations.push({
            code: CODES.UNRESOLVED_LEAF,
            message: `resource path ${JSON.stringify(raw)} (intent ${key}) does not resolve on disk`,
          });
          continue;
        }
        if (sharedExemptions.has(raw)) continue;
        // A standalone skill may route to its own package index. The generator
        // excludes that page from the manifest by design, so demanding a typed
        // pair for it would fail every fresh skill whose router starts there. A
        // hub has no such page and a packet owns no root directory of its own,
        // so neither class is ever exempt.
        if (targetClass === TARGET_CLASS_STANDALONE && isPackageIndexDoc(raw)) continue;
        const dual = leafContract.dualReadLegacyResource({ raw, declaredModes, aliasEntries });
        // A non-hub target names its leaves from its own root, so a local path
        // arrives without a packet prefix. Its manifest is the identity source:
        // a path the manifest already registers under a mode is that mode's
        // leaf, exactly as an authored alias would say.
        const owners = isHub ? null : leafOwners.get(toPosix(raw));
        const manifestOwner = owners && owners.size > 0 ? owners.values().next().value : null;
        const pair = dual.ok
          ? dual.pair
          : (manifestOwner ? { workflowMode: manifestOwner, leafResourceId: toPosix(raw) } : null);
        if (!pair) {
          violations.push({
            code: CODES.UNRESOLVED_LEAF,
            message: `resource path ${JSON.stringify(raw)} (intent ${key}) resolves to no declared mode, authored alias or manifest leaf pair`,
          });
          continue;
        }
        const pairKey = leafContract.compositeKey(pair);
        if (!manifestKeys.has(pairKey)
            && !manifestOwnsLeafForPacket({ pair, declaredModes, leafOwners })) {
          violations.push({
            code: CODES.UNRESOLVED_LEAF,
            message: `resource path ${JSON.stringify(raw)} (intent ${key}) maps to typed pair ${pairKey} that is not present in leaf-manifest.json`,
          });
        }
      }
    }
  } else if (stateInfo.state === 'stage1-only') {
    // A leafless router that declares stage-two content would silently start
    // second-stage routing the author never authored; every collection must
    // stay empty so stage one is the whole story. The declaration block must
    // also be readable first: a missing or malformed declaration would be
    // silently read as empty by the runtime too, hiding the author's intent,
    // so it fails closed instead of collapsing to empty.
    const intentStatus = classifyDeclaration(routerText, 'INTENT_SIGNALS', 'dict');
    const resourceStatus = classifyDeclaration(routerText, 'RESOURCE_MAP', 'dict');
    const defaultStatus = classifyDeclaration(routerText, 'DEFAULT_RESOURCES?', 'list');
    const sharedStatus = classifyDeclaration(routerText, 'SHARED_CONTROL_RESOURCES', 'list');
    const unreadable = [];
    if (intentStatus === 'absent') unreadable.push('INTENT_SIGNALS is not declared');
    if (intentStatus === 'malformed') unreadable.push('INTENT_SIGNALS is declared but unreadable (must be a balanced INTENT_SIGNALS = {...} block)');
    if (resourceStatus === 'absent') unreadable.push('RESOURCE_MAP is not declared');
    if (resourceStatus === 'malformed') unreadable.push('RESOURCE_MAP is declared but unreadable (must be a balanced RESOURCE_MAP = {...} block)');
    if (defaultStatus === 'absent') unreadable.push('DEFAULT_RESOURCE is not declared');
    if (defaultStatus === 'malformed') unreadable.push('DEFAULT_RESOURCE is declared but unreadable (must be a balanced DEFAULT_RESOURCE = [...] list or a single quoted path)');
    if (sharedStatus === 'absent') unreadable.push('SHARED_CONTROL_RESOURCES is not declared');
    if (sharedStatus === 'malformed') unreadable.push('SHARED_CONTROL_RESOURCES is declared but unreadable (must be a balanced SHARED_CONTROL_RESOURCES = [...] list)');
    if (unreadable.length > 0) {
      violations.push({
        code: CODES.MALFORMED_STATE,
        message: `stage1-only ROUTER.md must keep stage-two collections declared and empty: ${unreadable.join('; ')}`,
      });
    }

    const intentKeys = dictKeys(extractDictBody(routerText, 'INTENT_SIGNALS'));
    const resourceMap = parseResourceMap(routerText);
    const defaultResources = parseDefaultResources(routerText);
    const sharedControls = parseSharedControlResources(routerText);
    const offending = [];
    if (intentKeys.length > 0) offending.push(`INTENT_SIGNALS (${intentKeys.length} key(s))`);
    if (Object.keys(resourceMap).length > 0) offending.push(`RESOURCE_MAP (${Object.keys(resourceMap).length} key(s))`);
    if (defaultResources.length > 0) offending.push(`DEFAULT_RESOURCE (${defaultResources.length} entry/entries)`);
    if (sharedControls.length > 0) offending.push(`SHARED_CONTROL_RESOURCES (${sharedControls.length} entry/entries)`);
    if (offending.length > 0) {
      violations.push({
        code: CODES.STAGE1_NONEMPTY,
        message: `stage1-only ROUTER.md must keep stage-two collections empty but declares: ${offending.join(', ')}`,
      });
    }
  }

  pushLegacyDefaultResidue(violations, hubRouterDefaultResource, parseDefaultResources(routerText));

  // The orienting prose sections are not machine-parsed, so none of the checks
  // above notices when an active router degrades into a bare machine block a human
  // can no longer read. An active router owns an OVERVIEW that frames it and an
  // INTENT MODEL describing the leaves it selects; a stage1-only stub that owns no
  // leaves is exempt. A heading may carry a section number and/or a leading glyph
  // before the label, so match the label as a word anywhere on the heading line.
  if (stateInfo.state === 'active') {
    const hasHeading = (label) =>
      new RegExp(`^##[^\\n]*\\b${label.replace(/ /g, '\\s+')}\\b`, 'im').test(routerText);
    if (!hasHeading('OVERVIEW')) {
      violations.push({
        code: CODES.MISSING_PROSE_SECTION,
        message: 'an active root ROUTER.md is missing its "## OVERVIEW" section',
      });
    }
    if (!hasHeading('INTENT MODEL')) {
      violations.push({
        code: CODES.MISSING_PROSE_SECTION,
        message: 'an active root ROUTER.md is missing its "## INTENT MODEL" section',
      });
    }
  }

  applyTargetWording();

  return { ok: violations.length === 0, state: stateInfo.state, violations };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  VALID_STATES,
  TARGET_CLASS_HUB,
  TARGET_CLASS_STANDALONE,
  TARGET_CLASS_PACKET,
  LEGACY_ROUTER_PATHS,
  SHARED_CONTROL_PREFIX,
  ROOT_POINTER,
  VERSION_PATTERN,
  CODES,
  extractFrontmatter,
  frontmatterValues,
  extractDictBody,
  dictKeys,
  balancedBody,
  classifyDeclaration,
  isHubContainedPath,
  parseResourceMap,
  parseResourceMapDetailed,
  parseDefaultResources,
  parseSharedControlResources,
  validateRootRouter,
};
