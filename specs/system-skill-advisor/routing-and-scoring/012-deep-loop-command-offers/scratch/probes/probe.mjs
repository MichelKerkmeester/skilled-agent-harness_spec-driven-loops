import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const repo = process.env.PROBE_REPO || process.cwd();
const probes = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = [];
for (const p of probes) {
  const r = spawnSync('node', ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json', '-', '--format', 'json'], { cwd: repo, input: JSON.stringify({ prompt: p.prompt }), encoding: 'utf8' });
  let d; try { d = JSON.parse(r.stdout); } catch { d = null; }
  const recs = d?.data?.recommendations ?? [];
  const fmt = (x) => x ? { skill: x.skillId, conf: x.confidence, unc: x.uncertainty, lane: x.dominantLane, action: x.compiledRoute?.action, sel: x.compiledRoute?.selectionKind, modes: (x.compiledRoute?.targets ?? []).map(t => t.workflowMode).join('+'), command: x.command, policy: x.policy, kind: x.kind, needsMode: x.needsMode, floored: x.confidenceFloored } : null;
  out.push({ ...p, exit: r.status, status: d?.status, freshness: d?.data?.freshness, ambiguous: d?.data?.ambiguous, n: recs.length, top: fmt(recs[0]), second: fmt(recs[1]), third: fmt(recs[2]), extra: Object.keys(d?.data ?? {}).filter(k => !['workspaceRoot','effectiveThresholds','recommendations','ambiguous','freshness','trustState','generatedAt','cache','_shadow'].includes(k)), stderr: r.stderr?.slice(0, 200) });
}
writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
for (const o of out) {
  const t = o.top;
  console.log(`${o.id} [exit ${o.exit} ${o.freshness}] n=${o.n} amb=${o.ambiguous} | ${t ? `${t.skill} c=${t.conf} u=${t.unc} ${t.action ?? '-'}/${t.sel ?? '-'}/${t.modes || '-'} cmd=${t.command ?? '-'} pol=${t.policy ?? '-'} kind=${t.kind}${t.needsMode ? ' needsMode' : ''}${t.floored ? ' FLOORED' : ''}` : 'NONE'}${o.second ? ` || 2: ${o.second.skill} c=${o.second.conf} cmd=${o.second.command ?? '-'} pol=${o.second.policy ?? '-'}` : ''}${o.third ? ` || 3: ${o.third.skill} c=${o.third.conf}` : ''}${o.extra.length ? ` extra=${o.extra}` : ''}`);
}
