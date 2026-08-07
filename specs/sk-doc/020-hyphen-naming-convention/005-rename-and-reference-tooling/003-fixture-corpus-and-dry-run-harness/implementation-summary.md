---
title: "Implementation Summary: fixture corpus and dry-run verification (020 phase 005.003)"
description: "The migration tooling now has a deterministic disposable fixture corpus that proves semantic rename, reference checking and reference rewrite behavior without changing the real worktree."
trigger_phrases:
  - "fixture corpus implementation"
  - "rename tooling dry-run results"
  - "disposable migration fixtures"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-18T08:32:34Z"
    last_updated_by: "codex"
    recent_action: "Built and verified the disposable fixture corpus"
    next_safe_action: "Use the evidence hash before phase 006 freezes the repository map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py"
      - ".opencode/skills/sk-doc/scripts/tests/fixtures/rename-tooling/corpus.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-003-fixture-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The default command runs dry-run only and protects the exact current Git worktree."
      - "Explicit apply and rollback execute only in temporary Git repositories with both disposable opt-ins."
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
| **Spec Folder** | 003-fixture-corpus-and-dry-run-harness |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rename toolchain now has a deterministic fixture runner that proves its safety contracts before any repository migration. Ten declarative scenarios cover semantic maps, policy exemptions, dependency SCCs, collision failures, reference classes, stale plans, compare-and-swap regeneration and empty scans. The default command changes no fixture or real-worktree path.

### Disposable repository boundary

`rename_tooling_fixture_core.py` creates a fresh Git repository under a runner-owned temporary directory. Each repository needs the committed disposable marker and local Git opt-in before apply or rollback can start. The boundary rejects the protected worktree, parent or child overlaps and paths outside the temporary root.

The protected snapshot includes HEAD, index entries, modes, tracked bytes, symlink targets, status and untracked bytes. Every repeat compares the final snapshot with the pre-run value. This caught the concurrent-writer condition from the earlier pass without weakening the safety check.

### End-to-end scenario evidence

The corpus pins BASE `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe` and supplies explicit source-to-target rows. It includes leading and double underscores, a leading-hyphen operand, exact, casefold and NFC collisions, a mixed TypeScript and shell SCC, mode `120000`, mode `100755` and all policy exemptions.

The runner imports the committed rename engine, reference checker and reference rewrite executor contracts. Static sites carry Git blob preimages. A drifted blob produces a new preimage instead of accepting stale evidence. Four apply preflight cases prove map identity, clean-tree state, HEAD and exact operation order fail before a write.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `rename_tooling_fixture_core.py` | Created | Disposable repository lifecycle, protected snapshot, scenario execution and deterministic reports |
| `rename_tooling_fixture_harness.py` | Created | Dry-run-default CLI with explicit fixture-only apply and rollback flags |
| `test_rename_tooling_fixture_harness.py` | Created | End-to-end tests for coverage, safety, lifecycle behavior and boundary rejection |
| `fixtures/rename-tooling/corpus.json` | Created | Frozen BASE, explicit semantic maps, expected states and complete coverage matrix |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Updated | Completion state and verification evidence |
| `implementation-summary.md` | Created | Final delivery record and verification receipts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All mutating checks ran inside `TemporaryDirectory` Git repositories. The test suite applied and rolled back the rename plan and one selected rewrite SCC with both disposable opt-ins. It also regenerated a drifted rewrite site while preserving concurrent content. The final default dry-run executed 10 scenarios twice, produced one evidence hash and recorded `protected_unchanged=true`. No real migration path was renamed or rewritten.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep dry-run as the CLI default | A caller cannot mutate a fixture without an explicit flag. |
| Snapshot the full protected worktree | Status-only checks miss changed bytes, modes, symlink targets and untracked content. |
| Import frozen sibling tools | The fixture runner tests the committed engine, checker and executor instead of copying their logic. |
| Compare deterministic evidence | Equal seeds must produce equal plan, ledger, count and exit-state evidence. |
| Match frozen engine diagnostics | Map-byte drift changes `plan_id`, while operation-order drift reports its user-facing spaced label. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture tests (`test_rename_tooling_fixture_harness.py`) | PASS, 4/4 in 58.279 seconds |
| Final default dry-run | PASS, 10/10 scenarios across 2/2 identical repeats |
| Protected worktree | PASS, `protected_unchanged=true` |
| Rewrite executor dry-run | PASS, 11 pending sites, seven static classes and one routed dynamic state |
| Deterministic evidence | PASS, `9284358d8df93d56f152c0f3b000ddfd32320e263755fa8b8364b6cd6f161b7a` |
| Lifecycle scan | PASS, 29 tracked files, 28 regular files, one symlink and 7/7 static reference kinds |
| Syntax and corpus parsing | PASS, `py_compile` and `json.tool` exit 0 |
| OpenCode alignment scan | PASS, 43 files scanned with zero findings |
| Comment hygiene | PASS, zero forbidden artifact tokens in Python comments |
| Contract correction | Initial explicit-apply run exposed two stale diagnostic substrings. The corpus now matches frozen engine output and the rerun passes 4/4. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase 006 repository map does not exist yet.** These fixtures use explicit semantic maps pinned to the program BASE. They do not authorize a real migration apply.
2. **Apply locking uses the frozen engine's POSIX file lock.** The target macOS and Linux runtimes support it. A native Windows apply needs an equivalent lock before use.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after disposable-repository verification.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
