---
title: "Acceptance Criteria: Phase 1: cli-versus-mcp"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-cli-versus-mcp"
    last_updated_at: "2026-09-02T18:51:34Z"
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
# Acceptance Criteria: Phase 1: cli-versus-mcp

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `specs/mcp-tooling/019-official-obsidian-cli/001-cli-versus-mcp`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | **Given** Obsidian is closed, **When** ten official-CLI commands spanning every family are run, **Then** each exits 1 with the launcher message on stderr and the app stays closed | `obsidian version` and nine siblings: exit 1, stderr `The CLI is unable to find Obsidian...`, 34-76 ms. `pgrep -x Obsidian` after all ten returns nothing | Met | - |
| AC-002 | REQ-001 | **Given** Obsidian is closed, **When** the MCP server is started over stdio, **Then** `initialize` and `tools/list` succeed and every vault call returns `isError: true` with code `-32603` | `node mcpcall.cjs mcp-closed-list list` returns 12 tools. `obsidian_list_notes` returns `Error: fetch failed (failed after 4 attempts)` in 1965 ms | Met | - |
| AC-003 | REQ-001 | **Given** Obsidian is open, **When** each capability family is exercised on both surfaces, **Then** the result of every call is recorded with its output and exit status | 106 CLI commands enumerated from `obsidian help`, roughly sixty CLI invocations and 37 MCP tool calls, each written to `scratch/evidence/<id>.{out,err,rc,ms}` | Met | - |
| AC-004 | REQ-001 | **Given** ten reads of one note through each surface, **When** each call is timed on its own, **Then** a per-call figure is reported for both, with MCP startup separated from warm cost | CLI 34/38/52 ms min/median/max. MCP warm 3/3/15 ms after a 724 ms startup. Break-even about 21 calls | Met | - |
| AC-005 | REQ-003 | **Given** the measurements, **When** the deliverable is written, **Then** `references/cli-versus-mcp.md` states one default and the conditions for leaving it | The file exists. §1 names the CLI as the default, §6 names the four MCP-only capabilities and the 20-call threshold | Met | - |
| AC-006 | REQ-002 | **Given** the default, **When** the skill is updated, **Then** `README.md` and the three surface references say the same thing without hedging | `README.md` router and FAQ, `mcp-tools.md` §4 and §9, `obsidian-cli-commands.md` §3 and §8, `official-cli-agent-usage.md` §5 | Met | - |
| AC-007 | REQ-004 | **Given** the vault before the run, **When** every scratch note is removed, **Then** the markdown and total file counts match the baseline and no scratch note remains | 234 markdown and 1582 total before and after. `find <vault> -name 'zz*'` returns nothing | Met | - |
| AC-008 | REQ-005 | **Given** three measured facts that contradict the skill, **When** each is corrected, **Then** the reference that carries it states the measured value | `mcp-tools.md` now says 12 exposed of 14 built and v0.12.3 not @3.2.9. `obsidian-cli-commands.md` records that `tag` and `tags` are read-only | Met | - |
| AC-009 | REQ-006 | **Given** the app was found closed and the REST plugin disabled, **When** the run ends, **Then** both are back in that state | `obsidian plugin id=obsidian-local-rest-api` reports `enabled false`. `pgrep -x Obsidian` returns nothing after `osascript -e 'quit app "Obsidian"'` | Met | - |
| AC-010 | REQ-002 | **Given** every file this phase wrote or edited, **When** both documentation gates run, **Then** the validator exits 0 and no file gains a hard blocker | `validate_document.py` exits 0 on all seven. `hvr_scan.py` on the new reference: 0 hard blockers, ceiling 98/100. Edited files went 33→27, 25→24, 0→0, 45→44 | Met | - |

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

AC-001 through AC-004 carried the packet: the comparison rests on invocations whose output and exit status were read from files rather than through a pipe, which matters here because the CLI exits 0 on failure. Consciously left out: `notesmd-cli` was not re-measured, the skill's pre-existing Human Voice backlog was not swept, and `SKILL.md` was not edited because it is a compiled-policy input, so its replacement text sits in `spec.md` §13 instead.
<!-- /ANCHOR:closure -->
