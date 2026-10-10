#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Documentation Claim Checker
// ───────────────────────────────────────────────────────────────────
'use strict';

// A rename or restructure updates the routers and manifests, which the other guards read,
// and leaves behind the prose that cites them. This guard reads that prose: path references
// and their anchors must resolve, retired packet names must be gone, the surface count must
// match the hub, and the ROUTER.md load-tier claims must match the machine map. It reports
// and never rewrites.
// Run: node verify_doc_claims.cjs [--root <hub dir>] [--checks paths,names,surfaces,tiers]

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HUB = path.resolve(__dirname, '..', '..', '..');
const HUB_PREFIX = '.skilled/skills/sk-code/';
// Changelogs record history and benchmark reports record past runs, so old names stay true there.
const SKIP_DIR_NAMES = new Set(['changelog', 'node_modules']);
const SKIP_DIR_SUFFIX = 'benchmark/reports';
const PATH_EXTENSION = /\.(?:md|json|jsonc|js|cjs|mjs|ts|py|sh|yaml|yml)$/;
const PLACEHOLDER = /[*<>{}[\]$|]/;
const PACKET_RELATIVE = /^(?:references|assets|manual-testing-playbook|feature-catalog)\//;
const HUB_RELATIVE = /^(?:sk-code-[a-z0-9-]+|shared)\//;
const LINK = /\[([^\]\n]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
// The packet names before the sk- prefix; the registry keys carry the prefix. code-quality and
// code-review are also plain English, so only their quoted or key forms count as packet names.
const RETIRED_NAMES = [
  /(?<![\w./-])code-(?:webflow|opencode)(?![\w-])/g,
  /`code-(?:quality|review)`/g,
  /(?<![\w-])sk-code:code-(?:quality|review)(?![\w-])/g,
];
// The hub has three surfaces (WEBFLOW, OPENCODE, OBSIDIAN), so a claim that counts two is stale.
// A list that names two surface packets is not a count claim and is not matched.
const TWO_SURFACE_WORDING = [/\btwo (?:supported )?surfaces\b/gi, /\bboth supported surfaces\b/gi];
// A Surface-aware loading bullet that states a condition describes a load that depends on the
// route, so the files and globs it names are not every-route claims.
const CONDITIONAL_WORDING = /\b(?:when|if|unless|only|matched)\b/i;
// Lines that keep a legacy identifier on purpose. Each row names the check it exempts, the file
// relative to the hub, a substring of the allowed line and the reason. Add a row here rather than
// weakening a rule.
const ALLOWED = [
  {
    check: 'names',
    file: 'sk-code-quality/SKILL.md',
    line: 'schema_version: code-quality/v1',
    reason: 'a versioned schema id that other tools consume',
  },
  {
    check: 'names',
    file: 'sk-code-quality/SKILL.md',
    line: '<!-- Keywords:',
    reason: 'search vocabulary that keeps the old names findable',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const known = CHECKS.map((c) => c[0]);
  const usage = `usage: verify_doc_claims [--root <hub dir>] [--checks ${known.join(',')}]`;
  const rootIdx = argv.indexOf('--root');
  if (rootIdx !== -1 && !argv[rootIdx + 1]) {
    console.error(`${usage} (--root needs a directory)`);
    process.exit(2);
  }
  const hub = rootIdx !== -1 ? path.resolve(argv[rootIdx + 1]) : DEFAULT_HUB;
  // A missing hub would otherwise surface as a raw readdir stack trace from the walk.
  if (!fs.existsSync(hub) || !fs.statSync(hub).isDirectory()) {
    console.error(`${usage} (--root is not a directory: ${hub})`);
    process.exit(2);
  }
  const checksIdx = argv.indexOf('--checks');
  if (checksIdx === -1) return { hub, selected: known };
  const ids = (argv[checksIdx + 1] || '').split(',').filter(Boolean);
  const unknown = ids.filter((id) => !known.includes(id));
  if (ids.length === 0 || unknown.length) {
    console.error(`${usage} (unknown: ${unknown.join(',') || 'none given'})`);
    process.exit(2);
  }
  return { hub, selected: ids };
}

function isAllowed(check, rel, text) {
  return ALLOWED.some((a) => a.check === check && a.file === rel && text.includes(a.line));
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

// Symlinked files are skipped because each one mirrors a canonical file the walk already reads.
function collectDocs(hub) {
  const out = [];
  const stack = [hub];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = toPosix(path.relative(hub, full));
      if (entry.isDirectory()) {
        if (!SKIP_DIR_NAMES.has(entry.name) && !rel.endsWith(SKIP_DIR_SUFFIX)) stack.push(full);
      } else if (entry.isFile() && /\.(?:md|json)$/.test(entry.name)) {
        out.push({ full, rel });
      }
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

// Each line with its number and whether it sits inside a fenced code block.
function docLines(doc) {
  const lines = fs.readFileSync(doc.full, 'utf8').split(/\r?\n/);
  const isMarkdown = doc.rel.endsWith('.md');
  let fence = '';
  return lines.map((text, i) => {
    const before = fence;
    if (isMarkdown) fence = nextFence(fence, text);
    return { text, no: i + 1, fenced: isMarkdown && (before !== '' || fence !== '') };
  });
}

// A code fence closes only on the same character, at least as long and with nothing after it, so a
// four-backtick block can hold a three-backtick example and a tilde block can hold backticks.
function nextFence(open, text) {
  const m = /^\s*(`{3,}|~{3,})(.*)$/.exec(text);
  if (!m) return open;
  if (!open) return m[1];
  return m[1][0] === open[0] && m[1].length >= open.length && m[2].trim() === '' ? '' : open;
}

function packetRoot(hub, rel) {
  const first = rel.split('/')[0];
  const candidate = path.join(hub, first);
  return rel.includes('/') && fs.existsSync(candidate) && fs.statSync(candidate).isDirectory() ? candidate : hub;
}

function bases(hub, doc, ref) {
  const dir = path.dirname(doc.full);
  if (ref.startsWith(HUB_PREFIX)) return [path.join(hub, ref.slice(HUB_PREFIX.length))];
  if (/^\.\.?\//.test(ref)) return insideHub(hub, path.resolve(dir, ref)) ? [path.resolve(dir, ref)] : [];
  if (HUB_RELATIVE.test(ref)) return [path.join(hub, ref)];
  if (PACKET_RELATIVE.test(ref)) return [path.join(packetRoot(hub, doc.rel), ref), path.join(hub, ref), path.resolve(dir, ref)];
  return [];
}

// A relative path that leaves the hub points at another project, which this guard cannot see.
function insideHub(hub, resolved) {
  const rel = path.relative(hub, resolved);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function isPathCandidate(ref) {
  return ref.includes('/') && PATH_EXTENSION.test(ref) && !PLACEHOLDER.test(ref) && !/\s/.test(ref);
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  return fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort();
}

// GitHub's heading slug, the rule behind the double-dash TOC anchors validate_document.py requires:
// lowercase, keep letters, numbers, underscores, spaces and hyphens, then one hyphen per space.
function headingSlug(text) {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/(?<!\w)_([^_\s](?:[^_]*[^_\s])?)_(?!\w)/g, '$1').trim().toLowerCase()
    .replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
}

const anchorCache = new Map();

// Every anchor a Markdown file defines: one slug per heading outside fenced code, with GitHub's
// -1, -2 suffixes for repeats, plus each explicit <a id> or <a name>.
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const ids = new Set();
  const seen = new Map();
  let previous = '';
  let fence = '';
  for (const text of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const before = fence;
    fence = nextFence(fence, text);
    if (before !== '' || fence !== '') continue;
    const heading = /^ {0,3}#{1,6}\s+(.*?)(?:\s+#+)?\s*$/.exec(text)
      || (/^ {0,3}(?:=+|-+)\s*$/.test(text) && /^[\p{L}\p{N}`]/u.test(previous) ? [text, previous.trim()] : null);
    previous = text;
    if (heading) {
      const slug = headingSlug(heading[1]);
      const n = seen.get(slug) || 0;
      seen.set(slug, n + 1);
      ids.add(n === 0 ? slug : `${slug}-${n}`);
    }
    for (const m of text.matchAll(/<a\s[^>]*?\b(?:id|name)\s*=\s*["']([^"']+)["']/gi)) ids.add(m[1]);
  }
  anchorCache.set(file, ids);
  return ids;
}

function anchorMissing(file, anchor) {
  let wanted = anchor;
  try {
    wanted = decodeURIComponent(anchor);
  } catch {
    // A malformed escape is compared as written.
  }
  const ids = anchorsOf(file);
  return !ids.has(wanted) && !ids.has(wanted.toLowerCase());
}

// A path-shaped label passes when it names a real file from the doc's packet, the hub or the doc's
// folder, or when it is the tail of the in-hub target it labels, which is how a short label names a
// file in another packet. A label over an outside or external target describes what this guard
// cannot see, so it is left alone.
function labelIsStale(hub, doc, label, target) {
  const dir = path.dirname(doc.full);
  if (/^\.\.?\//.test(label)) {
    const resolved = path.resolve(dir, label);
    return insideHub(hub, resolved) && !fs.existsSync(resolved);
  }
  if (label.startsWith('.skilled/') && !label.startsWith(HUB_PREFIX)) return false;
  // An elided prefix such as .../x.md abbreviates a path this guard cannot rebuild.
  if (/^(?:\.{3}|\u2026)\//.test(label)) return false;
  if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) return false;
  const resolvedTarget = path.resolve(dir, target);
  if (!insideHub(hub, resolvedTarget)) return false;
  if (toPosix(resolvedTarget).endsWith(`/${label}`) && fs.existsSync(resolvedTarget)) return false;
  const candidates = [...bases(hub, doc, label), path.join(packetRoot(hub, doc.rel), label), path.resolve(dir, label)];
  return !candidates.some((p) => fs.existsSync(p));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHECKS
// ─────────────────────────────────────────────────────────────────────────────

// Check paths: link targets, path-shaped link labels and backticked hub paths resolve on disk.
function checkPaths(hub, docs) {
  const problems = [];
  for (const doc of docs) {
    const dir = path.dirname(doc.full);
    for (const line of docLines(doc)) {
      if (line.fenced || isAllowed('paths', doc.rel, line.text)) continue;
      const where = `${doc.rel}:${line.no}`;
      if (doc.rel.endsWith('.json')) {
        for (const m of line.text.matchAll(/"([^"\s]+)"/g)) {
          const ref = m[1];
          if (!isPathCandidate(ref) || !(ref.startsWith(HUB_PREFIX) || HUB_RELATIVE.test(ref))) continue;
          if (!bases(hub, doc, ref).some((p) => fs.existsSync(p))) problems.push(`${where}: path does not resolve: ${ref}`);
        }
        continue;
      }
      const spans = [...line.text.matchAll(/`[^`]*`/g)].map((s) => [s.index, s.index + s[0].length]);
      for (const m of line.text.matchAll(LINK)) {
        // A link written inside a code span is an example of link syntax, not a link.
        if (spans.some(([a, b]) => m.index > a && m.index < b)) continue;
        const target = m[2].split('#')[0].split('?')[0];
        const anchor = m[2].includes('#') ? m[2].slice(m[2].indexOf('#') + 1) : '';
        if (target && !/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target) && !PLACEHOLDER.test(target)
          && insideHub(hub, path.resolve(dir, target)) && !fs.existsSync(path.resolve(dir, target))) {
          problems.push(`${where}: link target does not resolve: ${target}`);
        }
        if (anchor && !PLACEHOLDER.test(anchor) && !/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) {
          const file = target ? path.resolve(dir, target) : doc.full;
          if (file.endsWith('.md') && insideHub(hub, file) && fs.existsSync(file) && anchorMissing(file, anchor)) {
            problems.push(`${where}: link anchor does not resolve: ${target}#${anchor}`);
          }
        }
        const label = m[1].replace(/`/g, '').trim();
        if (isPathCandidate(label) && label !== target && labelIsStale(hub, doc, label, target)) {
          problems.push(`${where}: link label is a path that does not resolve: ${label}`);
        }
      }
      for (const m of line.text.replace(LINK, ' ').matchAll(/`([^`]+)`/g)) {
        const [file, anchor = ''] = m[1].trim().split('#');
        const ref = file.replace(/:\d+(?:-\d+)?$/, '');
        if (!isPathCandidate(ref)) continue;
        const candidates = bases(hub, doc, ref);
        const found = candidates.find((p) => fs.existsSync(p));
        if (candidates.length && !found) problems.push(`${where}: path does not resolve: ${ref}`);
        else if (found && anchor && ref.endsWith('.md') && !PLACEHOLDER.test(anchor) && anchorMissing(found, anchor)) {
          problems.push(`${where}: anchor does not resolve: ${ref}#${anchor}`);
        }
      }
    }
  }
  return problems;
}

// Check names: no packet name from before the sk- prefix remains.
function checkNames(hub, docs) {
  const problems = [];
  for (const doc of docs) {
    for (const line of docLines(doc)) {
      if (isAllowed('names', doc.rel, line.text)) continue;
      for (const re of RETIRED_NAMES) {
        for (const m of line.text.matchAll(re)) problems.push(`${doc.rel}:${line.no}: retired packet name ${m[0]}, the packet names carry the sk- prefix`);
      }
    }
  }
  return problems;
}

// Check surfaces: no wording that counts two surfaces.
function checkSurfaces(hub, docs) {
  const problems = [];
  for (const doc of docs) {
    for (const line of docLines(doc)) {
      if (isAllowed('surfaces', doc.rel, line.text)) continue;
      for (const re of TWO_SURFACE_WORDING) {
        for (const m of line.text.matchAll(re)) problems.push(`${doc.rel}:${line.no}: two-surface wording "${m[0]}", the hub has three surfaces`);
      }
    }
  }
  return problems;
}

// Check tiers: every shared file the ROUTER.md prose says loads on every route is in DEFAULT_RESOURCE.
function checkTiers(hub) {
  const problems = [];
  const routerPath = path.join(hub, 'ROUTER.md');
  if (!fs.existsSync(routerPath)) return ['ROUTER.md not found, so the tier check would be vacuous'];
  const lines = fs.readFileSync(routerPath, 'utf8').split(/\r?\n/);
  const listMatch = /DEFAULT_RESOURCES?\s*=\s*\[([\s\S]*?)\]/.exec(lines.join('\n'));
  const loaded = new Set(listMatch ? [...listMatch[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]) : []);
  if (loaded.size === 0) problems.push('ROUTER.md declares no DEFAULT_RESOURCE list, so every tier claim is unbacked');
  const claims = [];
  const alwaysIdx = lines.findIndex((l) => /^\|\s*ALWAYS\s*\|/.test(l));
  if (alwaysIdx === -1) problems.push('ROUTER.md has no ALWAYS row in its load-tier table, so the tier check would be vacuous');
  else claims.push({ no: alwaysIdx + 1, text: lines[alwaysIdx], always: true });
  const sectionIdx = lines.findIndex((l) => /^### Surface-aware loading/.test(l));
  if (sectionIdx !== -1) {
    for (let i = sectionIdx + 1; i < lines.length && !/^#{2,3} /.test(lines[i]); i += 1) {
      if (/^- /.test(lines[i])) claims.push({ no: i + 1, text: lines[i] });
    }
  }
  for (const claim of claims) {
    if (isAllowed('tiers', 'ROUTER.md', claim.text)) continue;
    if (!claim.always && CONDITIONAL_WORDING.test(claim.text)) continue;
    for (const m of claim.text.matchAll(/`([^`]+)`/g)) {
      let ref = m[1].trim();
      if (ref.startsWith(HUB_PREFIX)) ref = ref.slice(HUB_PREFIX.length);
      if (!ref.startsWith('shared/') || /[<>{}$]/.test(ref)) continue;
      // Outside the ALWAYS row a bare folder names a scope ("never the whole folder"), so only a
      // file or a `/*` glob there claims a load.
      if (ref.endsWith('/') && !claim.always) continue;
      const files = ref.endsWith('/') || ref.endsWith('/*')
        ? listMarkdown(path.join(hub, ref.replace(/\*$/, ''))).map((n) => `${ref.replace(/\*$/, '')}${n}`)
        : [ref];
      for (const f of files) {
        if (!loaded.has(f)) problems.push(`ROUTER.md:${claim.no}: claims ${f} loads on every route, but DEFAULT_RESOURCE does not list it`);
      }
    }
  }
  return problems;
}

const CHECKS = [
  ['paths', 'path references in the hub docs resolve on disk', checkPaths],
  ['names', 'no retired packet names remain', checkNames],
  ['surfaces', 'no two-surface wording remains', checkSurfaces],
  ['tiers', 'ROUTER.md load-tier claims match DEFAULT_RESOURCE', checkTiers],
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const { hub, selected } = parseArgs(argv);
  const docs = collectDocs(hub);
  const checks = CHECKS.filter((c) => selected.includes(c[0]));
  let failed = 0;
  for (const [id, title, run] of checks) {
    const problems = docs.length === 0 ? ['walk found 0 docs, so the check would be vacuous'] : run(hub, docs);
    if (problems.length === 0) {
      console.log(`PASS check ${id}: ${title}`);
    } else {
      failed += 1;
      console.log(`FAIL check ${id}: ${title} (${problems.length} problem(s))`);
      for (const p of problems) console.log(`  - ${p}`);
    }
  }
  console.log(`doc-claims: ${checks.length - failed}/${checks.length} checks passed`);
  return failed === 0 ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));
