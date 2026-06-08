# Deep Review Strategy — fanout lineage opus-4

## Topic
Multi-model deep review (opus-4 lineage) of recent daemon-reliability, re-election,
reap-before-respawn, and hook-portability work.

## Review Dimensions
- [x] correctness — covered iteration 1 (F001, F003)
- [x] security — covered iteration 1 (F002)
- [x] traceability — covered iteration 1 (comment-vs-code F001, cross-ref table)
- [x] maintainability — covered iteration 1 (F003, F004)

## Completed Dimensions
- correctness: CONDITIONAL — 1 P1 (non-exclusive stale-owner reclaim under the reap fix), 1 P2 (release-path no SIGKILL escalation)
- security: PASS-with-advisory — 1 P2 (missing foreign-uid legacy-lease guard parity)
- traceability: partial — shared-context claims verify EXCEPT the "O_EXCL spawn mutex" inline claim (F001); packet spec docs are unfilled scaffolds
- maintainability: PASS-with-advisory — 1 P2 (code-index parallel reclaim/overstated comment)

## Running Findings
- P0: 0
- P1: 1 (F001)
- P2: 3 (F002, F003, F004)
- Active total: 4

## What Worked
- Reading both launchers side-by-side surfaced the security-guard asymmetry (F002) and the shared reclaim-mutex weakness (F001/F004).
- Verifying env/handler claims with grep + on-disk existence checks retracted two weak candidates (dead `SPEC_KIT_DB_DIR`, missing Devin hook target) before they became false positives.

## What Failed
- n/a (single pass)

## Exhausted Approaches
- n/a

## Ruled-Out Directions
- "SPEC_KIT_DB_DIR is dead config" — refuted (honored at dist/core/config.js:35).
- "Devin hook path missing" — refuted (target exists).

## Next Focus
Atomic compare-and-swap for the stale-owner reclaim in BOTH launchers + a concurrent
stale-reclaim co-residency regression test asserting a single sqlite opener.

## Known Context
- Operative review contract is `review/shared-context.md`; `spec.md` / `implementation-summary.md` are unfilled Level-2 scaffolds (`completion_pct: 0`).
- `resource-map.md not present. Skipping coverage gate`.
- Re-election is code-default OFF, env-gated ON via the (out-of-scope) runtime MCP configs.

## Cross-Reference Status
### Core
- spec_code: partial (F001 comment-vs-code mismatch)
- checklist_evidence: partial (scaffold spec docs; verified against shared-context.md)
### Overlay
- feature_catalog_code: n/a (runtime configs out of target scope)
- playbook_capability: n/a

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| mk-spec-memory-launcher.cjs | full | F001 (P1), F002 (P2), F003 (P2) |
| model-server-supervision.cjs | full | reapProcessTreeGroups deferred-SIGKILL (F003 evidence) |
| launcher-ipc-bridge.cjs | full | lease-probe retries, socketPath preference — clean |
| launcher-session-proxy.cjs | full | reattach/replay — documented memory_save gap (deferred) |
| mk-code-index-launcher.cjs | full | F004 (P2), foreign-uid guard (F002 reference) |
| daemon-reelection-adoption-live.vitest.ts | full | DB isolation verified real; sequential reap proven |
| daemon-reelection-release-integration.vitest.ts | full | real primitives, release-vs-kill — clean |
| session-cleanup.sh | full | ancestry re-proof — clean |
| check-comment-hygiene.sh | full | python-in-.sh convention, invoked via python3 — non-issue |
| .claude/settings.local.json | full | portability rewrite correct; targets exist |
| .codex/hooks.json | full | portability rewrite correct; targets exist |
| .devin/hooks.v1.json | full | portability rewrite correct; cross-package target exists |

## Review Boundaries
- maxIterations: 1 (single breadth pass)
- convergenceThreshold: 0.10
- Read-only: no target file modified.

## Non-Goals
- The 3 runtime MCP configs that flip the re-election default (out of the 12-file target set).
- The Barter mirror sync (outside this repo).
- Authoring the unfilled packet spec scaffolds.

## Stop Conditions
- maxIterations=1 reached after one full-coverage pass.
