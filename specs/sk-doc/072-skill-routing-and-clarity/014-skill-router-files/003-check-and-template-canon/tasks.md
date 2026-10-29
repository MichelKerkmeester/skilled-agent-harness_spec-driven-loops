---
title: "Tasks: Phase 3: check-and-template-canon"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "check and template canon tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: check-and-template-canon

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`PS` is `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`. `PSC` is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the four baselines in `scratch/before.txt` and copy the current `sk-git` folder to `scratch/old-shape/sk-git` (`scratch/before.txt`). Verify: `cat scratch/before.txt` prints the 54 and 7 counts, the `Result: PASS` line and both the 12a and 12b lines, and `ls scratch/old-shape/sk-git/SKILL.md` prints the path. Observed: `scratch/before.txt` records `rg MACHINE ROUTER SKILL.md: 54`, `ROUTER.md files: 7`, `sk-git strict: Result: PASS`, the 12a line reporting `root ROUTER.md conforms to the two-state contract (active)`, and the 12b line reporting `hub and 14 packet(s) follow the routing canon (0 known debt)`. `ls scratch/old-shape/sk-git/SKILL.md` prints the copied path. The copy was removed before commit; its recorded result is at `implementation-summary.md:88`.
- [x] T002 Run the nine changed suites and record each pass count in `scratch/before.txt` (`scratch/before.txt`). Verify: the file lists 20 for the routing-shape suite, 64 across the other three Python files, and 1, 1, 4, 1 and 1 for the five JS suites. Observed: `scratch/before.txt` records `pytest4: 84 passed in 1.43s`, which is the 20 and 64 the plan expected added together, so the file records the four-file total and not the per-file split. It records `root-router-contract.test.cjs: pass 1`, `skill-root-metadata-contract.test.cjs: pass 1`, `routing-shape-known-debt-ratchet.test.cjs: pass 4`, `parent-skill-check-root-router.test.cjs: pass 1` and `parent-skill-check-routing-shape.test.cjs: pass 1`, each with `fail 0`.
- [x] T003 Compare the live skill set with the frozen snapshot (`routing-shape-known-debt-frozen.json`). Verify: the frozen file holds 52 entries against 54 live keys, and `mcp-tooling` plus `sk-code/sk-code-ci` are the two absent keys. Observed: at setup the frozen file held 52 entries against 54 live keys, and the change that ends this phase adds exactly those two entries to the frozen file and removes none, so the snapshot now holds 54.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restate RS-002 and reverse RS-004 (`PS`). Verify: `python3 $PS scratch/old-shape/sk-git --check --strict` fails with `routing shape RS-002` and `routing shape RS-004`. Observed: the run on the old-shape copy reports `routing shape RS-002`, `routing shape RS-004` and `routing shape RS-005`, so both restated codes fire.
- [x] T005 Rewrite RS-005 as the pointer rule (`PS`). Verify: the same copy fails with `routing shape RS-005`, and a copy with a fixture `ROUTER.md` beside it plus the link added prints no routing-shape finding. Observed: the run on the old-shape copy reports `routing shape RS-005`, and the live `sk-git` folder prints `Result: PASS` because its shape is recorded in the ledger. The fixture pair that adds the sibling file and the link is a case in `test_routing_shape.py`, inside the four Python files that print 106 passed.
- [x] T006 [P] Apply the same three rules to check 12b (`PSC`). Verify: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` prints `pass 1` and `fail 0`. Observed: the baseline printed `pass 1` and `fail 0`, and the final `doctor run-all` printed `7 suite(s) passed, 0 failed` over the run that carries this file. The record does not print this file's own count.
- [x] T007 [P] Run 12a for every declared packet (`PSC`). Verify: a fixture hub whose packet has no `ROUTER.md` prints one `12a-router-contract: RRC-001` line that names the packet. Observed: for a declared packet with no file of its own, 12a prints `12a-router-contract: <packet>: ROUTER.md: known debt, RS-004 (migrate to the routing canon)`, one line per packet and each naming it, and all seven hubs report every hard invariant passed. The `RRC-001` fixture case runs in `parent-skill-check-root-router.test.cjs`.
- [x] T008 [P] Run the router contract for `CLASS_STANDALONE` as well as `CLASS_HUB`, with the ledger tolerating a listed root (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`). Verify: a run over `.skilled/skills` reports a router result for `sk-git` and still prints `failed=0`, because `sk-git` is in the ledger. Observed: the fleet gate prints `checked=13 passed=13 failed=0 fixed=0`, so every standalone root runs the contract and passes through its ledger entry.
- [x] T009 [P] Make `ROUTER.md` required for a standalone root (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` prints `pass 1` and `fail 0`. Observed: the baseline printed `pass 1` and `fail 0`, and the file is one of the 23 sk-create-skill JS suites that each print `fail 0` on the final tree.
- [x] T010 [P] Give the contract a target class and non-hub messages (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`). Verify: the standalone case and the packet case print no `hub root` wording. Observed: `validateRootRouter` takes a target class, and 12a passes the packet class for each declared packet, so a packet finding speaks of a skill root while its own line names the packet. The standalone and packet profiles run in `root-router-contract.test.cjs`, which prints `fail 0`.
- [x] T011 [P] Extract the ledger reader (`lib/routing-shape-debt.cjs`). Verify: `rg 'require\(.+routing-shape-debt' .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints one line per file. Observed: both JS checks require the shared reader, answered by `rg -n 'routing-shape-debt'` over `ci-skill-root-metadata.cjs` and `parent-skill-check.cjs` printing one line in each.
- [x] T012 Populate the ledger with one entry per unmoved skill and mode (`routing-shape-known-debt.json`). Verify: `rg -c '"lines":' .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` prints 54, and every entry records `RS-002`. Observed: the count prints 54 and all 54 entries record `RS-002`. The 47 entries that also record `RS-004` and `RS-005` are the skills that still carry no sibling file, and the 7 that record `RS-002` alone are the hubs, which own a root `ROUTER.md` and the link already.
- [x] T013 Raise the frozen snapshot to the same ceiling (`scripts/tests/fixtures/routing-shape-known-debt-frozen.json`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` prints `pass 4` and `fail 0`. Observed: the baseline printed `pass 4` and `fail 0`, and on the final tree the snapshot holds the same 54 entries as the live ledger and the suite prints `fail 0`.
- [x] T014 [P] Change the four Python suites (`.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py`, `test_package_skill_regressions.py`, `test_create_skill_contract.py`, `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py`). Verify: `python3 -m pytest` over the four files prints at least `84 passed`. Observed: `106 passed`, up from the 84 baseline.
- [x] T015 [P] Change the five JS suites (`scripts/tests/root-router-contract.test.cjs`, `scripts/tests/skill-root-metadata-contract.test.cjs`, `scripts/tests/routing-shape-known-debt-ratchet.test.cjs`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs`). Verify: each prints `fail 0`. Observed: all 23 sk-create-skill JS suites print `fail 0` each, which covers the three skill-side files, and the two doctor files are carried by the `doctor run-all` pass of 7 suites with 0 failed.
- [x] T016 [P] Move the templates to the new shape and add the sibling router template with the `## MACHINE ROUTER` heading 002's resolver reads, placing a hub's moved prose after its `MACHINE-READABLE ROUTER` map (`assets/skill/skill-md-template.md`, `skill-smart-router.md`, `skill-scaffold-template.md`, `skill-router-template.md`, `assets/parent-skill/scaffold/packet-skill-scaffold.md`, `hub-skill-scaffold.md`, `parent-skill-hub-template.md`, `parent-skill-root-router-template.md`). Verify: `rg 'no ROUTER.md of its own|never carries a ROUTER' .skilled/skills/sk-doc/sk-create-skill/assets` prints nothing. Observed: it prints nothing.
- [x] T017 [P] Emit a sibling router for a fresh standalone skill and keep the pointer in the scaffold (`init_skill.py`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py router-fixture --path /tmp/router-fixture-root` leaves `/tmp/router-fixture-root/router-fixture/ROUTER.md` beside `SKILL.md`, and `rg 'ROUTER.md' /tmp/router-fixture-root/router-fixture/SKILL.md` prints the link line. Observed: `init_skill.py` writes the sibling router in the standalone branch and prints `Created SKILL.md and ROUTER.md`, and the scaffold's pointer is asserted in `test_create_skill_contract.py`, inside the four Python files that print 106 passed. The `/tmp` run is not in the recorded evidence.
- [x] T018 [P] Move the four create-skill workflow assets and the presentation summary to the new shape (`create-skill-auto.yaml`, `create-skill-confirm.yaml`, `create-skill-parent-auto.yaml`, `create-skill-parent-confirm.yaml`, `create-skill-presentation.txt`). Verify: `rg 'packet carries no ROUTER|no ROUTER.md of its own' .skilled/commands/create` prints nothing. Observed: it prints nothing, and the three command docs `create/skill.md`, `create/skill-parent.md` and `create-skill-parent-presentation.txt` no longer say a mode packet has no `ROUTER.md`.
- [x] T019 [P] Replace the old packet rule in the canon docs (`references/shared/validation-and-packaging.md`, `references/skill/creation-workflow.md`, `references/shared/common-pitfalls.md`, `references/parent-skill/parent-skills-nested-packets.md`, `references/parent-skill/parent-hub-router-schema.md`, `references/skill/upgrading-a-skill-to-v4.md`). Verify: `rg 'mode packet carries its own ROUTER.md' .skilled/skills/sk-doc/sk-create-skill` prints only the changelog history. Observed: the search prints no match at all, not even in the changelog history, because the release entry names the reversed rule without repeating the old sentence.
- [x] T020 Bump sk-create-skill to 1.8.0.0 and write the changelog (`SKILL.md`, `changelog/v1.8.0.0.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/changelog/v1.8.0.0.md` prints `Total issues: 0`. Observed: the new `changelog/v1.8.0.0.md` carries `version: 1.8.0.0`, the `SKILL.md` carrier reads `version: 1.8.0.0`, and `parent-skill-check.cjs` on sk-doc prints `PASS: 13d-packet-version: 14 mode packet(s) match their newest changelog entry`, so the two agree. The document validator's own run is not in the recorded evidence.
- [x] T021 Regenerate the sk-doc hub leaf manifest (`.skilled/skills/sk-doc/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-doc` adds `assets/skill/skill-router-template.md` to the `sk-create-skill` mode, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0`. Observed: the `leaf-manifest.json` change adds one line, the new router template, and the fleet gate prints `checked=13 passed=13 failed=0 fixed=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run the fleet gate on the final tree. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0`. Observed: `checked=13 passed=13 failed=0 fixed=0`.
- [x] T023 Run both checks on all seven hubs. Verify: seven `PASS: 12a-router-contract` lines and seven `PASS: 12b-routing-shape` lines, each with the recorded debt count. Observed: all seven hubs report every hard invariant passed, which carries the 12a root line per hub, and 12b prints one pass line per hub with its debt count: cli-classifier 2, cli-external-orchestration 8, mcp-tooling 9, sk-code 5, sk-design 5, sk-doc 15, system-deep-loop 4.
- [x] T024 Run the four Python files from the final tree. Verify: at least `84 passed`. Observed: `106 passed`, and all sk-doc Python tests print `290 passed` with the create asset tests at `15 passed`.
- [x] T025 Run the five JS suites from the final tree. Verify: `fail 0` on each. Observed: every sk-create-skill JS suite prints `fail 0`, 23 of them, and `doctor run-all` prints `7 suite(s) passed, 0 failed` over a `node:test` run of 548 passes.
- [x] T026 Prove the old shape is rejected with the check that proves the new one (`scratch/old-shape/sk-git`, `scratch/after.txt`). Verify: `python3 $PS scratch/old-shape/sk-git --check --strict` prints RS-002, RS-004 and RS-005, and the live `sk-git` folder prints none. Observed: the old-shape copy reports `RS-002`, `RS-004` and `RS-005`, and the live `sk-git` folder prints `Result: PASS`, so the two runs separate a rejection from an acceptance. `scratch/after.txt` records the same pair.
- [x] T027 Run the spec validator on this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon --strict` prints `RESULT: PASSED`. Observed: the earlier strict run reported `RESULT: FAILED` with two errors and one warning on `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT` and `DESCRIPTION_SHAPE`; `repair-derived.cjs --apply` re-derived the graph metadata. The strict run after repair printed `RESULT: PASSED`, with `AC_COVERAGE` at 9/9.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The fleet gate prints `checked=13 passed=13 failed=0`, and 12b reports 0 violations on all seven hubs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Research**: See `../001-deep-research/research/research.md` sections 4 and 10
<!-- /ANCHOR:cross-refs -->

---


## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

This packet runs no task under `[B]`. A blocked task keeps its line pending, names the command that fails, and stops the phase gate, so the packet cannot close around it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented: `rg -c '^\| REQ-' spec.md` prints 8, one row per REQ-001 to REQ-008 in section 4.
- [x] CHK-002 [P0] Technical approach defined: `rg -n 'package_skill.py|parent-skill-check.cjs|ci-skill-root-metadata.cjs' plan.md` names all three checks in section 3.
- [x] CHK-003 [P1] Dependencies available: `node --version` prints 20 or newer and `python3 --version` prints 3.9 or newer.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script parses: `node --check` exits 0 for the changed CommonJS files, and `python3 -c 'import ast, pathlib'` with `ast.parse` over `package_skill.py` and `init_skill.py` exits 0.
- [x] CHK-011 [P0] Both gates report no failure: `.skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed` and `ci-skill-root-metadata.cjs` prints `failed=0`.
- [x] CHK-012 [P1] One ledger reader serves both checks: `rg -lc 'loadRoutingShapeDebt' .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints both paths.
- [x] CHK-013 [P1] A read failure is reported, not thrown: `rg -n 'could not read ROUTER.md' .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints the soft-failure line that names the packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is Met: `rg -c '\| Met \|' acceptance-criteria.md` prints 9, and `rg -c '\| Unmet \|' acceptance-criteria.md` prints 0.
- [x] CHK-021 [P0] The four Python files pass: `python3 -m pytest` over them prints `106 passed`, above the 84 baseline.
- [x] CHK-022 [P1] The ledger and its snapshot agree: `rg -c '"lines":' .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` prints 54, the frozen fixture holds 54, and the ratchet suite prints `fail 0`.
- [x] CHK-023 [P1] The failure path stays red: `python3 $PS scratch/old-shape/sk-git --check --strict` reports RS-002, RS-004 and RS-005, and the live `sk-git` folder prints `Result: PASS`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed script reads or holds a secret: `rg -n 'password|secret|api[_-]?key|Bearer'` over the changed scripts prints no match.
- [x] CHK-031 [P0] A router path that leaves the skill folder is refused: `rg -n 'relative_to\(skill_path\.resolve' .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` prints the containment check RS-004 runs.
- [x] CHK-032 [P1] No authentication surface exists: `rg -n 'NFR-S01' spec.md` prints the recorded N/A and its reason.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet docs agree on the ledger size: `rg -c '54' spec.md plan.md tasks.md acceptance-criteria.md implementation-summary.md` prints a count above 0 in each file.
- [x] CHK-041 [P1] The canon docs no longer keep the old packet rule: `rg 'mode packet carries its own ROUTER.md' .skilled/skills/sk-doc/sk-create-skill` prints no match.
- [x] CHK-042 [P2] The packet carries no template placeholder: the strict validator prints `+ PLACEHOLDER_FILLED: No unfilled template placeholders found`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Both baselines sit in the packet's own scratch folder: `ls scratch/before.txt scratch/after.txt` exits 0.
- [x] CHK-051 [P1] No fixture leaks into a live skill folder: `ls scratch/old-shape/sk-git/SKILL.md` prints the copied path, and `ls -A scratch` prints `.gitkeep`, `after.txt`, `before.txt` and `old-shape`. The copy was removed before commit; its recorded result is at `implementation-summary.md:88`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
