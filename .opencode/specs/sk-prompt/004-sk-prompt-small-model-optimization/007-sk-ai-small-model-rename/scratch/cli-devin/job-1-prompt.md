# Job-1 — Verify rename plan for LIVE SKILL BODY + SIBLING GRAPH METADATA

## Role
You are a senior refactor reviewer. Verify a rename plan for a sentinel skill in this repo and emit a structured JSON bundle of exact edits.

## Context
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`
- Spec folder: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-prompt-small-model-rename/` (pre-approved Gate 3 — skip Gate 3).
- Skill being renamed: `.opencode/skills/sk-small-model/` → `.opencode/skills/sk-prompt-small-model/`.
- Read-only mode — do NOT edit any file. Just verify and report.

## Scope (files to inspect)
1. `.opencode/skills/sk-small-model/SKILL.md` — frontmatter `name:`, H1, in-body refs.
2. `.opencode/skills/sk-small-model/README.md` — title + body refs.
3. `.opencode/skills/sk-small-model/description.json` — `skill_id` / `path` fields.
4. `.opencode/skills/sk-small-model/graph-metadata.json` — `skill_id`, `derived.entities[]`, `derived.key_files`.
5. `.opencode/skills/sk-small-model/references/pattern-index.md` — header + self-refs.
6. `.opencode/skills/sk-small-model/changelog/v0.1.0.0.md`, `v0.2.0.0.md` — HISTORICAL; do not propose edits.
7. `.opencode/skills/cli-devin/graph-metadata.json` — `edges.enhances[].target`, `manual.related_to[]`.
8. `.opencode/skills/cli-opencode/graph-metadata.json` — same.

## Pre-planning (REQUIRED — fill before producing the bundle)
1. **Read** each in-scope file and locate every literal `sk-small-model` occurrence with line numbers.
   - Acceptance: line numbers cited; zero made-up paths.
2. **Classify** each occurrence as `live` (must edit to `sk-prompt-small-model`) or `historical` (do not edit — only the two `changelog/v0.1/0.2.md` files are historical here).
   - Acceptance: classification per occurrence; reasoning one-line each.
3. **Produce** a JSON bundle of edits per `live` occurrence: `{file_path, old_text_excerpt, new_text_excerpt, verification_command}`.
   - Acceptance: every edit's `verification_command` is a shell command that returns success only when the new text is present at the specified location.

## Action
Run pre-planning steps 1–3 in order. Then emit the bundle.

## Format
Output a single fenced JSON block under heading `## BUNDLE`. Schema:
```json
{
  "live_occurrences": [
    {"file": "<path>", "line": <int>, "context_excerpt": "<short string>", "proposed_edit": {"old_text": "<exact match>", "new_text": "<exact replacement>"}, "verification_command": "<shell command>"}
  ],
  "historical_occurrences": [
    {"file": "<path>", "line": <int>, "reason_to_preserve": "<one-liner>"}
  ],
  "unclassified": []
}
```
`unclassified` MUST be empty. If any occurrence is ambiguous, halt and explain.

End of prompt.
