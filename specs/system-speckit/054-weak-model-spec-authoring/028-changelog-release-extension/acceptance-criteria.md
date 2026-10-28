---
title: "Acceptance Criteria: Phase 28: changelog-release-extension"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "changelog release extension acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/028-changelog-release-extension"
    last_updated_at: "2026-10-28T05:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every row Met after the review fixes"
    next_safe_action: "None. Every row is Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-028-changelog-release-extension"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 28: changelog-release-extension

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `028-changelog-release-extension`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `skilled` run whose latest version has no tag on origin, When step 3 runs, Then `entry_mode` is `extend`, the version is kept and the bump and collision check are skipped. A tagged latest version keeps `create` | Step 3 of both YAMLs; `git ls-remote --exit-code --tags origin refs/tags/v4.0.0.16` exits 2 and for `v4.0.0.15` exits 0 | Met | - |
| AC-002 | REQ-002 | Given the skill, both YAMLs, README and references, When searched for the never-reuse rule, Then each place names the extension as its one exception and both YAMLs carry the same steps | SKILL.md section 7 steps 3 to 6, section 9 checks 1 and 2, NEVER rule 2; both YAMLs steps 3 to 6 and rules; README How It Works; `references/version-bump-rules.md` section 5 | Met | - |
| AC-003 | REQ-003 | Given the tag check fails, a bump is chosen or the open entry exists only upstream, When step 3 runs, Then the run numbers a new entry and says so, names the unapplied bump, or stops with a merge or rebase request | Step 3 of both YAMLs, identical by `diff` of the two blocks | Met | - |
| AC-004 | REQ-004 | Given the playbook, When the package validator runs, Then it passes with CHG-013 indexed | `validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook` prints `PASS ... scenarios=13 ... violations=0` | Met | - |
| AC-005 | REQ-005 | Given the quality-control SKILL.md and workflows reference, When grepped for `doc:quality`, Then only SKILL.md lines 12, 30 and 65 remain | `grep -n "doc:quality"` over both files prints those three lines | Met | - |
| AC-006 | REQ-006 | Given the two new changelog entries, When validated, Then each has 0 issues, the pushed v1.0.3.0 entry is unchanged and the Hermes copies are in sync | `validate_document.py` prints `Total issues: 0` for v1.3.7.0 and v1.0.4.0; `git diff origin/main -- .../v1.0.3.0.md` is empty; `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync` | Met | - |
| AC-007 | REQ-002 | Given a fresh reviewer reads the diff, When it reports findings, Then each is fixed or recorded with a reason | The review's findings and their fixes in `implementation-summary.md` section 4 | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
