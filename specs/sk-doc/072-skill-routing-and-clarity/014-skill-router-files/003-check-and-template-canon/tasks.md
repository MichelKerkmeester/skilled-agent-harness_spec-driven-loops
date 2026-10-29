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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`PS` is `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`. `PSC` is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the four baselines in `scratch/before.txt` and copy the current `sk-git` folder to `scratch/old-shape/sk-git` (`scratch/before.txt`). Verify: `cat scratch/before.txt` prints the 54 and 7 counts, the `Result: PASS` line and both the 12a and 12b lines, and `ls scratch/old-shape/sk-git/SKILL.md` prints the path.
- [ ] T002 Run the nine changed suites and record each pass count in `scratch/before.txt` (`scratch/before.txt`). Verify: the file lists 20 for the routing-shape suite, 64 across the other three Python files, and 1, 1, 4, 1 and 1 for the five JS suites.
- [ ] T003 Compare the live skill set with the frozen snapshot (`routing-shape-known-debt-frozen.json`). Verify: the frozen file holds 52 entries against 54 live keys, and `mcp-tooling` plus `sk-code/sk-code-ci` are the two absent keys.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Restate RS-002 and reverse RS-004 (`PS`). Verify: `python3 $PS scratch/old-shape/sk-git --check --strict` fails with `routing shape RS-002` and `routing shape RS-004`.
- [ ] T005 Rewrite RS-005 as the pointer rule (`PS`). Verify: the same copy fails with `routing shape RS-005`, and a copy with a fixture `ROUTER.md` beside it plus the link added prints no routing-shape finding.
- [ ] T006 [P] Apply the same three rules to check 12b (`PSC`). Verify: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` prints `pass 1` and `fail 0`.
- [ ] T007 [P] Run 12a for every declared packet (`PSC`). Verify: a fixture hub whose packet has no `ROUTER.md` prints one `12a-router-contract: RRC-001` line that names the packet.
- [ ] T008 [P] Run the router contract for `CLASS_STANDALONE` as well as `CLASS_HUB`, with the ledger tolerating a listed root (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`). Verify: a run over `.skilled/skills` reports a router result for `sk-git` and still prints `failed=0`, because `sk-git` is in the ledger.
- [ ] T009 [P] Make `ROUTER.md` required for a standalone root (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` prints `pass 1` and `fail 0`.
- [ ] T010 [P] Give the contract a target class and non-hub messages (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`). Verify: the standalone case and the packet case print no `hub root` wording.
- [ ] T011 [P] Extract the ledger reader (`lib/routing-shape-debt.cjs`). Verify: `rg 'require\\(.+routing-shape-debt' .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints one line per file.
- [ ] T012 Populate the ledger with one entry per unmoved skill and mode (`routing-shape-known-debt.json`). Verify: `rg -c '"lines":' .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` prints 54, and every entry records `RS-002`.
- [ ] T013 Raise the frozen snapshot to the same ceiling (`scripts/tests/fixtures/routing-shape-known-debt-frozen.json`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` prints `pass 4` and `fail 0`.
- [ ] T014 [P] Change the four Python suites (`.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py`, `test_package_skill_regressions.py`, `test_create_skill_contract.py`, `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py`). Verify: `python3 -m pytest` over the four files prints at least `84 passed`.
- [ ] T015 [P] Change the five JS suites (`scripts/tests/root-router-contract.test.cjs`, `scripts/tests/skill-root-metadata-contract.test.cjs`, `scripts/tests/routing-shape-known-debt-ratchet.test.cjs`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs`). Verify: each prints `fail 0`.
- [ ] T016 [P] Move the templates to the new shape and add the sibling router template with the `## MACHINE ROUTER` heading 002's resolver reads, placing a hub's moved prose after its `MACHINE-READABLE ROUTER` map (`assets/skill/skill-md-template.md`, `skill-smart-router.md`, `skill-scaffold-template.md`, `skill-router-template.md`, `assets/parent-skill/scaffold/packet-skill-scaffold.md`, `hub-skill-scaffold.md`, `parent-skill-hub-template.md`, `parent-skill-root-router-template.md`). Verify: `rg 'no ROUTER.md of its own|never carries a ROUTER' .skilled/skills/sk-doc/sk-create-skill/assets` prints nothing.
- [ ] T017 [P] Emit a sibling router for a fresh standalone skill and keep the pointer in the scaffold (`init_skill.py`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py router-fixture --path /tmp/router-fixture-root` leaves `/tmp/router-fixture-root/router-fixture/ROUTER.md` beside `SKILL.md`, and `rg 'ROUTER.md' /tmp/router-fixture-root/router-fixture/SKILL.md` prints the link line.
- [ ] T018 [P] Move the four create-skill workflow assets and the presentation summary to the new shape (`create-skill-auto.yaml`, `create-skill-confirm.yaml`, `create-skill-parent-auto.yaml`, `create-skill-parent-confirm.yaml`, `create-skill-presentation.txt`). Verify: `rg 'packet carries no ROUTER|no ROUTER.md of its own' .skilled/commands/create` prints nothing.
- [ ] T019 [P] Replace the old packet rule in the canon docs (`references/shared/validation-and-packaging.md`, `references/skill/creation-workflow.md`, `references/shared/common-pitfalls.md`, `references/parent-skill/parent-skills-nested-packets.md`, `references/parent-skill/parent-hub-router-schema.md`, `references/skill/upgrading-a-skill-to-v4.md`). Verify: `rg 'mode packet carries its own ROUTER.md' .skilled/skills/sk-doc/sk-create-skill` prints only the changelog history.
- [ ] T020 Bump sk-create-skill to 1.8.0.0 and write the changelog (`SKILL.md`, `changelog/v1.8.0.0.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/changelog/v1.8.0.0.md` prints `Total issues: 0`.
- [ ] T021 Regenerate the sk-doc hub leaf manifest (`.skilled/skills/sk-doc/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-doc` adds `assets/skill/skill-router-template.md` to the `sk-create-skill` mode, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Run the fleet gate on the final tree. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0`.
- [ ] T023 Run both checks on all seven hubs. Verify: seven `PASS: 12a-router-contract` lines and seven `PASS: 12b-routing-shape` lines, each with the recorded debt count.
- [ ] T024 Run the four Python files from the final tree. Verify: at least `84 passed`.
- [ ] T025 Run the five JS suites from the final tree. Verify: `fail 0` on each.
- [ ] T026 Prove the old shape is rejected with the check that proves the new one (`scratch/old-shape/sk-git`, `scratch/after.txt`). Verify: `python3 $PS scratch/old-shape/sk-git --check --strict` prints RS-002, RS-004 and RS-005, and the live `sk-git` folder prints none.
- [ ] T027 Run the spec validator on this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The fleet gate prints `checked=13 passed=13 failed=0`, and 12b prints 0 violations on all seven hubs
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
