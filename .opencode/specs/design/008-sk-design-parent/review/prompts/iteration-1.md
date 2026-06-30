DEEP-REVIEW

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 50
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false
Graph: STOP_BLOCKED (uncovered_dimensions)

Review Iteration: 1 of 50
Mode: review
Dimension: correctness
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/design/008-sk-design-parent
Review Scope Files: Review the 43 child phases of the 154-sk-design-parent track. Key focus areas for correctness: 
1. Phase numbering integrity — check for duplicate phase numbers (known: 037 appears twice, 041 appears twice)
2. Parent spec.md phase map vs actual child phases — verify the phase documentation map in parent spec.md matches discovered phases 
3. Phase handoff dependencies — verify that the phase transition rules are satisfied
4. Status consistency — cross-check status claims in parent spec.md vs implementation-summary.md content per phase
5. Naming conventions — identify any naming violations (slugs embedding another packet's number, generic root slugs)
6. Metadata integrity — verify all spec.md files have required frontmatter fields

Do NOT attempt to read all 206 files. Use a sampling strategy: read parent spec.md fully, then spot-check 8-12 phases that represent different lifecycle stages (scaffold, complete, planned). Focus on demonstrable correctness violations with file:line evidence.

Prior Findings: P0=0 P1=0 P2=0

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

All paths are relative to the repo root.

- Config: .opencode/specs/design/008-sk-design-parent/review/deep-review-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/design/008-sk-design-parent/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/design/008-sk-design-parent/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/review/iterations/iteration-1.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/design/008-sk-design-parent/review/iterations/iteration-1.md`, this iteration's narrative markdown
  - `.opencode/specs/design/008-sk-design-parent/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/design/008-sk-design-parent/review/deltas/iter-001.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/design/008-sk-design-parent/review/deep-review-strategy.md`, strategy.md (in-place updates only)
  - `.opencode/specs/design/008-sk-design-parent/review/deep-review-findings-registry.json`, findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:
1. **Iteration narrative markdown** at `.opencode/specs/design/008-sk-design-parent/review/iterations/iteration-1.md`
2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/design/008-sk-design-parent/review/deep-review-state.jsonl` (use `"type":"iteration"` exactly)
3. **Per-iteration delta file** at `.opencode/specs/design/008-sk-design-parent/review/deltas/iter-001.jsonl`

## SPECIFIC GUIDANCE FOR THIS ITERATION

This is a track-level review of a phase parent with 43 child phases. The correctness dimension should check:

1. **Phase numbering integrity**: 037 appears as both `037-design-context-enforcement` and `037-design-routing-and-integration-research`; 041 appears as both `041-design-command-upgrade` and `041-sk-design-overview-conformance`. These are P0 correctness violations.
2. **Phase map completeness**: Parent spec.md documents phases 001-021, but phases 022-043 exist in the directory. At minimum, this is a P1 traceability gap.
3. **Phase handoff dependencies**: Check if transition rules allow 016-021 to be "planned" while later phases 022-034 are "complete".
4. **Status claims**: Cross-reference parent spec.md status claims against child implementation-summary.md state.
5. **Naming conventions**: Check for slug naming violations.
6. **Metadata integrity**: Verify required frontmatter fields in spec.md files across phases.

Sampling strategy: Read parent spec.md fully, then spot-read 10-15 phase spec.md and implementation-summary.md files representing different lifecycle stages. Report findings with file:line evidence.
