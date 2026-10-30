---
title: "Acceptance Criteria: Phase 3: convert-legacy-skilled"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "convert legacy skilled acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled"
    last_updated_at: "2026-10-30T08:21:36Z"
    last_updated_by: "codex"
    recent_action: "Recorded review-fix acceptance evidence"
    next_safe_action: "No further implementation action"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: convert-legacy-skilled

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the committed pre-move fixture, When `apply --apply` runs, Then the new `ROUTER.md` machine section is byte-equal to the expected post-move section | Golden test deep-compares the complete machine-section body with `tests/fixtures/sk-skill-convert/expected/ROUTER.md` and checks the moved source body as an exact suffix. Evidence: `tasks.md:131`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:328` | Met | - |
| AC-002 | REQ-002 | Given the staged snapshot, When the move completes, Then `parseRouter` before deep-equals the new router text output and the resolved routing semantics remain equal | Golden test deep-compares the full parser output on the pre-edit `SKILL.md` snapshot and new `ROUTER.md` text, then compares actual-root routing semantics. Evidence: `tasks.md:131`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:333` | Met | - |
| AC-003 | REQ-003 | Given the converted fixture, When `package_skill.py --check --strict` runs, Then it prints `Result: PASS` | Golden test asserts exit 0, `Result: PASS`, and no RS-002, RS-004 or RS-005. Evidence: `tasks.md:58`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:338` | Met | - |
| AC-004 | REQ-004 | Given a converted fixture, When `apply --apply` runs again, Then no file changes | Golden test hashes the full fixture tree before and after the second apply; hashes are equal. Evidence: `tasks.md:57`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:351` | Met | - |
| AC-005 | REQ-005 | Given a target file that already exists, When `apply --apply` runs, Then that file is byte-identical afterwards and every overwritten file has a backup under `.skilled/skills/.state/doctor-sk-skill/` | No-replace test preserves the sentinel bytes; golden test verifies the backed-up `SKILL.md` and parser-input snapshot. Evidence: `tasks.md:121`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:425` | Met | - |
| AC-006 | REQ-006 | Given an unsupported declaration or skill shape, When `plan` runs, Then it refuses with its specific code and writes nothing | Refusal tests cover dual declaration, each hub file independently, nested packets, reserved/persona prefixes, name collision, long description and non-kebab name. Evidence: `tasks.md:133`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:496` | Met | - |
| AC-007 | REQ-007 | Given any fixture, When `plan` runs without `--apply`, Then no file changes and every overwrite is named in the output | Golden plan case checks the `SKILL.md` overwrite and `ROUTER.md` create lines, then confirms the tree is unchanged. Evidence: `tasks.md:130`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:302` | Met | - |
| AC-008 | REQ-001 | Given a transform refusal, When `plan` reports it, Then the transform code is retained and input refusal exits 1 while a missing prerequisite exits 2 | Tests assert `ALLOWED_TOOLS_AMBIGUOUS` with exit 1 and `ROUTER_RESOLVER_MISSING` with exit 2. Evidence: `tasks.md:60`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:602` | Met | - |
| AC-009 | REQ-001 | Given `allowed-tools` with commas inside a parenthesized tool argument, When it is normalized, Then only commas at depth zero split entries and unbalanced parentheses refuse | Transform tests preserve `Bash(git log, git show)` as one item and assert `ALLOWED_TOOLS_AMBIGUOUS` for malformed input. Evidence: `tasks.md:61`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:248` | Met | - |
| AC-010 | REQ-001 | Given a short version or an already four-part version, When a plan is printed, Then the short version shows its padded value and the four-part version has no version step; an existing flow sequence stays byte-identical | Tests check `1.2` → `1.2.0.0`, no version step for `1.2.3.4`, and exact flow-sequence bytes. Evidence: `tasks.md:61`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:379` | Met | - |
| AC-011 | REQ-006 | Given an existing `ROUTER.md`, When its frontmatter needs V2 normalization, Then `SKILL.md` is normalized and V3 does not create or replace a router | Test applies frontmatter normalization and preserves the original router bytes. Evidence: `tasks.md:63`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:395` | Met | - |
| AC-012 | REQ-005 | Given a pre-write proof mismatch or router-create failure, When `apply --apply` stops before writing, Then its new backup is removed; snapshots contain only parser inputs | Tests assert cleanup for `ROUTER_CONTENT_CHANGED` and failed exclusive create and inspect snapshot filenames. Evidence: `tasks.md:121`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:454` | Met | - |
| AC-013 | REQ-006 | Given nested `SKILL.md` files under any traversable directory, When `plan` scans the skill, Then it refuses except for `.git` and `node_modules` | Tests cover `local-`, benchmark, fixture, scratch and symlink directories, plus the two skipped directories. Evidence: `tasks.md:62`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:563` | Met | - |
| AC-014 | REQ-007 | Given an invalid invocation, When the command reports `USAGE`, Then it prints the complete usage message | Test asserts all usage lines are present. Evidence: `tasks.md:60`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:613` | Met | - |
| AC-015 | REQ-001 | Given a shallow checkout, When the fixture golden runs, Then conversion uses committed fixtures and the optional history comparison skips with a reason; fixture files stay outside skill discovery | Shallow clone test reports the missing-parent skip; Hermes sync and advisor discovery checks pass. Evidence: `tasks.md:64`; `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs:356` | Met | - |

`parseRouter` includes `routerSource`, which correctly changes from `inline` to `ROUTER.md` when called on the actual roots. AC-002 deep-compares the full text-parser output with the same inline provenance on both strings, then verifies every routing-semantic field on the actual before/after roots and records the expected provenance change separately.

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

All fifteen criteria are met. Their evidence is recorded in the Verification column and in `tasks.md`.
<!-- /ANCHOR:closure -->
