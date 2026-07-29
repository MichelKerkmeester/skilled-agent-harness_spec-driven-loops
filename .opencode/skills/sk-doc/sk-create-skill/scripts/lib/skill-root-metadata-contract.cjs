// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-root-metadata-contract — pure skill-root metadata class contract   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * skill-root-metadata-contract.cjs — pure library owning which root-level
 * metadata JSON files a skill root must, may, and must not carry.
 *
 * Before this library the answer lived nowhere. Every gate that touched these
 * files was conditional on the file already existing: the parent-hub checker
 * runs against one target directory and scopes its identity rules to hubs, its
 * leaf-manifest block is opt-in for hubs that already committed a manifest, and
 * the fleet freshness scanner discovers work by walking committed manifests. A
 * scanner that starts from outputs cannot report a missing output, so partial
 * adoption stayed invisible and every root drifted into its own shape.
 *
 * The fix is to classify first and check second. Two classes cover the fleet,
 * and the discriminator is a declaration the author writes, never a generated
 * artifact:
 *
 *   H — packet hub. Routes prompts across several mode packets, so it declares
 *       a mode registry AND a hub router, and it projects one advisor identity
 *       through description.json.
 *   S — standalone routed-resource skill. One workflow mode, no registry, so it
 *       declares that single mode in a leaf-manifest config instead. Its
 *       identity reaches the advisor through graph metadata alone; nothing in
 *       production reads a skill-root description.json, so requiring one here
 *       would only add prose no consumer consults.
 *
 * The registry/router pair is the discriminator because the two are consumed as
 * one coupled declaration: signal keys in the router must name registry modes.
 * Carrying exactly one of them is therefore not a third class, it is a half
 * declaration — the shape is rejected rather than guessed at.
 *
 * No filesystem access happens here. Callers own discovering roots and reading
 * files; this module only decides what a presence map means.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Every root-level metadata filename this contract governs. */
const METADATA_FILES = Object.freeze([
  'description.json',
  'graph-metadata.json',
  'leaf-manifest.json',
  'leaf-aliases.json',
  'leaf-manifest.config.json',
  'mode-registry.json',
  'hub-router.json',
  'command-metadata.json',
]);

/** The marker that makes a directory a skill root at all. */
const SKILL_MARKER = 'SKILL.md';

const CLASS_HUB = 'H';
const CLASS_STANDALONE = 'S';

/**
 * The coupled declaration that discriminates the classes. Both present means
 * H, neither means S, exactly one means the author left a declaration half
 * written and the root cannot be classified.
 */
const DISCRIMINATOR_FILES = Object.freeze(['mode-registry.json', 'hub-router.json']);

/**
 * Required sets. `leaf-manifest.json` appears in both because it is generated
 * output either way — only its input differs (registry for H, config for S).
 */
const REQUIRED_BY_CLASS = Object.freeze({
  [CLASS_HUB]: Object.freeze([
    'graph-metadata.json',
    'description.json',
    'mode-registry.json',
    'hub-router.json',
    'leaf-manifest.json',
  ]),
  [CLASS_STANDALONE]: Object.freeze([
    'graph-metadata.json',
    'leaf-manifest.config.json',
    'leaf-manifest.json',
    'leaf-aliases.json',
  ]),
});

/**
 * Forbidden sets. These are not stylistic: each forbidden file would introduce
 * a second source of truth for something the class already declares elsewhere.
 * A hub carrying a standalone manifest config would give the generator two
 * competing inputs; a standalone carrying registry/router/description would
 * claim a hub identity its packet layout cannot back.
 */
const FORBIDDEN_BY_CLASS = Object.freeze({
  [CLASS_HUB]: Object.freeze(['leaf-manifest.config.json']),
  [CLASS_STANDALONE]: Object.freeze([
    'description.json',
    'mode-registry.json',
    'hub-router.json',
    // Command metadata binds each command to an ownerMode in the registry a
    // standalone root does not have, so the file cannot be coherent on S.
    'command-metadata.json',
  ]),
});

/**
 * Files that are legal only for a named set of roots. An overlay is neither
 * required nor forbidden fleet-wide: it is an extension whose consumers do not
 * discover roots generically, so widening it silently would produce files
 * nothing reads. Adding a root here is a deliberate act that must come with a
 * consumer able to find it.
 *
 * Currently empty. The mechanism stays for the next extension that ships before
 * its consumer can enumerate roots. `command-metadata.json` is not here: it is a
 * class-H optional (see the optional set), legal on every hub and forbidden on
 * every standalone, so it is uniform class policy rather than a per-root overlay.
 */
const OVERLAY_FILES = Object.freeze({});

/**
 * What a tool may write unattended, per class. Everything else carries authored
 * semantic identity, routing policy, or a mapping no generator can infer, so
 * regenerating it would mean inventing meaning.
 *
 * `leaf-aliases.json` splits on class, and the split is not a convention — it
 * is what the two shapes actually are. A hub's aliases carry real compatibility
 * triples that relocate a mode's resource onto a disk path outside that mode's
 * own packet; nothing in the corpus implies them, so they must be authored. A
 * standalone root has one mode, so the same triple degenerates to an identity
 * projection over its own leaves, which is a pure function of the manifest and
 * therefore safe to derive. Deriving it is strictly better than authoring it:
 * a hand-maintained identity list silently rots the moment a leaf is added.
 */
const GENERATED_BY_CLASS = Object.freeze({
  [CLASS_HUB]: Object.freeze(['leaf-manifest.json']),
  [CLASS_STANDALONE]: Object.freeze(['leaf-manifest.json', 'leaf-aliases.json']),
});

/** Union of the per-class generated sets, for class-agnostic callers. */
const GENERATED_FILES = Object.freeze(
  [...new Set(Object.values(GENERATED_BY_CLASS).flat())].sort(),
);

/**
 * A hub may legitimately have no relocated resources to declare (leaf-aliases),
 * and it may legitimately own no slash commands (command-metadata). A command
 * surface exists only for hubs that actually ship commands, so requiring the
 * file fleet-wide forced command-less hubs to carry an empty-array placeholder
 * nothing reads; it is optional instead — validated against the core schema when
 * present, and simply absent when the hub owns no commands. It stays forbidden
 * on standalone roots, which have no registry mode to bind a command to.
 */
const OPTIONAL_BY_CLASS = Object.freeze({
  [CLASS_HUB]: Object.freeze(['leaf-aliases.json', 'command-metadata.json']),
  [CLASS_STANDALONE]: Object.freeze([]),
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ERRORS
// ─────────────────────────────────────────────────────────────────────────────

class ContractError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ContractError';
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize an arbitrary caller-supplied presence input into a dense boolean
 * map over METADATA_FILES. Accepts either a `{filename: boolean}` object or an
 * iterable of present filenames, so a caller holding a directory listing does
 * not have to reshape it first.
 */
function normalizePresence(presence) {
  const map = Object.create(null);
  for (const name of METADATA_FILES) map[name] = false;
  if (!presence) return map;
  if (typeof presence[Symbol.iterator] === 'function' && typeof presence !== 'string') {
    for (const name of presence) {
      if (name in map) map[name] = true;
    }
    return map;
  }
  for (const name of METADATA_FILES) {
    map[name] = Boolean(presence[name]);
  }
  return map;
}

/**
 * Decide a root's class from its discriminator files alone.
 *
 * Deliberately blind to every other file: classification must not depend on
 * generated output, or a root whose manifest was never written would classify
 * differently from the same root after a regeneration, and the gate could
 * never report the manifest as missing.
 *
 * @returns {{ skillClass: string|null, reason: string }}
 */
function classifyPresence(presence) {
  const map = normalizePresence(presence);
  const declared = DISCRIMINATOR_FILES.filter((name) => map[name]);
  if (declared.length === DISCRIMINATOR_FILES.length) {
    return { skillClass: CLASS_HUB, reason: 'declares the complete mode-registry + hub-router pair' };
  }
  if (declared.length === 0) {
    return { skillClass: CLASS_STANDALONE, reason: 'declares neither mode-registry nor hub-router' };
  }
  const missing = DISCRIMINATOR_FILES.filter((name) => !map[name]);
  return {
    skillClass: null,
    reason: `partial hub declaration: has ${declared.join(', ')} but not ${missing.join(', ')}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one skill root against its class contract.
 *
 * @param {string} skillId  - the root's directory name, used for overlay scoping.
 * @param {object|Iterable} presence - which metadata files exist at the root.
 * @returns {{ skillId, skillClass, reason, violations, required, forbidden }}
 *   `violations` is empty exactly when the root conforms.
 */
function evaluateRoot(skillId, presence) {
  if (typeof skillId !== 'string' || skillId.length === 0) {
    throw new ContractError('MISSING_SKILL_ID', 'evaluateRoot requires a non-empty skillId');
  }
  const map = normalizePresence(presence);
  const { skillClass, reason } = classifyPresence(map);
  const violations = [];

  if (skillClass === null) {
    violations.push({
      code: 'UNCLASSIFIABLE_ROOT',
      file: null,
      message: `${skillId}: ${reason}. A root declares both mode-registry.json and hub-router.json (hub) or neither (standalone).`,
    });
    return { skillId, skillClass: null, reason, violations, required: [], forbidden: [] };
  }

  const required = REQUIRED_BY_CLASS[skillClass];
  const forbidden = FORBIDDEN_BY_CLASS[skillClass];

  const generated = GENERATED_BY_CLASS[skillClass];
  for (const name of required) {
    if (!map[name]) {
      violations.push({
        code: generated.includes(name) ? 'MISSING_GENERATED_FILE' : 'MISSING_REQUIRED_FILE',
        file: name,
        message: `${skillId}: class ${skillClass} requires ${name}`,
      });
    }
  }

  for (const name of forbidden) {
    if (map[name]) {
      violations.push({
        code: 'FORBIDDEN_FILE',
        file: name,
        message: `${skillId}: class ${skillClass} forbids ${name} — it duplicates a declaration the class already owns elsewhere`,
      });
    }
  }

  for (const [name, allowedRoots] of Object.entries(OVERLAY_FILES)) {
    if (map[name] && !allowedRoots.includes(skillId)) {
      violations.push({
        code: 'UNDECLARED_OVERLAY',
        file: name,
        message: `${skillId}: ${name} is an overlay scoped to [${allowedRoots.join(', ')}]; its consumers do not discover roots generically`,
      });
    }
  }

  return { skillId, skillClass, reason, violations, required: [...required], forbidden: [...forbidden] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PREDICATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * True when a tool may write this file unattended. Pass the class whenever it is
 * known: `leaf-aliases.json` is derivable for a standalone root and authored for
 * a hub, so the class-agnostic answer is the permissive union and must not be
 * used to decide whether to write.
 */
function isGenerated(fileName, skillClass) {
  if (skillClass === undefined) return GENERATED_FILES.includes(fileName);
  const generated = GENERATED_BY_CLASS[skillClass];
  if (!generated) throw new ContractError('UNKNOWN_CLASS', `unknown skill class: ${skillClass}`);
  return generated.includes(fileName);
}

/** True when this file is an overlay legal for the given root. */
function isOverlayAllowed(fileName, skillId) {
  const allowed = OVERLAY_FILES[fileName];
  return Array.isArray(allowed) && allowed.includes(skillId);
}

/** True when the file name is governed by this contract at all. */
function isContractFile(fileName) {
  return METADATA_FILES.includes(fileName);
}

/** The full legal file set for a class, required plus optional plus overlays. */
function legalFilesForClass(skillClass, skillId) {
  if (!REQUIRED_BY_CLASS[skillClass]) {
    throw new ContractError('UNKNOWN_CLASS', `unknown skill class: ${skillClass}`);
  }
  const legal = new Set([...REQUIRED_BY_CLASS[skillClass], ...OPTIONAL_BY_CLASS[skillClass]]);
  for (const [name, allowedRoots] of Object.entries(OVERLAY_FILES)) {
    if (allowedRoots.includes(skillId)) legal.add(name);
  }
  return [...legal].sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  METADATA_FILES,
  SKILL_MARKER,
  CLASS_HUB,
  CLASS_STANDALONE,
  DISCRIMINATOR_FILES,
  REQUIRED_BY_CLASS,
  FORBIDDEN_BY_CLASS,
  OPTIONAL_BY_CLASS,
  OVERLAY_FILES,
  GENERATED_BY_CLASS,
  GENERATED_FILES,
  ContractError,
  normalizePresence,
  classifyPresence,
  evaluateRoot,
  isGenerated,
  isOverlayAllowed,
  isContractFile,
  legalFilesForClass,
};
