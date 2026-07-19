---
title: "Implementation Plan: worktree, baseline, and census (020 phase 000)"
description: "Implementation Plan for phase 000 of the 020 kebab-case filesystem-naming program: worktree, baseline, and census."
trigger_phrases:
  - "worktree, baseline, and census implementation plan"
  - "hyphen naming phase 000 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored for the 020 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Worktree, baseline, and census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 000) |
| **Change class** | Setup / baseline capture |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
The migration must be reproducible and isolated from the actively-raced main checkout. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] An immutable BASE SHA is pinned and recorded for the whole program
- [ ] The isolated worktree exists off BASE with its own git index and isolated DB/socket dirs
- [ ] A fresh deterministic install + build succeeds in the worktree without symlinks
- [ ] The naming census counts only in-scope snake_case names at BASE
- [ ] The baseline records test-discovery counts, strict-validate output, and Lane C scenario IDs+scores
- [ ] A casefold/NFC collision report is produced for the census set

### Definition of Done
- [ ] The execution is pinned to an immutable BASE with a reproducible toolchain
- [ ] A complete baseline exists for later parity checks
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Pin an immutable BASE SHA (`git rev-parse origin/skilled/v4.0.0.0^{commit}`) and record it.
- Create the isolated migration worktree off BASE by allocating an owner-first branch via `.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-doc 020-hyphen-naming` (never hand-number the counter) — branch `sk-doc/{NNNN}-020-hyphen-naming`, dir `.worktrees/{NNNN}-sk-doc-020-hyphen-naming`, with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`.
- A fresh, deterministic dependency install + build in the worktree (never symlink `node_modules` or `dist`).
- Capture the baseline: naming census, symlink + file-mode manifest, test-discovery counts, recursive strict-validate output, Lane C scenario IDs + scores, and an exact/casefold/NFC collision report.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Pin an immutable BASE SHA (`git rev-parse origin/skilled/v4.0.0.0^{commit}`) and record it.
- Create the isolated migration worktree off BASE by allocating an owner-first branch via `.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-doc 020-hyphen-naming` (never hand-number the counter) — branch `sk-doc/{NNNN}-020-hyphen-naming`, dir `.worktrees/{NNNN}-sk-doc-020-hyphen-naming`, with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`.
- A fresh, deterministic dependency install + build in the worktree (never symlink `node_modules` or `dist`).
- Capture the baseline: naming census, symlink + file-mode manifest, test-discovery counts, recursive strict-validate output, Lane C scenario IDs + scores, and an exact/casefold/NFC collision report.

### Phase 3: Verification
- BASE resolves to a full commit SHA and is stored in the baseline artifact
- `git -C <wt> rev-parse --git-dir` differs from the main tree; DB/socket env vars point inside the worktree
- `realpath` on resolved deps and dist stays inside the worktree; a clean install completes
- The census excludes .py, vendored, generated, and tool-mandated names
- Each is captured to a file keyed by BASE
- The report lists 0 unresolved collisions or enumerates them
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | BASE resolves to a full commit SHA and is stored in the baseline artifact |
| REQ-002 | `git -C <wt> rev-parse --git-dir` differs from the main tree; DB/socket env vars point inside the worktree |
| REQ-003 | `realpath` on resolved deps and dist stays inside the worktree; a clean install completes |
| REQ-004 | The census excludes .py, vendored, generated, and tool-mandated names |
| REQ-005 | Each is captured to a file keyed by BASE |
| REQ-006 | The report lists 0 unresolved collisions or enumerates them |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 020 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
