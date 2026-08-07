# Iter 005 — Documented behaviors with no implementation (skill-wide)

## Question

Which behavioral promises in `.opencode/skills/deep-review/SKILL.md` (§3 HOW IT WORKS + §4 RULES + §6 SUCCESS CRITERIA + §8 FINDING DEDUPLICATION) or in any of the 4 reference files (convergence, loop_protocol, quick_reference, state_format) have ZERO matching implementation across `assets/deep_review_config.json`, `assets/review_mode_contract.yaml`, or `scripts/reduce-state.cjs`?

## Evidence (file:line citations required)

### Documentation Sources Read

1. **SKILL.md** - Sections §3 HOW IT WORKS (lines 263-396), §4 RULES (lines 398-437), §6 SUCCESS CRITERIA (lines 450-486), §8 FINDING DEDUPLICATION (lines 514-538) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" />
2. **references/convergence.md** - Full document (lines 1-750) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" />
3. **references/loop_protocol.md** - Full document (lines 1-833) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" />
4. **references/quick_reference.md** - Full document (lines 1-220) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/quick_reference.md" />
5. **references/state_format.md** - Full document (lines 1-945) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" />

### Implementation Surfaces Searched

1. **assets/deep_review_config.json** - Full config template (lines 1-92) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/deep_review_config.json" />
2. **assets/review_mode_contract.yaml** - Full contract (lines 1-494) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/assets/review_mode_contract.yaml" />
3. **scripts/reduce-state.cjs** - Full reducer implementation (lines 1-1657) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" />

## Findings (numbered)

### 1. Resource Map Coverage Gate - resource_map_present field not in config

**Documentation claim**: SKILL.md §3 states "Persist `resource_map_present: true` in `deep-review-config.json`" and "When `{spec_folder}/resource-map.md` is absent at init: Persist `resource_map_present: false`." <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="269-283" />

**Grep evidence of absence**: 
- `grep -r "resource_map_present" assets/` returned 0 matches
- `grep -r "resource_map_present" scripts/` returned 0 matches

**Severity**: P0 - This is a core configuration field documented as required for the Resource Map Coverage Gate feature, but the config template does not include it.

### 2. Semantic Convergence Signals - semanticNovelty computation not implemented

**Documentation claim**: convergence.md §4 defines `semanticNovelty (0.0-1.0)` with detailed computation algorithm: `function computeSemanticNovelty_review(currentFindings, priorCumulativeFindings)` using `extractDefectPatterns()` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="260-280" />

**Grep evidence of absence**:
- `grep -r "semanticNovelty" assets/` returned 0 matches (only found in prompt template)
- `grep -r "semanticNovelty" scripts/` returned 0 matches
- `grep -r "computeSemanticNovelty" .` returned 1 match (only in convergence.md documentation)
- `grep -r "extractDefectPatterns" .` returned 2 matches (only in convergence.md documentation)

**Severity**: P0 - This is a documented convergence signal with specific algorithm and integration points, but has no implementation in the skill surfaces.

### 3. Semantic Convergence Signals - findingStability computation not implemented

**Documentation claim**: convergence.md §4 defines `findingStability (0.0-1.0)` with detailed computation algorithm: `function computeFindingStability(currentRegistry, priorRegistry)` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="282-308" />

**Grep evidence of absence**:
- `grep -r "findingStability" assets/` returned 0 matches
- `grep -r "findingStability" scripts/` returned 0 matches (only found in convergence.md documentation)
- `grep -r "computeFindingStability" .` returned 1 match (only in convergence.md documentation)

**Severity**: P0 - This is a documented convergence signal with specific algorithm and STOP decision integration, but has no implementation.

### 4. Semantic Convergence Signals - semanticVerdict field not implemented

**Documentation claim**: convergence.md §4 documents `semanticVerdict` enum with values `all_support_stop|mixed|all_prevent_stop|insufficient_data` for stop_decision events <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="338-343" />

**Grep evidence of absence**:
- `grep -r "semanticVerdict" assets/` returned 0 matches
- `grep -r "semanticVerdict" scripts/` returned 0 matches
- `grep -r "semanticVerdict" .` returned 3 matches (only in convergence.md documentation)

**Severity**: P0 - This is a documented field for stop_decision events with specific enum values, but has no implementation.

### 5. Semantic Convergence Signals - semanticSignals field not implemented

**Documentation claim**: convergence.md §4 documents `semanticSignals` object containing `semanticNovelty` and `findingStability` values for stop_decision events <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="329-336" />

**Grep evidence of absence**:
- `grep -r "semanticSignals" assets/` returned 0 matches
- `grep -r "semanticSignals" scripts/` returned 0 matches
- `grep -r "semanticSignals" .` returned 1 match (only in convergence.md documentation)

**Severity**: P0 - This is a documented field for stop_decision events, but has no implementation.

### 6. Semantic Convergence Signals - stop_decision event not implemented

**Documentation claim**: convergence.md §4 documents `stop_decision` event with semantic signals and verdict <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="321-343" />

**Grep evidence of absence**:
- `grep -r "stop_decision" assets/` returned 0 matches
- `grep -r "stop_decision" scripts/` returned 0 matches
- `grep -r "stop_decision" .` returned 1 match (only in convergence.md documentation)

**Severity**: P0 - This is a documented event type for semantic convergence decisions, but has no implementation.

### 7. Finding Deduplication - content_hash field not in implementation

**Documentation claim**: SKILL.md §8.1 states "Every finding emitted into the JSONL delta (field `findingDetails[]`) MUST include a `content_hash` field computed per §8.1" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="514-538" />

**Grep evidence of absence**:
- `grep -r "content_hash" assets/` returned 0 matches
- `grep -r "content_hash" scripts/` returned 0 matches

**Severity**: P0 - This is a mandatory field for finding deduplication documented as required for all findings, but has no implementation in skill surfaces.

### 8. Finding Deduplication - sha256 computation not implemented

**Documentation claim**: SKILL.md §8.1 defines content_hash computation: `sha256(file_path + "\u001f" + line_range + "\u001f" + finding_type + "\u001f" + normalized_description_80chars)` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="520-525" />

**Grep evidence of absence**:
- `grep -r "sha256" assets/` returned 0 matches
- `grep -r "sha256" scripts/` returned 0 matches
- `grep -r "sha256" .` returned 2 matches (only in SKILL.md and changelog)

**Severity**: P0 - This is the core algorithm for content_hash computation, but has no implementation.

### 9. Finding Deduplication - normalized_description_80chars not implemented

**Documentation claim**: SKILL.md §8.1 defines `normalized_description_80chars` as "first 80 characters of the finding description, whitespace-collapsed and lowercased" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="520-525" />

**Grep evidence of absence**:
- `grep -r "normalized_description_80chars" assets/` returned 0 matches
- `grep -r "normalized_description_80chars" scripts/` returned 0 matches
- `grep -r "normalized_description_80chars" .` returned 3 matches (only in SKILL.md and changelog)

**Severity**: P0 - This is a required component of the content_hash algorithm, but has no implementation.

### 10. Agent Rules - BINDING: lines not implemented

**Documentation claim**: SKILL.md §4 ALWAYS rule 8 states "Emit setup `BINDING:` lines before workflow output" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="408-410" />

**Grep evidence of absence**:
- `grep -r "BINDING:" assets/` returned 0 matches
- `grep -r "BINDING:" scripts/` returned 0 matches
- `grep -r "BINDING:" .` returned 1 match (only in SKILL.md)

**Severity**: P1 - This is a documented agent behavior rule, but has no implementation in skill surfaces.

### 11. Lifecycle Modes - fork mode not implemented

**Documentation claim**: state_format.md §2 documents `fork` as a lineage mode with description "Reserved compatibility branch. The current runtime does not emit or accept fork review lineages" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="121-122" />

**Grep evidence of absence**:
- `grep -r "fork" assets/` returned 2 matches (only in review_mode_contract.yaml as deferred)
- `grep -r "fork" scripts/` returned 0 matches

**Severity**: P2 - This is explicitly documented as deferred/reserved, so absence is intentional per documentation. Not a drift, but worth noting as documented-but-unimplemented.

### 12. Lifecycle Modes - completed-continue mode not implemented

**Documentation claim**: state_format.md §2 documents `completed-continue` as a lineage mode with description "Reserved compatibility branch. The current runtime does not reopen completed sessions under a completed-continue lineage" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="121-122" />

**Grep evidence of absence**:
- `grep -r "completed-continue" assets/` returned 2 matches (only in review_mode_contract.yaml as deferred)
- `grep -r "completed-continue" scripts/` returned 0 matches

**Severity**: P2 - This is explicitly documented as deferred/reserved, so absence is intentional per documentation. Not a drift, but worth noting as documented-but-unimplemented.

### 13. Legal-Stop Gates - hotspotSaturationGate not in reducer

**Documentation claim**: convergence.md §6 documents `hotspotSaturationGate` as one of the review-specific gates in the legal-stop decision tree <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="114-127" />

**Grep evidence of absence**:
- `grep -r "hotspotSaturationGate" assets/` returned 0 matches
- `grep -r "hotspotSaturationGate" scripts/` returned 0 matches
- `grep -r "hotspotSaturationGate" .` returned 12 matches (only in documentation and test fixtures)

**Severity**: P0 - This is documented as a required gate in the legal-stop decision tree, but has no implementation in the reducer or config.

### 14. Legal-Stop Gates - claimAdjudicationGate not in reducer

**Documentation claim**: convergence.md §6 documents `claimAdjudicationGate` as one of the review-specific gates in the legal-stop decision tree <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="114-127" />

**Grep evidence of absence**:
- `grep -r "claimAdjudicationGate" assets/` returned 0 matches
- `grep -r "claimAdjudicationGate" scripts/` returned 0 matches
- `grep -r "claimAdjudicationGate" .` returned 10 matches (only in documentation)

**Severity**: P0 - This is documented as a required gate in the legal-stop decision tree, but has no implementation in the reducer or config.

### 15. Legal-Stop Gates - fixCompletenessReplayGate not in reducer

**Documentation claim**: convergence.md §6 documents `fixCompletenessReplayGate` as one of the review-specific gates in the legal-stop decision tree <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="114-127" />

**Grep evidence of absence**:
- `grep -r "fixCompletenessReplayGate" assets/` returned 0 matches
- `grep -r "fixCompletenessReplayGate" scripts/` returned 0 matches
- `grep -r "fixCompletenessReplayGate" .` returned 2 matches (only in convergence.md documentation)

**Severity**: P0 - This is documented as a required gate in the legal-stop decision tree, but has no implementation in the reducer or config.

### 16. Security-Sensitive Overrides - requiredClosedFindingReplay not in config

**Documentation claim**: convergence.md §1 documents `requiredClosedFindingReplay` as a security-sensitive override setting with default false and security-sensitive default true <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="66-77" />

**Grep evidence of absence**:
- `grep -r "requiredClosedFindingReplay" assets/` returned 0 matches
- `grep -r "requiredClosedFindingReplay" scripts/` returned 0 matches
- `grep -r "requiredClosedFindingReplay" .` returned 1 match (only in convergence.md documentation)

**Severity**: P0 - This is documented as a required configuration field for security-sensitive fix overrides, but has no implementation in config.

### 17. Continuity Saves - generate-context.js not called in reducer

**Documentation claim**: SKILL.md §4 ALWAYS rule 7 states "Use `generate-context.js` for continuity saves" and §6 SUCCESS CRITERIA states "Canonical continuity surfaces updated via `generate-context.js`" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="408-410" lines="462-463" />

**Grep evidence of absence**:
- `grep -r "generate-context" assets/` returned 0 matches
- `grep -r "generate-context" scripts/` returned 0 matches
- `grep -r "generateContext" .` returned 0 matches

**Severity**: P1 - This is documented as the required continuity save mechanism, but the reducer does not call it. However, this may be workflow-level rather than reducer-level responsibility.

### 18. Resource Map Emission - emitResourceMap only in reducer CLI

**Documentation claim**: loop_protocol.md §4 documents resource map emission as part of the synthesis phase <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="315-328" />

**Grep evidence of partial implementation**:
- `grep -r "emitResourceMap" scripts/` returned 10 matches (only in reduce-state.cjs CLI and function)
- `grep -r "emitResourceMap" assets/` returned 0 matches

**Severity**: P1 - The emitResourceMap function exists in the reducer but is only accessible via CLI flag `--emit-resource-map`, not integrated into the main reduceReviewState flow or config.

### 19. External Script Integration - extract-from-evidence.cjs only imported

**Documentation claim**: feature_catalog documents `extract-from-evidence.cjs` as the shared script for resource map emission <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md" lines="30-50" />

**Grep evidence of partial implementation**:
- `grep -r "extract-from-evidence" .` returned 4 matches (only in documentation and one import in reduce-state.cjs)

**Severity**: P1 - The script is imported but only used for resource map emission, which itself is only accessible via CLI flag.

### 20. Skill Routing - skill_advisor.py not in skill package

**Documentation claim**: SKILL.md §7 INTEGRATION POINTS states "Gate 2: Skill routing via `skill_advisor.py` (keywords: deep review, code audit, iterative review)" <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="496-497" />

**Grep evidence of absence**:
- `grep -r "skill_advisor.py" assets/` returned 0 matches
- `grep -r "skill_advisor.py" scripts/` returned 0 matches
- `grep -r "skill_advisor.py" .` returned 3 matches (only in SKILL.md and changelog)

**Severity**: P2 - This is documented as the integration point for skill routing, but is external to the skill package (likely in a separate repo). Not a drift within this skill, but worth noting as external dependency.

## Gaps for next iter

1. **Investigate workflow-level implementation**: Many findings (generate-context.js, emitResourceMap integration, semantic convergence signals) may be implemented at the YAML workflow level rather than in the skill surfaces searched. Next iter should search `.opencode/commands/deep/assets/deep_start-review-loop_*.yaml`.

2. **Check external dependencies**: skill_advisor.py and generate-context.js are documented but may live in other skill packages (system-spec-kit, skill-advisor). Next iter should search those locations.

3. **Verify gate implementation in YAML**: The legal-stop gates (hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate) may be implemented in the YAML workflow convergence checks rather than the reducer.

4. **Review mode contract generation**: The review_mode_contract.yaml has extensive render targets and generation markers. Next iter should verify if the generation pipeline exists and is functional.

5. **Content hash implementation location**: The content_hash field and sha256 computation may be implemented in the YAML workflow synthesis step rather than in the reducer or config.

## JSONL delta row

```json
{"iter_id":"005","timestamp_utc":"2026-05-23T17:31:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":20,"gaps_count":5,"primary_evidence_files":["SKILL.md","references/convergence.md","references/loop_protocol.md","references/state_format.md","assets/deep_review_config.json","assets/review_mode_contract.yaml","scripts/reduce-state.cjs"]}
```