---
title: "Acceptance Criteria: evilcharts reference research for sk-create-chart"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "phase-8-scaffold"
    recent_action: "Wrote the closure gate before dispatching the research"
    next_safe_action: "Fill each Verification cell from the finished run"
    blockers: []
    key_files:
      - "research/research.md"
      - "context/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-8-evilcharts-reference-research"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Whether the corpus should gain a dark theme"
    answered_questions:
      - "The vendored tree is pinned, so citations resolve"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: evilcharts reference research for sk-create-chart

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the reference must stay citable, When it is vendored, Then the tree is pinned to a named commit with its licence at the top | `test -f context/evilcharts/LICENSE && head -1 context/evilcharts/LICENSE` prints `MIT License`, and `context/README.md` names commit `500ecd44c1fdcf319ba83ea68f3771bc76125974` | Met | - |
| AC-002 | REQ-001 | Given a reader needs to know what was kept, When the provenance is written, Then it states the source URL, the sha, the date, the licence and anything dropped | `context/README.md` states that nothing was dropped and that the tree is 16 MB across 856 files | Met | - |
| AC-003 | REQ-002 | Given convergence is disabled, When the fan-out runs, Then each lineage completes five iterations | Both lineages hold five iteration files. The GLM lineage reached its fifth on 2026-09-03 through the runtime's own resume path, which classified the session as a resume from four and recorded a legal stop at five of five | Met | - |
| AC-004 | REQ-002 | Given two model families are used, When the run finishes, Then both lineages have their own state log and their own recorded effective config | Each lineage directory holds `invocation-metadata.json`. They name different executors and models: `cli-devin` with `deepseek-v4-flash-max`, and `cli-pi` with `z-ai/glm-5.3-flash` at `xhigh` |  Met | - |
| AC-005 | REQ-003 | Given a recommendation is ranked, When it is written, Then it cites a file and line inside the vendored tree | Every cited path resolves under `context/evilcharts/`. Four were opened and read at the exact cited line: the 0.8 stroke constant, the `3 3` dash default, the mono tabular value class, and the bar radius constant |  Met | - |
| AC-006 | REQ-003 | Given the licence permits reuse, When a recommendation is judged, Then it carries one of three verdicts | Section 3 states the verdict for its whole table, sections 4 and 5 carry one per row, and both lineage syntheses carry a verdict column |  Met | - |
| AC-007 | REQ-004 | Given the template contract forbids a build step, When a recommendation implies one, Then it says so rather than implying it fits | Section 3 carries a route column naming how each change reaches one self-contained file, and the contract-level rows are labelled as such in section 6 |  Met | - |
| AC-008 | REQ-005 | Given prose is authored here, When it is scanned, Then it carries no hard blocker | `hvr_scan.py` reports zero hard blockers on all seven authored documents |  Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:traceability -->
## 3. TRACEABILITY

| REQ | AC-IDs | User Story |
|-----|--------|------------|
| REQ-001 | AC-001, AC-002 | US-002 |
| REQ-002 | AC-003, AC-004 | US-001 |
| REQ-003 | AC-005, AC-006 | US-001 |
| REQ-004 | AC-007 | US-002 |
| REQ-005 | AC-008 | US-001 |
<!-- /ANCHOR:traceability -->
