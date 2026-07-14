---
title: "Tasks: Codex hook install robustness"
description: "Task breakdown: shipped containment, the open probe, the convergent reconcile + linked-worktree refusal, the cross-runtime --check watchdog, the fail-loud emit + source dedupe, and verification."
trigger_phrases: ["Codex hook install robustness tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped+verified durable convergent installer (D2/D3/D4/D6); self-test 9/9; probe resolved"
    next_safe_action: "packet complete; Part B (CLI spec consolidation) is a separate packet"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: ["Codex 0.144.4 marks a non-zero hook exit Failed but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model — so the inline || emit is valid and shipped (ADR-007 resolved)."]
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

**Task Format**: `T### [P?] Description (surface · requirement)`. Containment (T001) and every durable-fix task are shipped and verified; the probe (T010) is resolved.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Containment: re-anchor the 14 stale `…/.worktrees/0038-codex-hook-parity` mk command prefixes → primary checkout in `~/.codex/hooks.json`; back up first; live smoke. Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`; post-state MAIN 16 / superset 3 / worktree 0; smoke SessionStart 5/5, UPS 3/3, Stop 4/4.
- [x] T002 Two-model consult on the durable fix (SOL ultra + Fable-5), each grounded in reads of `install-codex-hooks.mjs`; adjudicate. Recorded in `decision-record.md` (ADR-001…ADR-006, ADR-008).
- [x] T010 OPEN PROBE: confirm empirically how Codex 0.144.x treats a hook command's non-zero exit (surfaces / marks Failed / ignores) {gates: T041}. RESOLVED via a live probe on Codex 0.144.4: exit marked Failed, session NOT aborted (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model. Recorded in ADR-007.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

All Phase 2 tasks are SHIPPED and VERIFIED. They edited only `install-codex-hooks.mjs`, the source `.codex/hooks.json`, `.claude/settings.json`, and the new repo-local plugin `.opencode/plugins/mk-codex-hooks-watchdog.js`; no neutral core, guard adapter, or existing plugin was touched, and no global dispatcher/trust-record/LaunchAgent was added.

### Convergent reconcile + worktree refusal (D2/D3)
- [x] T020 Partition `~/.codex/hooks.json` entries into mk-owned (keyed `(owner,event,matcher,hookId)`) vs preserved (Superset/user/unknown); resolve the expected primary-checkout anchor (REQ-001/REQ-002). SHIPPED in `install-codex-hooks.mjs`; self-test 9/9 PASS preserves a Superset `notify.sh` entry byte-for-byte while re-anchoring mk entries.
- [x] T021 Rewrite the full command+anchor for each mk key on every run so a stale anchor is repaired; append exactly one entry per key (REQ-001). SHIPPED; self-test 9/9 PASS re-anchors a stale mk entry and leaves exactly one canonical entry per identity; `hookIdentity()` hardened against the D4a fallback text.
- [x] T022 [P] Write atomically via temp+rename only when content changes; keep the `.bak-<ts>` backup (REQ-007). SHIPPED; a second reconcile reports `changed:false` (no write); real install backed up to `~/.codex/hooks.json.bak-2026-07-14T18-15-54-565Z` (self-test 9/9).
- [x] T023 Add the linked-worktree anchor refusal: abort if `git rev-parse --git-common-dir` ≠ `<toplevel>/.git` unless `--allow-worktree` (REQ-003). SHIPPED as `assertSafeRepoAnchor`; self-test 9/9 PASS aborts a linked-worktree `--repo` and `--allow-worktree` bypasses.

### Cross-runtime check watchdog (D4, resolution-independent half)
- [x] T030 Add a non-mutating `--check` that compares the mk-owned subset against the expected anchor and reports drift without writing (REQ-005). SHIPPED; self-test 9/9 PASS: `--check` exits 0 on a canonical target and exits 2 with a `DRIFT` report on a drifted target; real install `--check` exits 0.
- [x] T031 Wire `install-codex-hooks.mjs --check` into the repo-local Claude/OpenCode SessionStart chain; no self-repair from SessionStart (REQ-005). SHIPPED: 5th SessionStart hook in `.claude/settings.json` (non-blocking) + new `.opencode/plugins/mk-codex-hooks-watchdog.js` on `session.created` (load-tested across 5 event shapes, no throw).

### Fail-loud emit + source dedupe (D4 emit / D6)
- [x] T041 Emit an inline `|| <additionalContext>` per generated entry, shaped to the probe result (REQ-004) {deps: T010}. SHIPPED: 16 of 19 mk commands wrapped with `... || printf %s "<JSON envelope>"` (3 Superset `notify.sh` untouched); a failing adapter emits valid JSON; probe (ADR-007) confirmed the fallback reaches the model.
- [x] T042 [P] Dedupe the duplicated source `.codex/hooks.json` SessionStart groups (`worktree-guard.sh`, `check-git-hooks.sh` appear twice) so the reconcile is deterministic (REQ-006). SHIPPED: SessionStart deduped from four mk groups to two; each guard resolves to one entry.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Convergence test: one reconcile run re-anchors a stale-anchored fixture; a second run is a no-op; Superset entries byte-identical (REQ-001/REQ-002/REQ-007). PASS via installer self-test 9/9: reconcile re-anchors the stale entry, a second reconcile reports `changed:false`, and the Superset `notify.sh` entry stays byte-for-byte identical.
- [x] T051 Refusal + dedupe tests: linked-worktree run aborts (and `--allow-worktree` overrides); each duplicated source group resolves to one installed entry (REQ-003/REQ-006). PASS via self-test 9/9: the linked-worktree run aborts, `--allow-worktree` overrides, and D6 deduped SessionStart from four mk groups to two.
- [x] T052 Closeout: live re-run against the primary checkout; `--check` reports clean from a real SessionStart; `validate.sh --strict` Errors: 0; reconcile completion metadata (REQ-005/REQ-008). PASS: real install re-anchored the live `~/.codex/hooks.json`, `--check` exits 0, live `codex exec` fired SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 with 0 Failed; packet docs reconciled to Complete.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Containment shipped: `~/.codex/hooks.json` has 0 worktree-anchored mk entries and a restorable backup; live smoke green.
- [x] The durable fix is decided and scoped: SOL vs Fable-5 adjudicated (dispatcher rejected; convergent installer adopted) in `decision-record.md`.
- [x] The convergent reconcile + linked-worktree refusal re-anchor by identity and refuse a worktree anchor: shipped and verified by installer self-test 9/9 PASS.
- [x] `--check` is wired into the durable SessionStart chain and reports drift without self-repair: `.claude/settings.json` 5th SessionStart hook + `.opencode/plugins/mk-codex-hooks-watchdog.js`.
- [x] The probe is resolved (Codex 0.144.4 fail-open) and the inline `||` fail-loud emit is shaped to it and shipped in `.codex/hooks.json`.
- [x] `validate.sh --strict` green (Errors: 0); `checklist.md` verified with evidence (P0 10/10, P1 8/8).
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../007-codex-hook-parity/spec.md`
<!-- /ANCHOR:cross-refs -->
