---
title: "Research: cli-classifier quality audit"
description: "Merged synthesis of two five-iteration lineages, DeepSeek V4.1 Flash max on cli-devin and GPT-6 Luna max fast on cli-codex, auditing the shipped cli-classifier work on seven axes. Eleven distinct findings, one P1 and ten P2, all confirmed against the repository by the orchestrator."
importance_tier: important
contextType: research
---

# Research: cli-classifier quality audit

## 1. Executive Summary

The shipped cli-classifier work is in good shape. No P0 was found and no functional bug touches a live caller. The advisor reaches the hub through every layer it should, the tests are hermetic and the Jev-missing path refuses cleanly.

Eleven distinct findings remain, one P1 and ten P2. The orchestrator opened every cited location and confirmed all eleven.

- **P1:** five cli-jev packet docs fail the repository's own blocking doc validator for a missing Overview section.
- **P2, the two that change what a reader believes:**
  - The hub `SKILL.md` describes the transport default backwards.
  - One caller (`score-clarify-default.cjs`) records every call as `backend: 'jev'` with no `transport` field, while the catalog says the scorers record the answering route.
- **P2, the rest:**
  - two edge cases in the shared transport
  - four stale counts, dates and descriptions
  - one install-prerequisite gap for external users
  - one approved advisor divergence

## 2. Methodology

- **Run:** `fanout-run.cjs` ran two independent lineages concurrently under `stopPolicy: max-iterations`, five iterations each.
  - `deepseek-v4-1-flash-max` (cli-devin) took 17.7 minutes.
  - `luna-max-fast` (cli-codex, `gpt-6-luna`, reasoning max, service tier fast) took 50.8 minutes.
- **Outcome:** both exited 0 with no retries, timeouts, salvage or containment advisory (`orchestration-summary.json`).
- **Merge:** `fanout-merge.cjs` merged the two registries and `reduce-state.cjs --fanout-resource-map-only` wrote `resource-map.md` from ten delta files.
- **Methods differed:**
  - The DeepSeek lineage ran tools. It ran `validate_document.py` over all 79 hub Markdown docs, the four hub test suites (153 cases, all green), `node --check` on the nine hub scripts, the compiled route and `parent-skill-check.cjs`. It redirected `TMPDIR` into its lineage and checked `git status` after each batch.
  - The Luna lineage stayed fully static. It ran no test or validator and traced branches by reading.
- **Orchestrator check:** every finding below was confirmed by opening its cited lines, or by rerunning the command, after the run settled.

## 3. Ranked Findings

| ID | Sev | Axis | Finding | Evidence | Found by | Orchestrator check |
|---|---|---|---|---|---|---|
| CQ-01 | P1 | 1 sk-doc | Five cli-jev packet docs fail the blocking doc validator: `missing_required_section: overview` | `cli-jev/references/cli-reference.md`, `integration-patterns.md`, `mcp-server.md`, `providers-and-models.md`, `cli-jev/assets/question-shaping-card.md`. `cli-reference.md:25` opens at `## 1. INVOCATION` | DeepSeek | Reran `validate_document.py` on `cli-reference.md` and `question-shaping-card.md`. Both print the blocking error |
| CQ-02 | P2 | 5 docs | Hub `SKILL.md` says the Pi route is opt-in for `choice` with the `jev` CLI as default. The code tries Pi first when nothing is selected, for `choice` and `noul` | `cli-classifier/SKILL.md:114`, `.hermes/skills/cli-classifier/SKILL.md:119` vs `shared/scripts/jev-transport.mjs:4,69` (`requested` unset returns `auto`) | Both | Confirmed. `shared/scripts/README.md` already states the code's behavior |
| CQ-03 | P2 | 7 drift | `score-clarify-default.cjs` writes `backend: 'jev'` and no `transport` field, though it calls the transport without pinning a route, so a Pi answer is recorded as Jev. The catalog says the scorers record `transport` | `score-clarify-default.cjs:1267,1271,1315,1368` vs `feature-catalog/feature-catalog.md:63`, `feature-catalog/measurements/pi-transport-integration.md:90-91` | Both | Confirmed. `cite-drift-scan.mjs:1239,1286` shows the pattern the other callers follow |
| CQ-04 | P2 | 6 bugs | `choiceRequestFrom` accepts a `choice` with options but no `-q`, leaving `question: ''`, so a call the CLI would reject can be answered by Pi | `shared/scripts/jev-transport.mjs:91,126-127` vs `cli-jev/references/cli-reference.md:40-48` | Luna | Confirmed in code. Every live caller passes `-q`, so no recorded run is affected |
| CQ-05 | P2 | 6 bugs | `spawnClassifierCall` documents `env` as optional but substitutes `{}`, so Pi discovery sees no `PATH` and silently falls back to the CLI | `shared/scripts/jev-transport.mjs:507,511`, `which()` at `:291-292` | Luna | Confirmed in code. Every live caller passes `env`, so no recorded run is affected |
| CQ-06 | P2 | 5 docs | `shared/README.md` says the hub ships no shared helpers. `shared/scripts/` holds the transport and scorer-report modules | `shared/README.md:8-9` vs `shared/scripts/README.md:16-30` | Luna | Confirmed |
| CQ-07 | P2 | 1 sk-doc | `shared/README.md` has a subdirectory but no directory tree, which the code-folder README template marks mandatory | `sk-create-readme/assets/readme-code-template.md:52`, `shared/README.md` | Luna | Confirmed against the template. `validate_document.py` does not enforce this row and reports the file VALID |
| CQ-08 | P2 | 5 docs | Pi-transport tests README claims 41 cases. The suite has 46 | `benchmark/pi-transport/tests/README.md:26` | DeepSeek | Confirmed: 46 `test(` declarations |
| CQ-09 | P2 | 7 drift | Hub changelog stops at `v0.7.0.0`, and `description.json` and `graph-metadata.json` date to 2026-10-02. The injection-screen and Pi benchmark changes of 2026-10-03 and 2026-10-04 have no changelog entry | `changelog/`, `description.json:25`, `graph-metadata.json:111`, commits `e7377cb414` and `7f5aaf47f2` | DeepSeek | Confirmed |
| CQ-10 | P2 | 4 UX | The `uv tool install jev-cli` prerequisite appears only in the cli-jev README's provenance section, not in the hub README or SKILL where an external user starts | `cli-jev/README.md:127` vs `cli-classifier/README.md:39`, `SKILL.md:139` | DeepSeek | Confirmed |
| CQ-11 | P2 | 3 advisor | An approved parity divergence routes "Score this task brief for ambiguity…" (gold `sk-prompt`) to `cli-classifier` on the native advisor | `system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:753-761` | DeepSeek | Confirmed. It is an approved current-state capture, not a regression, but it is a live misroute the word "score" pulls toward the hub |
| CQ-12 | P2 | 5 docs | A 049 packet summary gives the reworded-arm review band as 0.25 to 0.75. The code asks the review question at 0.25 up to the 0.60 flag line | `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/004-injection-screen-improvements/implementation-summary.md:56` vs `score-injection-screen.mjs:66,1387` | DeepSeek | Confirmed. This is a spec-packet record, and the hub README states the band correctly |

CQ-06 and CQ-07 sit in the same file and are counted as one fix. That is why the summary says eleven.

## 4. Per-Axis Coverage

1. **sk-doc compliance:**
   - CQ-01 is the one blocking failure.
   - DeepSeek's validator run found everything else at 0 issues: the hub SKILL and README, ROUTER, 13 changelog entries, both feature catalogs, both playbook indexes, 22 playbook scenarios, six measurement docs and the benchmark and shared READMEs.
   - Sibling skills' references pass, so CQ-01 is local to this hub.
   - CQ-07 is a template row the validator does not check.
2. **sk-code-opencode compliance:**
   - All nine hub scripts pass `node --check`.
   - Module headers follow the JavaScript style guide. The three `.cjs` callers use the older box header, which the guide grandfathers.
   - No style finding was raised.
3. **Advisor integration:**
   - The chain holds at every layer:
     - graph metadata and the committed skill graph
     - the compiled front door, whose policy hash matches the activation manifest
     - `parent-skill-check` invariants
     - the dispatch hook mapping `jev` commands to `cli-classifier/cli-jev`
   - CQ-11 is the one routing oddity.
   - The labeled and holdout advisor corpora have no Jev prompts, so recall for natural Jev requests is unmeasured.
4. **UX:**
   - The operator flow is complete. Zero-call defaults, gated live flags, dated output folders and stop conditions are all documented.
   - The external-user refusal is correct, and CQ-10 is the gap.
5. **Documentation accuracy:** CQ-02, CQ-06, CQ-08 and CQ-12.
6. **Bugs:**
   - CQ-04 and CQ-05 are edge cases that no live caller reaches.
   - DeepSeek's execution of 153 cases found no failure.
   - Luna's static read of `scorer-report.mjs` found the probability selection, abstention, margin, bootstrap and empty-sample paths consistent.
7. **Drift and visible measurements:**
   - CQ-03 and CQ-09.
   - The `.claude` skill tree is byte-identical to `.skilled`, and the Hermes copy matches the current hub text (so it carries CQ-02 too).
   - The Pi-transport comparison is visible in `feature-catalog/measurements/pi-transport-integration.md:103-106`.
   - The benchmark report index at `benchmark/reports/README.md:23-36` does not list it.
   - No checked-in report holds the injection screen's latest live verdict. It lives only in the 049 packet summary.

## 5. Where the Lineages Differed

- **Bugs.** Luna found CQ-04 and CQ-05 by tracing branches. DeepSeek ran the suites, saw them green and reported no functional bug. Both are right: the suites pass because neither edge case has a test.
- **sk-doc.** DeepSeek ran the validator and found CQ-01. Luna applied template rows by hand and found CQ-07, which the validator does not enforce. Neither found the other's issue.
- **Shared findings.** Both lineages found CQ-02 and CQ-03 independently, with matching line citations.

## 6. Eliminated Alternatives

| Candidate | Why it is not a finding | Source |
|---|---|---|
| README or SKILL frontmatter version lagging the hub version | A repository-wide convention, and the validator passes it | DeepSeek iteration 1 |
| `cli-deem` mentions | Historical changelog records only | DeepSeek |
| Benchmark report validation failures | Sibling skills fail the same way, because the doc type has no template | DeepSeek |
| `.cjs` box headers | The style guide grandfathers them | DeepSeek |
| Missing `'use strict'` in `.mjs` | ES module semantics, and the alignment verifier skips them by design | DeepSeek |
| Older reports quoting `--hub cli-jev` | Dated records under a stay-as-written convention, and the migration is in `changelog/v0.4.0.0.md:26` | DeepSeek |
| `pinRowSet` spreading `extras` over computed fields | No caller passes a reserved key | DeepSeek |

## Divergence Map

No divergent pivots ran (convergence mode `default`). Neither lineage recorded a saturated direction.

The remaining frontier is:
- runtime tests for CQ-04 and CQ-05
- a measured advisor recall for natural Jev prompts
- a current injection-screen report checked into `benchmark/reports/`

## 7. Open Questions

- Should the injection-screen and Pi benchmark changes ship as hub `v0.8.0.0` (CQ-09)? That is a release call for the operator.
- Should the hub README carry the install line, or point at the cli-jev README (CQ-10)? Either closes the gap.
- Should CQ-11 be fixed in the advisor's vocabulary, or stay an approved divergence? It needs a routing decision in system-skill-advisor, outside this hub.

## 8. Recommended Follow-Up

One small fix packet covers every finding. In priority order:

1. Add an Overview section to the five cli-jev docs (CQ-01).
2. Correct the transport sentence in the hub SKILL and resync Hermes (CQ-02).
3. Make `score-clarify-default.cjs` record `transport: result.transport` and stop hardcoding `backend: 'jev'`, with a test asserting the field (CQ-03).
4. Reject a `choice` with no question, and default `env` to `process.env`, each with one test (CQ-04, CQ-05).
5. Rewrite `shared/README.md` with a tree and the real inventory (CQ-06, CQ-07).
6. Fix the 41-case count (CQ-08) and the 0.75 band (CQ-12).
7. Add a `v0.8.0.0` changelog with metadata dates (CQ-09).
8. Surface the install line (CQ-10).

CQ-11 goes to the advisor's owner.

## 9. Convergence Report

- Stop reason: maxIterationsReached, for both lineages
- Total iterations: 10 (5 + 5)
- Questions answered: DeepSeek 5 of 5, Luna 3 of 5 (Luna left runtime evidence and exhaustive per-doc review open)
- Last 3 iteration summaries:
  - DeepSeek: run 3 code and bugs (0.5), run 4 advisor and UX (0.6), run 5 drift (0.5)
  - Luna: run 3 advisor (0.22), run 4 UX (0.30), run 5 callers (1.00)
- Convergence threshold: 0.05, telemetry only under `stopPolicy: max-iterations`
- Divergence summary: no divergent pivots recorded

## 10. References

- Lineage syntheses:
  - `lineages/deepseek-v4-1-flash-max/research.md`
  - `lineages/luna-max-fast/research.md`
- Iterations: `lineages/*/iterations/iteration-001.md` to `iteration-005.md`, and deltas under `lineages/*/deltas/`
- Run records: `orchestration-summary.json`, `fanout-attribution.md`, `findings-registry.json`, `resource-map.md`
- Standards: `sk-doc/shared/scripts/validate_document.py`, `sk-create-readme/assets/readme-code-template.md`, `sk-code/sk-code-opencode/references/javascript/style-guide.md`
