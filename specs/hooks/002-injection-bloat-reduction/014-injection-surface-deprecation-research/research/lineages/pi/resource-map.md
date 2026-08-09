# Resource Map — Lineage pi (converged deltas)

Derived from the 9 converged iteration deltas. Source-of-truth note: `{spec_folder}/resource-map.md` was absent at init, so this is the lineage-local evidence-derived map only.

## Injection Surfaces (owned by runtime hooks)

| File | Role | Findings reference |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Canonical advisor renderer: route line + 3 directives; fallback + timeout fallback | iter-001 F1, iter-002 F4, iter-003 F1 |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Pi adapter: forwards advisor context, appends dispatch directive (554 B), 013 dedup | iter-001 F4, iter-003 F2, iter-006 F3 |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Maintained hook consumed by Pi; `brief ?? fallback` call site | iter-002 F4 |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | OpenCode bridge; local mirror missing TERMINAL_PROOF_DIRECTIVE | iter-008 F4 |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | Gate-3 classifier + question (521 B) + suppression fix | iter-004 F3, iter-006 F1, iter-009 F1 |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts` | Pi Gate-3 question transform | iter-001 F5 |
| `.opencode/hooks/goal/pi/goal-context.ts`, `goal/lib/goal-core.cjs` | Active-goal brief (per-turn when active; ≤4,800 B) | iter-001 F6, iter-003 F1 |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts` | Continuity brief on session_start (display:false) | iter-001 F7 |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-compact-context.ts` | Post-compaction recovery brief | iter-001 F8, iter-008 F3 |
| `.opencode/hooks/injection-contract.md` | Canonical injection inventory (content, triggers, visibility) | iter-001 |

## Evidence Packets (specs)

| Packet | Role | Findings reference |
|---|---|---|
| `hooks/001-per-prompt-injection-audit/research/research.md` | Source byte measurements (763/806/521/554/389 B; 94.7%) | iter-002 F3 |
| `hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats/` | Shadow dedup machine; route-only 43 B; −82.2% modeled | iter-002 F2, iter-006 F4 |
| `hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/` | Compact dispatch prototype; five-semantics map | iter-005 F3 |
| `hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json` | 30 cells; 13 emit/17 N/A; 0 evidence | iter-002 F1 |
| `hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup/` | Pi dedup shipped; headless-fallback gap | iter-002 F5 |
| `cli-external-orchestration/037-spec-gate-question-noise/` | Gate-3 noise fix (checklist green; in code) | iter-004 F3, iter-006 F1 |

## Live State Observed

| Path | Evidence |
|---|---|
| `.opencode/skills/.spec-gate-state/*.json` | `{"status":"open",...}` — gate question delivery state |
| `.opencode/skills/.spec-gate-state/spec-gate-warnings.log` | Per-call gate advisories (2026-08-09) |
| `.opencode/skills/.goal-state/` | README only — no active goal (brief inactive) |
