---
title: "Feature Specification: Spec Root Resolution Hardening"
description: "Research canonical and legacy spec-root resolution before a regression-safe hardening plan."
trigger_phrases:
  - "spec root resolution"
  - "specs symlink"
  - "canonical specs root"
  - "legacy specs root"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Spec Root Resolution Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Research complete |
| **Created** | 2026-07-17 |
| **Branch** | Current worktree |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec Kit has at least two root-resolution implementations with different precedence. A repository-root `specs` symlink currently makes the legacy and canonical roots resolve to the same inode, potentially masking split-brain writes when the symlink is absent.

### Purpose

Produce a cited, regression-safe recommendation for deterministic spec-root ownership across scripts, MCP-server code, hooks, and automatic writers.

### Research Context

Deep research completed at the requested ten-iteration cap. `research/research.md` is the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Canonical-first is the recommended default for unqualified spec-root selection, with explicit-path preservation during migration, unique legacy-only read fallback, and fail-closed handling for divergent duplicates. The current `specs` symlink masks mixed per-function precedence and is not a safe runtime dependency: its tracked payload is machine-specific, and it is unsafe for fresh clones, linked worktrees, archives, and symlink-disabled checkouts.

The regression-safe deployment order is data before writers: establish an explicit resolver/fixture contract, inventory and canonicalize packet ownership under a writer freeze, deploy canonical automatic writers and collision guards as one source+dist bundle, normalize readers to canonical-first with read-only legacy fallback, and retire the alias only after a clean compatibility window plus Linux/macOS/Windows no-alias validation. The bounded research found additional independent resolver families in its final audit, so implementation must maintain a central resolver registry rather than claim exhaustive coverage from literal search alone.

See `research/research.md` for the verified per-function inventory, automatic-writer failure matrix, S0-S5 migration and rollback transaction, R1-R10 fixture model, L1-L4 blocking lanes, eliminated alternatives, confidence levels, and residual unknowns.
<!-- END GENERATED: deep-research/spec-findings -->

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->
### In Scope

- Root-resolution definitions and every direct call site.
- Legacy-first versus canonical-first precedence and compatibility consequences.
- Provenance, maintenance, intent, and portability of the root `specs` symlink.
- Symlink-absent behavior of automatic writers, especially session-stop autosave.
- Ranked remediation, migration, rollback, and dual-environment validation.

### Out of Scope

- Implementing resolver changes during research.
- Deleting or replacing the symlink during research.
- Unrelated Spec Kit cleanup.

### Files to Change

Research artifacts under this packet only. Implementation files will be selected by a later planning step.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enumerate root-resolution call sites | Every material definition and caller has a file:line citation and precedence classification. |
| REQ-002 | Decide the universal precedence contract | The recommendation weighs canonical-first against concrete legacy compatibility evidence. |
| REQ-003 | Explain the symlink lifecycle | Creation, maintenance, intent, and cross-platform safety are evidenced or explicitly marked unknown. |
| REQ-004 | Characterize symlink-absent auto-writer behavior | Each automatic writer has a traced destination or failure mode. |
| REQ-005 | Produce a regression-safe remediation | The result includes ranked changes, migration, rollback, and validation with and without the symlink. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The final synthesis distinguishes confirmed evidence from inference.
- **SC-002**: The proposed validation matrix catches split-root reads and writes in both symlink states.
- **SC-003**: The recommendation names likely regressions and a reversible rollout sequence.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Symlink masks divergent write roots | Current tests may pass while clean checkouts fail | Test isolated fixtures with and without a symlink. |
| Risk | Legacy packet consumers depend on `specs/` | Canonical-first changes could hide or strand data | Inventory readers and persisted references before migration. |
| Dependency | Automatic hook behavior | Session-stop writes can occur outside explicit commands | Trace hook configuration through the writer entrypoint. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which root-resolution call sites are legacy-first, canonical-first, or multi-root?
- Which consumer behavior would change under canonical-first resolution?
- What creates and maintains the `specs` symlink?
- Which automatic writers misroute or fail when the symlink is absent?
- What rollout and validation sequence is safest?

<!-- /ANCHOR:questions -->
