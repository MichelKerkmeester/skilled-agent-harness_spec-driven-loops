DEEP-REVIEW

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 50
Dimension: security
Prior Findings: P0=2 P1=5 P2=2
Dimension Coverage: correctness done (1/4), security pending
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1
Last iteration: correctness — 9 findings (2 P0, 5 P1, 2 P2), newFindingsRatio=1.0
Stuck count: 0
Provisional Verdict: FAIL (2 active P0)
Graph: STOP_BLOCKED (uncovered_dimensions, dimensionCoverage=0)

Review Iteration: 2 of 50
Mode: review
Dimension: security
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/design/008-sk-design-parent

Prior Findings:
- P0-001: Duplicate phase number 037
- P0-002: Duplicate phase number 041
- P1-003: Parent phase map truncated at 021
- P1-004: Parent "Complete" status contradiction
- P1-005: Phase 042 has no spec docs
- P1-006: 041-design-command-upgrade unfilled template
- P1-007: graph-metadata.json stale/broken references
- P2-008: All session_dedup fingerprints are zero-placeholders
- P2-009: 001 spec.md stale scaffold artifacts

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

- Config: .opencode/specs/design/008-sk-design-parent/review/deep-review-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/design/008-sk-design-parent/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/design/008-sk-design-parent/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/review/iterations/iteration-2.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS** only: review/iterations/iteration-2.md, review/deep-review-state.jsonl, review/deltas/iter-002.jsonl, review/deep-review-strategy.md, review/deep-review-findings-registry.json
- **BANNED OPERATIONS**: rm, rm -rf, git rm, mv, sed -i, rmdir, find ... -delete, output redirect truncate > against any file not in allowed-write list
- Append JSONL record with `"type":"iteration"` exactly.

## OUTPUT CONTRACT

1. Iteration narrative at `.opencode/specs/design/008-sk-design-parent/review/iterations/iteration-2.md`
2. JSONL iteration record appended to state log
3. Delta file at `.opencode/specs/design/008-sk-design-parent/review/deltas/iter-002.jsonl`

## SECURITY DIMENSION GUIDANCE

Track-level spec doc review. Security focus areas:
1. **Credential exposure**: Search spec docs, plan.md, tasks.md, implementation-summary.md for API keys, tokens, passwords, secrets, auth credentials
2. **Path disclosure**: Search for absolute file paths that could expose system structure (beyond the already-known workspace paths)
3. **Auth/authz references**: Check for security-sensitive terms that might indicate undocumented auth mechanisms
4. **Configuration secrets**: Look for environment variables, config files, or setup instructions that might expose sensitive defaults
5. **Injection risks in scripts**: Check any script commands or bash snippets embedded in spec docs for injection vectors

Sampling strategy: Focus on files most likely to contain security-relevant content:
1. Grep across ALL 206 spec docs for security-sensitive patterns (APIs, tokens, secrets, passwords, keys, env vars)
2. Read files that match for confirmation and context
3. Check implementation-summary.md files for any commands/scripts logged
4. Review decision-record.md files for any security-related decisions

Use grep extensively (6-8 calls) to scan for patterns, then read only matched files (2-4 calls).

End iteration-2.md with: "Review verdict: PASS" or "Review verdict: CONDITIONAL" or "Review verdict: FAIL"