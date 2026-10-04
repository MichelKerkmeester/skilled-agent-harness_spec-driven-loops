---
title: "Acceptance Criteria: Doctor update fixes"
description: "The criteria this packet must satisfy before it may be closed: one per /doctor:update finding plus the no-regression criterion, each met with observed evidence, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor update acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/006-doctor-update-fixes"
    last_updated_at: "2026-10-03T21:06:41Z"
    last_updated_by: "plan-author"
    recent_action: "Wrote one acceptance criterion per finding plus the no-regression criterion"
    next_safe_action: "Build phase A, then meet each criterion with observed evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-006-doctor-update-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor update fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/006-doctor-update-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Test names below are the names the tasks in `tasks.md` give. "Engine suite" means `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs`, and "contract test" means `node --test .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the engine suite and `run-all.sh` run, Then the suite reports `tests 71`, `pass 71`, `fail 0` with exit 0, `run-all.sh` exits 0, and of the original 56 tests only the assertions at `release-update.test.cjs:569` and `:689` and the test at `:822-839` changed | Both commands with their output and exit status, plus `git diff 506bc5a10c -- .skilled/commands/doctor/scripts/tests/release-update.test.cjs` read hunk by hunk Observed at f67263c396: engine suite `tests 72`, `pass 72`, `fail 0`, exit 0 (72, not 71, because the signal re-raise task added one test), and `run-all.sh` 8 suites passed, exit 0. Only 3 lines of the original 56 tests changed. | Met | - |
| AC-002 | REQ-002 | Given a unit with one conflict file and one take-release file, When only one file is decided and apply runs, Then the unit is skipped with reason `undecided files` and the other path, none of its files is written, `base.json` has no record for it, and a re-check still reports it `conflict` | Engine test `apply skips a unit whose changing files are only partly decided and keeps its base` passes, and fails against the engine at `506bc5a10c` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-003 | REQ-003 | Given an apply that receives SIGTERM after it takes the lock, When the engine exits, Then the lock is absent and rollback succeeds. Given a lock whose owner pid is dead, When apply, rollback or unlock runs, Then apply and rollback refuse and name `unlock` and the rollback command, `unlock` removes the lock, and `unlock` refuses a running or unreadable owner | Engine tests `a signal while the apply lock is held cannot strand the lock` and `a stale apply lock is reported with its recovery and only unlock clears it`, the contract test `the lock template routes stale locks to rollback`, and `git check-ignore -v .skilled/release/.apply.lock` matching `.skilled/release/.gitignore` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-004 | REQ-004 | Given a copied tree whose `origin` lists no release tags, When check runs without and then with `--remote`, and record-base runs with `--remote`, Then the first check reports `upstream.error`, record-base stores the remote in `base.json`, and a later plain check reports `update` with a recorded base | Engine test `a copied tree names its framework remote once and later checks use it`, and the contract test `every routed flag is a declared input of its action's workflow` covering `--remote` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-005 | REQ-005 | Given a copied v1.0.0.0 tree, When record-base names v1.1.0.0, Then it exits 1 and names v1.0.0.0 as nearest for `skill:hub-a`, `--trust-release` records it with `verified: false`, and record-base writes `base.json` under the apply lock | Engine test `record-base refuses a release that is not the nearest to the local tree`, and `rg -n "command: 'record-base'" .skilled/commands/doctor/scripts/release-update.cjs` showing the lock owner Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-006 | REQ-006 | Given an apply dry-run, When a newer tag is published and apply runs with the dry-run's release and digest, Then the approved release is written. When a planned file changes before apply, Then the digest mismatch is refused | Engine test `apply binds to the dry-run release and refuses a plan that changed`, and `doctor-update-apply.yaml` phase 4 passing `--release` and `--plan-digest` Observed at f67263c396: the named test passes, and `doctor-update-apply.yaml:133` passes `--release` and `--plan-digest` to the real apply. | Met | - |
| AC-007 | REQ-007 | Given an uncommitted `base.json` from a first apply, When a second apply runs, Then it exits 1, names `base.json` and says to commit it, and the apply result template says to commit the release records | Engine test `a second apply names the uncommitted release record and the commit remedy`, and the contract test `the apply result tells the operator to commit the release records` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-008 | REQ-008 | Given a copied tree that holds only the shipped `.skilled/release/.gitignore`, When `git check-ignore` runs, Then `runs/` and `.apply.lock` are ignored and `base.json` and `divergence.json` are not, and the align and apply preflights name the run-root template | Engine test `the shipped release ignore rule covers runs and the apply lock and not the base records`, and `rg -n "run root is not ignored" .skilled/commands/doctor/assets/doctor-update-presentation.txt` Observed at f67263c396: the test runs as `the shipped release ignore rule covers runs and the apply lock but not base records` and passes, and `rg` finds the run-root template at `doctor-update-presentation.txt:113` and `:220`. | Met | - |
| AC-009 | REQ-009 | Given a copied tree after record-base and a commit, When check runs, Then `baseRecording.needed` is false and no `directory:release` unit exists | Engine test `a copied tree needs no further base recording after record-base and a commit`, and the updated assertion at `release-update.test.cjs:569` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-010 | REQ-010 | Given an alignment run with one operator decision, When a bare apply runs, Then it exits 1, names the `--decisions` path, and the run stays applicable | Engine test `a bare apply refuses an alignment run that holds operator decisions` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-011 | REQ-011 | Given the router, When an operator asks for `rollback` or `record-base`, Then each routes to its own workflow with an approval gate, a path validator and a state log, and both are registered in `command-contract.json` and `_routes.yaml` | Contract test `every engine write command has a routed action with an approval gate`, engine test `rollback --dry-run previews restored and skipped paths and writes nothing`, `route-validate.sh` exit 0, and `generate-command-routers.cjs --check` with no doctor router drifted Observed at f67263c396: both named tests pass, `route-validate.sh` exit 0, and the router check shows `routers=32 clean=29 path-drift=3` with all three drifts in speckit, none in doctor. | Met | - |
| AC-012 | REQ-012 | Given a tree at v1.1.0.0, When check and apply name v1.0.0.0, Then `skill:hub-a` reads `downgrade` and apply skips it and leaves its file at v1.1 | Engine test `an explicit older release reports downgrade and apply leaves the unit alone` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-013 | REQ-013 | Given an applied unit with a regenerated trigger index or activation manifest, When apply plans, Then `followUps.regenerate` names its generator, and the battery has a step for every generator the engine names | Engine test `regenerated trigger-index and route manifests are generated and name their generators`, and the contract test `every generator the engine names has a post-apply battery step` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-014 | REQ-014 | Given the check workflow, apply workflow and presentation, When they are compared with the engine, Then the upstream vocabulary, the `blocked` mapping, rollback's exit 1 on skipped paths, the hub-directory mapping, apply's `--offline` and `--remote`, and `at-release` all match | Contract test `workflow and presentation vocabulary matches the engine`, `rg -n "partial path, not a failed rollback" .skilled/commands/doctor/assets/`, `rg -n "\.skilled/skills/<hub>" .skilled/commands/doctor/assets/doctor-update-apply.yaml`, and the contract flag test Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-015 | REQ-015 | Given align and apply, When the router accepts `--include-prerelease`, Then each workflow declares the `include_prerelease` input | Contract test `every routed flag is a declared input of its action's workflow` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-016 | REQ-016 | Given an alignment run whose customized unit holds only prefilled records, When apply runs with that decisions file, Then the unit is skipped as `no decisions`, and after `decide adopt-release` the file is written | Engine test `apply writes a customized unit only after decide records its release files` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-017 | REQ-017 | Given an operator who regenerated a trigger index and an activation manifest, When check runs, Then both read `generated` and their units stay `update`, and the engine comment records why `fence-state.json` and `intent_signals` stay authored | The engine test named in AC-013, and `rg -n "fence-state.json\|intent_signals" .skilled/commands/doctor/scripts/release-update.cjs`. Observed at f67263c396: the named test passes, and the comment at `release-update.cjs:79-81` records why both stay authored. | Met | - |
| AC-018 | REQ-018 | Given a release that renames a file inside a unit, When check and align run, Then the old path carries `renamedTo`, the new path carries `renamedFrom`, and the evidence card shows the rename | Engine test `a release rename links its old and new paths` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-019 | REQ-019 | Given the apply, rollback and record-base workflows, When the operator cancels or the session is interrupted, Then each ends with `STATUS=CANCELLED ACTION=cancelled`, and an explicit no ends with `STATUS=DECLINED` | Contract test `every write action records cancellation as CANCELLED` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-020 | REQ-020 | Given align and apply, When either runs with `--dry-run`, Then both state the same rule that a dry run writes no file, including no state log | Contract test `align and apply state the same dry-run rule` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-021 | REQ-021 | Given `update.md` and `command-contract.json`, When the hints are compared, Then the router hint is at most 140 characters and the contract carries it exactly | Contract test `the router hint is within budget and matches the command contract` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-022 | REQ-022 | Given `update.md`, When it is searched, Then it holds no engine record-base invocation and no commit instruction | Contract test `the router carries no next-step wording or overclaim` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-023 | REQ-023 | Given a release change to a leaf manifest the operator never regenerated, When apply plans, Then the manifest is written, and the router says so | Engine test `a release change to an unregenerated leaf manifest is written`, and the contract test named in AC-022 Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-024 | REQ-024 | Given the router and presentation, When check is described, Then the router says it is read-only for the checkout and the presentation names the object-store fetch next to `--offline` | Contract tests `the router carries no next-step wording or overclaim` and `the presentation discloses the release fetch next to --offline` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-025 | REQ-025 | Given `update.md`, When its frontmatter is read, Then `allowed-tools` is `Read, Bash` | Contract test `the router grants only Read and Bash` Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-026 | REQ-026 | Given a `base.json` record with no tree fingerprint, When check runs, Then its unit reports `recorded-unverified` and appears in `baseRecording.units` | The updated test `a name-only base.json record reads as the one unit with that name and is rewritten` (`release-update.test.cjs:684-695`) Observed at f67263c396: the named tests pass in the engine suite (72 of 72) and the contract test (12 of 12), both exit 0. | Met | - |
| AC-027 | REQ-027 | Given the release-note folder, When its index is read, Then every top-level `vN.N.N.N.md` entry is listed and the entry whose tag does not exist yet is named | `ls .skilled/changelog/skilled/v*.md` and `git tag -l 'v4*'` compared with `.skilled/changelog/skilled/README.md` lines 23 and 25 Observed at f67263c396: `v4.0.0.0` to `v4.0.0.3` entries listed, tags end at `v4.0.0.2`, and the index names `v4.0.0.3.md` as the untagged entry. | Met | - |

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

The packet is planned and not built yet, so no criterion is met. Write the closing statement when phase D passes its checks.
<!-- /ANCHOR:closure -->
