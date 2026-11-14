---
title: "Acceptance Criteria: Phase 9: ai-council-writer-and-round-model"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ai council writer and round model acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/009-ai-council-writer-and-round-model"
    last_updated_at: "2026-11-14T20:19:20Z"
    last_updated_by: "planning"
    recent_action: "Wrote one criterion per requirement, all Unmet"
    next_safe_action: "Build after phases 6 and 8 land; writer answer A is recorded"
    blockers:
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-ai-council-writer-and-round-model"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: ai-council-writer-and-round-model

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `agents/007-agent-alignment-follow-ups/009-ai-council-writer-and-round-model`
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the operator's writer answer is recorded, When the agent, the registry notes and the generated rosters are read, Then all three name the same one writer | `rg -c --include-zero 'persist-artifacts' .skilled/agents/agent-registry.json` prints `0`, and `rg -c --include-zero '^  (write\|edit): deny' .skilled/agents/ai-council.md` prints `0`. The operator answered A on 2026-11-14 | Unmet | - |
| AC-002 | REQ-002 | Given a finished council run, When the agent answers Q11, Then the question asks only for actions its own tools can take | `rg -c --include-zero 'exit 0 receipt' .skilled/agents/ai-council.md` prints 0 | Unmet | - |
| AC-003 | REQ-003 | Given the agent and the references, When they describe `ai-council-state.jsonl`, Then none says the gateway refreshes it | `rg -c --include-zero 'refresh' .skilled/agents/ai-council.md` prints 0, and `rg -n 'gateway refreshes\|refreshed by the append gateway\|refreshes the read-only' .skilled/skills/system-deep-loop/deep-ai-council/references` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given a dispatch, When the agent finishes a round, Then it returns, and the caller decides the next round and owns the resume | `rg -c --include-zero 'repeat from step 3' .skilled/agents/ai-council.md` prints 0, and `rg -n 'one round per invocation' .skilled/agents/ai-council.md` prints 1 line or more | Unmet | - |
| AC-005 | REQ-005 | Given the edited files, When the copies, rosters and compiled contract are regenerated, Then every check agrees and the council suites pass | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, the compiled-contract diff exits 0 and `npm run test:council` prints 0 failures | Unmet | - |
| AC-006 | REQ-006 | Given the config shape, When a reader looks for the round cap, Then it finds a default of 3 | `rg -n 'max_rounds. defaults to 3' .skilled/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council/references` prints 1 line or more | Unmet | - |
| AC-007 | REQ-007 | Given a dispatch prompt with no depth line, When the agent picks a depth, Then it runs Depth 1 and dispatches no seat | `rg -c --include-zero 'Otherwise, operate at Depth 0' .skilled/agents/ai-council.md` prints 0, and `rg -c --include-zero 'fallback when no nesting\|operate as Depth 0' .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md` prints 0 | Unmet | - |
| AC-008 | REQ-008 | Given the capability and strategy tables, When a seat prompt is built, Then the CLI rows are lenses, no temperature is set and the report column the helper parses is kept | `rg -c --include-zero 'External AI vantage\|temperature <TEMP>' .skilled/agents/ai-council.md` prints 0, `rg -c --include-zero '^\| Strategy \| Temp'` prints 0 on the agent and on `seat-diversity-patterns.md` and `rg -c --include-zero 'AI Vantage Target' .skilled/agents/ai-council.md` prints 1 or more | Unmet | - |
| AC-009 | REQ-009 | Given scored seats with any lead, When the agent applies the thresholds, Then exactly one table row covers that lead | `rg -c --include-zero 'within 15 points\|>15 point lead\|<10 point spread\|within 10 points\|25\+ points'` prints 0 and `rg -c --include-zero 'Lead of 15 to 24'` prints 1, each on the agent and on `scoring-rubric.md` | Unmet | - |
| AC-010 | REQ-010 | Given phase 6 has landed, When sections 12 to 17 have moved and the cuts are made, Then the agent is within the cap and no citation is stale | `wc -l < .skilled/agents/ai-council.md` prints 600 or less, `rg -n '§1[2-9]' .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council -g '!**/changelog/**'` prints no citation of a moved or renumbered agent section and `rg -c --include-zero 'Twelve files' .skilled/agents/agent-registry.json` prints 0 | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Nothing is built yet. The operator's writer answer is A, the agent, recorded 2026-11-14.
<!-- /ANCHOR:closure -->
