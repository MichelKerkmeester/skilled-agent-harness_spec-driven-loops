---
title: "Acceptance Criteria: Phase 6: codex-persona-tool-mapping"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "codex persona tool mapping acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/006-codex-persona-tool-mapping"
    last_updated_at: "2026-11-14T11:36:26Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-codex-persona-tool-mapping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: codex-persona-tool-mapping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/006-codex-persona-tool-mapping
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
| AC-001 | REQ-001 | Given `cli-codex/SKILL.md`, When rule 17 is read, Then it requires the mapping line and quotes the text to copy | `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more Observed 2026-11-14: the search printed 1. Rule 17 has the bullet `Put a tool-mapping line directly above the inlined persona` with the text in a fenced block. | Met | - |
| AC-002 | REQ-002 | Given a prompt holding the mapping line, the `context` persona and a task to read `.skilled/agents/README.txt`, When `codex exec --sandbox read-only` runs it, Then the report names that file as read | `scratch/codex-probe-report.txt` contains `FILES READ: .skilled/agents/README.txt` Observed 2026-11-14 on codex-cli 0.169.0: the last line of the report is `FILES READ: .skilled/agents/README.txt`, and the run log shows one command, `cat .skilled/agents/README.txt`. | Met | - |
| AC-003 | REQ-003 | Given the same prompt with the mapping line removed, When `codex exec --sandbox read-only` runs it, Then its report is saved beside the other one | `scratch/codex-probe-control.txt` exists and its last line starts `FILES READ:` Observed 2026-11-14 on codex-cli 0.169.0: the file exists and its last line is `FILES READ: .skilled/agents/README.txt`. The control read the file, so the failure did not reproduce. | Met | - |
| AC-004 | REQ-004 | Given the canonical card, When its persona-injection section is read, Then it requires a tool-mapping line where the child lacks the persona's tools | `rg -c -i 'tool mapping' .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` prints 1 or more Observed 2026-11-14: the search printed 1. Section 6.3 of the card has the paragraph `Tool mapping above the block`. | Met | - |
| AC-005 | REQ-005 | Given the dispatch gotchas, When they are read, Then one names exit 0 with a report that lists no file read | `rg -c 'FILES READ: none' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more Observed 2026-11-14: the search printed 2, the sixth gotcha's two lines. | Met | - |
| AC-006 | REQ-006 | Given the packet, When its `version` frontmatter and its changelog folder are compared, Then the newest entry carries the same version | `rg -n '^version:' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints a version that matches the newest file name under `cli-codex/changelog/` Observed 2026-11-14: `5:version: 1.9.16.0`, and the newest file name under `cli-codex/changelog/`, sorted by version, is `v1.9.16.0.md`. `frontmatter-version.mjs verify --skill cli-external-orchestration` reported 440 files, all ok. | Met | - |
| AC-007 | REQ-007 | Given the six other mode packets, When each `SKILL.md` is read for how it attaches a persona, Then a table records whether the child has the persona's tools | `scratch/other-modes.md` has six rows, each ending `native surface`, `has the tools` or `needs the line` Observed 2026-11-14: six rows. Three end `native surface`, two `has the tools` and `cli-deepseek-harness` ends `needs the line`. | Met | - |

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

All seven criteria are `Met`, each with the output observed on 2026-11-14.
<!-- /ANCHOR:closure -->
