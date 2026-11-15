---
title: "Acceptance Criteria: Phase 1: standalone-agent-and-council-command"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "standalone agent and council command acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/001-standalone-agent-and-council-command"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-standalone-agent-and-council-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: standalone-agent-and-council-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-ai-council-mode-deprecation/001-standalone-agent-and-council-command
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. AC ids come from the criteria list this phase had before it was split, so a criterion keeps its id in the child that owns it. Ids from AC-018 up were added at the split. A new row takes the highest AC-ID across the five children plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-017 | REQ-017 | Given the parent folder, When the start condition is checked, Then phases 004 and 005 are Complete | `rg -l -F '\| **Status** \| Complete' ../004-*/spec.md ../005-*/spec.md \| wc -l` prints 2. Observed: prints `2`, exit 0. Evidence at `tasks.md:36` | Met | - |
| AC-007 | REQ-007 | Given the rewritten agent, When every agent mirror checker runs, Then the agent is present and equal in all eight folders | `node .skilled/bin/check-agent-mirror-sync.cjs --all`, `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` and the Codex, Pi and DSH `sync-agents` scripts with `--check` exit 0. Observed: command 1 prints 23 lines ending `agent-mirror-sync: 11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0; command 2 prints 8 lines ending `STATUS=OK agent-roster-mirror: every runtime covers the canonical roster`, exit 0. Evidence at `tasks.md:50` | Met | - |
| AC-008 | REQ-008 | Given the two authored agent files, When they are searched for deep-loop dependencies, Then none remain | `rg -n 'system-deep-loop\|deep-ai-council\|/deep:ai-council\|append-mode-event\|persist-artifacts\|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing. Observed: prints nothing, exit 1. Evidence at `tasks.md:49` | Met | - |
| AC-009 | REQ-009 | Given the `D3 decision:` line in `goal.md`, When the command tree, its mirrors and the advisor are checked, Then option B shows one council command with one workflow file and one presentation file in all six runtime folders and the advisor offers it, and option A shows no council command | `rg -n '^D3 decision: option [AB]$' goal.md` prints 1 line. Under option B, `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml \| wc -l` prints 1, the T017 `find -L` count prints 6 and `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"convene an ai council to compare three migration plans"}' --format json \| rg -c '"command": "/speckit:ai-council"'` prints at least 1. Observed: the `rg` prints `112:D3 decision: option B`, the `ls` count prints `1`, the T017 `find -L` count prints `6`, and the advisor command prints `1`. `advisor_recommend` returns `/speckit:ai-council` at confidence 0.8412 after child 004 removed the hub council lanes. Evidence at `tasks.md:62` | Met | - |

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

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
