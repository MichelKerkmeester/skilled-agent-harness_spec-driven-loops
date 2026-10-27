---
title: "Acceptance Criteria: Phase 2: quality-hygiene-policy"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "quality hygiene policy acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/002-quality-hygiene-policy"
    last_updated_at: "2026-10-27T22:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every acceptance criterion with observed evidence"
    next_safe_action: "Review the phase, then land it"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/hygiene-config-flags.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: quality-hygiene-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/017-portable-code-modes/002-quality-hygiene-policy
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
| AC-001 | REQ-001 | Given a foreign fixture whose issue, ADR and model-name comments block, When the repository sets `disableRules: ["issue","adr","task"]`, Then the runner exits 0 with no hygiene finding | `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs:360`. Before: fail. After: pass. The checker case `disable_rule_three` at `scripts/tests/check-comment-hygiene.test.sh:261` fails before (exit 3) and passes after | Met | - |
| AC-002 | REQ-002 | Given `disableRules: ["tsak"]`, When the runner starts, Then it exits 3 with `CONFIG_INVALID` naming `commentHygiene.disableRules[0]` and runs no check. Given `--disable-rule tsak`, Then the checker exits 3 | `quality-config.test.cjs:380` and `check-comment-hygiene.test.sh:264`. Each fails before and passes after | Met | - |
| AC-003 | REQ-003 | Given `secret.private-key`, `conflict.markers` or `floor.input-validation`, When the config validates or the checker parses its flags, Then each is refused as fixed by the shared contract | `quality-config.test.cjs:380` and `check-comment-hygiene.test.sh:265`. Before: fail. After: pass | Met | - |
| AC-004 | REQ-004 | Given a staged foreign file, When the pre-commit hook runs with no config, a config that disables the three rules and one that does not validate, Then it blocks, passes, and blocks with a warning | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:669`. Before: 146 passed, 3 failed. After: 152 passed, 0 failed, including the round 1 cases that keep a ticket prefix and a Python-refused pattern out of the commit gate (`:703`), which fail on the pre-fix helper (150 passed, 2 failed) | Met | - |
| AC-005 | REQ-005 | Given this repository with no `.sk-code/quality.json`, When the checks rerun, Then behavior matches the baseline | The checker over every tracked and untracked file prints 0 lines. `node --test` on the quality suite: tests 127, pass 127, fail 0 (baseline 123). A repository with only additions in its config gets the same pre-commit and CI result as HEAD: `quality-config.test.cjs:410` and the CI replay, `All clear` exit 0. The template keeps `"schemaVersion": 1` | Met | - |
| AC-006 | REQ-006 | Given any run, When the verdict prints, Then `config.hygiene.disabled` is present, empty without the key | `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:745`. `quality-config.test.cjs:360` asserts `{ disabled: [] }` and then the three ids | Met | - |
| AC-007 | REQ-007 | Given a repository with no `specs/` folder, When `init` runs, Then the plan suggests the 15 spec-kit ids and the written file keeps `disableRules: []`. With `specs/`, it suggests nothing. `status` names the active list | `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:76` and `:103`. Before: pass 0 fail 2. After: pass 11 fail 0 | Met | - |
| AC-008 | REQ-008 | Given the CI run block, When it runs with no config, a valid config and an invalid one, Then it blocks, clears, and blocks with a warning | `.github/workflows/comment-hygiene.yml:47`. Replayed in a scratch repository: exit 1, exit 0 with `All clear`, exit 1 with `::warning::`. `actionlint` exit 0, `check-gate-inputs.sh` RESULT: PASSED | Met | - |
| AC-009 | REQ-009 | Given the changelog and the carrier, When the checks run, Then the entry has 0 issues, `SKILL.md` reads 1.13.4.0 and Hermes is in sync | `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.4.0.md:11`. `validate_document.py` 0 issues, `sync-skills-hermes.cjs --check` PASS: 67 | Met | - |

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
