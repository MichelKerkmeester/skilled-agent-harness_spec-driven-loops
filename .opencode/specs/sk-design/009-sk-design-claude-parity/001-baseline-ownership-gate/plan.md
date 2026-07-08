---
title: "Implementation Plan: Phase 001 — Baseline Ownership Gate"
description: "Level 2 plan for baseline capture, touched-file inventory, ownership decisions, and rollback gating before sk-design refactor work."
trigger_phrases:
  - "implementation plan"
  - "baseline ownership"
  - "sk-design"
  - "gate"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate"
    last_updated_at: "2026-07-05"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Executed baseline gate: clean status, frozen benchmark, authority, rollback, thresholds recorded"
    next_safe_action: "Use this gate as the comparison baseline for later sk-design Claude-parity phases."
---
# Implementation Plan: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode skill documentation and benchmark governance |
| **Primary Area** | `.opencode/skills/sk-design/**` baseline only; no implementation writes in this phase |
| **Spec Level** | 2 |
| **Testing** | Spec validation, baseline benchmark capture, and evidence review |
| **Mutation Policy** | Documentation-only until ownership gate closure |

### Overview
This plan freezes the current `sk-design` baseline and resolves ownership of existing or uncommitted changes before refactor work starts. The phase uses read-only status collection, benchmark evidence capture, explicit owner/disposition decisions, and a named rollback plan to prevent later phases from mixing new implementation with unresolved prior state.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase folder scope is explicit and documentation-only for this authoring task.
- [x] Baseline ownership goal is documented in `spec.md`.
- [x] Current `sk-design` status has been inspected and recorded: `git status --short -- ".opencode/skills/sk-design"` returned no output.
- [x] Benchmark baseline command and artifact path are confirmed: `/tmp/skd-bench-phase001/report.json`.
- [x] Ownership authority for pending changes is identified: repository owner, delegated to this session.

### Definition of Done
- [x] Baseline snapshot is captured with command evidence.
- [x] Touched-file inventory is complete and reviewed: no scoped `sk-design` paths are touched.
- [x] Every pending change has owner, disposition, and rollback impact: empty inventory; committed baseline is `PRESERVE`.
- [x] Acceptance thresholds and release authority are recorded.
- [x] Later implementation phases are allowed only under the preservation thresholds below.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first governance gate: collect read-only facts, classify ownership, record decisions, then unlock or block implementation.

### Key Components
- **Baseline Snapshot**: Command output and benchmark artifacts that represent the starting state.
- **Touched-File Inventory**: File-level ledger of current `sk-design` changes and ownership status.
- **Ownership Decision**: Disposition for each pending change: preserve, revert, absorb, defer, or block.
- **Rollback Plan**: Non-destructive first step plus destructive fallback requiring confirmation.
- **Acceptance Thresholds**: Explicit criteria later phases must meet or escalate.

### Data Flow
1. Inspected status without mutating git or source files.
2. Recorded an empty touched-file inventory for `.opencode/skills/sk-design/**`.
3. Captured benchmark baseline and evidence paths.
4. Recorded threshold and release authority.
5. Recorded rollback procedure and stop triggers.
6. Updated checklist with evidence and stated that later implementation may begin only if it preserves the gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Status Inventory
- [x] Collect read-only `sk-design` worktree status: scoped status output was empty.
- [x] List every touched file with current state and evidence source: inventory is empty.
- [x] Flag out-of-scope paths as blockers: none found in scoped `sk-design` status/diff.

### Phase 2: Baseline and Benchmark Snapshot
- [x] Record canonical benchmark command or accepted baseline source: command is listed in the threshold table below.
- [x] Capture baseline output, timestamp, and environment notes: `/tmp/skd-bench-phase001/report.json`, generated 2026-07-05 in router mode.
- [x] Save acceptance threshold candidates for review: thresholds are accepted for later phases by delegated repository-owner authority.

### Phase 3: Ownership and Authority Decision
- [x] Assign owner and disposition for each pending change: no pending scoped `sk-design` changes; committed baseline is preserved.
- [x] Identify release authority and threshold authority: repository owner, delegated to this session.
- [x] Resolve whether pending changes are preserved, reverted, absorbed, deferred, or blocked: preserve committed packet-124 baseline; no revert/absorb/defer/block rows.

### Phase 4: Gate Marking and Handoff
- [x] Record rollback path and stop triggers.
- [x] Update checklist with evidence for P0/P1 items.
- [x] Mark later implementation as allowed only if P0 gates are closed.

### Frozen Benchmark Baseline

| Field | Value |
|-------|-------|
| Command | `node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill .opencode/skills/sk-design --outputs-dir /tmp/skd-bench-phase001 --trace-mode router --output /tmp/skd-bench-phase001/report.json` |
| Output artifact | `/tmp/skd-bench-phase001/report.json` |
| Human report | `/tmp/skd-bench-phase001/report.md` |
| Verdict | `CONDITIONAL` |
| Aggregate score | `69/100` |
| Scenario count | `21` |
| Scored scenarios | `15` passed |
| Browser scenarios | `6` routed out to live mode |
| D1 intra | `100/100` |
| D2 discovery | `100/100` |
| D3 efficiency | `0/100`, recorded as router-mode measurement gap |
| D5 connectivity | `100/100`, hard gate passed |
| Gate failures | None: hub route failed `false`; tool surface failed `false`; tool-surface violations `[]` |

### Later-Phase Acceptance Thresholds

| Area | Pass Threshold | Stop Trigger |
|------|----------------|--------------|
| Router benchmark verdict | Verdict remains `CONDITIONAL` or improves | Verdict becomes worse than `CONDITIONAL` |
| Aggregate score | Score remains `>= 69` for the same router-mode corpus | Score drops below `69` without an accepted corpus-change decision |
| D5 connectivity | D5 remains `100/100` and hard gate passes | Any D5 hard-gate failure |
| Hub routing | `hubRoute.failed=false`, `regressions=0`, `knownGaps=0` | Any hub-route regression or new known gap |
| Tool surface | `toolSurface.failed=false` and `violations=[]` | Any write/bash/edit requirement appears in read-only modes |
| Corpus coverage | 21 scenarios remain accounted for, with 15 scored and 6 browser routed out in router mode | Scenario count or classification changes without explicit decision record |
| Baseline artifact policy | New comparisons are written outside `.opencode/skills/sk-design/benchmark/baseline/` | Any attempt to overwrite the committed `benchmark/baseline/` files |

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required sections | `validate.sh --strict` |
| Baseline capture | Current benchmark state and output reproducibility | Canonical benchmark command selected during Phase 2 |
| Inventory review | Touched-file ownership and disposition completeness | Read-only git status/diff inspection |
| Governance review | Release authority, threshold authority, rollback path | Checklist evidence review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current worktree status | Evidence | Collected: scoped status and diff were empty | Later phases can treat parent hub baseline as clean at `HEAD` |
| Canonical benchmark command | Evidence | Selected and run | Later phases compare against `/tmp/skd-bench-phase001/report.json` and the committed baseline |
| User/maintainer ownership authority | Governance | Repository owner delegated to this session | Phase 001 gate can close without an open authority blocker |
| Parent parity invariants | Governance | Documented in this phase | Later phases must preserve routing, tool surfaces, graph metadata, and baseline policy |
| Strict spec validation | Documentation | To be run after evidence write | Structural errors must be fixed or reported |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any implementation write begins before preserving this gate, a later benchmark drops below the accepted thresholds, a read-only mode gains mutating tool requirements, the committed baseline is overwritten, or ownership authority changes.
- **Procedure**: Stop implementation; inspect `git diff`; compare against `HEAD` `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed`; request explicit confirmation before any checkout, revert, stash, reset, or cleanup. No commits are allowed without an explicit user request.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Status Inventory ──> Baseline Snapshot ──> Ownership Decision ──> Gate Handoff
        │                    │                    │                    │
        └──── blocks implementation until all P0 evidence is recorded ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Status Inventory | Phase docs exist | Baseline Snapshot, Ownership Decision |
| Baseline Snapshot | Status Inventory | Gate Handoff, later benchmark comparison |
| Ownership Decision | Status Inventory, authority | Gate Handoff, implementation start |
| Gate Handoff | Baseline Snapshot, Ownership Decision | Later refactor phases |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Status Inventory | Low | 20-40 minutes |
| Baseline Snapshot | Medium | 30-60 minutes |
| Ownership Decision | Medium | 30-90 minutes depending on pending changes |
| Gate Handoff | Low | 20-30 minutes |
| **Total** | | **1.5-3.5 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline artifact path recorded: `/tmp/skd-bench-phase001/report.json`.
- [x] Touched-file inventory reviewed: empty scoped status and diff.
- [x] No unowned `sk-design` file remains unresolved.
- [x] Non-destructive rollback path named: inspect `git diff` first.
- [x] Destructive rollback requires explicit confirmation: checkout against `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed` only if approved.

### Rollback Procedure
1. **Immediate**: Stop implementation work and keep the worktree unchanged.
2. **Document**: Record which gate failed and which evidence is missing.
3. **Preserve**: Avoid stash/reset/revert until user or release authority confirms ownership.
4. **Recover**: Re-run inventory after authority decision and update this phase's checklist.
5. **Resume**: Unlock later phases only after P0 gates are evidenced.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be reverted by deleting or replacing the five Phase 001 docs; source-code rollback is outside this phase unless later authorized.

<!-- /ANCHOR:l2-rollback -->
