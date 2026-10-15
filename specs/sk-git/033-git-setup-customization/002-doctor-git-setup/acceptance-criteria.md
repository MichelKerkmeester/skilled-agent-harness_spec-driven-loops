---
title: "Acceptance Criteria: Phase 2: doctor-git-setup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor git setup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-doctor-git-setup"
    last_updated_at: "2026-10-15T06:52:16Z"
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
# Acceptance Criteria: Phase 2: doctor-git-setup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/033-git-setup-customization/002-doctor-git-setup
**Level:** 2
**Status:** Complete
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new route row, When `route-validate.sh` runs, Then it passes and lists `setup` under `/doctor:git` as read-only | `route-validate.sh` output. Observed: route-validate.sh exit 0, C1 PASS (`.skilled/commands/doctor/_routes.yaml:276`) | Met | - |
| AC-002 | REQ-002 | Given a fixture repository, When the battery runs, Then it prints eleven result rows, a repair line for each FAIL and a final `STATUS=` line, and exits 0 when all pass and 1 when one fails | `git-setup-check.test.cjs`, rerun with `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`. Observed: the test "human mode prints every row and every repair line for a run with several failures" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:211`) asserts all eleven row lines, each `repair:` line and the final `STATUS=FAIL` line with exit 1, and "human mode ends with the STATUS line that decides the exit code" (`:184`) asserts `STATUS=OK checks=11` with exit 0. Phase 5 added exit 3 for a DEGRADED run, asserted at `:241` | Met | - |
| AC-003 | REQ-002 | Given no git repository, When the battery runs, Then it exits 2 with a usage message | `git-setup-check.test.cjs`. Observed: usage-error test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:179`) | Met | - |
| AC-004 | REQ-003 | Given a fixture repository, When the battery runs, Then its file tree, `git config --list` and git directory are unchanged | No-write test in `git-setup-check.test.cjs`. Observed: no-write test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:197`) | Met | - |
| AC-005 | REQ-004 | Given an untrusted fixture clone with a planted helper under its own `.skilled/`, When the battery runs, Then the planted helper never runs and the trust check reports SKIP | Planted-helper test. Observed: untrusted-clone test, and trust SKIP on a fresh repository (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:216`) | Met | - |
| AC-006 | REQ-005 | Given no contract, an enforced contract and a malformed rules block, When the standards check runs, Then it reports not enforced, PASS and FAIL in turn | Standards fixtures. Observed: standards tests: not enforced, enforced PASS, malformed FAIL (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:272`) | Met | - |
| AC-007 | REQ-006 | Given a run from one AI tool, When the advisory hook check runs, Then it reports that tool's registration and SKIP with file paths for the others | Advisory fixtures, rerun with `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`. Observed: "ai-tool-hooks accepts each runtime's real wiring and refuses a wrong event or matcher" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:836`) passes this checkout's four real adapter configs and fails each under a wrong event and a wrong matcher, and "ai-tool-hooks requires the active tool and every configured adapter to register" (`:463`) reports every other adapter as not set up with its file path, using the real Codex `PreToolUse` shape | Met | - |
| AC-008 | REQ-007 | Given `--json`, When the battery runs, Then it prints one parseable object with id, result, source, details and repair per check | JSON test. Observed: --json test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130`) | Met | - |
| AC-009 | REQ-008 | Given a `hard-rules.json` rule naming an unknown check, When the advisory rules check runs, Then it fails and names the rule | Advisory rules fixture. Observed: advisory-rules test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:296`) | Met | - |
| AC-010 | REQ-009 | Given every target list in scope, When searched for `/doctor:git` targets, Then each names `setup`, and the playbook holds one setup scenario | `rg` over the scoped files. Observed: diffs of the scoped lists and DOC-384 (`.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:163`) | Met | - |
| AC-011 | REQ-010 | Given the root README, When a reader reaches the adaptation guide, Then an sk-git section points to `/doctor:git setup` as the proof step | `README.md` section. Observed: README section "What Adapting `sk-git` Looks Like" (`README.md:1494`) | Met | - |

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

All eleven criteria are Met, with the battery tests, route validation and the doc diffs as evidence. The per-repository overlay for `hard-rules.json` was left out, as the spec scoped it.
<!-- /ANCHOR:closure -->
