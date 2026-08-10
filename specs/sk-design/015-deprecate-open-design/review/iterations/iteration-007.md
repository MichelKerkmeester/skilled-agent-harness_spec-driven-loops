# Deep Review Iteration 007

## Dispatcher
- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus every declared live referencing surface and the deprecation plan
- Focus: completeness sweep B — advisor/doc-infrastructure surfaces
- Budget profile: `scan` (declared maximum 13 calls; setup and focused evidence actions completed)
- Session: `rvw-2026-08-10-deprecate-open-design`, generation `1`, lineage `new`

## Files Reviewed
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json`
- `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`
- `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`
- `.opencode/skills/sk-doc/scripts/tests/test_readme_manifest.py`
- `.opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py`
- `.opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md`
- `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`
- `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`
- `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md`
- `.opencode/skills/system-spec-kit/mcp-server/lib/eval/data/ground-truth.json`
- `.opencode/skills/system-spec-kit/mcp-server/dist/lib/eval/data/ground-truth.json`
- `.opencode/skills/system-spec-kit/mcp-server/lib/eval/ground-truth-data.ts`
- `.opencode/skills/system-spec-kit/mcp-server/package.json`
- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`
- `.opencode/bin/compiled-route.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json`
- `README.md`, `AGENTS.md`, `BARTER.md`
- `specs/sk-design/015-deprecate-open-design/spec.md`, `plan.md`, `tasks.md`
- `.opencode/skills/sk-code/sk-code-review/references/review-core.md`

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass, destructive data loss, or equivalent P0 condition was established in this completeness sweep.

### P1 Findings

1. **Advisor retains retired transport-specific intent boosters and T029 has no entry-level corpus disposition** -- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135` -- The live scorer still maps `open design`, `wire open design`, `connect open design`, `drive open design`, `od cli`, and `od mcp` to `sk-design`, under a comment explicitly naming the deprecated transport. This is not a direct child entry in the graph: `skill-graph.json:1-28` has 11 skills and its `mcp` family contains only `mcp-code-mode` and `mcp-tooling`. Nevertheless, after the transport is removed these terms retain transport-specific advisor behavior and residue. T029 only says “Re-point corpus” (`specs/sk-design/015-deprecate-open-design/tasks.md:54`) and does not identify the entries to delete/replace, the graph regeneration condition, or the post-change advisor probe.
   - Finding class: `cross-consumer`
   - Scope proof: Direct variant search found the six live scorer entries and the transport comment; direct graph search found no `sk-design-mcp-open-design` entry, separating the scorer residue from graph routing.
   - Affected surface hints: `[skill_advisor.py INTENT_BOOSTERS, skill-graph.json generated corpus, T029, advisor probe]`
   - Claim adjudication:
```json
{"type":"correctness","claim":"The advisor can continue treating retired-transport phrases as positive sk-design routing evidence after tree deletion because the live scorer retains six transport-specific boosters, while T029 has no exact entry disposition or probe contract.","evidenceRefs":[".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135",".opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json:1-28","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Searched the graph for the transport ID and confirmed it is absent; checked the scorer's live booster table and found the transport phrases still active.","alternativeExplanation":"The parent-hub boost may have been intended to route generic design requests, but the explicit Open Design/OD vocabulary and transport comment make the entries transport-specific and still residue under the zero-reference requirement.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Remove or explicitly genericize each six booster/comment, regenerate the graph only when its source changes, and attach an advisor probe proving no retired transport term remains."}
```

2. **Sk-doc frozen README and directory fixtures encode the deleted tree and are consumed as live test inputs** -- `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:162-166` -- The frozen durable-directory manifest lists the transport root and four child directories. `test_readme_manifest.py:40-55` loads this manifest, derives the current repository set, and fails on a mismatch. The baseline fixture likewise lists six transport README paths (`baseline-readme-verdicts.json:2017-2067`), and `test_readme_verdict_parity.py:15,31-34` invokes the validator for every listed path. Deleting the skill therefore breaks deterministic fixture tests unless both generated snapshots are updated; these are live test inputs, not historical records. T028 says only “strip sibling skills … sk-doc fixtures/tests/templates” (`tasks.md:54`) and lacks the exact regeneration/removal sequence and post-delete test proof.
   - Finding class: `test-isolation`
   - Scope proof: The two test scripts explicitly read the two focus fixtures and compare/execute against their paths; the deleted paths are present in both fixture families.
   - Affected surface hints: `[durable-directory-manifest.json, baseline-readme-verdicts.json, test_readme_manifest.py, test_readme_verdict_parity.py, T028]`
   - Claim adjudication:
```json
{"type":"correctness","claim":"Deleting the transport tree without regenerating the sk-doc manifest and baseline fixtures will make live fixture tests fail or attempt to validate missing files, so T028's broad strip wording is not sufficient acceptance evidence.","evidenceRefs":[".opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:162-166",".opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:2017-2067",".opencode/skills/sk-doc/scripts/tests/test_readme_manifest.py:40-55",".opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py:15,31-34","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Read both test consumers rather than treating the JSON as historical prose; both load the fixtures at runtime and compare or validate each listed path.","alternativeExplanation":"The snapshots could be intentionally retained as historical baselines, but the tests do not mark them historical and actively execute against the paths, so retention would be a test break and residue.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Remove deleted-tree entries, regenerate both snapshots from the post-removal tree, and record passing manifest/parity test output."}
```

3. **Sk-doc validator, agent template, and parent-skill reference hardcode the retired packet beyond T028's named fixture scope** -- `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:62-75` -- The live validator's `WARN_PACKAGE_IDS` still contains `sk-design/sk-design-mcp-open-design`; the template route table retains the packet at `sk-create-agent/assets/agent-template.md:722`, and the parent-skill matrix calls it a current transport packet at `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:167`. T028's affected-surface row names fixtures/tests/templates but not the validator script or parent-skill reference. Leaving the validator entry makes removed-package policy stale, while leaving either document violates the residue gate. The agent template itself is within the broad template wording, but still requires an explicit edit and proof.
   - Finding class: `cross-consumer`
   - Scope proof: The exact package ID occurs in executable validator data and the exact route occurs in two shipped documentation templates; these are distinct from the baseline/manifest snapshot paths in finding P1-011.
   - Affected surface hints: `[validate_catalog_package.py WARN_PACKAGE_IDS, agent-template.md, parent-skills-nested-packets.md, T028, zero-residue gate]`
   - Claim adjudication:
```json
{"type":"traceability","claim":"T028 can leave live sk-doc code and reference templates carrying the removed packet because its named fixture/tests/templates scope does not explicitly cover validate_catalog_package.py or parent-skills-nested-packets.md.","evidenceRefs":[".opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:62-75",".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md:722",".opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:167","specs/sk-design/015-deprecate-open-design/plan.md:81","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Checked the plan's sk-doc affected-surface row and T028 wording for the validator and parent-skill reference; neither is named, although the agent template is covered by the generic template term.","alternativeExplanation":"The validator allowlist could be harmless after package deletion, but it remains a shipped transport identifier and can influence warning/fail classification; zero-residue and package-policy parity still require removal.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Add the validator and parent-skill paths to T028's explicit inventory, remove the retired ID/row/template claims, and run the package validator plus residue gate."}
```

4. **System-spec-kit's live workflow contract and link-integrity evidence are not fully in the deprecation inventory** -- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:32` -- The active workflow contract names the structured Open Design transport result as part of the enforceable design gate. It is outside the plan's named system-spec paths, which list only `manual-testing-playbook/**` and `mcp-server/**/ground-truth.json` (`specs/sk-design/015-deprecate-open-design/plan.md:81`, `spec.md:126`). The active markdown-link playbook also records links to `.opencode/skills/mcp-open-design/references/design-parity-transport.md` at `markdown-link-integrity-guard.md:66-68`; those links are not historical exclusions and will remain residue/broken-link evidence unless the expected output is updated. T028 therefore does not cover the workflow contract and does not say how to refresh the guard's expected output.
   - Finding class: `cross-consumer`
   - Scope proof: Direct reads confirmed one live workflow contract outside the named paths and one active playbook evidence block with the old transport path; the plan's table was checked for the missing workflow path.
   - Affected surface hints: `[system-spec-kit/references/workflows/agent-io-contract.md, markdown-link-integrity-guard.md, T028, markdown-link self-test, residue gate]`
   - Claim adjudication:
```json
{"type":"traceability","claim":"The system-spec-kit deprecation inventory can complete while a live workflow contract and active link-integrity evidence retain retired transport claims, because T028 names only the manual-testing-playbook and eval-ground-truth subtrees.","evidenceRefs":[".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:32",".opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md:66-68","specs/sk-design/015-deprecate-open-design/plan.md:81","specs/sk-design/015-deprecate-open-design/spec.md:126","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Checked the affected-surface table for references/workflows and checked whether the guard output was marked historical; neither exclusion nor workflow-path entry was present.","alternativeExplanation":"The guard block is a captured command output rather than executable routing, but it is in a live manual-testing playbook and still participates in the required zero-residue/documentation integrity sweep.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Add the workflow contract to the inventory, remove/genericize the transport gate prose, refresh the guard's expected output/self-test, and prove the live residue/link checks."}
```

5. **System-spec-kit ground-truth source and dist copies are live eval data but T028 lacks a paired regeneration/parity contract** -- `.opencode/skills/system-spec-kit/mcp-server/lib/eval/data/ground-truth.json:815-820` -- The source corpus contains hand-authored, live-DB-verified queries about the retired program, and the tracked dist copy contains the same rows at `mcp-server/dist/lib/eval/data/ground-truth.json:815-820`. `lib/eval/ground-truth-data.ts:5` imports the source JSON, while the package build/finalize flow is defined in `mcp-server/package.json:12-13`; the dist duplicate is therefore generated/runtime input, not a historical benchmark exclusion. T028's generic “remove eval/fixture references” (`plan.md:81`, `tasks.md:54`) does not require updating source, rebuilding dist, or proving byte parity. The current pair is byte-identical, so this is a synchronization obligation, not a claim of present drift.
   - Finding class: `cross-consumer`
   - Scope proof: Both tracked copies were parsed and compared; the source loader and build script were read; both copies contain the same retired query rows and live-eval notes.
   - Affected surface hints: `[lib/eval/data/ground-truth.json, dist/lib/eval/data/ground-truth.json, ground-truth-data.ts, package build/finalize, T028]`
   - Claim adjudication:
```json
{"type":"correctness","claim":"A source-only edit can leave the built system-spec-kit eval corpus carrying retired transport queries because lib and dist ground-truth copies are both tracked inputs and T028 has no paired rebuild/parity assertion.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/eval/data/ground-truth.json:815-820",".opencode/skills/system-spec-kit/mcp-server/dist/lib/eval/data/ground-truth.json:815-820",".opencode/skills/system-spec-kit/mcp-server/lib/eval/ground-truth-data.ts:5",".opencode/skills/system-spec-kit/mcp-server/package.json:12-13","specs/sk-design/015-deprecate-open-design/plan.md:81","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Compared lib and dist bytes (currently equal) and confirmed both the source import and package build/finalize path; no historical-exclusion marker was present.","alternativeExplanation":"Dist may be regenerated automatically in CI, but the tracked duplicate and explicit finalize-dist build step still require the task to name and verify that regeneration.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Remove or reclassify the retired rows in the source corpus, run the package build/finalize step, compare lib/dist outputs, and run the affected eval tests."}
```

### P2 Findings

None. The remaining concerns are required inventory, routing, or test-integrity work rather than optional polish.

### Carried Active P1 Findings

- **P1-001** — residue gate misses camelCase/uppercase identifiers; prior evidence remains `.opencode/skills/sk-design/shared/design-proof-token.md:40` and smart-routing variants.
- **P1-002** — inventory omits tracked mcp-tooling discovery fixtures; prior evidence remains `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6` (with Aside/Refero equivalents).
- **P1-003** — NFR-S01 lacks explicit env/path/token residue assertion; prior evidence remains `specs/sk-design/015-deprecate-open-design/spec.md:196` and `.utcp_config.json:149-157`.
- **P1-004** — checked checklist rows lack pinned evidence; prior evidence remains `specs/sk-design/015-deprecate-open-design/checklist.md:22-24`.
- **P1-005** — T032 lacks an executable derived-manifest regeneration contract; prior evidence remains `specs/sk-design/015-deprecate-open-design/tasks.md:58`.
- **P1-006** — promised append-only deprecation changelog entry is not task-mapped; prior evidence remains `specs/sk-design/015-deprecate-open-design/spec.md:88`.
- **P1-007** — live-surface exclusion allowlist is prose-only/non-reproducible; prior evidence remains `specs/sk-design/015-deprecate-open-design/plan.md:57`.
- **P1-008** — live-render playbook/catalog token is rejected by executable adapter; prior evidence remains `.opencode/skills/system-deep-loop/deep-alignment/manual-testing-playbook/discovery-and-adapters/sk-design-live-render-adapter.md:50`.
- **P1-009** — dedicated design-generation reference has no delete-versus-rewrite disposition; prior evidence remains `.opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:17`.

## Traceability Checks

| Protocol | Level | Status | Evidence / adjudication |
|---|---|---|---|
| `spec_code` | core | partial | T028–T031 are named, but advisor entry disposition, sk-doc validator/fixture regeneration, system-spec workflow coverage, and lib/dist parity are not executable in `plan.md:81` / `tasks.md:54-57`. Findings P1-010..014. |
| `checklist_evidence` | core | partial | P1-004 remains active; no new checklist evidence was claimed in this read-only iteration (`checklist.md:22-24`). |
| `skill_agent` | overlay | partial | Advisor scorer, sk-doc agent template, and parent-skill matrix contain live transport claims; P1-010 and P1-012. |
| `agent_cross_runtime` | overlay | pass (carried) | No new cross-runtime parity defect was established; prior iteration 003 evidence remains authoritative. |
| `feature_catalog_code` | overlay | partial (carried) | P1-008 remains active; no new catalog execution was required in this focus. |
| `playbook_capability` | overlay | partial | System-spec markdown-link guard and workflow contract retain live transport capability/evidence claims; P1-013. |

## Integration Evidence

- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2122-2135` is the live scorer table; `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json:1-28` has no transport child ID. T029 needs explicit scorer cleanup and a probe; graph regeneration is conditional, not an assumed edit.
- `.opencode/skills/sk-doc/scripts/tests/test_readme_manifest.py:40-55` and `test_readme_verdict_parity.py:15,31-34` load the two frozen fixture files. The fixture paths at `durable-directory-manifest.json:162-166` and `baseline-readme-verdicts.json:2017-2067` are live test input.
- `.opencode/skills/system-spec-kit/mcp-server/lib/eval/ground-truth-data.ts:5` imports the source corpus. The package build/finalize contract is in `mcp-server/package.json:12-13`; lib and dist JSON were parsed and byte-compared successfully before writes, but both currently carry retired rows.
- `.opencode/bin/compiled-route.cjs:15-45` contains only the resolver front door and has no canary/fixture path. The 006-sk-design harness loads `fixtures/canary-cases.v1.json` at `harness/build-artifacts.cjs:73-77`; the `single-open-design-transport` case is at `fixtures/canary-cases.v1.json:124-137`. Verdict: replay/build artifact, not direct runtime input; **must-update/remove**, not leave, because the harness currently expects the deleted mode/resources.
- Root docs have exact live rows at `README.md:810-811,1143`, `AGENTS.md:526`, and `BARTER.md:407`. T030 explicitly names all three (`tasks.md:56`), so these are covered actions with no new plan-coverage finding.

## Edge Cases

- The advisor graph is not a direct child route today; absence of the child in `skill-graph.json` does not make the scorer's transport-specific boosters safe to retain.
- The sk-doc JSON files look generated/baseline-like, but their test consumers load them on every run and do not classify them as historical; they must be regenerated after deletion.
- `validate_catalog_package.py`'s warning allowlist may not hard-fail an absent package, but it is executable shipped policy and still violates the residue/plan parity invariant.
- The system-spec markdown-link guard contains captured output with existing unrelated broken links; only the retired transport path is in this review scope, and the whole expected-output block must be refreshed without claiming unrelated link repair.
- The lib/dist ground-truth files are currently byte-identical; the finding is about required paired update/rebuild proof, not current divergence.
- The compiled canary is replay-only at runtime, but its build harness consumes it; leaving the transport case would preserve a stale expected route and fail post-removal canary generation.
- Memory/code graph was unavailable; direct repository evidence and focused grep/read checks were used.

## Confirmed-Clean Surfaces

- No P0 security/auth/destructive-data-loss condition established.
- `skill-graph.json` has no `sk-design-mcp-open-design` or `mcp-open-design` entry in the inspected graph surface; only the scorer table retains transport vocabulary.
- `.opencode/bin/compiled-route.cjs` does not load the canary fixture directly; the fixture is loaded by the 006-sk-design replay/build harness only.
- `README.md`, `AGENTS.md`, and `BARTER.md` are all named by T030; exact lines were verified rather than inferred.
- Current lib/dist ground-truth JSON files parse and compare byte-for-byte; no present build-copy divergence was asserted.

## Ruled Out

- No finding that the compiled canary is a live runtime import; it is a replay/build input and still must be updated.
- No finding that `skill-graph.json` directly routes to the deleted child; its mcp family does not list that child.
- No recommendation to rewrite historical changelog, benchmark, or spec records; only live fixtures, docs, code, and generated eval copies are in scope.
- No review-target edits were made.

## Next Focus

- dimension: traceability
- focus area: surface sweep C — final T028–T031 action closure, derived-artifact parity, and post-removal residue proof
- reason: advisor/doc-infrastructure sweep found five new gate-relevant P1 inventory or regeneration gaps; P1-001..P1-009 remain active
- rotation status: completeness sweep B completed conditionally in iteration 007
- blocked/productive carry-forward: productive — preserve P1-001..P1-014; do not retry ruled-out direct-runtime-canary or graph-child hypotheses
- required evidence: exact advisor probe and graph regeneration decision; regenerated sk-doc fixtures with passing tests; validator/template/parent-skill cleanup; system-spec workflow and lib/dist eval updates; canary replay update; exact root-doc diff and final residue gate

Review verdict: CONDITIONAL