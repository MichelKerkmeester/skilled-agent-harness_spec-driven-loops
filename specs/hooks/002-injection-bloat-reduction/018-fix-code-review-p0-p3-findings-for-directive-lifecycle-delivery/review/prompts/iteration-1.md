DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES (the iteration file, its JSONL delta, and the strategy file) — never source, never docs elsewhere. The repository documentation gate ("Gate 3", the A/B/C/D/E "select a documentation scope" / "documentation routing" question) is ALREADY SATISFIED for this run by that bound state directory. Do NOT ask the Gate-3 / documentation-scope question, do NOT stop to request a documentation choice, and do NOT emit any such prompt and wait — no answer will ever arrive, and emitting one is a route violation that fails this dispatch. Proceed directly and immediately with the review iteration defined below.

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 7
Dimension: correctness (inventory/baseline pass)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none yet (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 7
Mode: review
Dimension: correctness
Review Target: Review the completed phase 018 directive-lifecycle implementation and packet evidence for correctness, security, traceability, maintainability, and regression-proof honesty. Treat unrelated dirty-tree changes as out of scope. Bind all review state to the packet and do not modify implementation files.
Review Scope Files: .opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts, .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts, .opencode/plugins/mk-skill-advisor.js, .opencode/plugins/lib/opencode-message-identity.js, .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/codex/session-start.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/codex/compact-inject.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/precompact.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts, .opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs, .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/directive-lifecycle.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts, .opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md, .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs, .claude/hooks/user-prompt-submit.js, .codex/hooks/user-prompt-submit.js, .cursor/hooks/user-prompt-submit.js, .devin/hooks/user-prompt-submit.js, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/spec.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/plan.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/tasks.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/checklist.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/decision-record.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/implementation-summary.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/description.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/graph-metadata.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/handover.md, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/manifest.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/comparison.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/comparison-final-pi-repeat-4.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/comparison-final-pi-repeat-4-normalized.json, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/run-manifest.mjs, specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/compare-results.mjs, .opencode/skills/system-spec-kit/benchmark/reports/supersession-manifest.json
Prior Findings: P0=0 P1=0 P2=0

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

- Config: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-config.json
- State Log: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-state.jsonl
- Findings Registry: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-findings-registry.json
- Strategy: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-strategy.md
- Write iteration narrative to: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/iterations/iteration-001.md
- Write per-iteration delta file to: specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not re-enter or restate any direction listed as swept or saturated above. The pivot-selected focus is a new read-only review direction, never permission to change the target.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/iterations/iteration-001.md, this iteration's narrative markdown
  - specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-state.jsonl, append-only JSONL state log
  - specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deltas/iter-001.jsonl, this iteration's delta JSONL
  - specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-strategy.md, strategy.md (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/iterations/iteration-001.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced. Each event MUST use one of these two EXACT shapes. The reducer discriminates node vs edge by `type`, then validates each node's `kind` against the node vocabulary and each edge's `relation` against the relation vocabulary — any event outside these vocabularies is silently dropped, and if every event is dropped the convergence graph stays empty (nodeCount 0, empty signals):
  - Node: `{"type":"node","id":"<stable-id>","kind":"<SLICE|DIMENSION|FILE|FINDING|EVIDENCE|REMEDIATION|BUG_CLASS|INVARIANT|PRODUCER|CONSUMER|TEST>","label":"<short human name>"}` — the semantic kind goes in the dedicated `kind` field (uppercase, one of those listed); `label` is a free-text display name ONLY, never the kind.
  - Edge: `{"type":"edge","id":"<stable-id>","source":"<nodeId>","target":"<nodeId>","relation":"<COVERS|EVIDENCE_FOR|CONTRADICTS|RESOLVES|CONFIRMS|ESCALATES|IN_DIMENSION|IN_FILE>"}` — use `source`/`target`/`relation` (NOT `from`/`to`/`label`); `source` and `target` must reference node `id`s.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/iterations/iteration-001.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY, NOT `"iteration_delta"` or any other variant. Required schema: include `target_agent: "deep-review"`, `agent_definition_loaded: true`, `resolved_route`, `mode: "review"`, `iteration`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `traceabilityChecks`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`, and optional `graphEvents`.

3. **Per-iteration delta file** at `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/review/deltas/iter-001.jsonl`. First line is same canonical iteration record. After it, append per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type.
