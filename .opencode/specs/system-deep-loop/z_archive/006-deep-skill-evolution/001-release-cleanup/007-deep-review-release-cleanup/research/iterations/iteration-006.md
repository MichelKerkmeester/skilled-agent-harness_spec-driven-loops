# Iter 006 — Cross-skill dependency drift

## Question

Do all cross-skill dependency references in `.opencode/skills/deep-review/{README.md, SKILL.md, references/*.md, graph-metadata.json}` point at paths/contracts that actually exist? Specifically: are the contracts deep-review claims about `deep-loop-runtime`, `sk-code-review`, `system-spec-kit`, `cli-devin`, `cli-opencode`, `sk-prompt-models`, and any other named cross-skill targets still accurate? Each drift MUST cite both surfaces with `file:line`.

## Evidence (file:line citations required)

### Step 1: README.md §9 RELATED DOCUMENTS

**Dependencies subsection (line 442):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/README.md" lines="442-442" />

Claims dependency on `.opencode/skills/deep-loop-runtime/` for executor, state schema, and coverage-graph runtime (post-118 FULL_ISOLATE_NO_MCP split from `system-spec-kit/mcp_server/`).

**Related Skills subsection (lines 481-483):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/README.md" lines="481-483" />

Lists `deep-loop-runtime`, `deep-research`, and `sk-code-review` as related skills with their relationships.

**Workflow YAMLs subsection (lines 489-490):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/README.md" lines="489-490" />

References workflow YAMLs under `.opencode/commands/deep/assets/`.

### Step 2: graph-metadata.json dependencies

**depends_on edge (lines 7-12):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/graph-metadata.json" lines="7-12" />

Lists `sk-code-review` as a dependency with weight 0.8.

**siblings edges (lines 15-25):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/graph-metadata.json" lines="15-25" />

Lists `deep-research` and `deep-loop-runtime` as siblings.

**manual depends_on (lines 31-34):**
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/graph-metadata.json" lines="31-34" />

Lists `system-spec-kit` and `sk-code-review` as manual dependencies.

### Step 3: Path existence verification

**deep-loop-runtime paths:**
- `.opencode/skills/deep-loop-runtime/` - EXISTS (skill directory)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` - EXISTS <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts" lines="1-20" />
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` - EXISTS <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts" lines="150-159" />
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` - EXISTS (contains `dimensionCoverage` field)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` - EXISTS
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` - EXISTS
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts` - EXISTS
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` - EXISTS

**sk-code-review paths:**
- `.opencode/skills/sk-code-review/` - EXISTS (skill directory)

**deep-research paths:**
- `.opencode/skills/deep-research/` - EXISTS (skill directory)

**system-spec-kit paths:**
- `.opencode/skills/system-spec-kit/` - EXISTS (skill directory)
- `.opencode/skills/system-spec-kit/scripts/tests/session-isolation.vitest.ts` - EXISTS
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` - EXISTS
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` - EXISTS
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` - EXISTS

**Command paths:**
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` - EXISTS
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` - EXISTS

### Step 4: Cross-skill reference grep results

**deep-loop-runtime references (29 matches):**
- Found in `references/state_format.md` (lines 815-816) - cites coverage-graph-db.ts lines 154 and 292-302
- Found in `references/loop_protocol.md` (line 268) - cites executor-config.ts
- Found in `SKILL.md` (line 381) - cites executor-config.ts
- Found in `manual_testing_playbook/04--convergence-and-recovery/graph-convergence-review.md` (lines 51, 76) - cites coverage-graph-signals.ts
- Found in `manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-candidate-coverage.md` (line 58) - cites review-depth-convergence.vitest.ts
- Found in `manual_testing_playbook/08--review-depth-v2-rollout/graph-vocabulary.md` (lines 56-57, 60) - cites coverage-graph-db.ts and review-depth-graph.vitest.ts
- Found in `manual_testing_playbook/08--review-depth-v2-rollout/validator-warn-rollout.md` (lines 54-55) - cites post-dispatch-validate.ts and review-depth-validator.vitest.ts
- Found in `manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md` (line 58) - cites review-depth-convergence.vitest.ts
- Found in `manual_testing_playbook/08--review-depth-v2-rollout/validator-strict-v2.md` (lines 56-57) - cites post-dispatch-validate.ts and review-depth-validator.vitest.ts
- Found in `manual_testing_playbook/03--iteration-execution-and-state-discipline/graph-events-review.md` (lines 51, 76) - cites coverage-graph-db.ts
- Found in `README.md` (lines 431, 442, 481) - cites coverage-graph-db.ts and deep-loop-runtime skill
- Found in `changelog/v1.9.0.0.md` (lines 47, 49, 97) - migration notes
- Found in `changelog/v1.4.0.0.md` (lines 1, 11, 27, 33) - migration completion notes
- Found in `graph-metadata.json` (line 22) - sibling entry

**system-spec-kit references (49 matches):**
- Found in `references/state_format.md` (line 293) - cites session-isolation.vitest.ts
- Found in `references/loop_protocol.md` (line 534) - cites generate-context.js
- Found in `references/convergence.md` (line 750) - cites optimizer-manifest.json
- Found in `SKILL.md` (lines 62, 446, 485) - cites review-research-paths.cjs, validate.sh
- Found in `scripts/reduce-state.cjs` (lines 13-14) - requires extract-from-evidence.cjs and review-research-paths.cjs
- Found in `assets/deep_review_config.json` (line 87) - cites optimizer-manifest.json
- Found in `assets/deep_review_strategy.md` (line 177) - cites deep-research reduce-state.cjs and test
- Found in `feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` (lines 30, 40, 50) - cites extract-from-evidence.cjs and test
- Found in multiple playbook files (8 files in manual_testing_playbook/08--review-depth-v2-rollout/) - cite test paths under system-spec-kit/mcp_server/tests/deep-loop/
- Found in multiple changelog files (v1.0.0.0 through v1.9.0.0) - historical references preserved
- Found in `graph-metadata.json` (line 32) - manual depends_on entry

**cli-devin/cli-opencode/sk-prompt-models references:**
- No direct references found in current deep-review surfaces (only in changelog v1.8.0.0 for cli-opencode as implementation detail)

### Step 5: Drift identification

**FINDING 1: Stale test path references in playbook files (P0)**

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/reducer-search-debt.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/reducer-search-debt.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` which EXISTS at that location. However, this is inconsistent with other playbook files that reference deep-loop-runtime/tests/integration/ for similar test files.

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-candidate-coverage.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-candidate-coverage.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts` which DOES NOT EXIST. The actual file exists at `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts" lines="1-1" />

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/graph-vocabulary.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/graph-vocabulary.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts` which DOES NOT EXIST. The actual file exists at `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts" lines="1-1" />

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/validator-warn-rollout.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/validator-warn-rollout.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` which DOES NOT EXIST. The actual file exists at `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts" lines="1-1" />

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts` which DOES NOT EXIST. The actual file exists at `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts" lines="1-1" />

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/validator-strict-v2.md` line 30
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/validator-strict-v2.md" lines="30-30" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` which DOES NOT EXIST. The actual file exists at `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts" lines="1-1" />

**Severity:** P0 - These are broken test references in the v2 rollout playbook scenarios. The v1.9.0.0 changelog explicitly states that 12 cross-system path refs were migrated from system-spec-kit/mcp_server/ to deep-loop-runtime/, but these 5 playbook test path references were missed.

**FINDING 2: Inconsistent test location pattern (P1)**

**Documenting surface:** `manual_testing_playbook/08--review-depth-v2-rollout/reducer-search-debt.md` line 58
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/reducer-search-debt.md" lines="58-58" />

**Target reality:** References `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` which DOES exist at that location <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts" lines="1-1" />

**Context:** This creates an inconsistent pattern where `review-depth-reducer.vitest.ts` remains in system-spec-kit/mcp_server/tests/deep-loop/ but the other review-depth test files (convergence, graph, validator) were moved to deep-loop-runtime/tests/integration/. This inconsistency suggests either an incomplete migration or a deliberate split that should be documented.

**Severity:** P1 - Not a broken reference, but creates confusion about test ownership and location conventions.

**FINDING 3: Historical test filename with space (P2)**

**Documenting surface:** `changelog/v1.3.1.0.md` line 112
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/changelog/v1.3.1.0.md" lines="112-112" />

**Target reality:** References `.opencode/skills/system-spec-kit/scripts/tests/deep-review-expected behavior-parity.vitest.ts` (with a space in the filename). The actual file is named `deep-review-contract-parity.vitest.ts` (no space) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts" lines="1-1" />

**Context:** This is a historical changelog entry from v1.3.1.0. The v1.9.0.0 changelog explicitly states that historical changelog references were preserved as-is to keep the chronological record accurate. However, this appears to be a typo in the original changelog that was carried forward.

**Severity:** P2 - Historical reference in a changelog, not current documentation. The v1.9.0.0 changelog preservation policy applies, but this appears to be an original typo rather than a path that existed at the time.

## Findings (numbered)

1. **P0: Five playbook test path references still point to system-spec-kit/mcp_server/tests/deep-loop/ instead of deep-loop-runtime/tests/integration/**
   - DRV-061, DRV-062, DRV-063, DRV-058, DRV-059 all reference test files that were moved to deep-loop-runtime but the playbook paths weren't updated
   - The v1.9.0.0 changelog claims 12 cross-system path refs were migrated, but these 5 were missed
   - Affected files: `review-depth-convergence.vitest.ts`, `review-depth-graph.vitest.ts`, `review-depth-validator.vitest.ts`

2. **P1: Inconsistent test location pattern for review-depth tests**
   - `review-depth-reducer.vitest.ts` remains in system-spec-kit/mcp_server/tests/deep-loop/ while other review-depth tests moved to deep-loop-runtime/tests/integration/
   - Creates confusion about test ownership and migration completeness
   - Either needs migration to deep-loop-runtime or documentation explaining the split

3. **P2: Historical changelog contains filename with space that doesn't match actual file**
   - v1.3.1.0 changelog references `deep-review-expected behavior-parity.vitest.ts` but actual file is `deep-review-contract-parity.vitest.ts`
   - Historical changelog preservation policy applies, but this appears to be an original typo
   - Not actionable for current docs, but worth noting for historical accuracy

## Gaps for next iter

1. **Investigate test ownership split:** Determine why `review-depth-reducer.vitest.ts` remains in system-spec-kit while other review-depth tests moved to deep-loop-runtime. Is this intentional (reducer remains system-spec-kit owned) or an incomplete migration?

2. **Verify migration completeness:** The v1.9.0.0 changelog claims 12 cross-system path refs were migrated. Audit whether all 12 were actually migrated or if there are other missed references beyond the 5 playbook test paths found in this iter.

3. **Check for other stale system-spec-kit/mcp_server/ references:** The grep found 49 system-spec-kit references. While many are legitimate (generate-context.js, review-research-paths.cjs, etc.), verify no other mcp_server/deep-loop/ test references were missed.

4. **Validate contract accuracy:** Verify that the contracts deep-review claims about deep-loop-runtime (executor, state schema, coverage-graph runtime) are still accurate post-118 migration. Check if any additional contracts have been added or removed.

## JSONL delta row

```json
{"iter_id":"006","timestamp_utc":"2026-05-23T17:35:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":3,"gaps_count":4,"primary_evidence_files":[".opencode/skills/deep-review/README.md",".opencode/skills/deep-review/graph-metadata.json",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/reducer-search-debt.md",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-candidate-coverage.md",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/graph-vocabulary.md",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/validator-warn-rollout.md",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md",".opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/validator-strict-v2.md",".opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts",".opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts",".opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts",".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts",".opencode/skills/deep-review/changelog/v1.9.0.0.md"]}
```