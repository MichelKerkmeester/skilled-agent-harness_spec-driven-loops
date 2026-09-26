# Development and testing

[Back to the main README](../README.md) · [Documentation index](README.md)

## Requirements

Use Node.js 22.19.0 or newer.

The repository test suite uses Node's built-in test runner. It does not need a separate test framework install.

## Run all checks

```bash
npm run check
```

This runs:

- the automated test suite;
- production TypeScript syntax and safety checks;
- documentation link and reachability checks;
- release package metadata checks.

## Run tests only

```bash
npm test
```

## Check production source only

```bash
npm run check:source
```

## Check documentation only

```bash
npm run check:docs
```

## Check the npm package contents

```bash
npm run pack:check
```

`npm pack` also runs the repository checks through the `prepack` lifecycle script.

## Real Pi smoke test

Run:

```bash
pi -e ./src/index.ts
```

Check the manager, profile autocomplete, group autocomplete, lazy search, global fallback, and dependency loading.

## Development rules

Keep these invariants:

1. Do not put the complete installed skill catalog in the model system prompt.
2. Do not bulk-load all group or profile skill bodies.
3. Do not change Pi's global `settings.json`.
4. Do not change `enableSkillCommands`.
5. Do not edit third-party `SKILL.md` files.
6. Keep global fallback bounded.
7. Keep fallback authorization limited to names returned by the latest fallback search.
8. Keep dependency traversal separate from root-scope restrictions.
9. Preserve Pi's `disable-model-invocation` behavior.
10. Use only public Pi package imports.
11. When Token Saver is off, do not modify tool results or provider requests.
12. Never compact skill instructions, explicit machine-readable output, or edit-oriented exact source reads.
13. Never emit a Token Saver recovery ID unless the exact original fits in the current bounded recovery store.
14. Never compact tool parameter schemas, parameter descriptions, required fields, enums, or validation rules.
15. Restore Token Saver's deferred active tools and remove its helper schemas during `session_shutdown`.
16. In a multi-tool continuation, any error or non-routine tool result must block reasoning-effort reduction for that continuation.
17. Treat Token Saver recovery IDs as in-memory references, not durable session-history identifiers.

## Adding a test

Place Node tests in `tests/` with the suffix:

```text
.test.mjs
```

The test command discovers them automatically.

## Documentation style

Use short sentences. Use one instruction per sentence when possible. Define a term before using it. Prefer concrete commands and examples over abstract prose.

The documentation uses ASD-STE-100-style controlled English and ELI5 clarity where practical. Use active voice. Keep sentences short. Prefer common words. Explain technical terms before using them. Avoid decorative punctuation and unnecessary em dashes.
