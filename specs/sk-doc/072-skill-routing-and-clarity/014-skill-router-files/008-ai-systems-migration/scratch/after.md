# AI Systems gate rerun after the router move

Captured 2026-10-29 on `/Users/michelkerkmeester/MEGA/Development/AI Systems`, branch `main`, HEAD `8e4573b8f` (nothing committed), with the gate edits and every skill move of tasks T005 to T021 in the working tree. The Moneybird Accountant folder is its own git repository (`MichelKerkmeester/ai-accountant_moneybird`, HEAD `df7472d`), ignored by the AI Systems checkout, and its edits are in that working tree.

- Every row ran exactly as `scratch/baseline.md` ran it: same command, same working directory, `PYTHONDONTWRITEBYTECODE=1`, `python3` resolving to `/usr/bin/python3`.
- `git status --porcelain --ignored` lists the same 10,643 ignored entries before the first edit and after this run, so no run left a cache or a temporary file in the AI Systems tree.
- The captured output holds no Python stack trace: the CHK-011 grep for the trace header over this file prints 0.
- The table below is the final run, taken after the vendored pull (T022), the canon fixes that leave routing unchanged and the seven `SYNC.md` notes. T023 and T024 were superseded by the conductor's option C, so no Project knowledge file, kernel or `systems.py` changed.
- Against the first after-run, only row 1 moved: `2 of 15 gates failed` became `all 15 gates pass`, because the pulled packets cleared `vendor sync` and the 12 parent-check invariants. Every other row printed the same line and exit code both times.

## Comparison

| # | Gate | Baseline (last line) | Exit | After (last line) | Exit | Verdict |
|---|------|----------------------|------|-------------------|------|---------|
| 1 | Product Owner full gate set | `3 of 15 gates failed`: vendor sync (mcp-figma upstream-ahead, 15 changes), skilled hub contract (RS-001: 16 lines, 481 words), skilled packet contract (`sk-product-owner`: RS-001, RS-004, RS-005) | 3 | `all 15 gates pass` | 0 | Improved: every gate passes, was 3 failing. The pull brought the three vendored packets `in step` at Public `ca10a236d2`, which cleared `vendor sync` and the parent check's invariants on `mcp-click-up` and `mcp-figma` |
| 2 | check_hub.py | `PASSED the hub, 4 registry packets and 51 gold rows` | 0 | `PASSED the hub, 4 registry packets and 51 gold rows` | 0 | Same pass line and counts |
| 3 | check_hub.py self-test | `PASS  the restored copy passes` | 0 | `PASS  the restored copy passes` | 0 | Same pass line and counts |
| 4 | check_leaf_map_parity.py | `PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, ...` | 0 | `PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, and the FLOW keywords replay every hub gold row` | 0 | Same pass line and counts |
| 5 | Product Owner router gate | `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)` | 0 | `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)` | 0 | Same pass line and counts |
| 6 | Product Owner differential.py | same PASSED 281/281 line | 0 | `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)` | 0 | Same pass line and counts |
| 7 | Barter - Copywriter router gate | last check passes, but the run exits 1 because differential.py fails (row 13) | 1 | `PASSED probe routing: 29 probes resolve the intent, lane, artifact and documents they are pinned to, and all 48 scored phrases resolve the intent t...` | 1 | Same: only the recorded lane-budget failure; 67/67 fixtures, 29 probes held out, 48 phrases pinned |
| 8 | Barter - Deal Templates router gate | `PASSED probe routing: 112 inputs ... 68 keywords and 7 commands ...` | 0 | `PASSED probe routing: 112 inputs resolve the mode they are pinned to, and every one of 68 keywords and 7 commands fails a pin when removed, 65 of t...` | 0 | Same pass line and counts |
| 9 | Media Editor router gate | `PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)` | 0 | `PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)` | 0 | Same pass line and counts |
| 10 | Prompt Improver router gate | `PASSED kernel router parity: ... '## 8. ROUTER CODE' equals SKILL.md's Smart Router Pseudocode ...` | 0 | `PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals ROUTER.md's Smart Router Pseudocode with it...` | 0 | Same pass, the source is now named `ROUTER.md`, where the pseudocode moved |
| 11 | Sales - Direct Communication router gate | `EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean` | 0 | `EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean` | 0 | Same pass line and counts |
| 12 | Sales - HubSpot & Automation router gate | `PASSED kernel router parity: ... '## 11. ROUTER CODE' and equals SKILL.md's Smart Router Pseudocode minus comments` | 0 | `PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals ROUTER.md's Smart Router Pseudocode minus co...` | 0 | Same pass, the source is now named `ROUTER.md`, where the pseudocode moved |
| 13 | Barter - Copywriter differential.py | `FAILED differential gate: 0/186 inputs diverge` / `lane budget: lane-budget-baseline.md is not what lane_budget.py produces` | 1 | `- lane budget: lane-budget-baseline.md is not what lane_budget.py produces, so the recorded per-lane budget is stale (re-run it with --write and re...` | 1 | Same: `0/186 inputs diverge`, only the recorded lane-budget failure |
| 14 | Barter - Deal Templates differential.py | `PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)` | 0 | `PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)` | 0 | Same pass line and counts |
| 15 | Media Editor differential.py | `PASSED 132/132 differential checks ...` | 0 | `PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)` | 0 | Same pass line and counts |
| 16 | Sales - Direct Communication differential.py | `DIFFERENTIAL PASSED: 110 route objects compared, all guards green` | 0 | `DIFFERENTIAL PASSED: 110 route objects compared, all guards green` | 0 | Same pass line and counts |
| 17 | Prompt Improver kernel_parity.py | `PASSED kernel router parity ...` | 0 | `PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals ROUTER.md's Smart Router Pseudocode with it...` | 0 | Same pass, the source is now named `ROUTER.md` |
| 18 | Sales - Direct Communication kernel_parity.py | `PASSED kernel router parity: ... router-contract.md's router with its comments removed (134 code lines ...)` | 0 | `PASSED kernel router parity: the kernel's '## 8. ROUTER CODE' block is router-contract.md's router with its comments removed (134 code lines, ident...` | 0 | Same pass line and counts |
| 19 | Sales - HubSpot & Automation kernel_parity.py | `PASSED kernel router parity ...` | 0 | `PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals ROUTER.md's Smart Router Pseudocode minus co...` | 0 | Same pass, the source is now named `ROUTER.md` |
| 20 | Barter - Copywriter gates | `all 4 gates pass` | 0 | `all 4 gates pass` | 0 | Same pass line and counts |
| 21 | Barter - Deal Templates gates | `all 7 gates pass` | 0 | `all 7 gates pass` | 0 | Same pass line and counts |
| 22 | Sales - HubSpot & Automation gates | `Thresholds intact across 8 files ... OK` | 0 | `Thresholds intact across 8 files: STEPS floors sum 37, SCRIPT floors sum 72, 3 surviving totals, 3 removed totals still absent. OK` | 0 | Same pass line and counts |
| 23 | Media Editor rule_parity.py | `PASSED 5 rules hold on both sides of every pair that teaches them` | 0 | `PASSED 5 rules hold on both sides of every pair that teaches them` | 0 | Same pass line and counts |
| 24 | Prompt Improver rule_parity.py | `PASSED 6 rules hold ...` | 0 | `PASSED 6 rules hold on both sides of every pair that teaches them` | 0 | Same pass line and counts |
| 25 | Sales - Direct Communication rule_parity.py | `PASSED 4 rules hold ...` | 0 | `PASSED 4 rules hold on both sides of every pair that teaches them` | 0 | Same pass line and counts |
| 26 | Moneybird check-skill-words.py | `check-skill-words: sk-moneybird-accountant/SKILL.md 1927 words, ok` | 0 | `check-skill-words: sk-moneybird-accountant/SKILL.md 1938 words, ok` | 0 | Same: every file ok; one more line for the new hub `ROUTER.md` (657 words), word counts moved with the restructure |
| 27 | Moneybird check-route-table.py, check mode | `route-table: ok` | 0 | `route-table: ok` | 0 | Same pass line and counts |
| 28 | Moneybird route-replay.py, replay mode | `route-replay: output in <temp dir>` (summary line above it in the detail block) | 0 | `route-replay: output in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/route-replay-out.r0ox5c_i` | 0 | Same: `route-replay: ok, 31 replay rows passed` |
| 29 | Moneybird route-replay.py, resolve mode | `route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set)` | 2 | `route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set)` | 2 | Same: exits 2 by design without the tiktoken cache |
| 30 | cli-moneybird exit-code-parity.sh | `exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)` | 0 | `exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)` | 0 | Same pass line and counts |
| 31 | Barter - Copywriter Project parity | `PASSED 18/18 declared pairs, seven checks` | 0 | `PASSED 18/18 declared pairs, seven checks` | 0 | Same pass line and counts |
| 32 | Barter - Deal Templates Project parity | `PASSED 1 system(s), 29 declared pair(s) compared, ...` | 0 | `PASSED 1 system(s), 29 declared pair(s) compared, every shared anchor states the same rule on both sides` | 0 | Same pass line and counts |
| 33 | Media Editor Project parity | `PASSED 7/7 declared pairs, seven checks` | 0 | `PASSED 7/7 declared pairs, seven checks` | 0 | Same pass line and counts |
| 34 | Product Owner Project parity | `PASSED 65/65 declared pairs, seven checks` | 0 | `PASSED 65/65 declared pairs, seven checks` | 0 | Same pass line and counts |
| 35 | Prompt Improver Project parity | `PASSED 13/13 declared pairs, seven checks` | 0 | `PASSED 13/13 declared pairs, seven checks` | 0 | Same pass line and counts |
| 36 | Sales - Direct Communication Project parity | `PASSED 49/49 declared pairs, seven checks` | 0 | `PASSED 49/49 declared pairs, seven checks` | 0 | Same pass line and counts |
| 37 | Sales - HubSpot & Automation Project parity | `PASSED 27/27 declared pairs, seven checks` | 0 | `PASSED 27/27 declared pairs, seven checks` | 0 | Same pass line and counts |

Every row that exited 0 at baseline exits 0 again with the same counts: differentials 281, 221, 186 (0 diverging), 132 and 110; Project parity 18, 29, 7, 65, 13, 49 and 27 declared pairs. Rows 7, 13 and 29 fail exactly as recorded, and row 1 fails one gate fewer.

## Detail: last 8 lines of each run

### 1. Product Owner full gate set

- cwd: `AI Systems/Product Owner`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 0

This detail was first captured from an intermediate run, before the last canon fix, and showed exit 2. It was recaptured from the final tree on 2026-10-29, matching the table row.

```text
  hub check self-test      ok
  leaf map parity          ok
  flow check self-test     ok
  board composer self-test ok
  skilled hub contract     ok
  skilled packet contract  ok

all 15 gates pass
```

### 2. check_hub.py

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_hub.py`
- exit: 0

```text
PASSED the hub, 4 registry packets and 51 gold rows
```

### 3. check_hub.py self-test

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_hub.py --self-test`
- exit: 0

```text
PASS  a packet ROUTER.md its SKILL.md never links fails
PASS  a vendored packet vendor.json does not list fails
PASS  a default packet marked vendored fails
PASS  a default artifact word gold row fails when its JSON term is missing
PASS  a Flow command missing from packetCommands fails its gold row
PASS  a packet machine router without a smart-router marker fails
PASS  a workflow packet registered as a transport fails
PASS  the restored copy passes
```

### 4. check_leaf_map_parity.py

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_leaf_map_parity.py`
- exit: 0

```text
PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, and the FLOW keywords replay every hub gold row
```

### 5. Product Owner router gate

- cwd: `AI Systems/Product Owner`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 188/188 fixtures
PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)
```

### 6. Product Owner differential.py

- cwd: `AI Systems/Product Owner/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)
```

### 7. Barter - Copywriter router gate

- cwd: `AI Systems/Barter - Copywriter`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 1

```text
PASSED 67/67 fixtures
FAILED differential gate: 0/186 inputs diverge
 - lane budget: lane-budget-baseline.md is not what lane_budget.py produces, so the recorded per-lane budget is stale (re-run it with --write and read the diff)
PASSED probe holdout: 29 probes held out of both gates
PASSED probe routing: 29 probes resolve the intent, lane, artifact and documents they are pinned to, and all 48 scored phrases resolve the intent that owns them
```

### 8. Barter - Deal Templates router gate

- cwd: `AI Systems/Barter - Deal Templates`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 117/117 fixtures
PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)
PASSED probe holdout: 37 probes held out of both gates, 75 pins carried by neither
PASSED probe routing: 112 inputs resolve the mode they are pinned to, and every one of 68 keywords and 7 commands fails a pin when removed, 65 of them by moving a route and 3 subsumed subject phrases by moving the band a pinned request scores
```

### 9. Media Editor router gate

- cwd: `AI Systems/Media Editor`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 22/22 fixtures
PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)
```

### 10. Prompt Improver router gate

- cwd: `AI Systems/Prompt Improver`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 32/32 fixtures
PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals ROUTER.md's Smart Router Pseudocode with its comments removed
```

### 11. Sales - Direct Communication router gate

- cwd: `AI Systems/Sales - Direct Communication`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 33/33 fixtures
DIFFERENTIAL PASSED: 110 route objects compared, all guards green
PASSED kernel router parity: the kernel's '## 8. ROUTER CODE' block is router-contract.md's router with its comments removed (134 code lines, identical syntax trees)
HOLDOUT CHECK PASSED: 15 probes stay out of the gates
ROUTING CHECK PASSED: 15 probes and 35 scored keywords pinned
Scoring surface intact, no drift. OK
EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean
```

### 12. Sales - HubSpot & Automation router gate

- cwd: `AI Systems/Sales - HubSpot & Automation`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 27/27 fixtures
PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals ROUTER.md's Smart Router Pseudocode minus comments
```

### 13. Barter - Copywriter differential.py

- cwd: `AI Systems/Barter - Copywriter/benchmark/router`
- command: `python3 differential.py`
- exit: 1

```text
FAILED differential gate: 0/186 inputs diverge
 - lane budget: lane-budget-baseline.md is not what lane_budget.py produces, so the recorded per-lane budget is stale (re-run it with --write and read the diff)
```

### 14. Barter - Deal Templates differential.py

- cwd: `AI Systems/Barter - Deal Templates/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)
```

### 15. Media Editor differential.py

- cwd: `AI Systems/Media Editor/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)
```

### 16. Sales - Direct Communication differential.py

- cwd: `AI Systems/Sales - Direct Communication/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
DIFFERENTIAL PASSED: 110 route objects compared, all guards green
```

### 17. Prompt Improver kernel_parity.py

- cwd: `AI Systems/Prompt Improver/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals ROUTER.md's Smart Router Pseudocode with its comments removed
```

### 18. Sales - Direct Communication kernel_parity.py

- cwd: `AI Systems/Sales - Direct Communication/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: the kernel's '## 8. ROUTER CODE' block is router-contract.md's router with its comments removed (134 code lines, identical syntax trees)
```

### 19. Sales - HubSpot & Automation kernel_parity.py

- cwd: `AI Systems/Sales - HubSpot & Automation/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals ROUTER.md's Smart Router Pseudocode minus comments
```

### 20. Barter - Copywriter gates

- cwd: `AI Systems/Barter - Copywriter`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 0

```text
  gates.py             ok
  mirror_parity.py     ok
  rule_parity.py       ok
  example_lint.py      ok

all 4 gates pass
```

### 21. Barter - Deal Templates gates

- cwd: `AI Systems/Barter - Deal Templates`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 0

```text
  mirror_parity.py     ok
  variations.py        ok
  rule_parity.py       ok
  requirements.py      ok
  content_parity.py    ok
  export_lint.py       ok

all 7 gates pass
```

### 22. Sales - HubSpot & Automation gates

- cwd: `AI Systems/Sales - HubSpot & Automation`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 0

```text
Thresholds intact across 8 files: STEPS floors sum 37, SCRIPT floors sum 72, 3 surviving totals, 3 removed totals still absent. OK
```

### 23. Media Editor rule_parity.py

- cwd: `AI Systems/Media Editor`
- command: `python3 benchmark/gates/rule_parity.py`
- exit: 0

```text
  pairs: 7 of 7 declared pairs compared
  retired names: 18 files scanned, 0 finding(s)
  the tool check gates every operation, tools first: taught by 5 pair(s), 5 declared
  no format or filter promised before a build check: taught by 2 pair(s), 2 declared
  no horizontal dividers in a reply: taught by 1 pair(s), 1 declared
  one comprehensive question, then wait: taught by 1 pair(s), 1 declared
  the export destination convention: taught by 2 pair(s), 2 declared
PASSED 5 rules hold on both sides of every pair that teaches them
```

### 24. Prompt Improver rule_parity.py

- cwd: `AI Systems/Prompt Improver`
- command: `python3 benchmark/gates/rule_parity.py`
- exit: 0

```text
  pairs: 13 of 13 declared pairs compared
  every clarifying turn asks exactly one comprehensive question: taught by 4 pair(s), 2 declared
  standard and deep energy analyse from a minimum of three perspectives, target five: taught by 2 pair(s), 2 declared
  CLEAR, EVOKE and VISUAL never substitute for each other's prompt family: taught by 1 pair(s), 1 declared
  creative-mode deliverables close with an invitation to share the result back: taught by 5 pair(s), 5 declared
  JSON and YAML deliverables are downloadable files, never inline: taught by 2 pair(s), 2 declared
  framework fit beats framework complexity, RCAF is the ordinary default: taught by 1 pair(s), 1 declared
PASSED 6 rules hold on both sides of every pair that teaches them
```

### 25. Sales - Direct Communication rule_parity.py

- cwd: `AI Systems/Sales - Direct Communication`
- command: `python3 benchmark/gates/rule_parity.py`
- exit: 0

```text
  pairs: 49 of 49 declared pairs compared
  no em dash, semicolon, Oxford comma, asterisk emphasis or curly quotes in delivered output: taught by 2 pair(s), 2 declared
  a bullet item never ends in a full stop: taught by 1 pair(s), 1 declared
  a bullet or numbered list of exactly three items is banned: taught by 2 pair(s), 2 declared
  the two measured conciseness floors, 5 connectives and 30 articles per 1000 words: taught by 1 pair(s), 1 declared
PASSED 4 rules hold on both sides of every pair that teaches them
```

### 26. Moneybird check-skill-words.py

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/check-skill-words.py`
- exit: 0

```text
check-skill-words: ROUTER.md 657 words, ok
check-skill-words: SKILL.md 447 words, ok
check-skill-words: cli-jortt/ROUTER.md 1327 words, ok
check-skill-words: cli-jortt/SKILL.md 1402 words, ok
check-skill-words: cli-moneybird/ROUTER.md 1597 words, ok
check-skill-words: cli-moneybird/SKILL.md 2093 words, ok
check-skill-words: sk-moneybird-accountant/ROUTER.md 2476 words, ok
check-skill-words: sk-moneybird-accountant/SKILL.md 1938 words, ok
```

### 27. Moneybird check-route-table.py, check mode

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/check-route-table.py`
- exit: 0

```text
route-table: ok
```

### 28. Moneybird route-replay.py, replay mode

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/route-replay/route-replay.py --mode replay`
- exit: 0

```text
route-replay: ok, 31 replay rows passed
route-replay: output in <temp dir>/route-replay-out.r0ox5c_i
```

### 29. Moneybird route-replay.py, resolve mode

- cwd: `AI Systems/Moneybird Accountant`
- command: `env -u TIKTOKEN_CACHE_DIR python3 -I sk-moneybird-accountant/scripts/route-replay/route-replay.py --mode resolve`
- exit: 2

```text
route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set)
```

### 30. cli-moneybird exit-code-parity.sh

- cwd: `AI Systems/Moneybird Accountant`
- command: `bash cli-moneybird/scripts/exit-code-parity.sh`
- exit: 0

```text
exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)
```

### 31. Barter - Copywriter Project parity

- cwd: `AI Systems/Barter - Copywriter`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 9 checked, 0 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 18 named across 0 roll-up row(s), 18 on disk, declared total(s) none
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.11.1 named among 35 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.11.1 and Skill v1.5.17 live, README states ['1.11.1'] and ['1.5.17']
  review-due drift: 9 of 9 owned pairs in step, 0 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 0 declared record(s) before any timestamp comparison ran, 0 still stand at the commit they name
PASSED 18/18 declared pairs, seven checks
```

### 32. Barter - Deal Templates Project parity

- cwd: `AI Systems/Barter - Deal Templates`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  manifest: 29 named across 0 roll-up row(s), 29 on disk, declared total(s) none
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.26.26 named among 83 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.26.26 and Skill v2.0.27 live, README states ['1.26.26'] and ['2.0.27']
  review-due drift: 18 of 18 owned pairs in step, 0 source change(s) confined to constructs a mirror never carries, 1 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 0 declared record(s) before any timestamp comparison ran, 0 still stand at the commit they name
PASSED 29/29 declared pairs, seven checks
PASSED 1 system(s), 29 declared pair(s) compared, every shared anchor states the same rule on both sides
```

### 33. Media Editor Project parity

- cwd: `AI Systems/Media Editor`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 0 checked, 0 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 7 named across 0 roll-up row(s), 7 on disk, declared total(s) [7]
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.1.0 named among 22 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.1.0 and Skill v1.1.0.0 live, README states ['1.1.0'] and ['1.1.0.0']
  review-due drift: 7 of 7 owned pairs in step, 0 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 0 declared record(s) before any timestamp comparison ran, 0 still stand at the commit they name
PASSED 7/7 declared pairs, seven checks
```

### 34. Product Owner Project parity

- cwd: `AI Systems/Product Owner`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 4 checked, 4 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 65 named across 5 roll-up row(s), 65 on disk, declared total(s) none
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.2.16 named among 100 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.2.16 and Skill v1.2.6.0 live, README states ['1.2.16'] and ['1.2.6.0']
  review-due drift: 61 of 61 owned pairs in step, 11 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 1 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 2 declared record(s) before any timestamp comparison ran, 2 still stand at the commit they name
PASSED 65/65 declared pairs, seven checks
```

### 35. Prompt Improver Project parity

- cwd: `AI Systems/Prompt Improver`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 0 checked, 0 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 13 named across 0 roll-up row(s), 13 on disk, declared total(s) none
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.0.1 named among 23 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.0.1 and Skill v1.0.1.0 live, README states ['1.0.1'] and ['1.0.1.0']
  review-due drift: 13 of 13 owned pairs in step, 6 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 0 declared record(s) before any timestamp comparison ran, 0 still stand at the commit they name
PASSED 13/13 declared pairs, seven checks
```

### 36. Sales - Direct Communication Project parity

- cwd: `AI Systems/Sales - Direct Communication`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 9 checked, 0 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 49 named across 0 roll-up row(s), 49 on disk, declared total(s) [49]
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.8.0 named among 23 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.8.0 and Skill v1.3.7 live, README states ['1.8.0'] and ['1.3.7']
  review-due drift: 40 of 40 owned pairs in step, 0 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 1 declared record(s) before any timestamp comparison ran, 1 still stand at the commit they name
PASSED 49/49 declared pairs, seven checks
```

### 37. Sales - HubSpot & Automation Project parity

- cwd: `AI Systems/Sales - HubSpot & Automation`
- command: `bash benchmark/parity/run_parity.sh`
- exit: 0

```text
  shared sources: 8 checked, 0 of them vendored copies, 0 forked, 0 fork(s) declared with a reason
  manifest: 27 named across 0 roll-up row(s), 27 on disk, declared total(s) none
  kernel bumps: origin/main..HEAD contains no commit touching the kernel
  version record: live kernel v1.10.1 named among 21 dated notes, a record of the version and not proof of a review
  version claims: kernel v1.10.1 and Skill v1.2.6 live, README states ['1.10.1'] and ['1.2.6']
  review-due drift: 19 of 19 owned pairs in step, 0 source change(s) confined to constructs a mirror never carries, 0 where the source caught up to an already-correct mirror, 0 cleared by a review recorded at the current source commit, 0 recorded review(s) whose recorded commit the source has moved past, 0 pair(s) whose history could not be read, 0 path(s) differing from their committed revision, 0 pair(s) with no record and a review due on the drift alone
  review keys: compared for all 0 declared record(s) before any timestamp comparison ran, 0 still stand at the commit they name
PASSED 27/27 declared pairs, seven checks
```
