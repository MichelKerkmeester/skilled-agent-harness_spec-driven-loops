---
title: "Implementation Plan: Codex hook install robustness"
description: "Interim re-anchor containment (shipped) plus the planned convergent/repair-default installer, linked-worktree anchor refusal, inline fail-loud emit, cross-runtime --check watchdog, and source dedupe — gated on an open Codex non-zero-exit probe and operator approval."
trigger_phrases: ["Codex hook install robustness plan"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the Level 3 implementation plan; containment done, durable fix planned"
    next_safe_action: "run the OPEN PROBE, then implement D2/D3 in install-codex-hooks.mjs"
    blockers: ["Durable fix D2/D3/D4 is approval-gated; not yet implemented", "OPEN PROBE (D4 pre-req) unresolved"]
    completion_pct: 20
    open_questions: ["How does Codex 0.144.x treat a hook command's non-zero exit?"]
    answered_questions: []
---
# Implementation Plan: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Two tracks. Track A (**done, shipped this session**): an interim re-anchor of the 14 stale worktree-anchored mk entries in `~/.codex/hooks.json` back to the primary checkout, backed up and live-smoke-verified, to remove the reap → silent dormancy risk today. Track B (**planned, approval-gated**): make `install-codex-hooks.mjs` convergent/repair-default so it re-anchors mk-owned entries by identity on every run, refuse to anchor at a linked worktree, emit an inline fail-loud `||` envelope per generated entry, wire a non-mutating `--check` into the repo-local Claude/OpenCode SessionStart chain, and dedupe the duplicated source `.codex/hooks.json` groups. Track B is NOT implemented; it depends on the OPEN PROBE (Codex non-zero-exit behavior) and operator approval.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] A stale-anchored mk entry is repaired on the next run; a second run reports no further change (convergence).
- [ ] Superset/unknown entries are byte-identical before and after a reconcile run.
- [ ] Running from a linked worktree aborts unless `--allow-worktree`.
- [ ] `--check` is non-mutating and reports drift; it never self-repairs from SessionStart.
- [ ] No neutral core, Claude hook, or OpenCode plugin changes behavior (diff-confirmed); no new global artifact is created.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`~/.codex/hooks.json` stays a policy file whose mk-owned entries `cd` at the primary checkout and invoke repo-relative adapters — no runtime dispatcher, no global router. The installer becomes a reconciler: it partitions entries into mk-owned (keyed by `(owner,event,matcher,hookId)`) and preserved (Superset/user/unknown), rewrites the full command+anchor for each mk key, appends exactly one entry per key, and writes atomically (temp+rename) only when content changes. A linked-worktree guard (`git rev-parse --git-common-dir` vs `<toplevel>/.git`) forces the anchor to the primary checkout. Each generated command carries an inline `|| <additionalContext: "mk codex hook unresolvable — run installer --check">` so resolution failure is loud. The durable runtimes (Claude/OpenCode) run `install-codex-hooks.mjs --check` in their SessionStart chain to police the fragile global file, read-only.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `install-codex-hooks.mjs` | Naive merge (identity drops anchor; dedup after identity) | Modify → convergent reconcile + `--check` + worktree refusal + fail-loud emit | Convergence test; preserve test; abort test |
| `.codex/hooks.json` (repo source) | Versioned registration with duplicate groups | Modify → dedupe SessionStart groups | JSON parse + single-occurrence assertion |
| Claude/OpenCode SessionStart wiring | Durable repo-local hook chain | Modify → add `--check` watchdog | Live SessionStart reports drift, no mutation |
| `~/.codex/hooks.json` (user-global) | Fragile runtime surface | Reconcile via installer | Backup + convergence + Superset preserved |
| Codex guard adapters / neutral cores | Byte-frozen from 007 | Read only | Diff confirms unchanged |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 0: Containment (DONE)
- [x] Re-anchor the 14 stale `…/.worktrees/0038-codex-hook-parity` mk command prefixes → primary checkout in `~/.codex/hooks.json`; back up first; live smoke.
### Phase 1: Open probe (gates Phase 4)
- [ ] Empirically confirm how Codex 0.144.x treats a hook command's non-zero exit (surfaces / marks Failed / ignores).
### Phase 2: Convergent reconcile + worktree refusal
- [ ] Replace the identity/dedup logic with a reconcile keyed by `(owner,event,matcher,hookId)`; add the linked-worktree anchor refusal (D2/D3).
### Phase 3: `--check` + cross-runtime watchdog
- [ ] Add non-mutating `--check`; wire it into the repo-local Claude/OpenCode SessionStart chain (D4, no self-repair).
### Phase 4: Fail-loud emit + source dedupe
- [ ] Emit the inline `||` envelope per generated entry (shape driven by the Phase 1 probe); dedupe the source `.codex/hooks.json` groups (D4/D6).
### Phase 5: Verification and closeout
- [ ] Convergence/preserve/abort tests; live re-run; strict validation; metadata reconcile.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Fixture-level: a synthetic `~/.codex/hooks.json` with mk entries anchored at a stale path plus preserved Superset entries — assert one reconcile run re-anchors all mk keys, a second run is a no-op, and Superset entries are byte-identical. A linked-worktree abort test (run from a worktree, expect non-zero exit + guidance; `--allow-worktree` overrides). A source-dedupe assertion (each duplicated group appears once post-reconcile). `--check` non-mutation assertion (drift reported, file unchanged). The OPEN PROBE is a live `codex exec` observation of a deliberately non-zero-exit hook. Track A containment is already verified live (SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4).
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Codex 0.144.x non-zero hook-exit behavior | External | Open (probe) | D4 inline `||` fallback shape is unconfirmed; do not ship it until resolved. |
| Operator approval for the durable fix | Process | Gated | Track B stays planned; only Track A containment is live. |
| 007 Codex adapters on origin/v4 | Internal | Green | Byte-frozen; reused unchanged as the reconcile targets. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Track A: restore the timestamped backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32` to revert the interim re-anchor. Track B (once implemented): revert the `install-codex-hooks.mjs` and `.codex/hooks.json` diffs and re-run the prior installer; no neutral core, Claude hook, or OpenCode plugin changes, so the other two runtimes are unaffected. No new global artifact means nothing to uninstall outside the repo and the one user-global file.
<!-- /ANCHOR:rollback -->
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
- **Phase 0 (containment)** is independent and already shipped; it de-risks everything downstream.
- **T010 (open probe)** gates **T041** (the inline `||` emit) only; the reconcile (T020–T023) and `--check` (T030–T031) do not depend on it.
- **T020 → T021 → T022** (reconcile keying → command+anchor rewrite → atomic write) are sequential.
- **T023 (linked-worktree refusal)** depends on the reconcile anchor resolution (T020).
- **T030 (--check)** depends on the reconcile so it can compare against the expected anchor; **T031 (wiring)** depends on T030.
- **T042 (source dedupe)** is independent of the probe and can land alongside the reconcile.
- **T050–T052 (verification + closeout)** depend on T020–T042.
<!-- /ANCHOR:dependency-graph -->
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
`T010 (open probe) → T041 (inline || emit)` is the longest-lead item because the fallback shape cannot be finalized until Codex's non-zero-exit behavior is known. In parallel, `T020 → T021 → T023 (reconcile + worktree refusal) → T050 (convergence test)` closes the recurrence class independently of the probe, so the durable fix can land in two waves: the reconcile/refusal wave first, the fail-loud wave after the probe resolves.
<!-- /ANCHOR:critical-path -->
<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Definition | Gate |
|---|---|---|
| M0 Contained | Stale mk anchors re-pointed to primary checkout; backup taken; live smoke green | Phase 0 (done) |
| M1 Probe resolved | Codex non-zero-exit behavior confirmed; D4 fallback shape decided | Phase 1 |
| M2 Convergent | Reconcile re-anchors by identity; linked-worktree refusal in place | Phase 2 |
| M3 Policed | `--check` wired into the durable SessionStart chain; source deduped | Phases 3-4 |
| M4 Closed out | Convergence/preserve/abort tests pass; strict validation clean; 134 parent noted | Phase 5 |
<!-- /ANCHOR:milestones -->
## L3: AI EXECUTION PROTOCOL
### Pre-Task Checklist
Before touching the installer: read `install-codex-hooks.mjs` end to end (especially `hookIdentity()` ~line 43 and the dedup filter ~line 98); confirm the current mk-owned entry shape in `~/.codex/hooks.json`; confirm the primary-checkout toplevel via `git rev-parse --show-toplevel`. Do not implement the inline `||` emit before the OPEN PROBE resolves.
### Task Execution Rules
- **TASK-SEQ**: the reconcile (T020–T022) precedes the linked-worktree refusal and `--check`; the fail-loud emit (T041) runs only after the open probe (T010).
- **TASK-SCOPE**: touch only `install-codex-hooks.mjs`, the source `.codex/hooks.json`, and the repo-local Claude/OpenCode SessionStart wiring. Never modify a neutral core, a Codex/Claude adapter, or an OpenCode plugin. Never add a global dispatcher, trust record, or LaunchAgent.
### Status Format
Report each task as `T### — <result> (evidence: fixture output / file:line / live capture)`, distinguishing confirmed from inferred; keep containment (done) separate from the durable fix (planned).
### Blocked Task Protocol
If the OPEN PROBE cannot be run (no live Codex available), stop before T041, record the schema evidence gathered, mark the inline `||` shape as explicitly owed, and land only the probe-independent reconcile/refusal/`--check`/dedupe work rather than guessing the fallback shape.
