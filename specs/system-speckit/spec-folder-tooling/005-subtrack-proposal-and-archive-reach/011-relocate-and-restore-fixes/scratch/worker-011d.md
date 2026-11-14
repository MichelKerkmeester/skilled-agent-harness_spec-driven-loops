Changed only:
- `$C/spec/relocate.mjs`
- `$C/tests/relocate.vitest.ts`

### Changes

- `bareNamePattern(names, parent)` — narrowed the match so a bare name directly preceded by `<segment>/` is left alone unless the segment is `.`, `..`, or the current phase parent's folder name. This stops foreign `other-track/003-gamma` rewrites while keeping `005-p/`, `./`, `../`, and quoted/bracketed forms rewritable.
- `replaceBareName(text, from, to, parent)` — passes the parent name through, and its phase-row call passes `baseName(newParent)`.
- `bareNameEdits(entries)` — now records each file's owning parent alongside its bare-name map, and carries the parent in `summaryRows`, so each file rewrite knows which parent prefix is allowed.
- `rewrittenSummaryRow(text, edit)` — passes `edit.parent` to the pattern.
- `buildTransform(...)` bare-name pass — passes the per-file `parent` to the pattern.

### Test added

- `leaves a bare phase name that follows another folder name`

It renumbers `003-gamma` to `002-gamma` under phase parent `005-p`, with the parent spec holding all four forms. It asserts `other-track/003-gamma` stays unchanged and `005-p/002-gamma`, `./002-gamma/`, and `../002-gamma/spec.md` are rewritten.

### Failing run before the fix

```text
× leaves a bare phase name that follows another folder name 755ms

AssertionError: expected '# Phase parent fixture\n\n<!-- ANCHOR…' to contain 'other-track/003-gamma'

- Expected
+ Received
- other-track/003-gamma
...
+ See other-track/002-gamma, 005-p/002-gamma, ./002-gamma/ and ../002-gamma/spec.md.

Tests  1 failed | 112 passed (113)
```

Only the foreign-name assertion failed.

### Final run

```text
Test Files  3 passed (3)
     Tests  113 passed (113)
vitest exit: 0
```

No defect or open question observed.


## Orchestrator rerun

Three suites: Test Files 3 passed (3), Tests 113 passed (113), exit=0.
