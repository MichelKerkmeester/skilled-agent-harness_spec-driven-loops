#!/usr/bin/env node
// ╔═════════════════════════════════════════════════════════════════════════╗
// ║ Refero style-library extractor                                          ║
// ╚═════════════════════════════════════════════════════════════════════════╝
//
// Enumerates styles.refero.design's sitemap, then for each /style/<uuid> page
// captures the four published tabs (DESIGN.md, Tailwind v4, CSS Variables,
// Design Tokens) in their Extended variant, verbatim, and writes one folder
// per style: the four tabs + a canonical provenance JSON + a source.md that
// links back to the original Refero style page.
//
// The tabs are client-rendered, so they are read from a real Chrome via the
// Chrome DevTools MCP server (chrome-devtools-mcp, spawned directly over stdio).
// The per-style canonical provenance JSON is parsed from the same page's
// embedded flight data over a plain HTTPS GET. Both use a real-browser
// User-Agent because the site's robots.txt bans AI-crawler agents; the operator
// authorized a throttled capture of these public pages and /api/ is never touched.
//
// Idempotent + resumable: a lastmod-keyed manifest skips styles already captured
// from an unchanged page. Throttled: one page at a time with a polite delay.
//
// Usage:
//   node extract-refero.mjs --limit 50          # capture up to 50 not-yet-done styles
//   node extract-refero.mjs --only <uuid>       # capture one style
//   node extract-refero.mjs --self-test         # re-capture cursor and diff vs styles/cursor/
//   node extract-refero.mjs --enumerate-only    # refresh the manifest from the sitemap, capture nothing
//   node extract-refero.mjs --normalize         # migrate existing folders to the current shape
//   flags: --delay-ms 2000  --page-timeout-ms 60000  --dry-run

import { spawn } from 'node:child_process';
import { get } from 'node:https';
import { mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const STYLES_DIR = resolve(HERE, '..');                 // .../sk-design/styles
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..');
const MANIFEST = join(STYLES_DIR, '_manifest.json');
const SITEMAP = 'https://styles.refero.design/sitemaps/styles.xml';
const STYLE_URL = (uuid) => `https://styles.refero.design/style/${uuid}`;
const CURSOR_UUID = '4e3b4717-84c8-4599-baaf-a343c3d619b6';
// A genuine desktop-Chrome UA: the DOM capture drives real Chrome, and the
// provenance GET must present the same non-crawler identity to see the page.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const TABS = [
  ['DESIGN.md', 'DESIGN.md'],
  ['tailwind-v4.css', 'Tailwind v4'],
  ['css-variables.css', 'CSS Variables'],
  ['design-tokens.json', 'Design Tokens'],
];

// ───────────────────────────────────────────────────────────────────────────
// 2. CLI
// ───────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = { delayMs: 2000, pageTimeoutMs: 60000 };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--limit') a.limit = Number(argv[++i]);
    else if (t === '--only') a.only = argv[++i];
    else if (t === '--delay-ms') a.delayMs = Number(argv[++i]);
    else if (t === '--page-timeout-ms') a.pageTimeoutMs = Number(argv[++i]);
    else if (t === '--self-test') a.selfTest = true;
    else if (t === '--enumerate-only') a.enumerateOnly = true;
    else if (t === '--normalize') a.normalize = true;
    else if (t === '--dry-run') a.dryRun = true;
    else throw new Error(`unknown flag: ${t}`);
  }
  return a;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────────────────────────────────────────────────────────────────────────
// 3. HTTPS GET
// ───────────────────────────────────────────────────────────────────────────
function fetchText(url, redirects = 0) {
  return new Promise((resolvePromise, reject) => {
    get(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml' } }, (res) => {
      const { statusCode, headers } = res;
      if ([301, 302, 307, 308].includes(statusCode) && headers.location && redirects < 3) {
        res.resume();
        return fetchText(new URL(headers.location, url).toString(), redirects + 1).then(resolvePromise, reject);
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => resolvePromise({ status: statusCode, body }));
    }).on('error', reject);
  });
}

// ───────────────────────────────────────────────────────────────────────────
// 4. SITEMAP ENUMERATION
// ───────────────────────────────────────────────────────────────────────────
async function enumerate() {
  const { status, body } = await fetchText(SITEMAP);
  if (status !== 200) throw new Error(`sitemap fetch ${status}`);
  const rows = [];
  const re = /<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g;
  let m;
  while ((m = re.exec(body))) {
    const um = m[1].match(/\/style\/([0-9a-f-]+)/);
    if (um) rows.push({ uuid: um[1], url: m[1], lastmod: m[2] || null });
  }
  // De-dupe by uuid, keep first.
  const seen = new Set();
  return rows.filter((r) => (seen.has(r.uuid) ? false : seen.add(r.uuid)));
}

// ───────────────────────────────────────────────────────────────────────────
// 5. EMBEDDED FLIGHT-DATA (CANONICAL) PARSE
// ───────────────────────────────────────────────────────────────────────────
function parseCanonical(html, uuid, url) {
  const chunks = [...html.matchAll(/self\.__next_f\.push\(\[\d+,\s*("[\s\S]*?")\]\)/g)].map((mm) => {
    try { return JSON.parse(mm[1]); } catch { return ''; }
  });
  const blob = chunks.join('');

  // The Agent Prompt Guide is a large flight text row referenced as "$NN".
  let agentGuide = '';
  const am = blob.match(/\d+:T[0-9a-f]+,([\s\S]*?)\d+:\["\$","main"/);
  if (am) agentGuide = am[1].trim();

  // Brace-match the first "result":{ … } object (string-aware).
  let resultObj = null;
  const ri = blob.indexOf('"result":');
  if (ri >= 0) {
    const j = blob.indexOf('{', ri);
    let depth = 0, instr = false, esc = false, end = -1;
    for (let k = j; k < blob.length; k++) {
      const ch = blob[k];
      if (instr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') instr = false; }
      else if (ch === '"') instr = true;
      else if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = k + 1; break; } }
    }
    if (end > 0) { try { resultObj = JSON.parse(blob.slice(j, end)); } catch { /* keep null */ } }
  }

  const ds = resultObj?.designSystem;
  if (ds && agentGuide && Array.isArray(ds.customSections)) {
    for (const cs of ds.customSections) if (cs && cs.content === '$19') cs.content = agentGuide;
  }
  const siteName = resultObj?.meta?.siteName || null;
  const canonical = resultObj
    ? {
        source: url, uuid, name: siteName,
        northStar: ds?.northStar ?? null,
        capturedAt: new Date().toISOString(),
        meta: resultObj.meta ?? null,
        designSystem: ds ?? null,
        raw: resultObj.raw ?? null,
        screenshot: resultObj.screenshot ?? null,
        agentPromptGuide: agentGuide || null,
      }
    : { source: url, uuid, name: null, parseError: 'flight result object not found', capturedAt: new Date().toISOString() };
  return { canonical, siteName, northStar: ds?.northStar ?? null };
}

// ───────────────────────────────────────────────────────────────────────────
// 6. CHROME-DEVTOOLS-MCP CLIENT
// ───────────────────────────────────────────────────────────────────────────
function startChrome() {
  const child = spawn('npx', ['chrome-devtools-mcp@0.26.0', '--isolated=true'], {
    cwd: REPO_ROOT, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env },
  });
  child.stderr.on('data', () => {}); // server logs to stderr; ignore
  let buf = '';
  const pending = new Map();
  child.stdout.on('data', (d) => {
    buf += d.toString();
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl); buf = buf.slice(nl + 1);
      if (!line.trim()) continue;
      let msg; try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id !== undefined && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    }
  });
  let nextId = 1;
  const rpc = (method, params, timeoutMs) => new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, res);
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error(`timeout: ${method}`)); } }, timeoutMs);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  return { child, rpc, notify, opened: false, close: () => child.kill() };
}

async function callTool(cx, name, args, timeoutMs) {
  const resp = await cx.rpc('tools/call', { name, arguments: args }, timeoutMs);
  if (resp.error) throw new Error(`${name}: ${resp.error.message || JSON.stringify(resp.error)}`);
  const parts = resp.result?.content || [];
  return parts.map((p) => p.text || '').join('\n');
}

// A single in-page async script: click through all 4 tabs (Extended variant),
// read each rendered <pre>, and grab the h1 title — one evaluate_script per style.
const CAPTURE_FN = `async () => {
  const b = t => [...document.querySelectorAll('button')].find(x => x.textContent.trim() === t);
  const tabs = ['DESIGN.md', 'Tailwind v4', 'CSS Variables', 'Design Tokens'];
  const out = {};
  for (const label of tabs) {
    const tb = b(label);
    if (!tb) { out[label + '::Extended'] = { error: 'no tab' }; continue; }
    tb.click(); await new Promise(r => setTimeout(r, 650));
    const vb = b('Extended'); if (vb) { vb.click(); await new Promise(r => setTimeout(r, 650)); }
    const pre = document.querySelector('pre');
    out[label + '::Extended'] = { len: pre ? pre.innerText.length : 0, text: pre ? pre.innerText : '' };
  }
  out.__title = (document.querySelector('h1')?.textContent || '').trim();
  return out;
}`;

// evaluate_script returns "…returned:\n```json\n{…}\n```" (or raw JSON) in content text.
function unwrapEval(text) {
  if (typeof text !== 'object' && typeof text !== 'string') return null;
  if (typeof text === 'object') return text;
  const mm = text.match(/```json\s*\n([\s\S]*?)\n```/);
  const body = mm ? mm[1] : text;
  try { return JSON.parse(body); } catch { return null; }
}

async function captureTabs(cx, url, pageTimeoutMs) {
  // Reuse one page across the run: create it once, then navigate for each style.
  if (!cx.opened) {
    await callTool(cx, 'new_page', { url }, 45000);
    cx.opened = true;
  } else {
    await callTool(cx, 'navigate_page', { url }, 45000);
  }
  await callTool(cx, 'wait_for', { text: 'Design Tokens', timeout: 25000 }, 40000);
  const raw = await callTool(cx, 'evaluate_script', { function: CAPTURE_FN }, pageTimeoutMs);
  const obj = unwrapEval(raw);
  if (!obj) throw new Error('capture returned unparseable payload');
  return obj;
}

// ───────────────────────────────────────────────────────────────────────────
// 7. SLUG + FOLDER WRITING
// ───────────────────────────────────────────────────────────────────────────
function slugify(name, uuid) {
  const base = String(name || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || `style-${uuid.slice(0, 8)}`;
}

async function resolveSlug(name, uuid, manifest) {
  let slug = slugify(name, uuid);
  const owner = manifest.find((r) => r.slug === slug && r.uuid !== uuid);
  const dir = join(STYLES_DIR, slug);
  if ((owner || existsSync(dir)) && slug !== `style-${uuid.slice(0, 8)}`) {
    // Only disambiguate when a DIFFERENT style already claims this slug.
    const claimedByOther = owner || !(await isDirForUuid(dir, uuid));
    if (claimedByOther) slug = `${slug}-${uuid.slice(0, 8)}`;
  }
  return slug;
}

async function isDirForUuid(dir, uuid) {
  try {
    const c = JSON.parse(await readFile(join(dir, `${dir.split('/').pop()}-canonical.json`), 'utf8'));
    return c.uuid === uuid;
  } catch { return false; }
}

// source.md — the folder's provenance pointer: a live link back to the Refero
// style page plus the original site and preview, so a style is always traceable.
function buildSourceMd(slug, canonical, meta) {
  const site = canonical?.meta?.url || null;
  const shot = canonical?.screenshot?.url || canonical?.screenshot?.thumbnail || null;
  return [
    `# ${meta.name || slug} — source`,
    '',
    'Extracted design style for the sk-design token library.',
    '',
    `- **Refero style:** [${meta.url}](${meta.url})`,
    site ? `- **Original site:** [${site}](${site})` : null,
    meta.northStar ? `- **North star:** *"${meta.northStar}"*` : null,
    shot ? `- **Preview screenshot:** [image](${shot})` : null,
    `- **Style UUID:** \`${meta.uuid}\``,
    `- **Captured:** ${meta.capturedAt}`,
    '',
    `Files: \`DESIGN.md\` · \`css-variables.css\` · \`tailwind-v4.css\` · \`design-tokens.json\` · \`${slug}-canonical.json\``,
    '',
  ].filter((l) => l !== null).join('\n');
}

async function writeStyle(slug, tabsByLabel, canonical, meta, dryRun) {
  const dir = join(STYLES_DIR, slug);
  if (dryRun) return dir;
  await mkdir(dir, { recursive: true });
  for (const [file, label] of TABS) {
    const ext = tabsByLabel[`${label}::Extended`];
    if (!ext || !ext.text) throw new Error(`empty Extended capture for ${label}`);
    await writeFile(join(dir, file), ext.text.endsWith('\n') ? ext.text : ext.text + '\n');
  }
  await writeFile(join(dir, `${slug}-canonical.json`), JSON.stringify(canonical, null, 2) + '\n');
  await writeFile(join(dir, 'source.md'), buildSourceMd(slug, canonical, meta));
  return dir;
}

// ───────────────────────────────────────────────────────────────────────────
// 8. MANIFEST
// ───────────────────────────────────────────────────────────────────────────
async function loadManifest() { try { return JSON.parse(await readFile(MANIFEST, 'utf8')); } catch { return []; } }
async function saveManifest(rows) { await writeFile(MANIFEST, JSON.stringify(rows, null, 2) + '\n'); }

// ───────────────────────────────────────────────────────────────────────────
// 9. CAPTURE ONE STYLE
// ───────────────────────────────────────────────────────────────────────────
async function captureOne(cx, row, manifest, args) {
  const { status, body } = await fetchText(row.url);
  if (status !== 200) throw new Error(`page GET ${status}`);
  const { canonical, siteName, northStar } = parseCanonical(body, row.uuid, row.url);

  const raw = await captureTabs(cx, row.url, args.pageTimeoutMs);
  const name = siteName || (typeof raw.__title === 'string' ? raw.__title : null) || null;
  const slug = args.selfTest ? '__selftest' : await resolveSlug(name, row.uuid, manifest);
  const meta = { name, url: row.url, uuid: row.uuid, northStar, capturedAt: new Date().toISOString() };

  if (args.selfTest) return { raw, canonical, meta, name };
  const dir = await writeStyle(slug, raw, canonical, meta, args.dryRun);
  return { slug, dir, name, meta };
}

// ───────────────────────────────────────────────────────────────────────────
// 10. SELF-TEST
// ───────────────────────────────────────────────────────────────────────────
async function selfTest(cx, args) {
  const tmp = join(STYLES_DIR, '__selftest');
  await rm(tmp, { recursive: true, force: true });
  const row = { uuid: CURSOR_UUID, url: STYLE_URL(CURSOR_UUID), lastmod: null };
  // selfTest:true captures WITHOUT writing, so the committed cursor/ is never touched.
  const { raw, canonical, meta } = await captureOne(cx, row, [], { ...args, selfTest: true });
  await writeStyle('__selftest', raw, canonical, meta, false);
  const cmp = [];
  for (const [file] of TABS) {
    const got = await readFile(join(tmp, file), 'utf8').catch(() => '');
    const ref = await readFile(join(STYLES_DIR, 'cursor', file), 'utf8').catch(() => '');
    // design-tokens.json carries a per-extraction extractedAt in the SITE export; compare structurally-insensitive length + head.
    const norm = (s) => s.replace(/"extractedAt"\s*:\s*"[^"]*"/g, '"extractedAt":"X"').trim();
    cmp.push({ file, match: norm(got) === norm(ref), gotLen: got.length, refLen: ref.length });
  }
  await rm(tmp, { recursive: true, force: true });
  return cmp;
}

// Migrate already-captured folders to the current shape: write source.md from
// the folder's canonical JSON, and remove the retired compact/ dir and README.md.
async function normalizeExisting() {
  const entries = await readdir(STYLES_DIR, { withFileTypes: true });
  let n = 0;
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('_') || e.name.startsWith('.')) continue;
    const dir = join(STYLES_DIR, e.name);
    let canonical;
    try { canonical = JSON.parse(await readFile(join(dir, `${e.name}-canonical.json`), 'utf8')); } catch { continue; }
    const url = canonical.source || STYLE_URL(canonical.uuid || '');
    const uuid = canonical.uuid || (String(url).match(/\/style\/([0-9a-f-]+)/)?.[1] || '');
    const meta = { name: canonical.name, url, uuid, northStar: canonical.northStar, capturedAt: canonical.capturedAt || 'unknown' };
    await writeFile(join(dir, 'source.md'), buildSourceMd(e.name, canonical, meta));
    await rm(join(dir, 'compact'), { recursive: true, force: true });
    await rm(join(dir, 'README.md'), { force: true });
    n++;
  }
  return n;
}

// ───────────────────────────────────────────────────────────────────────────
// 11. MAIN
// ───────────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.normalize) {
    const n = await normalizeExisting();
    console.log(`[refero] normalized ${n} folders (source.md written; compact/ + README.md removed)`);
    return;
  }
  console.log('[refero] enumerating sitemap…');
  const site = await enumerate();
  console.log(`[refero] sitemap: ${site.length} styles`);

  let manifest = await loadManifest();
  const byUuid = new Map(manifest.map((r) => [r.uuid, r]));
  for (const s of site) {
    const ex = byUuid.get(s.uuid);
    if (!ex) { const row = { ...s, slug: null, status: 'pending', capturedAt: null, error: null }; manifest.push(row); byUuid.set(s.uuid, row); }
    else { ex.url = s.url; if (ex.lastmod !== s.lastmod) { ex.lastmod = s.lastmod; if (ex.status === 'captured') ex.status = 'stale'; } }
  }
  await saveManifest(manifest);
  if (args.enumerateOnly) { console.log('[refero] enumerate-only: manifest refreshed.'); return; }

  const cx = startChrome();
  await cx.rpc('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'refero-harness', version: '1' } }, 120000);
  cx.notify('notifications/initialized', {});

  try {
    if (args.selfTest) {
      console.log('[refero] self-test: recapturing cursor…');
      const cmp = await selfTest(cx, args);
      for (const c of cmp) console.log(`  ${c.match ? 'MATCH' : 'DIFF '} ${c.file}  got=${c.gotLen} ref=${c.refLen}`);
      const ok = cmp.every((c) => c.match);
      console.log(`[refero] self-test ${ok ? 'PASS' : 'FAIL'}`);
      process.exitCode = ok ? 0 : 1;
      return;
    }

    let todo = manifest.filter((r) => r.status === 'pending' || r.status === 'stale' || r.status === 'error');
    if (args.only) todo = manifest.filter((r) => r.uuid === args.only || r.slug === args.only);
    if (args.limit) todo = todo.slice(0, args.limit);
    console.log(`[refero] to capture: ${todo.length}${args.dryRun ? ' (dry-run)' : ''}`);

    let ok = 0, err = 0;
    for (const row of todo) {
      const t0 = Date.now();
      try {
        const { slug, name } = await captureOne(cx, row, manifest, args);
        row.slug = slug; row.status = 'captured'; row.capturedAt = new Date().toISOString(); row.error = null;
        ok++;
        console.log(`  [${ok + err}/${todo.length}] captured ${slug} (${name || '?'}) ${Date.now() - t0}ms`);
      } catch (e) {
        row.status = 'error'; row.error = String(e.message || e).slice(0, 200);
        err++;
        console.log(`  [${ok + err}/${todo.length}] ERROR ${row.uuid}: ${row.error}`);
      }
      if (!args.dryRun) await saveManifest(manifest);
      await sleep(args.delayMs); // polite throttle
    }
    console.log(`[refero] done: ${ok} captured, ${err} errors`);
    process.exitCode = err > 0 && ok === 0 ? 1 : 0;
  } finally {
    cx.close();
  }
}

// Force a clean exit: the chrome-devtools-mcp child's stdio pipes otherwise keep
// the event loop alive after work is done, hanging the process at completion.
main()
  .then(() => process.exit(process.exitCode || 0))
  .catch((e) => { console.error('[refero] fatal:', e); process.exit(1); });
