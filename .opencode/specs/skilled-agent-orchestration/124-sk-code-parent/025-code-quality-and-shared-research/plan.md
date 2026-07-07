---
title: "Implementation Plan: code-quality and shared sk-code assets research close-out"
description: "Retrospective Level 2 plan for the bounded deep-research investigation into the sk-code code-quality sub-skill and shared assets/references, documenting the ten-iteration research method, capped convergence, ranked upgrade proposals, owner boundaries, and implementation deferrals."
trigger_phrases:
  - "code-quality shared research plan"
  - "sk-code code-quality research plan"
  - "code-quality shared assets upgrade research plan"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/025-code-quality-and-shared-research"
    last_updated_at: "2026-07-07T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep-research ran ten iterations to the cap; ranked proposals synthesized"
    next_safe_action: "Hand ranked proposals to a follow-up implementation packet"
---
# Implementation Plan: code-quality and shared sk-code assets research close-out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, YAML frontmatter, JSON spec metadata, OpenCode skill documentation |
| **Framework** | system-spec-kit Level 2 research packet, deep-research loop, sk-code `code-quality` sub-skill and `shared/` assets |
| **Storage** | Repository filesystem: `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/025-code-quality-and-shared-research/` with read-only research output under `research/` |
| **Testing** | Iteration evidence review, capped-convergence check, ranked synthesis review, load-bearing source-claim verification, strict spec validation at close-out |

### Overview
This packet closes out a research-only investigation into two targets: the `code-quality` sub-skill (`.opencode/skills/sk-code/code-quality/`) and the `sk-code/shared` assets/references it depends on. The executed work was a bounded `/deep:research :auto` loop dispatched through cli-opencode with `openai/gpt-5.5-fast` at `xhigh` reasoning, externalized JSONL state, and progressive synthesis. The loop ran the full ten productive iterations and stopped at the iteration cap (`stop reason: max_iterations`), which the synthesis records as capped-converged because the remaining work is implementation planning plus one owner-specific deep-loop contract fix rather than another broad discovery pass. The result is a ranked, evidence-cited proposal set with explicit owner boundaries and deferred items; no `code-quality`, `shared/`, or other skill asset was changed in this packet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec defines the research scope, research-only boundary, REQ-01 through REQ-05, success criteria, risks, and edge cases.
- [x] Research targets are bounded to `code-quality` and `sk-code/shared`, plus the integration seams into spec-kit, skill-advisor, deep-loops, benchmarks, and hooks.
- [x] Operator directive is explicit: run bounded deep research and produce a ranked, evidence-grounded upgrade proposal set for a later implementation packet.
- [x] Existing deep-research output under `research/` is identified as read-only close-out evidence.

### Definition of Done
- [x] The research packet is scaffolded with `spec.md`, `description.json`, `graph-metadata.json`, and a `research/` artifact tree.
- [x] `/deep:research :auto` ran ten productive iterations (`iteration-001.md` through `iteration-010.md`) and stopped at the iteration cap with a capped-converged recommendation.
- [x] `research/research.md` contains per-iteration synthesis, a final ranked proposal list, owner boundaries, no-change/deferred items, and a stop/convergence note with source citations.
- [x] Load-bearing claims are independently verified against source: the `shared/README.md` placeholder, the verifier-required `research/deltas/iter-NNN.jsonl`, and the deep-research leaf allowed-write list that excludes it.
- [x] Scoped deferrals are documented: implementation of proposals, the verifier-vs-leaf delta-artifact contradiction routed to deep-loop, and the missing `research/resource-map.md` routed to the workflow/reducer.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded research close-out with append-only iteration evidence: scaffold the packet, run one deep-research LEAF iteration per dispatch, resume against externalized JSONL state until the iteration cap, synthesize a ranked proposal set with owner boundaries, then document evidence and deferrals without implementing any proposal.

### Key Components
- **Research packet**: the `025` spec folder with `spec.md`, metadata JSON, `research/research.md`, and ten iteration markdown files.
- **Deep-research loop**: `/deep:research :auto` outer sessions dispatching the `deep-research` LEAF agent through cli-opencode.
- **Executor contract**: `openai/gpt-5.5-fast`, reasoning effort `xhigh`, 900-second per-iteration timeout, `maxIterations` 10, `minIterations` 3, `convergenceThreshold` 0.05, max-tool-calls-per-iteration 12, and progressive synthesis enabled.
- **Final proposal set**: five ranked upgrade proposals (three P1, two P2) covering docs/navigation cleanup, a stable `code-quality` evidence handoff, hook-doc alignment, parent router/advisor vocabulary, and sk-code-owned hook coverage plus a deep-review consumption note.

### Data Flow
The spec established the research questions and success criteria. Each LEAF dispatch read the `code-quality` and `shared/` surfaces plus one integration seam and wrote one iteration artifact into `research/iterations/`. Progressive synthesis accumulated findings into `research/research.md`; fresh outer sessions resumed from the append-only state when the `:auto` session cap was reached. The investigation moved from baseline inventory (iterations 1) through per-system integration seams (spec-kit, skill-advisor, deep-loop/hook/benchmark), into backlog synthesis and validation, then workflow/artifact-contract gaps and owner-boundary decisions, and finally priority/risk scoring and the capped final synthesis at iteration 10.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm scope, research-only boundary, and the out-of-scope implementation handoff.
- [x] Scaffold the research packet with `spec.md`, `description.json`, `graph-metadata.json`, and a `research/` directory.
- [x] Identify research surfaces: the `code-quality` sub-skill, the `sk-code/shared` references/assets, the hub registry/router contracts, the manual-testing playbook, and the integration seams into spec-kit, skill-advisor, deep-loops, benchmarks, and hooks.

### Phase 2: Deep-Research Loop and Per-System Integration
- [x] Launch `/deep:research :auto` bound to the `025` spec folder.
- [x] Configure cli-opencode dispatch with `openai/gpt-5.5-fast`, `xhigh` reasoning, 900-second per-iteration timeout, `maxIterations` 10, convergence threshold 0.05, and progressive synthesis.
- [x] Re-invoke fresh outer sessions against the append-only externalized state after the `:auto` session cap, preserving one LEAF iteration per dispatch.
- [x] Cover both targets plus one integration seam per iteration: baseline, system-spec-kit, system-skill-advisor, and deep-loop/hook/benchmark/general-quality.
- [x] Keep `research/` artifacts read-only for close-out authoring.

### Phase 3: Backlog Synthesis, Validation, and Owner Boundaries
- [x] Synthesize an implementation backlog from the per-system findings (iteration 5).
- [x] Validate the backlog against sibling-hub, benchmark, hook, plugin, and quality-standard sources; trim behavior-benchmark and plugin-surface proposals (iteration 6).
- [x] Surface the workflow/artifact-contract gaps, including the delta-artifact ownership blocker (iteration 7).
- [x] Assign owner boundaries and delta/resource-map artifact ownership across `code-quality`, sk-code parent/shared, system-spec-kit, and deep-loop/runtime (iteration 8).

### Phase 4: Priority Scoring, Capped Synthesis, and Close-Out
- [x] Score the trimmed backlog by priority/risk and sequence implementation (iteration 9).
- [x] Produce the final capped synthesis at iteration 10: ranked proposal list, owner boundaries, no-change/deferred items, and the `max_iterations` stop with a capped-converged recommendation.
- [x] Preserve source-citation discipline for load-bearing findings throughout `research/research.md`.
- [x] Run final close-out doc verification after the research evidence is recorded.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Research iteration evidence | `research/iterations/iteration-001.md` through `iteration-010.md` | Direct artifact review |
| Capped-convergence evidence | Iteration 10 final synthesis and stop note | `stop reason: max_iterations`, capped-converged recommendation |
| Proposal integrity | Final ranked proposal list in `research/research.md` | Source-citation review and ranking-consistency check |
| Load-bearing source verification | `shared/README.md` placeholder; `verify-iteration.cjs` delta requirement; `deep-research.md` leaf allowed-write list | Independent file check confirming the placeholder text, the `DELTA_FILE_MISSING` branch, and the absent `research/deltas/*` write target |
| Spec validation | Packet close-out docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet spec scope | Internal | Available | Research target, requirements, and implementation boundary would be ambiguous |
| deep-research LEAF workflow | Internal | Available | Iteration artifacts and progressive synthesis could not be produced under the intended contract |
| cli-opencode executor | Internal | Available | The requested GPT-5.5-fast xhigh dispatch path would be unavailable |
| `code-quality` and `sk-code/shared` surfaces | Internal | Available | Research could not cover the target skills with direct evidence |
| Follow-up implementation packet | Internal | Deferred by scope | Ranked proposals remain research output until separately implemented |
| deep-loop delta-artifact contract | Internal | Deferred to deep-loop | The verifier-required `research/deltas/iter-NNN.jsonl` conflicts with the deep-research leaf allowed-write list; loop verification stays inconsistent until resolved |
| Runtime artifact support for resource-map | Internal | Limited by contract | `research/resource-map.md` remains absent because the leaf allowed-write list excludes that target |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Close-out docs contradict the research artifacts, overstate implementation as completed, misreport the stop reason or iteration count, or omit the delta/resource-map artifact limitations.
- **Procedure**: Replace the close-out docs with corrected template-preserving versions, re-check every evidence claim against `spec.md` and `research/research.md`, keep `research/` read-only, and rerun strict spec validation before using the packet as implementation-handoff input.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Packet spec and existing research folder | Deep-research launch |
| Deep-Research Loop and Per-System Integration | Packet scaffold and executor availability | Backlog synthesis |
| Backlog Synthesis, Validation, and Owner Boundaries | Completed per-system iteration artifacts | Priority scoring and capped synthesis |
| Priority Scoring, Capped Synthesis, and Close-Out | Owner boundaries and the delta-artifact decision | Follow-up implementation packet handoff |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Bounded packet setup with careful research-only scope definition |
| Deep-Research Loop and Per-System Integration | High | Multiple fresh outer sessions required to run the LEAF loop across the integration seams against externalized state |
| Backlog Synthesis, Validation, and Owner Boundaries | High | Owner boundaries and the delta-artifact decision require artifact-level evidence review across four subsystems |
| Priority Scoring, Capped Synthesis, and Close-Out | Medium | Close-out docs must preserve template structure while recording the capped-convergence and artifact limitations honestly |
| **Total** | | **Medium-high research close-out phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record the research-only scope and the out-of-scope implementation boundary.
- [x] Record iteration count and capped-convergence evidence from `research/research.md`.
- [x] Record known-limitation evidence for the missing `research/deltas/*.jsonl` and `research/resource-map.md` artifacts and their owner routing.

### Rollback Procedure
1. Replace incorrect close-out docs with corrected docs that preserve the Level 2 anchor structure.
2. Reconcile every task/checklist/summary claim against `spec.md`, `research/research.md`, and the independent source verification evidence.
3. Keep `research/` artifacts unchanged; do not edit deep-research output during rollback.
4. Re-run strict spec validation and self-check anchors, frontmatter, checkboxes, and commit-SHA absence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Documentation-only correction of the four close-out docs; the research artifacts remain the immutable evidence source and no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
