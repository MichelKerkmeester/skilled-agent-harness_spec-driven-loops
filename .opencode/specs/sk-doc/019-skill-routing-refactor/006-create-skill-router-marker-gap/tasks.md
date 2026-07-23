---
title: "Tasks: create-skill router-marker conformance gap analysis"
description: "Analysis + interpretation + decision-framing tasks with evidence."
trigger_phrases:
  - "006 tasks router marker gap analysis"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/006-router-conformance-gap-analysis"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All analysis tasks complete"
    next_safe_action: "Operator decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: create-skill router-marker conformance gap analysis

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Run `package_skill.py --check --json` across all ten create-* packets [EVIDENCE: 10/10 errors:0; 8/10 emit the marker warning]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 Score mechanism / N/A-note / warning per packet; build the conformance table [EVIDENCE: table in implementation-summary.md]
- [x] T003 Confirm the N/A note is on disk in the flat-resource packets [EVIDENCE: create-agent + create-readme carry "does not use runtime keyed resource discovery"]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T004 Interpret the standard (warning-tier severity, create-readme precedent, mechanism intent) [EVIDENCE: verdict section]
- [x] T005 Record the keep-vs-wire decision options, costs, and recommendation [EVIDENCE: decisions section, recommends Option A]
- [ ] T006 Operator selects keep-N/A vs wire-markers (decision pending)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
Per-packet table, evidence-backed verdict, and decision framing recorded. Analysis met; the operator decision (T006) remains open by design.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./implementation-summary.md`
- `.opencode/skills/sk-doc/create-*/SKILL.md`
<!-- /ANCHOR:cross-refs -->
