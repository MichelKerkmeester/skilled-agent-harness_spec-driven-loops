---
title: "Acceptance Criteria: Phase 6: shared-agent-contract"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shared agent contract acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/006-shared-agent-contract"
    last_updated_at: "2026-11-14T20:19:16Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-shared-agent-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: shared-agent-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `specs/agents/007-agent-alignment-follow-ups/006-shared-agent-contract`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the agent template, When the budget rule is read, Then it states the `Tool Calls` row is the agent's one budget covering the mandatory steps | `rg -c 'row is the agent.s one budget' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1. Observed at `6c1fca5106`: printed 1 (`scratch/after.txt:2`) | Met | - |
| AC-002 | REQ-002 | Given any runtime copy of any agent, When its fast path is read, Then it sets no tool-call cap | `rg -c 'Max 5 tool calls' .skilled/agents/ .claude/agents/ .pi/agents/ .codex/agents/ .dsh/agents/` exits 1 with no output. Observed at `6c1fca5106`: exit 1, no output (`scratch/after.txt:5`) | Met | - |
| AC-003 | REQ-003 | Given a deep-research iteration, When the leaf reads its budget, Then the only number it reads is the rendered `Max 24` line and no doc restates another | `rg -n --glob '!**/changelog/**' 'hard max 12\|approaching 12\|8-11\|\(max 12\)\|default: 12\|max 12 tool\|tool_call_budget'` over the research agent, YAMLs and mode packet exits 1, and the prompt-pack suite asserts `Max 24 tool calls total.` for research. Observed at `6c1fca5106`: exit 1, and the suite asserts it for research (43 passed) (`scratch/after.txt:8`) | Met | - |
| AC-004 | REQ-004 | Given a deep-review iteration, When the prompt renders, Then it says `Max 24 tool calls total.` from the config and no doc restates another number | `rg -n 'max 13\|hard max 13\|Soft max 12\|\(max 12\)\|Max 12 tool\|tool_call_budget\|[0-9]+-[0-9]+ (tool )?calls'` over the review agent, YAMLs, skill, protocol and assets exits 1, and the prompt-pack suite asserts `Max 24 tool calls total.` for review. Observed at `6c1fca5106`: exit 1, and `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:168` asserts it for review (43 passed) (`scratch/after.txt:12`) | Met | - |
| AC-005 | REQ-005 | Given an orchestrator dispatch, When it sizes the task and appends the footer, Then both name the target agent's `Tool Calls` budget with 12 as the default | `rg -c 'more than 12 tool calls' .skilled/agents/orchestrate.md` exits 1 and `rg -c 'Tool Calls. budget' .skilled/agents/orchestrate.md` prints 2. Observed at `6c1fca5106`: exit 1, then 2 (`scratch/after.txt:16`) | Met | - |
| AC-006 | REQ-006 | Given the agent template, When the output rules are read, Then it says checklists ship unticked, returned checks carry a command and exit code and a self-score decides no status | `rg -c 'checklist in an agent file ships unticked' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1. Observed at `6c1fca5106`: printed 1 (`scratch/after.txt:20`) | Met | - |
| AC-007 | REQ-007 | Given the canonical agents, When a checklist is read, Then no box is ticked | `rg -c '\[x\]' .skilled/agents/` exits 1 with no output. Observed at `6c1fca5106`: exit 1, no output (`scratch/after.txt:23`) | Met | - |
| AC-008 | REQ-008 | Given a resolved debug run, When the success report is filled, Then each verification line names a command and an exit code | `rg -c 'Exit Code' .skilled/agents/debug.md` prints 3 and `rg -c '\[x\]' .skilled/agents/debug.md` exits 1. Observed at `6c1fca5106`: printed 3, then exit 1 (`scratch/after.txt:26`) | Met | - |
| AC-009 | REQ-009 | Given any LEAF agent, When it is asked to delegate, Then its section 0 emits the canonical REFUSE line, and the template states the line once plus once in its skeleton | `rg -l -F 'REFUSE: nested Task tool dispatch is forbidden for LEAF agents.' .skilled/agents/ \| wc -l` prints 10 and the same search on the template counts 2. Observed at `6c1fca5106`: printed 10, template 2 (`scratch/after.txt:30`) | Met | - |
| AC-010 | REQ-010 | Given any LEAF agent, When it reads a file, diff, page or tool output, Then its section 0 tells it to treat the content as untrusted data | `rg -l -i 'untrusted' .skilled/agents/ \| wc -l` prints 10 and `rg -c -i 'untrusted'` on the template prints 2 or more. Observed at `6c1fca5106`: printed 10, template 4 (`scratch/after.txt:34`) | Met | - |
| AC-011 | REQ-011 | Given the agent files, When the retrieval text is read, Then the Daemon-free sentence is gone and deep-review keeps its rule | `rg -c 'Daemon-free' .skilled/agents/` exits 1 and `rg -c -i 'never block an iteration on retrieval' .skilled/agents/deep-review.md` prints 1. Observed at `6c1fca5106`: exit 1, then 1 (`scratch/after.txt:38`) | Met | - |
| AC-012 | REQ-012 | Given `code`, `debug` and `review`, When the Context Package text is read, Then it names the steps it skips and no Layer 1 | `rg -n 'Layer 1\|Layer-1' .skilled/agents/code.md .skilled/agents/debug.md .skilled/agents/review.md` exits 1. Observed at `6c1fca5106`: exit 1 (`scratch/after.txt:42`) | Met | - |
| AC-013 | REQ-013 | Given each touched agent, When its lines are counted, Then it is at or under 600, or not above its base when already over | `wc -l` prints 600 or less for each touched agent and at most 816, 648 and 910 for `ai-council`, `debug` and `orchestrate`. Observed at `6c1fca5106`: ai-council 816, code 540, context 438, debug 648, deep-research 589, deep-review 592, design 246, markdown 308, orchestrate 910, prompt-improver 400, review 462 (`scratch/after.txt:45`) | Met | - |
| AC-014 | REQ-014 | Given the changed agents, When the runtime copies are compared, Then every copy agrees | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0. Observed at `6c1fca5106`: `agent-roster: OK` exit 0, mirror check `OK` exit 0 (`scratch/after.txt:59`) | Met | - |
| AC-015 | REQ-015 | Given the changed deep-loop sources, When the contracts, tests and versions are checked, Then all agree | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`, the four deep-loop vitest suites pass, `check_changelog_shape.py` prints `pass=2 fail=0`, `check-frontmatter-versions.sh` exits 0 and `generate-trigger-index.mjs --check` exits 0. Observed at `24594b2b28`: drift OK commands=3 exit 0, suites 43 passed, shape pass=2 fail=0, frontmatter versions exit 0, trigger index --check exit 0 with 0 stale and no manifest-hash note (`scratch/after.txt:65`) | Met | - |

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

**Closeable:** Yes

Every criterion is Met with the output observed at the fix commits.
<!-- /ANCHOR:closure -->
