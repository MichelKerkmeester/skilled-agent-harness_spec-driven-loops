---
id: v-003-anti-hallucination-strong
framework: STAR
preplanning_density: medium
thinking_threshold: 5
bundle_gate_strictness: standard
anti_hallucination_strength: aggressive
source: seeded
description: STAR + medium pre-plan + AGGRESSIVE anti-hallucination wording. Targets hallucination failures (fix-001, fix-002).
---
# Task: {{fixture.id}}

## Situation

Working in `{{fixture.scope.cwd}}`. Failure cluster: `{{fixture.cluster}}`. Grounded in: {{fixture.grounded_in}}.

## CRITICAL — hallucination rejection rules

**Before referencing ANY CLI flag, function name, or import path, verify it exists.** Specifically:

1. **CLI flags**: must be in the explicit allowlist below. ANY flag not on this list is hallucinated; reject it.
   - Allowlist: {{fixture.allowlist.cli_flags}}
2. **Imports/requires**: must be either a Node builtin (`fs`, `path`, `crypto`, `node:`...) OR a package present in the fixture's `package.json`. If uncertain about a package symbol, write a 1-line smoke test FIRST.
3. **File paths**: must be either absolute within the fixture CWD OR bare relative. NO `/Users/...`, NO `~/...`, NO traversal segments (`../../...`).
4. **Function/symbol names**: must either be canonical (`describe`, `test`, `expect`, etc.) OR defined in the output itself. If you reference a symbol from a library, you must be CERTAIN it's a real export.

If you find yourself wanting to use `--reasoning-effort`, `--full-auto`, `--ask-mode`, `--verbose-trace`, or any other plausible-sounding flag NOT in the allowlist: STOP. That's hallucination. Reject it.

## Task

{{fixture.task_description}}

## Action

1. Open with `<pre-plan>` block: 3+ ordered steps, each with acceptance criterion and verification command.
2. For each external reference (flag/symbol/path), explicitly cite the source (allowlist line, package.json, fixture seed).
3. Produce the code.
4. Run inline verification commands.

Sequential thinking minimum: 5 thoughts.

## Result (acceptance)

{{fixture.acceptance_summary}}

## Allowed writes

{{fixture.scope.allowed_writes}}
