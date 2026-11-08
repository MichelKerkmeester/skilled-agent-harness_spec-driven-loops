---
title: "Deep Review Report: session relaunch loop (fan-out lineage swe)"
description: "Three-iteration deep review of the session relaunch loop packet on cli-devin swe-2-max. Verdict PASS with ten P2 advisories."
importance_tier: normal
contextType: review
---

# Deep Review Report: Session Relaunch Loop — Lineage `swe`

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 10
- **Scope:** `specs/hooks/023-session-relaunch-loop` (spec-folder) — the relaunch core, five runtime adapters, the `skilled-loop` wrapper, the handoff command, tests, hook wiring, catalog/playbook surfaces and the packet's own spec docs, including the phase-005 remediation evidence.
- **Run:** 3 of 3 iterations, stop reason `maxIterationsReached` (stop policy max-iterations; convergence treated as telemetry only). Executor cli-devin `swe-2-max`, in-process LEAF — every iteration ran in this session with no nested dispatch. Dimensions covered: correctness, security, traceability, maintainability (4/4).

No finding blocks release. The ten advisories cluster into four themes: pid-reuse hazards in the killer's liveness and signal path, input/boundary gaps around the note path and the live-shell guard, residual process-table duplication, and parent-spec documentation drift left behind by phase 005.

## 2. What the Review Verified

- Phase-005's twelve-finding remediation is real in the code: append-only log with fsync + 0600 + newline repair (`relaunch-core.cjs:555-586`), transcript-missing grace (`killer.cjs:157-161`), owner-pid mutex takeover with guarded re-check (`killer.cjs:268-389`), state dir pinned 0700 (`relaunch-core.cjs:42-47`), shared nudge helpers consumed by every adapter (`codex/shared.mjs:101,111`; `hermes/context-nudge.mjs:65,83,94`; `claude/context-nudge.mjs:99,109`), balanced Skip suffix with a legacy parser (`relaunch-core.cjs:527`; `nudge.cjs:16`), and killer respawn on an armed record (`stop-arm.mjs:94-97`; `session-relaunch.ts:339-343`).
- Acceptance-criteria evidence pointers resolve exactly: `nudge.cjs:171/183/199/24`, named tests at `relaunch-core.test.cjs:749`, `killer.test.cjs:958/1074/1392`, `claude-adapters.test.cjs:508/558`.
- Security surfaces confirmed clean: argv-mode spawns only, no eval, `cd --` + line-break guards in the wrapper, stat-only transcript watch, session-id validation on state paths, private file modes throughout.
- All overlay surfaces exist and match the code: catalog leaf, three playbooks, hook-registry rows rendered into `.claude/settings.json` and `.codex/hooks.json`, handoff command present.

## 3. Active Findings

| Id | Severity | Title | File |
|----|----------|-------|------|
| R1-P2-001 | P2 | Killer liveness check crashes on EPERM where the core treats it as alive | `.skilled/hooks/session-relaunch/lib/killer.cjs:106` |
| R1-P2-002 | P2 | recordTimeout gates unarm and notify on a pre-wait record snapshot | `.skilled/hooks/session-relaunch/lib/killer.cjs:441` |
| R1-P2-003 | P2 | plannedNotePath interpolates an unvalidated session id into the note filename | `.skilled/hooks/session-relaunch/lib/nudge.cjs:191` |
| R1-P2-004 | P2 | Lock-owner liveness trusts pid identity; a recycled pid pins a stale lock indefinitely | `.skilled/hooks/session-relaunch/lib/killer.cjs:275` |
| R2-P2-001 | P2 | Ancestry check and SIGTERM are separated by a pid-reuse window | `.skilled/hooks/session-relaunch/lib/killer.cjs:449` |
| R2-P2-002 | P2 | The handoff containment boundary follows REPO_ROOT, not the repository | `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:72` |
| R2-P2-003 | P2 | The live-shell guard fails open on any shell outside a three-name list | `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:190` |
| R3-P2-001 | P2 | Parent spec prose still describes four children while five exist and are complete | `specs/hooks/023-session-relaunch-loop/spec.md:39` |
| R3-P2-002 | P2 | Phase-handoff verification cell names a path that no longer exists | `specs/hooks/023-session-relaunch-loop/spec.md:114` |
| R3-P2-003 | P2 | Two ps process-table readers and three ancestor walks survive the helper consolidation | `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138` |

## 4. Iteration Log

| Iteration | Dimension | Files reviewed | New findings | Verdict |
|-----------|-----------|----------------|--------------|---------|
| 1 | correctness | 6 | 4 | PASS |
| 2 | security | 8 | 3 | PASS |
| 3 | traceability + maintainability | 20+ | 3 | PASS |

## 5. Lineage Notes

- The state projection's init sequence ran behind iteration 1's commit: the gateway's `deep_review.iteration_recorded` event was committed before `deep_review.run_initialized`, so the projected `deep-review-state.jsonl` orders the config row second. All events committed through `append-mode-event.cjs`; one projection refusal (config-key mismatch on a hand-seeded row) is recorded in `gateway-refusals.jsonl` and was resolved by aligning the state log with the ledger order.
- No steer.md was present at init or before any iteration.
- newFindingsRatio = 1.0 on all three iterations; stop occurred only at the configured cap.

## 6. Remediation Themes (advisory, no gate)

1. **Pid-reuse hardening in the killer** — bind liveness and ancestry to process identity (start time or command name), and re-check ancestry immediately before SIGTERM (R1-P2-001, R1-P2-004, R2-P2-001).
2. **Input validation parity** — apply `SESSION_ID_PATTERN` inside `plannedNotePath`, and re-read the armed record after `waitForIdle` before gating unarm/notify (R1-P2-002, R1-P2-003).
3. **Boundary and guard tightening** — anchor `handoffPathWithinRepo` to the resolved repo (not raw `REPO_ROOT`), and widen or restructure the live-shell detection beyond a three-name comm list (R2-P2-002, R2-P2-003).
4. **Spec-doc reconciliation** — update parent spec prose to five children and repoint the 004→005 verification cell to the archived report path; absorb the CLI's `comm`-column process-table need into the shared helper (R3-P2-001, R3-P2-002, R3-P2-003).
