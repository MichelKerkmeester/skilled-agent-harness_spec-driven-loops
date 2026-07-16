# Deep Review Iteration 009

## Dimension

Maintainability, second pass over the previously under-reviewed deep-ai-council, deep-improvement, deep-research, and manual-testing-playbook modules. This pass used graphless exact search and direct producer-consumer reads; the persisted code graph remains unavailable.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:8-31,93-135`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:7-44,54-69,359-475`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs:92-111`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:214`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:64-67,173-178`

## Findings by Severity

### P0

None.

### P1

#### R9-P1-001 [P1] Grader cache identity omits the effective model and mutable prompt content

- File: `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:388-398`
- Evidence: Real dispatch selects the grader through the mutable `GRADER_MODEL` environment value at line 43, but `gradeD4` derives its cache key from an optional caller value plus the resolved prompt pathname, not the effective model or prompt-content hash. `buildGraderBase` hardcodes the caller value to `na` at lines 465-475. The cache layer explicitly defaults missing identity to a stale model placeholder at `cache.cjs:22-24,124`, and `resolveGraderCacheDir` permits fallback to the shared legacy cache at `harness.cjs:60-69`. A model change or in-place prompt revision can therefore return a prior score without dispatching the configured grader.
- Finding class: cross-consumer
- Scope proof: Exact search for `grader_model_build_hash`, `system_prompt_path`, `buildGraderBase`, and `gradeD4` covered the cache key producer and all discovered grader consumers. The skeptic path changes only the pathname/rubric suffix; no consumer supplies an effective model build identity or prompt-content hash.
- Affected surface hints: grader harness, grader cache, D4 ablation, score-model-variant, dispute grading
- Recommendation: Derive cache identity inside the harness from the effective grader model and the bytes of the selected system prompt; require an explicit build/version identity for real grading or disable cross-call cache reuse when it is unavailable.

```json
{"type":"claim_adjudication","findingId":"R9-P1-001","claim":"The grader cache can reuse a stale score after the effective grader model or system-prompt contents change because neither value is represented by content identity in the cache key.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:39-44",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:60-69",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:388-398",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:465-475",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:22-24",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:124-133"],"counterevidenceSought":"Searched every model-benchmark CJS consumer for grader_model_build_hash, system_prompt_path, buildGraderBase, and gradeD4; no caller supplies the effective GRADER_MODEL build identity or prompt-content hash.","alternativeExplanation":"Run-scoped cache directories reduce exposure when every caller supplies one and model/prompt configuration stays immutable for the run, but the harness still documents and implements a shared-cache fallback and does not enforce either condition.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if all production callers are proven to use unique immutable cache roots and runtime validation rejects model or prompt changes for the lifetime of each root."}
```

### P2

None.

## Traceability Checks

- `spec_code`: partial. The cache module claims grader results depend on rubric and model-build identity, but the live harness supplies `na` and path identity rather than effective model and prompt-content identity.
- `checklist_evidence`: not re-entered; iteration 5 owns that completed direction.
- Overlay protocols: not re-entered; iterations 3 and 6 own those completed directions.
- Resource map: absent by configuration, so the coverage gate remains skipped.
- Review depth: complex/strict using graphless fallback. Required bug class `grader_cache_identity` produced R9-P1-001; no selected high-risk target was omitted.

## Verdict

CONDITIONAL. One new P1 finding requires remediation before the affected benchmark scores can be treated as reproducible across grader or prompt revisions.

## Next Dimension

Iteration 10 should perform a final bounded maintainability stabilization pass on deep-research and manual-testing-playbook runtime ownership seams not covered by iterations 6-9, without re-entering the saturated agent-overlay, generated-contract, benchmark-shell, or grader-cache directions.

Review verdict: CONDITIONAL
