---
title: "Acceptance Criteria: Phase 15: compiled-serving-admission-research"
description: "The criteria this research phase must satisfy before it may close, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "compiled-serving admission acceptance"
  - "phase 15 closure gate"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research"
    last_updated_at: "2026-09-18T22:36:18Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every criterion from the compiled research"
    next_safe_action: "None; the build waits on the operator's choice of admission bar"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: compiled-serving-admission-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/015-compiled-serving-admission-research
**Level:** 2
**Status:** Complete
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fan-out, When both lineages finish, Then each has five iterations and neither stopped on convergence | `research/lineages/swe2/iterations/` and `research/lineages/deepseek/iterations/` each hold `iteration-001.md` to `iteration-005.md`, and each state log has five iteration rows. Both lineage configs set `stopPolicy` to `max-iterations`, and both dashboards record `maxIterationsReached`. `research/orchestration-summary.json` reports two succeeded and none failed | Met | - |
| AC-002 | REQ-002 | Given `research/research.md`, When it is read against the charter, Then it answers Q1 to Q5 with cited evidence | Sections 5 to 8 and 11 answer Q1 to Q5 in order, and each load-bearing claim carries a `[SOURCE: ...]` file and line or a commit | Met | - |
| AC-003 | REQ-003 | Given the recommendation, When the operator reads it, Then it names one path, its costs, its risks and the build steps | Section 1 names the new gold checker. Section 8 gives the cost and risk of all three paths, and section 11 lists eight build steps for a later phase | Met | - |
| AC-004 | NFR-S01 | Given the phase's tracked files, When they are searched for a home path, Then none is found | `rg` for the home prefix over the phase folder, excluding the untracked containment copies, finds nothing. The one hit, in the DeepSeek lineage config, was rewritten to a repo-relative path | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met. The research is complete; building the recommended checker is a separate phase that waits on the operator's decision about the admission bar.
<!-- /ANCHOR:closure -->
