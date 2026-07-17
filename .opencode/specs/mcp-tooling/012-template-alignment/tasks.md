---
title: "Tasks: Align new MCP tooling packet documentation to canonical templates"
description: "Completed audit, remediation, exception, and verification tasks for the three-lane MCP packet template-alignment cycle."
trigger_phrases:
  - "template alignment tasks"
  - "deep alignment audit tasks"
  - "mcp docs remediation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/012-template-alignment"
    last_updated_at: "2026-07-17T08:07:47Z"
    last_updated_by: "codex"
    recent_action: "Closed template alignment packet"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/012-template-alignment/alignment/alignment-report.md"
      - ".opencode/specs/mcp-tooling/012-template-alignment/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-alignment-closeout-20260717"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Filename advisories are accepted, not pending."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Align new MCP tooling packet documentation to canonical templates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [evidence: concrete receipt]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold one `/deep:alignment:auto` lane for each of asIDE DevTools, Refero, and Mobbin. [evidence: 3-of-3 applicable lanes in `alignment/alignment-report.md:9`]
- [x] T002 Bind all lanes to `sk-doc` / `docs` authority and the packet asset, reference, and script README paths. [evidence: 3-of-3 lane headers in `alignment/alignment-report.md:14`]
- [x] T003 Configure the operator-directed remediation executor as `cli-codex gpt-5.6-sol` with high reasoning and fast service tier. [evidence: `alignment/dispatch-receipts/dispatch-alignment-i1-g1.completion.json:1`]
- [x] T004 Run Audit 1 and capture the baseline FAIL verdict. [evidence: P0 14 / P1 0 / P2 3 in `alignment_archive/20260717T070423Z/alignment-report.md:10`]
- [x] T005 Classify Audit 1 as 14 missing-overview blockers and 3 below-floor README DQI advisories. [evidence: 14-of-14 P0 and 3-of-3 P2 findings in `alignment_archive/20260717T070423Z/alignment-report.md:11`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add `## 1. OVERVIEW` with Purpose and Usage to the 11 affected asset/reference documents. [evidence: 11-of-11 documents remediated; Audit 2 P0 0 in `alignment_archive/20260717T073523Z/alignment-report.md:11`]
- [x] T007 [P] Restructure the asIDE DevTools script README to the six-section create-readme code-folder scaffold. [evidence: 1-of-3 README remediations; lane PASS in `alignment_archive/20260717T073523Z/alignment-report.md:16`]
- [x] T008 [P] Restructure the Refero script README to the six-section create-readme code-folder scaffold. [evidence: 2-of-3 README remediations; lane PASS in `alignment_archive/20260717T073523Z/alignment-report.md:26`]
- [x] T009 [P] Restructure the Mobbin script README to the six-section create-readme code-folder scaffold. [evidence: 3-of-3 README remediations; Audit 2 P0 0 in `alignment_archive/20260717T073523Z/alignment-report.md:11`]
- [x] T010 Confirm all three README DQI scores rose from approximately 52 to 76 or higher. [evidence: 3/3 README DQI checks above the 75 floor]
- [x] T011 Run Audit 2 and capture the CONDITIONAL verdict with asIDE DevTools PASS, Refero PASS, and Mobbin CONDITIONAL. [evidence: P0 0 / P1 3 / P2 7 in `alignment_archive/20260717T073523Z/alignment-report.md:10`]
- [x] T012 Reconcile Mobbin's asset, MCP wiring, tool surface, and troubleshooting guidance with the discovery fixture. [evidence: 3-of-3 P1 findings cleared between `alignment_archive/20260717T073523Z/alignment-report.md:48` and `alignment/alignment-report.md:11`]
- [x] T013 Document the confirmed tools as `mobbin.mobbin.search_screens`, `mobbin.mobbin.search_flows`, and `mobbin.mobbin.search_sections`. [evidence: 3-of-3 confirmed discovery tools reconciled]
- [x] T014 Mark `deep` as confirmed client-settable while retaining authenticated OAuth and call behavior as Inferred. [evidence: 1-of-1 mode claim reconciled; 2-of-2 unexecuted claim classes retained as Inferred]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run Audit 3 and confirm the overall PASS verdict. [evidence: 3-of-3 lanes PASS in `alignment/alignment-report.md:10`]
- [x] T016 Confirm final blocker counts are P0 0 / P1 0. [evidence: 0-of-0 open P0/P1 findings in `alignment/alignment-report.md:11`]
- [x] T017 Accept the 11 residual filename-convention advisories as the sanctioned kebab-case pilot exception. [evidence: 11-of-11 P2 findings inventoried in `alignment/alignment-report.md:24`]
- [x] T018 Run strict package checks for all three packets. [evidence: `package_skill.py --check --strict`; 3-of-3 PASS]
- [x] T019 Run package plus parent-skill validation and verify link integrity. [evidence: `validate_skill_package.py`; package PASS, parent-skill-check PASS, 0 broken links]
- [x] T020 Generate packet description and graph metadata, then run strict spec-folder validation. [evidence: `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js .opencode/specs/mcp-tooling/012-template-alignment .`; `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js .opencode/specs/mcp-tooling/012-template-alignment`; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/mcp-tooling/012-template-alignment --strict`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 20 tasks marked `[x]`. [evidence: 20-of-20 tasks complete]
- [x] No `[B]` blocked tasks remain. [evidence: 0-of-20 tasks blocked]
- [x] Final reducer verdict is PASS for every lane. [evidence: 3-of-3 lanes PASS in `alignment/alignment-report.md:10`]
- [x] All residual findings have an approved disposition. [evidence: 11-of-11 P2 filename advisories accepted]
- [x] Closing validation gates pass. [evidence: 3-of-3 package checks PASS, parent-skill-check PASS, 0 broken links]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Verification Checklist**: See [checklist.md](checklist.md).
- **Implementation Summary**: See [implementation-summary.md](implementation-summary.md).
- **Authoritative Final Reducer Output**: See [alignment/alignment-report.md](alignment/alignment-report.md).
<!-- /ANCHOR:cross-refs -->
