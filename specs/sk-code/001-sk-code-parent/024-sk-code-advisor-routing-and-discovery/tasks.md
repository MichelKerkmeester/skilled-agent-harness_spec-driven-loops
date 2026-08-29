---
title: "Tasks: sk-code advisor-routing discovery + Lane-C D3 proxy fix"
description: "Executed task list for the sk-code-local routing discovery increment: CWV and accessibility smart-routing vocabulary, word-boundary acronym replay, D3 empty-gold not-applicable scoring, schema doc refresh, playbook path repairs, benchmark reports, and scoped downstream deferrals."
trigger_phrases:
  - "phase 24 tasks"
  - "sk-code advisor routing discovery tasks"
  - "Lane-C D3 proxy tasks"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/024-sk-code-advisor-routing-and-discovery"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Task ledger recorded for shipped commit ec014f95c6"
    next_safe_action: "None; retrospective close-out docs record shipped work"
---
# Tasks: sk-code advisor-routing discovery + Lane-C D3 proxy fix

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

- [x] T001 Confirm phase-024 scope and out-of-scope boundaries [small] — scope is the sk-code-local, advisor-scorer-independent increment in commit `ec014f95c6`; downstream advisor-scorer and projection-vocabulary work is excluded
- [x] T002 Confirm discovery root cause [small] — every reference needed by the two failing discovery scenarios already existed in RESOURCE_MAP; the gap was keyword coverage
- [x] T003 Inventory missing PERFORMANCE vocabulary [small] — CWV terms `lcp`, `inp`, `cls`, `web vitals`, `interaction to next paint`, and `cumulative layout shift` needed to fire PERFORMANCE
- [x] T004 Inventory missing ACCESSIBILITY vocabulary [small] — reduced-motion and a11y vocabulary needed a new ACCESSIBILITY intent
- [x] T005 Confirm benchmark artifact conventions [small] — sk-code `router-final/` is current/regenerable; sk-design and deep-loop-workflows `baseline/` folders are frozen comparison anchors

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Update smart-routing PERFORMANCE vocabulary [medium] — `smart_routing.md` adds CWV acronyms and phrases to the PERFORMANCE intent
- [x] T007 Add ACCESSIBILITY intent [medium] — `smart_routing.md` adds reduced-motion and a11y vocabulary mapped to existing Webflow animation and verification references

### sk-design Baseline
- [x] T008 Cross-list motion performance reference [small] — `animation/performance_and_pitfalls.md` is cross-listed into MOTION_DEV
- [x] T009 Add acronym word-boundary handling [medium] — router replay treats `lcp`, `inp`, and `cls` as WORD_BOUNDARY_KEYWORDS so `inp` does not substring-fire on `input`

### deep-loop Baseline
- [x] T010 Fix D3 empty-gold scoring [large] — `scoreD3` returns null/not-applicable when a scenario declares no positive-resource gold
- [x] T011 Normalize mode A without null D3 [medium] — mode A excludes null D3 from weighted normalization using the same convention as D1-inter

### Comparison
- [x] T012 Guard D3 diagnostics [medium] — recipe-cap blocking and D3 diagnostic average guard against null

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Refresh parent-hub schema worked example [medium] — sk-doc schema doc now shows sk-code workflow modes `quality` and `code-review`, surface packets `code-webflow` and `code-opencode`, and `defaultMode: null`
- [x] T014 Correct surface-primary defaultMode rule [small] — schema doc allows `defaultMode: null` for a surface-primary hub
- [x] T015 Parse schema JSON examples [small] — all six JSON examples in the refreshed schema doc parse

### Severity Promotion
- [x] T016 Repair `cwv-gates-animation-heavy.md` expected assets [small] — dead expected-asset paths point to real `shared/references/`, `code-review/assets/`, and Webflow verification homes
- [x] T017 Repair `prefers-reduced-motion.md` expected assets [small] — dead expected-asset paths point to real `shared/references/`, `code-review/assets/`, and Webflow verification homes
- [x] T018 Verify markdown links [small] — markdown-links ran clean on all four changed docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T019 Regenerate sk-code router-final [medium] — sk-code router-mode benchmark improved aggregate 71 to 84 and verdict CONDITIONAL to PASS
- [x] T020 Add sk-design after-d3-proxy report [medium] — sk-design benchmark report records 69 to 100 without overwriting frozen `baseline/`
- [x] T021 Add deep-loop-workflows after-d3-proxy report [medium] — deep-loop-workflows benchmark report records 71 to 100 without overwriting frozen `baseline/`

### Optional Feature Catalogs
- [x] T022 [P] Advisor-scorer root fix [medium] — DEFERRED; scorer files are in the live agent's actively-worked TypeScript lane and require separate 193-row corpus re-baseline
- [x] T023 [P] Advisor projection vocabulary [medium] — DEFERRED; sk-code graph metadata/frontmatter and deep-loop-workflows advisor metadata changes are downstream of this packet
- [x] T024 [P] CS-007 JavaScript trigger expansion [medium] — DEFERRED; adding a JS trigger would re-route every Webflow `.js` scenario and was disproportionate blast radius

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T025 Verify sk-code parent and vocab gates [small] — sk-code parent-skill-check STRICT 0 and vocab-sync exit 0 with sk-code `hub-router.json` unchanged
- [x] T026 Verify router and benchmark gates [medium] — router drift-guards passed 8/8 and skill-benchmark vitest suite passed 106/107
- [x] T027 Record verification evidence in checklist.md [small] — every checklist item is checked with evidence from commit `ec014f95c6` and provided gate results
- [x] T028 Record Files Changed and Deviations in implementation-summary.md [medium] — includes commit `ec014f95c6`, benchmark deltas, known limitations, downstream boundary, and frozen-baseline deviation

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] sk-code smart routing fires CWV PERFORMANCE and ACCESSIBILITY intents against existing RESOURCE_MAP paths.
- [x] Router replay handles `lcp`, `inp`, and `cls` on word boundaries.
- [x] D3 is null/not-applicable for scenarios with no positive-resource gold and excluded from mode A normalization.
- [x] Parent-hub schema docs, cross-stack playbook expected assets, and benchmark artifact folders match the shipped state in commit `ec014f95c6`.
- [x] All recorded gates pass: parent-skill-check STRICT, vocab-sync, router drift-guards, skill-benchmark vitests, markdown links, schema JSON parsing, and benchmark reports.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
