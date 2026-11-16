import fs from 'node:fs';
const W = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research';
const { normalize, insideCheckout } = await import(`${W}/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`);
const { loadSession } = await import(`${W}/.skilled/hooks/shared/session-readers/index.mjs`);
const HEREDOC_BODY = /(<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_.-]*)\2[^\n]*)\n[\s\S]*?\n[ \t]*\3[ \t]*(?=\n|$)/g;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const out = {};
for (const rt of ['claude', 'opencode', 'pi', 'devin', 'dsh']) {
  const f = `${W}/specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/${rt}.jsonl`;
  const lines = fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const r = { lines: lines.length, loaded: 0, failed: 0, linesWithBodyWrite: 0, linesWhoseOnlyInsideWritesAreBody: 0, rows: [] };
  for (const line of lines) {
    let events;
    try { const s = await loadSession({ ...line.locator, runtime: rt }); events = normalize(s?.records ?? s, rt); r.loaded += 1; } catch { r.failed += 1; continue; }
    const dir = line.locator?.projectDir;
    const inside = events.filter((e) => e && e.kind === 'write' && (typeof e.path !== 'string' || insideCheckout(e.path, dir)));
    const body = inside.filter((e) => typeof e.command === 'string' && typeof e.path === 'string' && /<</.test(e.command)
      && !new RegExp(`>\\s*['"]?${esc(e.path)}`).test(e.command.replace(HEREDOC_BODY, '$1')));
    if (body.length > 0) r.linesWithBodyWrite += 1;
    if (body.length > 0 && body.length === inside.length) { r.linesWhoseOnlyInsideWritesAreBody += 1; r.rows.push(`${line.rowId}/${line.arm}${line.run}`); }
  }
  out[rt] = r;
}
console.log(JSON.stringify(out, null, 1));
