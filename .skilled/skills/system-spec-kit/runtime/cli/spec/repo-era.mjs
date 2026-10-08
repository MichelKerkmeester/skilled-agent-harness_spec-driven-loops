// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Era Report
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { compareCodeUnits } from '../retrieval/lib/normalize.mjs';
import {
  canonicalRelativePath,
  gitIgnoredPaths,
  isExcludedDirectory,
  walkCorpus,
} from '../retrieval/lib/corpus.mjs';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(MODULE_DIR, '../../..');
const TEMPLATE_MANIFEST = JSON.parse(
  fs.readFileSync(path.join(SKILL_ROOT, 'templates/spec-kit-docs.json'), 'utf8'),
);
const TEMPLATE_SOURCE_PATTERN = new RegExp(
  '<!--\\s*SPECKIT_TEMPLATE_SOURCE\\s*:\\s*([^|>\\r\\n]+?)'
    + '(?:\\s*\\|\\s*([^>\\r\\n]+?))?\\s*-->',
  'i',
);
const FRONTMATTER_PATTERN = new RegExp(
  '^(?:\\uFEFF)?---[ \\t]*\\r?\\n[\\s\\S]*?\\r?\\n---[ \\t]*(?:\\r?\\n|$)',
);
const LEGACY_SPEC_ROOT_PATTERN = /(?:^|\/)\.opencode\/specs(?:\/|$)/;

/**
 * Paths that do not represent independent packets. The corpus walker applies
 * its own shared exclusions, while these rules remove spec-kit artifacts.
 */
export const EXCLUSION_RULES = Object.freeze([
  Object.freeze({
    name: 'research lineages',
    segment: 'lineages',
    reason: 'research lineage artifacts are not packets',
  }),
  Object.freeze({
    name: 'containment trees',
    names: Object.freeze(['research', 'review', 'context']),
    firstDepth: 2,
    reason: 'containment trees are not independent packets',
  }),
  Object.freeze({
    name: 'scratch',
    segment: 'scratch',
    reason: 'scratch directories are not packets',
  }),
  Object.freeze({
    name: 'changelog',
    segments: Object.freeze(['z_archive', '00-changelog']),
    reason: 'changelog directories are not packets',
  }),
  Object.freeze({ name: 'git-ignored paths', source: 'walkCorpus', reason: 'git-ignored path' }),
]);
const [
  LINEAGE_RULE,
  CONTAINMENT_RULE,
  SCRATCH_RULE,
  CHANGELOG_RULE,
  GIT_IGNORE_RULE,
] = EXCLUSION_RULES;
const ARTIFACT_TREE_NAMES = new Set(CONTAINMENT_RULE.names);

/**
 * Template header variants that name the same document contract.
 */
export const HEADER_ALIASES = Object.freeze({
  'spec-core': 'spec',
  'plan-core': 'plan',
  'tasks-core': 'tasks',
  'impl-summary-core': 'implementation-summary',
  'implementation-summary-core': 'implementation-summary',
  'implementation-summary': 'implementation-summary',
  'acceptance-criteria-core': 'acceptance-criteria',
  'decision-record-core': 'decision-record',
  'resource-map@v1.1': 'resource-map',
  'resource-map@v2.2': 'resource-map',
});

/**
 * Finds spec roots and archive roots at every depth. The corpus walker prunes
 * archive directories during normal traversal.
 * @param {string} repoRoot Absolute repository root.
 * @returns {string[]} Existing spec roots.
 */
function specRootsFor(repoRoot) {
  const roots = [];
  for (const candidate of ['specs', '.opencode/specs']) {
    const absolute = path.join(repoRoot, candidate);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) continue;
    roots.push(candidate);
    const archive = path.join(absolute, 'z_archive');
    if (fs.existsSync(archive) && fs.statSync(archive).isDirectory()) {
      roots.push(`${candidate}/z_archive`);
    }

    const pendingDirectories = [absolute];
    while (pendingDirectories.length > 0) {
      const currentDirectory = pendingDirectories.pop();
      let entries;
      try {
        entries = fs.readdirSync(currentDirectory, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const childDirectory = path.join(currentDirectory, entry.name);
        const relativePath = path.relative(repoRoot, childDirectory).split(path.sep).join('/');
        const canonicalPath = canonicalRelativePath(relativePath);
        if (exclusionForPath(canonicalPath)) continue;

        const isArchive = entry.name === 'z_archive';
        if (!isArchive && (
          entry.name.startsWith('.')
          || entry.name === 'memory'
          || entry.name === 'z-future'
          || isExcludedDirectory(entry.name, path.basename(currentDirectory), canonicalPath)
        )) {
          continue;
        }

        if (isArchive && relativePath !== path.posix.join(candidate, 'z_archive')) {
          roots.push(relativePath);
        }
        pendingDirectories.push(childDirectory);
      }
    }
  }
  return roots;
}

/**
 * Checks whether an explicit root is covered by a git-ignored path.
 * @param {string} root Repo-relative root.
 * @param {ReadonlySet<string>} ignored Git-ignored paths.
 * @returns {boolean} True when the root itself or one of its ancestors is ignored.
 */
function isIgnoredRoot(root, ignored) {
  for (const ignoredPath of ignored) {
    const normalized = ignoredPath.replace(/\/$/, '');
    if (root === normalized || root.startsWith(`${normalized}/`)) return true;
  }
  return false;
}

/**
 * Finds the first spec-kit artifact rule matching a document path.
 * @param {string} relativePath Canonical repo-relative path.
 * @returns {{ path: string, reason: string } | null} Exclusion entry or null.
 */
function exclusionForPath(relativePath) {
  const segments = relativePath.split('/');
  if (segments[0] !== 'specs') return null;
  const belowRoot = segments.slice(1);

  const lineageIndex = belowRoot.indexOf(LINEAGE_RULE.segment);
  if (lineageIndex !== -1) {
    return {
      path: segments.slice(0, lineageIndex + 2).join('/'),
      reason: LINEAGE_RULE.reason,
    };
  }

  const scratchIndex = belowRoot.indexOf(SCRATCH_RULE.segment);
  if (scratchIndex !== -1) {
    return {
      path: segments.slice(0, scratchIndex + 2).join('/'),
      reason: SCRATCH_RULE.reason,
    };
  }

  for (let index = 0; index < segments.length - 1; index += 1) {
    if (segments[index] === CHANGELOG_RULE.segments[0]
      && segments[index + 1] === CHANGELOG_RULE.segments[1]) {
      return {
        path: segments.slice(0, index + 2).join('/'),
        reason: CHANGELOG_RULE.reason,
      };
    }
  }

  const artifactIndex = belowRoot.findIndex(
    (name, index) => index >= CONTAINMENT_RULE.firstDepth && ARTIFACT_TREE_NAMES.has(name),
  );
  if (artifactIndex !== -1) {
    return {
      path: segments.slice(0, artifactIndex + 2).join('/'),
      reason: CONTAINMENT_RULE.reason,
    };
  }

  return null;
}

/**
 * Resolves a canonical corpus path to its on-disk path, including a legacy root.
 * @param {string} repoRoot Absolute repository root.
 * @param {string} relativePath Canonical repo-relative path.
 * @returns {string} Existing path, or the canonical path when it is absent.
 */
function filesystemPathFor(repoRoot, relativePath) {
  const canonical = canonicalRelativePath(relativePath);
  const direct = path.join(repoRoot, ...canonical.split('/'));
  if (fs.existsSync(direct)) return direct;

  if (canonical === 'specs' || canonical.startsWith('specs/')) {
    const suffix = canonical.slice('specs'.length).replace(/^\//, '');
    const legacy = path.join(repoRoot, '.opencode', 'specs', ...suffix.split('/').filter(Boolean));
    if (fs.existsSync(legacy)) return legacy;
  }
  return direct;
}

/**
 * Parses the packet's declared document level from its specification.
 * @param {string} specText Packet specification content.
 * @returns {{ level: string | null, disagreement: boolean }}
 */
function readDeclaredLevel(specText) {
  const marker = specText.match(
    /<!--\s*SPECKIT_LEVEL\s*:\s*([\w+.-]+)\s*-->/i,
  )?.[1] ?? null;
  const table = specText.match(
    /^\s*\|\s*\*\*Level\*\*\s*\|\s*(?:Level\s*)?([^|]+)\|/im,
  )?.[1]?.trim() ?? null;
  const yamlFrontmatter = specText.match(FRONTMATTER_PATTERN)?.[0] ?? '';
  const yamlFrontmatterLevel = yamlFrontmatter.match(
    /^level:\s*(1|2|3\+?|phase|review|research)\s*$/mu,
  )?.[1] ?? null;
  const normalizedMarker = marker?.trim();
  const normalizedYamlFrontmatter = yamlFrontmatterLevel?.trim();
  const normalizedTable = table?.replace(/^Level\s+/i, '').trim();
  return {
    level: normalizedMarker ?? normalizedYamlFrontmatter ?? normalizedTable,
    disagreement: Boolean(
      normalizedMarker && normalizedTable && normalizedMarker !== normalizedTable,
    ),
  };
}

/**
 * Uses the local document contract for the declared level.
 * @param {string | null} level Packet level.
 * @param {boolean} implementationStarted Whether any task is complete.
 * @returns {{ required: string[], known: boolean }} Required file names.
 */
function requiredDocumentsForLevel(level, implementationStarted) {
  const contract = level ? TEMPLATE_MANIFEST.levels?.[level] : null;
  if (!contract) return { required: [], known: false };

  const required = [
    ...(contract.requiredCoreDocs ?? []),
    ...(contract.requiredAddonDocs ?? []),
  ];
  if (implementationStarted) {
    required.push(...(contract.lifecycleRequiredDocs?.afterImplementationStarts ?? []));
  }
  return { required: [...new Set(required)], known: true };
}

/**
 * Detects whether a packet is a phase parent with a populated direct child.
 * @param {string} packetDirectory Absolute packet directory.
 * @returns {boolean} Whether the packet follows the phase-parent contract.
 */
function isPhaseParent(packetDirectory) {
  let entries;
  try {
    entries = fs.readdirSync(packetDirectory, { withFileTypes: true });
  } catch {
    return false;
  }

  return entries.some((entry) => {
    if (!entry.isDirectory() || !/^[0-9]{3}-[a-z0-9][a-z0-9-]*$/.test(entry.name)) {
      return false;
    }
    const childDirectory = path.join(packetDirectory, entry.name);
    return fs.existsSync(path.join(childDirectory, 'spec.md'))
      || fs.existsSync(path.join(childDirectory, 'description.json'));
  });
}

/**
 * Detects frontmatter independently for each packet document.
 * @param {string} text Document content.
 * @returns {boolean} Whether a complete frontmatter block is present.
 */
function detectFrontmatterSignal(text) {
  return FRONTMATTER_PATTERN.test(text);
}

/**
 * Normalizes a template source header and compares its version with the manifest.
 * @param {string} source Header source name.
 * @param {string | null} version Header version.
 * @returns {{ source: string, canonical: string, version: string | null,
 *   currentVersion: string | null, status: string }}
 */
function normalizeTemplateHeader(source, version) {
  const normalizedSource = source.trim().toLowerCase().replace(/\.md$/, '');
  const normalizedVersion = version?.trim().toLowerCase() ?? null;
  const versionAlias = normalizedVersion ? `${normalizedSource}@${normalizedVersion}` : '';
  const canonical = HEADER_ALIASES[versionAlias]
    ?? HEADER_ALIASES[normalizedSource]
    ?? normalizedSource;
  const currentVersion = TEMPLATE_MANIFEST.versions?.[`${canonical}.md.tmpl`] ?? null;
  return {
    source: normalizedSource,
    canonical,
    version: normalizedVersion,
    currentVersion,
    status: normalizedVersion && normalizedVersion === currentVersion ? 'new' : 'legacy',
  };
}

/**
 * Detects the template marker state and canonical header for a document.
 * @param {string} text Document content.
 * @returns {{ status: string, source: string | null, canonical: string | null,
 *   version: string | null, currentVersion: string | null }}
 */
function detectTemplateMarkerSignal(text) {
  const match = text.match(TEMPLATE_SOURCE_PATTERN);
  if (!match) {
    return { status: 'none', source: null, canonical: null, version: null, currentVersion: null };
  }
  return normalizeTemplateHeader(match[1], match[2] ?? null);
}

/**
 * Detects whether generated packet metadata is complete enough to be trusted.
 * @param {string} packetDirectory Absolute packet directory.
 * @returns {{ status: string, path: string }} Metadata status and relative file name.
 */
function detectGeneratedMetadataSignal(packetDirectory) {
  const metadataPath = path.join(packetDirectory, 'graph-metadata.json');
  if (!fs.existsSync(metadataPath)) return { status: 'missing', path: 'graph-metadata.json' };

  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  } catch {
    return { status: 'stub', path: 'graph-metadata.json' };
  }
  const hasIdentity = typeof metadata?.packet_id === 'string'
    && metadata.packet_id.length > 0
    && typeof metadata?.spec_folder === 'string'
    && metadata.spec_folder.length > 0;
  const derived = metadata?.derived;
  const hasDerivedData = derived && typeof derived === 'object'
    && !Array.isArray(derived)
    && Array.isArray(derived.trigger_phrases)
    && Array.isArray(derived.key_topics)
    && Array.isArray(derived.entities)
    && Array.isArray(derived.source_docs);
  return {
    status: hasIdentity && hasDerivedData ? 'present' : 'stub',
    path: 'graph-metadata.json',
  };
}

/**
 * Detects whether the packet's direct document set satisfies its level contract.
 * @param {string} levelSpecText spec.md content.
 * @param {string} tasksText tasks.md content.
 * @param {Set<string>} documentNames Direct markdown document names.
 * @param {string} packetDirectory Absolute packet directory.
 * @returns {{ level: string | null, status: string, required: string[], missing: string[] }}
 */
function detectLevelDocumentSignal(levelSpecText, tasksText, documentNames, packetDirectory) {
  const declared = readDeclaredLevel(levelSpecText);
  const phaseParent = isPhaseParent(packetDirectory);
  if (phaseParent) {
    const required = ['spec.md', 'description.json', 'graph-metadata.json'];
    const missing = required.filter((name) => (
      name === 'spec.md'
        ? !documentNames.has(name)
        : !fs.existsSync(path.join(packetDirectory, name))
    ));
    return {
      level: declared.level,
      status: missing.length > 0 ? 'mismatch' : 'match',
      required,
      missing,
    };
  }

  const implementationStarted = /^\s*[-*] \[[xX]\]/m.test(tasksText);
  const contract = requiredDocumentsForLevel(declared.level, implementationStarted);
  if (!contract.known) {
    return { level: declared.level, status: 'unknown', required: [], missing: [] };
  }

  const missing = contract.required.filter((name) => !documentNames.has(name));
  return {
    level: declared.level,
    status: missing.length > 0 || declared.disagreement ? 'mismatch' : 'match',
    required: contract.required,
    missing,
  };
}

/**
 * Detects whether the repository has v3 or v4 spec layout evidence.
 * @param {string} repoRoot Absolute repository root.
 * @param {Array<{ directory: string }>} packets Classified packets.
 * @returns {{ v3: boolean, v4: boolean, kind: string,
 *   provenance: { source: string | null, residueCount: number } }} Layout state.
 */
function detectLayoutSignal(repoRoot, packets) {
  const v4Root = path.join(repoRoot, 'specs');
  const v3Root = path.join(repoRoot, '.opencode', 'specs');
  const hasV4Root = fs.existsSync(v4Root);
  const hasV3Root = fs.existsSync(v3Root);
  const isAlias = hasV3Root && hasV4Root && filesystemPathsMatch(v3Root, v4Root);
  const hasLegacyRoot = hasV3Root && !isAlias;
  let residueCount = 0;
  for (const { directory } of packets) {
    const descriptionPath = path.join(directory, 'description.json');
    if (!fs.existsSync(descriptionPath)) continue;
    try {
      const description = JSON.parse(fs.readFileSync(descriptionPath, 'utf8'));
      if (
        typeof description?.specFolder === 'string'
        && LEGACY_SPEC_ROOT_PATTERN.test(description.specFolder)
      ) {
        residueCount += 1;
      }
    } catch {
      continue;
    }
  }

  const hasDescriptionResidue = !hasLegacyRoot && hasV4Root && residueCount > 0;
  const v3 = hasLegacyRoot || hasDescriptionResidue;
  const v4 = hasV4Root;
  return {
    v3,
    v4,
    kind: v3 && v4 ? 'both' : v3 ? 'v3' : v4 ? 'v4' : 'unknown',
    provenance: {
      source: hasLegacyRoot
        ? 'legacy-root'
        : hasDescriptionResidue
          ? 'description-residue'
          : null,
      residueCount,
    },
  };
}

/**
 * Compares two existing directories by resolved identity.
 * @param {string} first First path.
 * @param {string} second Second path.
 * @returns {boolean} Whether both paths resolve to the same directory.
 */
function filesystemPathsMatch(first, second) {
  try {
    return fs.realpathSync(first) === fs.realpathSync(second);
  } catch {
    return false;
  }
}

/**
 * Accepts either the repository root or a v3/v4 spec root.
 * @param {string} inputRoot Repository or spec root.
 * @returns {string} Absolute repository root.
 */
function repositoryRootFor(inputRoot) {
  const absolute = path.resolve(inputRoot);
  if (fs.existsSync(path.join(absolute, 'specs'))
    || fs.existsSync(path.join(absolute, '.opencode', 'specs'))) {
    return absolute;
  }
  if (path.basename(absolute) !== 'specs') return absolute;

  const parent = path.dirname(absolute);
  return path.basename(parent) === '.opencode' ? path.dirname(parent) : parent;
}

/**
 * Classifies every packet reachable through the shared spec corpus walk.
 * @param {string} repoRoot Repository root or a v3/v4 spec root to inspect.
 * @param {{ ignored?: ReadonlySet<string> }} [options]
 *   Optional ignored paths for deterministic callers.
 * @returns {{ root: string, layout: object, packets: object[], nonPackets: object[],
 *   excluded: object[] }}
 */
export function classifyRepo(repoRoot, options = {}) {
  const absoluteRoot = repositoryRootFor(repoRoot);
  const roots = specRootsFor(absoluteRoot);
  const ignored = options.ignored ?? gitIgnoredPaths(absoluteRoot, roots);
  const walkRoots = roots.filter((root) => !isIgnoredRoot(root, ignored));
  const walked = walkRoots.length > 0
    ? walkCorpus(absoluteRoot, { roots: walkRoots, ignored })
    : { files: [], skipped: [] };
  const documentsByDirectory = new Map();
  const excludedByPath = new Map();
  const includedArchives = new Set(
    roots
      .filter((root) => root.endsWith('/z_archive'))
      .flatMap((root) => [root, canonicalRelativePath(root)]),
  );

  for (const skipped of walked.skipped) {
    const canonical = canonicalRelativePath(skipped.path);
    if (includedArchives.has(skipped.path) || includedArchives.has(canonical)) continue;
    if (skipped.reason === 'excluded directory') {
      excludedByPath.set(canonical, {
        path: canonical,
        reason: 'excluded by the shared corpus walk',
      });
    }
  }

  for (const ignoredPath of ignored) {
    const canonical = canonicalRelativePath(ignoredPath.replace(/\/$/, ''));
    if (canonical === 'specs' || canonical.startsWith('specs/')) {
      excludedByPath.set(canonical, { path: canonical, reason: GIT_IGNORE_RULE.reason });
    }
  }

  for (const walkedPath of walked.files) {
    const relativePath = canonicalRelativePath(walkedPath);
    const excluded = exclusionForPath(relativePath);
    if (excluded) {
      excludedByPath.set(excluded.path, excluded);
      continue;
    }

    const directory = path.posix.dirname(relativePath);
    if (directory.split('/').length < 3) continue;
    if (!documentsByDirectory.has(directory)) documentsByDirectory.set(directory, new Map());
    documentsByDirectory.get(directory).set(path.posix.basename(relativePath), relativePath);
  }

  const packets = [];
  const nonPackets = [];
  for (const [relativeDirectory, filePaths] of documentsByDirectory) {
    if (!filePaths.has('spec.md')) {
      nonPackets.push({ path: relativeDirectory, reason: 'missing spec.md' });
      continue;
    }

    const directory = filesystemPathFor(absoluteRoot, relativeDirectory);
    const documents = [];
    const documentContents = new Map();
    for (const [name, relativePath] of filePaths) {
      const text = fs.readFileSync(filesystemPathFor(absoluteRoot, relativePath), 'utf8');
      documentContents.set(name, text);
      documents.push({
        name,
        path: relativePath,
        frontmatter: detectFrontmatterSignal(text),
        templateMarker: detectTemplateMarkerSignal(text),
      });
    }

    const specText = documentContents.get('spec.md');
    const tasksText = documentContents.get('tasks.md') ?? '';
    const documentNames = new Set(documents.map((document) => document.name));
    packets.push({
      path: relativeDirectory,
      directory,
      documents,
      generatedMetadata: detectGeneratedMetadataSignal(directory),
      levelDocuments: detectLevelDocumentSignal(
        specText,
        tasksText,
        documentNames,
        directory,
      ),
    });
  }

  packets.sort((a, b) => compareCodeUnits(a.path, b.path));
  nonPackets.sort((a, b) => compareCodeUnits(a.path, b.path));

  return {
    root: absoluteRoot,
    layout: detectLayoutSignal(absoluteRoot, packets),
    packets,
    nonPackets,
    excluded: [...excludedByPath.values()].sort((a, b) => compareCodeUnits(a.path, b.path)),
  };
}

/**
 * Builds aggregate signal counts from a repository classification.
 * @param {{ root: string, layout: object, packets: object[], nonPackets: object[],
 *   excluded: object[] }} classification Classifier output.
 * @returns {{ root: string, packetCount: number, nonPacketCount: number,
 *   excludedCount: number, signals: object, totals: object }} Read-only report data.
 */
export function buildReport(classification) {
  const documents = classification.packets.flatMap((packet) => packet.documents);
  const tally = (items, key, value) => items.filter((item) => item[key] === value).length;
  const frontmatter = {
    present: tally(documents, 'frontmatter', true),
    missing: tally(documents, 'frontmatter', false),
  };
  const templateMarkers = {
    new: documents.filter((document) => document.templateMarker.status === 'new').length,
    legacy: documents.filter((document) => document.templateMarker.status === 'legacy').length,
    none: documents.filter((document) => document.templateMarker.status === 'none').length,
  };
  const metadataSignals = classification.packets.map((packet) => packet.generatedMetadata);
  const levelSignals = classification.packets.map((packet) => packet.levelDocuments);
  const generatedMetadata = {
    present: tally(metadataSignals, 'status', 'present'),
    stub: tally(metadataSignals, 'status', 'stub'),
    missing: tally(metadataSignals, 'status', 'missing'),
  };
  const levelDocuments = {
    match: tally(levelSignals, 'status', 'match'),
    mismatch: tally(levelSignals, 'status', 'mismatch'),
    unknown: tally(levelSignals, 'status', 'unknown'),
  };
  const totals = {
    packets: classification.packets.length,
    documents: documents.length,
    frontmatter: frontmatter.present + frontmatter.missing,
    templateMarkers: templateMarkers.new + templateMarkers.legacy + templateMarkers.none,
    generatedMetadata: generatedMetadata.present
      + generatedMetadata.stub
      + generatedMetadata.missing,
    levelDocuments: levelDocuments.match + levelDocuments.mismatch + levelDocuments.unknown,
  };

  return {
    root: classification.root,
    packetCount: classification.packets.length,
    nonPacketCount: classification.nonPackets.length,
    excludedCount: classification.excluded.length,
    signals: {
      layout: classification.layout,
      frontmatter,
      templateMarkers,
      generatedMetadata,
      levelDocuments,
    },
    totals,
  };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  process.stdout.write(`${JSON.stringify(buildReport(classifyRepo(root)), null, 2)}\n`);
}
