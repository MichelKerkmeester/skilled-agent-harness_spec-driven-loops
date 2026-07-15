DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 10 of 10
Dimension: security
Prior Findings: P0=0 P1=6 P2=4
Dimension Coverage: correctness, security, traceability, maintainability (4/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: n/a
Last 2 ratios: n/a -> n/a
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 10 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/sk-prompt/006-sk-prompt-parent
Review Scope Files: .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/checklist.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/decision-record.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/002-architecture-decision/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/003-scaffold-hub/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/005-foldin-prompt-models/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/006-advisor-and-integration/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/007-routing-benchmark-and-review/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/plan.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/spec.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/tasks.md, .opencode/specs/sk-prompt/006-sk-prompt-parent/description.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json, .opencode/specs/sk-prompt/006-sk-prompt-parent/spec.md, .opencode/skills/sk-prompt/SKILL.md, .opencode/skills/sk-prompt/mode-registry.json, .opencode/skills/sk-prompt/hub-router.json, .opencode/skills/sk-prompt/graph-metadata.json, .opencode/skills/sk-prompt/description.json, .opencode/skills/sk-prompt/README.md, .opencode/skills/sk-prompt/prompt-improve/README.md, .opencode/skills/sk-prompt/prompt-improve/SKILL.md, .opencode/skills/sk-prompt/prompt-models/README.md, .opencode/skills/sk-prompt/prompt-models/SKILL.md, .opencode/skills/sk-prompt/prompt-models/description.json, .opencode/skills/sk-prompt/benchmark/.gitkeep, .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.json, .opencode/skills/sk-prompt/benchmark/live-final/skill-benchmark-report.md, .opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.json, .opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md, .opencode/commands/prompt-improve.md, .opencode/agents/prompt-improver.md, .claude/agents/prompt-improver.md
Prior Findings: P0=0 P1=6 P2=4

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

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

- Config: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-config.json
- State Log: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/iterations/iteration-010.md
- Write per-iteration delta file to: .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deltas/iter-010.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/iterations/iteration-010.md`, this iteration's narrative markdown
  - `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deltas/iter-010.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/sk-prompt/006-sk-prompt-parent/review/iterations/iteration-010.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/iterations/iteration-010.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
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

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deltas/iter-010.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
