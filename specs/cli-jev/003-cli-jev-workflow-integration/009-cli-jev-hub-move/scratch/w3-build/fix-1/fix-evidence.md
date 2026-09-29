# Fix round 1 evidence: phase 009

All commands ran from the worktree root. Full outputs are in the sibling files named per step. Exit codes from executors are not verdicts: each executor result below was checked against the tree.

## Item 1: cli-classifier harness asserts fixture expectations (PASS)

### Pre-reads
- All 9 fixture cases carry `gold.expectedIntents` and `gold.expectedResources`, so the full five-field check was kept: action, selection kind, modes, intents and resources.
- A read-only comparison of the committed twin `route-gold.typed.json` with the fixture gave 9 of 9 MATCH before the edit, so the new assertion could not change any built byte.
- `cmp` of the runtime and twin harness before the edit: exit 0. `cmp` of the runtime and twin fixture: exit 0.

### Edit
- Brief `briefs/01-devin-harness-assert.md`, Devin `deepseek-v4-1-flash-max`: `exit=0 seconds=38`. It reported `node --check` exit 0, `cmp` exit 0, `DONE`.
- `git diff -- <runtime harness>` shows the 33-line `assertGoldExpectations(entry, result, observed)` block above `typedGold` and one call `assertGoldExpectations(entry, result, observed);` right after `const observed = ...`. The other hunks are the earlier cli-jev to cli-classifier rename. The block's comment carries no ephemeral label.
- `cmp <runtime harness> <twin harness>`: exit 0 (after the edit and again at the end). `node --check <runtime harness>`: exit 0.

### Proof 1: harness runs, twin artifacts unchanged (`item1-before.txt`, `item1-after.txt`)
- Deviation, with reason: the build ran the twin copy (build-evidence section 6: its output is the twin's `compiled/*` and `activation/*`). The runtime copy writes to `.skilled/bin/lib/.../008-cli-classifier/compiled/` and `activation/`, which do not exist, so it would have created 11 untracked files outside the write scope. The two copies are byte-identical, so I ran the twin path, and I also ran the runtime module in memory.
- `node specs/sk-doc/.../008-cli-classifier/harness/build-artifacts.cjs`: `{"activationArtifacts":5,"compiledArtifacts":6,"effectivePolicyHash":"63c0e7c4be35...","graphHash":"acca07e7526f...","status":"built"}`, exit 0.
- `node -e` loading the runtime harness then running `loadSnapshot()` and `typedGold()`: `runtime typedGold ok, cases=9`, exit 0.
- `git status --porcelain` over the twin's `compiled/` and `activation/`: the same 11 lines before and after (`diff` exit 0).
- `git diff --stat` over the same paths: `8 files changed, 11 insertions(+), 11 deletions(-)` before and after (`diff` exit 0).
- `shasum -a 256` of all 11 files: identical before and after (`diff` exit 0).

### Proof 2: negative (`item1-neg.txt`, `neg/neg-proof.cjs`, `neg/canary-cases.v1.deem-expects-jev.json`)
- The script loads the runtime harness, writes a fixture copy under `neg/` in which `deem-choice-single` expects `cli-jev`, and calls `typedGold`. It reads only.
- `node .../fix-1/neg/neg-proof.cjs`: `threw code=GOLD_MISMATCH message=gold mismatch for deem-choice-single: modes [cli-deem] but expected [cli-jev]`, exit 0.
- `git status --porcelain` before and after the script: identical (`diff` exit 0).

### Proof 3: gates (`item1-gates.txt`, `item1-vitest.txt`)
| Command | Result line | Exit |
|---|---|---|
| `node .skilled/bin/compiled-route-sync.cjs --check` | `55 closure files under authored root` ... `all 7 hubs resolve` | 0 |
| `node .skilled/bin/compiled-route-sync.cjs --verify` | `move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs` | 0 |
| `node .skilled/bin/compiled-route-guard.cjs` | `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.` | 0 |
| `node .skilled/bin/compiled-route-admission.cjs --hub cli-classifier` | `cli-classifier pass 5 pass, 0 drift, 0 stale, 0 n/a` | 0 |
| `node .skilled/bin/compiled-route-manifest.cjs freshness --hub cli-classifier --skill-root .skilled/skills/cli-classifier` | `"manifestValid":true,"fresh":true,"causeCode":"fresh"`, policy `63c0e7c4...` | 0 |
| `cd .skilled && npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` | `Tests 37 passed (37)` | 0 |

The vitest run's own sandbox `compiled-route-move-dALoHy` was removed by the test. `.sandboxes/` is gitignored.

### Proof 4: cross-family review
- Brief `briefs/02-pi-review-harness-diff.md`, Pi `llmgateway/mimo-v2.6-pro` high: `exit=0 seconds=198`.
- Output (`logs/02-pi.last.txt`): `none` then `VERDICT: PASS`. No P0 or P1, so no second Devin brief.
- Limit: Pi text mode logs no tool calls, so its reads are inferred from the 198-second run, not observed. `git status --porcelain` was identical before and after (`diff` exit 0).

## Item 2: cli-usage playbook root validates (PASS)

### Before (`item2-before-validate.txt`, `item2-before.txt`)
- Default validator run: `INVALID`, 1 blocking (`overview`), exit 1. `--type playbook`: `INVALID`, 4 blocking (`overview`, `global_preconditions`, `global_evidence_requirements`, `deterministic_command_notation`), exit 1.
- The brief's named sibling `cli-classifier/cli-deem/manual-testing-playbook/manual-testing-playbook.md` does not exist (exit 2, file not found). I used the hub root `cli-classifier/manual-testing-playbook/manual-testing-playbook.md` instead: default `VALID` exit 0, `--type playbook` `VALID`, 0 issues, exit 0.
- Rule source: `sk-doc/shared/assets/template-rules.json` `documentTypes.playbook.requiredSections`. Template: `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`.
- `grep -c '^| \[JEV-'`: 22. Similarity: `rename .skilled/skills/{cli-jev => cli-classifier}/cli-usage/manual-testing-playbook/manual-testing-playbook.md (98%)`.

### Edit
- Brief `briefs/03-pi-playbook-sections.md`, Pi `llmgateway/mimo-v2.6-pro` high: `exit=0 seconds=248`, `DONE`.
- Diff (`item2-diff.txt`): `HOW TO RUN` became `1. OVERVIEW`. Its `command -v jev && jev --version` block moved unchanged under a new `2. GLOBAL PRECONDITIONS`. `EVIDENCE RULES` was renamed `3. GLOBAL EVIDENCE REQUIREMENTS` with its body unchanged. A new `4. DETERMINISTIC COMMAND NOTATION` holds 3 lines of text taken from the phrasing all 22 scenario files use. The last three sections were renumbered 5 to 7. No other line changed.

### After (`item2-after.txt`)
| Command | Result line | Exit |
|---|---|---|
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` | `VALID`, readme, 1 warning (`document_type_fallback`) | 0 |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file> --type playbook` | `VALID`, playbook, `Total issues: 0` | 0 |
| `grep -c '^| \[JEV-' <file>` | 22 (was 22); the rows are byte-identical (`diff` exit 0) | 0 |
| `git diff HEAD -M --summary -- <old> <new>` | `rename .skilled/skills/{cli-jev => cli-classifier}/cli-usage/manual-testing-playbook/manual-testing-playbook.md (94%)` | 0 |
| `git diff HEAD -M --stat --find-renames -- <old> <new>` | one file, `22 insertions(+), 10 deletions(-)` | 0 |

The em dash count is 35 before and after, so all of them are moved original text.

## Tree state

- `git status --porcelain` (default): identical to the start (`diff status-before.txt status-final.txt` exit 0). The three edited files were already `AM` and remain `AM`: the runtime harness, the twin harness and the playbook. The only new untracked files are under `fix-1/`.
- No git write, install, `.env` read, `jev` call or Deem call was made.
