---
title: "Implementation Plan: Phase 126 sk-code workflow sub-skill research close-out"
description: "Forward-looking Level 2 plan for closing out the bounded deep-research investigation into sk-code workflow sub-skills, documenting the research method, convergence evidence, ranked upgrade proposals, and implementation deferrals."
trigger_phrases:
  - "phase 126 research plan"
  - "sk-code workflow subskill research plan"
  - "workflow sub-skill upgrade research plan"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-sk-code-workflow-subskill-research"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep-research loop converged; ranked sk-code workflow upgrade proposals synthesized"
    next_safe_action: "Hand the ranked proposals to a separate implementation packet"
---
# Implementation Plan: Phase 126 sk-code workflow sub-skill research close-out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, YAML frontmatter, JSON spec metadata, OpenCode skill documentation |
| **Framework** | system-spec-kit Level 2 research packet, deep-research loop, sk-code workflow sub-skill lifecycle |
| **Storage** | Repository filesystem: `.opencode/specs/skilled-agent-orchestration/126-sk-code-workflow-subskill-research/` and read-only research outputs under `research/` |
| **Testing** | Iteration evidence review, convergence check, ranked synthesis review, top-finding independent verification, strict spec validation at close-out |

### Overview
This phase closes out the research-only packet for refining the four sk-code workflow sub-skills: `code-implement`, `code-quality`, `code-debug`, and `code-verify`. The implemented work was a bounded `/deep:research :auto` loop using cli-opencode with `openai/gpt-5.5-fast` at `xhigh` reasoning, externalized state, progressive synthesis, and documented convergence at iteration 8. The result is a ranked, evidence-cited proposal set for a later implementation packet; no sub-skill code or skill docs were changed in this phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 126 spec defines the research scope, out-of-scope implementation boundary, REQ-001 through REQ-005, SC-001 through SC-003, risks, and edge cases.
- [x] Research target is bounded to the four sk-code workflow sub-skills: `code-implement`, `code-quality`, `code-debug`, and `code-verify`.
- [x] Operator directive is explicit: run bounded deep research and produce ranked, evidence-grounded upgrade proposals for a later implementation packet.
- [x] Existing deep-research output under `research/` is identified as read-only close-out evidence.

### Definition of Done
- [x] The research packet is scaffolded with `spec.md`, `description.json`, `graph-metadata.json`, and a `research/` artifact tree.
- [x] `/deep:research :auto` ran eight productive iterations and documented convergence at iteration 8 with `newInfoRatio = 0.00`.
- [x] `research/research.md` contains per-iteration synthesis, final ranked upgrade proposals, validation hooks, and a convergence note with source citations.
- [x] The top proposal was independently verified against `code-verify/assets/scripts/verify_stack_folders.py`, confirming the stale `STACK_FOLDERS` architecture claim.
- [x] Scoped deferrals are documented: implementation of proposals, literal ten-iteration cap after documented convergence, missing `research/resource-map.md`, and missing `research/deltas/*.jsonl` due to deep-research write-contract limits.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded research close-out with append-only iteration evidence: scaffold the packet, run one deep-research LEAF iteration per dispatch, resume against externalized state until convergence, synthesize ranked proposals, then document evidence and deferrals without implementing the proposals.

### Key Components
- **Research packet**: Phase 126 spec folder with `spec.md`, metadata JSON, `research/research.md`, and iteration markdown files.
- **Deep-research loop**: `/deep:research :auto` outer sessions dispatching the `deep-research` LEAF agent through cli-opencode.
- **Executor contract**: `openai/gpt-5.5-fast`, reasoning effort `xhigh`, 900-second per-iteration timeout, `maxIterations` 10, `convergenceThreshold` 0.05, `stopPolicy` max-iterations, and progressive synthesis enabled.
- **Final proposal set**: Five ranked upgrade proposals covering stale verifier architecture, cross-mode handoff schema, path vocabulary normalization, parent-vs-packet precedence, and intentional overlap boundaries.

### Data Flow
The spec established the research questions and success criteria. Each LEAF dispatch read the sk-code workflow sub-skills and wrote one iteration artifact into `research/iterations/`. Progressive synthesis accumulated findings into `research/research.md`; fresh outer sessions resumed from the append-only state when the `:auto` session cap was reached. Iteration 8 produced no new proposal class, no ranking change, and no unresolved source contradiction, so the packet closed with documented convergence and a ranked handoff for implementation.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm phase-126 scope, research-only boundary, and out-of-scope implementation handoff.
- [x] Scaffold the research packet with `spec.md`, `description.json`, `graph-metadata.json`, and a `research/` directory.
- [x] Identify research surfaces: four workflow sub-skills, hub registry/router docs, shared lifecycle references, and manual-testing playbook context.

### Phase 2: Fresh Benchmark Packages
- [x] Launch `/deep:research :auto` bound to the phase-126 spec folder.
- [x] Configure cli-opencode dispatch with `openai/gpt-5.5-fast`, `xhigh` reasoning, 900-second per-iteration timeout, `maxIterations` 10, convergence threshold 0.05, max-iterations stop policy, and progressive synthesis.
- [x] Re-invoke fresh outer sessions against the append-only externalized state after the `:auto` session cap, preserving one LEAF iteration per dispatch.
- [x] Keep `research/` artifacts read-only for close-out authoring.

### Phase 3: Validator Promotion
- [x] Run eight productive iterations: `iteration-001.md` through `iteration-008.md`.
- [x] Confirm convergence at iteration 8 with `newInfoRatio = 0.00`, no new proposal class, no ranking change, and no unresolved source contradiction.
- [x] Confirm a further resume attempt produced no new iteration, reinforcing convergence rather than indicating a shortfall.
- [x] Verify the top finding against the real verifier script evidence.
- [x] Record artifact gaps and implementation deferral as known limitations.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Produce the progressive synthesis in `research/research.md` with per-iteration synthesis, final ranked proposals, validation hooks, and a convergence note.
- [x] Preserve source-citation discipline for findings in the research synthesis.
- [x] Document the final ranked proposals as the packet's key result.
- [x] Note that sibling-hub comparison was a P2 optional angle and the synthesis focused primarily on the four workflow sub-skills.
- [x] Run final close-out doc verification after research evidence is recorded.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Research iteration evidence | `research/iterations/iteration-001.md` through `iteration-008.md` | Direct artifact review |
| Convergence evidence | Iteration 8 synthesis and convergence note | `newInfoRatio = 0.00` and resume-with-no-new-iteration evidence |
| Proposal integrity | Final Ranked Upgrade Proposals in `research/research.md` | Source citation review and ranking consistency check |
| Top-finding verification | `code-verify/assets/scripts/verify_stack_folders.py` stale architecture claim | Independent file check confirming `extract_dict_literal(text, "STACK_FOLDERS")` and missing-dict error text |
| Spec validation | Phase close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 126 spec scope | Internal | Available | Research target, requirements, and implementation boundary would be ambiguous |
| deep-research LEAF workflow | Internal | Available | Iteration artifacts and progressive synthesis could not be produced under the intended contract |
| cli-opencode executor | Internal | Available | The requested GPT-5.5-fast high-reasoning dispatch path would be unavailable |
| sk-code workflow sub-skills | Internal | Available | Research could not cover the lifecycle packets with direct evidence |
| Follow-up implementation packet | Internal | Deferred by scope | Ranked proposals remain research output until separately implemented |
| Runtime artifact support for resource-map and deltas | Internal | Limited by contract | `research/resource-map.md` and `research/deltas/*.jsonl` remain absent despite complete synthesis |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Close-out docs contradict the research artifacts, overstate implementation as completed, claim a literal ten iterations despite documented convergence at eight, or omit known runtime artifact limitations.
- **Procedure**: Replace the close-out docs with corrected template-preserving versions, re-check every evidence claim against `spec.md` and `research/research.md`, keep `research/` read-only, and rerun strict spec validation before using the packet as implementation handoff input.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Phase 126 spec and existing research folder | Deep-research launch |
| Fresh Benchmark Packages | Packet scaffold and executor availability | Productive iteration sequence |
| Validator Promotion | Completed iteration artifacts and progressive synthesis | Close-out documentation |
| Parent Rollup and Optional Catalogs | Documented convergence and ranked proposals | Follow-up implementation packet handoff |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Bounded packet setup with careful research-only scope definition |
| Fresh Benchmark Packages | High | Multiple fresh outer sessions required to continue the LEAF loop against externalized state |
| Validator Promotion | Medium | Convergence and top-finding checks require artifact-level evidence review |
| Parent Rollup and Optional Catalogs | Medium | Close-out docs must preserve template structure while recording limitations honestly |
| **Total** | | **Medium-high research close-out phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record the phase-126 research-only scope and out-of-scope implementation boundary.
- [x] Record iteration and convergence evidence from `research/research.md`.
- [x] Record known limitation evidence for missing `resource-map.md` and `deltas/*.jsonl` artifacts.

### Rollback Procedure
1. Replace incorrect close-out docs with corrected docs that preserve the phase-020 Level 2 anchor structure.
2. Reconcile every task/checklist/summary claim against `spec.md`, `research/research.md`, and the supplied independent verification evidence.
3. Keep `research/` artifacts unchanged; do not edit deep-research output during rollback.
4. Re-run strict spec validation and self-check anchors, frontmatter, checkboxes, and commit-SHA absence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Documentation-only correction of the four close-out docs; the research artifacts remain the immutable evidence source and no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
