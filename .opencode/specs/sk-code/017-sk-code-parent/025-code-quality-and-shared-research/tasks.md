---
title: "Tasks: code-quality and shared sk-code assets research close-out"
description: "Executed task list for the code-quality and shared assets research packet: scaffold, deep-research launch, ten productive iterations to the cap, per-system integration coverage, ranked synthesis, owner boundaries, load-bearing source verification, and close-out documentation."
trigger_phrases:
  - "code-quality shared research tasks"
  - "sk-code code-quality research tasks"
  - "code-quality shared assets research close-out tasks"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/025-code-quality-and-shared-research"
    last_updated_at: "2026-07-07T00:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep-research capped at ten iterations; ranked proposals and owner boundaries recorded"
    next_safe_action: "Use the ranked proposals as input to a separate implementation packet"
---
# Tasks: code-quality and shared sk-code assets research close-out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm research scope and out-of-scope implementation boundary [small] — spec.md defines REQ-01..REQ-05, success criteria, risks, edge cases, and states that implementation of accepted proposals belongs to a separate follow-up packet
- [x] T002 Scaffold the research packet [small] — packet contains `spec.md`, `description.json`, `graph-metadata.json`, and a `research/` artifact tree
- [x] T003 Confirm the two research targets [small] — research scope is the `code-quality` sub-skill and the `sk-code/shared` assets/references
- [x] T004 Identify integration and supporting context surfaces [medium] — spec-kit, skill-advisor, deep-loop/hook/benchmark seams, hub registry/router contracts, shared lifecycle references, and the manual-testing playbook were included as grounding inputs
- [x] T005 Preserve research artifact ownership [small] — close-out treats `research/` as completed deep-research output and read-only evidence

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Baseline
- [x] T006 Launch `/deep:research :auto` against the `025` spec folder [medium] — loop bound to the existing packet and externalized state
- [x] T007 Configure requested executor profile [small] — cli-opencode dispatched `openai/gpt-5.5-fast` at reasoning effort `xhigh`, 900-second per-iteration timeout, `maxIterations` 10, `minIterations` 3, convergence threshold 0.05, max-tool-calls-per-iteration 12, and progressive synthesis on
- [x] T008 Establish the baseline inventory [medium] — iteration 1 recorded that `code-quality` is an author-side Phase 1.5 gate, `sk-code` is a two-axis hub, `shared/README.md` is stale relative to the real shared references, and the enforcement scripts are concrete integration assets

### Per-System Integration
- [x] T009 Cover the system-spec-kit seam [medium] — `code-quality` loads the spec-folder authoring checklist, hands completion evidence to `check-completion.sh`, keeps continuity canonical-save owned, and delegates dist-freshness
- [x] T010 Cover the system-skill-advisor seam [medium] — keep one parent `sk-code` advisor identity, two-stage route through `mode-registry.json`/`hub-router.json`, expand quality-mode vocabulary, and keep prompt-safe recommendation evidence
- [x] T011 Cover the deep-loop, hook, and benchmark seam [medium] — `code-quality` is an upstream evidence producer for deep-review, hook output is early triage not pass evidence, and behavior-benchmark coverage belongs in the sk-code playbook not deep-loop benchmarks

### Synthesis and Boundaries
- [x] T012 Run the full productive iteration sequence [large] — ten iteration artifacts were produced: `iteration-001.md` through `iteration-010.md`
- [x] T013 Resume outer sessions as needed [medium] — fresh outer sessions continued the append-only state after the `:auto` session cap
- [x] T014 Preserve research-only implementation boundary [small] — no proposal was implemented in this packet; implementation is handed to a separate follow-up packet

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T015 Review final synthesis contents [medium] — `research/research.md` contains per-iteration synthesis, a Ranked Proposal List, Owner Boundaries, No-Change/Deferred items, and the Final Stop and Convergence note
- [x] T016 Confirm source-citation discipline [medium] — load-bearing findings carry `[SOURCE: file:line]` citations; inferences are marked `[INFERENCE: ...]`
- [x] T017 Verify load-bearing claims independently [medium] — `shared/README.md:3` reads "Placeholder ... receives real content in a later phase"; `verify-iteration.cjs` requires `deltas/iter-NNN.jsonl` with a `type: "iteration"` record (else `DELTA_FILE_MISSING`); `deep-research.md:71` allowed-write list excludes `research/deltas/*`, confirming the verifier-vs-leaf contradiction

### Severity Promotion
- [x] T018 Record final ranked deliverable [medium] — five proposals are ranked (three P1, two P2) and structured for follow-up implementation
- [x] T019 Record limitations and deferrals [medium] — capped convergence at ten iterations (`stop reason: max_iterations`), the delta-artifact contradiction deferred to deep-loop, and the missing `research/resource-map.md` deferred to the workflow/reducer are documented with reasons

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T020 Summarize proposal 1 [small] — P1 / first: replace the stale `shared/README.md` placeholder with navigation to the real shared router/phase/standards references, clarify the `code-quality` checklist-path label, and preserve the system-spec-kit checklist handoff for `.opencode/specs/` targets
- [x] T021 Summarize proposal 2 [small] — P1 / second: add a stable `code-quality` evidence handoff envelope (modified files, surface identity, checklists loaded, checker outputs, P0/P1/P2 decisions, accepted deferrals, verification handoff, remaining risk) without letting `code-quality` claim final success
- [x] T022 Summarize proposal 3 [small] — P1 / third: align hook docs so the documented pre-commit surface matches the actual comment-hygiene plus staged-agent mirror-sync gates before adding hook coverage

### Optional Feature Catalogs
- [x] T023 [P] Summarize proposal 4 [small] — P2 / fourth: tune parent router/advisor quality-mode vocabulary and scorer cases while keeping one `sk-code` advisor identity and no packet-local graph metadata
- [x] T024 [P] Summarize proposal 5 [small] — P2 / fifth: add sk-code-owned comment-hygiene hook coverage and a deep-review consumption note after the docs/schema are explicit
- [x] T025 [P] Record owner boundaries and deferrals [small] — owner boundaries assigned across `code-quality`, sk-code parent/shared, system-spec-kit, and deep-loop/runtime; delta-file ownership deferred to deep-loop and resource-map to the workflow/reducer

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T026 Record verification evidence in checklist.md [small] — every checklist item is marked `[x]` with an `[EVIDENCE: ...]` tag
- [x] T027 Record Files Changed and Deviations in implementation-summary.md [medium] — includes spec, metadata, research artifacts, four close-out docs, capped-convergence deviation, delta/resource-map artifact gaps, and implementation deferral
- [x] T028 Cross-reference spec.md, plan.md, and checklist.md [small]
- [x] T029 Self-verify close-out docs [small] — frontmatter, anchors, checkboxes, evidence, and no invented commit SHAs reviewed

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All research requirements completed through ten productive iterations and a documented capped-convergence recommendation accepted by REQ-01.
- [x] Both targets (`code-quality` and `sk-code/shared`) and the integration seams were studied with cited evidence in the research synthesis.
- [x] Ranked, evidence-grounded upgrade proposals with owner boundaries were produced in `research/research.md` for follow-up implementation.
- [x] Implementation deferral, capped convergence at ten iterations, and the delta/resource-map artifact gaps are documented as limitations rather than hidden shortfalls.
- [x] Checklist marked with execution evidence and cross-references to spec/plan/checklist are present.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
