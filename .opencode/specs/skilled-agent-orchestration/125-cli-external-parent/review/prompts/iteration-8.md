DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 8 of 10
Dimension: maintainability
Prior Findings: P0=0 P1=5 P2=2
Dimension Coverage: correctness, security, traceability, maintainability (4/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: n/a
Last 2 ratios: n/a -> n/a
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 8 of 10
Mode: review
Dimension: maintainability
Review Target: Whole-program review: 125-cli-external + 126-mcp-tooling planning packets + cli-opencode GPT-5.6 rename
Review Scope Files: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/001-research-and-context/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/001-research-and-context/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/decision-record.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/004-onboard-cli-opencode/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/004-onboard-cli-opencode/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/007-routing-benchmark-and-review/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/007-routing-benchmark-and-review/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/008-cutover-and-rollout/plan.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/008-cutover-and-rollout/spec.md, .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/plan.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md, .opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/spec.md, .opencode/skills/cli-opencode/SKILL.md, .opencode/skills/cli-opencode/README.md, .opencode/skills/cli-opencode/references/cli_reference.md, .opencode/skills/cli-opencode/references/destructive_scope_violations.md, .opencode/skills/cli-opencode/changelog/v1.3.15.2.md
Prior Findings: P0=0 P1=5 P2=2

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

- Config: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deltas/iter-008.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/iterations/iteration-008.md`, this iteration's narrative markdown
  - `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deltas/iter-008.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/iterations/iteration-008.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/iterations/iteration-008.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

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

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deltas/iter-008.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).


---

## CRITICAL — STATE-LOG APPEND MECHANICS (read before writing artifacts)

The review orchestrator appends its OWN event records (graph_convergence, claim_adjudication) to `deep-review-state.jsonl` between your tool calls. Therefore:
- Append your `{"type":"iteration",...}` record with a PURE SHELL APPEND: `printf '%s\n' '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-state.jsonl` (or `echo '<json>' >> <path>`). NEVER use an Edit/patch that must match the file's current last line — it WILL fail with a false "concurrent modification"/"expected final line no longer matches" error.
- If a state-log write ever appears to conflict, DO NOT HALT and DO NOT ask for confirmation. Just append with `>>` and continue.
- You MUST still produce all three artifacts this iteration: the iteration narrative markdown, the appended state-log iteration record, and the delta JSONL file. Write them regardless of any perceived state contention.
