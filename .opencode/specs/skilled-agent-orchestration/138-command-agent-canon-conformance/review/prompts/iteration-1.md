DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 5
Dimension: inventory
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 5
Mode: review
Dimension: inventory
Review Target: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance
Review Scope Files: parent spec.md + 5 child phases (000-004) with full Level 2 doc sets; 37 command markdown files under .opencode/commands/; 13 .opencode/agents/*.md + 13 .claude/agents/*.md; 13 .codex/agents/*.toml; 37 .codex/prompts/*.md; 3 key scripts (validate_document.py, sync-agents.cjs, sync-prompts.cjs)
Prior Findings: P0=0 P1=0 P2=0

## PIVOT LINEAGE

none yet

Swept or saturated review directions that MUST NOT be re-entered:
none yet

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

- Config: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not re-enter or restate any direction listed as swept or saturated above. The pivot-selected focus is a new read-only review direction, never permission to change the target.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-001.md`, this iteration's narrative markdown
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl`, append-only JSONL state log
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-001.jsonl`, this iteration's delta JSONL
  - `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-strategy.md`, strategy.md (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet directory is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## ITERATION 1 FOCUS: INVENTORY PASS

This is the inventory pass (iteration 0 equivalent). Your task:

1. **Build an artifact map** across the 138 packet:
   - Read the parent spec.md to understand the decomposition
   - List all child phase folders and their document sets
   - Inventory the command files (37 under .opencode/commands/)
   - Inventory the agent files (13 .opencode + 13 .claude + 13 .codex)
   - Inventory codex prompts (37 under .codex/prompts/)
   - Identify the 3 key scripts

2. **Identify file types and estimate complexity**:
   - Command docs: markdown with numbered router-core sections
   - Agent docs: markdown with YAML frontmatter (name, description, mode, permission)
   - Codex agents: TOML format
   - Scripts: Python (validate_document.py) and JavaScript (sync-agents.cjs, sync-prompts.cjs)
   - Spec docs: markdown with YAML frontmatter and SPECKIT markers

3. **Classify the spec-folder target structure**:
   - Phase parent with lean trio (spec.md, description.json, graph-metadata.json)
   - 5 children with Level 2+ doc sets
   - 000-foundations has alignment/ artifacts from prior deep-alignment run

4. **Run validate_document.py against representative command and agent files** to establish baseline conformance state:
   ```bash
   python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type command .opencode/commands/doctor/mcp.md
   python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type command .opencode/commands/memory/search.md
   python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --type agent .opencode/agents/deep-review.md
   ```

5. **Record findings** if any P0/P1/P2 issues are discovered during the inventory pass.

6. **Set Next Focus** for iteration 2 (correctness dimension).

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"1","status":"complete","focus":"inventory","dimensions":["inventory"],"filesReviewed":["path:line"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":0.0,"sessionId":"2026-07-14T19:26:13Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":0}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deltas/iter-001.jsonl`. First line: same canonical iteration record. Subsequent lines: per-event structured records.

All three artifacts are REQUIRED.

Review verdict: PASS (or CONDITIONAL or FAIL)
