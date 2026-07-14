DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

Spec folder: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance (pre-approved, skip Gate 3)

This is an AUTONOMOUS deep-review iteration. Gate 3 is already satisfied. Do NOT ask any Gate 3 questions. Proceed immediately.

## STATE

Iteration: 4 of 5
Dimension: traceability
Active Findings: P0=0 P1=5 P2=0
Active P1s: P1-001 (scope matrix), P1-002 (agent sync drift), P1-003 (parent/child home-install), P1-004 (deep-alignment sandbox), P1-005 (symlink following)
Dimensions covered: inventory, correctness, security (3/5 + inventory)
Provisional Verdict: CONDITIONAL

## ITERATION 4 FOCUS: TRACEABILITY

Verify spec alignment, checklist evidence, cross-reference integrity, and runtime parity:

1. **Spec/code alignment** (core spec_code): For each child phase (000-004), verify that spec.md claims match the actual implementation state. Check if tasks.md items are reflected in actual file changes. Verify implementation-summary.md claims against reality.

2. **Checklist evidence** (core checklist_evidence): For each child checklist.md, verify that checked items have cited evidence. Check if unchecked items have clear rationale. Look for items marked complete without evidence.

3. **Agent cross-runtime parity** (overlay agent_cross_runtime): Systematically compare all 13 agent triplets (.opencode/agents/X.md vs .claude/agents/X.md vs .codex/agents/X.toml). Document any semantic drift beyond expected format differences.

4. **Skill/agent alignment** (overlay skill_agent): Check if agent definitions reference correct skill paths. Verify permission frontmatter matches skill contracts.

5. **Parent/child contract consistency**: Verify that parent spec.md handoff criteria match what children claim to deliver. The P1-003 finding (home-install deferral) should be cross-referenced here.

6. **Decision record traceability**: For phases 002-004 that have decision-record.md, verify decisions are consistent with spec and implementation.

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 13 tool calls.
- Review target READ-ONLY.
- ALLOWED WRITE PATHS:
  - .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-004.md
  - .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl (append)
  - .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-004.jsonl
  - .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-strategy.md (edit)

## OUTPUT CONTRACT

1. Iteration narrative at iteration-004.md
2. JSONL appended to deep-review-state.jsonl with type:"iteration", iteration:4, route proof
3. Delta file at deltas/iter-004.jsonl

The iteration file MUST end with exactly: `Review verdict: PASS` or `Review verdict: CONDITIONAL` or `Review verdict: FAIL`
