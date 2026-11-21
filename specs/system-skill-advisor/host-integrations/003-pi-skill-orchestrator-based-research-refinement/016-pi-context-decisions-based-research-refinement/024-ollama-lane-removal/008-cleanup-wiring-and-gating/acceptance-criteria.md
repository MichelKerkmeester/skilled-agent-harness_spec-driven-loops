---
title: "Acceptance Criteria: Phase 8: cleanup-wiring-and-gating"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cleanup wiring and gating acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-cleanup-wiring-and-gating"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: cleanup-wiring-and-gating

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/008-cleanup-wiring-and-gating
**Level:** 3
**Status:** Draft
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit, When `node T repo` and `node T repo --json` run and `hits` runs on every changed file outside the tool, its test and its allowlist, Then repo mode exits 0 with `live        : 0` and no `allowlist rows that matched nothing` block, `counts.allowlistRows` equals T001's less the four index-output rows plus T025's classified rows, and every `hits` prints `lines=0` | The repo-mode output, the JSON counts and the `hits` lines (T025, T028) | Unmet | - |
| AC-002 | REQ-002 | Given a fixture repository whose one tracked file holds the tool's first identifier term, When the sweep suite's planted-term case and `node --test D/scripts/tests/lane-residue-gate.test.cjs` run, Then both assert exit 1 for the fixture, the gate test also asserts exit 0 on this checkout, and both pass | The suite output and the node:test output (T020, T029) | Unmet | - |
| AC-003 | REQ-003 | Given a fixture with M1, M3, M4, M5 and M6 planted and a fake model server, When apply runs with `--shared-model delete`, the planted module folders are removed and machine mode runs again, and When `node T machine` is spawned on a clean fixture whose socket path is never created, Then the after-check exits 1 with M2 the only found check, the rerun exits 0, and the spawned run prints `result      : exit 0 (nothing left)` and exits 0 | T014's two cases in the final suite run, and the by-hand spawned output in `implementation-summary.md` (T030) | Unmet | - |
| AC-004 | REQ-004 | Given the edited apply workflow, When `grep -n '^  phase_'` and `node --test D/scripts/tests/doctor-update-contract.test.cjs` run, Then the phases list `phase_6_rebuild_prompt`, `phase_7_lane_cleanup` and `phase_8_state_log` in that order, and the contract tests pass, asserting `machine --json`, the question only on a non-empty `askFirst`, `apply --json` with `</dev/null` and with `--shared-model` on that command alone, and a cleanup that runs on every path that reached the rebuild prompt and on no other | The grep and the node:test output (T017, T019, T032) | Unmet | - |
| AC-005 | REQ-005 | Given one fixture, a fake model server listing the model and an injected confirm that answers no, When apply runs twice, Then confirm is called once per run with the same question, the server records no DELETE, the model is still listed, and the sorted file list of the fixture HOME and checkout after run 2 equals the list before run 1 | T013's case passing in each of T016's three runs (T031) | Unmet | - |
| AC-006 | REQ-006 | Given a fake model server listing the model, When apply runs with `--shared-model delete`, with `--shared-model keep` on a terminal, and with no flag and no terminal, and `machine --shared-model keep` and `apply --shared-model maybe` run, Then the first sends one DELETE with confirm called 0 times, the second calls confirm 0 times and sends no DELETE, the third keeps the model with one `kept` action, the last two exit 2, and `askFirst` holds the question only when the server lists the model and the checkout holds no lane source | T009's cases in the final suite run (T016, T031) | Unmet | - |
| AC-007 | REQ-007 | Given `HF_EMBED_SERVER_URL=unix://<fixture>/custom.sock` with the four fixed files beside it, When machine and apply run, Then machine mode reports all five files, apply deletes all five while the folder and an unrelated file in it stay, and a `tcp://` value adds no probed path | T006's case (T016) | Unmet | - |
| AC-008 | REQ-008 | Given the ownership table, When `isOwnedModelServer` runs on each command line, Then `node <script>`, `node <script> --flag`, `node --inspect <script>`, the script through a symlinked folder and a script deleted from disk are owned, and `node /other.js <script>`, `less <script>` and another checkout's script are not, and with an injected process list M4 lists node running any checkout's script first but not a shell or pager that only mentions it | T007's cases (T016) | Unmet | - |
| AC-009 | REQ-009 | Given a fixture holding one of the four lane-source sentinels and every leftover, When apply runs with `--shared-model delete` and a fake model server, Then every leftover is still on disk, confirm is called 0 times, no DELETE is sent, each item is `kept` with a reason naming the sentinel, `askFirst` is empty and the exit is 1, and the same fixture without the sentinel is cleaned | T008's parameterized case (T016) | Unmet | - |
| AC-010 | REQ-010 | Given the package-local model cache planted under both package roots, When machine and apply run and `node T machine --hf-home x` runs, Then M5 reports both folders, apply deletes them with confirm called 0 times and the rest of `node_modules/@huggingface` left in place, the flag exits 2 as an unknown argument, and `git grep -n -E 'hf-home\|HF_MODEL_FOLDER\|resolveHfHubRoot' -- ':!specs'` prints nothing | T005's case, the exit status and the empty grep (T005, T016) | Unmet | - |
| AC-011 | REQ-011 | Given the new `lane-residue` job, When `actionlint W/advisory-checks.yml`, `check-gate-inputs.sh`, `ci-report.cjs --json --no-gh` and the job's run block run on the final tree, Then actionlint exits 0, the gate check prints `RESULT: PASSED`, the report shows `advisory-checks.yml` with `"jobs":3` and `"flags":[]`, the job carries its siblings' `if:` and no `continue-on-error`, and the run block exits 0 | The four outputs (T026, T033) | Unmet | - |
| AC-012 | REQ-012 | Given the new doctor gate test, When `bash D/scripts/tests/run-all.sh` and `node --test D/scripts/tests/lane-residue-gate.test.cjs` run, Then run-all prints `node:test (56 files)` and `7 suite(s) passed, 0 failed`, and the gate test passes both of its tests | Both outputs (T020, T033) | Unmet | - |
| AC-013 | REQ-013 | Given fixture repositories with the four index outputs tracked and no allowlist row for them, When repo mode runs, Then a lane phrase key, a lane phrase-variant spelling or a lane path that points outside `specs/` and outside the allowlist exits 1 and names the phrase and the path, the same entries under `specs/` or at an allowlisted path exit 0, and on the phase commit no allowlist row names any of the four outputs | T010's cases and the allowlist read in T028 (T010, T025, T028) | Unmet | - |
| AC-014 | REQ-014 | Given the final tree, When the trigger index, leaf manifest, skill-graph freshness and command-bridge check modes run, the two advisor probe test files run and the `/doctor:skill-advisor` targets in `_routes.yaml` are counted, Then each check exits 0 or prints `leaf-manifest.json OK`, both test files pass, six targets are listed, and the summary names where each check already gates | T034's outputs in `implementation-summary.md` | Unmet | - |
| AC-015 | REQ-015 | Given phase 005 committed, When `node --check T` runs, every path the tool imports, spawns or requires is listed with `ls`, and a fixture machine run sets `SYSTEM_SKILL_ADVISOR_DB_DIR`, Then the check exits 0, every path exists, and no "could not be derived" note appears | T004's output and the fixture run's report | Unmet | - |
| AC-016 | REQ-016 | Given the edited READMEs, playbook entries and removal changelog entry, When `hits` runs on each and `rg -n 'Not wired'` runs on the retrieval README, Then each prints `lines=0`, the grep prints nothing, both playbook entries name the cleanup and `lane_cleanup`, and the changelog's upgrade step matches the wiring or is corrected to match it | T021 to T024 outputs | Unmet | - |
| AC-017 | REQ-017 | Given T003's read-only snapshot of the operator's machine, When the same commands rerun at the end and every `runApply` call and spawned `apply` in the suite is listed, Then the model-store listing, the socket-folder result, the hub count and the per-check statuses are unchanged, and every apply names fixture paths and a fixture HOME | T036's comparison | Unmet | - |
| AC-018 | REQ-018 | Given the start commit's gate results, When the sweep suite, route-validate, the mirror check, the link check and the comment-id grep run on the final tree, Then the suite passes 51 plus the new cases, route-validate prints `31 routes validated`, the mirror check prints `PASS`, the link check prints `0 broken`, and the grep prints nothing | T016 and T035 outputs | Unmet | - |
| AC-019 | REQ-019 | Given the edited workflow and presentation, When the contract test and `grep -n 'lane_cleanup'` run, Then `state_log_schema` lists `lane_cleanup: "clean\|cleaned\|remaining\|failed\|not_run\|not_applicable"` with no answer field, the plan shows the disclosure line, section 9 holds the question and report templates, the Apply result shows `Lane cleanup:`, and a cleanup exit 1 maps to `remaining`, never to `STATUS=FAILED` | The contract test and the grep (T017 to T019, T032) | Unmet | - |

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

Every criterion is Unmet until the tool changes, the doctor wiring and the two gates land in one commit after phase 007 and the checks in `tasks.md` Phase 3 pass.
<!-- /ANCHOR:closure -->
