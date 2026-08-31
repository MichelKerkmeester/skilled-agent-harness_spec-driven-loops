---
title: "Acceptance Criteria: Add the sk-create-with-human-voice mode packet to the sk-doc hub"
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
    packet_pointer: "specs/sk-doc/039-create-with-human-voice"
    last_updated_at: "2026-08-31T22:20:00Z"
    last_updated_by: "stream-1"
    recent_action: "Verified all eight criteria against observed command output"
    next_safe_action: "Hand the recorded cross-owner proposals to streams 2, 4 and 5"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/commands/create/with-human-voice.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-1-039-create-with-human-voice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should hvr-rules.md move into the new packet? No. Hundreds of files carry the path, most of them frozen spec documents, plus a spec-kit golden snapshot."
      - "Should the mode carry a slash command? Yes. Every sibling has one and section 7 row 11 exists for it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Add the sk-create-with-human-voice mode packet to the sk-doc hub

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-doc/039-create-with-human-voice
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the standard at its current path, When the packet ships, Then the file has not moved and no term list is copied into the packet | `git status` shows no change to `shared/references/hvr-rules.md`. The scanner parses it at run time and holds no list | Met | - |
| AC-002 | REQ-002 | Given the hub, When `parent-skill-check` runs against `.opencode/skills/sk-doc`, Then it reports 14 modes and zero warnings | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` reports `3b: mode-registry.json declares 14 modes` and `OK: all hard invariants passed, 0 warnings` | Met | - |
| AC-003 | REQ-003 | Given the packet, When the strict packaging check runs, Then it passes with no warnings | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-with-human-voice --check --strict` reports `Result: PASS` with no warning block | Met | - |
| AC-004 | REQ-004 | Given section 7's eleven surfaces, When the mode is registered, Then every applicable surface carries it and the inapplicable one is named | Ten surfaces updated, row 10 not applicable. The per-row table with its verification is in `plan.md` FIX ADDENDUM | Met | - |
| AC-005 | REQ-005 | Given a standard whose section heading was renamed, When the scanner runs, Then it exits 2 rather than reporting a clean scan | `hvr_scan.py <fixture> --rules <renamed copy>` prints `parsed too thin on hardWords` and exits 2. Renumbering the same section leaves the result unchanged | Met | - |
| AC-006 | REQ-006 | Given a voice request, When both routing stages run, Then both select the mode and no sibling loses traffic it held before | `router-replay.cjs` on seven phrasings: the mode's own phrasings return `intents: [sk-create-with-human-voice]` with `surfaceIntents: [HVR]` and no missing resources. `add a repo rule` and `create a readme` route unchanged. `skill_advisor.py` returns `sk-doc` at 0.95 on two voice phrasings | Met | - |
| AC-007 | REQ-007 | Given the new command, When it is validated and mirrored, Then it is a valid command document present on all four runtime surfaces | `validate_document.py --type command` reports 0 issues. `sync-runtime-mirrors --check` 171 in sync, `sync-prompts --check` and `sync-prompts-pi --check` 36 each | Met | - |
| AC-008 | REQ-008 | Given a fixture carrying one finding of each mechanical class, When the scanner runs, Then it reports 6 hard blockers and nothing from the fenced block or the inline code span | `hvr_scan.py scripts/tests/fixtures/voice-dirty.md --all` lists findings only on lines 8, 10 and 12, none on lines 15 through 20. The clean fixture reports nothing and exits 0 | Met | - |

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

AC-002 and AC-004 carried the packet: a mode that passes every gate and is still unreachable
is the failure section 7 was written to prevent, so the surface-by-surface table and the
two-stage replay are the evidence that matters. AC-005 and AC-008 carry the scanner, because
a checker that silently stops checking is worse than no checker.

Consciously left out: the manual-testing playbook, which is optional at packet level and
whose job the four README controls already do; the delegation edit inside
`sk-create-quality-control`, which belongs to a concurrent stream and is recorded as a
proposal in `spec.md` section 6; and the advisor command-bridge regeneration, which would
rewrite two files another stream needs byte-stable.
<!-- /ANCHOR:closure -->
