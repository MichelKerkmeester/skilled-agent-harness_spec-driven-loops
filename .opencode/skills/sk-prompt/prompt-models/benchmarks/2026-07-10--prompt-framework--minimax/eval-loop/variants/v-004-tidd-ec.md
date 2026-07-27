---
id: v-004-tidd-ec
framework: TIDD-EC
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: TIDD-EC (Task/Instructions/Do's/Don'ts/Examples/Context) — guardrail-heavy framing. Tests whether explicit do/don't rails improve MiniMax M2.7 scope + hallucination discipline.
---
# TIDD-EC dispatch: {{fixture.id}}

## Task
{{fixture.task_description}}

## Instructions
1. Write a `<pre-plan>` block with 3-4 ordered steps (medium density). Each step: input, output, acceptance criterion, verification command.
2. Write the code in fenced markdown blocks with the file path in a comment on the first line.
3. End with an inline `## Verification` list of the exact commands that prove acceptance.

## Do's
- Stay strictly within **Allowed writes**: {{fixture.scope.allowed_writes}}
- Use only flags in the allowlist: {{fixture.allowlist.cli_flags}}
- Satisfy every acceptance criterion exactly.

## Don'ts
- Do not invent CLI flags, functions, or files that are not in the allowlist or repo.
- Do not touch files outside Allowed writes.
- Do not add prose disclaimers in place of code.

## Examples
Output shape: a `<pre-plan>` block, then fenced code with a path comment, then a `## Verification` command list.

## Context
- **CWD**: `{{fixture.scope.cwd}}`
- **Failure cluster**: `{{fixture.cluster}}`
- **Acceptance (what "done" means)**: {{fixture.acceptance_summary}}
