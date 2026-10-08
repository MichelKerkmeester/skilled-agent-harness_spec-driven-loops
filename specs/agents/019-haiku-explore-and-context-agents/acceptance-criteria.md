---
title: "Acceptance Criteria: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "haiku explore and context agents acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/019-haiku-explore-and-context-agents"
    last_updated_at: "2026-10-08T09:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8dc8e6a4-8f4a-445b-977c-e942be2eb5bc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/019-haiku-explore-and-context-agents
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the user and repo Claude trees, When the frontmatter of both `Explore.md` files is read, Then each shows `name: Explore`, `model: haiku` and a `tools:` list without Write or Edit | `.claude/agents/Explore.md:4` shows `model: haiku` and `.claude/agents/Explore.md:5` shows `tools: Read, Grep, Glob, Bash`, identical to the user-level file | Met | - |
| AC-002 | REQ-002 | Given Explore exists only in the Claude tree, When the roster check runs, Then it prints `STATUS=OK` | `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:110` filters Claude-only agents, and its run printed 12 agents, every surface OK, `STATUS=OK`, exit 0 | Met | - |
| AC-003 | REQ-003 | Given `.claude/agents/context.md` and `.claude/agents/markdown.md`, When their frontmatter is read, Then each declares `model: haiku` | `.claude/agents/context.md:4` and `.claude/agents/markdown.md:4` show `model: haiku` | Met | - |
| AC-004 | REQ-004 | Given the five checks passed before the change, When they run again, Then all five still pass | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:78` filters Claude-only agents, and the runs gave runtime-mirror PASS 187 mirrors, Pi PASS 12, Codex PASS 12, agent-mirror-sync OK 12, roster OK 12, all equal to the baseline | Met | - |
| AC-005 | REQ-005 | Given the Claude agents README and the crosswalk, When searched for the old claims, Then neither still says no Claude-tree agent declares a model | `.claude/agents/README.txt:14` and `.skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md:151` carry the corrected statement, and grep for both old sentences returned nothing | Met | - |
| AC-006 | REQ-006 | Given both `settings.json` files, When searched for the subagent model variables, Then neither contains them | The `env` block at `.claude/settings.json:35` holds no `SUBAGENT_MODEL` key, and grep over it and the user `settings.json` returned no lines | Met | - |

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

All six rows carry observed evidence. The live spawn check in a fresh Claude Code session is the operator's to run and is deliberately not a closure row, because only a new session loads the new agent files.
<!-- /ANCHOR:closure -->
