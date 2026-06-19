---
title: "Tasks: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Task Format: T### [P?] Description (file path). All tasks PENDING — none shipped in the flat Wave-0 (030)."
trigger_phrases:
  - "retrieval class routing tasks"
  - "c2-a c2-b c2-c tasks"
  - "recall shape budget ladder tasks"
  - "iterative context extension tasks"
  - "memory mcp router tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the retrieval-class cluster"
    next_safe_action: "Build C2-A classifier as the additive third router axis"
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Retrieval-Class Routing & Recall-Shape Intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Status note**: Every task below is PENDING. None of the seven candidates in this cluster was implemented in the flat Wave-0 (packet 030) — confirmed absent from `030.../spec.md` §14 and from `git log 1ecc531431..HEAD`. The only related shipped item is the *dependency* C-X1 (`bonusOverChannels`, 030 commit `65cfcea513`), which unblocks C2-B and is therefore a prerequisite that is already satisfied, not a task here.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> C2-A retrieval-class classifier (the gate).

- [ ] T001 Define the 5-class taxonomy (SingleHop/MultiHop/Temporal/Entity/Quote), the deterministic single-class precedence order, and the neutral default class (`spec.md` §12 open question)
- [ ] T002 Create the C2-A pure classifier module `mcp_server/lib/search/retrieval-class-classifier.ts` (no I/O, no embedding call) [research: roadmap §3 C2-A]
- [ ] T003 Plumb `retrievalClass` onto `RouteResult` as an additive third axis, leaving `tier` and `classification` byte-identical (`mcp_server/lib/search/query-router.ts:46-52`)
- [ ] T004 [P] Author per-class adversarial fixtures + a totality property test (every query → exactly one class) + a multi-shape precedence test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> C2-C + C2-B (consumers of C2-A).

- [ ] T005 C2-C: extend the `preserved`/`includeDegree` primitive so a SingleHop class forces graph-off even when intent/density would preserve; MultiHop retains existing preserve (`mcp_server/lib/search/query-router.ts:238-254`) [research: roadmap §3 C2-C, PROMOTE-extend-primitive]
- [ ] T006 C2-C test: SingleHop → `preserved=false`/`includeDegree=false`; MultiHop → unchanged; minimum-channels invariant still holds (`query-router.ts:119`)
- [ ] T007 C2-B: define per-class `RetrievalProfile` and inject it into `RankedList.weight` at the pre-fusion seam, honoring `weight:0` (`mcp_server/shared/algorithms/rrf-fusion.ts:83-86, :350`) [research: roadmap §3 C2-B]
- [ ] T008 C2-B: wire fusion to run with the live `bonusOverChannels` option so zeroed channels don't distort the convergence bonus (C-X1 satisfied, `rrf-fusion.ts:99-102, :336`)
- [ ] T009 [P] C2-B test: neutral/identity profile → fused output byte-identical to baseline; a zero-weight channel does not skew survivors

### Recall-shape family (independent of C2-A; runs in parallel)

- [ ] T010 [P] LT-compaction-fallback-ladder: insert a "summarize lowest-value results" rung ABOVE hard truncation inside `enforceTokenBudget`, preserving the shipped ladder (content-trim → count-floor → metadata-stubs → binary-search compaction) (`mcp_server/handlers/memory-context.ts:492-532`) [research: 06 top-7 #6; only the LLM-summarize rung is net-new]
- [ ] T011 [P] MEM-tiered-recall-budget: replace the flat global pressure ratio with per-section + per-tier budgets (hot=full / cold=summary / dormant=metadata) (`mcp_server/lib/cognitive/pressure-monitor.ts` + `handlers/memory-context.ts`) [research: 06 top-7 #3]
- [ ] T012 CG-iterative-context-extension: add a new opt-in `memory_context` strategy key + switch case (answer-as-next-query), leaving existing modes untouched (`mcp_server/handlers/memory-context.ts`) [research: 06 top-7 #2]
- [ ] T013 CG-iterative-context-extension: build the convergence/saturation stop (the one net-new algorithm) + a hard iteration cap; gate the strategy behind a default-off flag; property test proves it always terminates
- [ ] T014 C-G2 keep-or-cut: document the overlap check vs `contextType` + the C2-A retrieval-class axis; CUT if it does not earn keep (REQ-007 gate) [research: roadmap §Provenance; 001 iter-7 F7-04]
- [ ] T015 [B] C-G2 build (only if T014 says keep): index-time auto-topic facet seeded from the existing keyword machinery, queryable as an independent recall filter (`mcp_server/handlers/chunking-orchestrator.ts:246-247` + `lib/search/artifact-routing.ts:179`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Capture the recall baseline, then prove the neutral-profile / flags-off output is byte-identical (REQ-001, REQ-003; regression-baseline rule)
- [ ] T017 Single-hop vs multi-hop integration test: C2-C graph-off for SingleHop, preserve retained for MultiHop (REQ-002)
- [ ] T018 Run `tsc`/build + the existing Memory MCP suite; per-candidate independent adversarial review; then `validate.sh --strict` on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All non-deferred tasks marked `[x]` with commit evidence
- [ ] No `[B]` blocked tasks remaining (T015 resolved to build-or-cut via T014)
- [ ] P0 acceptance criteria (REQ-001..003) verified
- [ ] Neutral-profile / flags-off regression: recall byte-identical to baseline
- [ ] `tsc`/build + existing Memory MCP suite green; `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`; `../../research/roadmap.md`; `../../research/synthesis/{01,03,06}`
- **Shipped-record (done-candidate evidence)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (cluster absent → all PENDING)
<!-- /ANCHOR:cross-refs -->
