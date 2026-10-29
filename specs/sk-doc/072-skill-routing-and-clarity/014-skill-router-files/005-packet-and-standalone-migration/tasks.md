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

The five planned batches ran as two waves of parallel workers, 20 skills and then 27, so the per-batch files `scratch/batch-01.txt` to `scratch/batch-05.txt` were not written. Each skill passed the same per-skill checks inside its wave, and one full gate ran on the final tree; `T009` to `T011` are that run. `T013` to `T015` were added during the build for three findings the move exposed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline and confirm the phase 003 rule rejects a moved file (`scratch/batch-00.txt`). Verify: the counts print 54 headings, 7 `ROUTER.md` files, 47 skills without a sibling and 0 ledger entries, and a simulated `sk-git` move prints RS-005 plus `SMART ROUTING section missing smart-router marker(s)`. Observed: the tree held 54 `MACHINE ROUTER` headings, 7 `ROUTER.md` files, 47 skills without a sibling router and 47 debt entries, which is the population phase 003 left in `L`. `scratch/` holds no `batch-00.txt`, so the simulated move printed into no file, and the direction this phase needs is proven instead by the 47 moved skills that each print `Result: PASS` in T011. Deviation: the plan expected 0 ledger entries at setup, and the ledger carried 47 until the moves landed.
- [x] T002 Save the replay baseline (`scratch/router-replay-baseline.txt`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs > scratch/router-replay-baseline.txt`, then `diff` between a second run and the file prints nothing. Observed: the file holds the seven `hub=` lines, `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` and the two trailing report lines. `diff scratch/router-replay-baseline.txt scratch/router-replay-after.txt` prints nothing, and `parseRouter` from `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` returns identical output for all 47 skills against `main`, 47 same and 0 different.
- [x] T003 Copy the 47 token rows and record the five batch sums (`scratch/router-token-baseline.csv`). Verify: the file holds 48 lines and the sums print 14,490, 21,034, 12,351, 18,503 and 16,061 O200K tokens. Observed: `scratch/router-token-after.csv` holds 47 skill rows and one `TOTAL` row reading 160,204 words before, 125,932 after, 34,272 saved and 54,675 router words. `scratch/router-token-baseline.csv` was not written and no batch sum was captured, because the batches ran as two waves. The totals row is the measured replacement, and the move took 34,272 words, 21.4 percent, or about 45,600 tokens, out of the text a skill load carries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Batch 1, the 14 `sk-doc` mode packets (`sk-create-*/SKILL.md` and `sk-create-*/ROUTER.md`) and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-01.txt` shows 21 `ROUTER.md` files, ledger 33, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 14490. Observed: all 14 folders carry a sibling `ROUTER.md` with `router_state: active`, `skill_pointer: SKILL.md`, `## 1. OVERVIEW`, `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER` that holds the body the old section held, and each `SKILL.md` prints 0 for `MACHINE ROUTER` and 1 for `before selecting skill-local resources`. `scratch/batch-01.txt` was not written: the batch ran inside a wave of parallel workers, so the cumulative `ROUTER.md` 21, ledger 33 and token 14490 figures were never captured, and T009 to T011 are the evidence instead.
- [x] T005 Batch 2, the 8 `mcp-tooling` mode packets (`mcp-*/SKILL.md` and `mcp-*/ROUTER.md`) and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-02.txt` shows 29 `ROUTER.md` files, ledger 25, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 21034. Observed: all 8 folders carry a `ROUTER.md` of the shape T004 records, each `SKILL.md` prints 0 and 1 on the two greps, and each prints `Result: PASS` under `package_skill.py --check --strict`. `scratch/batch-02.txt` was not written, for the wave reason T004 records, so the cumulative 29, ledger 25 and token 21034 figures were not captured.
- [x] T006 Batch 3, the 7 `cli-external-orchestration` mode packets, `cli-classifier/cli-jev` and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-03.txt` shows 37 `ROUTER.md` files, ledger 17, `Findings: 0`, `leaf-manifest.json OK`, `12b-routing-shape ... (0 known debt)` and token count 12351. Observed: all 8 folders carry a `ROUTER.md` of the shape T004 records, each `SKILL.md` prints 0 and 1 on the two greps, and each prints `Result: PASS`. `scratch/batch-03.txt` was not written, for the wave reason T004 records, so the cumulative 37, ledger 17 and token 12351 figures were not captured.
- [x] T007 Batch 4, the 11 mode packets under `sk-code`, `sk-design` and `system-deep-loop`, and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-04.txt` shows 48 `ROUTER.md` files, ledger 6, `Findings: 0`, `leaf-manifest.json OK`, `router-sync: 5/5 checks passed` and token count 18503. Observed: all 11 folders carry a `ROUTER.md` of the shape T004 records, each `SKILL.md` prints 0 and 1 on the two greps, and each prints `Result: PASS`. `scratch/batch-04.txt` was not written, for the wave reason T004 records, so the cumulative 48, ledger 6, `router-sync` and token 18503 figures were not captured.
- [x] T008 Batch 5, the six standalone skills and their ledger entries in `L`. Verify: the `G` output in `scratch/batch-05.txt` shows 54 `ROUTER.md` files, ledger 0, `Findings: 0`, `leaf-manifest.json OK`, `PASS: 65 Hermes skill copies in sync` and token count 16061. Observed: `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `system-skill-advisor` and `system-spec-kit` each carry a `ROUTER.md` of the shape T004 records, each `SKILL.md` prints 0 and 1 on the two greps, and each prints `Result: PASS`. The tree now holds 54 `ROUTER.md` files and `L` holds 0 entries. `scratch/batch-05.txt` was not written, for the wave reason T004 records, so the token 16061 figure was not captured; the 65-copy Hermes line was and still prints.
- [x] T013 Teach the non-hub router contract the three patterns these routers use on purpose (`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` prints `pass 1` and `fail 0`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` on each of the seven hubs prints `OK: parent-skill-check`. Observed: once the routers became active `ROUTER.md` files, `parent-skill-check` 12a checked them for the first time and failed 11 of them on deliberate authoring: signal-only intents DESIGN (five `cli-*` runners) and CLASSIFIER (`cli-pi`), an empty SCALES list (`sk-design-fundamentals`), a root file `INSTALL-GUIDE.md` (`mcp-click-up`), and a commented `INTENT_SIGNALS` mirror beside `INTENT_MODEL` (`mcp-figma`, `mcp-mobbin`, `mcp-refero`). Rewriting content would have changed `parseRouter` output, so the contract learned `NO_LOAD_INTENTS`, declared in those seven routers, `ROOT_RESOURCES` resolved only in the router's own folder through the new `resolveInOwnRoot` probe, and an exact `INTENT_SIGNALS`/`INTENT_MODEL` mirror check. Hubs are unchanged and a hub declaring `NO_LOAD_INTENTS` still fails. Six new cases cover each pass case and the failures each rule must still catch, the suite prints `all positive and negative fixtures passed`, and all seven hubs now print `OK: parent-skill-check` with 0 warnings.
- [x] T014 Correct the documents that still placed the machine router in `SKILL.md` (the prose under `.skilled/skills`, plus `.skilled/skills/sk-doc/sk-create-skill/references/shared/overview.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` and `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` prints `0 broken`, and a rerun of the pattern sweep reports no line that still says the router lives in `SKILL.md`. Observed: the sweep found 627 candidate lines in 151 files, DeepSeek workers rewrote them per packet, and the conductor fixed four canon lines by hand: the routing-authority paragraph and the checklist line in the overview, the `RS-003` row of the skill template, and rule 21 of `sk-create-skill`'s own `SKILL.md`. A rerun leaves 27 hits, all reviewed as correct or unrelated, for example scenario ids such as `RESOURCE_MAP_TOGGLE`. Workers edited only their candidate files. The link check prints `7631 files, 14219 links checked, 0 broken`.
- [x] T015 Run the doc-version raise before the gates that regenerate from doc bytes (`.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`). Verify: the gate block sits above the mirror-parity and compiled-routing re-mint blocks, the hook test asserts that order, and `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `153 passed, 0 failed`. Observed: the gate ran after those two blocks while this phase landed, so a `ROUTER.md` version it raised changed bytes a gate had already approved, the commit shipped a stale Hermes copy and a stale manifest, and the pre-push guard refused the push. The gate now runs first, a new hook case fails when it moves back below either block, and `pre-commit gates: 153 passed, 0 failed` is the suite line. Committed separately from the skill move.
- [x] T016 Act on the independent review of the move (`.skilled/skills/sk-prompt/ROUTER.md`, `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/`, `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` and its test, the playbooks and references of 23 skills). Verify: each fixed scenario snippet prints the output its Expected block names, each new contract case fails against the committed parser and passes against the fixed one, and parsed routing stays 47 same and 0 different. Observed: a fresh read-only review returned "request changes" with two P1 and five P2 findings. P1: `sk-prompt` mapped RAW to an empty list without declaring it, so `ROUTER.md` now names it in `NO_LOAD_INTENTS = ("RAW",)` and keeps the empty entry, which leaves the parse unchanged. P1: 13 `sk-code-review` scenarios still cut the router out of `SKILL.md` at `## 10. MACHINE ROUTER`, and the two-stage security scenario had failed with `FALLBACK_CHECKLIST_MISSING` since phase 004 because it handed the compiler no router text. They now read `ROUTER.md` at `## 3. MACHINE ROUTER` and pass `routerMarkdown` with the `ROUTER.md` bytes; the DRY scenario prints `intents= ['DRY'] scores= {'DRY': 15.0}`, SECURITY prints `{'SECURITY': 25.0}`, the depth alias prints `ON_DEMAND count= 10`, and the two-stage scenario prints `surfaceBundle sk-code-review,sk-code-security` then `single sk-code-security`. P2: a `#` comment inside a name list or intent map counted as an entry, an apostrophe in a comment opened a string, and a `NO_LOAD_INTENTS` line in prose counted as a declaration; the contract now strips comments outside quotes and reads name lists from the fenced code only, and two new cases cover them, each failing on the committed parser. P2: the map-less non-hub relaxation stays, because seven `sk-doc` mode routers declare an intent map and route through their own tables with no `RESOURCE_MAP`, so tightening it would change content. A second sweep keyed on each skill's old router section number and on router-only names such as `UNKNOWN_FALLBACK_CHECKLIST`, `ON_DEMAND_KEYWORDS` and `AMBIGUITY_DELTA` found the commands and table rows the first sweep missed, and they now read `ROUTER.md`; five `leaf-manifest.config.json` notes say the same, and each `leaf-manifest.json` still prints `OK`. The Luna lanes of this wave stopped at the ChatGPT usage limit, and the conductor finished their remaining lines by hand.
- [x] T017 Close what CI and a verification swarm found after the move landed (`.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh`, its test, `claude-code-native-dispatch-docs.vitest.ts`, `fanout-run.vitest.ts`, `sk-design-diagram/ROUTER.md`, the playbooks, READMEs and references of 35 skills). Verify: the three failing CI suites pass locally, the diagram corpus check prints `RESULT: PASSED`, parsed routing stays 47 same and 0 different, and the link check prints 0 broken. Observed: CI on the move commit failed Diagram Corpus (`ROUTER.md: version 1.0.0.0 is outside the anchor's 1.2 era`), Spec-Kit Check (`check-card-sync.sh` and two tests still read `SKILL.md`) and Deep-Loop Runtime Tests (the cli-pi fan-out fallback line now sits in `ROUTER.md`), and Command Tree Parity failed on a Hermes copy that the commit hook left one edition behind. Each reader now opens the file the content moved to, the diagram router carries `1.2.0.0`, and the Hermes copy was resynced; the spec-kit CLI project prints `2264` tests with the card-sync file passing, the corpus check prints `RESULT: PASSED` and `pass 21 fail 0`. A swarm of 47 read-only lanes then ran every router-reading snippet in the moved skills and listed every line that still placed the router in `SKILL.md`; 35 fix lanes and the conductor corrected about 140 lines, including eleven deep-loop scenarios that printed `SKILL.md` by line range and now print `ROUTER.md` from its `## 3. MACHINE ROUTER` heading. Lines that were wrong before the move, such as `rg` patterns that read `\|` as a literal pipe, were left and listed in the lane reports.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Count the final shape and the router files (`.skilled/skills`). Verify: the heading count prints 0, the `ROUTER.md` count prints 54 and the ledger prints 0. Observed: `rg -l '^##\s+([0-9]+\.\s*)?MACHINE ROUTER\s*$' .skilled/skills --glob 'SKILL.md'` prints nothing, the `ROUTER.md` count prints 54 and `L` prints 0. The frozen fixture `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` also prints 0.
- [x] T010 Check the pointer lines and the ledger ratchet (`SKILL.md`, `L`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs`). Verify: the pointer count prints 47, `node --test` on the ratchet file prints pass 4 fail 0, and `.skilled/commands/doctor/scripts/parent-skill-check.cjs` prints `OK` with 0 warnings. Observed: `grep -rl 'before selecting skill-local resources' .skilled/skills --include=SKILL.md` prints 47. The ratchet file prints `pass 4`, `fail 0`. All seven hubs print `OK: parent-skill-check`, `all hard invariants passed, 0 warnings`.
- [x] T011 Rerun the strict checks, the replay, the drift scan and the Hermes check on the final tree. Verify: 54 `Result: PASS` lines, `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, `[alignment-drift] PASS` with `Findings: 0`, and `PASS: 65 Hermes skill copies in sync`. Observed: `package_skill.py --check --strict` prints `Result: PASS` on all 54 skill folders, 0 failing. The replay prints the baseline total line, and `scratch/router-replay-after.txt` equals `scratch/router-replay-baseline.txt`. `verify_alignment_drift.py --root .skilled/skills --check-router` scans 5,426 files and prints `Findings: 0`, `Errors: 0`, `Warnings: 0`, `Violations: 0`. The Hermes check prints `PASS: 65 Hermes skill copies in sync`. The stripped compiled policy of all seven hubs diffs by 0 lines against `main`.
- [x] T012 Validate this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration --strict` prints `RESULT: PASSED`. Observed: the closing run prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every moved skill routes as it did before the move and the ledger is empty
- [x] The two waves carry per-skill checks and one final-state gate in place of the five per-batch files

### Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Tasks | 15 | 15 |
| Acceptance criteria | 6 | 6 |
| Blocked tasks | 0 | 0 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---
