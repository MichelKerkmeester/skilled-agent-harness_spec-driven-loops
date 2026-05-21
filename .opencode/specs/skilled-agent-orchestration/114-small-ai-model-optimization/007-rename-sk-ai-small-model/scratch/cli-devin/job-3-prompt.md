# Job-3 — Verify rename plan for MANUAL PLAYBOOKS + PERMISSIONS-MATRIX REFS

## Role
You are a senior refactor reviewer. Verify a rename plan for manual testing playbooks and cli-opencode permissions-matrix references; emit a structured JSON bundle.

## Context
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`
- Spec folder pre-approved (skip Gate 3): `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-rename-sk-ai-small-model/`.
- Rename: `sk-small-model` → `sk-ai-small-model`.
- Read-only mode — do NOT edit any file.

## Scope (files to inspect)
1. `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/005-swe16-via-sk-small-model-and-sk-prompt.md` — RENAME file + edit body refs.
2. `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/006-deepseek-v4-via-sk-small-model-and-sk-prompt.md` — RENAME + body.
3. `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` — INDEX update only (point at new filenames).
4. `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/004-deepseek-v4-via-opencode-go-with-sk-small-model.md` — RENAME + body.
5. `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/005-kimi-k2-6-via-opencode-go-with-sk-small-model.md` — RENAME + body.
6. `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` — INDEX update.
7. `.opencode/skills/cli-opencode/references/permissions-matrix.md` — inline refs.
8. `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json` — inline refs.

## Pre-planning (REQUIRED)
1. **Read** each in-scope file; cite line numbers of every literal `sk-small-model`.
2. **Classify** filename-rename targets vs body-only edits.
3. **Produce** the bundle: for filename renames, include both `old_path` + `new_path` keys; for body edits, include `old_text` + `new_text`. Provide `verification_command` per entry.

## Action
Run pre-planning 1–3 in order, then emit the bundle.

## Format
Extended JSON schema under heading `## BUNDLE`:
```json
{
  "filename_renames": [
    {"old_path": "<path>", "new_path": "<path>", "verification_command": "<cmd>"}
  ],
  "body_edits": [
    {"file": "<path>", "line": <int>, "old_text": "<exact>", "new_text": "<exact>", "verification_command": "<cmd>"}
  ],
  "unclassified": []
}
```
`unclassified` must be empty.

End of prompt.
