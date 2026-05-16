---
id: v-005-build-strict-bundle-gate
framework: BUILD
preplanning_density: dense
thinking_threshold: 8
bundle_gate_strictness: smoke-run-required
anti_hallucination_strength: aggressive
source: seeded
description: BUILD + dense pre-plan + STRICT bundle-gate (smoke-run required inline) + AGGRESSIVE anti-hallucination. The "maximum-discipline" variant.
---
# BUILD (strict bundle-gate): {{fixture.id}}

## Bounds

- **CWD**: `{{fixture.scope.cwd}}`
- **Allowed writes**: {{fixture.scope.allowed_writes}}
- **Off-limits**: anything outside the allowed-writes list. Scope-creep = hard fail.
- **Allowlisted CLI flags**: {{fixture.allowlist.cli_flags}}
- **Failure cluster**: {{fixture.cluster}}

## User-need

{{fixture.task_description}}

## Implementation plan (DENSE)

Open with `<pre-plan>` block containing 4+ ordered steps. Each step MUST include:
- Inputs (files + their state)
- Outputs (files + their post-state)
- Acceptance criterion (specific, checkable)
- Verification command (executable inline)
- Stop condition (when to halt)
- Bundle-gate self-check (Layer 1 imports grep + Layer 2 exports grep + Layer 3 smoke-run)

Sequential thinking: minimum 8 thoughts before final output.

## CRITICAL anti-hallucination rules

Before referencing any external symbol, verify it exists. Reject plausible-but-fake flags (`--reasoning-effort`, `--full-auto`, etc.) — they're not on the allowlist. Imports must be Node builtins or in `package.json`. Paths must be absolute-in-cwd or bare-relative.

## CRITICAL bundle-gate self-check

After producing the code:

1. **Layer 1 (imports grep)**: list every `import`/`require` statement. Verify each specifier resolves to a Node builtin OR a package in `package.json`. Reject and rewrite any that don't.
2. **Layer 2 (exports grep)**: list every `export`/`module.exports` statement. Verify each is well-formed (named identifier, valid declaration).
3. **Layer 3 (smoke-run)**: write the actual command that would run your code (`node scripts/check.cjs`, `npx vitest run`, etc.). If you cannot articulate a smoke-run, that's a failure.

If any layer would fail, REWRITE the code before emitting.

## Limits

- No paths outside CWD
- No invented CLI flags
- No imports that aren't either Node builtins or in `package.json`
- No touching files outside the allowed-writes list
- No silent "trust me" claims; cite sources

## Done-when

{{fixture.acceptance_summary}}

Each acceptance criterion must pass. Emit the verification commands inline at the end.
