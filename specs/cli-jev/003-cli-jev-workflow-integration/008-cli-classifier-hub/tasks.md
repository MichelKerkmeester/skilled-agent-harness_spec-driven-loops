---
title: "Tasks: cli-classifier Hub with the cli-deem Client"
description: "Ordered tasks for the cli-deem client and its fake-server tests, the packet references over deem-ctl, the cli-classifier hub root, the regenerated advisor indexes with the route replay and the orchestrator's one live cli-deem health. All 20 are done, with the build in ee3a1b057c."
trigger_phrases:
  - "cli-classifier hub tasks"
  - "cli-deem client tasks"
  - "cli-deem verification tasks"
  - "deem hub route replay"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-classifier Hub with the cli-deem Client

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

The file names below were proposed at planning time and now exist, committed in `ee3a1b057c`. `H` is `.skilled/skills/cli-classifier`.

A fresh Opus 5.5 xhigh build orchestrator sends each code task as a single-change brief to a CLI executor by Bash only, and the orchestrator session verifies, gets a cross-family review and commits (D5 of the parent goal). Code tasks follow `sk-code-opencode`, and doc tasks go through sk-doc (D6 of the parent goal).

Evidence comes from two records. The build record is `scratch/build/build-evidence.md`, with its briefs, proof and replay files beside it. The orchestrator session's record holds the host verification, both review rounds and the commits, and it wins where the two differ because it reran the gates from the final state.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reopen Deem's request shape, answer shape, health body, caps and lock (`deem_server.py:519-550`, `:594-621`, `:772-777`, `:222-230`, `:656-659`, `:201`, `:236`) and `jev-cli`'s answer shape (`__init__.py:389-393`) before writing any field name. Evidence: the build orchestrator checked the Deem source before the first dispatch and corrected four facts in its briefs. An oversized body gets HTTP 413, the server also rejects duplicate options, `deem-ctl update --check` can exit 2 and `deem-ctl status` prints `stopped` (`build-evidence.md` section 6, item 9). Briefs 01 to 04 fixed every request and answer field name before any code existed. The record names no line numbers, so which of the cited seams were reopened is not recorded
- [x] T002 [P] Read `cli-jev`'s hub root and `mode-registry.json` as the shape to copy, and `parent-skill-check.cjs` checks 5 to 11, without editing either (`.skilled/skills/cli-jev/`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Evidence: the build took the canonical parent shape from an `init_skill.py` scaffold written to the session scratchpad, not from `cli-jev` (build deviation 2). It compared its validator warnings and playbook results with the `cli-jev` equivalents (`build-evidence.md` section 5). `parent-skill-check.cjs` on the hub exits 0 with 0 warnings, and `git diff -- .skilled/skills/cli-jev` has 0 lines. The record does not say which of checks 5 to 11 were read
- [x] T003 [P] Read `deem-local.md` and the live `deem-ctl` usage for the lifecycle reference, without running `deem-ctl` (`../007-classifier-deep-research/context/deem-local.md`). Evidence: two of the four facts corrected before dispatch are `deem-ctl` facts, `update --check` exiting 2 and `status` printing `stopped`. The lifecycle reference from brief 06 covers install, `start`, `stop`, `status`, `update`, `update --check` and `rollback` with its hold (`grep` while closing these docs). The build record lists no `deem-ctl` run. The only runs recorded are the session's `status` and `start` before the smoke
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the argument parser: `health`, `noul`, `choice`, `score` and `run`, flags `-q`, `-s` (stdin when absent), `-o KEY=DESCRIPTION`, `-l DESCRIPTION` and `--value`, exit 2 on a usage error or an inherited terminal on stdin, `node:` built-ins only (`H/cli-deem/scripts/cli-deem.mjs`). Evidence: brief 01 (cursor) wrote `parseCli` on `util.parseArgs` with the five subcommands, these flags and `--hook`. Brief 02 (cursor) added `readState`, which refuses an inherited terminal with exit 2 (`cli-deem.mjs:394`). The tests "an unknown subcommand exits 2 without a request" and "health rejects a question flag" pass. The six imports are all `node:` built-ins (`cli-deem.mjs:21-26`)
- [x] T005 Write `health`: `GET /health` within 2,000 ms or 500 ms for a hook caller, `status` `ok`, `backend` `torch` or `ensemble:` without `stub`, `model` `deem-0.8-v1`, then the commit pair from `models/current` and `git -C src rev-parse HEAD`. Stub or foreign model exits 3, unreachable exits 4, a missing path exits 2. Never start the server (`cli-deem.mjs`). Evidence: brief 01 (cursor). Tests cover the pinned model with its commit pair (exit 0), a stub backend, an ensemble containing stub and a foreign model (exit 3 each), nothing listening and a 500 (exit 4 each) and a missing checkpoint link (exit 2). A hook caller passes `--hook`, and brief 16's two tests pin both budgets: `--hook` exits 4 at 566 ms with `timed out after 500 ms`, and plain `health` exits 4 at 2,048 ms with `timed out after 2000 ms`. `grep 'deem-ctl'` on the client finds no match
- [x] T006 Write the request builder: `noul` as `instructions`, `choice` as an `options` list with a description-to-key map and duplicates refused, `score` as `levels`, `run` passed through. Refuse more than 26 options or 64 questions with exit 2 before any socket opens (`cli-deem.mjs`). Evidence: briefs 02, 03 and 04 (cursor), then brief 15 (cursor) after review round 1. The round-trip tests assert the posted field names. A duplicate description and, since brief 15, a duplicate key each exit 2 before any request (`cli-deem.mjs:454`, `:457`). 27 options and 65 questions exit 2 with 0 requests logged, and 26 options and 64 questions are sent
- [x] T007 Write the answer translator: `value` to `noul`, `level` to `score`, the chosen description to its key, probabilities rekeyed, `--value` for the bare answer, and exit 3 on an answer `model` other than `deem-0.8-v1` (`cli-deem.mjs`). Evidence: brief 02 (cursor). Tests show `choice` returning the submitted key with rekeyed probabilities, `score` as the zero-based index of `level` with probabilities keyed `0` to `n` and no `level` key, and `noul` in place of `value`. `--value` prints only the key, and an answer from `deem-1.5` exits 3. Deviation: `score` is the level's index, and Deem's fractional `expected` passes through beside it (build deviation 3, a review follow-up)
- [x] T008 Write the exit mapping: 0, 1 on HTTP 400 or an unexpected body, 2, 3, 4 on a refused connection, a timeout or a 5xx, and 130 on SIGINT. No bearer and no `--provider` anywhere (`cli-deem.mjs`). Evidence: briefs 01 to 04 (cursor). A 400 exits 1, a 500 exits 4 and every subcommand exits 4 when nothing is listening. SIGINT exits 130 (`cli-deem.mjs:752-754`), and no test covers it, which the review records as a follow-up. `grep -nE 'Authorization|Bearer|API_KEY|deem-ctl'` and `grep -c -- '--provider'` on the client find no match, exit 1 each, rerun while closing these docs
- [x] T009 Write the fake-server tests: stub backend, wrong model id, refused connection, HTTP 400, 27 options, 65 questions, the answer round trip and duplicate descriptions, plus the 26 and 64 boundaries. The fake server binds port 0 and logs every body (`H/cli-deem/scripts/tests/cli-deem.test.mjs`). Evidence: briefs 01 to 04, then 15, 16, 17 and 19 after the review (cursor). The fake binds port 0 on 127.0.0.1 and records every request. The file holds 34 tests, which include every case and both boundaries this task names
- [x] T010 [P] Write the packet contract, three references and the feature catalog through sk-doc (`sk-create-skill`, `sk-create-feature-catalog`): the wire, the lifecycle over `deem-ctl` (install, `start`, `stop`, `status`, `update`, `update --check`, `rollback` with its hold, requalification on a new commit pair) and the model pin (`H/cli-deem/SKILL.md`, `H/cli-deem/references/`, `H/cli-deem/feature-catalog/`). Evidence: briefs 05, 06 and 07 (pi) copied payloads the orchestrator wrote to the sk-doc templates, and brief 18 (pi) synced 8 docs to the review fixes. `cmp` matched every target to its payload. `validate_document.py` exits 0 on all 24 changed markdown files, `validate_catalog_package.py --package cli-classifier/cli-deem --strict` passes and `validate_skill_package.py` on the hub exits 0
- [x] T011 Write the hub root through sk-doc: `SKILL.md` (`sk-create-skill`), `README.md` (`sk-create-readme`), `ROUTER.md`, `mode-registry.json` with one `transport` mode `cli-deem`, `hub-router.json`, `graph-metadata.json`, `description.json`, `changelog/` (`sk-create-changelog`), `manual-testing-playbook/` (`sk-create-manual-testing-playbook`) and `benchmark/`, then generate `leaf-manifest.json` (`H/`). Evidence: briefs 08 to 12 (pi), with brief 13 (one graph edge) and brief 14 (Deem-only vocabulary) as corrections. `generate-leaf-manifest.cjs --write` and then `--check` both exit 0. `mode-registry.json` lists one mode, `cli-deem`, with `packetKind` `transport`. `validate-playbook-package.cjs --strict` passes with 0 violations, and `validate-playbook-topology.cjs` passes 3 of 3
- [x] T012 Regenerate the advisor graph, the trigger index with its three fixtures and the Hermes copies from committed content, then run `sync-skills-hermes.cjs --check` and read `PASS` (`.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the `system-spec-kit` trigger index, `.hermes/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-deem/SKILL.md`). Evidence: the build ran `skill_graph_compiler.py --validate-only` and then `--export-json`, exit 0, and `sync-skills-hermes.cjs`, whose `--check` prints `PASS: 73 Hermes skill copies in sync`, exit 0. Both outputs are in `ee3a1b057c`. The session rebuilt the trigger index and its three fixtures from an archive of HEAD in `cdc790c48b`, and `--check` reports 23,311 documents, 0 stale, 0 obsolete and 0 untrusted
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `node --test` on the test directory and read the pass count and exit status. Evidence: the session's recheck after the review fixes, `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/`, exit 0 with tests 34, pass 34 and fail 0. Before the fixes it was 28 of 28
- [x] T014 Run `grep -nE 'Authorization|Bearer|API_KEY'` and `grep -n 'deem-ctl'` on `cli-deem.mjs` and expect no match from either. Evidence: the session ran the combined pattern `Authorization|Bearer|API_KEY|deem-ctl` on the client, exit 1 with no match. Rerun on the committed file while closing these docs: exit 1. The same pattern finds 17 lines in `references/deem-ctl-lifecycle.md`, so it does match when the text is there
- [x] T015 Run `parent-skill-check.cjs` on the hub and read its exit status. A failure is the kill criterion: revert the hub commit. Evidence: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier`, exit 0, "all hard invariants passed, 0 warnings", before and after the review fixes. The kill criterion did not fire
- [x] T016 Run the two-stage route replay of a Deem prompt and confirm stage 1 names `cli-classifier` and stage 2 names `cli-deem`. A miss is the kill criterion. Evidence: at stage 1 the live advisor sends "is the local deem server healthy" to `cli-classifier` at 0.95, and "use jev choice to pick a queue" to `cli-jev` alone at 0.9151. At stage 2, `scratch/build/replay/stage2-replay.cjs` runs the rollout compiler and router in memory over the hub's own `SKILL.md`, `mode-registry.json` and `hub-router.json`, exit 0. All 6 Deem prompts print `action` `route`, `selectionKind` `single` and `modes` `["cli-deem"]`, and the Jev, out-of-domain and "deemed" prompts defer (`replay/stage2.txt`). The kill criterion did not fire
- [x] T017 Hand the orchestrator the one live `cli-deem health` and record the printed backend, model id and commit pair. Evidence: the session ran `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health`, exit 0, printing `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"8cbabbb2c4a7...","source_commit":"7cf293f9da45..."}`. That is the pair `deem-ctl status` prints after the release of 2026-09-28. The server was stopped when the session checked at 11:35, so the session started it with `deem-ctl start` first. A rerun after the review fixes printed the same fields, exit 0
- [x] T018 Run `git status --porcelain` and `git diff --stat -- .skilled/skills/cli-jev`, and confirm only the hub, this phase folder and the generated files `spec.md` REQ-008 names changed. The two activation manifest paths may appear only if the hub was admitted to compiled routing. Evidence: before the commit the session's `git status --porcelain --untracked-files=all` listed 32 paths: 29 under `.skilled/skills/cli-classifier/`, the two Hermes copies and `skill-graph.json`, with no `cli-jev` path. Rechecked while closing these docs: `ee3a1b057c` holds those 32 paths plus 62 build-record files in this phase folder, and `cdc790c48b` holds only the trigger index and its three fixtures. `git diff --stat 735d1b0956..cdc790c48b -- .skilled/skills/cli-jev` is empty. No activation manifest exists, because the hub was not admitted
- [x] T019 Run `validate.sh --strict` and `check-goal.cjs` on this phase until both print `RESULT: PASSED`. Evidence: the closure pass ran both on the final state of these docs. `validate.sh --strict` prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0, and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, exit 0
- [x] T020 Fill `implementation-summary.md` with the test count, the hub check result, the replay result and the smoke line. Evidence: the closure pass wrote all four, with the review verdicts, deviations and open items
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The live `cli-deem health` exited 0 with `torch`, `deem-0.8-v1` and the served commit pair
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Build record**: See `scratch/build/build-evidence.md`
<!-- /ANCHOR:cross-refs -->

---
