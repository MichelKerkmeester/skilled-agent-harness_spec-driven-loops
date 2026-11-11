---
title: "Acceptance Criteria: Phase 8: overlay-first-write-checks"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "overlay first write checks acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/008-overlay-first-write-checks"
    last_updated_at: "2026-11-11T19:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Met every criterion"
    next_safe_action: "Barter re-pins to the commit that carries this change"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-overlay-first-write-checks-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: overlay-first-write-checks

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-overlay-first-write-checks
**Level:** 2
**Status:** Complete
**Date:** 2026-11-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Each cited test passed in the final run of `node --test` over the overlay engine tests, the contract test and the hook test, which printed `tests 102`, `pass 102`, `fail 0`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a manifest without `strictWrites`, When `--guard` judges a new file, an unowned upstream file and a named root file, Then each prints `allow` and exits 0, and the tests that existed before still pass | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:193`, the setting-off test. The 91 tests of the baseline are among the 102 passes | Met | - |
| AC-002 | REQ-002 | Given `strictWrites` true, When `--guard` judges a new file under `.skilled`, Then it exits 1, names the overlay path to create and `apply --adopt` for the highest new folder, and for a folder an overlay owns it names that overlay's source | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:133` | Met | - |
| AC-003 | REQ-003 | Given `strictWrites` true, When `--guard` judges an existing upstream file no overlay owns, Then it exits 1 and names `apply --adopt <path>` | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:149` | Met | - |
| AC-004 | REQ-004 | Given a `generated` glob, When `--guard` or `pre-commit` judges a matching path, Then it is allowed, and `apply --adopt` on it exits 2 | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:176` for the guard, `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:297` for the commit check, `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:262` for the adopt refusal | Met | - |
| AC-005 | REQ-005 | Given a new folder with a token-named `.md` file, When `apply --adopt <folder>` runs, Then the manifest gains one directory entry with that file in `protectedPaths`, the overlay copy exists, every earlier byte of the manifest is unchanged and `status` exits 0 | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:214` | Met | - |
| AC-006 | REQ-006 | Given an upstream file edited in place, When `apply --adopt <file>` runs, Then the entry's `pinnedSha256` is the hash of upstream's bytes at the pin and the overlay copy holds the edited bytes | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:244` | Met | - |
| AC-007 | REQ-007 | Given staged changes under a vendored root, When `pre-commit` runs, Then it exits 1 naming each unowned one, and exits 0 for owned, generated and upstream-equal changes and for a commit that moves the pin | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:297` | Met | - |
| AC-008 | REQ-008 | Given `repin.rootFiles` naming two files upstream changed, When a re-pin is staged, Then the report holds one `root-file` line for each, says which one an overlay owns, and the tree's copy is unchanged | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:339` | Met | - |
| AC-009 | REQ-009 | Given a folder holding `api-token.json`, When `apply --adopt` runs on it, Then it exits 2 with a protected-path line and writes nothing | `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:262`. The name test is `.skilled/commands/doctor/scripts/overlay-engine.cjs:3656`, which runs before any read | Met | - |
| AC-010 | REQ-010 | Given `strictWrites` true, When the hook core evaluates an unowned vendored path, Then its decision is `deny` with the engine's line, and `lib/overlay-guard.cjs` is unchanged | `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:200`. `git status --short .skilled/hooks/overlay-guard/lib/overlay-guard.cjs` prints nothing | Met | - |
| AC-011 | REQ-011 | Given the changed router, presentation, manifest and workflow, When the contract test and the route validator run, Then both pass | `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs:112`, in a run that prints `pass 8`. `route-validate.sh` ends with `OK: route-validate` | Met | - |

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

Every criterion is Met against the final run of the overlay gate.
<!-- /ANCHOR:closure -->
