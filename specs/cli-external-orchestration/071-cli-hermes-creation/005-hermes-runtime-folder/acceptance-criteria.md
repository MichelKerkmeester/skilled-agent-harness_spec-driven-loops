---
title: "Acceptance Criteria: Phase 4: hermes-runtime-folder"
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
    packet_pointer: "scaffold/005-hermes-runtime-folder"
    last_updated_at: "2026-09-14T17:24:47Z"
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
# Acceptance Criteria: Phase 4: hermes-runtime-folder

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repo root, When `ls -la .hermes` runs, Then the playbook symlink and the generated files resolve and the real files are present | Observed 2026-09-14: `skills`, `manual-testing-playbook` symlinks; `prompts/` 33 files; `plugins/repo-guards/`; `SYNC.md` | Met | - |
| AC-002 | REQ-002 | Given a trusted repo, When a live session preloads a repo skill, Then the skill text is reachable | `-s cli-hermes` quoted the first hard rule id; `hermes skills list` enumerates the loadable copies as `local` rows (61 of 68 on 2026-09-15), so both the listing and the preload form report the mirror | Met | - |
| AC-003 | REQ-003 | Given a prompt template, When it is dispatched through `--query-file`, Then one repo command runs end to end | `agent-router` template: read the canonical command, answered with the persona token, exit 0 | Met | - |
| AC-004 | REQ-004 | Given the folder, When its files are compared with the repo, Then nothing is duplicated except by symlink | Prompts are generated pointer stubs; `SYNC.md` and the plugin are unique to Hermes | Met | - |

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

All four criteria are met live. The skills surface changed shape twice on evidence: whole-tree link, then per-skill directory links, then generated markdown-only copies of every skill, because Hermes scans any linked directory in full.
<!-- /ANCHOR:closure -->
