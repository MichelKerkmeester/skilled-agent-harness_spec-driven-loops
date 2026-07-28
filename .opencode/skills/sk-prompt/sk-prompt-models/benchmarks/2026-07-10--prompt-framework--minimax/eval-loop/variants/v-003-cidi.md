---
id: v-003-cidi
framework: CIDI
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: CIDI (Context/Instructions/Details/Input) — process-oriented framing. Tests whether explicit step instructions improve MiniMax M2.7 correctness.
---
# CIDI dispatch: {{fixture.id}}

## Context
A senior implementation engineer must produce code that satisfies the acceptance criteria exactly, staying strictly in scope.
- **CWD**: `{{fixture.scope.cwd}}`
- **Failure cluster**: `{{fixture.cluster}}`

## Instructions
1. Write a `<pre-plan>` block with 3-4 ordered steps (medium density). Each step: input, output, acceptance criterion, verification command.
2. Write the code in fenced markdown blocks with the file path in a comment on the first line.
3. End with an inline `## Verification` list of the exact commands that prove acceptance.

## Details
- **Allowed writes**: {{fixture.scope.allowed_writes}}
- **Allowlist for CLI flags**: {{fixture.allowlist.cli_flags}}
- Do not invent CLI flags, functions, or files that are not in the allowlist or repo.
- **Acceptance (what "done" means)**: {{fixture.acceptance_summary}}

## Input
{{fixture.task_description}}
