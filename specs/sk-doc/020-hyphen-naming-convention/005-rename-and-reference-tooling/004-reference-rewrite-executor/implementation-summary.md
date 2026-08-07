---
title: "Implementation Summary: static reference-rewrite executor (020 phase 005.004)"
description: "The executor now converts accepted ledger sites and an explicit semantic map into deterministic SCC rewrite plans with blob-hash compare-and-swap, fixture-only apply and journaled rollback."
trigger_phrases:
  - "reference rewrite executor implementation"
  - "compare and swap rewrite results"
  - "disposable rewrite fixture"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-18T08:08:15Z"
    last_updated_by: "codex"
    recent_action: "Built and verified the static reference-rewrite executor"
    next_safe_action: "Supply the phase 006 frozen map to a reviewed dry-run"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_executor.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_reference_rewrite_executor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-004-reference-rewrite-executor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The executor consumes checker-owned static sites and never discovers extra rewrite targets."
      - "Apply and rollback require both disposable repository opt-ins and external evidence files."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-reference-rewrite-executor |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a deterministic executor for static reference sites already accepted by the checker. You can inspect a dry-run plan for one dependency SCC without changing the repository. Explicit apply and rollback remain confined to opted-in disposable Git fixtures.

### Deterministic planning and CAS

`reference_rewrite_core.py` loads the checker ledger and the rename engine's exact semantic-map contract. It binds each plan to pinned BASE and HEAD values, the exact map-byte hash, operation-set hash, ordered source-to-target rows, ledger hash, SCC membership and static site plan. A zero-file ledger fails before planning.

Each planned static site carries its current Git blob hash, semantic site ID, map ID, source value and explicit replacement. If the blob changes, the executor re-extracts that ledger-owned site from the current blob. It applies the regenerated span only when the site remains unique. It never forces a stale patch or discovers an off-ledger replacement.

### Fixture-only apply and recovery

Dry-run is the CLI default. Apply and rollback require a committed `.rename-engine-disposable` marker, local Git config `rename-engine.disposable=true` and map, ledger, plan and journal files outside the fixture repository. An exclusive Git lock protects the final HEAD, map, clean-tree, source-target and operation-order revalidation.

Writes use atomic file replacement and preserve regular-file permissions. Symlink targets remain mode `120000`. The journal records preimage and postimage bytes plus their hashes before each write. A failed apply returns non-zero after replaying completed writes in reverse. Explicit rollback repeats the postimage CAS before restoring each preimage.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `reference_rewrite_core.py` | Created | Ledger-bounded planning, immutable identity, CAS regeneration, fixture apply and rollback |
| `reference_rewrite_executor.py` | Created | Dry-run-default CLI with explicit fixture apply and rollback |
| `test_reference_rewrite_executor.py` | Created | Disposable Git coverage for static classes, drift, safety gates, modes and recovery |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All mutating evidence ran in `TemporaryDirectory` Git repositories with both disposable opt-ins. The independent dry-run harness planned 11 rewrites across seven static reference classes and reported `working_tree_unchanged=true`. Apply tests covered idempotency, post-plan blob drift, SCC isolation, leading-hyphen operands, executable modes, symlink targets, injected failure and explicit rollback. No apply or rollback command targeted this worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Consume checker sites only | The checker owns discovery and dispositions. The executor must not widen the reviewed rewrite set. |
| Import both sibling contracts | Shared loaders keep map bytes, collisions, path policy and ledger validation aligned. |
| Regenerate on blob drift | A current-blob extraction preserves concurrent edits while rejecting stale textual spans. |
| Revalidate under an exclusive Git lock | HEAD, map identity, tree cleanliness, SCC membership and operation order must describe the same pre-write state. |
| Keep plans and journals outside fixtures | Evidence writes must not invalidate the clean-tree identity they prove. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Executor fixtures (`test_reference_rewrite_executor.py`) | PASS, 9/9 |
| Frozen rename engine and checker suites | PASS, 26/26 |
| Disposable dry-run harness | PASS, 11 pending rewrites, seven static classes and unchanged tree |
| Python syntax, AST style, alignment drift and comment hygiene | PASS, zero findings |
| `git diff --check` | PASS |
| Child `validate.sh --strict` | PASS, Errors 0 and Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The real frozen map is not an input yet.** Phase 006 owns that artifact. This child proves the contract with explicit fixture maps and performs no real migration rewrite.
2. **The apply lock uses POSIX `fcntl`.** The target migration runtime is macOS or Linux. A native Windows runner needs an equivalent exclusive lock before apply can be enabled there.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after disposable-repository verification.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
