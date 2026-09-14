// Lineage-internal registry reducer: applies deltas/iter-NNN.jsonl to findings-registry.json.
// Writes ONLY inside the lineage directory. Idempotent per finding id.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const registryPath = join(root, 'findings-registry.json');
const deltaDir = join(root, 'deltas');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const deltaFiles = readdirSync(deltaDir)
  .filter((name) => /^iter-\d+\.jsonl$/.test(name))
  .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

const openById = new Map((registry.openQuestions ?? []).map((q) => [q.id, q]));
const resolvedById = new Map((registry.resolvedQuestions ?? []).map((q) => [q.id, q]));
const findingById = new Map((registry.keyFindings ?? []).map((f) => [f.id, f]));
const ruledOutById = new Map((registry.ruledOutDirections ?? []).map((r) => [r.id, r]));

const coverage = { ...(registry.coverageBySources ?? {}) };
let iterationsCompleted = 0;
let sourceFindings = 0;

for (const file of deltaFiles) {
  const lines = readFileSync(join(deltaDir, file), 'utf8')
    .split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const rec = JSON.parse(line);
    if (rec.type === 'iteration') {
      iterationsCompleted = Math.max(iterationsCompleted, Number(rec.iteration) || 0);
      for (const qid of rec.answeredQuestions ?? []) {
        if (openById.has(qid) && !resolvedById.has(qid)) {
          resolvedById.set(qid, { ...openById.get(qid), answer: `Answered in iteration ${rec.iteration}; see iterations/iteration-${String(rec.iteration).padStart(3, '0')}.md`, iteration: rec.iteration });
          openById.delete(qid);
        }
      }
      for (const ro of rec.ruledOut ?? []) {
        const id = `ro-iter${String(rec.iteration).padStart(3, '0')}-${ro.approach}`;
        if (!ruledOutById.has(id)) ruledOutById.set(id, { id, ...ro, iteration: rec.iteration });
      }
    } else if (rec.type === 'finding') {
      if (!findingById.has(rec.id)) {
        findingById.set(rec.id, { ...rec, _lineages: ['deepseek'] });
      }
    } else if (rec.type === 'ruled_out') {
      const id = `ro-iter${String(rec.iteration).padStart(3, '0')}-${rec.direction}`;
      if (!ruledOutById.has(id)) ruledOutById.set(id, { id, approach: rec.direction, reason: rec.reason, iteration: rec.iteration });
    }
  }
}

// coverage by source class (hermes-installed-source / live-command / repo-packets)
for (const f of findingById.values()) {
  const ev = String(f.evidence ?? '');
  if (ev.includes('~/.hermes/hermes-agent')) coverage['hermes-installed-source'] = (coverage['hermes-installed-source'] ?? 0) + 1;
  if (/live |status|help|config show/.test(ev)) coverage['live-command-output'] = (coverage['live-command-output'] ?? 0) + 1;
  if (ev.includes('.opencode/skills') || ev.includes('specs/')) coverage['repo-packets'] = (coverage['repo-packets'] ?? 0) + 1;
}
sourceFindings = Object.values(coverage).reduce((a, b) => a + b, 0);

registry.openQuestions = [...openById.values()];
registry.resolvedQuestions = [...resolvedById.values()];
registry.keyFindings = [...findingById.values()];
registry.ruledOutDirections = [...ruledOutById.values()];
registry.coverageBySources = coverage;
registry.convergenceScore = registry.keyFindings.length > 0
  ? Math.max(0.05, Math.round(registry.convergenceScore * 10) / 10) : 0;
registry.metrics = {
  iterationsCompleted,
  openQuestions: registry.openQuestions.length,
  resolvedQuestions: registry.resolvedQuestions.length,
  keyFindings: registry.keyFindings.length,
  convergenceScore: registry.convergenceScore,
  sourceFindings,
  coverageBySources: coverage,
};

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
console.log(`registry updated: ${iterationsCompleted} iterations, ${registry.keyFindings.length} findings, ${registry.resolvedQuestions.length} resolved`);
