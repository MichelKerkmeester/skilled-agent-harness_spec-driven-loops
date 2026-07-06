---
title: "Feature Specification: Phase 001 — Baseline Ownership Gate"
description: "Level 2 specification for freezing baseline evidence and resolving ownership before sk-design refactor work begins."
trigger_phrases:
  - "baseline"
  - "ownership"
  - "sk-design"
  - "gate"
  - "phase 001"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Closed baseline gate: clean sk-design status, frozen benchmark, authority/rollback recorded"
    next_safe_action: "Later phases proceed only while preserving frozen baseline and parent invariants from Phase 001"
---
# Feature Specification: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete - baseline ownership gate closed |
| **Created** | 2026-07-05 |
| **Phase Folder** | `.opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/` |
| **Parent Packet** | `.opencode/specs/design/009-sk-design-claude-parity/` |
| **Writable Scope** | Phase 001 documentation only; `.opencode/skills/sk-design/**` remained read-only during this phase |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | None |
| **Successor Phase** | ../002-parent-hub-compatibility-shell/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design parity refactor must not begin while existing or uncommitted `sk-design` changes have unclear ownership. Without a frozen baseline, later refactor phases could mix authored changes with pre-existing work, invalidate benchmark comparisons, or leave no reliable rollback point.

### Purpose
Create a hard ownership gate that records the current baseline, inventories touched files, assigns responsibility for pending changes, names rollback procedure, and defines acceptance thresholds before any implementation or refactor writes are allowed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture a baseline snapshot of current `sk-design` behavior and relevant benchmark state.
- Inventory touched and pending `sk-design` files before implementation work.
- Decide whether pending changes are owned by this phase, a prior phase, a user-authored change, or a later release gate.
- Define release authority and threshold authority for benchmark acceptance.
- Name rollback path and stop conditions for later phases.
- Record parent-packet invariants that later phases must preserve.

### Out of Scope
- Editing `.opencode/skills/sk-design/**`.
- Editing parent root files, sibling phases, `external/**`, or `research/**`.
- Refactor implementation, prompt rewrites, MCP changes, benchmark remediation, or agent dispatch.
- Git mutations including commit, stash, branch, merge, rebase, or reset.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/update | Phase 001 scope, requirements, success criteria, and constraints |
| `plan.md` | Create/update | Gate execution plan, evidence flow, rollback, and dependencies |
| `tasks.md` | Create/update | Pending work queue for baseline and ownership decisions |
| `checklist.md` | Create/update | P0/P1 gate checklist with required evidence |
| `implementation-summary.md` | Create/update | Completed gate state, evidence ledger, validation result, and handoff status |
| `decision-record.md` | Create | Accepted ownership, threshold, rollback, and invariant decisions for later phases |

### Evidence to Collect During Phase Execution

| Evidence | Source | Required Before Implementation? |
|----------|--------|----------------------------------|
| Current touched-file inventory | `git status --short -- ".opencode/skills/sk-design"` returned no output on 2026-07-05 | Yes |
| Current `sk-design` diff inventory | `git diff --name-status -- ".opencode/skills/sk-design"` returned no output on 2026-07-05 | Yes |
| Benchmark baseline | Fresh artifact `/tmp/skd-bench-phase001/report.json` from the canonical router benchmark | Yes |
| Ownership decision | `PRESERVE` the committed parent-hub baseline; no pending `sk-design` paths require absorb/revert/defer/block | Yes |
| Rollback path | Compare with `git diff`; destructive checkout against `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed` only after explicit confirmation | Yes |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No implementation writes before ownership is resolved | Closed: scoped status/diff were clean before docs changed; no `.opencode/skills/sk-design/**` edits were made |
| REQ-002 | Baseline snapshot captured | Closed: fresh benchmark artifact `/tmp/skd-bench-phase001/report.json`, verdict `CONDITIONAL`, aggregate `69`, scenario count `21` |
| REQ-003 | Touched-file inventory captured | Closed: inventory is empty because scoped status and diff both returned no output |
| REQ-004 | Ownership decision recorded | Closed: committed parent-hub baseline is preserved; no pending paths require ownership classification |
| REQ-005 | Rollback plan named | Closed: inspect with `git diff`; checkout against `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed` only after explicit confirmation |
| REQ-006 | Parent invariants documented | Closed: invariants are recorded below and in `decision-record.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Benchmark acceptance thresholds defined | Later router-mode benchmark must keep verdict at least `CONDITIONAL`, aggregate score `>= 69`, D5 `100`, zero hub-route/tool-surface gate failures, and no new unowned corpus changes |
| REQ-008 | Release and threshold authority identified | Repository owner, delegated to this session for Phase 001 gate closure |
| REQ-009 | Evidence collection commands listed | Commands are recorded in `plan.md`, `checklist.md`, and `implementation-summary.md`; none mutate git or `sk-design` source |
| REQ-010 | Handoff criteria documented | Later phases may proceed only while preserving the frozen baseline and parent invariants |

### Authoritative Parent Invariants for Later Phases

| Invariant | Evidence Source | Gate Decision |
|-----------|-----------------|---------------|
| `sk-design` is one parent hub routed through `mode-registry.json` to five modes: `interface`, `foundations`, `motion`, `audit`, `md-generator` | `.opencode/skills/sk-design/SKILL.md`; `.opencode/skills/sk-design/mode-registry.json` | Preserve |
| The four advisory modes use `backendKind: reference-base`, allow only `Read`, `Glob`, and `Grep`, forbid `Write`, `Edit`, and `Bash`, and set `mutatesWorkspace: false` | `.opencode/skills/sk-design/mode-registry.json` | Preserve |
| `design-md-generator` is the only mutating mode, with `backendKind: playwright-extract` and `mutatesWorkspace: true` | `.opencode/skills/sk-design/mode-registry.json` | Preserve |
| Exactly one `graph-metadata.json` exists for the whole `sk-design` skill, at the parent hub root | `.opencode/skills/sk-design/SKILL.md`; `.opencode/skills/sk-design/graph-metadata.json` | Preserve; never add mode-packet graph metadata |
| The committed benchmark baseline under `.opencode/skills/sk-design/benchmark/baseline/` remains the packet-local comparison anchor | `.opencode/skills/sk-design/benchmark/README.md`; fresh `/tmp/skd-bench-phase001/report.json` | Preserve; never overwrite `benchmark/baseline/` |
| The manual testing playbook contains 21 scenarios across five categories | `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Preserve coverage unless a later phase records an explicit corpus-change decision |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No code or skill implementation file changes occur before the baseline ownership gate is closed.
- **SC-002**: Baseline snapshot and benchmark evidence are recorded with enough detail for later replay.
- **SC-003**: Touched files have explicit owner, disposition, and rollback impact.
- **SC-004**: Later phases receive acceptance thresholds and stop conditions before implementation begins.
- **SC-005**: Phase documents state complete status after evidence proves the gate is closed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pre-existing changes are accidentally absorbed | Refactor authorship becomes unclear | Require owner/disposition row per touched file |
| Risk | Baseline command differs from later benchmark command | Threshold comparison becomes invalid | Record exact command, environment, and artifact path |
| Risk | Rollback path depends on uncommitted work | Reversal can destroy unrelated changes | Name non-destructive rollback first; ask before destructive action |
| Dependency | User or maintainer authority | Ownership decisions may be blocked | Record unresolved authority as a P0 blocker |
| Dependency | Parent parity intent | Later phases may optimize the wrong target | Preserve parent invariants in the gate docs |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Each baseline artifact must have a source command or file path.
- **NFR-T02**: Each ownership decision must name the responsible authority or mark it blocked.

### Safety
- **NFR-S01**: No git mutation is allowed during baseline evidence collection.
- **NFR-S02**: Destructive rollback requires a named undo path and explicit confirmation.

### Repeatability
- **NFR-R01**: Benchmark evidence must be replayable by later phases.
- **NFR-R02**: Acceptance thresholds must be expressed as pass/fail criteria, not narrative preference.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **No touched `sk-design` files**: Record an empty inventory with command evidence and close the ownership branch.
- **Touched files outside `sk-design`**: Record them as out-of-scope blockers rather than absorbing them into this phase.
- **Generated benchmark outputs**: Store only approved evidence paths; do not mutate source or benchmark fixtures during capture.

### Error Scenarios
- **Git status unavailable**: Mark baseline capture blocked and do not proceed to implementation.
- **Benchmark command unavailable**: Record the missing command as a P1 blocker unless user approves a documented deferral.
- **Ownership authority unavailable**: Keep the phase blocked and do not unlock later implementation.

### Concurrent Operations
- **User changes files during gate execution**: Re-run inventory before closure and update the owner/disposition table.
- **Sibling phase writes occur**: Treat sibling evidence as external context; do not edit sibling phase docs from this phase.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

| Question | Resolution | Evidence |
|----------|------------|----------|
| Who has final authority to accept benchmark threshold deltas? | Repository owner, delegated to this session for the Phase 001 gate. | User instruction: release/threshold authority is repository owner delegated to this session. |
| Which pending `sk-design` changes, if any, are user-authored and must be preserved? | No pending scoped `sk-design` changes were present; preserve the committed parent-hub baseline. | `git status --short -- ".opencode/skills/sk-design"` and `git diff --name-status -- ".opencode/skills/sk-design"` returned no output. |
| Which exact benchmark command is canonical for the parity baseline? | `node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill .opencode/skills/sk-design --outputs-dir /tmp/skd-bench-phase001 --trace-mode router --output /tmp/skd-bench-phase001/report.json` | Fresh run produced `/tmp/skd-bench-phase001/report.json` with verdict `CONDITIONAL`, aggregate `69`, and `21` scenarios. |

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
