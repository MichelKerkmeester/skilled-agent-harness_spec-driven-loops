---
title: "Acceptance Criteria: Phase 8: orchestrate-routing-and-retry"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "orchestrate routing and retry acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/008-orchestrate-routing-and-retry"
    last_updated_at: "2026-11-14T20:19:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-orchestrate-routing-and-retry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: orchestrate-routing-and-retry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/007-agent-alignment-follow-ups/008-orchestrate-routing-and-retry
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. `O` is `.skilled/agents/orchestrate.md` and `S` is `.skilled/skills/system-spec-kit`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `/deep:research` request, When the orchestrator routes it, Then it runs the command and the routing row names `/deep:research` | `rg -n 'dispatch that leaf at depth 1' O` prints nothing, the routing-table block holds one `/deep:research` and `sync-agent-roster.cjs --check` prints `agent-roster: OK` | Met | - |
| AC-002 | REQ-002 | Given a deep route, When the orchestrator writes the `Deep Route:` line, Then it holds only registry fields and the guard still parses it | `rg -n 'execution=\|execution semantics\|any of the 4' O` prints nothing and `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` prints `pass 1` and `fail 0` | Met | - |
| AC-003 | REQ-003 | Given a child that fails, When the orchestrator retries, Then one ladder decides the count and the escalation | `rg -n 'after 2 rejections\|up to 2x\|after 2 retries\|Attempts 1-2\|60s cooldown' O` prints nothing and `rg -c '^### Retry Ladder$' O` prints 1 | Met | - |
| AC-004 | REQ-004 | Given a spec-doc write, When the orchestrator picks the writer, Then Rules 2, 2b, 5 and 6 name the same one | `rg -c 'main agent writes spec-folder docs directly' O` prints 1 or more, and `rg -c --include-zero 'spec-doc creation through .@markdown.' O` prints 0. The operator chose the main agent on 2026-11-14 | Met | - |
| AC-005 | REQ-005 | Given any edit to `O`, When the mirror routine has run, Then the roster, the mirrors and the pinned sections agree | `sync-agent-roster.cjs --check` prints `agent-roster: OK`, `check-agent-mirror-sync.cjs` exits 0 and `node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` prints `pass 5` and `fail 0` | Met | - |
| AC-006 | REQ-006 | Given a named-agent dispatch, When the orchestrator builds the prompt, Then it does not paste the definition | `rg -n 'INCLUDE.*general-purpose' O` prints the step 2 line and `rg -c 'Agent Loading Protocol' O` prints 1 or more | Met | - |
| AC-007 | REQ-007 | Given a 10 to 20 agent wave, When a read-only leaf takes part, Then it returns its summary and writes no file | `rg -n 'Pattern C' O S/references/workflows/orchestrator-dispatch.md` prints a line naming `@context` as returning, not writing | Met | - |
| AC-008 | REQ-008 | Given the orchestrator's gates, When one is checked, Then the orchestrator can measure it | `rg -n -i '50,000 tokens\|~150K\|\(2 min\)\|approaching 80%\|Score ≥ 70' O` prints nothing | Met | - |
| AC-009 | REQ-009 | Given the action list, the `@code` example and the save rule, When read against the agents they name, Then each matches | `rg -n '@general-purpose, @review, @debug\|Skills: sk-code code-review mode\|Mandate sub-agents to run' O` prints nothing. Narrowed from `code-review mode \(findings-first`, which also matches the generated `@review` row at `:83`, a correct row | Met | - |
| AC-010 | REQ-010 | Given the finished edits, When the files are counted, Then the canonical file and its Claude fork are 600 lines or less | `wc -l < O` and `wc -l < .claude/agents/orchestrate.md` each print 600 or less, and `rg -c 'orchestrator-dispatch.md' O` prints 1 or more | Met | - |
| AC-011 | REQ-011 | Given the new reference, When the router and the skill check read the skill, Then the reference is registered and the check is clean | `rg -c 'orchestrator-dispatch.md' S/leaf-manifest.json S/leaf-aliases.json S/ROUTER.md` prints 1 or more per file and `sk-skill-check.cjs S` prints `Result: PASS` with C1 to C13 PASS or INFO, the check's current wording for no findings | Met | - |

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

All eleven rows are `Met`. Each verification command was run on the final working tree, and its output is saved in `scratch/after.txt`.
<!-- /ANCHOR:closure -->
