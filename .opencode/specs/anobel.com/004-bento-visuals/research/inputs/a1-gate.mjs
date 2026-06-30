import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { judgeText, isBannedGray, contrastRatio } from './contrast.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 560;
const H = 480;
const TOL = 2;
const VIS = { x1: 30, y1: 30, x2: 530, y2: 328 };
const TITLE = { x1: 30, y1: 356, x2: 530, y2: 456 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const round = (n) => Math.round(Number(n) * 100) / 100;
const right = (b) => b[0] + b[2];
const bottom = (b) => b[1] + b[3];
const area = (b) => Math.max(0, b[2]) * Math.max(0, b[3]);

function overlapBox(a, r) {
  const x1 = Math.max(a[0], r.x1 ?? r[0]);
  const y1 = Math.max(a[1], r.y1 ?? r[1]);
  const x2 = Math.min(right(a), r.x2 ?? right(r));
  const y2 = Math.min(bottom(a), r.y2 ?? bottom(r));
  return [round(x1), round(y1), round(x2 - x1), round(y2 - y1)];
}

function overlaps(a, r) {
  const b = overlapBox(a, r);
  return b[2] > TOL && b[3] > TOL;
}

function failedChecks(checks) {
  return Object.entries(checks).filter(([, v]) => !v.pass).map(([k]) => k);
}

function tileIdOf(file) {
  return path.basename(file, '.html').replace(/-glm(?=-|$)/g, '');
}

function parseArgs(argv) {
  const args = { arm: 'control', runId: 'baseline', primitive: null, out: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--arm') args.arm = argv[++i];
    else if (a === '--run') args.runId = argv[++i];
    else if (a === '--primitive') args.primitive = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else rest.push(a);
  }
  if (!rest[0]) throw new Error('usage: node a1-gate.mjs <tileHtmlPathOrGlobDir> [--arm control|a1_prompt|a1_gate_repair] [--run <id>] [--primitive <p>] [--out <jsonPath>]');
  return { input: rest[0], ...args };
}

async function resolveTiles(input) {
  const abs = path.resolve(input);
  const st = await fs.stat(abs);
  if (st.isDirectory()) {
    const files = await fs.readdir(abs);
    return files.filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort().map((f) => path.join(abs, f));
  }
  return [abs];
}

async function outPathFor(tile, out, many) {
  const base = `${path.basename(tile, '.html')}.gate.json`;
  if (!out) return path.join(path.dirname(tile), base);

  const abs = path.resolve(out);
  let isDir = many || !abs.endsWith('.json');
  try {
    isDir = (await fs.stat(abs)).isDirectory() || isDir;
  } catch {}
  if (isDir) {
    await fs.mkdir(abs, { recursive: true });
    return path.join(abs, base);
  }
  await fs.mkdir(path.dirname(abs), { recursive: true });
  return abs;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const port = s.address().port;
      s.close(() => resolve(port));
    });
  });
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.waiters = new Map();

    ws.addEventListener('message', (ev) => this.onMessage(ev.data));
    ws.addEventListener('close', () => this.rejectAll(new Error('CDP websocket closed')));
    ws.addEventListener('error', () => this.rejectAll(new Error('CDP websocket error')));
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      const t = setTimeout(() => reject(new Error('CDP websocket timeout')), 10_000);
      ws.addEventListener('open', () => {
        clearTimeout(t);
        resolve(new CDP(ws));
      }, { once: true });
      ws.addEventListener('error', () => {
        clearTimeout(t);
        reject(new Error('CDP websocket error'));
      }, { once: true });
    });
  }

  send(method, params = {}, timeout = 30_000) {
    const id = ++this.id;
    const msg = { id, method, params };
    this.ws.send(JSON.stringify(msg));
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timeout`));
      }, timeout);
      this.pending.set(id, { resolve, reject, t });
    });
  }

  once(method, timeout = 30_000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        const a = this.waiters.get(method) ?? [];
        this.waiters.set(method, a.filter((w) => w.resolve !== resolve));
        reject(new Error(`${method} timeout`));
      }, timeout);
      const a = this.waiters.get(method) ?? [];
      a.push({ resolve, reject, t });
      this.waiters.set(method, a);
    });
  }

  onMessage(data) {
    const msg = JSON.parse(typeof data === 'string' ? data : Buffer.from(data).toString('utf8'));

    if (msg.id) {
      const p = this.pending.get(msg.id);
      if (!p) return;
      clearTimeout(p.t);
      this.pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else p.resolve(msg.result);
      return;
    }

    const a = this.waiters.get(msg.method);
    if (!a?.length) return;
    const w = a.shift();
    clearTimeout(w.t);
    if (a.length) this.waiters.set(msg.method, a);
    else this.waiters.delete(msg.method);
    w.resolve(msg.params ?? {});
  }

  rejectAll(err) {
    for (const p of this.pending.values()) {
      clearTimeout(p.t);
      p.reject(err);
    }
    this.pending.clear();
    for (const a of this.waiters.values()) {
      for (const w of a) {
        clearTimeout(w.t);
        w.reject(err);
      }
    }
    this.waiters.clear();
  }

  close() {
    try { this.ws.close(); } catch {}
  }
}

async function launchBrowser() {
  const port = await freePort();
  const userDir = await fs.mkdtemp(path.join(os.tmpdir(), 'a1-chrome-'));
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    const deadline = Date.now() + 15_000;
    let target = null;

    while (Date.now() < deadline) {
      if (proc.exitCode != null) throw new Error(`Chrome exited with code ${proc.exitCode}`);
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const json = await res.json();
        target = json.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
        if (target) break;
      } catch {}
      await sleep(100);
    }

    if (!target) throw new Error('no Chrome page target');
    const cdp = await CDP.connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: W,
      height: H,
      deviceScaleFactor: 1,
      mobile: false,
    });

    return { cdp, proc, userDir };
  } catch (err) {
    try { proc.kill('SIGKILL'); } catch {}
    await fs.rm(userDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => {});
    throw err;
  }
}

async function closeBrowser(browser) {
  if (!browser) return;
  try { browser.cdp.close(); } catch {}
  try { browser.proc.kill('SIGKILL'); } catch {}
  await fs.rm(browser.userDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => {});
}

async function render(cdp, file) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: W,
    height: H,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const loaded = cdp.once('Page.loadEventFired', 30_000);
  const nav = await cdp.send('Page.navigate', { url: pathToFileURL(file).href });
  if (nav.errorText) throw new Error(`Page.navigate: ${nav.errorText}`);
  await loaded;

  const expression = `(${snapshotPage.toString()})()`;
  const res = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  }, 30_000);

  if (res.exceptionDetails) {
    const text = res.exceptionDetails.exception?.description || res.exceptionDetails.text || 'Runtime.evaluate failed';
    throw new Error(text);
  }
  return res.result.value;
}

async function snapshotPage() {
  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  let fontsReady = false;
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    fontsReady = true;
  } catch {}
  await raf();
  await raf();

  const W = 560;
  const H = 480;
  const allowed = new Set(['visual', 'title', 'description', 'eyebrow', 'shell-cta', 'row', 'node', 'card', 'label']);
  const visual = { x1: 30, y1: 30, x2: 530, y2: 328 };
  const title = { x1: 30, y1: 356, x2: 530, y2: 456 };
  const round = (n) => Math.round(Number(n) * 100) / 100;
  const right = (b) => b[0] + b[2];
  const bottom = (b) => b[1] + b[3];
  const area = (b) => Math.max(0, b[2]) * Math.max(0, b[3]);
  const overlaps = (b, r) => Math.min(right(b), r.x2) - Math.max(b[0], r.x1) > 2 && Math.min(bottom(b), r.y2) - Math.max(b[1], r.y1) > 2;
  const txt = (el) => Array.from(el.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  const isIconText = (s) => !/[\p{L}\p{N}]/u.test(s);

  function parseCssColor(s) {
    s = String(s || '').trim().toLowerCase();
    if (!s || s === 'none' || s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

    let m = s.match(/^#([0-9a-f]{3})$/i);
    if (m) {
      const [r, g, b] = [...m[1]].map((c) => Number.parseInt(c + c, 16));
      return { r, g, b, a: 1 };
    }

    m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const n = Number.parseInt(m[1], 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
    }

    m = s.match(/^rgba?\((.*)\)$/);
    if (!m) return { r: 0, g: 0, b: 0, a: 0 };

    const body = m[1].trim();
    const parts = body.includes(',')
      ? body.split(',').map((x) => x.trim())
      : body.replace('/', ' / ').split(/\s+/).filter(Boolean);
    const slash = parts.indexOf('/');
    const rgb = slash >= 0 ? parts.slice(0, slash) : parts.slice(0, 3);
    const alpha = slash >= 0 ? parts[slash + 1] : parts[3];
    const part = (x) => String(x || '').endsWith('%') ? Number.parseFloat(x) * 2.55 : Number.parseFloat(x);
    const a = alpha == null ? 1 : (String(alpha).endsWith('%') ? Number.parseFloat(alpha) / 100 : Number.parseFloat(alpha));
    return { r: part(rgb[0]), g: part(rgb[1]), b: part(rgb[2]), a: Math.max(0, Math.min(1, a)) };
  }

  function comp(fg, bg) {
    return {
      r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
      g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
      b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
      a: 1,
    };
  }

  function parseFontWeight(v) {
    const raw = String(v || '').trim().toLowerCase();
    if (raw === 'bold') return 700;
    if (raw === 'normal') return 400;
    return Number.parseInt(raw, 10) || 0;
  }

  function cssColors(value) {
    const matches = String(value || '').match(/rgba?\([^)]*\)|#[0-9a-f]{3,6}\b/gi) || [];
    return matches.map(parseCssColor).filter((c) => c.a > 0);
  }

  function edgeColor(value) {
    const colors = cssColors(value);
    if (!colors.length) return null;
    return colors[0].a > 0 ? colors[0] : colors[colors.length - 1];
  }

  function bgLayer(cs) {
    const image = edgeColor(cs.backgroundImage);
    if (image) return image;
    const color = parseCssColor(cs.backgroundColor);
    if (color.a > 0) return color;
    return edgeColor(cs.background);
  }

  function resolveBg(el) {
    if (!el || el.nodeType !== 1) return { r: 255, g: 255, b: 255, a: 1 };
    const layer = bgLayer(getComputedStyle(el));
    if (!layer) return resolveBg(el.parentElement);
    if (layer.a > 0.95) return { r: Math.round(layer.r), g: Math.round(layer.g), b: Math.round(layer.b), a: 1 };
    return comp(layer, resolveBg(el.parentElement));
  }

  function effectiveBg(el) {
    const out = resolveBg(el);
    return `rgb(${out.r}, ${out.g}, ${out.b})`;
  }

  function painted(cs, tag) {
    if (['IMG', 'SVG', 'CANVAS', 'VIDEO'].includes(tag)) return true;
    if (parseCssColor(cs.backgroundColor).a > 0) return true;
    const bw = ['Top', 'Right', 'Bottom', 'Left'].some((side) => Number.parseFloat(cs[`border${side}Width`]) > 0);
    const bc = parseCssColor(cs.borderColor).a > 0;
    return bw && bc;
  }

  const foundCard = document.querySelector('[data-a1-role="card"], .card');
  const instrumented = Boolean(document.querySelector('[data-a1-role]'));
  const root = foundCard || document.body || document.documentElement;
  const cr0 = foundCard?.getBoundingClientRect();
  const cr = foundCard ? cr0 : { left: 0, top: 0, width: W, height: H };
  const all = Array.from(document.querySelectorAll('body, body *'));
  const rowsCap = Number(document.documentElement.dataset.a1RowsCap || root.dataset?.a1RowsCap || 3);
  const primitive = root.dataset?.primitive || document.documentElement.dataset.primitive || document.body?.dataset?.primitive || '';

  function bbox(el) {
    const r = el.getBoundingClientRect();
    return [round(r.left - cr.left), round(r.top - cr.top), round(r.width), round(r.height)];
  }

  function roleOf(el, cs, b, own, isRoot) {
    const data = String(el.getAttribute('data-a1-role') || '').toLowerCase();
    if (allowed.has(data)) return data;
    if (isRoot) return 'card';

    const name = `${el.className || ''} ${el.id || ''} ${el.getAttribute('aria-label') || ''}`.toLowerCase();
    if (!instrumented && el.ownerSVGElement && el.tagName.toLowerCase() === 'rect' && b[2] >= 40 && b[3] >= 20) return 'card';
    if (/\b(eyebrow|badge|pill|kicker)\b/.test(name) && b[0] > 280 && b[1] < 90) return 'eyebrow';
    if (/(cta|button|action|link)/.test(name) || el.tagName === 'BUTTON' || (el.tagName === 'A' && el.href)) return 'shell-cta';
    if (/(description|desc|subtitle|subhead|body-copy|copy|dek)/.test(name)) return 'description';
    if (/(title|headline|heading|head|name)/.test(name) || /^H[1-6]$/.test(el.tagName)) return 'title';
    if (/(legend|key)/.test(name)) return 'legend';
    if (/(instrument|panel|visual|chart|graphic|illustration|viz|canvas)/.test(name)) return 'visual';
    if (/(row|item|line)/.test(name)) return 'row';
    if (/(node|dot|point|chip|marker|avatar)/.test(name)) return 'node';
    if (/(label|caption|note|small|meta|axis|tick|value)/.test(name)) return 'label';
    if (own && overlaps(b, title) && b[0] <= 360) {
      const fs = Number.parseFloat(cs.fontSize) || 0;
      const fw = parseFontWeight(cs.fontWeight);
      return fs >= 18 || fw >= 600 ? 'title' : 'description';
    }
    if (own) return 'label';
    if (/(card|tile|metric|stat)/.test(name)) return 'card';
    return 'element';
  }

  const raw = [];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const b = bbox(el);
    const isRoot = el === root || el === document.body || el === document.documentElement;
    const hidden = cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || Number.parseFloat(cs.opacity) === 0;
    if (!isRoot && (hidden || b[2] <= 0 || b[3] <= 0)) continue;

    const own = txt(el);
    const fontSize = Number.parseFloat(cs.fontSize) || 0;
    const inSvg = Boolean(el.closest('svg'));
    const svgText = !instrumented && inSvg && el.tagName.toLowerCase() === 'text';
    const readable = Boolean(own) && !el.closest('[aria-hidden="true"]') && (!inSvg || svgText) && fontSize >= 9 && !isIconText(own);
    const role = roleOf(el, cs, b, own, isRoot);
    const isPainted = painted(cs, el.tagName);

    raw.push({
      el,
      data: {
        id: raw.length,
        role,
        bbox: b,
        text: own,
        readable,
        root: isRoot,
        measurable: readable || isPainted || role !== 'element',
        painted: isPainted,
        color: cs.color,
        bg: effectiveBg(el),
        uppercase: Boolean(own) && cs.textTransform === 'uppercase',
        svgText,
        fontSize,
        fontWeight: parseFontWeight(cs.fontWeight),
        scrollWidth: el.scrollWidth || 0,
        scrollHeight: el.scrollHeight || 0,
        clientWidth: el.clientWidth || 0,
        clientHeight: el.clientHeight || 0,
        className: String(el.className || ''),
        tagName: String(el.tagName || ''),
        textOverflow: cs.textOverflow,
        whiteSpace: cs.whiteSpace,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
      },
    });
  }

  if (!raw.some((x) => x.data.role === 'visual')) {
    const candidate = raw
      .filter((x) => !x.data.root && !['title', 'description', 'shell-cta', 'eyebrow'].includes(x.data.role) && overlaps(x.data.bbox, visual) && x.data.painted)
      .sort((a, b) => area(b.data.bbox) - area(a.data.bbox))[0];
    if (candidate) {
      candidate.data.role = 'visual';
      candidate.data.measurable = true;
    }
  }

  for (const x of raw) {
    x.data.ancestors = raw.filter((y) => y !== x && y.el.contains(x.el)).map((y) => y.data.id);
  }

  return {
    fontsReady,
    primitive,
    rowsCap,
    instrumented,
    card: { bbox: [0, 0, round(cr.width || W), round(cr.height || H)] },
    elements: raw.map((x) => x.data),
  };
}

function actualTitleBlocks(elements) {
  const readable = elements.filter((e) => {
    if (e.root || !e.readable) return false;
    if (['eyebrow', 'shell-cta'].includes(e.role)) return false;
    return e.bbox[0] <= W * 0.65 && e.bbox[1] >= H * 0.5;
  });

  const title = readable
    .filter((e) => (e.fontSize || 0) >= 16 || e.role === 'title')
    .sort((a, b) => {
      const bySize = (b.fontSize || 0) - (a.fontSize || 0);
      if (bySize) return bySize;
      const byWeight = (b.fontWeight || 0) - (a.fontWeight || 0);
      if (byWeight) return byWeight;
      return a.bbox[1] - b.bbox[1];
    })[0];

  if (!title) return [];

  const titleBottom = bottom(title.bbox);
  const description = readable
    .filter((e) => e.id !== title.id)
    .filter((e) => !e.ancestors.includes(title.id) && !title.ancestors.includes(e.id))
    .filter((e) => e.bbox[1] >= titleBottom - TOL && e.bbox[1] <= titleBottom + 90)
    .filter((e) => Math.min(right(e.bbox), right(title.bbox) + 160) - Math.max(e.bbox[0], title.bbox[0] - 20) > TOL)
    .sort((a, b) => {
      const byTop = a.bbox[1] - b.bbox[1];
      if (byTop) return byTop;
      return (b.fontSize || 0) - (a.fontSize || 0);
    })[0];

  return description ? [title, description] : [title];
}

function fixedTitleBandOff(candidates) {
  const notTextBand = (e) => !['title', 'description', 'shell-cta'].includes(e.role);
  return candidates
    .filter((e) => notTextBand(e) && overlaps(e.bbox, TITLE))
    .map((e) => ({ role: e.role, bbox: e.bbox }));
}

function baselineTitleBandOff(elements, candidates) {
  const textBlocks = actualTitleBlocks(elements);
  const textIds = new Set(textBlocks.map((e) => e.id));
  if (!textBlocks.length) return [];

  return candidates
    .filter((e) => !textIds.has(e.id))
    .filter((e) => !['title', 'description', 'eyebrow', 'shell-cta'].includes(e.role))
    .filter((e) => textBlocks.some((t) => !e.ancestors.includes(t.id) && !t.ancestors.includes(e.id) && overlaps(e.bbox, t.bbox)))
    .map((e) => ({ role: e.role, bbox: e.bbox }));
}

function fixedVisualOff(candidates) {
  return candidates
    .filter((e) => !['title', 'description', 'shell-cta', 'eyebrow'].includes(e.role))
    .filter((e) => overlaps(e.bbox, VIS) && bottom(e.bbox) > VIS.y2 + TOL)
    .map((e) => ({ role: e.role, bottom: round(bottom(e.bbox)) }));
}

function nearestPanel(elements, child) {
  return elements
    .filter((e) => e.id !== child.id && child.ancestors.includes(e.id) && (e.role === 'visual' || e.root))
    .sort((a, b) => area(a.bbox) - area(b.bbox))[0];
}

function nearestClipPanel(elements, child) {
  return elements
    .filter((e) => e.id !== child.id && child.ancestors.includes(e.id) && panelClipsContent(e))
    .sort((a, b) => area(a.bbox) - area(b.bbox))[0];
}

function panelContentBottom(panel) {
  if (!panel || panel.role === 'card') return H;
  return bottom(panel.bbox);
}

function panelClipsContent(panel) {
  return hiddenOverflow(panel?.overflowX) || hiddenOverflow(panel?.overflowY);
}

function baselineVisualOff(elements, candidates) {
  return candidates
    .filter((e) => !['title', 'description', 'shell-cta', 'eyebrow'].includes(e.role))
    .filter((e) => {
      if (right(e.bbox) > W + TOL || bottom(e.bbox) > H + TOL) return true;
      if (['visual', 'node'].includes(e.role)) return false;
      if (e.role === 'row' && bottom(e.bbox) < VIS.y2 + TOL) return false;
      const panel = nearestPanel(elements, e);
      if (panel && panel.role !== 'card' && bottom(e.bbox) > panelContentBottom(panel) + TOL) return true;
      const clipPanel = nearestClipPanel(elements, e);
      return clipPanel && bottom(e.bbox) > bottom(clipPanel.bbox) + TOL * 2;
    })
    .map((e) => ({ role: e.role, bottom: round(bottom(e.bbox)) }));
}

function primitiveOf(snapshot, arg) {
  if (arg) return arg;
  const hay = `${snapshot?.primitive || ''} ${(snapshot?.elements || []).map((e) => e.className).join(' ')}`.toLowerCase();
  for (const p of ['matrix', 'timeline', 'network', 'orbit', 'radial', 'stack', 'chart', 'gauge', 'pipeline', 'grid', 'flow']) {
    if (hay.includes(p)) return p;
  }
  return 'unknown';
}

function isUppercaseLiteral(text) {
  const s = String(text || '').trim();
  if (!/\p{L}/u.test(s)) return false;
  return /\p{Lu}/u.test(s) && !/\p{Ll}/u.test(s);
}

function isTopRightEyebrow(e) {
  const name = String(e.className || '').toLowerCase();
  return /\b(eyebrow|badge|pill|kicker)\b/.test(name) && e.bbox[0] > W / 2 && e.bbox[1] < 90 + TOL;
}

function isDisallowedUppercase(e) {
  if (e.root || !e.readable) return false;
  if (!e.uppercase && !isUppercaseLiteral(e.text)) return false;

  const eyebrow = e.role === 'eyebrow' || isTopRightEyebrow(e);
  const heading = (e.role === 'title' && (e.fontSize || 0) >= 16) || /^H[1-6]$/.test(String(e.tagName || '')) || (e.fontSize || 0) >= 16;

  return eyebrow || heading;
}

function hiddenOverflow(value) {
  return ['hidden', 'clip'].includes(String(value || '').toLowerCase());
}

function hasEllipsisAffordance(e) {
  if (String(e.textOverflow || '').toLowerCase().includes('ellipsis')) return true;

  const nowrap = String(e.whiteSpace || '').toLowerCase() === 'nowrap';
  const overflowHidden = hiddenOverflow(e.overflowX) || hiddenOverflow(e.overflowY);
  const lineHeight = Math.max(e.fontSize || 0, 1) * 1.8;
  const singleLine = e.scrollHeight <= e.clientHeight + TOL || e.bbox[3] <= lineHeight;

  return nowrap && overflowHidden && singleLine && e.readable;
}

function isLenientMicroContrast(e, judged) {
  if (e.role !== 'label' || judged.ratio < 3) return false;
  if (judged.token === '#367e39') return (e.fontSize || 0) < 11.5;
  return (e.fontSize || 0) < 13.5;
}

function isOffBrandText(e, judged) {
  if (judged.token !== '#c9140f') return false;
  return /stop|sessie|delta|daling|omlaag|▼/.test(`${e.text || ''} ${e.className || ''}`.toLowerCase());
}

function score(tile, snapshot, args) {
  const elements = snapshot.elements || [];
  const candidates = elements.filter((e) => !e.root && e.measurable);
  const instrumented = Boolean(snapshot.instrumented);

  const titleBandOff = instrumented ? fixedTitleBandOff(candidates) : baselineTitleBandOff(elements, candidates);
  const visualOff = instrumented && args.runId !== 'baseline' ? fixedVisualOff(candidates) : baselineVisualOff(elements, candidates);

  const overlapCandidates = elements.filter((e) => !e.root && (e.readable || e.role === 'card' || e.role === 'node'));
  const overlapOff = [];
  for (let i = 0; i < overlapCandidates.length; i++) {
    for (let j = i + 1; j < overlapCandidates.length; j++) {
      const a = overlapCandidates[i];
      const b = overlapCandidates[j];
      if (a.ancestors.includes(b.id) || b.ancestors.includes(a.id)) continue;
      if (overlaps(a.bbox, b.bbox)) {
        const bbox = overlapBox(a.bbox, b.bbox);
        if (bbox[2] < TOL * 2 || bbox[3] < TOL * 2) continue;
        overlapOff.push({ roleA: a.role, roleB: b.role, bbox });
      }
    }
  }

  const contrastOff = elements.filter((e) => !e.root && e.readable && (instrumented || e.role !== 'eyebrow')).flatMap((e) => {
    const judged = judgeText({ color: e.color, bg: e.bg, usage: 'text', fontSize: e.fontSize, fontWeight: e.fontWeight });
    isBannedGray(judged.token);
    contrastRatio(judged.token, judged.on);
    const offBrandText = isOffBrandText(e, judged);
    return !offBrandText && (judged.pass || isLenientMicroContrast(e, judged)) ? [] : [{ role: e.role, token: judged.token, on: judged.on, ratio: judged.ratio, usage: judged.usage }];
  });

  const uppercaseOff = elements.filter(isDisallowedUppercase).map((e) => ({
    role: e.role,
    text: String(e.text || '').slice(0, 24),
    fontSize: e.fontSize,
    bbox: e.bbox,
  }));

  const clipOff = elements.filter((e) => !e.root).filter((e) => {
    const out = e.bbox[0] < -TOL || e.bbox[1] < -TOL || right(e.bbox) > W + TOL || bottom(e.bbox) > H + TOL;
    if (out) return true;
    const clipsText = hiddenOverflow(e.overflowX) || hiddenOverflow(e.overflowY);
    const clippedSize = e.readable && clipsText && (e.scrollWidth > e.clientWidth + TOL || e.scrollHeight > e.clientHeight + TOL);
    return clippedSize && !hasEllipsisAffordance(e);
  }).map((e) => ({ role: e.role, bbox: e.bbox }));

  const visualElems = candidates.filter((e) => overlaps(e.bbox, VIS));
  const visualBottomMax = visualElems.length ? round(Math.max(...visualElems.map((e) => bottom(e.bbox)))) : 0;
  const rowsRendered = elements.filter((e) => !e.root && e.role === 'row').length;
  const denseLowerZoneOff = rowsRendered > (snapshot.rowsCap ?? 3) && visualBottomMax > 400 + TOL && visualBottomMax < H - 40
    ? [{ role: 'visual', bottom: visualBottomMax }]
    : [];
  const visualPanelOffenders = [...visualOff, ...denseLowerZoneOff];

  const checks = {
    titleBandIntrusion: { pass: titleBandOff.length === 0, offenders: titleBandOff },
    visualPanelOverflow: { pass: visualPanelOffenders.length === 0, offenders: visualPanelOffenders },
    bboxOverlap: { pass: overlapOff.length === 0, offenders: overlapOff },
    bannedContrast: { pass: contrastOff.length === 0, offenders: contrastOff },
    uppercase: { pass: uppercaseOff.length === 0, count: uppercaseOff.length, offenders: uppercaseOff },
    clipping: { pass: clipOff.length === 0, offenders: clipOff },
  };

  return {
    tileId: tileIdOf(tile),
    arm: args.arm,
    runId: args.runId,
    primitive: primitiveOf(snapshot, args.primitive),
    pass: Object.values(checks).every((c) => c.pass),
    checks,
    overflowSummary: { visualBottomMax, rowsRendered, rowsCap: snapshot.rowsCap ?? 3 },
    repair: { fired: false, attempt: 0, regated: null, convertedToPass: null },
    tolerancePx: TOL,
    fontsReady: Boolean(snapshot.fontsReady),
    schemaVersion: '1.0',
  };
}

function errorResult(tile, err, args) {
  const checks = {
    titleBandIntrusion: { pass: false, offenders: [] },
    visualPanelOverflow: { pass: false, offenders: [] },
    bboxOverlap: { pass: false, offenders: [] },
    bannedContrast: { pass: false, offenders: [] },
    uppercase: { pass: false, count: 0, offenders: [] },
    clipping: { pass: false, offenders: [] },
  };

  return {
    tileId: tileIdOf(tile),
    arm: args.arm,
    runId: args.runId,
    primitive: args.primitive || 'unknown',
    pass: false,
    checks,
    overflowSummary: { visualBottomMax: 0, rowsRendered: 0, rowsCap: 3 },
    repair: { fired: false, attempt: 0, regated: null, convertedToPass: null },
    tolerancePx: TOL,
    fontsReady: false,
    schemaVersion: '1.0',
    error: err?.stack || err?.message || String(err),
  };
}

async function writeResult(tile, result, args, many) {
  const out = await outPathFor(tile, args.out, many);
  await fs.writeFile(out, `${JSON.stringify(result, null, 2)}\n`);
  const fails = failedChecks(result.checks);
  console.log(`${result.pass ? 'PASS' : 'FAIL'} ${result.tileId} [${fails.join(',')}]`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tiles = await resolveTiles(args.input);
  let browser = null;

  try {
    browser = await launchBrowser();
    for (const tile of tiles) {
      try {
        const snap = await render(browser.cdp, tile);
        await writeResult(tile, score(tile, snap, args), args, tiles.length > 1);
      } catch (err) {
        await writeResult(tile, errorResult(tile, err, args), args, tiles.length > 1);
      }
    }
  } catch (err) {
    for (const tile of tiles) {
      await writeResult(tile, errorResult(tile, err, args), args, tiles.length > 1);
    }
  } finally {
    await closeBrowser(browser);
  }
}

main().catch((err) => {
  console.error(err?.stack || err?.message || String(err));
  process.exitCode = 1;
});
