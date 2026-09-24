---
title: "Acceptance Criteria: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides"
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
    packet_pointer: "agents/013-prompting-guide-alignment"
    last_updated_at: "2026-09-24T09:52:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-001 to AC-004 and AC-006 to AC-009 Met with observed evidence"
    next_safe_action: "Delete scratch/sources and scratch/briefs once the operator says yes, then mark AC-005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0c3eaa67-d9c2-4f09-a546-1be4055e458e"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/013-prompting-guide-alignment
**Level:** 2
**Status:** In Progress (AC-005 open)
**Date:** 2026-09-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the devin roster, When the fan-out validates `gpt-6-luna-max` or `gpt-6-luna-max-priority`, Then it accepts both and the `fanout-run` and `combo-matrix` suites pass | `fanout-run` + `combo-matrix`: 155 passed, 0 failed, exit 0 (baseline under load: 146 passed, 9 failed); the accept-allowlist, reject, CJS-TS parity and default-parity tests pass | Met | - |
| AC-002 | REQ-002 | Given the five vendor snapshots, When the lenses run, Then seven non-empty lens files exist and no delegate brief contains the Opus hypotheses | Seven lens files, 8,177 to 11,166 bytes; `rg` of eleven hypothesis terms over `scratch/briefs/` returned no match (exit 1) | Met | - |
| AC-003 | REQ-003 | Given the lens outputs, When the synthesis is written, Then every finding cites vendor evidence and a repo `file:line`, and every repeated citation was opened | Every applied row cites a vendor line and a repo line, each re-opened; one wrong number (`AGENTS.md:97`) corrected to `:98` | Met | - |
| AC-004 | REQ-004 | Given the synthesis, When apply finishes, Then each finding is either applied with a diff or listed as rejected with a reason | 18 rows applied in the diff; §3 holds three operator decisions and §4 fifteen rejections, each with its reason | Met | - |
| AC-005 | REQ-005 | Given closeout, When the packet is inspected, Then `scratch/sources/` is gone and no vendor page text is in any packet file | `ls scratch/`; `rg` of a distinctive vendor sentence over the packet | Unmet | - |
| AC-006 | REQ-006 | Given the cli-devin docs, When searched for the new ids, Then every file listing the GPT-5.6 Luna pair also lists the GPT-6 pair, including the Hermes mirror | `SKILL.md`, `providers-and-models.md`, the Hermes mirror and the new changelog list both ids; `README.md:46` and `cli-reference.md:112` name GPT-6 Luna Max in their roster lines and use `gpt-5-6-luna-max` only in usage examples | Met | - |
| AC-007 | REQ-007 | Given an edited instruction file with a runtime copy, When the copies are diffed, Then each carries the same change | `CLAUDE.md` links to `AGENTS.md`; Hermes check PASS 70/70 after regenerating the sk-prompt copy; no agent file changed, agent mirror sync OK | Met | - |
| AC-008 | REQ-008 | Given adjacent defects found during the work, When the packet closes, Then each is listed in `implementation-summary.md` and none is fixed | Limitation 4 lists six adjacent defects; none was edited | Met | - |
| AC-009 | REQ-009 | Given the main checkout, When diffed against its state before this packet, Then only the one comma at `.pi/models.json:13` changed and `pi --list-models llmgateway` lists `mimo-v2.6-pro` | JSON parses and `mimo-v2.6-pro` lists. The fix added a comma and a space inside a line another session had joined; the rest of that diff against HEAD is theirs | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
