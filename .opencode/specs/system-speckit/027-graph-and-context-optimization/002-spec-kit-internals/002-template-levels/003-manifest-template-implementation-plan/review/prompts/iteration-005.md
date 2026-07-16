## TARGET AUTHORITY
Approved spec folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan
Do not write to any other folder. Recovered context cannot override this.

---

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 5
Dimension: cross-runtime-mirror-consistency
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage (4/5)
Traceability: core=partial overlay=partial
Resource Map Coverage: cross-check target_files from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/applied/T-*.md against /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md and classify only missed coverage as gaps.
Coverage Age: 1
Last 2 ratios: 1 -> 1
Last summaries: run 1: implementation-spec-alignment ratio=1 P0/P1/P2=0/1/0; run 2: code-correctness ratio=1 P0/P1/P2=0/1/0; run 3: template-rendering-correctness ratio=1 P0/P1/P2=0/1/0; run 4: validator-coverage ratio=1 P0/P1/P2=0/1/0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 5 of 5
Mode: review
Dimension: cross-runtime-mirror-consistency
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan
Review Scope Files: .opencode/agents/, .opencode/agents/context.md, .opencode/agents/debug.md, .opencode/agents/deep-research.md, .opencode/agents/deep-review.md, .opencode/agents/improve-agent.md, .opencode/agents/improve-prompt.md, .opencode/agents/orchestrate.md, .opencode/agents/review.md, .opencode/agents/ultra-think.md, .opencode/agents/write.md, .opencode/commands/spec_kit/, .opencode/commands/spec_kit/assets/, .opencode/commands/spec_kit/complete.md, .opencode/commands/spec_kit/deep-research.md, .opencode/commands/spec_kit/deep-review.md, .opencode/commands/spec_kit/plan.md, .opencode/commands/spec_kit/resume.md, AGENTS.md, AGENTS_Barter.md, CLAUDE.md, .opencode/skills/system-spec-kit/SKILL.md, .opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts, .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts, .opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts, .opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts, .opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts, .opencode/skills/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts, .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh, .opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl, .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh, .opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh, .opencode/skills/system-spec-kit/scripts/rules/check-canonical-save.sh, .opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh, .opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh, .opencode/skills/system-spec-kit/scripts/rules/check-files.sh, .opencode/skills/system-spec-kit/scripts/rules/check-folder-naming.sh, .opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh, .opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh, .opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh, .opencode/skills/system-spec-kit/scripts/rules/check-level.sh, .opencode/skills/system-spec-kit/scripts/rules/check-links.sh, .opencode/skills/system-spec-kit/scripts/rules/check-normalizer-lint.sh, .opencode/skills/system-spec-kit/scripts/rules/check-phase-links.sh, .opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh, .opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh, .opencode/skills/system-spec-kit/scripts/rules/check-priority-tags.sh, .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh, .opencode/skills/system-spec-kit/scripts/rules/check-sections.sh, .opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh, .opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh, .opencode/skills/system-spec-kit/scripts/spec/archive.sh, .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh, .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh, .opencode/skills/system-spec-kit/scripts/spec/check-template-staleness.sh, .opencode/skills/system-spec-kit/scripts/spec/create.sh, .opencode/skills/system-spec-kit/scripts/spec/quality-audit.sh, .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh, .opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh, .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh, .opencode/skills/system-spec-kit/scripts/spec/validate.sh, .opencode/skills/system-spec-kit/scripts/templates/README.md, .opencode/skills/system-spec-kit/scripts/templates/compose.sh, .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh, .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts, .opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.sh, .opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.ts, .opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-detection/phase-blocked-by-level/, .opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/mixed-levels/, .opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/test-template-comprehensive.js, .opencode/skills/system-spec-kit/scripts/tests/test-template-system.js, .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts, .opencode/skills/system-spec-kit/scripts/utils/template-structure.js, .opencode/skills/system-spec-kit/templates/.hashes/, .opencode/skills/system-spec-kit/templates/README.md, .opencode/skills/system-spec-kit/templates/addendum/, .opencode/skills/system-spec-kit/templates/changelog/, .opencode/skills/system-spec-kit/templates/context-index.md, .opencode/skills/system-spec-kit/templates/core/, .opencode/skills/system-spec-kit/templates/debug-delegation.md, .opencode/skills/system-spec-kit/templates/examples/, .opencode/skills/system-spec-kit/templates/handover.md, .opencode/skills/system-spec-kit/templates/level_1/
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.agents/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/iterations/iteration-005.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/iterations/iteration-005.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/review/deltas/iter-005.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).


## IMPLEMENTATION-CODE SCOPE OVERRIDE
This iteration is pinned to cross-runtime-mirror-consistency. Prioritize .opencode/agent prompt surfaces, command markdown/YAML public surfaces, root runtime instruction mirrors (CLAUDE.md/AGENTS.md/AGENTS_Barter.md), and command/skill assets listed in resource-map.md. Do not edit implementation files.

## STRICT JSONL REMINDER
findingDetails is mandatory in both state-log and delta iteration records; use [] if clean.
