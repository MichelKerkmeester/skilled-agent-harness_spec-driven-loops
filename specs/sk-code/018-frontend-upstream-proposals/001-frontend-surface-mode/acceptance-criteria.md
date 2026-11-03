---
title: "Acceptance Criteria: Phase 1: frontend-surface-mode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "frontend surface mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode"
    last_updated_at: "2026-11-03T08:33:53Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: frontend-surface-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited hub, When the registry compiler runs, Then it exits 0 and `mode-registry.json` lists `sk-code-frontend` in `modes[]` and in `surfaces` | Compiler output plus `rg -n "sk-code-frontend" .skilled/skills/sk-code/mode-registry.json` | Unmet | - |
| AC-002 | REQ-002 | Given the final state, When `ci-router-vocabulary-reach.cjs --concurrency 2` runs with `--hub sk-code`, `--hub sk-design` and `--hub mcp-tooling`, Then each prints `outranked=  0` and `wrong-hub=  0` | `scratch/reach-final.txt` beside `scratch/reach-baseline.txt` | Unmet | - |
| AC-003 | REQ-003 | Given the surface's aliases and intent signals, When each is split on spaces, Then none is a single word | `jq` listing of the new aliases and signals | Unmet | - |
| AC-004 | REQ-004 | Given the packet, When `rg -n -i "barter\|@barter-bv\|ngx-translate\|safari 18\|firefox esr" .skilled/skills/sk-code/sk-code-frontend/` runs, Then it prints no line | The grep output, empty | Unmet | - |
| AC-005 | REQ-005 | Given `figma-to-code.md`, When it is read, Then it names five passes, an `INCOMPLETE` verdict for any pass not run and a per-transport table that keeps its `UNKNOWN` cells | `rg -n "INCOMPLETE\|UNKNOWN"` on the file | Unmet | - |
| AC-006 | REQ-006 | Given every topic file, When its Support line is read, Then it cites a web-features Baseline status | `rg -c "Baseline"` per topic file | Unmet | - |
| AC-007 | REQ-007 | Given the core page, When it is read, Then it states the Frontend overrides contract with section, action, reason and a "no overrides" line | `rg -n "Frontend overrides"` on the core page | Unmet | - |
| AC-008 | REQ-008 | Given the web stack layer, When each `bdg cdp` recipe ran once live, Then `scratch/recipe-runs.txt` holds its command and output, and any recipe that failed is gone from the layer | `scratch/recipe-runs.txt` | Unmet | - |
| AC-009 | REQ-009 | Given `mcp-figma/SKILL.md`, When it is grepped for `sk-code-frontend`, Then one pointer line names the check and the official-MCP ruling is unchanged | `rg -n "sk-code-frontend"` on the file and `git diff` of it | Unmet | - |
| AC-010 | REQ-010 | Given ADR-001, When the packet is listed, Then native files exist only if ADR-001 allows React Native in canonical sk-code | `decision-record.md` ADR-001 plus `ls .skilled/skills/sk-code/sk-code-frontend/references` | Unmet | - |
| AC-011 | REQ-011 | Given the final state, When the parent-skill checker runs with the sk-code hub path and a frontend prompt replays through both stages, Then the checker exits 0 and the replay resolves `sk-code-frontend` | Checker output and `scratch/replay.txt` | Unmet | - |

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

Nothing is built yet, so every criterion is unmet, and AC-002 decides whether the surface ships at all.
<!-- /ANCHOR:closure -->
