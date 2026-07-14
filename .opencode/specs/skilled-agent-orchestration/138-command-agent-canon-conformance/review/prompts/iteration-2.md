DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

Spec folder: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance (pre-approved, skip Gate 3)

This is an AUTONOMOUS deep-review iteration dispatched by /deep:review:auto. Gate 3 is already satisfied by the prebound spec folder. Do NOT ask any Gate 3 or documentation-route questions. Proceed immediately with the review iteration.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 2 of 5
Dimension: correctness
Prior Findings: P0=0 P1=1 P2=1
Prior P1: P1-001 — Review config under-scopes command/prompt surface (28/37 commands, 9/37 prompts in reviewScopeFiles)
Prior P2: P2-001 — Agent validator non-sequential numbering warning (deep-review.md section 0)
Dimension Coverage: inventory complete, correctness pending, security pending, traceability pending, maintainability pending (1/5)
Coverage Age: 0
Last ratio: 1.0 (iteration 1)
Provisional Verdict: CONDITIONAL hasAdvisories=true

Review Target: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance
Mode: review
Session: 2026-07-14T19:26:13Z, generation 1, lineage new
Executor: cli-codex gpt-5.6-luna max fast

## PIVOT LINEAGE

none yet

## ITERATION 2 FOCUS: CORRECTNESS

Focus on correctness dimension. Key areas:

1. **Scope coverage reconciliation** (P1-001 carry-forward): Verify whether the 9 omitted production commands (agent_router.md + 8 deep/*.md) are intentionally excluded by the spec's seven-family scope or represent a real coverage gap. Check the spec.md scope section and the lane-config.json to determine the intended surface.

2. **validate_document.py correctness**: Run `--type command` against ALL command families (create, design, doctor, memory, speckit, prompt-improve, goal_opencode) and `--type agent` against ALL 13 agents. Record any failures, warnings, or inconsistencies. The spec claims doctor/* had unnumbered headers — verify if this is still the case after any prior remediation.

3. **sync-agents.cjs correctness**: Verify the md→toml conversion logic. Check `--check` mode behavior. Look for logic errors, edge cases in YAML frontmatter parsing, and HISTORICAL_SETTINGS coverage gaps.

4. **sync-prompts.cjs correctness**: Verify the md→codex-prompt generation logic. Check `--check` drift mode. Look for path handling, exclusion rules, and symlink repair logic.

5. **Agent cross-runtime correctness**: Compare `.opencode/agents/*.md` vs `.claude/agents/*.md` for semantic parity. Check if any agent has drifted between runtimes.

6. **Codex prompt correctness**: Spot-check `.codex/prompts/*.md` against their `.opencode/commands/` sources for content parity.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS**:
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-002.md`
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl` (append only)
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-002.jsonl`
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-strategy.md` (edit sections only)
- **BANNED OPERATIONS**: rm, git rm, mv, sed -i, rmdir, find -delete, truncate redirects against non-allowed paths.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-002.md
- Write delta to: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-002.jsonl

## OUTPUT CONTRACT

Produce THREE artifacts:

1. **Iteration narrative** at iteration-002.md with sections: Dimension, Files Reviewed, Findings (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL** appended to deep-review-state.jsonl with `"type":"iteration"`, `"iteration":2`, `"mode":"review"`, `"target_agent":"deep-review"`, `"agent_definition_loaded":true`, `"resolved_route":"Resolved route: mode=review target_agent=deep-review"`, and all required fields.

3. **Delta file** at deltas/iter-002.jsonl with the iteration record plus per-event records.

The iteration file MUST end with exactly: `Review verdict: PASS` or `Review verdict: CONDITIONAL` or `Review verdict: FAIL`

Review verdict: <PASS|CONDITIONAL|FAIL>
