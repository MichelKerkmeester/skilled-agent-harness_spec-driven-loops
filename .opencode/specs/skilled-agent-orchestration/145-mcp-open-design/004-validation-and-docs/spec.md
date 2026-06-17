---
title: "Feature Specification: validation and docs"
description: "Record of the live verification and deep review for the spec-150 work. A live test proved od artifacts create only adds a file and that Open Design generation is a multi-turn discovery-form flow, with a real design rendered via the corrected flow. A 10-seat deep review (5 claude2-opus + 5 gpt-5.5-fast) had all P0/P1 and the P2 backlog remediated."
trigger_phrases:
  - "open design live verification"
  - "spec-150 deep review"
  - "od artifacts create not a design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/004-validation-and-docs"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the live verification and the 10-seat deep review outcome"
    next_safe_action: "Operator runs the optional formal od mcp install opencode live-wire"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:592f484b75da9c6b767986a31d0c94930f88c24f2662105a8b7d05dd009c3c62"
      session_id: "session-150-004-validation-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: validation and docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Type** | Retroactive record of completed work (already done) |
| **Residual** | Optional: a formal `od mcp install opencode` live-wire (operator-gated) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-open-design` skill (phase 002) was built from a reverse-engineering pass, and the `sk-interface-design` de-vendor (phase 003) shipped without an independent audit. Two gaps remained. First, the run direction was never exercised against the real app, so whether generation worked as the skill described was unconfirmed. Second, no adversarial review had checked the shipped skills for accuracy, broken paths, stale licensing wording, or graph-metadata defects. Both needed closing before the spec-150 work could be called done.

### Purpose
Verify the shipped work against the running app and an adversarial review fleet. Run a live generation test to ground the run direction in reality, and run a 10-seat deep review across both skills and the research packet to find and fix accuracy, path, licensing, and record-integrity defects.

> **Retroactive record.** This packet documents work that was already carried out: the live test and the 10-seat deep review, with all P0/P1 and the full P2 backlog remediated. The supporting evidence is the research and review artifacts cited below. It does not re-run the test or the review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The live verification of the Open Design run direction: what `od artifacts create` actually does, and the real shape of the generation flow.
- A real design generated end to end via the corrected flow as proof.
- The 10-seat deep review (5 `claude2-opus` plus 5 `gpt-5.5-fast`) across the two skills and the research packet.
- The remediation of all P0/P1 findings and the P2 backlog, and the record of the by-convention WONTFIX items.

### Out of Scope
- Re-running the live test or the review (their results are taken as authoritative input here).
- The generation-flow correction itself, which is its own packet (phase 007) and applied the live findings to the skill.
- The optional formal `od mcp install opencode` live-wire against a running daemon (operator-gated residual).
- Editing the 150 parent control docs.

### Evidence (already produced)

| Path | Role |
|------|------|
| `../001-terminal-control-and-integration-research/research/research.md` | The research ground-truth the review was held against |
| `../001-terminal-control-and-integration-research/research/seats/` | Per-seat research findings used as the verification baseline |
| `../review/review-report.md` | The 10-seat deep-review report: verdicts, P0/P1 fixes, P2 backlog, WONTFIX rationale |
| `../review/seats/` | Raw deep-review seat outputs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run direction is verified live | A live test established what `od artifacts create` does and the real generation flow shape |
| REQ-002 | A real design is generated as proof | A design rendered end to end via the corrected multi-turn flow |
| REQ-003 | All deep-review P0/P1 findings are remediated | Every P0 and P1 from the 10-seat review is fixed and re-validated |

### P1 - Required (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The deep review covers both skills and the packet | 10 narrow-slice seats span SKILL.md accuracy, licensing, integration, references, catalog, playbook, graph-metadata, and link integrity |
| REQ-005 | The P2 backlog is remediated | The record-integrity and doc-consistency P2 items are fixed, and by-convention items are WONTFIX with rationale |
| REQ-006 | Remediation is re-validated | `package_skill.py --check`, `validate.sh --strict --recursive`, and document validation all pass after the fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The live test recorded that `od artifacts create` only adds a file and that generation is a multi-turn discovery-form flow (`od run start` to a question-form to `od ui respond` to build), with a real design rendered via the corrected flow.
- **SC-002**: All 10 deep-review P0/P1 findings and the P2 backlog are remediated and re-validated, per `../review/review-report.md`.
- **SC-003**: `validate.sh` on this packet with `--strict` reports zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The skill described generation incorrectly (one-shot) | High | The live test proved the multi-turn flow, and the correction landed in phase 007 |
| Risk | A review seat false-positives on a repo convention | Medium | Round-2 verification re-checked each finding at-location before fixing, with 0 false positives |
| Risk | A claimed license violation is real | High | No P0 was a real license violation, and the shipped Apache-2.0-only state was correct |
| Dependency | The shipped skills (phases 002, 003) | Green | The review and live test audited them |
| Dependency | The phase 001 research ground-truth | Green | The review was held against it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: The live test exercised only read and run verbs on the local app and produced one design. No destructive verb was run, and the gating policy held throughout.

### Consistency
- **NFR-C01**: House voice holds across the review report and this record, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: Every live finding is tagged confirmed (live-verified this session), and each review finding was re-checked against the cited file before being called a fix.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generation boundaries
- A single `od run start` returns a discovery question-form with zero files and ends `awaiting_input`: the live test confirmed this is not-a-design, not a failure.
- `od artifacts create` adds one file: the live test confirmed it does not spawn a run, render a design, or update the preview.

### Review boundaries
- A narrow seat reports a P0 license violation: round-2 verification confirmed none was real, and the one FAIL was a broken relative path, not a license defect.
- A path resolves in one doc but not from its index: the review fixed the relative paths and re-resolved each against its target on disk.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | A live test plus a 10-seat review across two skills and a packet, with remediation |
| Risk | 10/25 | Correctness of the live findings drives a downstream correction, but reversible |
| Research | 8/20 | The live test and the adversarial review are themselves the investigation |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The one residual is optional and operator-gated: a formal `od mcp install opencode` live-wire that writes the real `~/.config/opencode/opencode.json` and confirms `tools/list` against the running daemon. The generation flow and the tool surface are already live-verified, so this is the last formal install step.
<!-- /ANCHOR:questions -->
