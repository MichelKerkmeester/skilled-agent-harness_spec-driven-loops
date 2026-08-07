#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Underscore Catalog Content Migration                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Preview or apply collision-safe catalog and playbook renames.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const CONTENT_ROOTS = [
  '.opencode/skills/sk-doc/feature_catalog',
  '.opencode/skills/sk-doc/manual_testing_playbook',
];
const PRUNED_DIRECTORIES = new Set(['.git', 'changelog', 'node_modules', 'z_archive']);

function parseArgs(argv) {
  const args = { apply: false, dir: process.cwd() };
  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--apply') {
      args.apply = true;
    } else if (argument === '--dir') {
      args.dir = argv[++index];
      if (!args.dir) throw new Error('--dir requires a repository root');
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return args;
}

function relative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function underscore(value) {
  return value.replaceAll('-', '_');
}

function walk(root, visitor) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (entry.isDirectory() && PRUNED_DIRECTORIES.has(entry.name)) continue;
    const target = path.join(root, entry.name);
    visitor(target, entry);
    if (entry.isDirectory()) walk(target, visitor);
  }
}

function enumerateRenames(root) {
  const renames = [];
  const missingRoots = [];

  for (const contentRoot of CONTENT_ROOTS) {
    const targetRoot = path.join(root, contentRoot);
    if (!fs.existsSync(targetRoot)) {
      missingRoots.push(contentRoot);
      continue;
    }

    walk(targetRoot, (target, entry) => {
      if (!entry.isDirectory() && !(entry.isFile() && target.endsWith('.md'))) return;
      const relativeSource = relative(targetRoot, target);
      const sourceName = path.basename(target);
      const destinationName = underscore(sourceName);
      if (sourceName === destinationName) return;
      renames.push({
        contentRoot,
        destination: path.join(path.dirname(target), destinationName),
        destinationName,
        kind: entry.isDirectory() ? 'directory' : 'file',
        relativeSource,
        source: target,
        sourceName,
      });
    });
  }

  return {
    missingRoots,
    renames: renames.sort((left, right) => left.source.localeCompare(right.source)),
  };
}

function destinationFor(rename) {
  const segments = rename.relativeSource.split('/');
  segments[segments.length - 1] = rename.destinationName;
  return path.join(rename.contentRoot, ...segments.map(underscore));
}

function checkCollisions(root, renames) {
  const byDestination = new Map();
  for (const rename of renames) {
    const destination = path.join(root, destinationFor(rename));
    const sources = byDestination.get(destination) ?? [];
    sources.push(rename.source);
    byDestination.set(destination, sources);
  }

  const collisions = [];
  for (const [destination, sources] of [...byDestination.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (sources.length > 1 || fs.existsSync(destination)) {
      collisions.push({ destination, sources: sources.sort() });
    }
  }
  return collisions;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWithBoundary(content, oldValue, newValue) {
  const pattern = new RegExp(`(?<![A-Za-z0-9_-])${escapeRegex(oldValue)}(?![A-Za-z0-9_-])`, 'g');
  let count = 0;
  const updated = content.replace(pattern, () => {
    count += 1;
    return newValue;
  });
  return { content: updated, count };
}

function replaceFrontmatterCategory(content, oldValue, newValue) {
  const pattern = new RegExp(`^(category:[ \\t]*)(["']?)${escapeRegex(oldValue)}\\2[ \\t]*$`, 'gm');
  let count = 0;
  const updated = content.replace(pattern, (_, prefix, quote) => {
    count += 1;
    return `${prefix}${quote}${newValue}${quote}`;
  });
  return { content: updated, count };
}

function findReferenceFiles(root) {
  const skillRoot = path.join(root, '.opencode/skills/sk-doc');
  const files = [];
  walk(skillRoot, (target, entry) => {
    if (entry.isFile() && target.endsWith('.md')) files.push(target);
  });
  return files.sort((left, right) => relative(root, left).localeCompare(relative(root, right)));
}

function buildReferencePairs(renames) {
  const pairs = new Map();
  for (const rename of renames) {
    const source = path.join(rename.contentRoot, rename.relativeSource).split(path.sep).join('/');
    const destination = destinationFor(rename).split(path.sep).join('/');
    pairs.set(source, destination);
    if (rename.kind === 'directory') {
      pairs.set(`${rename.relativeSource}/`, `${relative(rename.contentRoot, destination)}/`);
    }
    if (rename.kind === 'file') {
      pairs.set(rename.relativeSource, relative(rename.contentRoot, destination));
    }
  }
  return [...pairs.entries()]
    .map(([oldValue, newValue]) => ({ newValue, oldValue }))
    .sort((left, right) => right.oldValue.length - left.oldValue.length || left.oldValue.localeCompare(right.oldValue));
}

function categoryPairs(renames) {
  return renames
    .filter((rename) => rename.kind === 'directory' && !rename.relativeSource.includes('/'))
    .map((rename) => ({ newValue: rename.destinationName, oldValue: rename.sourceName }))
    .sort((left, right) => right.oldValue.length - left.oldValue.length || left.oldValue.localeCompare(right.oldValue));
}

function computeReferenceEdits(root, renames) {
  const edits = [];
  const pathPairs = buildReferencePairs(renames);
  const frontmatterPairs = categoryPairs(renames);

  for (const file of findReferenceFiles(root)) {
    let content = fs.readFileSync(file, 'utf8');
    let replacements = 0;
    for (const pair of frontmatterPairs) {
      const result = replaceFrontmatterCategory(content, pair.oldValue, pair.newValue);
      content = result.content;
      replacements += result.count;
    }
    for (const pair of pathPairs) {
      const result = replaceWithBoundary(content, pair.oldValue, pair.newValue);
      content = result.content;
      replacements += result.count;
    }
    if (replacements > 0) edits.push({ content, file, replacements });
  }
  return edits;
}

function currentSource(root, rename) {
  const segments = rename.relativeSource.split('/').map(underscore);
  segments[segments.length - 1] = rename.sourceName;
  return path.join(root, rename.contentRoot, ...segments);
}

function applyChanges(root, edits, renames) {
  for (const edit of edits) fs.writeFileSync(edit.file, edit.content, 'utf8');

  const directories = renames
    .filter((rename) => rename.kind === 'directory')
    .sort((left, right) => left.relativeSource.split('/').length - right.relativeSource.split('/').length || left.source.localeCompare(right.source));
  for (const rename of directories) {
    execFileSync('git', ['mv', '--', currentSource(root, rename), path.join(root, destinationFor(rename))], {
      cwd: root,
      stdio: 'inherit',
    });
  }

  const files = renames.filter((rename) => rename.kind === 'file');
  for (const rename of files) {
    execFileSync('git', ['mv', '--', currentSource(root, rename), path.join(root, destinationFor(rename))], {
      cwd: root,
      stdio: 'inherit',
    });
  }
}

function printReport(root, missingRoots, renames, collisions, edits, mode) {
  const directories = renames.filter((rename) => rename.kind === 'directory');
  const files = renames.filter((rename) => rename.kind === 'file');
  const replacements = edits.reduce((total, edit) => total + edit.replacements, 0);

  console.log('[underscore-catalog-content] MIGRATION REPORT');
  console.log(`MODE: ${mode}`);
  console.log(`ROOT: ${root}`);
  console.log(`CONTENT ROOTS PRESENT: ${CONTENT_ROOTS.length - missingRoots.length}`);
  for (const missingRoot of missingRoots) console.log(`  absent: ${missingRoot}`);
  console.log(`FOLDERS TO RENAME: ${directories.length}`);
  console.log(`FILES TO RENAME: ${files.length}`);
  console.log(`COLLISIONS: ${collisions.length}`);
  for (const collision of collisions) {
    console.log(`  ${relative(root, collision.destination)}`);
    for (const source of collision.sources) console.log(`    <- ${relative(root, source)}`);
  }
  console.log(`REFERENCE REWRITES: ${edits.length} files (${replacements} replacements)`);
  console.log('RENAME SAMPLES:');
  for (const rename of renames.slice(0, 10)) {
    console.log(`  ${relative(root, rename.source)} -> ${destinationFor(rename)}`);
  }
  if (renames.length === 0) console.log('  none');
  console.log(mode === 'dry-run' ? 'DRY-RUN WRITES: 0' : 'APPLY: writes begin after this report');
}

function main() {
  const args = parseArgs(process.argv);
  const root = fs.realpathSync(path.resolve(args.dir));
  if (!fs.existsSync(path.join(root, '.git'))) throw new Error(`Not a git repository root: ${root}`);

  const { missingRoots, renames } = enumerateRenames(root);
  const collisions = checkCollisions(root, renames);
  const edits = collisions.length === 0 ? computeReferenceEdits(root, renames) : [];
  printReport(root, missingRoots, renames, collisions, edits, args.apply ? 'apply' : 'dry-run');

  if (collisions.length > 0) {
    process.stderr.write('[underscore-catalog-content] Aborted before writes: collisions detected.\n');
    process.exitCode = 2;
    return;
  }
  if (args.apply) applyChanges(root, edits, renames);
}

try {
  main();
} catch (error) {
  process.stderr.write(`[underscore-catalog-content] Error: ${error.message}\n`);
  process.exitCode = 1;
}
