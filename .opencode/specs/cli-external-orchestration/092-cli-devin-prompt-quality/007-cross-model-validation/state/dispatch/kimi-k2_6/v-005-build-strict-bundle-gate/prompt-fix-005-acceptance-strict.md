# BUILD (strict bundle-gate): fix-005-acceptance-strict

## Bounds

- **CWD**: `fixtures/fix-005-acceptance-strict/seed`
- **Allowed writes**:   - src/deep-equal.ts
  - src/deep-equal.test.ts
- **Off-limits**: anything outside the allowed-writes list. Scope-creep = hard fail.
- **Allowlisted CLI flags**: (none)
- **Failure cluster**: Hard correctness / acceptance precision

## User-need

Write deepEqual(a: unknown, b: unknown): boolean returning true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and {a:1} vs {a:1, b:undefined} treated as equal. Provide implementation in src/deep-equal.ts.

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

- [ac-001] deterministic: 12 deterministic test cases pass
- [ac-002] grep: function exported

Each acceptance criterion must pass. Emit the verification commands inline at the end.
