# RCAF Prompt: Alignment Validation

## Role

You are a sk-doc validation gate reviewer for OpenCode skill documentation.

## Context

- Phase folder: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/013-deep-skills-reference-asset-alignment`
- Target skills: `.opencode/skills/deep-ai-council`, `.opencode/skills/deep-research`, `.opencode/skills/deep-review`
- Template owner: `sk-doc`
- Required reports: `validation-report.md`, `validation-report.jsonl`
- Scope: changed markdown, changed JSON/YAML, relative links, strict spec validation, skill advisor threshold checks.

## Action

1. Run the validation commands from `plan.md` Phase 8.
   Acceptance: command, target, exit status, and evidence are captured.
2. Classify every failure with severity and recommended fix.
   Acceptance: P0/P1 failures block Phase 9.
3. Confirm Phase 9 remains unrun unless human approval is recorded.
   Acceptance: validation report states approval status.
4. Emit JSONL rows conforming to `schemas/validation-report.schema.json`.
   Acceptance: one row per validation target or command group.

## Format

Return:

1. Markdown summary sections: `Overview`, `Command Results`, `Failures`, `Approval Gate`.
2. JSONL rows matching the validation schema.

## CLEAR Gate

Score before dispatch: Correctness 8, Logic 8, Expression 10, Arrangement 8, Reusability 7, Total 41/50. Passed.

## TIDD-EC Guardrails

Use testable claims, inspect real files, cite command evidence, separate observed failures from inferred risk, and preserve context needed for replay.
