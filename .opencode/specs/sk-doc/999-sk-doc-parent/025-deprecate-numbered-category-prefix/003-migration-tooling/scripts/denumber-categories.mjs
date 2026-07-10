#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const CATEGORY_KINDS = new Set(['feature_catalog', 'manual_testing_playbook']);
const CATEGORY_PATTERN = /^(\d{2})--(.+)$/;
const ROUTER_FILES = [
  '.opencode/skills/system-skill-advisor/SKILL.md',
  '.opencode/skills/system-code-graph/SKILL.md',
];

// Functional references to category folders live only in prose/config/code text:
// markdown (index tables, nav links, frontmatter, SKILL.md router config) plus a
// handful of TS/MJS files that hard-code a category path. Log and result artifacts
// (.jsonl, .out, .json dumps, findings registries) are frozen historical records and
// must NOT be rewritten. Vendor/build trees are pruned outright for speed.
const ALLOWED_EXT = new Set(['.md', '.ts', '.mjs']);
const PRUNE_DIRS = new Set(['node_modules', '.git', 'dist', '.worktrees', 'coverage', '.pytest_cache', 'build', '.next']);
const PACKET_PREFIX = '.opencode/specs/sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/';

function parseArgs(argv) {
  const args = { dir: process.cwd(), apply: false };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
    } else if (arg === '--dir') {
      args.dir = argv[++index];
      if (!args.dir) throw new Error('--dir requires a directory');
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function relative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function isDenied(relativePath) {
  const parts = relativePath.split('/');
  const basename = parts.at(-1);
  return parts.includes('.git') ||
    parts.includes('z_archive') ||
    parts.includes('changelog') ||
    /^changelog/i.test(basename) ||
    // This packet's own docs quote numbered paths as the "before" illustration; freezing
    // the whole packet keeps those examples meaningful.
    relativePath.startsWith(PACKET_PREFIX);
}

function walk(directory, visit) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory() && PRUNE_DIRS.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(target, entry);
      walk(target, visit);
    } else if (entry.isFile()) {
      visit(target, entry);
    }
  }
}

function findCategoryDirs(root) {
  const skillsDir = path.join(root, '.opencode/skills');
  const categories = [];
  walk(skillsDir, (target, entry) => {
    if (!entry.isDirectory()) return;
    const parent = path.basename(path.dirname(target));
    const match = entry.name.match(CATEGORY_PATTERN);
    if (!CATEGORY_KINDS.has(parent) || !match) return;
    categories.push({
      src: target,
      dst: path.join(path.dirname(target), match[2]),
      kind: parent,
      oldName: entry.name,
      newName: match[2],
    });
  });
  return categories.sort((a, b) => relative(root, a.src).localeCompare(relative(root, b.src)));
}

function checkCollisions(renames) {
  const collisions = new Map();
  const sources = new Set(renames.map(({ src }) => src));
  for (const rename of renames) {
    const key = rename.dst;
    const current = collisions.get(key) ?? [];
    current.push(rename.src);
    collisions.set(key, current);
  }
  const results = [];
  for (const [destination, sourcesForDestination] of [...collisions.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (sourcesForDestination.length > 1 || (fs.existsSync(destination) && !sources.has(destination))) {
      results.push({ destination, sources: sourcesForDestination.sort() });
    }
  }
  return results;
}

function buildReferenceMaps(renames) {
  return renames.map(({ kind, oldName, newName }) => ({
    oldPath: `${kind}/${oldName}`,
    newPath: `${kind}/${newName}`,
    oldCategory: oldName,
    newCategory: newName,
  })).sort((a, b) => b.oldPath.length - a.oldPath.length || a.oldPath.localeCompare(b.oldPath));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWithBoundary(content, oldValue, newValue) {
  const pattern = new RegExp(`(?<![A-Za-z0-9_-])${escapeRegex(oldValue)}(?![A-Za-z0-9_-])`, 'g');
  let count = 0;
  const replaced = content.replace(pattern, () => {
    count += 1;
    return newValue;
  });
  return { content: replaced, count };
}

function replaceFrontmatterCategory(content, oldValue, newValue) {
  const pattern = new RegExp(`^(category:[ \\t]*)(["']?)${escapeRegex(oldValue)}\\2[ \\t]*$`, 'gm');
  let count = 0;
  const replaced = content.replace(pattern, (_, prefix, quote) => {
    count += 1;
    return `${prefix}${quote}${newValue}${quote}`;
  });
  return { content: replaced, count };
}

function hasCategoryMarker(relativePath, content) {
  // A file can only carry a rewrite if it references one of the category-root kinds —
  // either in its own path (a leaf whose frontmatter category is the numbered folder) or
  // in its text (an index row, nav link, or router prefix). Cheap pre-filter before the
  // per-reference regex sweep.
  return relativePath.includes('feature_catalog') ||
    relativePath.includes('manual_testing_playbook') ||
    content.includes('feature_catalog') ||
    content.includes('manual_testing_playbook');
}

function findReferrerFiles(root) {
  const files = [];
  walk(root, (target, entry) => {
    if (!entry.isFile() || !ALLOWED_EXT.has(path.extname(target))) return;
    const rel = relative(root, target);
    if (isDenied(rel)) return;
    if (hasCategoryMarker(rel, fs.readFileSync(target, 'utf8'))) files.push(target);
  });
  return files.sort((a, b) => relative(root, a).localeCompare(relative(root, b)));
}

function computeReferenceEdits(root, files, references) {
  const edits = [];
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const pathEdits = [];
    const frontmatterEdits = [];
    for (const reference of references) {
      const result = replaceWithBoundary(content, reference.oldPath, reference.newPath);
      if (result.count > 0) {
        pathEdits.push({ old: reference.oldPath, new: reference.newPath, count: result.count });
        content = result.content;
      }
    }
    for (const reference of references) {
      const result = replaceFrontmatterCategory(content, reference.oldCategory, reference.newCategory);
      if (result.count > 0) {
        frontmatterEdits.push({ old: reference.oldCategory, new: reference.newCategory, count: result.count });
        content = result.content;
      }
    }
    if (pathEdits.length > 0 || frontmatterEdits.length > 0) {
      edits.push({ file, pathEdits, frontmatterEdits, content });
    }
  }
  return edits;
}

function applyRenames(root, renames) {
  for (const rename of renames) {
    execFileSync('git', ['mv', '--', rename.src, rename.dst], { cwd: root, stdio: 'inherit' });
  }
}

function applyEdits(edits) {
  for (const edit of edits) fs.writeFileSync(edit.file, edit.content, 'utf8');
}

function countFiles(edits, key) {
  return edits.filter((edit) => edit[key].length > 0).length;
}

function countOccurrences(edits, key) {
  return edits.reduce((total, edit) => total + edit[key].reduce((sum, change) => sum + change.count, 0), 0);
}

function printReport(root, renames, collisions, edits, mode) {
  const byKind = Object.fromEntries([...CATEGORY_KINDS].map((kind) => [kind, renames.filter((rename) => rename.kind === kind).length]));
  const routerStatus = ROUTER_FILES.map((router) => {
    const edit = edits.find((candidate) => relative(root, candidate.file) === router);
    return `${router}: ${edit?.pathEdits.length ? 'path rewrites' : 'no path rewrites'}`;
  });
  const samples = (items, mapper) => items.slice(0, 10).map(mapper);

  console.log(`MODE: ${mode}`);
  console.log(`ROOT: ${root}`);
  console.log(`FOLDERS TO RENAME: ${renames.length}`);
  console.log(`  feature_catalog: ${byKind.feature_catalog}`);
  console.log(`  manual_testing_playbook: ${byKind.manual_testing_playbook}`);
  console.log(`COLLISIONS: ${collisions.length}`);
  console.log(`PATH-REF FILES: ${countFiles(edits, 'pathEdits')} (${countOccurrences(edits, 'pathEdits')} replacements)`);
  console.log(`FRONTMATTER CATEGORY FILES: ${countFiles(edits, 'frontmatterEdits')} (${countOccurrences(edits, 'frontmatterEdits')} replacements)`);
  console.log('ROUTER PREFIX FILES:');
  for (const line of routerStatus) console.log(`  ${line}`);
  console.log('SAMPLE FOLDER RENAMES:');
  for (const line of samples(renames, (rename) => `  ${relative(root, rename.src)} -> ${relative(root, rename.dst)}`)) console.log(line);
  console.log('SAMPLE FILE EDITS:');
  for (const line of samples(edits, (edit) => {
    const changes = [...edit.pathEdits, ...edit.frontmatterEdits]
      .slice(0, 2)
      .map((change) => `${change.old} -> ${change.new} (${change.count})`)
      .join('; ');
    return `  ${relative(root, edit.file)}: ${changes}`;
  })) console.log(line);
  console.log('MANIFESTS: printed via deterministic report; dry-run writes no files.');
}

function main() {
  const args = parseArgs(process.argv);
  const root = path.resolve(args.dir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Repository root does not exist: ${root}`);
  if (!fs.existsSync(path.join(root, '.git'))) throw new Error(`Not a git repository root: ${root}`);

  const renames = findCategoryDirs(root);
  const collisions = checkCollisions(renames);
  const references = buildReferenceMaps(renames);
  const edits = collisions.length === 0 ? computeReferenceEdits(root, findReferrerFiles(root), references) : [];
  printReport(root, renames, collisions, edits, args.apply ? 'apply' : 'dry-run');

  if (collisions.length > 0) process.exitCode = 2;
  if (args.apply && collisions.length === 0) {
    applyEdits(edits);
    applyRenames(root, renames);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exitCode = 1;
}
