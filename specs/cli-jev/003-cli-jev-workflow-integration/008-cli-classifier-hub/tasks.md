---
title: "Tasks: cli-classifier Hub with the cli-deem Client"
description: "Ordered tasks for the cli-deem client (proposed) and its fake-server tests, the packet references over deem-ctl, the cli-classifier hub root (proposed), the regenerated advisor indexes and route replay, and the orchestrator's one live cli-deem health."
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

All file names below are proposed. `H` is `.skilled/skills/cli-classifier` (proposed).

A fresh Opus 5.5 xhigh build orchestrator sends each code task as a single-change brief to a CLI executor by Bash only, and the orchestrator session verifies, gets a cross-family review and commits (D5 of the parent goal). Code tasks follow `sk-code-opencode`, and doc tasks go through sk-doc (D6 of the parent goal).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reopen Deem's request shape, answer shape, health body, caps and lock (`deem_server.py:519-550`, `:594-621`, `:772-777`, `:222-230`, `:656-659`, `:201`, `:236`) and `jev-cli`'s answer shape (`__init__.py:389-393`) before writing any field name
- [ ] T002 [P] Read `cli-jev`'s hub root and `mode-registry.json` as the shape to copy, and `parent-skill-check.cjs` checks 5 to 11, without editing either (`.skilled/skills/cli-jev/`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`)
- [ ] T003 [P] Read `deem-local.md` and the live `deem-ctl` usage for the lifecycle reference, without running `deem-ctl` (`../007-classifier-deep-research/context/deem-local.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the argument parser: `health`, `noul`, `choice`, `score` and `run`, flags `-q`, `-s` (stdin when absent), `-o KEY=DESCRIPTION`, `-l DESCRIPTION` and `--value`, exit 2 on a usage error or an inherited terminal on stdin, `node:` built-ins only (`H/cli-deem/scripts/cli-deem.mjs`)
- [ ] T005 Write `health`: `GET /health` within 2,000 ms or 500 ms for a hook caller, `status` `ok`, `backend` `torch` or `ensemble:` without `stub`, `model` `deem-0.8-v1`, then the commit pair from `models/current` and `git -C src rev-parse HEAD`. Stub or foreign model exits 3, unreachable exits 4, a missing path exits 2. Never start the server (`cli-deem.mjs`)
- [ ] T006 Write the request builder: `noul` as `instructions`, `choice` as an `options` list with a description-to-key map and duplicates refused, `score` as `levels`, `run` passed through. Refuse more than 26 options or 64 questions with exit 2 before any socket opens (`cli-deem.mjs`)
- [ ] T007 Write the answer translator: `value` to `noul`, `level` to `score`, the chosen description to its key, probabilities rekeyed, `--value` for the bare answer, and exit 3 on an answer `model` other than `deem-0.8-v1` (`cli-deem.mjs`)
- [ ] T008 Write the exit mapping: 0, 1 on HTTP 400 or an unexpected body, 2, 3, 4 on a refused connection, a timeout or a 5xx, and 130 on SIGINT. No bearer and no `--provider` anywhere (`cli-deem.mjs`)
- [ ] T009 Write the fake-server tests: stub backend, wrong model id, refused connection, HTTP 400, 27 options, 65 questions, the answer round trip and duplicate descriptions, plus the 26 and 64 boundaries. The fake server binds port 0 and logs every body (`H/cli-deem/scripts/tests/cli-deem.test.mjs`)
- [ ] T010 [P] Write the packet contract, three references and the feature catalog through sk-doc (`sk-create-skill`, `sk-create-feature-catalog`): the wire, the lifecycle over `deem-ctl` (install, `start`, `stop`, `status`, `update`, `update --check`, `rollback` with its hold, requalification on a new commit pair) and the model pin (`H/cli-deem/SKILL.md`, `H/cli-deem/references/`, `H/cli-deem/feature-catalog/`)
- [ ] T011 Write the hub root through sk-doc: `SKILL.md` (`sk-create-skill`), `README.md` (`sk-create-readme`), `ROUTER.md`, `mode-registry.json` with one `transport` mode `cli-deem`, `hub-router.json`, `graph-metadata.json`, `description.json`, `changelog/` (`sk-create-changelog`), `manual-testing-playbook/` (`sk-create-manual-testing-playbook`) and `benchmark/`, then generate `leaf-manifest.json` (`H/`)
- [ ] T012 Regenerate the advisor graph, the trigger index with its three fixtures and the Hermes copies from committed content, then run `sync-skills-hermes.cjs --check` and read `PASS` (`.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the `system-spec-kit` trigger index, `.hermes/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-deem/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `node --test` on the test directory and read the pass count and exit status
- [ ] T014 Run `grep -nE 'Authorization|Bearer|API_KEY'` and `grep -n 'deem-ctl'` on `cli-deem.mjs` and expect no match from either
- [ ] T015 Run `parent-skill-check.cjs` on the hub and read its exit status. A failure is the kill criterion: revert the hub commit
- [ ] T016 Run the two-stage route replay of a Deem prompt and confirm stage 1 names `cli-classifier` and stage 2 names `cli-deem`. A miss is the kill criterion
- [ ] T017 Hand the orchestrator the one live `cli-deem health` and record the printed backend, model id and commit pair
- [ ] T018 Run `git status --porcelain` and `git diff --stat -- .skilled/skills/cli-jev`, and confirm only the hub, this phase folder and the generated files `spec.md` REQ-008 names changed. The two activation manifest paths may appear only if the hub was admitted to compiled routing
- [ ] T019 Run `validate.sh --strict` and `check-goal.cjs` on this phase until both print `RESULT: PASSED`
- [ ] T020 Fill `implementation-summary.md` with the test count, the hub check result, the replay result and the smoke line
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
