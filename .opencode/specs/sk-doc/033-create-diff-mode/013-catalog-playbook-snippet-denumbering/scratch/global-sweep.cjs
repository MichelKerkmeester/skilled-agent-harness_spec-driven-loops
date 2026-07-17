// Global reference sweep: rewrite numbered-snippet references repo-wide using the
// accumulated rename map. Reference-rewrite ONLY (no renames). Replaces a token only
// when its basename is a known OLD basename in the map -> the NEW basename.
//
// Usage: node global-sweep.cjs --map-dir <manifests-root> --root <sweep-root> [--apply] [--manifest <out.json>] [--exclude <substr>]...
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = { mapDir: null, root: null, apply: false, manifest: null, exclude: [] };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--map-dir') a.mapDir = argv[++i];
    else if (k === '--root') a.root = argv[++i];
    else if (k === '--apply') a.apply = true;
    else if (k === '--manifest') a.manifest = argv[++i];
    else if (k === '--exclude') a.exclude.push(argv[++i]);
  }
  return a;
}

// Collision files were renamed manually (not via the tool) -> add them to the map.
const COLLISION_OVERRIDES = {
  '219-session-capturing-pipeline-quality.md': 'session-capturing-pipeline-quality.md',
  '235-session-capturing-pipeline-quality.md': 'session-capturing-pipeline-quality-coverage.md',
  '243-template-compliance-contract-enforcement.md': 'template-compliance-contract-enforcement-produces-compliant.md',
  '250-template-compliance-contract-enforcement.md': 'template-compliance-contract-enforcement-blocks-non-compliant.md',
};

function loadMap(mapDir) {
  const map = {};
  const conflicts = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'rename-manifest.json') {
        const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
        for (const r of arr) {
          const ob = path.basename(r.src), nb = path.basename(r.dst);
          if (map[ob] && map[ob] !== nb) conflicts.push(ob + ': ' + map[ob] + ' vs ' + nb);
          map[ob] = nb;
        }
      }
    }
  };
  walk(mapDir);
  for (const [ob, nb] of Object.entries(COLLISION_OVERRIDES)) {
    if (map[ob] && map[ob] !== nb) conflicts.push(ob + ': ' + map[ob] + ' vs ' + nb);
    map[ob] = nb;
  }
  return { map, conflicts };
}

function collectFiles(root, exclude) {
  const out = [];
  const walk = (d) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (exclude.some((x) => p.includes(x))) continue;
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && p.endsWith('.md')) out.push(p);
    }
  };
  walk(root);
  return out;
}

// Match a numbered-snippet basename token in a path/link context.
// Boundary before (not alnum) so Feature IDs / mid-word never match; .md followed by a boundary.
const TOKEN = /(?<![A-Za-z0-9])([0-9]+-[^\s/)"'\]>#]+\.md)(?![A-Za-z0-9])/g;

function rewrite(content, map) {
  let count = 0;
  const next = content.replace(TOKEN, (m, base) => {
    if (Object.prototype.hasOwnProperty.call(map, base)) { count++; return map[base]; }
    return m;
  });
  return { content: next, count };
}

function main() {
  const a = parseArgs(process.argv);
  if (!a.mapDir || !a.root) { console.error('Usage: --map-dir <dir> --root <dir> [--apply] [--manifest out] [--exclude s]...'); process.exit(1); }
  const { map, conflicts } = loadMap(a.mapDir);
  if (conflicts.length) { console.error('MAP CONFLICTS:\n' + conflicts.join('\n')); }
  const files = collectFiles(a.root, a.exclude);
  const edits = [];
  let totalEdits = 0;
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const r = rewrite(content, map);
    if (r.count > 0) {
      edits.push({ file: f, count: r.count });
      totalEdits += r.count;
      if (a.apply) fs.writeFileSync(f, r.content);
    }
  }
  if (a.manifest) fs.writeFileSync(a.manifest, JSON.stringify({ mapSize: Object.keys(map).length, conflicts, filesChanged: edits.length, totalEdits, edits }, null, 2));
  console.log('MAP=' + Object.keys(map).length + ' SCANNED=' + files.length + ' FILES_CHANGED=' + edits.length + ' EDITS=' + totalEdits + ' MODE=' + (a.apply ? 'apply' : 'dry-run') + ' CONFLICTS=' + conflicts.length);
}
main();
