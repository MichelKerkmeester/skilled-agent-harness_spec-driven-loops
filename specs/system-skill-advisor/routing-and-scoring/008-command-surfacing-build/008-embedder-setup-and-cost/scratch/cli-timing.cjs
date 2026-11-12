// Times five advisor CLI calls with distinct prompts, so the prompt cache never answers.
// Usage: node cli-timing.cjs, run from the repository root with the advisor daemon running.
const { spawnSync } = require('child_process');
const out = [];
for (let i = 1; i <= 5; i++) {
  const t = performance.now();
  const r = spawnSync('node', ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--prompt', `is my advisor install healthy, attempt ${i}`, '--format', 'json'], { encoding: 'utf8' });
  const data = JSON.parse(r.stdout).data;
  out.push({ ms: +(performance.now() - t).toFixed(1), exit: r.status, warnings: data.warnings ?? null });
}
console.log(JSON.stringify(out));
