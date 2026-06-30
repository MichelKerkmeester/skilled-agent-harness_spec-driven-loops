---
title: "Verification Checklist: Transform-verb registry aliases + interface authoring lane"
description: "Level 2 verification checklist with fix-completeness items for the transform-verb aliases, router vocabulary sync, interface authoring lane, and router-replay gold prompts."
trigger_phrases:
  - "transform verb aliases checklist"
  - "design transform routing checklist"
  - "interface transform application checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/002-transform-verb-aliases"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified all checklist items against the delivered routing, lane and gold arms"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Router consumes hub-router.json vocabularyClasses, not registry aliases, so scope was amended to include it"
---
# Verification Checklist: Transform-verb registry aliases + interface authoring lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements frozen to the spec's five-verb set
  - **Evidence**: `bolder/quieter/distill/clarify/delight` confirmed against spec, no verb added or dropped
- [x] CHK-002 [P0] Owner mode and tie-breaker direction confirmed
  - **Evidence**: interface = "make it" owner, audit = "should it be" reroute, recorded in `transformVerbRouting`
- [x] CHK-003 [P1] No-collision precondition captured
  - **Evidence**: baseline shows none of the five verbs is an existing alias on any mode, zero-collision baseline recorded

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `mode-registry.json` parses as valid JSON after edits
  - **Evidence**: JSON parse exits clean, `hub-router.json` also parses
- [x] CHK-011 [P0] Additions are append-only, no existing alias, mode, or block removed or reordered destructively
  - **Evidence**: diff shows only additive changes to the two JSON files
- [x] CHK-012 [P1] Tie-breaker block follows the registry's existing structural conventions
  - **Evidence**: `transformVerbRouting` block shape is consistent with sibling registry blocks, no schema break for the router indexer
- [x] CHK-013 [P1] Authoring lane follows the `design-process/` sibling reference style
  - **Evidence**: `transform_application.md` matches the structure of `design_principles.md` and `variation_diversity.md`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Router-replay resolves every verb's interface arm to `interface`
  - **Evidence**: hubRoute scorer over the per-verb alias gold prompts, all five route to interface
- [x] CHK-021 [P0] Router-replay resolves every audit-framed arm to `audit`
  - **Evidence**: minimal-pair audit arms ("should it be …") route to audit deterministically
- [x] CHK-022 [P0] Zero alias collisions across all modes after the additions
  - **Evidence**: drift guard collision scan returns 0, matches baseline
- [x] CHK-023 [P1] Gold prompts cover every verb AND both tie-break arms (fix-completeness)
  - **Evidence**: one alias arm per verb plus one minimal pair (interface + audit) per verb, 20 fixtures, no verb missing

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Acceptance**: instance-only — this phase adds routing vocabulary, one interface lane, and gold fixtures, and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Acceptance**: instance-only, the change set is the four named targets and an evergreen grep over them finds no spec/packet IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Acceptance**: the registry is read by `parent-hub-vocab-sync.cjs`, the hub-router by the hubRoute scorer, and `command-metadata.json` reconciliation is confirmed, no other consumer changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Acceptance**: the routing-boundary matrix is exercised by the 10 minimal-pair arms (make-it versus should-it-be) plus each arm's `forbiddenWorkflowModes` guard, with 0 regression to the prior 13 routes
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Acceptance**: matrix is 5 verbs by 2 frames (alias and audit) for 10 arms, plus the full-corpus check at 23 pass / 5 known-gap / 0 regression
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Acceptance**: not applicable, the additions are routing data and reference prose with no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Acceptance**: evidence pins to the `transformVerbRouting` block and interface aliases in `mode-registry.json`, the `audit-transform-question` class in `hub-router.json`, the lanes in `transform_application.md`, and the 20 named fixtures

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced in registry, lane doc, or fixtures
  - **Evidence**: changed files contain routing data and prose only
- [x] CHK-031 [P1] Routing surface unchanged for non-transform prompts
  - **Evidence**: hubRoute scorer held the prior 13 passing routes, additive change leaves non-transform resolutions unaffected

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Reconciliation with the command-layer task projections holds (fix-completeness)
  - **Evidence**: shared verbs `bolder/quieter/distill/delight` resolve to the same owner (`interface`) as their `command-metadata.json` task projection, `clarify` documented as alias-only with no command projection
- [x] CHK-041 [P0] Shipped artifacts are evergreen — no spec IDs, packet numbers, or finding IDs embedded (fix-completeness)
  - **Evidence**: static grep over `mode-registry.json` additions, `hub-router.json` additions, `transform_application.md`, and fixtures finds no ephemeral identifiers
- [x] CHK-042 [P1] Authoring lane is complete — a lane per verb with keep/remove ledger, before/after, and earned-moment + reduced-motion + opt-out (fix-completeness)
  - **Evidence**: all five lanes present with the shared application contract, no verb lane stubbed or omitted
- [x] CHK-043 [P2] spec/plan/tasks/checklist synchronized
  - **Evidence**: all four documents reflect the five-verb set, the four named targets, and the hub-router scope amendment

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edits confined to the named targets only (fix-completeness)
  - **Evidence**: only `mode-registry.json`, `hub-router.json`, `transform_application.md`, and the `sk-design/` gold-prompt fixtures changed, no adjacent file touched
- [x] CHK-051 [P1] No temp/scratch files left in the repo
  - **Evidence**: no temp or scratch files left, change set is the four named targets only

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered registry + hub-router additions, the interface lane, and the 20 gold fixtures (drift guard PASS, hubRoute 23 pass / 5 known-gap / 0 regression)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
