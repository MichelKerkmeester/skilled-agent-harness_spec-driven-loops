#!/usr/bin/env node
'use strict';

/*
 * Contract-to-router span generator with a drift gate.
 *
 * The command contract is the single source for which asset paths each router
 * binds. This tool derives the expected OWNED ASSETS and EXECUTION TARGETS
 * asset paths for every router from the contract and compares them against the
 * paths actually present in each router file.
 *
 * Scope is deliberately narrow: the contract carries asset PATHS and the table
 * SHAPE, but not the humanized Purpose/Mode label prose (that phrasing lives per
 * router and legitimately varies). So this tool owns path-drift detection and
 * table-shape normalization only; it never rewrites hand-authored label, mode,
 * or behavioral text. Regenerating that prose would clobber router-owned
 * routing behavior, which the router grammar keeps out of the contract.
 *
 * Topology drives what is derivable:
 *   - mode-pair          -> OWNED ASSETS (presentation+auto+confirm) and an
 *                           EXECUTION TARGETS mode table are path-checked.
 *   - direct-dispatch    -> only the presentation asset is contract-owned; the
 *                           EXECUTION TARGETS procedure is hand-authored.
 *   - subaction-manifest -> presentation + route manifest are path-checked; the
 *                           per-subaction targets are validated best-effort.
 *
 * Modes:
 *   --check  (default) read-only: report path drift and non-canonical shape.
 *   --write            normalize OWNED ASSETS / EXECUTION TARGETS table shape
 *                      and asset-path cells in place; leave label/mode prose.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = findRepoRoot(__dirname);
const CONTRACT_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/sk-doc/create-command/assets/command-contract.json'
);
const COMMANDS_DIR = path.join(REPO_ROOT, '.opencode/commands');

// A router asset path, always repo-relative and backtick-wrapped in the tables.
const ASSET_PATH_RE = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:txt|ya?ml)/g;

function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, '.opencode')) && fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fall back to walking up to the first .opencode we can see.
  dir = start;
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, '.opencode'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start;
}

function loadContract() {
  const raw = fs.readFileSync(CONTRACT_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  const families = parsed.families || parsed;
  if (!families || typeof families !== 'object') {
    throw new Error('command-contract.json has no families map');
  }
  return families;
}

// Concrete per-command discriminator baked into asset filenames.
// Every family names assets `<family>_<command>_<kind>` EXCEPT memory, whose
// direct-dispatch assets drop the family prefix (`<command>_<kind>`).
function assetDiscriminator(family, command) {
  return family === 'memory' ? command : `${family}_${command}`;
}

// Expand the single `<...>` placeholder in a contract asset-path template into a
// concrete per-command path. create's placeholder spans the whole discriminator
// (`<name>` -> `create_readme`); the other families carry a literal family
// prefix in the template so the placeholder is just the command.
function expandTemplatePath(templatePath, family, command) {
  if (!/<[^>]+>/.test(templatePath)) return templatePath;
  const base = path.basename(templatePath);
  const startsWithPlaceholder = base.startsWith('<');
  let replacement;
  if (family === 'memory') {
    replacement = command;
  } else if (startsWithPlaceholder) {
    replacement = `${family}_${command}`;
  } else {
    replacement = command;
  }
  return templatePath.replace(/<[^>]+>/, replacement);
}

// Router files for a family, from the contract's router_path (glob string or
// explicit array). Returns absolute paths that exist on disk.
function routerFiles(family, familyContract) {
  const rp = familyContract.router_path;
  const out = [];
  if (Array.isArray(rp)) {
    for (const rel of rp) {
      const abs = path.join(REPO_ROOT, rel);
      if (fs.existsSync(abs)) out.push(abs);
    }
    return out;
  }
  if (typeof rp === 'string') {
    // Only the `<family>/*.md` glob shape is used by the contract today.
    const dir = path.join(COMMANDS_DIR, family);
    if (!fs.existsSync(dir)) return out;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.md')) out.push(path.join(dir, name));
    }
    return out.sort();
  }
  return out;
}

function commandNameOf(routerAbs) {
  return path.basename(routerAbs, '.md');
}

// The set of asset paths the contract says this router owns/targets. Only the
// contract-derivable kinds per topology are included.
function expectedAssetPaths(family, familyContract, command) {
  const paths = new Set();
  const owned = Array.isArray(familyContract.owned_assets) ? familyContract.owned_assets : [];
  for (const asset of owned) {
    if (!asset || typeof asset.path !== 'string') continue;
    // Skip assets owned by another skill, directory markers, and scripts — those
    // are not router-table asset-path cells.
    if (/owned by system-spec-kit|per-route target|generated|fallback/i.test(asset.purpose || '')) continue;
    if (asset.purpose === 'script') continue;
    if (asset.path.endsWith('/')) continue;
    // Directory-valued "other" assets (compiled/, legacy/) are family-level, not
    // per-command table cells.
    if (!/\.(?:txt|ya?ml)$/.test(asset.path)) continue;
    // A per-router asset carries a per-command placeholder in its template. A
    // placeholder-free path (e.g. a family-wide route manifest) is owned at the
    // family level and is not expected in every router's tables.
    if (!/<[^>]+>/.test(asset.path)) continue;
    const concrete = expandTemplatePath(asset.path, family, command);
    if (/<[^>]+>/.test(concrete)) continue; // unresolved placeholder -> not per-command derivable
    paths.add(concrete);
  }
  return paths;
}

// Pull the body of an H2 section whose header contains the keyword.
function sectionBody(text, keyword) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s/.test(lines[i]) && lines[i].toUpperCase().includes(keyword)) {
      start = i;
      break;
    }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { start, end, body: lines.slice(start, end).join('\n'), lines };
}

// The contract does not pin the hyphen-vs-underscore convention for multi-word
// command asset stems, and the tree is currently inconsistent across families
// (that convention is owned by the repo-wide naming program). Compare on a
// separator-insensitive key so path-drift reports genuine structural mismatch,
// not a separator the contract never specified.
function normKey(p) {
  return p.replace(/[-_]/g, '_');
}

function assetPathsIn(text) {
  const found = new Set();
  if (!text) return found;
  let m;
  ASSET_PATH_RE.lastIndex = 0;
  while ((m = ASSET_PATH_RE.exec(text)) !== null) {
    found.add(m[0]);
  }
  return found;
}

// Classify the OWNED ASSETS / EXECUTION TARGETS table shape from a section body.
function tableHeader(body) {
  if (!body) return null;
  const line = body.split('\n').find((l) => /^\|.*\|/.test(l.trim()));
  if (!line) return null;
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
    .join(' | ');
}

function analyzeRouter(family, familyContract, routerAbs) {
  const command = commandNameOf(routerAbs);
  const text = fs.readFileSync(routerAbs, 'utf8');
  const rel = path.relative(REPO_ROOT, routerAbs);
  const topology = familyContract.topology;

  const expected = expectedAssetPaths(family, familyContract, command);

  const owned = sectionBody(text, 'OWNED ASSET');
  const exec = sectionBody(text, 'EXECUTION TARGET');
  const actual = new Set([
    ...assetPathsIn(owned && owned.body),
    ...assetPathsIn(exec && exec.body),
  ]);

  // Drift = a contract-expected asset path that never appears in the router's
  // OWNED ASSETS or EXECUTION TARGETS sections.
  const actualKeys = new Set([...actual].map(normKey));
  const missing = [...expected].filter((p) => !actualKeys.has(normKey(p)));

  const ownedHeader = tableHeader(owned && owned.body);
  const execHeader = tableHeader(exec && exec.body);

  const ownedShapeOk = ownedHeader === 'Purpose | Asset';
  // The mode table is only canon for mode-pair topology.
  const execShapeOk = topology === 'mode-pair' ? execHeader === 'Mode | Target' : true;

  return {
    rel,
    family,
    command,
    topology,
    expected: [...expected],
    missing,
    ownedHeader,
    execHeader,
    ownedShapeOk,
    execShapeOk,
    hasOwned: !!owned,
    hasExec: !!exec,
  };
}

function runCheck(families) {
  const rows = [];
  for (const [family, fc] of Object.entries(families)) {
    for (const routerAbs of routerFiles(family, fc)) {
      rows.push(analyzeRouter(family, fc, routerAbs));
    }
  }

  let drift = 0;
  let shape = 0;
  console.log('command-router drift check\n');
  for (const r of rows) {
    const problems = [];
    if (r.missing.length) {
      drift++;
      problems.push(`PATH-DRIFT missing=${JSON.stringify(r.missing)}`);
    }
    if (!r.ownedShapeOk) {
      shape++;
      problems.push(`OWNED-SHAPE header=${JSON.stringify(r.ownedHeader)} want="Purpose | Asset"`);
    }
    if (!r.execShapeOk) {
      shape++;
      problems.push(`EXEC-SHAPE header=${JSON.stringify(r.execHeader)} want="Mode | Target"`);
    }
    if (problems.length) {
      console.log(`  DRIFT ${r.rel} [${r.topology}]`);
      for (const p of problems) console.log(`        - ${p}`);
    }
  }

  const clean = rows.length - new Set(rows.filter((r) => r.missing.length || !r.ownedShapeOk || !r.execShapeOk).map((r) => r.rel)).size;
  console.log(`\nrouters=${rows.length} clean=${clean} path-drift=${drift} shape-drift=${shape}`);
  return drift + shape === 0 ? 0 : 1;
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

const SEP_RE = /^\s*\|[\s:|-]+\|\s*$/;

// Locate an H2 section by header keyword, hand its lines to `transform`, and
// splice the result back. `transform` returns null to decline (leave the file
// untouched), keeping the write conservative.
function rewriteSection(text, keyword, transform) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s/.test(lines[i]) && lines[i].toUpperCase().includes(keyword)) {
      start = i;
      break;
    }
  }
  if (start < 0) return text;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  const out = transform(lines.slice(start, end));
  if (!out) return text;
  return [...lines.slice(0, start), ...out, ...lines.slice(end)].join('\n');
}

// Collapse a 3-column `| Asset | Path | Purpose |` OWNED ASSETS table into the
// canonical 2-column `| Purpose | Asset |`: the label (old Asset column) becomes
// Purpose, the path (old Path column) becomes Asset. The descriptive third
// column has no home in the 2-column template and is dropped. Declines any table
// that is not exactly the 3-column shape, so already-canonical files are left as
// they are.
function reshapeOwnedTable(section) {
  const idx = section.findIndex((l) => /^\s*\|/.test(l));
  if (idx < 0) return null;
  const header = splitRow(section[idx]);
  if (header.length !== 3) return null;
  if (!/^asset$/i.test(header[0]) || !/^path$/i.test(header[1]) || !/^purpose$/i.test(header[2])) {
    return null;
  }
  if (!(idx + 1 < section.length && SEP_RE.test(section[idx + 1]))) return null;
  const out = section.slice(0, idx);
  out.push('| Purpose | Asset |');
  out.push('|---------|-------|');
  let j = idx + 2;
  for (; j < section.length; j++) {
    if (!/^\s*\|/.test(section[j])) break;
    const cells = splitRow(section[j]);
    if (cells.length < 2) break;
    out.push(`| ${cells[0]} | ${cells[1]} |`);
  }
  out.push(...section.slice(j));
  return out;
}

// Flip the EXECUTION TARGETS table header word from `Workflow` to the canonical
// `Target`. Only the header line carries both `Mode` and `Workflow`; mode and
// target cells (including any command-specific extra rows) are left untouched.
function flipExecHeader(section) {
  const idx = section.findIndex((l) => /^\s*\|.*\bMode\b.*\bWorkflow\b/i.test(l));
  if (idx < 0) return null;
  const out = section.slice();
  out[idx] = out[idx].replace(/Workflow/, 'Target');
  return out;
}

function runWrite(families) {
  const changed = [];
  for (const [family, fc] of Object.entries(families)) {
    for (const routerAbs of routerFiles(family, fc)) {
      const before = fs.readFileSync(routerAbs, 'utf8');
      let after = rewriteSection(before, 'OWNED ASSET', reshapeOwnedTable);
      if (fc.topology === 'mode-pair') {
        after = rewriteSection(after, 'EXECUTION TARGET', flipExecHeader);
      }
      if (after !== before) {
        fs.writeFileSync(routerAbs, after);
        changed.push(path.relative(REPO_ROOT, routerAbs));
      }
    }
  }
  console.log(`command-router normalize: ${changed.length} file(s) rewritten`);
  for (const f of changed) console.log(`  wrote ${f}`);
  return 0;
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const families = loadContract();
  if (write) {
    process.exit(runWrite(families));
  }
  process.exit(runCheck(families));
}

main();
