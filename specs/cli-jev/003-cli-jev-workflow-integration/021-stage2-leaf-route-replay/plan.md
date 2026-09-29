---
title: "Implementation Plan: Phase 21: stage2-leaf-route-replay"
description: "One read-only CommonJS script in sk-create-skill's scripts replays each hub's ROUTER.md keyword block over the committed expected_leaf_resources gold with zero calls, recounts ROUTER.md reads from a transcript directory the operator names and compares the replay with an operator-recorded prose arm. A --jev or --deem choice breaks only the replay's ties, judged under a keep rule fixed in the spec."
trigger_phrases:
  - "leaf route replay plan"
  - "tie-break arm plan"
  - "stage2 replay plan"
  - "router.md replay build"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: stage2-leaf-route-replay

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library, plus sk-create-skill's leaf contract and scenario parser |
| **Framework** | None. The script spawns `jev` and `cli-deem` as binaries, and only behind their switches |
| **Storage** | None. Reads committed routers, manifests and playbooks, and writes only operator-named outputs |
| **Testing** | `node --test`, the convention of `sk-create-skill/scripts/tests/` |

### Overview
`leaf-route-replay.cjs` (proposed) parses each hub's `ROUTER.md` machine block and scores every committed gold scenario with the keyword rules ported from the retired replay. Each row gets the kept intents, the union of their leaves as typed pairs, leaf-set F1 and exact match. The report prints per hub, and `--transcripts` adds a count of `ROUTER.md` reads per week. `--prose` compares the replay with an operator-recorded prose arm and prints the replay verdict. On tied rows only, `--jev` or `--deem` asks one `choice` over the kept intents in three option orders. Each column ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under `spec.md` section 4. Nothing is served.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] Phase 020's build is not running, since both change `sk-create-skill`'s `SKILL.md`, README and changelog
- [ ] The Replay Rule, the Keep Rule and the 0.10 margin in `spec.md` are unchanged since 2026-09-29

### Definition of Done
- [ ] The zero-call replay ran on the real tree, and its per-hub counts and the replay verdict line are in `goal.md`'s log
- [ ] `node --test` on the test file exits 0 with at least 18 passing tests, and sk-create-skill's script suite fails nothing beyond its baseline
- [ ] `validate_document.py` exits 0 on every changed skill doc (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding (parent D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CommonJS script with a MODULE banner, exported pure functions for the tests and a `main()` that only runs as the entry point, the shape of `validate-compiled-routing-scenarios.cjs`.

### Key Components
- **Router parser**: reads `router_state` from the frontmatter and the `INTENT_SIGNALS` weights and keywords and `RESOURCE_MAP` lists from the python block. The shape follows the retired `parseIntentSignals` and `parseResourceMap`, and `root-router-contract.cjs`'s `extractDictBody` does the block extraction.
- **Keyword arm**: `keywordHits`, `scoreIntents` and `selectIntents` ported from the retired replay, with `AMBIGUITY_DELTA = 1`.
- **Leaf conversion**: `dualReadLegacyResource` and `compositeKey` from the leaf contract, with each hub's manifest and aliases.
- **Gold loader**: `walkScenarioFiles` and `parseScenario`, keeping rows with a prompt and a non-empty `leafPairs`.
- **Scorer**: per-row precision, recall, F1 and exact match, with per-hub means.
- **Recount**: a line scan of the operator-named transcript directory for Read calls on `ROUTER.md`, grouped by hub and ISO week, counts and bytes only.
- **Replay verdict**: the Replay Rule over the prose file.
- **Arms**: the Jev and Deem gates, three left rotations, 002's exit handling and `calls.jsonl`.
- **Verdict**: the Keep Rule in order, with integer counts, F1 sums and an exact binomial p.

### Data Flow
Committed routers and gold flow through the keyword arm into per-row leaf sets and scores, then into the per-hub report. The transcript directory flows into read counts only. The prose file flows into the replay verdict. Tied rows flow to each backend three times, the modal pick's leaf set is scored beside the baseline's, and each column prints its verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Build Roles

Parent D5 sets who builds.
- **Orchestrator.** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step. It runs the CLI executors by Bash only and never uses the Agent tool.
- **Executors.** Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro`, at thinking `high`.
- **Review.** The code gets a cross-family review. P0 and P1 findings get fixed, and P2 findings are recorded.
- **Routes.** Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

### First Slice, in Order

1. Record sk-create-skill's `node --test` pass and fail counts as the baseline. Recover the retired replay with `git show b45ea54cea3^:<path>` into a scratch file outside the repository, to read only.
2. Write the router parser and the keyword arm. Check: REQ-002's four cases pass on a synthetic router.
3. Write the leaf conversion, the gold loader and the scorer. Check: on the real tree the loader finds 56 gold rows across six hubs, as counted on 2026-09-29, or the report explains the difference. `cli-classifier` prints `stage1-only`, and both stub logs stay empty.
4. Run the zero-call replay into an operator-named directory and record the per-hub numbers and the tied-row count in `goal.md`'s log.
5. Write the recount. Check: a synthetic transcript with one `ROUTER.md` read prints 1 read, its bytes and its week, and no text.
6. Write the replay verdict. Check: with no `--prose`, the real run prints `replay verdict: stop (prose arm covers 0 of <N> rows)`.
7. Write both gates, the arms and the verdict, tested on synthetic routers with stub backends only.
8. Write the sk-doc docs, then run the cross-family review and the path-scoped commits.

The phase closes after step 8. The prose rows, the operator's transcript recount and any live model run are the operator's, outside this phase's completion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `S=.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`. `STUB` holds logging `jev` and `cli-deem` stubs.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Replay, zero calls | `PATH="$STUB:$PATH" node $S --report $R` | Per-hub gold, unscored, `UNKNOWN`, tied, F1 and exact-match counts, `router reads: not measured`, the replay stop line, exit 0, empty stub logs |
| Recount | `node $S --report $R --transcripts <synthetic dir>` | Read counts and bytes per hub and week, and no text in stdout or the report |
| Replay verdict | `node $S --report $R --prose <synthetic file>` | `replay verdict: keep` or `drop` with `N= P= keyword_f1= prose_f1=` |
| No headroom | test file, 4 improvable tied rows | `no headroom` and no stub call |
| Deem skip | stub `health` reports backend `stub` | `deem arm skipped: stub backend`, the rest byte-identical, exit 0 |
| Jev skip | stub `auth status --provider official` exits 3 | Identity line, then `jev arm skipped: no credential`, exit 0 |
| Switch without out dir | `node $S --deem` | Exit 2 before any output |
| Verdicts | test file, synthetic routers and stub answers | `keep`, `kill`, `stop (margin)` and `stop (coverage)` with K, M, SA, SB, W, L, F and p |
| No key | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S` | Exit 1 |
| Tests | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Exit 0, at least 18 passing |
| Read-only | `git status --porcelain` before and after each run | Identical, apart from operator-named outputs |
| Skill docs | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc>` | Exit 0 on each changed doc |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The leaf contract and the scenario parser, both read only. The retired replay's source through `git show`, read only. Phase 008 for `cli-deem`. The operator's prose rows for the replay verdict. The served Deem or a Jev credential for a model run. No package is installed. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel, but this build runs before or after phase 020's, never beside it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's path-scoped commits: the script, its test, the two README rows and the sk-doc docs. Then regenerate the Hermes copy, the sk-doc leaf manifest pair and the trigger index. Delete operator-named outputs inside the repository. No router, map, manifest or playbook changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
