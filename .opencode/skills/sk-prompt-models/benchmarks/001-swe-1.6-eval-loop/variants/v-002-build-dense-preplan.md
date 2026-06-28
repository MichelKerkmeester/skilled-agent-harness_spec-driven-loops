---
id: v-002-build-dense-preplan
framework: BUILD
preplanning_density: dense
thinking_threshold: 8
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: BUILD framework (Bounds/User-need/Implementation/Limits/Done-when) with dense pre-planning and 8-thought sequential_thinking threshold.
---
# BUILD: {{fixture.id}}

## Bounds (what's in scope, what's not)

**CWD**: `{{fixture.scope.cwd}}`
**Allowed writes**:
{{fixture.scope.allowed_writes}}

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: {{fixture.allowlist.cli_flags}}.

## User-need (what's needed)

{{fixture.task_description}}

**Failure cluster**: {{fixture.cluster}}
**Grounded in**: {{fixture.grounded_in}}

## Implementation plan (dense — every step has acceptance + verification)

Begin with `<pre-plan>` block containing AT LEAST 4 ordered steps. Each step MUST include:
- Inputs (state of files at this point)
- Outputs (state after this step)
- Acceptance criterion (specific, checkable)
- Verification command (executable)
- Stop condition (when to halt this step)

Sequential thinking minimum: 8 thoughts before producing any output.

## Limits (what NOT to do)

- Do not write absolute paths outside the fixture CWD
- Do not invent CLI flags; verify against allowlist before use
- Do not touch files outside the allowed-writes list (scope-creep is a hard fail)
- Do not assume libraries exist; if uncertain, smoke-run a 1-line import test first

## Done-when (acceptance)

{{fixture.acceptance_summary}}

Each criterion above must pass. Emit verification commands inline so they can be re-run.
