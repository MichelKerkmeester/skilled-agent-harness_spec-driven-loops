---
title: "Acceptance Criteria: Phase 1: fix-agent-contract-contradictions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix agent contract contradictions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions"
    last_updated_at: "2026-11-14T11:36:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-fix-agent-contract-contradictions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: fix-agent-contract-contradictions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `ai-council.md` with `bash: deny`, When the persistence rules are read, Then no rule tells the agent itself to run a `node` command and the calling workflow is named as the runner | `rg -n 'Persist .ai-council/\*\*. artifacts directly via' .skilled/agents/ai-council.md` prints no line, and `rg -c 'calling workflow' .skilled/agents/ai-council.md` prints 2 or more. Observed 2026-11-14: the first search printed no line and the count printed 8 | Met | - |
| AC-002 | REQ-002 | Given `orchestrate.md`, When the agent loading protocol is read, Then it names the agent's own type for dispatch and the wrapper only for a runtime with no named agents | `rg -n 'all custom agents use the general subagent type' .skilled/agents/orchestrate.md` prints no line, and `rg -c '"general"' .skilled/agents/orchestrate.md` prints no line. Observed 2026-11-14: both searches printed no line | Met | - |
| AC-003 | REQ-003 | Given the rewritten dispatch instruction, When `context` is dispatched on Claude Code and asked to write `scratch/probe.txt`, Then the write is refused and the file does not exist | `scratch/dispatch-probe.md` records the dispatch and the refusal, and `ls scratch/probe.txt` reports no such file. Observed 2026-11-14: the agent reported only Read, Grep and Glob and refused, and `ls scratch/probe.txt` reported no such file | Met | - |
| AC-004 | REQ-004 | Given `code.md`, When the return template and the NEVER rules are read, Then both name `PASS`, `FAIL` and `BLOCKED` and neither names `DONE` | `rg -n 'RETURN is .DONE.' .skilled/agents/code.md` prints no line, and `rg -c 'RETURN: <PASS' .skilled/agents/code.md` prints 1. Observed 2026-11-14: the first search printed no line and the count printed 1 | Met | - |
| AC-005 | REQ-005 | Given the edited canonical files, When the mirror check runs, Then every comparable copy is in sync | `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0. Observed 2026-11-14: the check printed `11 agent(s) checked — all comparable mirrors in sync — OK` and exited 0 | Met | - |
| AC-006 | REQ-006 | Given a review dispatched with `Complexity: low`, When the fast path is read, Then step 3 still runs and the skipped steps are named | `rg -n 'Skip steps 3-5' .skilled/agents/review.md` prints no line, and `rg -c 'LOAD STANDARDS still runs' .skilled/agents/review.md` prints 1. Observed 2026-11-14: the first search printed no line and the count printed 1 | Met | - |
| AC-007 | REQ-007 | Given `deep-research.md`, When the overview list and the `### Step` headings are compared, Then they name the same steps in the same order and no number repeats | `rg -c '^### Step 9' .skilled/agents/deep-research.md` prints 1, and `scratch/step-order.md` shows the two lists side by side with no difference. Observed 2026-11-14: the count printed 1 and `scratch/step-order.md` shows eleven matching rows | Met | - |
| AC-008 | REQ-008 | Given the council report template, When the planning-only boundary is read, Then it says no code or spec files were modified and the `ai-council/` artifacts were written | `rg -n 'No files were modified by the Multi-AI Council' .skilled/agents/ai-council.md` prints no line. Observed 2026-11-14: the search printed no line | Met | - |
| AC-009 | REQ-009 | Given both files, When the council's delegation rule is read in each, Then both say it is a leaf when dispatched by another agent and may dispatch seats only when the operator invokes it directly | `rg -c 'only when the operator invokes it directly' .skilled/agents/ai-council.md .skilled/agents/orchestrate.md` prints 1 or more for each file. Observed 2026-11-14: the count printed 1 for each file | Met | - |
| AC-010 | REQ-010 | Given the eleven agent files, When they are searched for the retired names, Then nothing matches | `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` prints no line. Observed 2026-11-14: the search printed no line | Met | - |

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

All ten criteria are `Met`, each with the output observed on 2026-11-14.
<!-- /ANCHOR:closure -->
