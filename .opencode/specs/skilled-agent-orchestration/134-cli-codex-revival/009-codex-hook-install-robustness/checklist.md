---
title: "Verification Checklist: Codex hook install robustness"
description: "Level 3 verification checklist: containment verified with live evidence; the durable convergent-installer items are pending implementation and approval."
trigger_phrases: ["Codex hook install robustness checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verified containment with live smoke; durable-fix checks left unchecked pending implementation"
    next_safe_action: "run the OPEN PROBE, then implement D2/D3 in install-codex-hooks.mjs"
    blockers: ["Durable-fix checks pending implementation + approval", "OPEN PROBE unresolved"]
    completion_pct: 20
    open_questions: ["How does Codex 0.144.x treat a hook command's non-zero exit?"]
    answered_questions: []
---
# Verification Checklist: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
A check is marked `[x]` only with evidence: a command output, a file diff, or a live-session observation. Containment checks carry live-smoke evidence. Durable-fix checks stay `[ ]` until the convergent installer is implemented and confirmed; marking them before implementation would falsely claim the durable fix is done.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Root cause pinned: `hookIdentity()` (`install-codex-hooks.mjs` ~line 43) discards the `cd` anchor and the dedup filter (~line 98) compares commands after skipping identity, so a stale-anchored entry reads as "already installed" and re-runs report `added: 0`. Recorded in `decision-record.md` (ADR-002 context).
- [x] CHK-002 [P0] Two-model consult adjudicated (SOL ultra dispatcher REJECTED; Fable-5 convergent installer ADOPTED), each grounded in reads of `install-codex-hooks.mjs`. Recorded in `decision-record.md` (ADR-001…ADR-006).
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] The reconcile keys mk-owned entries by `(owner,event,matcher,hookId)` and rewrites the full command+anchor on every run (independent of identity). Pending implementation (T020/T021).
- [ ] CHK-011 [P0] Superset/unknown entries are byte-identical before and after a reconcile run. Pending implementation (T020) + convergence test (T050).
- [ ] CHK-012 [P1] The linked-worktree anchor refusal aborts unless `--allow-worktree`; the anchor is always the primary checkout. Pending implementation (T023).
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Containment live smoke passes. Live `codex exec` gpt-5.5 low (read-only) after the re-anchor: SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed.
- [ ] CHK-021 [P0] Convergence test: one reconcile re-anchors a stale-anchored fixture; a second run is a no-op. Pending (T050).
- [ ] CHK-022 [P1] Refusal + dedupe tests: linked-worktree run aborts; each duplicated source group resolves to one installed entry. Pending (T051).
- [ ] CHK-023 [P1] OPEN PROBE observed live: Codex 0.144.x non-zero-exit behavior confirmed before the inline `||` emit ships. Pending (T010).
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] The reap → silent dormancy risk is removed TODAY: `~/.codex/hooks.json` has 0 worktree-anchored mk entries (MAIN 16 / superset 3 / worktree 0) with a restorable backup. Containment, not the durable fix.
- [ ] CHK-FIX-002 [P0] The recurrence class is closed durably: a re-run always re-anchors mk entries AND the installer refuses to anchor at a linked worktree. Pending (T021/T023).
- [ ] CHK-FIX-003 [P1] Resolution failure is loud, not silent: inline `||` envelope per generated entry + cross-runtime `--check` watchdog. Pending (T031/T041).
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] Containment backed up `~/.codex/hooks.json` before writing and preserved the three Superset `notify.sh` entries. Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`; superset-notify 3 preserved.
- [ ] CHK-031 [P0] The durable fix adds NO new global artifact, dispatcher, or trust record (ACE surface avoided). Verified by diff at closeout (T052); rejected in ADR-001/ADR-005.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] The defect, root cause, two-model consult, and adjudicated decisions are recorded. `decision-record.md` ADR-001…ADR-008; `spec.md` problem statement.
- [x] CHK-041 [P1] The DONE/PLANNED split is explicit so no reader mistakes the containment for the durable fix. Stated in `spec.md`, `plan.md`, and `implementation-summary.md`.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] The declared change surface is exactly `install-codex-hooks.mjs`, the source `.codex/hooks.json`, and the Claude/OpenCode SessionStart wiring — no adapter, core, or plugin. Stated in `spec.md` Files to Change.
- [ ] CHK-051 [P1] No files outside the declared scope are modified by the durable fix. Verified by diff at closeout (T052).
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified | Pending |
|---|---:|---:|---:|
| P0 | 10 | 5 | 5 |
| P1 | 8 | 3 | 5 |
| P2 | 0 | 0 | 0 |

**Overall**: In progress. Containment is verified (root cause pinned, consult adjudicated, stale anchors repaired with a backup, live smoke green). The durable convergent-installer checks are intentionally unchecked — they are pending implementation and operator approval, and one (the inline `||` emit) is additionally gated on the OPEN PROBE.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [ ] CHK-100 [P0] The policy-file model holds: `~/.codex/hooks.json` stays a set of primary-checkout-anchored entries with no runtime dispatcher or global router; the installer is a reconciler, not a resolver. Pending implementation; the model is fixed in ADR-001/ADR-002.
<!-- /ANCHOR:arch-verify -->
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
`--check` is read-only (parse + compare the mk subset) and must complete inside the SessionStart budget; no network or build work. Confirmed at closeout (T052).
<!-- /ANCHOR:perf-verify -->
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
The installer is the deploy step: idempotent, atomic (temp+rename on change), backed up, and revertible by restoring the timestamped backup. Containment is already deployed; the durable reconcile deploys the same way once approved.
<!-- /ANCHOR:deploy-ready -->
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
Scope-locked to the installer, the source hook file, and the durable-runtime SessionStart wiring; `~/.codex/hooks.json` stays the one out-of-repo write, backed up first. No secret, license, or data-handling surface touched; no new global executable introduced.
<!-- /ANCHOR:compliance-verify -->
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
The decision record, spec, and implementation summary agree on the DONE/PLANNED split; cross-references resolve; no doc claims the durable fix is implemented.
<!-- /ANCHOR:docs-verify -->
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
Containment is signed off (live-verified). The durable fix is ready for an orchestrator/operator approval gate; implementation and the OPEN PROBE must complete, and strict validation must be clean, before the durable-fix checks may be marked.
<!-- /ANCHOR:sign-off -->
