DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES (the iteration file, its JSONL delta, and the strategy file) — never source, never docs elsewhere. The repository documentation gate ("Gate 3", the A/B/C/D/E "select a documentation scope" / "documentation routing" question) is ALREADY SATISFIED for this run by that bound state directory. Do NOT ask the Gate-3 / documentation-scope question, do NOT stop to request a documentation choice, and do NOT emit any such prompt and wait — no answer will ever arrive, and emitting one is a route violation that fails this dispatch. Proceed directly and immediately with the review iteration defined below.

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `opencode run`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 5
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=3
Dimension Coverage: see strategy.md
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: n/a
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 2 of 5
Mode: review
Dimension: correctness
Review Target: worktree diff .worktrees/0118-skilled-hook-runtime-relocation (branch skilled/0118-hook-runtime-relocation) vs skilled/v4.0.0.0, commit 40d5f0d2b3
Review Scope Files: .claude/hooks/README.md, .claude/hooks/claude-posttooluse.cjs, .claude/hooks/dispatch-audit-posttooluse.mjs, .claude/hooks/dispatch-preflight-lint.mjs, .claude/hooks/fable-subagent-guard.mjs, .claude/hooks/mcp-route-guard.cjs, .claude/hooks/task-dispatch-guard.cjs, .claude/settings.json, .codex/hooks.json, .codex/hooks/README.md, .codex/hooks/dispatch-audit-posttooluse.mjs, .codex/hooks/dispatch-preflight-lint.mjs, .codex/hooks/mcp-route-guard.cjs, .codex/hooks/post-edit-quality.cjs, .cursor/hooks.json, .cursor/hooks/README.md, .cursor/hooks/mcp-route-guard.mjs, .cursor/hooks/task-dispatch-guard.mjs, .devin/hooks.v1.json, .devin/hooks/README.md, .devin/hooks/dispatch-audit-posttooluse.mjs, .devin/hooks/dispatch-preflight-lint.mjs, .devin/hooks/mcp-route-guard.cjs, .devin/hooks/post-edit-quality.cjs, .devin/hooks/task-dispatch-guard.cjs, .opencode/logs/README.md, .opencode/plugins/README.md, .opencode/plugins/mk-cli-dispatch-audit.js, .opencode/plugins/mk-deep-loop-guard.js, .opencode/plugins/mk-git-preflight-advisory.js, .opencode/plugins/mk-mcp-route-guard.js, .opencode/plugins/mk-post-edit-quality.js, .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs, .opencode/plugins/tests/mk-post-edit-quality.test.cjs, .opencode/runtime-hooks/README.md, .opencode/runtime-hooks/dispatch/claude/dispatch-audit-posttooluse.mjs, .opencode/runtime-hooks/dispatch/claude/dispatch-preflight-lint.mjs, .opencode/runtime-hooks/dispatch/codex/dispatch-audit-posttooluse.mjs, .opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs, .opencode/runtime-hooks/dispatch/devin/dispatch-audit-posttooluse.mjs, .opencode/runtime-hooks/dispatch/devin/dispatch-preflight-lint.mjs, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs, .opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs, .opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.test.mjs, .opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs, .opencode/runtime-hooks/mcp-route-guard/codex/mcp-route-guard.cjs, .opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs, .opencode/runtime-hooks/mcp-route-guard/devin/mcp-route-guard.cjs, .opencode/runtime-hooks/mcp-route-guard/lib/mcp-route-guard.cjs, .opencode/runtime-hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs, .opencode/runtime-hooks/post-edit-quality/claude/claude-posttooluse.cjs, .opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs, .opencode/runtime-hooks/post-edit-quality/devin/post-edit-quality.cjs, .opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs, .opencode/runtime-hooks/task-dispatch/claude/fable-subagent-guard.mjs, .opencode/runtime-hooks/task-dispatch/claude/task-dispatch-guard.cjs, .opencode/runtime-hooks/task-dispatch/cursor/task-dispatch-guard.mjs, .opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs, .opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs, .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md, .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/hooks/pretooluse-still-fires-under-bypass.md, .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md, .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md, .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/README.md, .opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md, .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md, .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md, .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md, .opencode/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md, .opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md, .opencode/skills/mcp-code-mode/runtime/lib/README.md, .opencode/skills/sk-code/code-opencode/references/shared/hooks.md, .opencode/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md, .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs, .opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md, .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs, .opencode/skills/system-spec-kit/references/hooks/injection-contract.md, .pi/extensions/README.md, .pi/extensions/dispatch-audit.ts, .pi/extensions/dispatch-preflight-lint.ts, .pi/extensions/git-preflight-advisory.ts, .pi/extensions/mcp-route-guard.ts, .pi/extensions/post-edit-quality.ts
Prior Findings: P0=0 P1=0 P2=3

## PIVOT LINEAGE

none yet

Swept or saturated review directions that MUST NOT be re-entered:
none yet

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

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

- Config: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not re-enter or restate any direction listed as swept or saturated above. The pivot-selected focus is a new read-only review direction, never permission to change the target.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/iterations/iteration-002.md`, this iteration's narrative markdown
  - `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-strategy.md`, strategy.md (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/iterations/iteration-002.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/iterations/iteration-002.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

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

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> .opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deltas/iter-002.jsonl` (path pre-substituted, e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"findingDetails":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
