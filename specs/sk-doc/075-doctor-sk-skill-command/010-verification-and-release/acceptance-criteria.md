---
title: "Acceptance Criteria: Phase 10: verification-and-release"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "verification and release acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/010-verification-and-release"
    last_updated_at: "2026-10-30T05:21:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-verification-and-release"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: verification-and-release

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/010-verification-and-release
**Level:** 2
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase 1 baseline, When `package_skill.py --check --strict` runs on every shipped skill, Then each verdict matches the baseline | `scratch/after.md` per-skill table | Unmet | - |
| AC-002 | REQ-002 | Given the final tree, When `capture-scorer-eval-baseline.mjs` runs without `--write`, Then it reads 155/195, 49/66 and 19/24 | Scorer JSON in `scratch/after.md` | Unmet | - |
| AC-003 | REQ-003 | Given the final tree, When `leaf-route-replay.cjs | grep ^total` runs, Then it prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50` | Replay line | Unmet | - |
| AC-004 | REQ-004 | Given the final tree, When `run-all.sh` runs, Then every suite prints PASS | run-all output | Unmet | - |
| AC-005 | REQ-005 | Given the temp-repo harness, When convert runs on a scratch plain skill and a scratch pre-migration skill, Then each ends strict PASS and its `.skilled/changelog/<name>` link resolves to `v<version>.md` | Transcripts and `ls` output | Unmet | - |
| AC-006 | REQ-006 | Given the setup presentation, When `/doctor:setup` runs, Then it lists `/doctor:sk-skill check` and `/doctor:sk-skill convert` | `rg -c` output and the run transcript | Unmet | - |
| AC-007 | REQ-007 | Given the router and presentation, When `validate_document.py .skilled/commands/doctor/sk-skill.md --type command` and `route-validate.sh` run, Then both exit 0 and the validator prints `Total issues: 0` | Validator and route-validate output | Unmet | - |
| AC-008 | REQ-008 | Given the merge commit on main, When `gh run list --branch main` is read for it, Then every run concludes `success` or is switched off | gh output | Unmet | - |
| AC-009 | REQ-009 | Given the release, When `validate_document.py` runs on the new `.skilled/changelog/skilled/` entry with `--type changelog`, Then it exits 0 | Validator output | Unmet | - |

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

No criterion is met yet, because the phase is planned and not started.
<!-- /ANCHOR:closure -->
