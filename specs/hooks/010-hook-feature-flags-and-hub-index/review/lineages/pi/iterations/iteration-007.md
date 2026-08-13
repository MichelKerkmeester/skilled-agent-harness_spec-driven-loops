# Iteration 7: D1 Correctness (broaden) — Adversarial guard replay + finding evidence integrity

## Focus
- Dimension: correctness
- Files: `.opencode/hooks/shared/hook-flags.cjs` (edge cases), `.opencode/hooks/dispatch/cursor/post-tool-use.mjs:101` (F001 re-read), `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs:89` (F001 child), `.opencode/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:45` (F001 child), `.claude/settings.json` (F002 re-read), packet docs completion_pct (F003 re-read)

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings
None new. All prior findings' evidence re-verified:

- **F001** evidence stands: cursor proxy `:101` short-circuits only when BOTH concerns off; children `claude-posttooluse.cjs:89` and `dispatch-audit-posttooluse.mjs:45` each honor their own switch — the spawn-waste characterization is accurate.
- **F002** evidence stands: `.claude/settings.json` SessionStart chain invokes `node .opencode/bin/install-codex-hooks.mjs --check`; that file has no `isHookEnabled`.
- **F003** evidence strengthened: completion_pct across the four docs reads `30 / 30 / 83 / 92` — four divergent numbers in the same packet.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F003 re-verified | completion_pct 30/30/83/92 |
| checklist_evidence | pass | hard | — | unchanged |

## Assessment
- New findings ratio: 0.00 (no new findings; adversarial replay clean)
- Dimensions addressed: correctness
- Novelty justification: Edge-case probe of the guard: `concernFlag` normalizes all 15 concern slugs correctly (`dispatch→MK_DISPATCH_DISABLED` … `permission-policy→MK_PERMISSION_POLICY_DISABLED`); unknown concerns are default-on with an empty env and disableable via their derived flag (consistent with the documented convention); the master switch wins over per-concern flags; `isTruthy` correctly rejects `0|false|""`. No drift between the tested behavior and `hook-flags.cjs` source.

## Ruled Out
- Unknown-concern surprise-disable: an unregistered concern slug maps to its derived env var by design; no adapter passes an unregistered slug (all 15 verified). Ruled out.
- Master-vs-concern precedence bug: master checked first, always wins. Ruled out.
- F001/F002/F003 evidence invalidation: re-read source at cited lines; all citations accurate. Ruled out.

## Dead Ends
- None.

## Recommended Next Focus
D2 Security (broaden) — replay the master-switch silencing claim across the remaining unexamined adapters (`codex-watchdog`, `dist-freshness` plugins in opencode.json wiring), and verify no adapter loads before its guard in the OpenCode plugin registration path.

Review verdict: PASS
