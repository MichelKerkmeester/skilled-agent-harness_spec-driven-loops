# Review report

No. The six-family ownership model is mostly sound, and the evaluator/scorer/runtime boundary is correctly drawn, but `sk-doc/create-benchmark` is not yet a complete authoring home. Four authored-input gaps are confirmed: live behavior-contract variants, Lane C’s actual corpus workflow, the command-benchmark matrix/composite route, and Lane B’s reviewer profile.

Unless explicitly marked inferred, every finding below is confirmed from opened files. All paths are repo-relative.

## Per-family verdicts

| Family/type | Exists in system-deep-loop / repo | create-benchmark coverage | Verdict | Evidence |
|---|---|---|---|---|
| MCP promotion | `system-spec-kit/mcp_server/benchmarks/` | Ten-section report and `SOURCE.md` templates; §§3–8 | **STALE** | The home requires `README.md`, report, results and `SOURCE.md` (`create-benchmark/SKILL.md:149-178`), but supplies no benchmark-index scaffold. Its report template links the index label `../README.md` to the wrong `../../README.md` target (`assets/shared/benchmark_report_template.md:314-327`). The live index includes HOLD/UNREPORTED runs and claims every folder has report/SOURCE (`system-spec-kit/mcp_server/benchmarks/README.md:42-70`), while several folders lack those files and only three reports follow all ten sections. |
| Behavior benchmark — all five mode packages | `shared/behavior-benchmark/`; ACB, DAB, IMB, RSB, RVB packages | Index, scenario and baseline templates plus guide; §9 | **GAP** | The framework fixes five packages (`framework.md:321-347`) and supports `task_dispatch`, `seat_artifacts`, `candidate_evidence`, and v2 `direct_dispatch` (`framework.md:249-266`). The template JSON only exposes task-dispatch-era fields (`behavior_benchmark_scenario_template.md:48-75`); it merely mentions `seat_artifacts` in a comment. ACB and IMB require `seat_artifacts`/`candidate_evidence` (`ACB-001...md:3-19`; `IMB-001...md:3-19`). DAB-012..027 require schema v2, topology, postconditions, boundary and target arrays (`DAB-012...md:3-55`; `DAB-014...md:3-58`). The index template also promises `schemaVersion: 1` unconditionally (`behavior_benchmark_index_template.md:97-107`). |
| Conformance benchmark | `deep-alignment/assets/conformance_benchmark/command-surface/` | README, contract, lane-config and manifest templates plus guide; §12 | **STALE** | The template boundary is correct: no adapter, oracle implementation, scorer, reducer or report (`conformance_benchmark_contract_template.md:170-184`; guide `:187-202`). The live stable-package contract requires README, contract and local public/held-out fixture trees (`066.../000-command-benchmark-contract/contract-layout.md:18-45`), but the live package currently contains only `lane-config.json` and `fixtures/fixture-manifest.json`, whose corpus points back into the spec packet (`fixture-manifest.json:1-23`). The guide still calls the now-live command adapter “planned” (`conformance_benchmark_authoring_guide.md:204-232`). |
| Command-surface benchmark composite | `deep-alignment/assets/command_benchmark/`, scheduler, DAB-012..027, `/deep:command-benchmark` | Two worked mappings inside behavior and conformance guides; no family/router entry or template | **GAP** | The launcher correctly composes conformance then behavior and preserves separate, non-averaged results (`commands/deep/command-benchmark.md:42-88`; auto YAML `:22-65`). But its matrix is a stable authored JSON input with a real schema (`command_benchmark_matrix.json:1-50`) enforced by the scheduler (`run-command-behavior-matrix.cjs:148-178`). It is absent from the six-family table/router (`create-benchmark/SKILL.md:92-140`) and has no template or composition guide. |
| Lane B model benchmark | `deep-improvement/assets/model_benchmark/{benchmark-fixtures,benchmark-profiles}/`, references, scripts, `/deep:model-benchmark` | Three fixture shapes and standard profile scaffold; §11 | **GAP** | Code-task, pattern and reviewer fixtures are covered (`create-benchmark/SKILL.md:479-503`). However, the live hand-authored `reviewer_regression.json` profile uses `mode: reviewer` and selects four reviewer fixtures (`benchmark-profiles/reviewer_regression.json:1-24`), and the deep command explicitly routes `--scorer reviewer` (`deep_model-benchmark_auto.yaml:37-64,165-171`). The home tells authors not to use its profile scaffold for that live input (`model_benchmark_fixture_guide.md:197-207,232-244`). Reviewer scorer/schema code should remain lane-local; the profile is authored data and is missing coverage. |
| Lane C skill benchmark — current playbook corpus and storage | `deep-improvement/assets/skill_benchmark/`, references/scripts; skill-local `benchmark/` trees | Storage guide and `benchmark/README.md` template only; §10 | **GAP** | The storage/report-renderer boundary is correct (`create-benchmark/SKILL.md:408-459`). But the current harness benchmarks the target’s authored `manual_testing_playbook` (`scripts/skill-benchmark/README.md:17-25,102-114`). Its loader requires `id`, `expected_intent`, `expected_resources`, stage and an exact prompt (`load-playbook-scenarios.cjs:295-350`), while the generic playbook snippet template supplies only `stage` among those frontmatter fields (`create-manual-testing-playbook/...snippet_template.md:45-53`). Create-benchmark neither routes authors to that creator nor supplies the Lane C overlay. |
| Lane C legacy public/private fixtures | `deep-improvement/assets/skill_benchmark/fixtures/` | No template or route | **GAP** | The path is superseded but still supported through explicit `--fixtures-dir` (`assets/skill_benchmark/README.md:18-24,48-60`). Its public/private schema and anti-circularity tiers remain authored contracts (`references/skill_benchmark/scenario_authoring.md:16-56`). Create-benchmark only offers the storage README template. This is a lower-severity gap because the playbook is now the default corpus. |
| Lane A agent improvement | `deep-improvement/assets/agent_improvement/`, references and `/deep:agent-improvement` | Guide only; no copied assets | **MIS-INTEGRATED** | Guide-only ownership is correct: the guide covers authored copies and points scoring/config/promotion back to the lane (`agent_improvement_authoring_guide.md:17-53,112-164`); the lane confirms its source templates/config remain in place (`assets/agent_improvement/README.md:43-50`). The only material defect is its `/deep:agent-improvement` label linking to `deep-improvement/SKILL.md`, not the command (`agent_improvement_authoring_guide.md:28-36`). |
| Wider runtime performance/calibration benchmarks | `system-skill-advisor/mcp_server/bench/`; `system-spec-kit/scripts/evals/` and stress suites | Intentionally none | **COMPLETE** | These suites import runtime modules and own executable latency, calibration, ablation and stress logic (`system-skill-advisor/.../bench/README.md:16-24,59-65`; `system-spec-kit/scripts/evals/README.md:17-25,59-71,105-112`). They are code-coupled evaluators, not missing documentation templates. Keeping them out is the correct boundary. |
| Vision capability/design-audit report | `sk-prompt/prompt-models/references/vision-audit-benchmark.md` | None | **COMPLETE** — not yet a reusable family | **Inferred:** the file records one image-transport/capability audit and recommendation (`:14-34,53-78`), but no reusable fixture/profile/runtime contract exists. One report is insufficient evidence for a seventh family. It should be classified as a one-off or future multimodal Lane B subtype, not templated yet. |

The wider production-tree scan found no additional reusable family: skill-root `benchmark/` directories contain Lane C reports, `sk-prompt/prompt-models/benchmarks/` contains Lane B outputs, and MCP dated folders are promotion records. Spec-local benchmark directories are evidence/work packets, not stable authoring families.

## Missing coverage

1. **Behavior variants.** The scenario scaffold cannot author three shapes that are already live: `seat_artifacts`, `candidate_evidence`, and schema-v2 command behavior. This is operational: absent `artifacts_required: false`, the runner defaults artifact debt from `min_task_events` (`behavior-bench-run.cjs:521-537`), and RVB-005 is consequently recorded as `missing_artifact` in its baseline.

2. **Command-benchmark composition.** It should be first-class for discoverability, but not a seventh scoring owner. Add a composite route that loads behavior plus conformance resources and a matrix-manifest template; leave the scheduler, launcher, scorecard and both scoring systems in their current lanes.

3. **Lane C’s current corpus workflow.** A new benchmark author needs `create-manual-testing-playbook` plus benchmark-specific frontmatter. That handoff is undocumented, and the generic snippet is not benchmark-ready.

4. **Lane B reviewer profile.** Reviewer fixtures are covered, but the supported profile that selects and gates them is excluded as if it were runtime code.

5. **Lower-severity authored inputs.** Lane C’s supported legacy public/private pair and MCP’s required `benchmarks/README.md` lack family-specific scaffolds.

## Boundary correctness

The central boundary is correct and consistently implemented:

- Behavior scoring/framework/runner stay in `system-deep-loop/shared/behavior-benchmark/`.
- Conformance adapters, independent-oracle implementation, iteration, reduction and reports stay in deep-alignment or the executing packet.
- Lane B evaluators, scorers and reviewer verdict/schema remain in deep-improvement.
- Lane C D1–D5 scoring, dispatch, contamination lint and Markdown rendering remain in deep-improvement.
- Lane A config semantics, rubric, promotion gates and run machinery remain in-lane.
- Wider runtime microbenchmarks remain beside their runtime code.

No evaluator/scorer/runtime duplication was found inside create-benchmark; it has no local `scripts/` directory (`create-benchmark/README.md:99-102`).

The incorrect omissions are all authored data or authoring guidance—not runtime machinery:

- command matrix manifest;
- reviewer regression profile;
- Lane C corpus overlay and supported paired fixtures.

## Integration seams

Correct seams:

- The behavior guide links the actual shared framework and runner (`behavior_benchmark_guide.md:252-255`).
- Behavior and conformance guides link each other and correctly describe the command benchmark as separate, non-averaged axes (`behavior_benchmark_guide.md:229-238`; `conformance_benchmark_authoring_guide.md:229-232`).
- The conformance lane-config shape matches live `scoping.cjs`; its live `sk-doc-command` selection is correctly `sk-doc` / `docs` plus an adapter discriminator.
- Lane C links the scoring contract, operator guide, renderer and deep command (`skill_benchmark_storage_guide.md:163-170`).
- Lane A links the actual lane-local authored inputs and normative contracts comprehensively.

Broken or stale seams:

- **Smart router:** `DEFAULT_RESOURCE` is nonexistent `references/README.md`, and `mcp_promotion` is matched as an on-disk key even though its assets live under `shared/`; therefore the MCP route omits its templates (`create-benchmark/SKILL.md:113-140`).
- **Authoring command:** `/create:benchmark` only implements `mcp_promotion` and `conformance_benchmark`; four declared families stop at the command boundary (`commands/create/benchmark.md:13,31-54`; YAML validation at `create_benchmark_auto.yaml:68-75,116`).
- **Lane C:** the template names `manual_testing_playbook` as the corpus but does not link its authoring workflow or state the required Lane C frontmatter (`skill_benchmark_readme_template.md:58-74,167-173`).
- **Lane B:** the high-level guide says sampling uses a fixed author-set seed and `scoring.scorer` grades sweep cells (`model_benchmark_fixture_guide.md:184-195,217-229`). The profile template correctly admits that the seed is unused and sweep always uses the code-task scorer (`model_benchmark_profile_template.md:134-153`).
- **Lane B validator/runtime:** validator accepts `native` (`profile-validator.cjs:31-40`), while the dispatcher accepts only `cli-opencode` and `cli-claude-code` (`dispatch-model.cjs:137-140,442-453`).
- **Conformance:** the guide calls the live adapter planned and links only the generic `sk-doc.cjs`, not `references/adapters/sk_doc_command_adapter.md`.
- **Deep-command links:** Lane A is mis-targeted; model has no direct `/deep:model-benchmark` link; behavior/conformance leave `/deep:command-benchmark` as plain text.
- **MCP:** the report template’s index href is one directory too high. The live MCP README also uses obsolete validator path `.opencode/skills/sk-doc/scripts/validate_document.py` (`mcp_server/benchmarks/README.md:95-119`); the current path is under `sk-doc/shared/scripts/`.

## Staleness and drift

The declared six-family table does match create-benchmark’s actual directories: five asset-bearing keys plus Lane A guide-only (`README.md:21-30,74-97`). That structural parity is real, but it is self-referential and does not detect missing live subtypes such as reviewer profiles, Lane C corpus requirements or command composition.

Confirmed drift:

- `references/shared/README.md:31-62` omits conformance and agent-improvement guides and all conformance templates.
- Lane A is repeatedly called “§14,” although §14 is the generic references section; the actual guide is merely listed there (`SKILL.md:99,563-576`).
- The model guide ends with “four templated families and two Lane A/D guides,” although no Lane D exists (`model_benchmark_fixture_guide.md:319-324`).
- The sk-doc parent table omits Lane A from its create-benchmark description (`sk-doc/SKILL.md:25-32`).
- Live model READMEs claim two fixture shapes and three profiles, while the tree contains reviewer fixtures and ten profile JSONs.
- Lane C fixture README claims one directory/scenario, while many `deep_loop_workflows`, `sk_design`, and `sk_design_dispatch` pairs exist.
- Lane C’s storage guide says no `d4-ablation.json` or `d5-connectivity-detail.json` exists (`skill_benchmark_storage_guide.md:119-133`), while its named sk-code example documents and contains both (`sk-code/benchmark/README.md:73-102`). They appear legacy; the guide should label them rather than deny their existence.
- Deep-research and deep-review scenario budgets diverge from their indexes and the 900000-ms framework cap. Deep-review scenarios also use 1500000 where its index says 900000/600000.
- ACB prose says seats are separate `ai-council/seats/` files, while the normative framework counts seat IDs inside persisted council artifacts and explicitly says seats are not separate files (`framework.md:254-265`).
- `phase0_block` is documented as a behavior terminal bucket (`framework.md:188-202`) but absent from the runner’s complete classification path (`behavior-bench-run.cjs:578-642`).
- The live conformance package is incomplete against its frozen layout.
- The MCP curated tree mixes shipped promotion records with HOLD/UNREPORTED experiments and contains reports with six, eight or nine sections despite the fixed ten-section contract.

## Prioritized gap list

### P0

None confirmed.

### P1

1. **Behavior templates cannot express live contracts.**  
   **Where:** `assets/behavior_benchmark/behavior_benchmark_scenario_template.md` and index template.  
   **Minimal fix:** add fillable alternate-evidence fields (`evidence_kind`, `min_seats`, `artifacts_required`) and a separate v2 variant containing `schema_version`, topology, direct-dispatch targets, postconditions, boundary and marker provenance; make index result-schema wording conditional.

2. **Lane C’s primary corpus authoring is not wired end-to-end.**  
   **Where:** create-benchmark §10, Lane C guide/template, and the manual-playbook creator.  
   **Minimal fix:** route authors to `create-manual-testing-playbook` and add a small Lane C overlay/template for `id`, `expected_intent`, `expected_resources`, `stage`, exact prompt and negative activation. Do not copy the loader or scorer.

3. **Command benchmark lacks a first-class composite authoring route.**  
   **Where:** create-benchmark family/router/resource map.  
   **Minimal fix:** add a `command_benchmark` composition profile that loads both existing family guides plus one matrix-manifest template matching scheduler validation. Keep both axes, launcher, scheduler and scorecard lane-local.

4. **Lane B reviewer-profile authoring is missing.**  
   **Where:** model fixture guide/profile assets.  
   **Minimal fix:** add a narrow reviewer-profile variant matching live `mode: reviewer`, fixture list, scoring gate and feature flag. Continue linking—not copying—the reviewer schema and scorer.

5. **Create-benchmark routing cannot reliably load its own resources.**  
   **Where:** `SKILL.md:113-140` and `/create:benchmark`.  
   **Minimal fix:** change the fallback to `references/shared/README.md`, add an explicit family-to-disk-key map (`mcp_promotion → shared`), and either implement all declared command branches or state that `/create:benchmark` supports only two families and provide the direct skill route for the others.

6. **Live conformance and MCP promoted packages violate their authored contracts.**  
   **Where:** deep-alignment command-surface package and system-spec-kit benchmarks tree.  
   **Minimal fix:** instantiate the missing conformance README/contract and explicitly amend or materialize the fixture layout; separately backfill only qualifying MCP promotions with `SOURCE.md`, results and ten-section reports, moving or reclassifying non-promoted experiments.

### P2

1. Add or explicitly deprecate Lane C legacy public/private fixture templates; while supported, link `scenario_authoring.md`.
2. Add an MCP `benchmarks/README.md` scaffold and fix the report template href from `../../README.md` to `../README.md`.
3. Correct Lane B’s fixed-seed/scorer claims and reconcile `native` executor validation with dispatch.
4. Update stale Lane B/Lane C inventories and label old Lane C sidecars as legacy.
5. Fix direct deep-command links, conformance’s “planned adapter” wording, shared reference-map omissions, Lane A section numbering and the nonexistent Lane D reference.
6. Reconcile behavior budgets, ACB seat wording and the unused `phase0_block` contract.
7. Classify the vision audit explicitly as a one-off or future multimodal Lane B subtype; do not create a new family until a reusable input/runtime contract exists.

## Bottom line

`sk-doc/create-benchmark` is not yet the complete benchmark-authoring home: its ownership boundary is correct, but the most important gap is that its behavior templates cannot express benchmark contracts already live across ACB, IMB and the schema-v2 DAB command suite.