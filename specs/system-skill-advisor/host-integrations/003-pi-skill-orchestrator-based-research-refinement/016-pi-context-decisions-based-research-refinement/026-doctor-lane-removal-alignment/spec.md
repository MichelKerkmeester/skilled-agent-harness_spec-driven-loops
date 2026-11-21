---
title: "Feature Specification: Align the doctor surface with the removed advisor lane"
description: "Packet 024 removed the advisor's embedding lane, but the install guide, the doctor routes and the doctor release still describe the old cleanup path. This packet names the cleanup per install type, routes cleanup phrases to /doctor:update, and ships doctor release 1.3.0.0."
trigger_phrases:
  - "doctor lane removal alignment"
  - "align the doctor surface with the removed advisor"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align the doctor surface with the removed advisor lane

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 26 |
| **Predecessor** | 025-review-p2-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, `validate.sh --strict` prints `RESULT: PASSED` on this packet and on 016, and the work is committed on `worktrees/497-ollama-lane-removal` without a merge to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 024 deleted the advisor's embedding lane, and the doctor commands already run the new surface. Four gaps remain. The install guide never names the post-upgrade lane cleanup, and the advisor's v2.0.0.0 upgrade note tells every reader to run `/doctor:update apply`. A linked project cannot run `/doctor:update`: `resolveRepo` in `release-update.cjs` returns the project's top level when `.skilled` is a symlink to an outside checkout, and the engine's path safety then refuses the writes. Four cleanup prompts return NO_MATCH from `doctor-helper-match.cjs`, so the advisor routes none of them. The setup playbook still says five legs and 25 rows, and the doctor skill is still at 1.2.0.0 with no entry for what 024 removed.

Whether `/doctor:update apply` on an already-current copy still reaches the lane cleanup is inferred from the workflow text, not observed. No fixture proves it.

### Purpose
A user who types a cleanup request reaches `/doctor:update`, the install guide names the cleanup command for that user's install type, and the doctor release records what 024 removed. Success is each row of `acceptance-criteria.md` Met with the evidence its Verification cell names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-parse --short HEAD
a34344e6a47

$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "clean embedding model"
STATUS=NO_MATCH FALLBACK=/doctor:setup
(exit 0; the same NO_MATCH line for "remove Ollama leftovers", "advisor model server still running" and "lane residue CI failing")

$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 31 routes validated, 11 warnings
(exit 0)

$ node --test .skilled/commands/doctor/scripts/tests/*.test.cjs
ℹ tests 1427
ℹ pass 1427
ℹ fail 0
(exit 0)

$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json
{"allowlistRows":47,"allowlistRowsMatched":47,"allowlisted":47,"files":47,"identifier":38,"live":0,"path":0,"prose":13,"symlink":0}
(exit 0)

$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.
(exit 0)

$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
"changed": []
(exit 0)
```
The four NO_MATCH lines show the gap the routing REQ closes. The 1427 count is the doctor suite baseline, and the 47 of 47 count is the residue baseline with no live hit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name the post-upgrade lane cleanup per install type in `INSTALL-SKILLED.md` section 5, and correct the same instruction in the advisor's `v2.0.0.0.md` Upgrade Notes and at `doctor-update-presentation.txt` line 459.
- Observe on fixtures whether a current copy's `/doctor:update apply` reaches the lane cleanup, and whether `apply` in a linked project is refused, before the guide states either.
- Add cleanup trigger phrases to the `/doctor:update` route in `_routes.yaml`, rebuild the advisor command bridges from it, and add helper-match test cases.
- Ship doctor 1.3.0.0: the SKILL.md version, `changelog/v1.3.0.0.md`, the README `/doctor:update` row, and the setup playbook's six legs and 26 rows.

### Out of Scope
- Reverting the `system-skilled-doctor/changelog/v1.1.7.0.md` rewrite. That was 024's decision D3, and it stands.
- Re-adding the retired server name to `orphan-process-check.cjs`. Detecting retired processes belongs to the residue tool's M4 check.
- Allowlisting `_routes.yaml` for the residue gate. The new phrases avoid the gate's terms instead.
- Running a live `/doctor:update apply` in the worktree. 024 decision D6 holds, so every apply runs on a fixture repo with a fixture HOME.
- Editing the held-out routing fixture, whose hash is pinned.
- Regenerating the trigger index, committing, pushing or merging in this planning run. The implementation run does those, and the index regeneration is its last write.

### Files to Change
The rows below are the planned edits for the implementation run. This planning run writes only this packet and row 26 of the 016 phase map.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `INSTALL-SKILLED.md` | Modify | Section 5, the update row at line 308: names the cleanup for copied and linked installs |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` | Modify | Upgrade Notes, lines 160 to 166: step 1 becomes per install type |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Line 459: the cleanup pointer names the linked-install route |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `/doctor:update` trigger_phrases, lines 782 to 790: add the cleanup phrases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | `derive-command-bridges.cjs` (write mode), which also rewrites its generated blocks in the advisor's TypeScript and Python sources |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | Modify | One case per cleanup phrasing |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | Fixture cases for the current-copy and linked-refusal observations, if they are kept as tests |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Modify | Line 5: version 1.2.0.0 becomes 1.3.0.0 |
| `.skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` | Create | Release note in the shape of `v1.2.0.0.md` |
| `.skilled/skills/system-skilled-doctor/README.md` | Modify | Line 42: the `/doctor:update` row mentions the cleanup |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` | Modify | Six legs, 26 rows, and the delivery leg |
| `.skilled/skills/system-skilled-doctor/leaf-manifest.json` | Regenerate if drift | Only when `generate-leaf-manifest.cjs --check` reports drift |
| `runtime/data/trigger-index.json` and its fixtures | Regenerate last | `generate-trigger-index.mjs`, the final write |
| `../spec.md` (016 parent) | Modify | Row 26 added beside rows 24 and 25 (done in planning) |
| `026-doctor-lane-removal-alignment/` | Create | This packet's documents (done in planning) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `INSTALL-SKILLED.md` section 5, the update row, names the post-upgrade lane cleanup for each install type. Copied installs run `/doctor:update apply`. Linked installs run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs machine` from the Skilled checkout, then the same script's `apply`, and answer its shared-model question |
| REQ-002 | The current-copy claim is observed, not inferred. On a fixture repo with a fixture HOME, a second `release-update.cjs apply` at the release already applied exits 0, applies no unit, and writes only the recorded base `.skilled/skills/.state/doctor-update/base.json`, with `followUps.rebuildDatabases` true. Reaching phase 7 (`doctor-update-apply.yaml`, `phase_7_lane_cleanup`) is derived from that exit and the workflow text, because no fixture can run the workflow. If the engine refused, the guide would name another path. Planning expected an empty write list, and the implementation run observed the one recorded-base write instead |
| REQ-003 | The linked-project refusal is observed on a fixture: `release-update.cjs apply --dry-run` run from a project whose `.skilled` is a symlink to an outside checkout. The guide quotes the message the command printed, and the test at `release-update.test.cjs:2027` is cited only for `record-base` |
| REQ-004 | Each of the four cited cleanup prompts returns a `/doctor:update` candidate from `doctor-helper-match.cjs -- "<prompt>"`, not `STATUS=NO_MATCH`. The prompt that names `ollama` matches through its other words only, and that limit is recorded in this spec |
| REQ-005 | Every new cleanup phrase in `_routes.yaml` holds no entry of `IDENTIFIER_TERMS` or `PROSE_TERMS` in `sweep-lane-residue.mjs`, has three or more words, and `sweep-lane-residue.mjs repo --json` still exits 0 with `allowlistRowsMatched` 47 of 47 and `live` 0 |
| REQ-006 | The advisor command bridges are regenerated from `_routes.yaml`. `derive-command-bridges.cjs --check` exits 0 with `"changed": []`, and the advisor ratchet and golden-prompt tests named in `tasks.md` exit 0 |
| REQ-007 | Doctor release 1.3.0.0: `SKILL.md` reads `version: 1.3.0.0`, `changelog/v1.3.0.0.md` covers the six items in plan.md section 3, and `generate-leaf-manifest.cjs --check` exits 0 |
| REQ-008 | `doctor-setup-run.md` states six legs and 26 rows, names the delivery leg, and agrees with `doctor-setup.yaml` (six legs) and `doctor-setup-presentation.txt` section 2 (26 rows) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The same per-install instruction appears in `INSTALL-SKILLED.md` section 5, the advisor `v2.0.0.0.md` Upgrade Notes and `doctor-update-presentation.txt` line 459. The sentence "Every reader takes both steps" no longer stands for step 1 |
| REQ-010 | The `/doctor:update` row in the doctor README (line 42) names the post-upgrade cleanup |
| REQ-011 | `doctor-helper-match.test.cjs` has one case per cleanup phrasing. Each case fails before the `_routes.yaml` edit and passes after it, and the full doctor suite exits 0 with the 1427 baseline passing plus the new cases |
| REQ-012 | The 016 phase map lists this packet as row 26 beside rows 24 and 25, and `validate.sh --strict` prints `RESULT: PASSED` on 016 after the row is added |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each row of `acceptance-criteria.md` is Met, and each Met row cites the output it observed.
- **SC-002**: `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` exits 0 with zero failures, and its pass count is the 1427 baseline plus the new cases.
- **SC-003**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <026> --strict` and the same command on 016 each print `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The apply fixture harness in `release-update.test.cjs` (`makeFixture`, `makeVendoredLayout`) | If it cannot express a current copy, REQ-002 has no evidence | The guide follows the observed result, and the fixture gap is recorded in `implementation-summary.md` |
| Dependency | `derive-command-bridges.cjs` writes the advisor's generated blocks | Bridge drift fails `--check` | Rerun the deriver. Never edit the generated JSON or the generated blocks by hand |
| Risk | New cleanup phrases pull other doctor routes or move the held-out ranking | High: the held-out set must clear top-1, top-3 and the negative bar | Run the held-out test. Drop any phrase that breaks it, and leave the fixture unedited |
| Risk | A fixture apply touches the operator's real HOME or the worktree's state folder | High: apply deletes files | Every apply runs in a temp repo with a fixture HOME, and no live apply runs in the worktree (024 D6) |
| Risk | The version bump changes the leaf manifest or a runtime mirror | Med | Run `generate-leaf-manifest.cjs --check` and `sync-runtime-mirrors.cjs --check` after the bump |
| Known limit | A prompt that names `ollama` matches only through its other words. The helper ranks `/doctor:update` first for "remove Ollama leftovers" through "remove" and "leftovers", and the advisor returns no recommendation for that prompt | Low | Recorded here. The residue term list is not allowlisted for `_routes.yaml` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the change adds documentation, routing phrases and a version bump, and starts no service, so no timing limit applies.

### Security
- **NFR-S01**: Apply deletes only what the checkout owns under its fixed names, and it asks before it removes the pulled shared model. The guide never tells a user to delete a file by hand.
- **NFR-S02**: No fixture run writes to the operator's HOME, to the worktree's `.skilled/skills/.state`, or to a live `.skilled/` folder.

### Reliability
- **NFR-R01**: Cleanup exit 1 stays `remaining` and never sets the update's STATUS to FAILED, as `doctor-update-apply.yaml` phase 7 states.
- **NFR-R02**: Two runs of `derive-command-bridges.cjs --check` over the same inputs report the same `changed` list.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a cleanup prompt with no word the route knows returns `STATUS=NO_MATCH FALLBACK=/doctor:setup`, as it does today.
- Maximum input: each new phrase ranks the cleanup route first in helper-match. A longer prompt that mixes cleanup words with a skill name is ranked by the helper's existing rules.
- Failure path: a linked project whose `.skilled` is a real folder is a copied install for the guide, and it takes the copy branch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 14 files: two install and advisor docs, one presentation, one route manifest, generated bridges, two test files, the doctor SKILL, README, changelog, playbook and leaf manifest |
| Risk | 10/25 | Apply guidance, generated advisor bridges and the phrase scorer that the held-out set measures |
| Research | 4/20 | Traced in planning from the workflow, the engine and the 024 commits. Two fixture observations remain |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No question is open. The two planning questions were answered on fixtures in the implementation run.

- Answered: a second `apply` on an already-current copy exits 0, applies no unit and writes only the recorded base. The engine half is observed and pinned by the test 'an apply at the release already applied writes only the recorded base and exits 0'. Reaching phase 7 is derived: the workflow has no stop for a plan with nothing to update, and `phase_7_lane_cleanup` runs on every path that reached the rebuild prompt.
- Answered: `apply --dry-run` in a project whose `.skilled` links to an outside checkout exits 1 with `path parent is not a real directory: <project>/.skilled`, the same message as the `record-base` case. The test 'apply in a project whose .skilled links to an outside checkout stops at the link' pins it, and the guide quotes it.
<!-- /ANCHOR:questions -->

---
