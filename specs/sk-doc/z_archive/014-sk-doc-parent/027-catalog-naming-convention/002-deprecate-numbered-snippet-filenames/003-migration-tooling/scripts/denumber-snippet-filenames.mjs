#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Snippet Filename Denumbering                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Safely preview or apply the scoped snippet filename migration.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const EXPECTED_IN_SCOPE = 111;
const EXPECTED_SINGLE_DIGIT_EXCLUSIONS = 20;
const NUMBERED_SNIPPET_PATTERN = /^\d{3}-(.+)\.md$/;
const CATEGORY_TREES = new Set(['feature_catalog', 'manual_testing_playbook']);
const ROUTING_CATEGORIES = new Set(['intra-routing-recall', 'hub-routing']);
const PRUNE_DIRS = new Set([
  '.git',
  '.worktrees',
  '.next',
  '.pytest_cache',
  'build',
  'coverage',
  'dist',
  'node_modules',
]);
const SELF_PACKET_PREFIX =
  '.opencode/specs/sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/';

const PACKET_SCOPES = [
  {
    label: 'cli-external',
    trees: [
      'cli-external/cli-claude-code/manual_testing_playbook',
      'cli-external/cli-opencode/manual_testing_playbook',
      'cli-external/manual_testing_playbook',
    ],
  },
  {
    label: 'mcp-tooling',
    trees: [
      'mcp-tooling/mcp-chrome-devtools/manual_testing_playbook',
      'mcp-tooling/mcp-click-up/manual_testing_playbook',
      'mcp-tooling/mcp-figma/manual_testing_playbook',
      'mcp-tooling/manual_testing_playbook',
    ],
  },
  {
    label: 'sk-code/code-review',
    trees: ['sk-code/code-review/manual_testing_playbook'],
  },
  {
    label: 'sk-code/code-opencode',
    trees: ['sk-code/code-opencode/manual_testing_playbook'],
  },
  {
    label: 'sk-code/code-webflow',
    trees: ['sk-code/code-webflow/manual_testing_playbook'],
  },
  {
    label: 'sk-code/code-quality',
    trees: ['sk-code/code-quality/manual_testing_playbook'],
  },
  {
    label: 'sk-prompt',
    trees: ['sk-prompt/manual_testing_playbook'],
  },
  {
    label: 'system-deep-loop/deep-improvement',
    trees: ['system-deep-loop/deep-improvement/manual_testing_playbook'],
  },
  {
    label: 'system-deep-loop/deep-research',
    trees: ['system-deep-loop/deep-research/manual_testing_playbook'],
  },
  {
    label: 'system-deep-loop/deep-review',
    trees: ['system-deep-loop/deep-review/manual_testing_playbook'],
  },
];

const HUB_INDEX_FILES = [
  '.opencode/skills/cli-external/manual_testing_playbook/manual_testing_playbook.md',
  '.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md',
  '.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md',
];

function parseArgs(argv) {
  const args = {
    apply: false,
    dir: process.cwd(),
    dryRun: false,
    stageScope: 'all',
  };

  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--apply') {
      args.apply = true;
    } else if (argument === '--dry-run') {
      args.dryRun = true;
    } else if (argument === '--dir') {
      args.dir = argv[++index];
      if (!args.dir) throw new Error('--dir requires a repository root');
    } else if (argument.startsWith('--stage-scope=')) {
      args.stageScope = argument.slice('--stage-scope='.length);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (args.apply && args.dryRun) {
    throw new Error('Cannot combine --apply and --dry-run');
  }
  if (!['all', 'tokened'].includes(args.stageScope)) {
    throw new Error('--stage-scope must be all or tokened');
  }
  return args;
}

function relative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function denialReason(relativePath) {
  const parts = relativePath.split('/');
  const basename = parts.at(-1) ?? '';

  if (/^\d-/.test(basename)) return 'single-digit filename';
  if (parts.includes('z_archive')) return 'z_archive';
  if (parts.some((part) => /^changelog/i.test(part))) return 'changelog file';
  if (basename.toLowerCase() === 'implementation-summary.md') {
    return 'implementation summary';
  }
  if (relativePath.startsWith(SELF_PACKET_PREFIX)) return 'current packet spec tree';
  if (relativePath.startsWith('.opencode/specs/') || relativePath.startsWith('specs/')) {
    return 'spec-folder history';
  }
  return null;
}

function sortedEntries(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function enumerateRenames(root) {
  const skillsRoot = path.join(root, '.opencode', 'skills');
  const renames = [];

  for (const scope of PACKET_SCOPES) {
    for (const tree of scope.trees) {
      const treeRoot = path.join(skillsRoot, tree);
      if (!fs.existsSync(treeRoot) || !fs.statSync(treeRoot).isDirectory()) {
        throw new Error(`Scoped tree does not exist: ${relative(root, treeRoot)}`);
      }

      const treeKind = path.basename(treeRoot);
      if (!CATEGORY_TREES.has(treeKind)) {
        throw new Error(`Invalid scoped tree kind: ${relative(root, treeRoot)}`);
      }

      for (const categoryEntry of sortedEntries(treeRoot)) {
        if (!categoryEntry.isDirectory()) continue;
        const categoryRoot = path.join(treeRoot, categoryEntry.name);

        for (const fileEntry of sortedEntries(categoryRoot)) {
          if (!fileEntry.isFile()) continue;
          const match = fileEntry.name.match(NUMBERED_SNIPPET_PATTERN);
          if (!match) continue;

          const source = path.join(categoryRoot, fileEntry.name);
          const relativeSource = relative(root, source);
          if (denialReason(relativeSource)) continue;

          renames.push({
            category: categoryEntry.name,
            destination: path.join(categoryRoot, `${match[1]}.md`),
            newBasename: `${match[1]}.md`,
            oldBasename: fileEntry.name,
            packet: scope.label,
            source,
            treeKind,
          });
        }
      }
    }
  }

  return renames.sort((left, right) =>
    relative(root, left.source).localeCompare(relative(root, right.source)),
  );
}

function checkCollisions(renames) {
  const byDestination = new Map();
  const sourcePaths = new Set(renames.map((rename) => rename.source));

  for (const rename of renames) {
    const sources = byDestination.get(rename.destination) ?? [];
    sources.push(rename.source);
    byDestination.set(rename.destination, sources);
  }

  const collisions = [];
  for (const [destination, sources] of [...byDestination.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const destinationBlocksRename =
      fs.existsSync(destination) && !sourcePaths.has(destination);
    if (sources.length > 1 || destinationBlocksRename) {
      collisions.push({ destination, sources: [...sources].sort() });
    }
  }
  return collisions;
}

function filenameTokens(basename) {
  return basename.replace(/\.md$/, '').split('-');
}

function deriveStage(rename) {
  if (rename.treeKind === 'feature_catalog') return null;

  const tokens = filenameTokens(rename.oldBasename);
  if (tokens.includes('holdout')) return 'holdout';
  if (tokens.includes('negative')) return 'negative';
  if (ROUTING_CATEGORIES.has(rename.category)) return 'routing';
  return null;
}

function stageForScope(rename, stageScope) {
  const stage = deriveStage(rename);
  if (stageScope === 'tokened' && stage === 'routing') return null;
  return stage;
}

function inspectFrontmatter(content) {
  const openingMatch = content.match(/^---(\r?\n)/);
  if (!openingMatch) return { error: 'missing YAML frontmatter', stage: null };

  const lineEnding = openingMatch[1];
  const closingIndex = content.indexOf(`${lineEnding}---`, openingMatch[0].length);
  if (closingIndex < 0) return { error: 'unterminated YAML frontmatter', stage: null };

  const frontmatter = content.slice(openingMatch[0].length, closingIndex);
  const stageMatch = frontmatter.match(/^stage:[ \t]*([^\r\n#]+?)[ \t]*$/m);
  return {
    closingIndex,
    error: null,
    frontmatter,
    lineEnding,
    openingLength: openingMatch[0].length,
    stage: stageMatch?.[1]?.replace(/^['"]|['"]$/g, '') ?? null,
  };
}

function injectStage(content, stage) {
  const details = inspectFrontmatter(content);
  if (details.error) return { content, error: details.error, injected: false };
  if (details.stage !== null) {
    return { content, error: null, existingStage: details.stage, injected: false };
  }

  const lines = details.frontmatter.split(details.lineEnding);
  const categoryIndex = lines.findIndex((line) => /^category:[ \t]*/.test(line));
  const insertionIndex = categoryIndex >= 0 ? categoryIndex + 1 : lines.length;
  lines.splice(insertionIndex, 0, `stage: ${stage}`);
  const frontmatter = lines.join(details.lineEnding);
  const updated =
    content.slice(0, details.openingLength) +
    frontmatter +
    content.slice(details.closingIndex);
  return { content: updated, error: null, existingStage: null, injected: true };
}

function buildStagePlan(renames, stageScope) {
  const counts = { eligible: 0, existing: 0, holdout: 0, injections: 0, negative: 0, routing: 0 };
  const edits = [];
  const errors = [];

  for (const rename of renames) {
    const stage = stageForScope(rename, stageScope);
    if (!stage) continue;

    counts.eligible += 1;
    counts[stage] += 1;
    const content = fs.readFileSync(rename.source, 'utf8');
    const result = injectStage(content, stage);
    if (result.error) {
      errors.push({ file: rename.source, message: result.error });
    } else if (result.injected) {
      counts.injections += 1;
      edits.push({ content: result.content, file: rename.source, stage });
    } else {
      counts.existing += 1;
    }
  }
  return { counts, edits, errors };
}

function walkMarkdown(root) {
  const allowed = [];
  const exclusions = new Map();
  let prunedDirectories = 0;

  function walk(directory) {
    for (const entry of sortedEntries(directory)) {
      if (entry.isDirectory() && PRUNE_DIRS.has(entry.name)) {
        prunedDirectories += 1;
        continue;
      }

      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(target);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
        const reason = denialReason(relative(root, target));
        if (reason) {
          exclusions.set(reason, (exclusions.get(reason) ?? 0) + 1);
        } else {
          allowed.push(target);
        }
      }
    }
  }

  walk(root);
  return {
    allowed: allowed.sort((left, right) => relative(root, left).localeCompare(relative(root, right))),
    exclusions,
    prunedDirectories,
  };
}

function buildReferenceMap(renames) {
  const byBasename = new Map();
  for (const rename of renames) {
    const existing = byBasename.get(rename.oldBasename);
    if (existing && existing !== rename.newBasename) {
      throw new Error(`Conflicting basename rewrite: ${rename.oldBasename}`);
    }
    byBasename.set(rename.oldBasename, rename.newBasename);
  }
  return [...byBasename.entries()]
    .map(([oldBasename, newBasename]) => ({ newBasename, oldBasename }))
    .sort(
      (left, right) =>
        right.oldBasename.length - left.oldBasename.length ||
        left.oldBasename.localeCompare(right.oldBasename),
    );
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWithBoundary(content, oldValue, newValue) {
  const pattern = new RegExp(
    `(?<![A-Za-z0-9_-])${escapeRegex(oldValue)}(?![A-Za-z0-9_-])`,
    'g',
  );
  let count = 0;
  const updated = content.replace(pattern, () => {
    count += 1;
    return newValue;
  });
  return { content: updated, count };
}

function computeReferenceEdits(root, files, references, contentPlans) {
  const edits = [];

  for (const file of files) {
    let content = contentPlans.get(file) ?? fs.readFileSync(file, 'utf8');
    const replacements = [];
    for (const reference of references) {
      const result = replaceWithBoundary(
        content,
        reference.oldBasename,
        reference.newBasename,
      );
      if (result.count > 0) {
        replacements.push({ ...reference, count: result.count });
        content = result.content;
      }
    }

    if (replacements.length > 0) {
      edits.push({ content, file, replacements });
      contentPlans.set(file, content);
    }
  }

  return edits.sort((left, right) =>
    relative(root, left.file).localeCompare(relative(root, right.file)),
  );
}

function countReferenceReplacements(edits) {
  return edits.reduce(
    (total, edit) =>
      total + edit.replacements.reduce((subtotal, replacement) => subtotal + replacement.count, 0),
    0,
  );
}

function signedDelta(value) {
  return value > 0 ? `+${value}` : String(value);
}

function printStageCounts(label, plan) {
  const { counts } = plan;
  console.log(
    `  ${label}: ${counts.eligible} eligible ` +
      `(${counts.holdout} holdout / ${counts.negative} negative / ${counts.routing} routing); ` +
      `${counts.injections} injections, ${counts.existing} already staged`,
  );
}

function printReport({
  collisions,
  exclusions,
  hubIndexStatuses,
  mode,
  packetCounts,
  prunedDirectories,
  referenceEdits,
  renames,
  root,
  selectedStagePlan,
  stagePlans,
  stageScope,
}) {
  const delta = renames.length - EXPECTED_IN_SCOPE;
  const singleDigitCount = exclusions.get('single-digit filename') ?? 0;
  const unstagedFeatureCount = renames.filter((rename) => deriveStage(rename) === null).length;

  console.log('[denumber-snippet-filenames] MIGRATION REPORT');
  console.log(`MODE: ${mode}`);
  console.log(`ROOT: ${root}`);
  console.log(`STAGE SCOPE FOR APPLY: ${stageScope}`);
  console.log(
    `IN-SCOPE FILES: ${renames.length} ` +
      `(expected ${EXPECTED_IN_SCOPE}, delta ${signedDelta(delta)}, ${delta === 0 ? 'PASS' : 'WARNING'})`,
  );
  console.log('IN-SCOPE BY PACKET:');
  for (const scope of PACKET_SCOPES) {
    console.log(`  ${scope.label}: ${packetCounts.get(scope.label) ?? 0}`);
  }
  console.log(`FEATURE-ORIENTED FILES (NO STAGE): ${unstagedFeatureCount}`);
  console.log('RENAME SAMPLES:');
  for (const rename of renames.slice(0, 10)) {
    console.log(
      `  ${relative(root, rename.source)} -> ${relative(root, rename.destination)}`,
    );
  }
  if (renames.length === 0) console.log('  none');
  console.log(`COLLISIONS: ${collisions.length}`);
  for (const collision of collisions) {
    console.log(`  ${relative(root, collision.destination)}`);
    for (const source of collision.sources) console.log(`    <- ${relative(root, source)}`);
  }
  console.log('STAGE PREVIEW (BOTH SCOPES):');
  printStageCounts('all', stagePlans.all);
  printStageCounts('tokened', stagePlans.tokened);
  console.log(
    `SELECTED STAGE INJECTIONS: ${selectedStagePlan.counts.injections} ` +
      `(--stage-scope=${stageScope})`,
  );
  console.log(
    `REFERENCE REWRITES: ${referenceEdits.length} files ` +
      `(${countReferenceReplacements(referenceEdits)} replacements)`,
  );
  console.log('HUB INDEX TABLES:');
  for (const status of hubIndexStatuses) {
    console.log(`  ${status.file}: ${status.touched ? 'rewrite' : 'no rewrite'}`);
  }
  console.log('REFERENCE FILES:');
  for (const edit of referenceEdits) {
    const count = edit.replacements.reduce((total, replacement) => total + replacement.count, 0);
    console.log(`  ${relative(root, edit.file)}: ${count}`);
  }
  if (referenceEdits.length === 0) console.log('  none');
  console.log('DENY-LIST EXCLUSIONS:');
  const reasons = [
    'single-digit filename',
    'z_archive',
    'changelog file',
    'implementation summary',
    'current packet spec tree',
    'spec-folder history',
  ];
  for (const reason of reasons) console.log(`  ${reason}: ${exclusions.get(reason) ?? 0}`);
  console.log(
    `SINGLE-DIGIT DEFENSE CHECK: ${singleDigitCount} ` +
      `(expected ${EXPECTED_SINGLE_DIGIT_EXCLUSIONS}, ` +
      `${singleDigitCount === EXPECTED_SINGLE_DIGIT_EXCLUSIONS ? 'PASS' : 'WARNING'})`,
  );
  console.log(`PRUNED DIRECTORIES: ${prunedDirectories}`);
  console.log(mode === 'dry-run' ? 'DRY-RUN WRITES: 0' : 'APPLY: writes begin after this report');
}

function applyChanges(root, contentPlans, renames) {
  for (const [file, content] of [...contentPlans.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    fs.writeFileSync(file, content, 'utf8');
  }
  for (const rename of renames) {
    execFileSync('git', ['mv', '--', rename.source, rename.destination], {
      cwd: root,
      stdio: 'inherit',
    });
  }
}

function main() {
  const args = parseArgs(process.argv);
  const requestedRoot = path.resolve(args.dir);
  if (!fs.existsSync(requestedRoot) || !fs.statSync(requestedRoot).isDirectory()) {
    throw new Error(`Repository root does not exist: ${requestedRoot}`);
  }

  const root = fs.realpathSync(requestedRoot);
  if (!fs.existsSync(path.join(root, '.git'))) {
    throw new Error(`Not a git repository root: ${root}`);
  }

  const renames = enumerateRenames(root);
  const collisions = checkCollisions(renames);
  const packetCounts = new Map();
  for (const rename of renames) {
    packetCounts.set(rename.packet, (packetCounts.get(rename.packet) ?? 0) + 1);
  }

  const stagePlans = {
    all: buildStagePlan(renames, 'all'),
    tokened: buildStagePlan(renames, 'tokened'),
  };
  const selectedStagePlan = stagePlans[args.stageScope];
  const stageErrors = [...stagePlans.all.errors, ...stagePlans.tokened.errors];
  if (stageErrors.length > 0) {
    const details = stageErrors
      .map((error) => `${relative(root, error.file)}: ${error.message}`)
      .join('\n');
    throw new Error(`Stage injection preflight failed:\n${details}`);
  }

  const markdown = walkMarkdown(root);
  const contentPlans = new Map(
    selectedStagePlan.edits.map((edit) => [edit.file, edit.content]),
  );
  const references = buildReferenceMap(renames);
  const referenceEdits =
    collisions.length === 0
      ? computeReferenceEdits(root, markdown.allowed, references, contentPlans)
      : [];
  const hubIndexStatuses = HUB_INDEX_FILES.map((file) => ({
    file,
    touched: referenceEdits.some((edit) => relative(root, edit.file) === file),
  }));

  printReport({
    collisions,
    exclusions: markdown.exclusions,
    hubIndexStatuses,
    mode: args.apply ? 'apply' : 'dry-run',
    packetCounts,
    prunedDirectories: markdown.prunedDirectories,
    referenceEdits,
    renames,
    root,
    selectedStagePlan,
    stagePlans,
    stageScope: args.stageScope,
  });

  if (collisions.length > 0) {
    process.stderr.write('[denumber-snippet-filenames] Aborted before writes: collisions detected.\n');
    process.exitCode = 2;
    return;
  }
  if (args.apply) applyChanges(root, contentPlans, renames);
}

try {
  main();
} catch (error) {
  process.stderr.write(`[denumber-snippet-filenames] Error: ${error.message}\n`);
  process.exitCode = 1;
}
