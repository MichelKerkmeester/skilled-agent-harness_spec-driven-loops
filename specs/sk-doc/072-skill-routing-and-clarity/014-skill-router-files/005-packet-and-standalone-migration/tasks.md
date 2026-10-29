---
title: "Tasks: Phase 5: packet-and-standalone-migration"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "packet and standalone migration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: packet-and-standalone-migration

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

`L` is `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`. `G` is the seven-leg batch gate in `plan.md` section 5.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline and confirm the phase 003 rule rejects a moved file (`scratch/batch-00.txt`). Verify: the counts print 54 headings, 7 `ROUTER.md` files, 47 skills without a sibling and 0 ledger entries, and a simulated `sk-git` move prints RS-005 plus `SMART ROUTING section missing smart-router marker(s)`.
- [ ] T002 Save the replay baseline (`scratch/router-replay-baseline.txt`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs > scratch/router-replay-baseline.txt`, then `diff` between a second run and the file prints nothing.
- [ ] T003 Copy the 47 token rows and record the five batch sums (`scratch/router-token-baseline.csv`). Verify: the file holds 48 lines and the sums print 14,490, 21,034, 12,351, 18,503 and 16,061 O200K tokens.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Batch 1, the 14 `sk-doc` mode packets (`sk-create-*/SKILL.md` and `sk-create-*/ROUTER.md`) and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-01.txt` shows 21 `ROUTER.md` files, ledger 33, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 14490.
- [ ] T005 Batch 2, the 8 `mcp-tooling` mode packets (`mcp-*/SKILL.md` and `mcp-*/ROUTER.md`) and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-02.txt` shows 29 `ROUTER.md` files, ledger 25, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 21034.
- [ ] T006 Batch 3, the 7 `cli-external-orchestration` mode packets, `cli-classifier/cli-jev` and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-03.txt` shows 37 `ROUTER.md` files, ledger 17, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 12351.
- [ ] T007 Batch 4, the 11 mode packets under `sk-code`, `sk-design` and `system-deep-loop`, and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-04.txt` shows 48 `ROUTER.md` files, ledger 6, `Findings: 0`, `leaf-manifest.json OK`, `router-sync: 5/5 checks passed` and token count 18503.
- [ ] T008 Batch 5, the six standalone skills and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-05.txt` shows 54 `ROUTER.md` files, ledger 0, `Findings: 0`, `leaf-manifest.json OK`, `PASS: 65 Hermes skill copies in sync` and token count 16061.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Count the final shape and the router files (`.skilled/skills`). Verify: the heading count prints 0, the `ROUTER.md` count prints 54 and the ledger prints 0.
- [ ] T010 Check the pointer lines and the ledger ratchet (`SKILL.md`, `L`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs`). Verify: the pointer count prints 47, `node --test` on the ratchet file prints pass 4 fail 0, and `parent-skill-check.cjs` prints `OK` with 0 warnings.
- [ ] T011 Rerun the strict checks, the replay, the drift scan and the Hermes check on the final tree. Verify: 54 `Result: PASS` lines, `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, `[alignment-drift] PASS` with `Findings: 0`, and `PASS: 65 Hermes skill copies in sync`.
- [ ] T012 Validate this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: every moved skill routes as it did before the move and the ledger is empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---
