DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES (the iteration file, its JSONL delta, and the strategy file) — never source, never docs elsewhere. The repository documentation gate ("Gate 3", the A/B/C/D/E "select a documentation scope" / "documentation routing" question) is ALREADY SATISFIED for this run by that bound state directory. Do NOT ask the Gate-3 / documentation-scope question, do NOT stop to request a documentation choice, and do NOT emit any such prompt and wait — no answer will ever arrive, and emitting one is a route violation that fails this dispatch. Proceed directly and immediately with the review iteration defined below.

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: security
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness (0.25)
Traceability: core=partial overlay=deferred
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 1
Stuck count: 0
Claim adjudication: blocked for R1-P1-001; repair typed packet before any stop.
Graph Coverage: graphless_fallback; graph scripts unavailable under installed Node/native-module ABI.
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook
Review Scope Files: .opencode/hooks/dispatch/lib/dispatch-audit.mjs
.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs
.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
.opencode/hooks/dispatch/pi/dispatch-audit.ts
.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts
.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts
.opencode/hooks/injection-contract.md
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts
.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs
.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
.opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-failure.vitest.ts
.opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts
.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts
.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts
.opencode/skills/system-skill-advisor/README.md
.opencode/skills/system-skill-advisor/changelog/v0.11.0.0.md
.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
.opencode/skills/system-skill-advisor/leaf-manifest.json
.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts
.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/shared-factory-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts
.opencode/skills/system-spec-kit/constitutional/fable-governor.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/checklist.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/evidence/iterations.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/evidence/synthesis.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/checklist.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/checklist.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/evidence/command-receipts.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/evidence/full-corpus-baseline.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/checklist.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/checklist.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/implementation-summary.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/plan.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/scratch/.gitkeep
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/spec.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/tasks.md
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/description.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/graph-metadata.json
.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/spec.md
.pi/PLUGINS.md
.pi/SYNC.md
.pi/automode.json
.pi/extensions/README.md
.pi/settings.json
AGENTS.md
Prior Findings: P0=0 P1=1 P2=0

## PIVOT LINEAGE

none yet

Swept or saturated review directions that MUST NOT be re-entered:
none yet

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/sk-code-review/references/review-core.md` before final severity calls.

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

- Config: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-config.json
- State Log: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not re-enter or restate any direction listed as swept or saturated above. The pivot-selected focus is a new read-only review direction, never permission to change the target.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/iterations/iteration-002.md`, this iteration's narrative markdown
  - `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-strategy.md`, strategy.md (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/iterations/iteration-002.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/iterations/iteration-002.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
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

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/review/deltas/iter-002.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"findingDetails":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).


## CODE STANDARDS LOADING
Load .opencode/skills/sk-code/SKILL.md. Resolve the workflow mode through mode-registry.json, load the selected sk-code-review packet and the detected OpenCode surface evidence, and apply the relevant verification doctrine. Keep this review findings-first and read-only for all target files.

## FOLLOW-UP ADJUDICATION
The previous iteration introduced R1-P1-001 without a typed claim-adjudication packet. If it remains active or any new P0/P1 finding is recorded, include the complete typed JSON packet with findingId, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## ITERATION FINAL-LINE CONTRACT (MANDATORY)
The iteration narrative at the allowed iteration path MUST end with exactly one absolute final line. Choose the line from the evidence-backed verdict and emit no content after it:
Review verdict: PASS
Review verdict: CONDITIONAL
Review verdict: FAIL
The final line must be one of those exact strings with no trailing whitespace or variation.
