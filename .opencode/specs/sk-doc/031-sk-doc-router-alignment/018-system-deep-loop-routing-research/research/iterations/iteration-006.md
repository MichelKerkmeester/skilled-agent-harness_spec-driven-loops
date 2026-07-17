# Iteration 6: Implementation Verification Matrix

## Focus

Convert iteration 5's dependency chain into an implementation-handoff matrix with exact source and test targets, runnable commands, count gates, fallback assertions, and before/after report evidence. Loader-ineligible files remain untouched. Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-006.md:1-25]

## Actions Taken

1. Read the rendered iteration prompt, config, state log, and strategy before selecting the focus.
2. Re-read iteration 5's dependency plan and its unresolved first-slice question.
3. Traced the deterministic Lane-C test entrypoint, benchmark CLI, report emission path, and structural exit gates.
4. Converted the evidence into a dependency-ordered verification matrix without modifying researched files.

## Findings

1. **The implementation handoff has five independently testable gates, and benchmark comparison belongs last.**

   | Gate | Source targets | Exact verification command | Acceptance evidence |
   |---|---|---|---|
   | 0. Frozen before capture | `benchmark/baseline/skill-benchmark-report.json`; current hub/playbook/registry | `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill .opencode/skills/system-deep-loop --outputs-dir /tmp/dlw-bench-before --trace-mode router --output /tmp/dlw-bench-before/skill-benchmark-report.json` | Preserve the committed baseline; retain `/tmp/dlw-bench-before` as the same-corpus before report. D5 must not return exit 3. |
   | 1. Index addressing | `manual_testing_playbook/manual_testing_playbook.md`; `deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | `node -e "const path=require('path');const {loadPlaybookScenarios}=require('./.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs');const r=loadPlaybookScenarios({skillRoot:path.resolve('.opencode/skills/system-deep-loop')});const browser=r.scenarios.filter(s=>s.classKind==='browser').length;console.log(JSON.stringify({total:r.scenarios.length,routing:r.scenarios.length-browser,browser,warnings:r.warnings},null,2));"` | After repair: 39 normalized rows = 35 routing + 4 browser, with no unreadable-index warnings. |
   | 2. Manifest | `mode-registry.json`; generated `leaf-manifest.json`; `sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`; `leaf-resource-contract.cjs` | `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs .opencode/skills/system-deep-loop && node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs .opencode/skills/system-deep-loop --check` | Byte-stable regeneration, seven workflow-mode identities retained, zero duplicate composite pairs, and every leaf ID remains child-local under `references/` or `assets/`. |
   | 3. Typed router + safety | `SKILL.md`; `mode-registry.json`; hub resource router; Lane-C router tests | `(cd .opencode/skills/system-deep-loop/deep-improvement/scripts && npx vitest run skill-benchmark/tests)` | Three suites pass; typed positive cases pass; explicit-hint precedence and all fail-closed assertions below remain green. |
   | 4. After capture | same target and trace mode as gate 0 | `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill .opencode/skills/system-deep-loop --outputs-dir /tmp/dlw-bench-after --trace-mode router --output /tmp/dlw-bench-after/skill-benchmark-report.json` | D5 passes; zero oracle-fault exclusions; typed rows are nonzero; compare only against gate 0 using the same corpus and trace mode. |

   The test suite is deterministic, uses real in-repo routing targets, writes only to temporary directories, and documents the exact `npx vitest run skill-benchmark/tests` entrypoint. The benchmark CLI runs D5 first and emits both JSON and Markdown reports. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:17-24,28-57] [SOURCE: .opencode/skills/system-deep-loop/benchmark/README.md:55-65] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:185-255]

2. **The count gate must preserve a known before-source contradiction instead of silently normalizing it.** Iteration 4's loader-semantic census found 21 currently normalized rows, while the frozen README/report narrative says 20 total with 16 text-scorable and four browser rows. Repairing the 18 unreadable authored index rows adds 14 routing and four browser rows, yielding the implementation target of 39 total, 35 routing, and four browser rows; this is an inference from the two independently established partitions and must be checked by the loader command above. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-state.jsonl:11-13] [SOURCE: .opencode/skills/system-deep-loop/benchmark/README.md:27-42] [INFERENCE: 21 existing normalized rows + the repaired authored partition of 14 routing and 4 browser rows described in .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:21]

3. **Typed-row acceptance has an exact baseline and bounded first-slice rule, but not an evidence-backed fixed first-slice count yet.** The before report has zero typed gold. The first implementation slice must produce `K > 0` typed routing rows, with `K` exactly equal to the scenario-intent-reviewed subset of the 35 eligible routing rows and zero invalid/stale oracle exclusions. Setting `K = 35` merely from filenames would violate the authored-gold boundary; the exact scenario IDs remain an explicit corpus-authoring decision. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:21-27,33-36] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-strategy.md:112-120,176-179]

4. **The safety regression block needs five named assertions, not a generic “fallback still works” check.** Tests must prove: (a) an explicit valid mode hint wins competing inferred intent; (b) ambiguous/low-confidence input returns `UNKNOWN_FALLBACK`; (c) a missing registry mode returns fallback rather than a guessed packet; (d) a missing resource path fails closed; and (e) containment rejects any path escaping the selected packet. The new positive assertion must additionally prove that three public improvement modes sharing one packet remain distinguishable by the already-resolved `workflowMode`, never by packet name or declaration order. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:48-70,106] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:23-27]

5. **The before/after evidence bundle should record stable machine fields plus typed-path diagnostics.** Preserve `verdict`, `aggregateScore`, `topologyDigest`, `parseWarnings`, D5 connectivity/registry results, scenario count, and the rendered D1-intra/D2/D3 values from each report. Add derived counts for typed-gold-present, typed-gold-valid, typed-pair-hit, and oracle-fault-excluded rows; accept score movement only when the before/after corpus and trace mode are identical. The orchestrator explicitly snapshots the manifest digest, aborts if topology changes during a run, writes JSON before rendering Markdown, and uses exit 3 for structural or registry blockage. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-76,193-255] [SOURCE: .opencode/skills/system-deep-loop/benchmark/README.md:38-42,55-65]

## Ruled Out

- Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority.
- Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review.
- Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count.
- Removing or weakening fallback branches to make typed recall appear higher.

## Dead Ends

- Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried.

## Edge Cases

- Ambiguous input: the phrase “expected typed-row counts” could mean normalized corpus count or first-slice typed-gold count; the matrix separates the exact 39/35/4 corpus gate from the authored `K > 0` typed-gold gate.
- Contradictory evidence: the frozen README says 20 corpus rows, while the loader-semantic census says 21 currently normalized rows. Both are preserved; the gate uses fresh loader output and records the delta.
- Missing dependencies: no memory/code-graph accelerator was available; exact local sources and prior packet evidence were used.
- Partial success: none for the matrix focus. The exact first-slice scenario IDs remain an authored implementation decision and were not fabricated.

## SCOPE VIOLATIONS

None. All source changes and test additions are handoff targets only; no researched source, reducer-owned file, or loader-ineligible artifact was modified.

## Sources Consulted

- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-006.md:1-88`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-005.md:17-86`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-strategy.md:60-179`
- `.opencode/skills/system-deep-loop/SKILL.md:48-70,106`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:17-57`
- `.opencode/skills/system-deep-loop/benchmark/README.md:27-65`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-76,185-255`

## Assessment

- New information ratio: 0.90
- Novelty calculation: 3 of 5 findings were fully new and 2 partially new (`(3 + 0.5×2) / 5 = 0.80`), plus a 0.10 simplicity bonus for converting the dependency chain into one executable acceptance matrix.
- Questions addressed: exact implementation verification targets, commands, count gates, fallback assertions, and before/after evidence.
- Questions answered: the verification matrix is implementation-ready; the authored first-slice scenario IDs remain deliberately unresolved.

## Reflection

- What worked and why: joining the documented test entrypoint to the benchmark's actual run order and emitted fields produced gates that distinguish structural, oracle, routing, and scoring failures.
- What did not work and why: the frozen benchmark README cannot be used as a current corpus-count oracle because it conflicts with the loader-semantic census.
- What I would do differently: inspect scenario intent in the next pass to name the smallest mode-complete typed-gold slice rather than choosing rows by filename.

## Questions Answered

- What exact verification matrix should govern implementation of the dependency-ordered routing plan?

## Questions Remaining

- Which exact scenario IDs form the smallest mode-complete first typed-gold slice among the 35 routing candidates?
- Should any loader-ineligible file be deliberately promoted through authored corpus governance? No promotion can be inferred here.

## Next Focus

Inspect only the 35 loader-eligible routing scenarios' authored intent and identify the smallest mode-complete first typed-gold slice, while continuing to exclude all loader-ineligible files.
