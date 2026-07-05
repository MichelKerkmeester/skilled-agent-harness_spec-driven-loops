Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: correctness, fact-check iteration 1's findings + repo-wide anchor safety
Prior Findings: P0=0 P1=2 P2=0.
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 10
Mode: review
Dimension: This is iteration 2 of a documentation-truth audit (not a general code-correctness review). Iteration 1 confirmed two P1 findings: (P1-001) README.md:33/208 still say Spec Kit Documentation instead of Framework, and (P1-002) the goal plugin is only a Utility bullet, not a full FEATURES subsection. Your job this iteration: (1) CORRECTNESS-check both findings by re-deriving them independently -- re-read README.md:33 and README.md:208 verbatim, and separately grep the ENTIRE repository (not just README.md) for any other reference to the literal anchor '#spec-kit-documentation' or the exact string 'Spec Kit Documentation' that a rename could break (e.g. other markdown files, docs, or scripts linking to it) -- report any such cross-reference as a NEW finding if found; (2) verify the goal plugin facts before they get written into README.md -- read .opencode/plugins/mk-goal.js, .opencode/commands/goal_opencode.md, and .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md to confirm the plugin's actual current capabilities (session-durable objective via /goal, cross-turn [active_goal:...] injection, atomic fail-closed state, gated default-off autonomous continuation) match what a new README FEATURES subsection would need to claim -- flag ANY discrepancy between the plugin's real behavior and what the README would say about it; (3) check .opencode/specs/deep-loops/030-agent-loops-improved/changelog/README.md, before-vs-after.md, and timeline.md for internal consistency (do they already claim something about README.md or the goal plugin that would now be contradicted by this phase's fixes?).
Review Target: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit
Review Scope Files: /README.md, .opencode/plugins/mk-goal.js, .opencode/commands/goal_opencode.md, .opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md, .opencode/specs/deep-loops/030-agent-loops-improved/changelog/README.md, .opencode/specs/deep-loops/030-agent-loops-improved/before-vs-after.md, .opencode/specs/deep-loops/030-agent-loops-improved/timeline.md, whole-repo grep for 'spec-kit-documentation' and 'Spec Kit Documentation'
Prior Findings: P0=0 P1=2 P2=0

## OPERATOR DIRECTIVE (BINDING)

--stop-policy=max-iterations is set for this run. Convergence is telemetry only. Do NOT recommend stopping even if this dimension looks clean; broaden or deepen instead. The loop will run all 10 iterations regardless of your verdict.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: feature_catalog_code

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-config.json
- State Log: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/iterations/iteration-2.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files (this includes `/README.md`, `/AGENTS.md`, `/AGENTS_Barter.md` -- read them, do not edit them).
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step done by the calling AI after synthesis.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/iterations/iteration-2.md`, this iteration's narrative markdown
  - `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deltas/iter-002.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead, under a `## SCOPE VIOLATIONS` heading, and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT (IMPORTANT SCHEMA NOTE)

You MUST produce THREE artifacts per iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-2.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE of this file MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL` (no trailing whitespace, no variation).

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. **You MUST include BOTH a `findingsNew` array (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND a separate `findingDetails` array (shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel for every new finding. If zero new findings, both may be `[]`.**

Required schema:
```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"docaudit-gpt-1782923481736-742711","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via single-line JSON with newline terminator, e.g. `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-002.jsonl`. Holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (identical to the state-log append) plus per-event structured records. Each record on its own JSON line.

All three artifacts are REQUIRED and will be validated before the loop proceeds to the next iteration (or synthesis, if this is iteration 10).
