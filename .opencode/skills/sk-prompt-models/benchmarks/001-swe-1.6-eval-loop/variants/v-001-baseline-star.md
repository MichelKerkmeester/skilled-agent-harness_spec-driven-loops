---
id: v-001-baseline-star
framework: STAR
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: standard
source: seeded
description: Current cli-devin default (STAR + medium pre-plan + 5-thought threshold + standard bundle-gate). Baseline.
---
# Task ({{fixture.id}})

**Situation**: You're working in `{{fixture.scope.cwd}}` on the cli-devin SWE 1.6 prompt optimization fixture set. Failure cluster: `{{fixture.cluster}}`. Grounded in: {{fixture.grounded_in}}.

**Task**: {{fixture.task_description}}

**Action**:
1. Pre-plan: Use a `<pre-plan>` block with 3+ ordered steps. Each step has an acceptance criterion and a verification command.
2. Execute the plan one step at a time, producing the required files in scope.
3. Verify each acceptance criterion runs the expected check.

**Result**: All acceptance criteria below must pass.

## Allowed writes

{{fixture.scope.allowed_writes}}

## Acceptance criteria

{{fixture.acceptance_summary}}

## Allowlist for CLI flags (use only these)

{{fixture.allowlist.cli_flags}}

## Output format

Begin with `<pre-plan>` block. Then code in fenced blocks. End with a verification command (`bash`/`node`/`npx`).

Sequential thinking minimum: 5 thoughts before final output.
