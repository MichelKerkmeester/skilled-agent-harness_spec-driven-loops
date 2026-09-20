---
title: "Tasks: align sk-doc's root ROUTER.md with all fourteen registered modes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "router alignment tasks"
  - "replay baseline tasks"
  - "hub root delta tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: align sk-doc's root ROUTER.md with all fourteen registered modes

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline

- [x] T001 Capture the advisor regression before any edit (`scratch/baseline/reg-baseline.json`)
- [x] T002 Capture `parent-skill-check` on the hub path (`scratch/baseline/parent-skill-check.txt`; 14 modes, 0 warnings)
- [x] T003 Capture `ci-skill-root-metadata` (`scratch/baseline/ci-skill-root-metadata.txt`; checked=14 passed=14)
- [x] T004 Capture a 23-probe replay across all modes and the collisions stream 2 recorded (`scratch/baseline/replay.md`)
- [x] T005 [P] Capture the compiled-route guard and the sk-doc status (`scratch/baseline/compiled-route-*`)
- [x] T006 [P] Capture `command-binding-existence.vitest.ts` (3 passed)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Read the contracts before editing

- [x] T007 Read `router-replay.cjs` scoring, the ambiguity delta, and how a hub with a surface router assembles resources
- [x] T008 Read `root-router-contract.cjs` RRC codes: key parity, typed-pair membership, the prose-section requirement
- [x] T009 Read `leaf-resource-contract.cjs` `resolvePacketQualified`, confirming a shared-packet path resolves to the first declared mode
- [x] T010 Read both advisor tests to learn what actually consumes the registry command field
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Apply the recorded deltas

- [x] T011 Null the `/doc:quality` binding (`sk-doc/mode-registry.json`)
- [x] T012 Repoint the discriminator row that named the phantom command (`sk-doc/command-metadata.json`)
- [x] T013 Repair the hub mode-table row (`sk-doc/SKILL.md`)
- [x] T014 Repair the two statements the registry edit falsified (`sk-create-quality-control/SKILL.md`, `README.md`)
- [x] T015 Prepend `ROUTER.md` to `routerPolicy.defaultResource` (`sk-doc/hub-router.json`)
- [x] T016 Make the defer branch read the policy list instead of hardcoding one path (`sk-doc/SKILL.md`)
- [x] T017 Add the scoring vocabulary stream 1 recorded to `DOC_QUALITY` (`sk-doc/ROUTER.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Close the routing holes

- [x] T018 Add `PARENT_HUB` with the six parent-hub leaves (`sk-doc/ROUTER.md`)
- [x] T019 Add `AGENT_CREATION` and `COMMAND_CREATION` (`sk-doc/ROUTER.md`)
- [x] T020 Replay SD-003's exact prompt; find that the first design drops the command half to the ambiguity delta
- [x] T021 Restore `AGENT_COMMAND` as the paired-only intent so SD-003 returns its original four leaves (`sk-doc/ROUTER.md`)
- [x] T022 Add eleven stage-one aliases so `hub-router.json` agrees with `ROUTER.md` (`sk-doc/hub-router.json`)
- [x] T023 Add `sk-create-skill-parent` to the disambiguation checklist and correct the intent-model sentence (`sk-doc/SKILL.md`)
- [x] T024 Replay six out-of-domain probes; drop the bare `hub router` keyword that fired on a load-balancer sentence
- [x] T025 Refresh the stale intent enumeration in 16 playbook scenarios, generated from `ROUTER.md` (`sk-doc/manual-testing-playbook/**`)
- [x] T026 Remove the five em dashes the first draft introduced, per the brief
- [x] T027 Regenerate `leaf-manifest.json` once (byte-identical, no diff)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Prove it

- [x] T028 Negative control: add a signals-only intent, watch `align-check` exit 1 and `parent-skill-check` fail RRC-004, restore byte-identical
- [x] T029 Replay all 29 probes; confirm no mode row shows `(none)` and no baseline mode set shrank (`scratch/after-replay.md`)
- [x] T030 Re-run both named gates; diff clean against baseline
- [x] T031 Re-run the advisor regression; report deep-equals the baseline
- [x] T032 Re-run both playbook validators and the packet gate (`topology` 32/32 PASS, `package_skill --check --strict` PASS)
- [x] T033 Validate every edited document with `validate_document.py`
- [x] T034 Confirm the compiled-route guard verdict is unchanged from baseline
- [x] T035 Write the packet and run `validate.sh --strict` for an explicit `RESULT: PASSED`
<!-- /ANCHOR:phase-5 -->

---
