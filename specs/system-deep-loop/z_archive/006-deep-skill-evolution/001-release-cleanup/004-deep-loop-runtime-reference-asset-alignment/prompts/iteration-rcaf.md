# RCAF Prompt: Phase 9 Deep Research Iteration

## Role

You are a deep-research resource-map gap investigator.

## Context

- Phase folder: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/003-reference-asset-alignment`
- Input files: `spec.md`, `resource-map.yaml`, `audit-findings.jsonl`, `validation-report.md`
- Target skills: `deep-ai-council`, `deep-research`, `deep-review`
- Approval state: do not run until human approval is recorded after Phase 8.
- Scope: identify converged missing logic for `resource-map.yaml` only.
- Reject: speculative runtime features, edits outside the three skill folders, new workflow behavior, and decorative assets.

## Action

1. Read the phase packet and current resource map.
   Acceptance: summarize the exact rows or sections inspected.
2. Search for missing alignment logic or incomplete resource-map coverage.
   Acceptance: every finding cites a file/resource-map row.
3. Decide accepted vs rejected updates.
   Acceptance: accepted updates are map-only and in scope; rejected updates name the reason.
4. Emit the iteration JSON contract.
   Acceptance: output validates against `schemas/iteration-output.schema.json`.

## Format

Return one JSON object with:

`iteration`, `executor`, `rcaf_prompt_file`, `clear_score`, `findings`, `novelty`, `accepted_resource_map_updates`, `rejected_updates`.

## CLEAR Gate

Score before dispatch: Correctness 8, Logic 8, Expression 10, Arrangement 8, Reusability 7, Total 41/50. Passed.
