// Run from the repository root: node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Shows that the status privacy case stores nothing to leak, then stores a debug
// record holding two marker strings and asks whether status output shows them.
// Builds and removes its own temporary workspace.
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const ADV = resolve('.skilled/skills/system-skill-advisor/runtime');
const metrics = await import(join(ADV, 'lib/metrics.ts'));
const status = await import(join(ADV, 'handlers/advisor-status.ts'));
const source = readFileSync(join(ADV, 'tests/handlers/advisor-status.vitest.ts'), 'utf8');
const privacyCase = /it\('does not leak prompt content in status output'[\s\S]*?\n {2}\}\);/.exec(source)?.[0] ?? '';
console.log(`privacy case persists a record: ${/persistAdvisorHookDiagnosticRecord/.test(privacyCase)}`);
const root = mkdtempSync(join(tmpdir(), 'probe-status-privacy-'));
try {
  console.log(`diagnostics file before: ${existsSync(metrics.advisorHookDiagnosticsPath(root))}`);
  process.env.SKILL_ADVISOR_DEBUG = '1';
  await metrics.persistAdvisorHookDiagnosticRecord(root, metrics.createAdvisorHookDiagnosticRecord({
    runtime: 'claude', status: 'ok', freshness: 'live', durationMs: 10, cacheHit: true,
    skillLabel: 'privacy-marker-skill', errorDetails: 'secret@example.com',
  }));
  delete process.env.SKILL_ADVISOR_DEBUG;
  const stored = readFileSync(metrics.advisorHookDiagnosticsPath(root), 'utf8');
  console.log(`stored record holds both markers: ${stored.includes('privacy-marker-skill') && stored.includes('secret@example.com')}`);
  const raw = (await status.handleAdvisorStatus({ workspaceRoot: root })).content[0].text;
  console.log(`status shows a marker: ${raw.includes('privacy-marker-skill') || raw.includes('secret@example.com')}`);
  console.log(`status holds the word prompt: ${raw.includes("prompt")}`);
  console.log(`status hookHealth invocations: ${JSON.parse(raw).data?.hookHealth?.invocations}`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
