---
title: "Acceptance Criteria: Phase 6: save-search-handoff-contracts"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "save search handoff contracts acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/006-save-search-handoff-contracts"
    last_updated_at: "2026-11-14T11:33:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-save-search-handoff-contracts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: save-search-handoff-contracts

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 006-save-search-handoff-contracts
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

All paths below are relative to the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the tail, `save.md` and `handoff.md`, When an agent reads how to call the continuity writer, Then each file shows `--stdin --full-auto --session-id <id> --runtime <slug>` and no file names a temp JSON path | `rg -n -F '/tmp/save-context-data' .skilled/commands/speckit` prints nothing and exits 1. `rg -c -F 'generate-context.js --stdin --full-auto --session-id <id> --runtime <slug>'` prints at least 1 for each of the three files. `rg -n 'apply/full-auto' .skilled/commands/speckit/save.md` prints nothing and exits 1 | Unmet | - |
| AC-002 | REQ-002 | Given the save tail, When an agent finishes the writer call, Then the tail tells it the writer already refreshed both metadata files and names `validate.sh {spec_path} --strict` as the one check after it | `rg -n -e 'Regenerate the packet' -e 'Nothing else runs' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints nothing and exits 1. `rg -c 'validate.sh' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints 1 | Unmet | - |
| AC-003 | REQ-003 | Given a search query that starts with `--`, When the router picks a free-text recipe, Then it runs the raw Section 2.1 recipe without calling the wrapper, and any exit 2 or higher renders the error display | `rg -n 'as a flag and exits' .skilled/commands/speckit/search.md` prints nothing and exits 1. `rg -n 'starts with .--. .*before .*wrapper' .skilled/commands/speckit/search.md` prints one line | Unmet | - |
| AC-004 | REQ-004 | Given the save tail and the save display, When an agent saves, Then no file asks it to write uppercase anchors or to report an anchor count, and the workflow test still passes | `rg -n -e 'anchor_requirements' -e 'minimum_anchors' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` and `rg -n -e 'ANCHORS=' -e '<anchor_1>' .skilled/commands/speckit/assets/save-presentation.txt` each print nothing and exit 1. `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` | Unmet | - |
| AC-005 | REQ-005 | Given the save tail, When an agent looks for the writer call, Then the key is named `invocation` and no key names an indexing step | `rg -n 'pre_index' .skilled/commands/speckit` prints nothing and exits 1. `rg -n '^    invocation:' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints one line | Unmet | - |
| AC-006 | REQ-006 | Given the save router and display, When an agent renders a save, Then no trigger editor keyed by a record number is offered | `rg -n -e 'SPECKIT:TRIGGERS' -e 'Trigger-edit' -e 'Record      #' .skilled/commands/speckit/save.md .skilled/commands/speckit/assets/save-presentation.txt` prints nothing and exits 1 | Unmet | - |
| AC-007 | REQ-007 | Given `save.md` and `handoff.md`, When an agent on DSH picks a `--runtime` value, Then each list names the script it belongs to and `handoff.md` says `prepare` refuses `dsh` | `rg -n -i 'dsh' .skilled/commands/speckit/handoff.md` prints at least one line. `rg -c -F 'session-relaunch.cjs --runtime' .skilled/commands/speckit/handoff.md` prints at least 1 | Unmet | - |
| AC-008 | REQ-008 | Given a `--paths` or `--count` search, When the result renders, Then the display has a row shape for that mode, its hidden count comes from the wrapper record and the router names `--limit 0` as the way to lift the wrapper's cap | `rg -n 'run their recipe directly' .skilled/commands/speckit/search.md` prints nothing and exits 1. `rg -n 'path-only and count.*--limit 0' .skilled/commands/speckit/search.md` prints at least one line. `rg -c -F '<count>  <path>' .skilled/commands/speckit/assets/search-presentation.txt` prints at least 1. `rg -c -F 'recipe    2.1 structured' .skilled/commands/speckit/assets/search-presentation.txt` prints 1 | Unmet | - |
| AC-009 | REQ-009 | Given a trigger-index search that returns more than 20 candidates, When the display says to raise `--limit`, Then the router documents `--limit` for that lane | `rg -n 'argument-hint:.*--limit' .skilled/commands/speckit/search.md` prints one line. `rg -n 'lookup-trigger-index.mjs.*--limit' .skilled/commands/speckit/search.md` prints at least one line | Unmet | - |
| AC-010 | REQ-010 | Given a default-mode save with a blocker, an advisory, a pending answer and an orphaned session, When the plan renders, Then each has its own row | `rg -c '^Blockers ' .skilled/commands/speckit/assets/save-presentation.txt` prints at least 1, and the same command prints at least 1 for each of `^Advisories `, `^Decisions ` and `^Orphans ` | Unmet | - |
| AC-011 | REQ-011 | Given a full-auto save, When the writer finishes, Then the result block shows the writer's continuity, decision and `session_ref` lines and offers no graph refresh | `rg -n 'refresh-graph' .skilled/commands/speckit/assets/save-presentation.txt` prints nothing and exits 1. `rg -c 'SPECKIT:SAVE FULL-AUTO' .skilled/commands/speckit/assets/save-presentation.txt` prints 1 | Unmet | - |
| AC-012 | REQ-012 | Given a handoff that ends in any of its four outcomes, When the agent reports, Then it takes the STATUS line from one table in `handoff.md` and no new presentation file exists | `rg -c -e 'STATUS=OK' -e 'STATUS=FAIL' .skilled/commands/speckit/handoff.md` prints 4. `find .skilled/commands/speckit/assets -name '*handoff*'` prints nothing and exits 0 | Unmet | - |
| AC-013 | REQ-013 | Given a lifecycle save step, When an agent looks for the writer call, Then it finds only the `shared_tail` pointer and no inline write block | `rg -n 'write_continuity' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1. `node --import tsx --test tests/boolean-expr.test.ts` run from `.skilled/skills/system-spec-kit/shared` prints `fail 0` | Unmet | - |
| AC-014 | REQ-014 | Given a plan, implement or complete run, When it reaches its end, Then it has saved once, has no closing step and is not offered a second save | `rg -n 'handover_check' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1. `sed -n '/^termination:/,/^[a-z]/p' <file> \| rg -c '^  message: ".*[Cc]omplete'` prints 1 for each of the three files. `rg -n 'memory-save' .skilled/commands/speckit/assets/speckit-complete-presentation.txt` prints nothing and exits 1. `rg -n -e 'checkpoint__' -e 'Run /speckit:save' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1. `rg -c '^  step_[0-9_]+_save_context:'` prints 1 for each of the three files. `test-phase-command-workflows.js` prints `failed=0` | Unmet | - |

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

No criterion is met yet, because implementation has not started.
<!-- /ANCHOR:closure -->
