# Build evidence: cli-classifier hub with the cli-deem transport

Base: HEAD 735d1b0956, tree clean before dispatch 01 (`logs/00-pre.status` is empty). Nothing committed. The session commits.

This folder is gitignored (`.gitignore:57 build/`). It never shows in `git status`, so committing it needs `git add -f`.

## 1. Files

### Written by executors (29), all under `.skilled/skills/cli-classifier/`

| File | Brief | Executor |
|---|---|---|
| `cli-deem/scripts/cli-deem.mjs` | 01 (health), 02 (noul, choice, score), 03 (pre-send refusals), 04 (run) | cursor |
| `cli-deem/scripts/tests/cli-deem.test.mjs` | 01, 02, 03, 04 | cursor |
| `cli-deem/SKILL.md`, `cli-deem/README.md`, `cli-deem/changelog/v1.0.0.0.md` | 05 | pi |
| `cli-deem/references/{wire-contract,deem-ctl-lifecycle,model-pin}.md` | 06 | pi |
| `cli-deem/feature-catalog/` root plus 5 leaves | 07 | pi |
| `SKILL.md`, `README.md`, `ROUTER.md`, `changelog/v1.0.0.0.md` | 08, and SKILL.md again in 14 | pi |
| `mode-registry.json`, `hub-router.json` | 09 | pi |
| `manual-testing-playbook/` root plus 3 scenarios | 10 | pi |
| `benchmark/README.md`, `benchmark/reports/README.md` | 11 | pi |
| `description.json`, `graph-metadata.json` | 12. graph-metadata.json again in 13. Both again in 14 | pi |

The doc briefs (05 to 14) copied payloads I wrote to `briefs/payloads/`. `cmp` matched every target to its payload (`logs/verify.txt`).

### Written by generators (run by me, commands below)

| File | Command | Exit |
|---|---|---|
| `.skilled/skills/cli-classifier/leaf-manifest.json` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/cli-classifier`. `--check` afterwards | 0, then 0 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (modified) | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json`, after `--validate-only` | 0 |
| `.hermes/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-deem/SKILL.md` | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`. `--check` afterwards | 0 ("PASS: 73 Hermes skill copies in sync") |
| none in git (advisor sqlite, gitignored) | `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` | 0 (generation 43 to 44) |

I did not regenerate the trigger index, as the ruling says.

## 2. Briefs by executor

- 14 briefs total: cursor 4 (01 to 04), pi 10 (05 to 14), devin 0 and pi-fallback 0.
- Every brief returned STATUS DONE on its first dispatch, so none needed a retry.
- Briefs 13 and 14 (and 15 to 19, section 8) are corrections from later findings, not retries of failed briefs:
  - **13:** the graph compiler blocks a skill with zero edges.
  - **14:** the advisor put this hub on Jev prompts.
- No handback held a stray question or an auth error.
- After each brief, `git status` showed only the files that brief allowed.

## 3. Proof plan (`proof/`, `replay/`)

| Row | Check | Result |
|---|---|---|
| 1 | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | PASS, exit 0, "all hard invariants passed, 0 warnings" |
| 2 | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/` | PASS, exit 0, tests 28, pass 28, fail 0 |
| 3 | `grep -nE 'Authorization\|Bearer\|API_KEY\|deem-ctl' cli-deem.mjs` plus the import scan | PASS: 0 matches (exit 1). 0 imports outside `node:` |
| 4a | Stage 1, advisor replay (`replay/advisor-after.txt`) | PASS, detailed below |
| 4b | Stage 2, in-memory replay (`replay/stage2.txt`, script `replay/stage2-replay.cjs`) | PASS: all 6 Deem prompts route single to `cli-deem`. The Jev, out-of-domain and "deemed" prompts defer |
| 4c | Front door `compiled-route.cjs --hub cli-classifier` | `{"servingAuthority":"legacy","hubId":"cli-classifier"}`, exit 0, as expected without admission |
| 5 | Live `cli-deem health` | NOT RUN, SESSION row |
| 6 | Scope | PASS: 32 paths, 29 under `cli-classifier/`, 2 Hermes copies and `skill-graph.json`. `git diff -- .skilled/skills/cli-jev` has 0 lines |
| 7 | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/cli-classifier` | PASS, exit 0 |
| 8 | `validate.sh --strict` | NOT RUN, closure leaf, SESSION |

Stage-1 advisor results (`replay/advisor-after.txt`). The "before" results are in `replay/advisor-before.txt`.

| Prompt | Recommendations |
|---|---|
| Deem probability prompt | cli-classifier 0.89 |
| "use deem choice" | cli-classifier 0.917, cli-jev 0.82 |
| "is the local deem server healthy" | cli-classifier 0.95 |
| "cli-deem health" | cli-classifier 0.95 |
| Four Jev prompts | cli-jev first, cli-classifier absent |
| Out-of-domain prompt | no recommendation |
| "the result was deemed acceptable" | no recommendation |

Before the hub, the Deem prompt returned no recommendation.

## 4. Suite deltas (`baseline/summary.txt` against `final/summary.txt`)

| Gate | Baseline | Final |
|---|---|---|
| parent-skill-check, every hub | 7 hubs, 0 nonzero | 8 hubs, 0 nonzero |
| ci-skill-root-metadata, leaf-manifest, derived freshness | 15 checked, all pass | 16 checked, all pass |
| skill-graph `--validate-only` | PASSED | PASSED |
| compiled-route-guard and admission | pass | pass |
| hermes `--check` | 71 in sync | 73 in sync |
| skill-doc-frontmatter coverage | 101 docs, 0 violations | 101 docs, 0 violations |
| markdown links | 7874 files, 0 broken | 7894 files, 0 broken |
| playbook package strict | exit 0 | exit 0 |
| snake-case guard | PASS | PASS |
| node-tests runner | exit 1, 93 node:test files skipped | exit 1, 94 skipped (the new test file) |
| trigger-index `--check` | exit 0 | exit 1: 16 stale documents, all new files under `cli-classifier/` |
| advisor vitest | 129 files, 971 passed, 6 skipped | same |
| sk-doc script suite (rename harness skipped) | 25 PASS (the session's figure) | 26 PASS, 0 FAIL |

Notes on the deltas:

- **node-tests runner:** exit 1 is the baseline state, because `.opencode/node_modules` is absent. Row 2 runs the new test file directly.
- **trigger index:** it goes stale by design, because the session rebuilds it from committed content.
- **sk-doc script suite:** 27 test files minus 1 skip is 26. This phase changed no sk-doc script, so the gap from 25 is not from this build. That is inferred, not confirmed.

## 5. validate_document.py

- All 24 new markdown files exit 0 (`proof/8-validate-document.txt`).
- Three files report one `document_type_fallback` warning because the validator auto-detects no type for them:
  - `cli-deem/feature-catalog/feature-catalog.md` gives 0 issues with `--type readme`.
  - `manual-testing-playbook/manual-testing-playbook.md` gives 0 issues with `--type playbook`.
  - `ROUTER.md` gives 0 issues with `--type reference`.
- The cli-jev equivalents show the same warning.

Package gates:

| Gate | Result |
|---|---|
| `validate_catalog_package.py --package cli-classifier/cli-deem --strict` | PASS |
| `validate-playbook-package.cjs --package .../manual-testing-playbook --strict` | PASS, 0 violations |
| `validate-playbook-topology.cjs` | PASS, 3 of 3 valid |

`validate-compiled-routing-scenarios.cjs` fails all 3 scenarios, and it fails the cli-jev hub playbook 3 of 3 the same way. It targets compiled-routing scenario folders, so it does not apply to this hub.

## 6. Deviations

1. **Doc delivery:** each doc travels as a payload that pi copies with `cp`. Executors ran only `grep -c`. I ran `cmp`.
2. **Scaffold:** I ran `init_skill.py` into the session scratchpad, not the tree. I read the canonical parent shape from it and wrote the final content as payloads.
3. **Score shape:** `score` is the zero-based index of Deem's `level`. Probabilities are rekeyed "0".."n" and `expected` passes through. That matches the jev numeric shape. This is a judgment call.
4. **`--hook` names the hook flag.** It sets 500 ms. health uses 2000 ms and the judgments use 60000 ms.
5. **Packet extras:** the packet carries `README.md` and `changelog/`, which spec.md does not list. Parent-skill-check 3d-files requires both.
6. **Compiled-routing directive:** in the hub SKILL.md I replaced its two em dashes with a colon and a period. All four validator markers are intact. This hub is not in the lockstep inventory.
7. **One graph edge (brief 13):** `graph-metadata.json` carries `enhances system-spec-kit` at weight 0.3.
   - Why: the compiler hard-blocks zero-edge skills. `enhances` is the only edge type with no symmetry rule, so no other skill changed.
   - The target is a judgment call. `system-skill-advisor`, the 002 arm, would also fit.
8. **Vocabulary narrowing (brief 14):**
   - The problem: the generic words `choice`, `score`, `noul`, `transport` and `typed judgment` in the SKILL.md keyword comment put this hub at 0.82 on "use jev choice to pick a queue".
   - The fix: every keyword, key topic and domain now names Deem, and I rewrote the trigger examples.
9. **Facts corrected against the Deem source before dispatch:**
   - An oversized body gets HTTP 413.
   - The server also rejects duplicate options.
   - `deem-ctl update --check` can exit 2.
   - `deem-ctl status` prints `stopped`.
10. **Pre-existing graph drift:** `skill-graph.json` at HEAD was already stale in its sk-doc signals. The regenerated file carries that drift. The baseline fresh build shows it, and this build adds only the cli-classifier entries, `families/cli` and `skill_count`.
11. **Trigger index:** I did not regenerate it, although spec.md Files to Change lists it. The orchestrator ruling decided that.

## 7. Premise drift

The Deem source commit is `7cf293f`, not the `6755b30` in the spec. The model commit is still `8cbabbb`. REQ-013 allows "the pair deem-ctl status prints".

## 8. Review fixes

The cross-family reviewer returned FAIL, and the orchestrator confirmed each item. I built the fixes the same way as the rest: single-change briefs through `dispatch.sh`.

After every brief I did three things:
- took a content-hash snapshot of every changed path (`logs/NN-pre.snap` against `logs/NN-post.snap`), because `git status` cannot see edits inside untracked files;
- ran the brief's own checks;
- ran `node --test` myself.

| Fix | Brief | Executor | Check |
|---|---|---|---|
| 1. `choice` refuses a repeated option key with exit 2 (`duplicate option key: K`) before any request | 15 | cursor, 139 s | New test: exit 2 and 0 requests. Only the client and its test changed. `run` needs no change, because it builds no key map |
| 2. Tests for `--hook` and the health timeout | 16 | cursor, 121 s | `--hook` exits 4 at 566 ms with `timed out after 500 ms`. Plain `health` exits 4 at 2048 ms with `timed out after 2000 ms`. Only the test file changed |
| 3. `CLI_DEEM_URL` must be `http:` on `127.0.0.1`, `localhost` or `[::1]`. Anything else exits 2, a malformed URL included | 17 | cursor, 208 s | Two new tests exit 2. Probes: `https://`, `127.0.0.2` and `127.0.0.1@example.com` exit 2 |
| 3a. Correction to 17: a bracketed IPv6 host reached `http.request` and was looked up as a DNS name (`ENOTFOUND`) | 19 | cursor, 80 s | The probe on `http://[::1]:1` now gives `ECONNREFUSED`, exit 4. A new test asserts no `ENOTFOUND` |
| 4. Eight docs synced to the code | 18 | pi, 93 s | `cmp` 8 of 8 SAME. `validate_document.py` exit 0 with 0 issues on each |

The eight docs are:
- packet `SKILL.md` and `README.md`;
- `changelog/v1.0.0.0.md`;
- `references/wire-contract.md`;
- the feature catalog root, `health-check.md` and `choice-selection.md`;
- the hub `README.md`.

Final state after the fixes:

| Check | Result |
|---|---|
| `node --test` | tests 34, pass 34, fail 0 |
| Key grep | 0 matches |
| Imports outside `node:` | 0 |
| `parent-skill-check` | exit 0 |
| `validate_skill_package.py` | exit 0 |
| Catalog package | PASS |
| Markdown links | 0 broken |
| Hermes `--check` | 73 in sync, the `cli-deem` copy regenerated |
| Skill graph `--validate-only` | PASSED |
| `git diff -- .skilled/skills/cli-jev` | 0 lines |

The graph re-export changed only `generated_at`, so I restored the file I had exported earlier. `skill-graph.json` therefore carries only the build's changes.

Recorded follow-ups, not fixed here:
- `score` keeps the level index, while Deem's fractional `expected` passes through separately.
- `run`'s per-question option cap has no test.
- Exit 130 has no test.
- The wording of the `enhances system-spec-kit` graph edge.

## 9. Follow-ups and open items

- **Compiled-route admission for cli-classifier:** it is not in `compiled-route-guard.cjs` HUBS and has no activation manifest.
- **SESSION:**
  - The live `cli-deem health` smoke.
  - The trigger-index rebuild.
  - `validate.sh --strict`.
  - The phase changelog under `../changelog/`.
- **cli-jev's own generic keywords** put cli-jev at 0.82 as second on Deem prompts. That is phase 009's to fix.
- **A three-way tie:** "run a batch of typed questions through deem" ties at 0.82 across cli-classifier, cli-jev and mcp-code-mode.
- **Out of scope:**
  - The `.skilled/changelog/cli-classifier/` link folder.
  - A playbook allowlist entry.
