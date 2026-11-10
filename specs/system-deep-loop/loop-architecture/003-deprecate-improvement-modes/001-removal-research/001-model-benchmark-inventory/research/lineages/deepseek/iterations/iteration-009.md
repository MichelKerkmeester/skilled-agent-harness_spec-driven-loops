# Iteration 9: Indirect wiring (runtime schemas, gateway, compiled routing, fixtures)

## Focus

The indirect surfaces: append gateway mode registration, runtime schema/reducer/sealed-artifact packages, authority-flip and write-set-conflict-graph declarations, blinded-adjudication mode adapters, shared deep-improvement-common packages, runtime unit tests, system-spec-kit retrieval fixtures and reference docs, and a recheck of all compiled-routing stages.

## Actions Taken

- Read the gateway mode branch and the runtime lib match sites with exact lines; counted files in the three model-benchmark schema packages.
- Ran a `--no-ignore` sweep over every compiled-routing stage to confirm where the mode is anchored.
- Swept system-spec-kit references, retrieval fixtures, the anchor-repair fixtures, and the runtime unit tests; verified whether test fixtures are inputs or generated artifacts.

## Findings

1. `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:97` normalizes the mode name and `:143-146` dynamically imports the model-benchmark ledger schema for that mode. **EDIT** — remove the mode branch [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:143-146]
2. `legacy-projections/legacy-projection-manifest.ts` declares three mode surfaces: improvement-config manifests (mixed path including `model-benchmark-config.json`, `:147-148`), `model-benchmark-hub-output` (`:170-172`), and `model-grader-cache` (`:186-189`). **EDIT** all three [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:170-172]
3. `per-mode-authority-flip/types.ts:26,135` lists `model-benchmark` in the authority-mode union and mode array. **EDIT** [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:135]
4. `write-set-conflict-graph/types.ts:17` declares stage `006-model-benchmark`; `shipped-census.ts:118-121` binds the model runner/cache paths and `:471-500` declares the full 006 resource set (runner, cache, outputs). **EDIT** — remove the 006 declaration and its bindings [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:471-500]
5. `blinded-adjudication/contracts.ts:17,58`, `mode-adapters.ts:100-104,163-165,181-190`, and `event-registry.ts:123` define the MODEL_BENCHMARK decision kind, its required counterfactuals, adapters, and registry row. **EDIT** — remove the kind and adapters [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts:163-165]
6. Three runtime packages are mode-exclusive: `runtime/lib/model-benchmark-ledger-schema` (4 files), `model-benchmark-reducers` (5 files), `model-benchmark-sealed-artifacts` (5 files). **DELETE** the packages [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/index.ts]
7. The `deep-improvement-common-*` packages (ledger schema, reducers, sealed artifacts) are shared with agent-improvement; they carry mode lists/rows. **EDIT** — remove the model-benchmark rows, keep Lane A [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts]
8. Runtime unit tests: `model-benchmark-ledger-schema.vitest.ts`, `model-benchmark-reducers.vitest.ts`, `model-benchmark-sealed-artifacts.vitest.ts` are mode-exclusive — **DELETE**; `verify-authority-cli.vitest.ts:37,169,173`, `host-driven-improvement.vitest.ts:46`, plus `agent-improvement-reducers`, `blinded-adjudication`, `deep-improvement-common-ledger-schema`, `fanout-merge`, `write-set-conflict-graph` vitests carry mode arms or fixtures — **EDIT**; `tests/unit/README.md:92-94` rows — **EDIT** [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/verify-authority-cli.vitest.ts:37]
9. `system-spec-kit/references/structure/folder-structure.md:239,243` documents the improvement folder and its writers as `/deep:agent-improvement` and `/deep:model-benchmark`. **EDIT** [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:239]
10. `system-spec-kit/runtime/ENV-REFERENCE.md:439-440` documents the two JEV features in model-benchmark terms. **EDIT** the descriptions, keep the variables [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:439-440]
11. Retrieval fixtures carry the mode: `phrase-variants.json` rows at 35757, 51396, 52044, 54759, 63679-63683 and more; `semantic-probes.json:1134` probes `mixed-executor-methodology.md`; `generation-diagnostics.json` lists dozens of now-deleted paths (playbook pages, scorer cache, MODES/SWEEP). **EDIT/regenerate** all three; `corpus-manifest.json` also matched the master sweep and its exact lines are re-captured in iteration 10 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:63679-63683]
12. `system-spec-kit/runtime/tests/continuity-freshness.vitest.ts:21` pins `reviewer-stale-verdict.json` from the deleted fixture set. **EDIT** — replace or drop the reference [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts:21]
13. The three `anchor-repair-sample/*.md` spec fixtures contain historical model-benchmark references (finding tables, file tables from 036-era specs). They are parser-test inputs. **KEEP-AS-HISTORY** — do not edit; changing them would change the anchor-repair test corpus [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/specs_system-deep-loop_036-deep-loop-innovation_006-runtime-docs-and-integrity-hardening_007-improvement-promotion-authority_spec.md:136]
14. Compiled-routing recheck: a `--no-ignore` sweep across all stages (003-014) confirms the mode is anchored only in `009-parent-hub-rollout/002-system-deep-loop` (registry compiler + canary fixtures, iteration 6 set). No other stage references it [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:32-33]

## Ruled Out

- Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations.
- Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion.
- Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep.

## Dead Ends

- `mode-contracts` under runtime/lib: no mode string present (per master sweep absence).

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: `corpus-manifest.json` exact lines deferred one iteration (flagged).
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts
- .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts
- .skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/{types,shipped-census}.ts
- .skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/{contracts,mode-adapters,event-registry}.ts
- .skilled/skills/system-deep-loop/runtime/tests/unit/verify-authority-cli.vitest.ts
- .skilled/skills/system-spec-kit/references/structure/folder-structure.md
- .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json
- .skilled/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts
- .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ5
- Questions answered: KQ5

## Reflection

- What worked and why: the `--no-ignore` compiled-routing sweep closed the loop on iteration 6 cleanly; separating mode-exclusive packages from shared ones (deep-improvement-common) kept the delete set precise.
- What did not work and why: nothing material.
- What I would do differently: nothing; one fixture line capture knowingly deferred to the gap sweep.

## Recommended Next Focus

Iteration 10: validators, doctor checks, and the closing gap sweep — doctor commands (`.skilled/commands/doctor/**`), validator scripts and tests referencing the mode, `system-spec-kit` corpus-manifest line capture, false-positive re-scan of the full master list with the strict pattern, trigger-index entry verification, and consolidation of the complete classification ledger.
