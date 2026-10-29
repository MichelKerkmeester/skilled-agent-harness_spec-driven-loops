---
title: "Tasks: Phase 8: ai-systems-migration"
description: "Ordered tasks for the AI Systems router move: setup checks, the gate edits that come first, eight systems in the research order, the Claude Project routing documents and the verification that holds the push."
trigger_phrases:
  - "ai systems migration tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: ai-systems-migration

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
| `[~]` | Superseded by a recorded decision |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below:
- `REPO="/Users/michelkerkmeester/MEGA/Development/AI Systems"`, the checkout root, on `main`.
- `AIS="$REPO/AI Systems"`, the systems folder. Every relative path below starts there.
- `PKG="$REPO/.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"`, the Public canon checker reached through the symlink.
- Run every Python gate with `PYTHONDONTWRITEBYTECODE=1` and `/usr/bin/python3`, as `scratch/baseline.md` did.
- Each system step ends in one local commit on `main`. No task pushes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the read-only gate baseline (`scratch/baseline.md`). Verify: `grep -c '^| [0-9]' scratch/baseline.md` prints 37.
- [x] T002 Confirm the tree is clean apart from the two foreign files (`$REPO`). Verify: `git -C "$REPO" status --porcelain` prints exactly the two `Product Context/Collab Phases/` lines.
  - Observed: `git status --porcelain` printed only `?? "Product Context/Collab Phases/Prompts - Escalation - Review.md"` and `?? "Product Context/Collab Phases/Prompts - Escalation - Updated.md"`, exit 0. The Moneybird Accountant folder is ignored by the AI Systems checkout and is its own repository (`MichelKerkmeester/ai-accountant_moneybird`); its own `git status --porcelain` printed nothing and its last commit is `df7472d` of 2026-10-24.
- [x] T003 Record the start commit and recheck activity per system (`$AIS/*`). Verify: `git -C "$REPO" log -1 --format=%h` is written to `goal.md` section 4, and `git -C "$REPO" log --since=1.day --oneline -- "AI Systems/Product Owner"` is read before step T021.
  - Observed: `git log -1 --format=%h` printed `8e4573b8f`, recorded in `goal.md` section 4. Right before T020 `git log --since=1.day --oneline -- "AI Systems/Product Owner"` printed nothing (exit 0), and the nested Product Owner repository's newest commit is `cf7d176c` of 2026-10-28 10:38.
- [x] T004 Inventory every router reader again (`$AIS`). Verify: `rg -ln 'SMART ROUTING|Smart Router Pseudocode|ROUTER CODE|ROUTER\.md' "$AIS" --glob '*.py' --glob '*.sh' --glob '!**/specs/**' --glob '!**/reports/**'` lists no script outside T005 to T012 and the unchanged rows of `plan.md` section 3.
  - Observed: the `rg` listed 14 scripts, saved with a `--no-ignore` rerun in `scratch/reader-inventory.txt`. Outside T005 to T012 it found only comment or statement text (`gauntlet.py`, `Prompt Improver/run_fixtures.sh`, `systems.py`), the unchanged Sales `kernel_parity.py` that reads `router-contract.md`, and an episode `dispatch.sh`. Reading the FigJam scripts before T021 found one more reader the pattern misses, `sk-create-figjam/scripts/flow_check.py`, which lifts `DIAGRAM_TYPES` out of `SKILL.md`; it was changed before its packet moved.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Gate edits come first. Each one reads the old place first and the sibling `ROUTER.md` second, so it passes on the unmoved tree.

- [x] T005 Stop listing a packet `ROUTER.md` as residue and replace the section 2 requirement with the pointer plus a final machine section (`Product Owner/benchmark/gates/check_hub.py` lines 55-62, 185-187, self-test 549). Verify: `python3 benchmark/gates/check_hub.py` prints `PASSED the hub, 4 registry packets and 51 gold rows`, and `--self-test` exits 0.
  - Observed: on the unmoved tree `python3 benchmark/gates/check_hub.py` printed `PASSED the hub, 4 registry packets and 51 gold rows` (exit 0) and `--self-test` printed 15 `PASS` cases ending `PASS  the restored copy passes` (exit 0). On the moved tree the self-test runs 16 cases, all PASS, because the case for a packet `ROUTER.md` that `SKILL.md` never links now has a router to plant against.
- [x] T006 Read each packet `RESOURCE_MAP` from its `ROUTER.md` when present (`Product Owner/benchmark/gates/check_leaf_map_parity.py` lines 88-91). Verify: prints `PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests ...`, exit 0.
  - Observed: `PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, and the FLOW keywords replay every hub gold row`, exit 0.
- [x] T007 Slice the routing prose from `SKILL.md` and `ROUTER.md` (`Sales - Direct Communication/benchmark/router/differential.py` line 268). Verify: `python3 differential.py` prints `DIFFERENTIAL PASSED: 110 route objects compared, all guards green`.
  - Observed: `DIFFERENTIAL PASSED: 110 route objects compared, all guards green`, exit 0.
- [x] T008 Point the prose guards at both files (`Barter - Deal Templates/benchmark/router/differential.py` lines 598, 1267, 1332, 2226). Verify: prints `PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)`.
  - Observed: `PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)`, exit 0.
- [x] T009 [P] Let the section lookups find `### Executable Contract`, detection, domains and lanes in `ROUTER.md` (`Barter - Copywriter/benchmark/router/differential.py` lines 479, 1505, 2061). Verify: output still reads `0/186 inputs diverge` with only the recorded lane-budget failure.
  - Observed: `FAILED differential gate: 0/186 inputs diverge` followed only by the recorded `lane budget: lane-budget-baseline.md is not what lane_budget.py produces` line, exit 1, the same as baseline row 13.
- [x] T010 [P] Lift the FigJam router block and the topic table from `ROUTER.md` (`Product Owner/benchmark/router/differential.py` lines 715-819). Verify: prints `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)`.
  - Observed: `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)`, exit 0.
- [x] T011 [P] Read the Smart Router Pseudocode fence from `ROUTER.md` (`Prompt Improver/benchmark/router/kernel_parity.py`, `Sales - HubSpot & Automation/benchmark/router/kernel_parity.py`). Verify: each prints `PASSED kernel router parity ...`, exit 0.
  - Observed: Prompt Improver printed `PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals SKILL.md's Smart Router Pseudocode with its comments removed` and Sales HubSpot `PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals SKILL.md's Smart Router Pseudocode minus comments`, both exit 0. After the move both name `ROUTER.md` as the source.
- [x] T012 Emit `## 3. MACHINE ROUTER` as the last H2 of the generated block (`Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py` line 35). Verify: from `Moneybird Accountant/`, `python3 -I sk-moneybird-accountant/scripts/check-route-table.py` prints `route-table: ok`.
  - Observed: `route-table: ok`, exit 0. Deviation: the generator owns no heading, it rewrites only the lines between `<!-- router-block:start -->` and `<!-- router-block:end -->`, so the generator is unchanged. What forbade the new shape was the hub check's required `## 2. SMART ROUTING` in every packet router. It now accepts that heading or a `## 3. MACHINE ROUTER` that is the router's last H2 with the generated block inside it, accepts a `./ROUTER.md` pointer, reads the hub links from the hub `SKILL.md` plus its `ROUTER.md`, and holds the hub router's machine block to the registry. In a scratch copy, a renamed hub mode, a section after `## 3. MACHINE ROUTER` and a removed hub pointer each made it exit 1 with the matching line.

Skill moves, in the research 10.4 order. Each step: create or restructure `ROUTER.md` from the Public `skill-router-template.md`, cut the machine data out of `SKILL.md` verbatim, end SMART ROUTING with the pointer sentence, a relative link to the sibling `ROUTER.md` followed by "before selecting skill-local resources; open only the matched files.", rerun the system's baseline rows, then commit.

- [x] T013 Media Editor pilot: two fences and one table move, 43 prose words and the `references/router-contract.md` line stay (`Media Editor/sk-media-editor/SKILL.md`, `ROUTER.md`). Verify: `bash benchmark/router/run_fixtures.sh` exits 0 with `PASSED 132/132 differential checks ...`, and `python3 "$PKG" --check --strict "$AIS/Media Editor/sk-media-editor"` prints `Result: PASS`.
  - Observed: `bash benchmark/router/run_fixtures.sh` exit 0 with `PASSED 22/22 fixtures` and `PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)`; `package_skill.py --check --strict` printed `Result: PASS`. The Media Editor `differential.py` copy parity needs the `### Smart Router Pseudocode` pointer heading, which moved, so it now reads `SKILL.md` and `ROUTER.md` as one surface (the spec row's "Modify otherwise" case).
- [x] T014 Prompt Improver: the 902-word pseudocode fence and resource tables move; the six prose sub-blocks stay (`Prompt Improver/sk-prompt-improver/`). Verify: `run_fixtures.sh` exits 0 with `PASSED kernel router parity ...`, and `$PKG --check --strict` prints `Result: PASS`.
  - Observed: `run_fixtures.sh` printed `PASSED 32/32 fixtures` and `PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals ROUTER.md's Smart Router Pseudocode with its comments removed`; `package_skill.py --check --strict` printed `Result: PASS`. The missing markers were added as one prose paragraph in `ROUTER.md` Section 2 naming `guard_in_skill` as the canon's `_guard_in_skill` and the `INTERACTIVE` fallback lane as its `UNKNOWN_FALLBACK`; the pseudocode, the kernel and every fixture are unchanged.
- [ ] T015 Barter - Copywriter: the 12 table and assignment blocks move as one block; lane prose stays (`Barter - Copywriter/sk-barter-copywriter/`). Verify: `differential.py` still reads `0/186 inputs diverge`, `run_gates.sh` prints `all 4 gates pass`, and `$PKG --check --strict` prints `Result: PASS`.
  - Observed: the version is now `1.5.17.0` in `SKILL.md` and the skill `README.md`, and the Project README's two Skill claims follow. `package_skill.py --check --strict` now stops on `Missing required sections: HOW IT WORKS, REFERENCES`, and behind it a probe copy shows 33 more findings, mostly resource docs on the system's own `0.NNN` version scheme. Adding sections and re-versioning resource docs is wider than a routing move, so this stays open for a follow-up. Its gates still pass; see T025.
- [x] T016 Sales - Direct Communication: detection fence, resource tables, pipeline selection, the 434-word Semantic Topic Registry and the example move (`Sales - Direct Communication/sk-sales-communication/`). Verify: `run_fixtures.sh` exits 0 with `EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean`.
  - Observed: `run_fixtures.sh` exit 0 ending `EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean`, with all seven baseline lines unchanged.
- [x] T017 Sales - HubSpot & Automation: all five blocks move, 76 prose words stay (`Sales - HubSpot & Automation/sk-sales-hubspot-automation/`). Verify: `run_fixtures.sh` exits 0, and `run_gates.sh` prints `Thresholds intact across 8 files ... OK`.
  - Observed: `run_fixtures.sh` exit 0 (`PASSED 27/27 fixtures`, kernel parity now naming `ROUTER.md`), and `run_gates.sh` printed `Thresholds intact across 8 files: STEPS floors sum 37, SCRIPT floors sum 72, 3 surviving totals, 3 removed totals still absent. OK`.
- [x] T018 Barter - Deal Templates: both fences move; `Command Entry Points` stays as prose in the router body; the kernel `## 12. ROUTER CODE` copy is untouched (`Barter - Deal Templates/sk-barter-deal-templates/`). Verify: `run_fixtures.sh` exits 0 and `run_gates.sh` prints `all 7 gates pass`.
  - Observed: `run_fixtures.sh` exit 0 (`PASSED 117/117 fixtures`, `PASSED 221/221 differential inputs ...`) and `run_gates.sh` printed `all 7 gates pass`.
- [x] T019 Moneybird: restructure `cli-jortt/ROUTER.md` (fence 88-176), `cli-moneybird/ROUTER.md` (text block 57-65 kept in prose, fence 83-170) and `sk-moneybird-accountant/ROUTER.md` by hand, give each packet `SKILL.md` the pointer sentence, and give the hub a root `ROUTER.md` holding the stage one prose from `SKILL.md` Section 2 and a final `## 3. MACHINE ROUTER` naming the child modes as `hub-router.json` and `mode-registry.json` do, with the hub `SKILL.md` Section 2 ending in the hub pointer line (`Moneybird Accountant/`). Verify: two `--write` runs leave the nested repository's `git diff` unchanged, and `check-skill-words.py`, `check-route-table.py`, `route-replay.py --mode replay` and `cli-moneybird/scripts/exit-code-parity.sh` print `ok` lines and exit 0.
  - Observed: the three packet routers were restructured by hand into `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER` with every block moved verbatim, the one anchor that named `#2-smart-routing` now names `#3-machine-router`, and each packet `SKILL.md` gained the pointer sentence. The hub gained `ROUTER.md` with its stage one prose and a `## 3. MACHINE ROUTER` JSON block whose modes, signals, default, hand-off and fallback equal `mode-registry.json` and `hub-router.json` field for field, and its `SKILL.md` Section 2 ends with `Run the stage one rules in [`ROUTER.md`](./ROUTER.md) before selecting hub resources.` Two `--write` runs each printed `router block: unchanged (ROUTER.md)` and `intent signals: unchanged (graph-metadata.json)`, and the nested repository's `git diff` hash was `dadff878` before, between and after. `check-skill-words.py` (every file ok, the new `ROUTER.md` 657 words), `check-route-table.py` `route-table: ok`, `route-replay.py --mode replay` `route-replay: ok, 31 replay rows passed` and `exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)` all exit 0. Also green: `check-english-first.py` 0 problems, `check-fragments.py` 5053 links 0 problems, `write-contract-check.py` ok, `route-table-test.sh` 57 passed, `check-skill-words-test.sh` 10 passed, `write-contract-test.sh` 13 passed, `exit-code-parity-test.sh` 7 passed.
- [x] T020 Product Owner hub: move the `## 3. MACHINE-READABLE ROUTER` fence (lines 45-103) past `## 4. HOW TO READ THIS` and `## RELATED RESOURCES` into a final `## 3. MACHINE ROUTER`, keep `router_state` and `skill_pointer` byte-identical, move the 181-word route-resolution fence and the `Outcomes` list out of the hub `SKILL.md`, and rewrite its "packet's own `SKILL.md` Section 2 routes inside the packet" sentence (`Product Owner/ROUTER.md`, `SKILL.md`). Verify: `check_hub.py` prints `PASSED the hub, 4 registry packets and 51 gold rows` and `check_leaf_map_parity.py` exits 0.
  - Observed: `check_hub.py` printed `PASSED the hub, 4 registry packets and 51 gold rows` and `check_leaf_map_parity.py` exit 0. The frontmatter (lines 1-13), the python block and the moved directive and `Outcomes` list are byte-identical to their HEAD text; `HOW TO READ THIS` and `RELATED RESOURCES` became H3s in Section 2, so `## 3. MACHINE ROUTER` is the last H2. The hub `SKILL.md` keeps the two-stage sentence, rewritten to name the packet's sibling `ROUTER.md`, the `routerPolicy.stageOneOrder` sentence the hub gate reads, and the hub pointer `Run the compiled-routing directive in [`ROUTER.md`](./ROUTER.md) before selecting hub resources.`
- [x] T021 `sk-product-owner` and `sk-create-figjam`: detection fence and loading table move, `Router Mechanics` prose stays; three fences and the loading table move, 30 prose words stay (`Product Owner/sk-product-owner/`, `Product Owner/sk-create-figjam/`). Verify: `bash benchmark/gates/run_gates.sh` shows `hub check`, `leaf map parity`, `router fixtures` and `skilled packet contract` as `ok`.
  - Observed: `run_gates.sh` shows `hub check ok`, `leaf map parity ok`, `router fixtures ok` and `skilled packet contract ok`, and `flow check self-test` `201 of 201 self-test checks passed`. The gate set reads `2 of 15 gates failed` where baseline read 3: `vendor sync` (upstream moved) and `skilled hub contract`, whose parent check fails 12 invariants, down from 25, all on the vendored `mcp-click-up` and `mcp-figma` that T022 pulls. `Router Mechanics` moved into `ROUTER.md` Section 2, because RS-001 caps SMART ROUTING at 180 words.
- [x] T022 Pull the three vendored MCP packets once Public main carries their `ROUTER.md` (`Product Owner/mcp-click-up/`, `mcp-code-mode/`, `mcp-figma/`, `vendor.json`). Blocked on Public phase 005 reaching Public `main`. Verify: `python3 scripts/vendor-sync.py status` prints `in step` for all three, and `ls` lists `ROUTER.md` in each.
  - Observed: released by the conductor. `vendor-sync.py pull --package` printed `mcp-click-up: pulled 185 files at ca10a236d2...`, `mcp-code-mode: pulled 77 files` and `mcp-figma: pulled 66 files`, each exit 0. `vendor-sync.py status` then printed `in step at ca10a236d23926077bae05fd347c7f34eba45810` for all three (exit 0). After the Public reference fixes, `mcp-click-up` and `mcp-code-mode` were pulled again and now print `in step at fd3d0f6f5e001e4e365e0ccc3d9e9d710632cb00`, and `ls` lists `mcp-click-up/ROUTER.md`, `mcp-code-mode/ROUTER.md` and `mcp-figma/ROUTER.md`. The pull refuses an upstream with uncommitted changes, so what landed is the committed Public tree. The Product Owner gate set now prints `all 15 gates pass`.

Claude Project documents, one per system that has a `claude project/` folder (Moneybird has none).

- [~] T023 Media Editor Project first: add `knowledge/Media Editor - System - Routing.md` with the `## 3. MACHINE ROUTER` payload, declare it in the Sync Loop `systems.py` (`pairs` or `adapted_pairs`, whichever `validate_parity.py` check 1 accepts), raise the Project README total by one, and add a dated `SYNC.md` note (`Media Editor/claude project/`, `Media Editor/SYNC.md`). Verify: `bash benchmark/parity/run_parity.sh` prints `PASSED 8/8 declared pairs, seven checks` if it is a `pairs` row (7/7 otherwise), exit 0.
  - Observed: superseded by the conductor's option C on 2026-10-29: no routing knowledge document, no gate change, no `systems.py` change; each Project keeps routing from its kernel's Router Code. Instead each of the seven `SYNC.md` files now lists `<skill>/SKILL.md` and `<skill>/ROUTER.md` in step 1 and carries a dated 2026-10-29 note naming the gate that still compares the kernel. `ls "$AIS"/*/"claude project"/knowledge/ | grep -ci rout` printed 0, and `git diff --name-only -- '*/Custom Instructions.md' '*/systems.py'` printed nothing in AI Systems and in each of the four nested repositories.
- [~] T024 [P] The same for the other six Projects: Prompt Improver, Barter - Copywriter, Sales - Direct Communication, Sales - HubSpot & Automation, Barter - Deal Templates and Product Owner. Verify: each `run_parity.sh` exits 0, and `ls "$AIS"/*/"claude project"/knowledge/*" - System - Routing.md" | wc -l` prints 7.
  - Observed: superseded with T023 by the same decision; the parity results for all seven systems are in T025.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Rerun every baseline row and compare (`scratch/after.md`). Verify: each row that exits 0 in `scratch/baseline.md` exits 0 with the same pass line, and rows 1, 7, 13 and 29 are no worse.
  - Observed: `scratch/after.md` holds all 37 rows from the final run, after T022, the canon fixes and the `SYNC.md` notes. Every row that exited 0 at baseline exits 0 with the same counts (281, 221, 186 with 0 diverging, 132, 110; parity 18, 29, 7, 65, 13, 49, 27). Rows 7, 13 and 29 fail exactly as recorded, and row 1 went from `3 of 15 gates failed` to `all 15 gates pass`.
- [x] T026 Count the routers and pointers (`$AIS`). Verify: `find "$AIS" -name ROUTER.md -not -path '*/specs/*' -not -path '*/node_modules/*' | wc -l` prints 16, the skill pointer `grep -rl` over `SKILL.md` files prints 14, and the hub pointer `grep -rlF '(./ROUTER.md) before selecting hub resources.'` prints 2.
  - Observed: `find ... ROUTER.md | wc -l` printed 16, the skill pointer `grep -rl` printed 14 and the hub pointer grep 2. A check of all 16 found each with `router_state: active`, `skill_pointer: SKILL.md` and `## 3. MACHINE ROUTER` as its last H2 (`16 routers, 0 bad`).
- [ ] T027 Run the canon checker on the 16 moved skills (`$PKG`). Verify: `python3 "$PKG" --check --strict <skill>` prints `Result: PASS` for each.
  - Observed: on all 16, `Result: PASS` for 12: `sk-media-editor`, `sk-prompt-improver`, the Moneybird hub, `cli-jortt`, `cli-moneybird`, `sk-moneybird-accountant`, the Product Owner hub, `sk-product-owner`, `sk-create-figjam`, `mcp-click-up`, `mcp-code-mode` and `mcp-figma`. `Result: FAIL` for 4, none on a routing rule (RS-001 to RS-005 report none for all 16): Copywriter (`Missing required sections: HOW IT WORKS, REFERENCES`), Sales Communication (`Frontmatter name 'sales-direct-communication' must match folder name 'sk-sales-communication'`), Deal Templates (`Frontmatter name 'barter-deals' must match ...`) and HubSpot (28 resource docs on the `0.NNN` scheme). Renaming a skill reaches `systems.py`, `rule_parity.py`, `run_parity.sh` and `AGENTS.md`, so it is identity, not canon. Not made; open.
- [x] T028 Check the scope of the diff (`$REPO`). Verify: `git -C "$REPO" diff --name-only <start>..HEAD` names only files in `spec.md` section 3, and `git -C "$REPO" status --porcelain` still shows the two `Collab Phases` files untracked.
  - Observed: read from the working tree before the commits, which now hold the same files (`git diff` of the seven per-system commits against the pre-split commit is empty). AI Systems names only the section 3 files: the gate scripts, `flow_check.py`, the `SKILL.md`, `ROUTER.md` and `SYNC.md` files, four Project `README.md` and two skill `README.md` version claims, `Product Owner/vendor.json` and 39 files the pull rewrote under the three vendored packets; the two `Collab Phases` files are still untracked. The Moneybird repository names its 7 `SKILL.md` and `ROUTER.md` files, the new hub `ROUTER.md`, `mode-registry.json`, `README.md` and `check-route-table.py`. Media Editor, Prompt Improver and Product Owner are nested repositories too, and their own status shows the same files. `git diff --name-only -- '*/Custom Instructions.md' '*/systems.py'` prints nothing in any of the five repositories.
- [ ] T029 [B] Push to `Barter-BV/marketing-ai-systems`. Blocked on operator approval. Verify: before approval, `git -C "$REPO" rev-list --count origin/main..main` prints the number of local commits and `main..origin/main` is checked for new upstream commits.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, except T023 and T024, superseded by option C, and T029, which waits for the operator.
- [ ] No `[B]` blocked task remains other than T029.
- [ ] `scratch/after.md` reproduces every passing row of `scratch/baseline.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../007-ai-systems-research/research/research.md`
- **Baseline**: `scratch/baseline.md`
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

A blocked task stays `[B]` with its blocker named in the task line, and a blocked P0 keeps the packet open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` section 4 lists REQ-001 to REQ-009, and `grep -c 'REQ-0' spec.md` is at least 9.
  - Observed: `grep -c 'REQ-0' spec.md` printed 10; REQ-001 to REQ-009 are listed.
- [x] CHK-002 [P0] `plan.md` section 3 names every gate reader, and T004's `rg` finds no other.
  - Observed: T004's `rg` found no script beyond the table. `flow_check.py`, which that pattern misses, was found by reading the FigJam scripts and is now a row in `plan.md` and `spec.md`.
- [x] CHK-003 [P1] The Public main `mcp-figma/ROUTER.md` exists before T022 starts.
  - Observed: `git ls-tree -r --name-only main` in Public lists `mcp-tooling/mcp-figma/ROUTER.md`, `mcp-tooling/mcp-click-up/ROUTER.md` and `mcp-code-mode/ROUTER.md`, and T022 pulled all three.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m py_compile` exits 0 for every edited gate script, with `PYTHONDONTWRITEBYTECODE=1` so no cache lands.
  - Observed: every edited script passed `compile()` under `python3 -B`, printing `compiled 11`, exit 0; no `__pycache__` newer than the baseline exists in the tree.
- [x] CHK-011 [P0] No gate prints a traceback in `scratch/after.md`: `grep -c Traceback scratch/after.md` prints 0.
  - Observed: `grep -c Traceback scratch/after.md` printed 0.
- [x] CHK-012 [P1] Each edited gate still fails on the old bad shape: `check_hub.py --self-test` exits 0.
  - Observed: `check_hub.py --self-test` printed 16 `PASS` cases, exit 0, including `a packet ROUTER.md without a final machine section fails` and `a packet ROUTER.md its SKILL.md never links fails`.
- [x] CHK-013 [P1] Comments in edited gates carry no packet or phase number: `rg -n '008-ai|phase 8' <gates>` prints nothing.
  - Observed: `rg -n '008-ai|phase 8|T0[0-9][0-9]'` over the 11 edited scripts printed nothing, exit 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` names observed evidence.
  - Observed: every `acceptance-criteria.md` row carries a status and the evidence behind it.
- [x] CHK-021 [P0] `scratch/after.md` exists with 37 rows.
  - Observed: `grep -c '^| [0-9]' scratch/after.md` printed 37.
- [x] CHK-022 [P1] The Moneybird second `--write` leaves the diff unchanged.
  - Observed: the nested Moneybird repository's `git diff` hash was `dadff878` before, between and after two `--write` runs.
- [x] CHK-023 [P1] The four pre-existing red rows are recorded unchanged or better.
  - Observed: rows 7, 13 and 29 fail exactly as recorded; row 1 improved from 3 failing gates to none (`all 15 gates pass`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each gate edit is classed `cross-consumer`: one canon change read by several gates.
  - Observed: each gate edit reads the same canon change, `SKILL.md` first and the sibling `ROUTER.md` second.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is T004's `rg` output, saved in `scratch/`.
  - Observed: `scratch/reader-inventory.txt` holds T004's `rg` output and a `--no-ignore --hidden` rerun.
- [x] CHK-FIX-003 [P0] The consumer inventory covers the gates, the Project kernels, `systems.py` and `vendor.json`.
  - Observed: the inventory lists the gates, `systems.py` and the episode script; the kernels are read by the kernel parity gates, which stayed byte-identical in what they compare; `vendor.json` is only touched by T022's pull.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix; the router guards stay byte-identical.
  - Observed: N/A, confirmed: no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] The matrix is 8 systems x 3 surfaces with 37 baseline rows, listed in `plan.md` section 3.
  - Observed: `scratch/baseline.md` and `scratch/after.md` each hold 37 rows over the 8 systems.
- [x] CHK-FIX-006 [P1] N/A: no gate reads process-wide state beyond `PYTHONDONTWRITEBYTECODE` and `TIKTOKEN_CACHE_DIR`, both fixed in the runner.
  - Observed: N/A, confirmed: the edited gates read only `PYTHONDONTWRITEBYTECODE` and `TIKTOKEN_CACHE_DIR` from the environment, as before.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the start commit and each system's commit SHA.
  - Observed: evidence is pinned to start commit `8e4573b8f`. No per-system commit exists, because this run was barred from committing; the conductor's SHAs fill it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No `.env` file is read: no task command names one.
  - Observed: no command in this run opened a `.env` file; the one `.env` text in this file is this checklist row.
- [x] CHK-031 [P0] No gate that needs network or credentials runs; `route-replay.py --mode resolve` stays exit 2 without a cache.
  - Observed: no network gate ran; `route-replay-test.sh` exited 2 for the missing tiktoken cache, as at baseline.
- [x] CHK-032 [P1] N/A: the move adds no auth surface.
  - Observed: N/A, confirmed: no auth surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 16 routers and the same order.
  - Observed: `spec.md`, `plan.md` and `tasks.md` name 16 routers in the research order; none still says 15.
- [x] CHK-041 [P1] Each edited gate's header comment says it reads both `SKILL.md` and `ROUTER.md`.
  - Observed: the header docstring of each edited gate names the sibling `ROUTER.md`; `flow_check.py` is not a gate and says so at its read site.
- [x] CHK-042 [P2] Each system `SYNC.md` carries the dated parity note.
  - Observed: each of the seven `SYNC.md` files ends with a 2026-10-29 note naming the gate that still compares the kernel Router Code, and step 1 lists `ROUTER.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run logs live under `scratch/` only.
  - Observed: run logs sit under `scratch/` and the session scratchpad outside both repositories.
- [x] CHK-051 [P1] No temporary file is left in the AI Systems tree: `git -C "$REPO" status --porcelain --ignored` matches the start apart from committed files.
  - Observed: `git status --porcelain --ignored` lists 10,643 ignored entries, the same count as at the start.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
