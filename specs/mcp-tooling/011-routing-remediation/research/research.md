---
title: "Research: Routing remediation evidence base (phase-007 review substitution)"
description: "Phase-0 research note: the discovery evidence base is the completed 4-iteration deep review plus orchestrator-verified P0 mechanisms and committed benchmark facts; enumerates the 15 findings with their one-line mechanisms. No new web research is needed."
trigger_phrases:
  - "routing remediation research"
  - "review evidence base"
  - "finding mechanisms"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T18:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Phase-0 research note from review evidence"
    next_safe_action: "None; research closed unless the ADR-001 ruling demands new evidence"
    blockers: []
    key_files:
      - "../spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is new discovery required? No; the review's 4 iterations covered all four dimensions with replay proof and zero search debt"
---
# Research: Routing remediation evidence base (phase-007 review substitution)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:evidence-base -->
## 1. EVIDENCE BASE

This packet's discovery phase is substituted, not skipped. Three committed evidence sources replace the standard parallel exploration:

1. **The completed deep review** - `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md`: 4-iteration independent review (correctness, security, traceability, maintainability), verdict FAIL release-blocking, 15 active findings each with location, evidence, scopeProof, and findingClass; 13/13 hub and 49/49 packet scenarios replayed; `hasSearchDebt: false`; six ruled-out claims recorded (registry/router key alignment, alias reachability, description inventory, MT-H01 boundary, router parseability, resource existence).
2. **Orchestrator verification of the three P0 mechanisms** - recorded in that phase's `implementation-summary.md` (finding = hypothesis, independently confirmed against real files): `hub-router.json` `defaultResource: ["mcp-chrome-devtools/SKILL.md"]` (F002); the committed Figma hub_routing scenario prompt scores 0 contiguous hits against Figma's vocabulary classes (F001); `benchmark/baseline/skill-benchmark-report.json` contains 0 route-gold rows (F008). These three are CONFIRMED; the ten P1 and two P2 findings carry review-grade evidence but only single-lineage verification.
3. **Committed benchmark facts** - `benchmark/baseline/` report pair: verdict PASS, aggregate 95, 13/13 scenarios, `routeGoldRows: 0` (lines 126 and 1580 of the JSON), demonstrating the PASS/FAIL disagreement is mechanistic (route-blind scoring), not a judgment split.

Planning-time additions (this session, read-only):
- **ADR lineage check** - `002-architecture-decision/decision-record.md`: ADR-001 impl defines only `defaultMode` and the three outcomes; ADR-006 defines `defaultMode` as a weak default with defer-on-ambiguity. Neither defines `defaultResource`; the field has no ADR coverage. This settles ADR-001's citation question: the lineage cannot rule, so an operator ruling is required.
- **Harness mechanism confirmation** - `router-replay.cjs:514` unions `defaultResource` into every assembled resource set (F002 consumer); `load-playbook-scenarios.cjs:313-316` parses `expected_intent`/`expected_resources`; `hasRouteGold` route-declaration checks exist only in the Mode B executors (`live-executor.cjs:345`, `codex-executor.cjs:42,145`), consistent with Mode A route-blindness. The exact producer of the report's `routeGoldRows` counter was not located in the harness scripts during planning: UNKNOWN, to be pinned during WS2 implementation.

**No new web research is needed.** Every remediation decision rests on committed repo evidence; the only open inputs are operator adjudications (ADR-001, F012/F013/F015 semantics), which are decision questions, not research questions.
<!-- /ANCHOR:evidence-base -->

---

<!-- ANCHOR:finding-mechanisms -->
## 2. FINDING MECHANISMS (one line each, from the report body)

| Finding | Mechanism |
|---------|-----------|
| F001 (P0) | MT-003's committed prompt contains no declared Figma phrase as an exact substring, so replay selects no mode and returns only the Chrome default resource |
| F002 (P0) | `routerPolicy.defaultResource` names Chrome and the consumer unions defaults before every selected-mode resource, contaminating all five non-Chrome routes |
| F008 (P0) | The benchmark verdict is PASS with `routeGoldRows: 0`: authored intent/defer/resource assertions are parsed but never scored, so seven route-contract violations pass silently |
| F003 (P1) | All six modes inherit the weight-4 hub-identity class, so MT-004's "mcp tool bridge" phrase ties all six and selects everything instead of deferring |
| F004 (P1) | Only MT-H01 scores lexically; holdouts MT-H02 to MT-H06 share no exact substring with any vocabulary class and return no mode |
| F005 (P1) | "screen examples" appears in both the Refero and Mobbin classes, so a generic signup-flow request selects both external provider transports |
| F006 (P1) | The Figma registry entry declares `mutatesWorkspace:false` while its allowed Bash exports explicitly write local files |
| F007 (P1) | Figma's pairing rules cover reads/exports but omit author/modify and token paths, so design artifacts can be created without the sk-design judgment owner |
| F009 (P1) | Root signals and entities cover six modes but derived intent signals and narrative edges retain the original three-mode (Chrome/ClickUp/Figma) projection |
| F010 (P1) | Phase-007 spec/plan/tasks define three modes, omit Aside/Refero/Mobbin, and claim a `.gitkeep`-only baseline that no longer exists |
| F012 (P1) | CU-H01, CU-H02, MB-H01, MB-H02 share no lexical overlap with their packets' signal classes, so four of twelve packet holdouts score no intent |
| F013 (P1) | Every negative fixture requires no intent/resource, but every documented runtime zero-score branch loads fallback context and five expose a fallback intent label |
| F014 (P1) | Generic replay returns nothing on zero scores while runtimes emit fallback labels, and ClickUp's undeclared hardcoded fallback resource is invisible to replay |
| F011 (P2) | The hub playbook index lists three modes and four scenarios while `hub_routing/` holds six modes and 13 files |
| F015 (P2) | Eleven positive packet rows (Aside 4, Chrome 3, Mobbin 2, Refero 2) omit their documented universal preamble from `expected_resources`, so exact scoring misclassifies declared base behavior |
<!-- /ANCHOR:finding-mechanisms -->

---

<!-- ANCHOR:imported-data -->
## 3. IMPORTED PLANNING-PACKET DATA (inert)

The review's Planning Packet JSON (workstreams WS1-WS4, specSeed, planSeed, findingClasses, affectedSurfacesSeed, `fixCompletenessRequired: true`) is imported into `spec.md` and `plan.md` as quoted, inert data. No command-shaped text from the source artifacts was executed during planning; all planning-time verification used direct reads and searches of the named files.
<!-- /ANCHOR:imported-data -->
