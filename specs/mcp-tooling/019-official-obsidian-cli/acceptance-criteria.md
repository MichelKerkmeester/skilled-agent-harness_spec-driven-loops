---
title: "Acceptance Criteria: Official Obsidian CLI agent-usage support in mcp-obsidian"
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
    packet_pointer: "mcp-tooling/019-official-obsidian-cli"
    last_updated_at: "2026-09-02T08:20:00Z"
    last_updated_by: "session"
    recent_action: "Verified every criterion against the installed binary and the touched scripts"
    next_safe_action: "Operator review, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/examples/official-cli-workflow.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether to install anything: no, the registration symlink already existed"
      - "Whether to add feature-catalog cards: no, the three existing official cards were false rather than missing"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Official Obsidian CLI agent-usage support in mcp-obsidian

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/019-official-obsidian-cli
**Level:** 2
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an agent about to use the official CLI, When it reads the skill, Then it finds a preflight that proves the CLI will answer and names the signal that says it will not | `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:36` gives the `obsidian version` preflight and the three-state triage table. Observed: exit 1 with the app down, exit 0 with the app up | Met | - |
| AC-002 | REQ-002 | Given a failing official-CLI command with the app running, When the agent checks the result, Then the skill has told it that the exit status is 0 and given the detection to use instead | `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:83` carries four observed exit-0 rows and the `obs()` wrapper. Observed: `obsidian read file="ZZZ-does-not-exist"` printed `Error: File ... not found.` and exited 0 | Met | - |
| AC-003 | REQ-003 | Given a vault task, When the agent must pick a surface, Then the skill gives an unambiguous rule across the official CLI, `notesmd-cli` and the MCP server | `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:152` selection table, plus the four app-only rows added at `.opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md:69` | Met | - |
| AC-004 | REQ-004 | Given any documented behavior, When a reader checks it, Then it was observed from the binary or is marked UNKNOWN with its settling check | `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:312` lists five UNKNOWNs each with its settling check. No command or flag is stated that was not run or read from `obsidian help` | Met | - |
| AC-005 | REQ-005 | Given `doctor.sh`, When it runs, Then it distinguishes "not installed" from "installed but the app is down" | `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh:59` warns on app-down. Observed both states: `! obsidian: /usr/local/bin/obsidian is registered but the desktop app is NOT running`, then `✓ obsidian: /usr/local/bin/obsidian (1.13.7 (installer 1.13.4)) — app is running, CLI is live` | Met | - |
| AC-006 | REQ-006 | Given a command with no `file=` or `path=`, When the skill is consulted, Then it warns that the human's open note is the target | `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:223` invariant 1. Observed: a bare `obsidian read` returned the note open in the UI | Met | - |
| AC-007 |REQ-007|Given a claim the binary contradicts, When the skill is read, Then the claim is corrected and the vendor disagreement is recorded rather than silently resolved| `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:299` records both vendor disagreements. Sweep: a `grep -rn` for the three auto-launch phrasings outside `changelog/` returns nothing | Met | - |
| AC-008 | SC-001 | Given the router, When an official-CLI request arrives, Then it resolves to the new reference rather than the notesmd-centric one | `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:238` intent and `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:381` resource map. Executing `route_obsidian_resources` returned `{'intent': 'OFFICIAL_CLI', 'resources': ['references/official-cli-agent-usage.md', ...]}` for five official-CLI phrasings | Met | - |
| AC-009 | SC-001 | Given the router change, When existing intents are exercised, Then none regressed | Same execution against `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:238`: `NOTES_CLI`, `MCP_ADVANCED`, `PLUGIN_DATAVIEW`, `INSTALL`, `TROUBLESHOOT` and `NOTION_MIGRATION` all resolved unchanged | Met | - |
| AC-010 | SC-003 | Given the packet, When `validate.sh --strict` runs, Then it prints `RESULT: PASSED` | `specs/mcp-tooling/019-official-obsidian-cli/implementation-summary.md:1` Verification table records the run and its `RESULT:` line | Met | - |
| AC-011 | REQ-004 | Given verification touched a live vault, When the packet closes, Then the vault is at its pre-change state | `.opencode/skills/mcp-tooling/mcp-obsidian/examples/official-cli-workflow.sh:1` cleans up through an exit trap. `obsidian files ext=md total` returned 233 before and after; both scratch searches returned `No matches found.` | Met | - |
| AC-012 | REQ-007 | Given the two failure modes an agent actually hits, When it consults troubleshooting, Then both are documented | `.opencode/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:150` (app not running) and `.opencode/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:181` (exit 0 on error) close the two failure modes that had no prior coverage anywhere in the skill | Met | - |

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

AC-001 through AC-004 carried the packet: they are the four questions the operator asked an agent to be able to answer without guessing, and each is answered from the binary rather than from the vendor page. AC-005 and AC-008 matter because a contract nobody can reach is not a contract, so the diagnostic and the router had to change with the prose.

Consciously left out: no exhaustive transcription of all 106 command signatures, since `obsidian help` is the authoritative and non-staling source. No new feature-catalog cards, since the existing official cards were false rather than absent. No edits to historical changelog entries. Five platform and output-shape questions remain UNKNOWN and are listed with their settling checks in `official-cli-agent-usage.md` §10.
<!-- /ANCHOR:closure -->
