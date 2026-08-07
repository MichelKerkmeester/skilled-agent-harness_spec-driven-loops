---
title: "Implementation Summary: semantic rename engine (020 phase 005.001)"
description: "The rename engine now turns a reviewed semantic map into deterministic SCC batches, blocks stale or unsafe plans and limits every mutating test to an opted-in disposable Git repository."
trigger_phrases:
  - "semantic rename engine implementation"
  - "rename engine fixture results"
  - "dry-run git mv tooling"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-20T11:09:35Z"
    last_updated_by: "codex"
    recent_action: "Built and verified the semantic rename engine"
    next_safe_action: "Consume the dry-run report in the reference checker child"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/semantic_rename_engine.py"
      - ".opencode/skills/sk-doc/shared/scripts/rename_engine_core.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_semantic_rename_engine.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-001-rename-engine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Apply and rollback require a committed fixture marker plus a local Git disposable flag."
      - "The engine executes every Git move with option-terminated path operands."
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
| **Spec Folder** | 001-rename-engine |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a rename engine that can be reviewed without moving a real repository path. You can feed it an explicit semantic map and inspect stable dependency batches, collision results, exemption reasons and per-entry states. Dry-run remains the default.

### Plan and safety boundary

`rename_engine_core.py` validates normalized repository-relative paths and explicit classifications. It rejects empty maps, unknown dependencies, path escape, source aliases and exact, casefold or NFC target collisions. It imports the existing naming resolver and guard policy instead of copying those rules.

The engine computes strongly connected components from map dependencies. Components can mix TypeScript, JSON, Markdown, shell or other mapped paths. A stable topological order puts dependency components before their consumers.

Apply binds to a plan identity built from BASE, the exact map bytes, batch membership and source-to-target order. Under an exclusive Git lock, the engine re-reads the map and re-checks HEAD, tree cleanliness, tracked sources, collisions and operation order immediately before the first move. Every Git move uses `git mv -- <source> <target>`.

### Disposable apply and recovery

Mutating actions require two repository opt-ins: a committed `.rename-engine-disposable` marker with fixed content and local Git config `rename-engine.disposable=true`. The evidence journal must live outside the fixture repository. These checks keep apply and rollback out of the working migration tree.

Apply stages mapped sources before placing their targets, which handles nested directory and file renames without hand-derived paths. The journal records every low-level move before the next one begins. Rollback replays those moves in reverse and refuses unrelated dirty paths. A second apply over an already-targeted fixture reports `already-at-target` and writes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `rename_engine_core.py` | Created | Map validation, SCC planning, collision preflight, immutable plan identity, disposable apply and journaled rollback |
| `semantic_rename_engine.py` | Created | Dry-run-default CLI with explicit apply and rollback actions |
| `test_semantic_rename_engine.py` | Created | Disposable Git fixtures for safety, mode, idempotency, failure and recovery behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All mutating evidence ran inside `TemporaryDirectory` repositories with disabled hooks and dedicated local Git configuration. The default CLI fixture compared status and index manifests before and after dry-run. Apply fixtures covered a leading-hyphen executable, a symlink, nested directory moves, injected failure and explicit rollback. No command invoked the engine's apply or rollback path against this worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require explicit targets | Leading underscores and double underscores need reviewed names. Character substitution cannot supply them safely. |
| Compute reference-graph SCCs | Cyclic references form the atomic batch. Extension-based queues would split that closure. |
| Require two fixture opt-ins | A CLI flag alone is too easy to point at the wrong repository. A committed marker plus local Git config makes the boundary visible and repository-specific. |
| Stage before final placement | Staging supports nested sources and target cycles while keeping the reviewed logical source-to-target order unchanged. |
| Keep reference writes outside this child | The engine only moves mapped paths. The separate rewrite executor owns blob-hash compare-and-swap and must regenerate any drifted rewrite. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Engine fixtures (`test_semantic_rename_engine.py`) | PASS, 17/17 |
| CLI dry-run harness (`test_cli_defaults_to_a_read_only_dry_run`) | PASS, status and index unchanged |
| Existing no-new-snake guard fixtures | PASS, 4/4 |
| Existing naming-root resolver checks | PASS, all checks |
| Python syntax, comment hygiene, line length and `git diff --check` | PASS. `ruff` was unavailable and recorded as skipped |
| Child `validate.sh --strict` | PASS, Errors 0 Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reference content is not rewritten here.** The reference checker and rewrite executor children own site discovery, preimage blob hashes and compare-and-swap regeneration. This engine refuses to infer or edit reference content.
2. **The apply lock uses POSIX `fcntl`.** The migration worktree runs on macOS or Linux. A native Windows runner would need an equivalent exclusive lock before enabling apply.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after disposable-repository verification.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
