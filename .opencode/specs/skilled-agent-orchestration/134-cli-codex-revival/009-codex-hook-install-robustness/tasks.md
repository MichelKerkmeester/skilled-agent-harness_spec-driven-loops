---
title: "Tasks: Codex hook install robustness"
description: "Task breakdown: shipped containment, the open probe, the convergent reconcile + linked-worktree refusal, the cross-runtime --check watchdog, the fail-loud emit + source dedupe, and verification."
trigger_phrases: ["Codex hook install robustness tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Containment task complete; durable-fix tasks scoped and pending approval"
    next_safe_action: "run the OPEN PROBE (T010), then implement D2/D3 (T020-T023)"
    blockers: ["Durable fix tasks are approval-gated", "OPEN PROBE (T010) unresolved"]
    completion_pct: 20
    open_questions: ["How does Codex 0.144.x treat a hook command's non-zero exit?"]
    answered_questions: []
---
# Tasks: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed (carries source or verification evidence) |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (surface · requirement)`. Containment (T001) is shipped; every durable-fix task is pending operator approval and, where noted, the OPEN PROBE.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Containment: re-anchor the 14 stale `…/.worktrees/0038-codex-hook-parity` mk command prefixes → primary checkout in `~/.codex/hooks.json`; back up first; live smoke. Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`; post-state MAIN 16 / superset 3 / worktree 0; smoke SessionStart 5/5, UPS 3/3, Stop 4/4.
- [x] T002 Two-model consult on the durable fix (SOL ultra + Fable-5), each grounded in reads of `install-codex-hooks.mjs`; adjudicate. Recorded in `decision-record.md` (ADR-001…ADR-006, ADR-008).
- [ ] T010 [B] OPEN PROBE: confirm empirically how Codex 0.144.x treats a hook command's non-zero exit (surfaces / marks Failed / ignores) {gates: T041}. Blocked on a live Codex run; recorded as owed in ADR-007.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

All Phase 2 tasks are PLANNED and APPROVAL-GATED — none are implemented. They edit only `install-codex-hooks.mjs`, the source `.codex/hooks.json`, and the repo-local Claude/OpenCode SessionStart wiring; no neutral core, adapter, or plugin is touched, and no global dispatcher/trust-record/LaunchAgent is added.

### Convergent reconcile + worktree refusal (D2/D3)
- [ ] T020 Partition `~/.codex/hooks.json` entries into mk-owned (keyed `(owner,event,matcher,hookId)`) vs preserved (Superset/user/unknown); resolve the expected primary-checkout anchor (REQ-001/REQ-002) {deps: T002}.
- [ ] T021 Rewrite the full command+anchor for each mk key on every run so a stale anchor is repaired; append exactly one entry per key (REQ-001) {deps: T020}.
- [ ] T022 [P] Write atomically via temp+rename only when content changes; keep the `.bak-<ts>` backup (REQ-007) {deps: T021}.
- [ ] T023 Add the linked-worktree anchor refusal: abort if `git rev-parse --git-common-dir` ≠ `<toplevel>/.git` unless `--allow-worktree` (REQ-003) {deps: T020}.

### Cross-runtime check watchdog (D4, resolution-independent half)
- [ ] T030 Add a non-mutating `--check` that compares the mk-owned subset against the expected anchor and reports drift without writing (REQ-005) {deps: T021}.
- [ ] T031 Wire `install-codex-hooks.mjs --check` into the repo-local Claude/OpenCode SessionStart chain; no self-repair from SessionStart (REQ-005) {deps: T030}.

### Fail-loud emit + source dedupe (D4 emit / D6)
- [ ] T041 [B] Emit an inline `|| <additionalContext: "mk codex hook unresolvable — run installer --check">` per generated entry, shaped to the OPEN PROBE result (REQ-004) {deps: T010, T021}.
- [ ] T042 [P] Dedupe the duplicated source `.codex/hooks.json` SessionStart groups (`worktree-guard.sh`, `check-git-hooks.sh` appear twice) so the reconcile is deterministic (REQ-006) {deps: T002}.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T050 Convergence test: one reconcile run re-anchors a stale-anchored fixture; a second run is a no-op; Superset entries byte-identical (REQ-001/REQ-002/REQ-007) {deps: T021, T022}.
- [ ] T051 Refusal + dedupe tests: linked-worktree run aborts (and `--allow-worktree` overrides); each duplicated source group resolves to one installed entry (REQ-003/REQ-006) {deps: T023, T042}.
- [ ] T052 Closeout: live re-run against the primary checkout; `--check` reports clean from a real SessionStart; `validate.sh --strict` Errors: 0; reconcile completion metadata; note the closeout in the 134 parent (REQ-005/REQ-008) {deps: T050, T051}.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Containment shipped: `~/.codex/hooks.json` has 0 worktree-anchored mk entries and a restorable backup; live smoke green.
- [x] The durable fix is decided and scoped: SOL vs Fable-5 adjudicated (dispatcher rejected; convergent installer adopted) in `decision-record.md`.
- [ ] The convergent reconcile + linked-worktree refusal re-anchor by identity and refuse a worktree anchor (verified).
- [ ] `--check` is wired into the durable SessionStart chain and reports drift without self-repair.
- [ ] The OPEN PROBE is resolved and the inline `||` fail-loud emit is shaped to it (or the emit is explicitly owed).
- [ ] `validate.sh --strict` green; `checklist.md` verified with evidence.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../007-codex-hook-parity/spec.md`
<!-- /ANCHOR:cross-refs -->
