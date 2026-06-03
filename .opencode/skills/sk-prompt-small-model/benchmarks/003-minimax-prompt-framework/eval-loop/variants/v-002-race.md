---
id: v-002-race
framework: RACE
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: RACE (Role/Action/Context/Execute) — compressed, execution-first framing. Tests whether front-loading the action improves MiniMax M2.7 efficiency.
---
# RACE dispatch: {{fixture.id}}

## Role
Senior implementation engineer. Code must satisfy the acceptance criteria exactly and stay strictly in scope.

## Action
{{fixture.task_description}}

## Context
- **CWD**: `{{fixture.scope.cwd}}`
- **Failure cluster**: `{{fixture.cluster}}`
- **Allowed writes**: {{fixture.scope.allowed_writes}}
- **Allowlist for CLI flags**: {{fixture.allowlist.cli_flags}}
- **Acceptance**: {{fixture.acceptance_summary}}

## Execute
1. A `<pre-plan>` block with 3-4 ordered steps (medium density). Each step: input, output, acceptance criterion, verification command.
2. Code in fenced markdown blocks with the file path in a comment on the first line.
3. An inline `## Verification` list of the exact commands that prove acceptance.

Do not invent CLI flags, functions, or files that are not in the allowlist or repo. Stay within Allowed writes.
