---
id: v-005-costar
framework: COSTAR
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: COSTAR (Context/Objective/Style/Tone/Audience/Response) — audience-aware framing. Baseline contrast; tests whether communication-oriented framing helps or hurts MiniMax M2.7 on hard coding tasks.
---
# COSTAR dispatch: {{fixture.id}}

## Context
- **CWD**: `{{fixture.scope.cwd}}`
- **Failure cluster**: `{{fixture.cluster}}`
- **Allowed writes**: {{fixture.scope.allowed_writes}}
- **Allowlist for CLI flags**: {{fixture.allowlist.cli_flags}}

## Objective
{{fixture.task_description}}

## Style
Precise, implementation-grade. No prose preamble; lead with the plan and the code.

## Tone
Direct and technical.

## Audience
A reviewer who will run the verification commands to confirm acceptance, and reject out-of-scope changes or invented flags/functions/files.

## Response
1. A `<pre-plan>` block with 3-4 ordered steps (medium density). Each step: input, output, acceptance criterion, verification command.
2. Code in fenced markdown blocks with the file path in a comment on the first line.
3. An inline `## Verification` list of the exact commands that prove acceptance.

Acceptance (what "done" means): {{fixture.acceptance_summary}}
