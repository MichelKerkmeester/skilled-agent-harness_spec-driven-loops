---
title: "Implementation Plan: integrate and close out (032 phase 011)"
description: "Implementation Plan for phase 011 of the 032 kebab-case filesystem-naming program: rebase onto the latest base, rerun the complete phase 010 gate, fast-forward the integration target, and reconcile final packet state."
trigger_phrases:
  - "integrate and close out implementation plan"
  - "hyphen naming phase 011 implementation plan"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the rebase, gate-rerun, fast-forward, and closeout sequence"
    next_safe_action: "Start from the green phase 010 candidate and record the latest base SHA"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/checklist.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The post-rebase candidate, not the pre-rebase head, is the only candidate eligible for integration."
---
# Implementation Plan: Integrate and close out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Migration branch, integration worktree, and 032 packet rollup (phase 011) |
| **Change class** | Integration, final verification, and documentation closeout |
| **Execution** | Rebase latest base, rerun phase 010, then fast-forward only |

### Overview
This phase treats base integration as a new verification boundary. It records the latest base, rebases the migration branch, reruns the exact whole-repo gate on the resulting candidate, and advances the target only when that candidate passes. The final step reconciles phase and parent documentation so the packet's status reflects the integrated commit rather than an earlier branch head.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 010 has a green report with its candidate SHA, BASE SHA, map hash, and complete evidence.
- [ ] The latest integration base can be fetched and its SHA recorded in a clean integration worktree.
- [ ] The approved policy, frozen map, and phase 010 command matrix are available for conflict resolution and gate rerun.

### Definition of Done
- [ ] The migration branch is rebased onto the latest base with no unresolved conflicts.
- [ ] The unchanged phase 010 gate passes on the post-rebase candidate.
- [ ] The target advances via fast-forward-only integration and the final worktree is clean.
- [ ] Phase and parent rollup metadata, checklists, and handoff evidence agree on the final state.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Base identity**: record `B_latest`, the pre-rebase migration head, the post-rebase candidate, and the final integrated commit.
- **Rebase boundary**: resolve conflicts in the integration worktree using the 032 policy and frozen map; stop on ambiguous ownership or scope.
- **Gate reuse**: invoke the phase 010 checklist and measurement contract unchanged, with all outputs tied to the post-rebase candidate.
- **Linear integration**: use a fast-forward-only target update after the gate; a merge commit or forced update is a failure.
- **Closeout rollup**: reconcile the child phase states and parent outcome from the final commit and evidence, then record the next packet state.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the phase 010 candidate and fetch the latest integration base.
- [ ] Create the clean integration worktree and record all pre-rebase commit identities.

### Phase 2: Core Implementation
- [ ] Rebase the migration branch onto the latest base; resolve only conflicts required to preserve the approved migration and policy.
- [ ] Reconcile the frozen rename map, references, exemptions, and phase documents after conflict resolution.
- [ ] Fast-forward the integration target only after the post-rebase gate passes.

### Phase 3: Verification
- [ ] Rerun every phase 010 naming, reference, Git-history, validation, build, typecheck, test, discovery, import/path/link, and benchmark check.
- [ ] Confirm the final integrated commit equals the gate-passed candidate and the worktree is clean.
- [ ] Update the child evidence and parent rollup so status, completion, and continuation fields agree.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Record latest base and all pre/post-rebase SHAs; inspect the rebase result and conflict resolutions against the policy/map. |
| REQ-002 | Run the phase 010 checklist unchanged on the post-rebase candidate; require all P0 domains and the final report to pass. |
| REQ-003 | Perform the target update with fast-forward-only semantics and inspect history for the expected linear transition. |
| REQ-004 | Compare phase 009/010/011 checklists, evidence, summaries, and parent rollup; resolve any conflicting status before closeout. |
| REQ-005 | Run the final clean-state check and record the integrated commit and reproducibility inputs. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on the green phase 010 report, the latest base ref, a clean integration worktree, the immutable baseline and frozen map, and the parent packet's phase map. A changed base, rebase conflict, gate failure, or dirty worktree blocks fast-forward and closeout.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before rebasing or advancing the target, record the migration head and target refs. If rebase conflicts cannot be resolved unambiguously, abort the rebase and leave the target unchanged. If the post-rebase gate fails, do not fast-forward; return the candidate to the owning phase. If a fast-forward must be reverted after an external integration decision, use the recorded refs and a reviewed revert, then rerun the gate before any replacement integration.
<!-- /ANCHOR:rollback -->
