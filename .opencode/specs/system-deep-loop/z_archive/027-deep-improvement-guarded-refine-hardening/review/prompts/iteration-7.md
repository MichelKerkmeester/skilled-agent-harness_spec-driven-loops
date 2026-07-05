# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 7 of 10
Dimension: traceability (deep pass 2: OVERLAY protocols)
Prior Findings: P0=0 P1=0 P2=~25 (all advisories)
Dimension Coverage: 4/4; composite vote reached STOP candidate at iter 6 but graph convergence says CONTINUE
Coverage Age: 3
Last 2 ratios: 0.43 -> 0.0
Stuck count: 1 (ratio 0.0 <= 0.05)
Provisional Verdict: PASS-candidate hasAdvisories=true

DEEP PASS FOCUS (iteration 7): the four OVERLAY traceability protocols, not yet executed:
(a) skill_agent: does the deep-improvement SKILL.md lane table + routing agree with the agents/deep-improvement.md lane-awareness paragraph (mode ids, command names, script paths) after the non-dev-ai-system rename?
(b) agent_cross_runtime: compare .opencode/agents/deep-improvement.md with .claude/agents/deep-improvement.md byte-for-byte; flag drift.
(c) feature_catalog_code: does feature_catalog/06--non-dev-ai-system/guarded-refine-loop.md describe behavior the code actually has (adapter flags, kill-switch list, pilot evidence claims)?
(d) playbook_capability: does manual_testing_playbook/11--non-dev-ai-system/synthetic-deficit-and-gauntlet.md describe runnable procedures (correct commands, correct expected outcomes incl. the gauntlet attack count)?
Also re-verify the two REMAINING claims from iteration 3 (loop_contract missing LOOP_SKIP_PROBE + promote_skip) are reflected consistently anywhere else those surfaces are documented. Record traceabilityChecks results per protocol in the JSONL record.

Review Iteration: 7 of 10
Mode: review
Dimension: traceability overlay protocols: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
Review Target: spec-143 guarded-refine-loop delta (deep-improvement Lane D + anti-Goodhart cross-lane guards + packaging-side loop hosts)
Review Scope Files: 
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/model-family.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/rubric-guard.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/extract-deliverable.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/fixture-lint.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/promote-candidate.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/non-dev-ai-system/init_packaging.py
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/packaging_config.example.json
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/shared/heldout_and_gold_sets.md
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-non-dev-ai-system-loop.md
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_loop/loop.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_loop/gauntlet.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_gates/gates.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_gates/derive.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/regrade.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/calibrate.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/hvr_lint.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/run.sh
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/_loop/loop.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/_gates/gates.py
  - /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/benchmark/grader/regrade.py
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/calibrate.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/derive.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/deterministic_lint.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/gates.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/gauntlet.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/grader_prompt.md.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/regrade.py.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/run.sh.template
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/fixture_authoring.md
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/grader_calibration.md
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/loop_contract.md
  - /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/operator_guide.md
Prior Findings: P0=0 P1=0 P2=25

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deltas/iter-007.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/iterations/iteration-007.md`, this iteration's narrative markdown
  - `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deltas/iter-007.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/iterations/iteration-007.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/iterations/iteration-007.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

### v2 Search Depth Output (when scopeClass is standard or complex)

For standard or complex review scope, set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to the v1 fields above:

- `reviewDepthApplicability`: `{scopeClass,enforcement,reason,evidenceRefs}` where `scopeClass` is `trivial`, `standard`, or `complex`; `enforcement` is `strict`, `warn`, or `skip`.
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`. Name how targets were chosen, what high-risk targets were omitted, and whether graph/semantic search was available, unavailable, or partial.
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` where `graphCoverageMode` is `graph`, `graphless_fallback`, or `unavailable_blocked`.
- `searchLedger[]`: ledger rows with required `id`, `dimension`, `targetRefs`, `bugClass`, `disposition`, and `rationale`; include `hypothesis` or `invariant` (at least one); include `searchActions[]` with `{method,queryOrPath,result,evidenceRefs}`.
- Each ledger row needs exactly one disposition link: `linkedFindingId` for `finding` (must match an id in `findingDetails[]`), `ruledOutReason` for `ruled_out`, `deferredReason` for `deferred`, `blockedReason` for `blocked`, or `notApplicableReason` for `not_applicable`.

Trivial-scope exemption: when `scopeClass` is `trivial` and `enforcement` is `skip`, `searchLedger` may be `[]`, but `reviewDepthApplicability.evidenceRefs` MUST cite proof that the target is trivial.

Compact v2 example:

```json
{"reviewDepthSchemaVersion":2,"reviewDepthApplicability":{"scopeClass":"standard","enforcement":"strict","reason":"non-trivial target","evidenceRefs":["path/to/file.ts:42"]},"targetSelection":{"selectedTargets":["path/to/file.ts"],"selectionReason":"state transition producer","discoveryMethods":["direct_read","exact_search"],"omittedHighRiskTargets":[],"graphStatus":"unavailable","semanticSearchStatus":"partial","evidenceRefs":["path/to/file.ts:42"]},"searchCoverage":{"requiredBugClasses":["state_transition"],"covered":[],"ruledOut":["state_transition"],"deferred":[],"blocked":[],"graphCoverageMode":"graphless_fallback"},"searchLedger":[{"id":"SL-001","dimension":"correctness","targetRefs":["path/to/file.ts"],"bugClass":"state_transition","hypothesis":"state transition can skip validation","searchActions":[{"method":"direct_read","queryOrPath":"path/to/file.ts","result":"guard present on all branches","evidenceRefs":["path/to/file.ts:42"]}],"disposition":"ruled_out","rationale":"all branches call the guard","ruledOutReason":"verified by direct read"}]}
```

Legacy unversioned records remain valid during rollout. Phase D validator behavior should warn on legacy shallow records and strictly enforce this shape only for explicit v2 records.

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/139-deep-improvement-guarded-refine-hardening/review/deltas/iter-007.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).

## SESSION

sessionId: 2026-06-10T06:19:24Z
generation: 1
lineageMode: new
run: run-007
