---
title: "Acceptance Criteria: Phase 5: packet-and-standalone-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "packet and standalone migration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration"
    last_updated_at: "2026-10-29T07:52:44Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned the phase and no work has started"
    next_safe_action: "Run Phase 1 setup once phases 002 to 004 have landed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: packet-and-standalone-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-packet-and-standalone-migration
**Level:** 1
**Status:** Draft
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When each of the 47 moved skills is read, Then a sibling `ROUTER.md` holds the section that left its `SKILL.md`, with `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` unchanged | `find .skilled/skills -name ROUTER.md -not -path "*/node_modules/*" \| awk 'END{print NR}'` prints 54, and the `o200k_base` command in `plan.md` section 5 prints 82,439 over the 47 | Unmet | - |
| AC-002 | REQ-002 | Given a moved `SKILL.md`, When its SMART ROUTING section is parsed, Then it is at most 12 lines and 180 words and ends with the pointer sentence research section 6 proposes | `package_skill.py --check --strict` prints `Result: PASS`, and `grep -rl 'Read ./ROUTER.md before selecting skill-local resources' .skilled/skills --include=SKILL.md \| awk 'END{print NR}'` prints 47 | Unmet | - |
| AC-003 | REQ-003 | Given the final ledger, When its debt object is counted, Then every one of the 47 entries is gone and 0 remain | `python3 -c "import json;print(len(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json'))['debt']))"` prints 0, and `node --test` on the ratchet file prints pass 4 fail 0 | Unmet | - |
| AC-004 | REQ-004 | Given each of the five batches, When the seven-leg gate runs, Then every leg prints its expected line and the figures match the batch table in `plan.md` | `scratch/batch-01.txt` to `scratch/batch-05.txt` hold the gate output, and `grep -l 'Findings: 0' scratch/batch-0[1-5].txt \| awk 'END{print NR}'` prints 5 | Unmet | - |
| AC-005 | REQ-005 | Given the evidence folder, When it is read, Then the replay baseline, the token baseline and one file per batch are there with the commands and their output | `ls scratch/router-replay-baseline.txt scratch/router-token-baseline.csv scratch/batch-0[0-5].txt` lists eight files | Unmet | - |
| AC-006 | REQ-006 | Given the phase diff, When its file list is read, Then it touches only the 47 skills, the ledger, the Hermes copies and `scratch/` | `git diff --name-only` names no hub `SKILL.md`, no hub `ROUTER.md`, no reader, no check and no template | Unmet | - |

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

**Closeable:** No

The phase is planned and has not started. Every criterion is unmet.
<!-- /ANCHOR:closure -->

---
