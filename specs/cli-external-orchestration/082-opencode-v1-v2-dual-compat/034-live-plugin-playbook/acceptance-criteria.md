---
title: "Acceptance Criteria: Live plugin utilization playbook on OpenCode v1 and v2"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "live plugin playbook acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook"
    last_updated_at: "2026-10-20T16:42:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Live plugin utilization playbook on OpenCode v1 and v2

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082/034-live-plugin-playbook
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 17 `.js` files in `.opencode/plugins/`, When the playbook is read, Then each has one scenario file under `plugin-utilization/` with a trigger prompt, v1 and v2 runner commands, a check and a cleanup | `ls plugin-utilization/*.md` lists 17 files, CO-040 to CO-056; each has 5 numbered sections | Met | - |
| AC-002 | REQ-002 | Given each scenario, When it is run live on OpenCode 1.19.3 and 2.0.32, Then its verdict rests on a capture, log or event file | 36 evidence files in `scratch/live-runs/`, each holding the tool calls, the system-prompt lines and the log lines the run produced | Met | - |
| AC-003 | REQ-003 | Given the runs, When the matrix is read, Then every plugin has a v1 and a v2 verdict pointing at evidence, and each FAIL names a root cause | `scratch/live-runs/results-matrix.md`: v1 17 PASS; v2 10 PASS, 7 FAIL with four numbered causes confirmed by `event-probe-summary.txt` | Met | - |
| AC-004 | REQ-004 | Given `SYSTEM_SKILL_ADVISOR_DISABLED=1`, When the advisor scenario runs on each version, Then no `Advisor:` line is injected | `killswitch-skill-advisor.v1.txt` and `.v2.txt`: 0 lines, against 2 (v1) and 1 (v2) without the switch | Met | - |
| AC-005 | REQ-005 | Given the root playbook, When the playbook validator and the doc checks CI runs are run, Then the category is listed and every check passes | `validate-playbook-package.cjs --strict`: cli-opencode PASS, 72 scenarios, 14 categories, 0 violations; links 0 broken; sk-doc script tests pass; cite-drift gate clean | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
