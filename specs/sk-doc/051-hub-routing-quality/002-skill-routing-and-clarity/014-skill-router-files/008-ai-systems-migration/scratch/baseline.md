# AI Systems gate baseline before the router move

Captured 2026-10-29 on `/Users/michelkerkmeester/MEGA/Development/AI Systems`, branch `main`, HEAD `8e4573b8f`, read-only.

- Every command ran as its own runner calls it, from the directory that runner uses, with `PYTHONDONTWRITEBYTECODE=1` so no `__pycache__` lands in the tree. `python3` resolves to `/usr/bin/python3`.
- `git status --porcelain --ignored` was captured before and after the whole run. The two listings are identical, so the run wrote nothing in the repository. The only entries are the two untracked files under `Product Context/Collab Phases/` that belong to someone else, plus ignored files that were already there.
- Invocations come from `benchmark/router/run_fixtures.sh`, `benchmark/gates/run_gates.sh` (Product Owner, Barter - Copywriter, Barter - Deal Templates, Sales - HubSpot & Automation), `sk-moneybird-accountant/benchmark/README.md` section 4, and the script headers of `check-skill-words.py`, `check-route-table.py`, `route-replay.py` and `exit-code-parity.sh`.
- `.skilled/skills` in the AI Systems checkout is a symlink to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills`, so the Product Owner `skilled hub contract` and `skilled packet contract` gates run the Public main checkout's `package_skill.py`. Its RS codes are the Public canon's (RS-004 = no sibling ROUTER.md, RS-005 = no pointer link).

## Summary

| # | Gate | Command (cwd) | Result (last line) | Exit |
|---|------|---------------|--------------------|------|
| 1 | Product Owner full gate set | `bash benchmark/gates/run_gates.sh` (`Product Owner`) | `3 of 15 gates failed`: vendor sync (mcp-figma upstream-ahead, 15 changes), skilled hub contract (RS-001: 16 lines, 481 words), skilled packet contract (`sk-product-owner`: RS-001, RS-004, RS-005) | 3 |
| 2 | check_hub.py | `python3 benchmark/gates/check_hub.py` (`Product Owner`) | `PASSED the hub, 4 registry packets and 51 gold rows` | 0 |
| 3 | check_hub.py self-test | `python3 benchmark/gates/check_hub.py --self-test` (`Product Owner`) | `PASS  the restored copy passes` | 0 |
| 4 | check_leaf_map_parity.py | `python3 benchmark/gates/check_leaf_map_parity.py` (`Product Owner`) | `PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, ...` | 0 |
| 5 | Product Owner router gate | `bash benchmark/router/run_fixtures.sh` (`Product Owner`) | `PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)` | 0 |
| 6 | Product Owner differential.py | `python3 differential.py` (`Product Owner/benchmark/router`) | same PASSED 281/281 line | 0 |
| 7 | Barter - Copywriter router gate | `bash benchmark/router/run_fixtures.sh` | last check passes, but the run exits 1 because differential.py fails (row 13) | 1 |
| 8 | Barter - Deal Templates router gate | `bash benchmark/router/run_fixtures.sh` | `PASSED probe routing: 112 inputs ... 68 keywords and 7 commands ...` | 0 |
| 9 | Media Editor router gate | `bash benchmark/router/run_fixtures.sh` | `PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)` | 0 |
| 10 | Prompt Improver router gate | `bash benchmark/router/run_fixtures.sh` | `PASSED kernel router parity: ... '## 8. ROUTER CODE' equals SKILL.md's Smart Router Pseudocode ...` | 0 |
| 11 | Sales - Direct Communication router gate | `bash benchmark/router/run_fixtures.sh` | `EXPORT BLOCKER CHECK PASSED: 144 exports and 78 email samples clean` | 0 |
| 12 | Sales - HubSpot & Automation router gate | `bash benchmark/router/run_fixtures.sh` | `PASSED kernel router parity: ... '## 11. ROUTER CODE' and equals SKILL.md's Smart Router Pseudocode minus comments` | 0 |
| 13 | Barter - Copywriter differential.py | `python3 differential.py` (`benchmark/router`) | `FAILED differential gate: 0/186 inputs diverge` / `lane budget: lane-budget-baseline.md is not what lane_budget.py produces` | 1 |
| 14 | Barter - Deal Templates differential.py | `python3 differential.py` (`benchmark/router`) | `PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)` | 0 |
| 15 | Media Editor differential.py | `python3 differential.py` (`benchmark/router`) | `PASSED 132/132 differential checks ...` | 0 |
| 16 | Sales - Direct Communication differential.py | `python3 differential.py` (`benchmark/router`) | `DIFFERENTIAL PASSED: 110 route objects compared, all guards green` | 0 |
| 17 | Prompt Improver kernel_parity.py | `python3 kernel_parity.py` (`benchmark/router`) | `PASSED kernel router parity ...` | 0 |
| 18 | Sales - Direct Communication kernel_parity.py | `python3 kernel_parity.py` (`benchmark/router`) | `PASSED kernel router parity: ... router-contract.md's router with its comments removed (134 code lines ...)` | 0 |
| 19 | Sales - HubSpot & Automation kernel_parity.py | `python3 kernel_parity.py` (`benchmark/router`) | `PASSED kernel router parity ...` | 0 |
| 20 | Barter - Copywriter gates | `bash benchmark/gates/run_gates.sh` | `all 4 gates pass` | 0 |
| 21 | Barter - Deal Templates gates | `bash benchmark/gates/run_gates.sh` | `all 7 gates pass` | 0 |
| 22 | Sales - HubSpot & Automation gates | `bash benchmark/gates/run_gates.sh` | `Thresholds intact across 8 files ... OK` | 0 |
| 23 | Media Editor rule_parity.py | `python3 benchmark/gates/rule_parity.py` | `PASSED 5 rules hold on both sides of every pair that teaches them` | 0 |
| 24 | Prompt Improver rule_parity.py | `python3 benchmark/gates/rule_parity.py` | `PASSED 6 rules hold ...` | 0 |
| 25 | Sales - Direct Communication rule_parity.py | `python3 benchmark/gates/rule_parity.py` | `PASSED 4 rules hold ...` | 0 |
| 26 | Moneybird check-skill-words.py | `python3 -I sk-moneybird-accountant/scripts/check-skill-words.py` (`Moneybird Accountant`) | `check-skill-words: sk-moneybird-accountant/SKILL.md 1927 words, ok` | 0 |
| 27 | Moneybird check-route-table.py, check mode | `python3 -I sk-moneybird-accountant/scripts/check-route-table.py` (`Moneybird Accountant`) | `route-table: ok` | 0 |
| 28 | Moneybird route-replay.py, replay mode | `python3 -I sk-moneybird-accountant/scripts/route-replay/route-replay.py --mode replay` | `route-replay: output in <temp dir>` (summary line above it in the detail block) | 0 |
| 29 | Moneybird route-replay.py, resolve mode | same script `--mode resolve`, no `TIKTOKEN_CACHE_DIR` | `route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set)` | 2 |
| 30 | cli-moneybird exit-code-parity.sh | `bash cli-moneybird/scripts/exit-code-parity.sh` (`Moneybird Accountant`) | `exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)` | 0 |
| 31 | Barter - Copywriter Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 18/18 declared pairs, seven checks` | 0 |
| 32 | Barter - Deal Templates Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 1 system(s), 29 declared pair(s) compared, ...` | 0 |
| 33 | Media Editor Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 7/7 declared pairs, seven checks` | 0 |
| 34 | Product Owner Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 65/65 declared pairs, seven checks` | 0 |
| 35 | Prompt Improver Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 13/13 declared pairs, seven checks` | 0 |
| 36 | Sales - Direct Communication Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 49/49 declared pairs, seven checks` | 0 |
| 37 | Sales - HubSpot & Automation Project parity | `bash benchmark/parity/run_parity.sh` | `PASSED 27/27 declared pairs, seven checks` | 0 |

Rows 31 to 37 run the shared Sync Loop `validate_parity.py` (read-only; its subprocess calls read git history). A second `git status --porcelain --ignored` before and after them was also identical. Moneybird Accountant has no `claude project/` folder, so it has no parity row.

Pre-existing red before any edit: rows 1, 7, 13 and 29. Phase 008 must not count these as regressions, and must not count them as its own fixes unless a task changes them on purpose.

- Row 1: `vendor sync` fails because the Public upstream of `mcp-figma` moved ahead; it is not a routing fault. The two `skilled ... contract` failures are the routing-shape debt this phase removes.
- Row 13 (and so row 7): `lane-budget-baseline.md` is stale against `lane_budget.py`. Fixing it needs `lane_budget.py --write`, which this baseline did not run.
- Row 29: resolve mode needs the seeded `o200k_base` and `cl100k_base` cache named by `TIKTOKEN_CACHE_DIR`. No cache exists at `AI Systems/tiktoken-cache` or anywhere under the checkout, and the script refuses to download, so it exits 2 by design.

## Not run, and why

| Gate | Reason |
|------|--------|
| `check-route-table.py --write` | writes `ROUTER.md` and `graph-metadata.json` |
| `gates.py freeze`, `lane_budget.py --write`, `vendor-sync.py pull/push` | write frozen snapshots, baselines or vendored trees |
| `run_receipts.sh`, `run_receipt_write.sh`, `run_residency.sh` | write receipts and residency ledgers |
| `benchmark/parity/run_parity.sh` | first listed here as a receipt writer; reading each script showed it only reads, so it ran as rows 31 to 37 |
| `token-baseline.py --check`, route-replay resolve mode with a cache | need the seeded tiktoken cache, which is absent |
| `*-test.sh` suites under `sk-moneybird-accountant/scripts/` | build throwaway copies; the gate itself was run directly instead |

## Detail: last 8 lines of each run

### PO run_gates.sh (full gate set)

- cwd: `AI Systems/Product Owner`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 3

```text
          
          ⚠️  1 warning(s):
             • SKILL.md has 4999 words (recommended max: 3000)
          
          ==================================================
          Result: FAIL

3 of 15 gates failed
```

### PO check_hub.py

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_hub.py`
- exit: 0

```text
PASSED the hub, 4 registry packets and 51 gold rows
```

### PO check_hub.py --self-test

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_hub.py --self-test`
- exit: 0

```text
PASS  a packet ROUTER.md fails
PASS  a vendored packet vendor.json does not list fails
PASS  a default packet marked vendored fails
PASS  a default artifact word gold row fails when its JSON term is missing
PASS  a Flow command missing from packetCommands fails its gold row
PASS  a packet Section 2 without a smart-router marker fails
PASS  a workflow packet registered as a transport fails
PASS  the restored copy passes
```

### PO check_leaf_map_parity.py

- cwd: `AI Systems/Product Owner`
- command: `python3 benchmark/gates/check_leaf_map_parity.py`
- exit: 0

```text
PASSED 9 router lanes and DEFAULT_RESOURCE match 4 packet manifests, including FLOW, and the FLOW keywords replay every hub gold row
```

### PO router run_fixtures.sh

- cwd: `AI Systems/Product Owner`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 188/188 fixtures
PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)
```

### PO router differential.py

- cwd: `AI Systems/Product Owner/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 281/281 differential inputs (9 topics, 114 synonyms in parity, 61 routing.md triggers checked)
```

### Barter - Copywriter router run_fixtures.sh

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

### Barter - Deal Templates router run_fixtures.sh

- cwd: `AI Systems/Barter - Deal Templates`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 117/117 fixtures
PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)
PASSED probe holdout: 37 probes held out of both gates, 75 pins carried by neither
PASSED probe routing: 112 inputs resolve the mode they are pinned to, and every one of 68 keywords and 7 commands fails a pin when removed, 65 of them by moving a route and 3 subsumed subject phrases by moving the band a pinned request scores
```

### Media Editor router run_fixtures.sh

- cwd: `AI Systems/Media Editor`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 22/22 fixtures
PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)
```

### Prompt Improver router run_fixtures.sh

- cwd: `AI Systems/Prompt Improver`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 32/32 fixtures
PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals SKILL.md's Smart Router Pseudocode with its comments removed
```

### Sales - Direct Communication router run_fixtures.sh

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

### Sales - HubSpot & Automation router run_fixtures.sh

- cwd: `AI Systems/Sales - HubSpot & Automation`
- command: `bash benchmark/router/run_fixtures.sh`
- exit: 0

```text
PASSED 27/27 fixtures
PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals SKILL.md's Smart Router Pseudocode minus comments
```

### Barter - Copywriter router differential.py

- cwd: `AI Systems/Barter - Copywriter/benchmark/router`
- command: `python3 differential.py`
- exit: 1

```text
FAILED differential gate: 0/186 inputs diverge
 - lane budget: lane-budget-baseline.md is not what lane_budget.py produces, so the recorded per-lane budget is stale (re-run it with --write and read the diff)
```

### Barter - Deal Templates router differential.py

- cwd: `AI Systems/Barter - Deal Templates/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 221/221 differential inputs (15 tables in parity, 7 commands and 68 keywords covered)
```

### Media Editor router differential.py

- cwd: `AI Systems/Media Editor/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
PASSED 132/132 differential checks (22 inputs x 6 host states, 11 commands, 6 modes in parity)
```

### Sales - Direct Communication router differential.py

- cwd: `AI Systems/Sales - Direct Communication/benchmark/router`
- command: `python3 differential.py`
- exit: 0

```text
DIFFERENTIAL PASSED: 110 route objects compared, all guards green
```

### Prompt Improver router kernel_parity.py

- cwd: `AI Systems/Prompt Improver/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: Custom Instructions.md's one python fence under '## 8. ROUTER CODE' equals SKILL.md's Smart Router Pseudocode with its comments removed
```

### Sales - Direct Communication router kernel_parity.py

- cwd: `AI Systems/Sales - Direct Communication/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: the kernel's '## 8. ROUTER CODE' block is router-contract.md's router with its comments removed (134 code lines, identical syntax trees)
```

### Sales - HubSpot & Automation router kernel_parity.py

- cwd: `AI Systems/Sales - HubSpot & Automation/benchmark/router`
- command: `python3 kernel_parity.py`
- exit: 0

```text
PASSED kernel router parity: the kernel's only python fence sits under '## 11. ROUTER CODE' and equals SKILL.md's Smart Router Pseudocode minus comments
```

### Barter - Copywriter gates run_gates.sh

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

### Barter - Deal Templates gates run_gates.sh

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

### Sales - HubSpot & Automation gates run_gates.sh

- cwd: `AI Systems/Sales - HubSpot & Automation`
- command: `bash benchmark/gates/run_gates.sh`
- exit: 0

```text
Thresholds intact across 8 files: STEPS floors sum 37, SCRIPT floors sum 72, 3 surviving totals, 3 removed totals still absent. OK
```

### Media Editor gates rule_parity.py

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

### Prompt Improver gates rule_parity.py

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

### Sales - Direct Communication gates rule_parity.py

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

### Moneybird check-skill-words.py

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/check-skill-words.py`
- exit: 0

```text
check-skill-words: SKILL.md 706 words, ok
check-skill-words: cli-jortt/ROUTER.md 1295 words, ok
check-skill-words: cli-jortt/SKILL.md 1391 words, ok
check-skill-words: cli-moneybird/ROUTER.md 1565 words, ok
check-skill-words: cli-moneybird/SKILL.md 2082 words, ok
check-skill-words: sk-moneybird-accountant/ROUTER.md 2435 words, ok
check-skill-words: sk-moneybird-accountant/SKILL.md 1927 words, ok
```

### Moneybird check-route-table.py (check mode)

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/check-route-table.py`
- exit: 0

```text
route-table: ok
```

### Moneybird route-replay.py --mode replay

- cwd: `AI Systems/Moneybird Accountant`
- command: `python3 -I sk-moneybird-accountant/scripts/route-replay/route-replay.py --mode replay`
- exit: 0

```text
route-replay: ok, 31 replay rows passed
route-replay: output in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/route-replay-out.1ibn6lv8
```

### Moneybird route-replay.py --mode resolve (no TIKTOKEN_CACHE_DIR)

- cwd: `AI Systems/Moneybird Accountant`
- command: `env -u TIKTOKEN_CACHE_DIR python3 -I sk-moneybird-accountant/scripts/route-replay/route-replay.py --mode resolve`
- exit: 2

```text
route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set)
```

### cli-moneybird exit-code-parity.sh

- cwd: `AI Systems/Moneybird Accountant`
- command: `bash cli-moneybird/scripts/exit-code-parity.sh`
- exit: 0

```text
exit-code-parity: ok (codes: 2 3 4 5 6 7 8 9)
```

### Barter - Copywriter parity run_parity.sh

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

### Barter - Deal Templates parity run_parity.sh

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

### Media Editor parity run_parity.sh

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

### Product Owner parity run_parity.sh

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

### Prompt Improver parity run_parity.sh

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

### Sales - Direct Communication parity run_parity.sh

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

### Sales - HubSpot & Automation parity run_parity.sh

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

