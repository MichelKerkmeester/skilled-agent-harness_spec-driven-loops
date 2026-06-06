# Job-2 — Verify rename plan for ROOT DOCS + AUTO-MEMORY

## Role
You are a senior refactor reviewer. Verify a rename plan for root behavioral docs and auto-memory entries and emit a structured JSON bundle.

## Context
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`
- Spec folder pre-approved (skip Gate 3): `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename/`.
- Rename: `sk-small-model` → `sk-prompt-small-model`.
- Read-only mode — do NOT edit any file. Just verify and report.

## Scope (files to inspect)
1. `AGENTS.md` — single hit at line 40 inside the "Small-model dispatch rule" bullet.
2. `CLAUDE.md` — single hit at line 40 (mirrors AGENTS.md).
3. `README.md` — single hit at line 912 inside the skill catalog.
4. `/Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/MEMORY.md` — single hit at line 2 (dispatch-matrix index entry).
5. `/Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/reference_small_model_dispatch_matrix.md` — multiple body refs (lines 3, 10, 28). **Filename slug MUST NOT change** (preserves inbound MEMORY.md link); only edit body content.
6. `/Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/feedback_skill_graph_compiler_rebuild.md` — two refs at lines 12 + 17 inside a 2026-05-18 historical incident narrative. Tag the references with "(renamed sk-prompt-small-model 2026-05-21)" but preserve the date framing.

## Pre-planning (REQUIRED)
1. **Read** each in-scope file; cite line numbers of every literal `sk-small-model`.
2. **Classify** each occurrence (`live` vs `historical-narrative-with-tag` for file #6; everything else is `live`).
3. **Produce** per-edit JSON: `{file, old_text, new_text, verification_command}`. For file #6, the new_text includes the "(renamed sk-prompt-small-model 2026-05-21)" tag preserving date.

## Action
Run pre-planning 1–3 in order, then emit the bundle.

## Format
Same JSON schema as Job-1, under heading `## BUNDLE`. `unclassified` must be empty.

End of prompt.
