---
title: "Feature Specification: Post-review remediation of the remaining rename findings"
description: "Fix every remaining deep-review finding: route-gold refresh, phase-parent status rollup, pre-existing repairs, additive advisor vocabulary."
trigger_phrases:
  - "post review remediation"
  - "route gold refresh"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Post-Review Remediation Of The Remaining Rename Findings

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/009-post-review-remediation |
| **Level** | 2 |
| **Status** | In Progress |
| **Created** | 2026-07-28 |
| **Executors** | GPT-5.6-SOL medium (cli-codex), one dispatch per lane; orchestrator verifies and commits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The dual-model deep review left four classes of open work the rename contract deliberately deferred:
stale engine route-gold holding two hubs at BLOCKED-BY-ROUTE-GOLD 91, a spec-kit generator that never
rolls phase-parent status up from children, two pre-existing failures, and advisor vocabulary that
only speaks the pre-rename names. This phase closes all four.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane A: sk-design and sk-code skill-benchmark route-gold fixture refresh to sk- names, with a new recorded Lane C baseline.
- Lane B: derived-status rollup for phase parents in the spec-kit graph-metadata path, with tests.
- Lane C: create-benchmark family-registry repair and dead-mode name cleanup in live docs.
- Lane D: additive sk- keyword variants in the four hub advisor metadata files.

### Out of Scope
- Any further mode renames; history surfaces; removals from advisor vocabulary.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Route-gold speaks the sk- names | BLOCKED-BY-ROUTE-GOLD clears; per-scenario diff attributable only to un-blocking; sk-prompt/sk-doc gates unchanged |
| REQ-002 | Phase parents derive status from children | Rollup unit-tested; 021 and 019 parents flip; no integrity drift elsewhere |
| REQ-003 | Pre-existing failures repaired | Both Python tests pass; link set unchanged |
| REQ-004 | Advisor vocabulary is additive-forward | sk- variants added, nothing removed; parent-skill-check OK on all four hubs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All four lanes verified and committed independently; full gate matrix green with the Lane A baseline consciously re-recorded.
<!-- /ANCHOR:success-criteria -->
