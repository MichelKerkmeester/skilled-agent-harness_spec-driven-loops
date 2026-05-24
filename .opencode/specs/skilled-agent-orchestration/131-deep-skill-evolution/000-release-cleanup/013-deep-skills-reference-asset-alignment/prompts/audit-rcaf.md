# RCAF Prompt: Cross-Skill Audit

## Role

You are a sk-doc skill auditor specializing in OpenCode skill packages and deep-skill resource families.

## Context

- Phase folder: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/013-deep-skills-reference-asset-alignment`
- Target skills: `.opencode/skills/deep-ai-council`, `.opencode/skills/deep-research`, `.opencode/skills/deep-review`
- Template owner: `sk-doc`
- Prompt owner: `sk-prompt` RCAF with CLEAR gate
- Scope: README, SKILL, references, assets, feature catalog root, manual testing playbook root, changelog
- Known inspection facts: council had no assets folder before this phase; research/review had runtime asset families; council README TOC anchors needed validator-compatible form.

## Action

1. Inventory the scoped artifacts and classify each against the sk-doc template owner.
   Acceptance: every row has skill, path, artifact type, and template owner.
2. Audit usefulness, relevance, correctness, links, stale paths, sibling-copy wording, and template conformance.
   Acceptance: every issue has file, line when available, evidence, severity, and recommended fix.
3. Separate fixed issues from deferred/rejected issues.
   Acceptance: deferred items carry a rationale and no fixed item lacks evidence.
4. Emit rows that validate against `schemas/audit-finding.schema.json`.
   Acceptance: output is JSONL, one finding per line.

## Format

Return JSONL only. Each line must include:

`id`, `skill`, `file`, `line`, `severity`, `template_owner`, `issue`, `evidence`, `recommended_fix`, `status`, `defer_rationale`.

## CLEAR Gate

Score before dispatch: Correctness 8, Logic 8, Expression 10, Arrangement 8, Reusability 7, Total 41/50. Passed.
