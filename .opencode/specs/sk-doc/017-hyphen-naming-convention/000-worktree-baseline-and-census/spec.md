---
title: "Feature Specification: worktree, baseline, and census (017 phase 000)"
description: "The migration must be reproducible and isolated from the actively-raced main checkout. Before any change, the program pins an immutable BASE SHA, establishes a dedicated worktree with a fresh deterministic dependency install (never a symlink to the raced tree), and captures a complete baseline the later phases prove th"
trigger_phrases:
  - "worktree, baseline, and census"
  - "hyphen naming phase 000"
  - "kebab-case worktree baseline"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/000-worktree-baseline-and-census"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored for the 017 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Worktree, baseline, and census

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor none (first phase); successor `001-convention-policy-and-scope`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/000-worktree-baseline-and-census |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 000 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The migration must be reproducible and isolated from the actively-raced main checkout. Before any change, the program pins an immutable BASE SHA, establishes a dedicated worktree with a fresh deterministic dependency install (never a symlink to the raced tree), and captures a complete baseline the later phases prove themselves against.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pin an immutable BASE SHA (`git rev-parse origin/skilled/v4.0.0.0^{commit}`) and record it.
- Create the isolated migration worktree off BASE by **allocating** an owner-first branch via `.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-doc 017-hyphen-naming` (never hand-number the clone-wide counter) — yielding branch `sk-doc/{NNNN}-017-hyphen-naming` and directory `.worktrees/{NNNN}-sk-doc-017-hyphen-naming` — with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`.
- A fresh, deterministic dependency install + build in the worktree (never symlink `node_modules` or `dist`).
- Capture the baseline: naming census, symlink + file-mode manifest, test-discovery counts, recursive strict-validate output, Lane C scenario IDs + scores, and an exact/casefold/NFC collision report.

### Out of Scope
- Any rename, logic, or generator change (later phases).
- The rename map itself (phase 006).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An immutable BASE SHA is pinned and recorded for the whole program | BASE resolves to a full commit SHA and is stored in the baseline artifact |
| REQ-002 | The isolated worktree exists off BASE with its own git index and isolated DB/socket dirs | `git -C <wt> rev-parse --git-dir` differs from the main tree; DB/socket env vars point inside the worktree |
| REQ-003 | A fresh deterministic install + build succeeds in the worktree without symlinks | `realpath` on resolved deps and dist stays inside the worktree; a clean install completes |
| REQ-004 | The naming census counts only in-scope snake_case names at BASE | The census excludes .py, vendored, generated, and tool-mandated names |
| REQ-005 | The baseline records test-discovery counts, strict-validate output, and Lane C scenario IDs+scores | Each is captured to a file keyed by BASE |
| REQ-006 | A casefold/NFC collision report is produced for the census set | The report lists 0 unresolved collisions or enumerates them |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The execution is pinned to an immutable BASE with a reproducible toolchain.
- **SC-002**: A complete baseline exists for later parity checks.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
