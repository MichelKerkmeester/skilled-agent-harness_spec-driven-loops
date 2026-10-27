---
title: "Acceptance Criteria: Phase 1: shared-rule-contract"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shared rule contract acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/001-shared-rule-contract"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every acceptance criterion with observed evidence"
    next_safe_action: "Land the phase, then start phases 002, 003 and 004"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/references/universal/rule-overrides.md"
      - ".skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: shared-rule-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/017-portable-code-modes/001-shared-rule-contract
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the contract reference, When a reader looks for the section, row format, id grammar, fixed ids, precedence, seats and recording, Then each has its own section | `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md:43` opens sections 2 to 7. `validate_document.py` reports 0 issues | Met | - |
| AC-002 | REQ-002 | Given the floor JSON gains an id the reference lacks, When the suite runs, Then the floor agreement test fails | `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs:153`. Scratch drift copy: pass 8, fail 1, the failing test is the floor agreement, exit 1 | Met | - |
| AC-003 | REQ-003 | Given a checklist naming `secret.private-key`, When the linter runs, Then it exits 1 and names the rule. Given a valid or absent section, Then it exits 0 | `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs:84` and `:135`. `node --test` on the suite: pass 11, fail 0. Before the linter existed: pass 0, fail 1 | Met | - |
| AC-004 | REQ-004 | Given the hub changelog and carriers, When the checks run, Then the entry has 0 issues, the carriers read 3.9.7.0 and Hermes is in sync | `.skilled/skills/sk-code/SKILL.md:5` and `.skilled/skills/sk-code/changelog/v3.9.7.0.md:11` read 3.9.7.0. `validate_document.py` 0 issues, `parent-skill-check.cjs` OK, `sync-skills-hermes.cjs --check` PASS | Met | - |
| AC-005 | REQ-005 | Given the phase diff, When `git status --short` runs, Then no file under `sk-code-quality/` or `sk-code-review/` is listed | `tasks.md:63` records the run. `git status --short` lists none | Met | - |
| AC-006 | REQ-006 | Given a change under `.skilled/skills/sk-code/**` or its `.opencode` twin, When the sk-code Script Tests workflow runs, Then it runs the shared suite with the job's switch, timeout and permissions unchanged | `.github/workflows/sk-code-script-tests.yml:84`. The YAML parses, `actionlint` exits 0 and `check-gate-inputs.sh` prints `RESULT: PASSED` | Met | - |
| AC-007 | REQ-007 | Given a section with a floor row or a `replace:` row on `hygiene.task`, When `lintOverrides` reads it, Then it returns an error for that row and no row for it, and the module exports no other reader | `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs:92` and `:100`. Pass on the final files, fail in the scratch copy without the change | Met | - |

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

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
