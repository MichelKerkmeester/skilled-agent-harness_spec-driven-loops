// Read-only calibration: applies the composite unexamined-pass rule to every lineage dir given.
// Signals: stamp-vs-commit skew (ledger), tool calls and source reads per pass (JSON log, opencode shape),
// findings per pass (state row), commit gap. Prints per-lineage flagged passes.
const fs = require('fs');
const path = require('path');

function commitsOf(dir) {
  const ledger = fs.readdirSync(dir).find((d) => /-ledger$/.test(d) && !/audit|effect/.test(d));
  const out = [];
  if (!ledger) return out;
  const fd = path.join(dir, ledger, 'frames');
  if (!fs.existsSync(fd)) return out;
  for (const f of fs.readdirSync(fd).sort()) {
    for (const line of fs.readFileSync(path.join(fd, f), 'utf8').split('\n').filter(Boolean)) {
      try {
        const j = JSON.parse(line);
        const ev = Buffer.from(j.canonical_event_bytes, 'base64').toString('utf8');
        if (!/"type":"iteration"[,}]/.test(ev)) continue;
        const m = ev.match(/"iteration":(\d+)[,}]/);
        if (m) out.push({ n: +m[1], at: Date.parse(j.receipt.committed_at) });
      } catch { /* skip */ }
    }
  }
  return out;
}

function toolsOf(dir) {
  const p = path.join(dir, 'logs', 'fanout-lineage.out');
  if (!fs.existsSync(p)) return null;
  const tools = [];
  for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!l.startsWith('{')) continue;
    try {
      const j = JSON.parse(l);
      if (j.type !== 'tool_use') continue;
      const inp = (j.part && j.part.state && j.part.state.input) || {};
      tools.push({ t: j.timestamp, tool: j.part.tool, target: inp.filePath || inp.path || inp.url || '', cmd: inp.command || '' });
    } catch { /* skip */ }
  }
  return tools.length ? tools : null;
}

const isSrc = (x) => (/read|grep|glob|webfetch/.test(x.tool) && !/lineages\//.test(x.target))
  || (x.tool === 'shell' && /\b(sed -n|grep|rg|cat|head|awk)\b/.test(x.cmd) && !/append-mode-event|reduce-state|lineages\//.test(x.cmd));

for (const dir of process.argv.slice(2)) {
  const kind = fs.existsSync(path.join(dir, 'deep-review-state.jsonl')) ? 'review' : 'research';
  const sp = path.join(dir, `deep-${kind}-state.jsonl`);
  if (!fs.existsSync(sp)) continue;
  const rows = fs.readFileSync(sp, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter((r) => r && r.type === 'iteration');
  const commits = new Map();
  for (const c of commitsOf(dir)) commits.set(c.n, c.at);
  const tools = toolsOf(dir);
  let prevAt = null;
  const flags = [];
  let examined = 0;
  for (const r of rows) {
    const at = commits.get(r.iteration);
    const ts = Date.parse(r.timestamp);
    const skew = at && Number.isFinite(ts) ? (ts - at) / 1000 : null;
    let calls = null;
    let reads = null;
    if (tools && at) {
      const b = tools.filter((x) => x.t > (prevAt || 0) && x.t <= at);
      calls = b.length;
      reads = new Set(b.filter(isSrc).map((x) => x.cmd || x.target)).size;
    }
    const gap = at && prevAt ? (at - prevAt) / 1000 : null;
    const findings = Number.isFinite(r.findingsCount) ? r.findingsCount : null;
    const why = [];
    if (skew !== null && skew > 1) why.push(`future+${Math.round(skew)}s`);
    if (reads === 0 && findings === 0) why.push('noReads+noFindings');
    if (gap !== null && gap < 15 && calls === 0) why.push(`batched(${gap.toFixed(1)}s)`);
    if (why.length) flags.push(`${r.iteration}:${why.join('+')}`);
    else examined += 1;
    if (at) prevAt = at;
  }
  const label = dir.split('/').slice(-3).join('/');
  console.log(`${label} [${kind}] iters=${rows.length} toolLog=${tools ? 'json' : 'none'} flagged=${flags.length} ${flags.join(' ')}`);
}
