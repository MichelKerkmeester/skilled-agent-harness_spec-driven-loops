---
title: "Tasks: Phase 21: stage2-leaf-route-replay"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "leaf route replay tasks"
  - "tie-break arm tasks"
  - "stage2 replay tasks"
  - "router.md replay verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: stage2-leaf-route-replay

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

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `T` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`, both proposed. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel. Tasks marked "outside this phase" do not gate its completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record sk-create-skill's `node --test` pass and fail counts as the baseline, and confirm phase 020's build is not running (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`)
- [ ] T002 Read the owners' contracts before writing: `leaf-resource-contract.cjs:166` and `:279`, `root-router-contract.cjs:139`, `validate-compiled-routing-scenarios.cjs:170-196` and `:304`, and each active hub's `ROUTER.md` machine block. Recover the retired replay with `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` to a scratch file outside the repository. Route the code write through sk-code's OpenCode route
- [ ] T003 [P] Build the test fixtures: a synthetic active router with near-tied and far intents, a `stage1-only` router, a synthetic manifest, gold scenarios with partial and empty sets, a synthetic transcript directory and a prose file (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Router parser: `router_state`, `INTENT_SIGNALS` weights and keywords, and `RESOURCE_MAP` lists (`S`)
- [ ] T005 Keyword arm ported from the retired `:38` and `:449-489`: word-boundary keywords, weighted scores, the one-point delta and `UNKNOWN` (`S`)
- [ ] T006 Leaf conversion through `dualReadLegacyResource` with each hub's manifest and aliases, counting unresolvable paths (`S`)
- [ ] T007 Gold loader and scorer: prompt and `leafPairs` from `parseScenario`, unscored rows counted, per-row F1 and exact match, the per-hub report and the `sk-code` surface-slice line (`S`)
- [ ] T008 Recount behind `--transcripts <dir>`: Read calls on `ROUTER.md` per hub and ISO week with bytes, counts only. `router reads: not measured` without the flag (`S`)
- [ ] T009 Replay verdict behind `--prose <file>` per `spec.md` section 4's Replay Rule, with the coverage stop when the file is absent or short (`S`)
- [ ] T010 Gates, arms and verdict per `spec.md` section 4's Keep Rule: the baseline choice, `no headroom`, the identity line, both skip line sets, the `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` and the verdict line on stdout and in `report.json` (`S`)
- [ ] T011 [P] One row each in `sk-create-skill/scripts/README.md` and `scripts/tests/README.md`
- [ ] T012 The sk-doc docs through their modes: `sk-create-skill/SKILL.md`, README, the next changelog file, one playbook scenario with its index row, and the hub catalog entry `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` with its index row. Then regenerate the Hermes copy and the sk-doc leaf manifest pair. Regenerate the trigger index when its `--check` reports stale docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 `node --test` on `T` exits 0 with at least 18 passing tests: the happy path and edge case of each REQ-009 surface (`T`)
- [ ] T014 One zero-call replay on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record per-hub gold, unscored, `UNKNOWN`, tied, F1 and exact-match counts and the replay verdict line in `goal.md`'s log
- [ ] T015 `git status --porcelain` is identical before and after T014, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1
- [ ] T016 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T011 and T012 changed (parent D6)
- [ ] T017 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and sk-create-skill's suite fails nothing beyond T001's baseline. Then the parent orchestrator commits with path-scoped commits (parent D5)
- [ ] T018 Outside this phase: the operator runs `--transcripts` on their session directory, supplies a prose file for the replay verdict and asks for one `--deem --out <dir>` run and, on their flag, one `--jev --out <dir>` run. Each line goes into `goal.md`'s log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T001 to T017 marked `[x]`. T018 is outside this phase
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the zero-call replay ran on the real tree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: See `../007-classifier-deep-research/research/research.md` (`### R25.`)
<!-- /ANCHOR:cross-refs -->

---
