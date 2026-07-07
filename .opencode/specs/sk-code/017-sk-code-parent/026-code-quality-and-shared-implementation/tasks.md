---
title: "Tasks: code-quality + shared-assets research backlog implementation"
description: "Executed task ledger for implementing the five ranked proposals: shared/README navigation rewrite, checklist-label fix, hook-doc two-gate alignment, advisory CODE_QUALITY_RESULT v1 envelope, comment-hygiene hook coverage (TH-002) plus deep-review consumption note, additive quality-mode router/advisor vocabulary, two consistency reconciliations, and scoped deferrals to the advisor and deep-loop lanes."
trigger_phrases:
  - "code-quality shared implementation tasks"
  - "sk-code code-quality implementation tasks"
  - "code-quality shared assets implementation tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/026-code-quality-and-shared-implementation"
    last_updated_at: "2026-07-07T14:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the executed task ledger for the five proposals' un-gated scope"
    next_safe_action: "Verify the checklist evidence rows and validate --strict"
---
# Tasks: code-quality + shared-assets research backlog implementation

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

- [x] T001 Confirm the un-gated scope of all five ranked proposals [small] — spec.md defines REQ-001..REQ-007, the GATED advisor-fixture slice, and the two deep-loop contract bugs as out of scope
- [x] T002 Verify each premise on the live branch [medium] — stale `shared/README.md`, `opencode-checklists` display label, comment-hygiene-only hook docs, absent evidence envelope, uncovered comment-hygiene hook branch, and thin quality vocabulary all confirmed present
- [x] T003 Confirm the envelope precedent [small] — `.opencode/agents/code.md` carries the `AGENT_IO_RESULT v1` optional envelope to mirror
- [x] T004 Isolate other-lane deferrals [small] — the advisor-fixture rows in `intent-prompt-corpus.ts` and the two deep-loop contract bugs are assigned to their owning lanes
- [x] T005 Confirm the out-of-scope concurrent-dirty file [small] — `shared/assets/patterns/README.md` stale self-path is noted for a later pass and left untouched

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Proposal A — docs & navigation (P1/first)
- [x] T006 Rewrite `sk-code/shared/README.md` into a navigation index [medium] — placeholder replaced with links across `references/` (stack detection, smart routing, phase detection), workflow doctrine, checklists, and `references/universal/` standards; frontmatter version 1.0.0.0 → 1.0.0.1
- [x] T007 Fix the checklist display label [small] — `assets/opencode-checklists/` → `assets/checklists/` in `code-quality/SKILL.md` and `code-quality/README.md`; hrefs and the system-spec-kit checklist handoff preserved

### Proposal B — hook-doc alignment (P1/third)
- [x] T008 Align `.opencode/hooks/README.md` to two gates [medium] — description, overview, files table, ASCII diagram (Gate A comment-hygiene / Gate B agent-mirror-sync), and BOUNDARIES/fail-open row all reframed as two independent gates
- [x] T009 Add the mirror-sync note to `code-quality/SKILL.md` [small] — one sentence noting the pre-commit hook additionally enforces the staged agent-mirror-sync gate

### Proposal C — advisory evidence envelope (P1/second)
- [x] T010 Add the `CODE_QUALITY_RESULT v1` envelope to `code-quality/SKILL.md` Section 3 [medium] — ten fields, `status: advisory` (never pass/success), guardrail that its presence never reads as a completion claim and never replaces the `workflow_verify.md` handoff; mirrors `code.md`'s `AGENT_IO_RESULT v1`

### Proposal D — hook coverage + deep-review note (P2/fifth)
- [x] T011 Add manual scenario `TH-002` to playbook §15 [medium] — comment-hygiene hook branch with live-captured markers, mirroring the TH-001 nine-column table
- [x] T012 Create `09--tooling-and-hooks/comment-hygiene-hook.md` [medium] — per-feature file including the deep-review consumption note mapping the envelope onto deep-review traceability + P0/P1/P2 verdict, without making `code-quality` a deep-loop mode
- [x] T013 Reconcile playbook §16 gap, §17 index, and totals [small] — scenarios 29 → 30; categories stay 9

### Proposal E — router/advisor vocab, sk-code slice (P2/fourth)
- [x] T014 Add quality-mode aliases to `mode-registry.json` [small] — five phrases: "quality check", "check before done", "author quality gate", "pre-verification quality check", "p0 p1 p2 review"
- [x] T015 Add matching router vocab to `hub-router.json` [small] — quality keywords synced with the registry aliases
- [x] T016 Add quality-mode phrases to `graph-metadata.json` [small] — top-level `intent_signals` plus derived trigger phrases/key topics; one `sk-code` advisor identity, no packet-local metadata

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T017 Verify display-label removal [small] — `grep -c opencode-checklists` returns 0 in both `code-quality/SKILL.md` and `code-quality/README.md`
- [x] T018 Verify hook-doc two-gate coverage [small] — both gates named across all five spots plus the fail-open row in `.opencode/hooks/README.md`
- [x] T019 Verify the envelope guardrail [small] — `code-quality/SKILL.md` Section 3 fixes `status` to `advisory` and restates the no-success-claim/verification-handoff guardrail

### Severity Promotion
- [x] T020 Run the vocabulary and parent drift-guards [medium] — vocab-sync score 100 / driftDetected false; parent-skill-check STRICT 0 warnings; sk-code router-sync vitest 4/4
- [x] T021 Verify playbook internal consistency [small] — §15 TH-002 present, totals 30 scenarios / 9 categories, §5 figure reconciled

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T022 Reconcile playbook §5 coverage figure [small] — 28 → 30 so the release-readiness rule describes the current scenario count
- [x] T023 Repoint the dist-staleness cross-reference [small] — `check-dist-staleness-hook.md` "Related" now points to TH-002, retiring its "no scenario exists" claim
- [x] T024 Register 026 under the 124 parent [small] — append to `children_ids` and set `derived.last_active_child_id` in the parent `graph-metadata.json`

### Optional Feature Catalogs
- [x] T025 [P] Record the GATED advisor-fixture deferral [small] — DEFERRED WITH REASON — new quality-mode rows in `intent-prompt-corpus.ts` cross into the advisor lane and need the coordinated 193-row re-baseline
- [x] T026 [P] Record the two deep-loop contract-bug deferrals [small] — DEFERRED WITH REASON — `verify-iteration.cjs` delta requirement and the `resource_map.emit` write gap are owned by deep-loop in a separate packet
- [x] T027 [P] Record the out-of-scope patterns README flag [small] — LEFT UNTOUCHED — `shared/assets/patterns/README.md` stale self-path is a concurrent-dirty file noted for a later pass

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T028 Record verification evidence in checklist.md [small] — every checklist item checked with an `[EVIDENCE: ...]` tag citing the shipped files and drift-guard results
- [x] T029 Record Files Changed and Deviations in implementation-summary.md [medium] — ten implementation files plus close-out docs, drift-guard evidence, deferrals, and deviations
- [x] T030 Reconcile completion metadata [small] — implementation-summary.md top-level `status: complete` and `completion_pct: 100`; spec.md METADATA status Complete
- [x] T031 Cross-reference spec.md, plan.md, and checklist.md [small]

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All five proposals' un-gated scope is implemented across the ten target files.
- [x] The display label, hook-doc gate count, evidence envelope, hook coverage, and quality vocabulary all describe reality and pass their respective checks.
- [x] Playbook totals read 30 scenarios / 9 categories with the §5 figure and dist-staleness cross-reference reconciled.
- [x] Drift-guards are green: vocab-sync 100, parent-skill-check STRICT 0, router-sync vitest 4/4.
- [x] The advisor-fixture slice and two deep-loop contract bugs are documented as owned by other lanes; `shared/assets/patterns/README.md` is untouched.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
