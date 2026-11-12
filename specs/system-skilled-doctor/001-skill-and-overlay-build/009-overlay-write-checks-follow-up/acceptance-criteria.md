---
title: "Acceptance Criteria: Phase 9: overlay-write-checks-follow-up"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "overlay write checks follow up acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up"
    last_updated_at: "2026-11-11T19:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the evidence for every criterion"
    next_safe_action: "None. The packet is closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-overlay-write-checks-follow-up-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: overlay-write-checks-follow-up

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-overlay-write-checks-follow-up
**Level:** 2
**Status:** Complete
**Date:** 2026-11-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Each row is Unmet until its task in `tasks.md` is done and the Verification cell names what was observed.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `references/overlays.md` with 8 trigger phrases, When the Skill Doc Frontmatter workflow runs on `main`, Then it concludes `success` | `gh run list --branch main` shows `Skill Doc Frontmatter` `success` on `dd58ccee3f` | Met | - |
| AC-002 | REQ-002 | Given a lock file naming a pid that does not exist, When `apply` runs, Then it prints one line naming the dead owner and proceeds, and a lock naming a live pid, no pid or a malformed line exits 2 | Tests `apply takes over a lock naming a dead pid on this host and clears the file`, `apply refuses a lock naming a live pid on this host`, `apply refuses a lock with no pid in it` and `apply refuses a lock naming a dead pid on another host` pass in `tests/overlay-engine-follow-up.test.cjs` | Met | - |
| AC-003 | REQ-003 | Given a manifest whose layout link target changed after an apply, When `apply` runs, Then the link points at the new target, and a link the state file does not record stays a problem | Tests `apply retargets a layout link the engine made when the manifest target changes` and `apply refuses a layout link the state does not record and leaves it alone` pass | Met | - |
| AC-004 | REQ-004 | Given an `appendItems` overlay that dropped one item it added earlier, When `apply` runs, Then the item leaves the live file, and a dropped item edited by hand stays and is reported | Tests `apply removes an appended item the entry set drops` and `apply refuses to remove a dropped item that was edited after it was applied` pass | Met | - |
| AC-005 | REQ-005 | Given the glob `a/**/x.json`, When the guard judges `a/x.json`, `a/b/x.json` and `a/my-x.json`, Then the first two are allowed and the third is refused | The glob test in `tests/overlay-engine-strict-writes.test.cjs` passes: `a/x.json` and `a/b/x.json` allowed, `a/my-x.json` refused | Met | - |
| AC-006 | REQ-006 | Given `strictWrites` true and a `repin.exclude` folder, When `--guard` and `pre-commit` judge a path under it, Then both allow it | The excluded-path guard and commit check tests in `tests/overlay-engine-strict-writes.test.cjs` pass | Met | - |
| AC-007 | REQ-007 | Given a staged CRLF copy of an upstream LF file, When `pre-commit` runs, Then it exits 0 | The CRLF commit check test in `tests/overlay-engine-strict-writes.test.cjs` passes with exit 0 | Met | - |
| AC-008 | REQ-008 | Given the changed engine, When `node --test tests/` runs in the doctor scripts folder, Then it prints `fail 0` with at least 1,100 passes | `node --test tests/` printed `tests 1145`, `pass 1145`, `fail 0` after the last fix | Met | - |
| AC-009 | REQ-009 | Given a `repin.rootFiles` overlay whose upstream file changed, When `status` runs, Then it prints one line naming the file and exits 1 | Test `status reports an owned root file whose pinned copy upstream has moved on from` passes | Met | - |
| AC-010 | REQ-010 | Given one overlay source off the layout, When `status` runs, Then it prints one line naming the source and where it belongs, and the exit code is what it was without the line | Test `status names a source kept off the layout without failing the run` passes | Met | - |
| AC-011 | REQ-011 | Given off-layout sources of each scope, When `apply --relayout` runs, Then each sits at its layout path, the manifest names the new paths, a backup of each moved path exists and each old and new path is printed. With a target present it exits 2 and moves nothing | Tests `relayout moves every off-layout source onto its layout path` and `relayout refuses to move a source whose layout path is already taken` pass | Met | - |
| AC-012 | REQ-012 | Given an unowned vendored file that differs from upstream and an upstream link the tree lacks, When `status --audit` runs, Then both are listed, and an owned or generated path is not | Test `status --audit names the vendored drift no overlay owns and plain status stays quiet` passes | Met | - |
| AC-013 | REQ-013 | Given the OpenCode adapter and a tree with `strictWrites` true, When a write tool targets an unowned vendored path, Then the adapter throws the engine's refusal line. With no manifest it does nothing | `node --test .skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs` printed `tests 9`, `fail 0` | Met | - |
| AC-014 | REQ-014 | Given the four groups of paths the review named, When the strict-writes test file runs, Then each group has a passing test, and a CI workflow file names the `overlay-guard` tests | `tests/overlay-engine-strict-writes.test.cjs` holds 17 passing tests, up from 10. The CI part is met by the OpenCode Plugin Tests workflow, which collects every `node:test` file under `.skilled/hooks` and concluded `success` on `dd58ccee3f`. No workflow file was changed, as `plan.md` records | Met | - |
| AC-015 | REQ-015 | Given the changed command documents, When `route-validate.sh` and the contract test run, Then both pass | `route-validate.sh` printed `OK: route-validate`, 31 routes, and `tests/doctor-overlay-contract.test.cjs` printed `pass 8`, `fail 0` | Met | - |
| AC-016 | REQ-016 | Given the pushed implementation, When `/deep:review` has run 5 iterations and a fresh Opus agent has written the synthesis, Then every P0 and P1 finding is fixed or rejected with evidence in `implementation-summary.md` | `review/review-report.md` lists 3 P1 and 0 P0. `implementation-summary.md` lists SYN-01 to SYN-03 as fixed, each with its test | Met | - |
| AC-017 | REQ-017 | Given the final commit on `main`, When the release is republished, Then on origin the `v4.0.2.1` tag and `main` name one commit and the release body equals the built notes | Checked by the release step after this packet's last commit: `git ls-remote origin 'refs/tags/v4.0.2.1^{}' refs/heads/main` names one commit, and the body `gh release view v4.0.2.1` prints equals the output of `build_release_notes.py` | Met | - |

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

Every criterion is Met. AC-017 is checked by the release step that follows this packet's last commit, because a commit cannot hold the proof of its own tag.
<!-- /ANCHOR:closure -->
