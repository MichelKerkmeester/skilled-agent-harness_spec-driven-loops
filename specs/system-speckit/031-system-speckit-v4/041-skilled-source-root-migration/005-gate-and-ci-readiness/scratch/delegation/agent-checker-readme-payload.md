# Edits for unit agent-checker-readme

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md`

OLD:

~~~~text
`-- shared/tests/
    +-- improvement-journal.vitest.ts
~~~~

NEW:

~~~~text
`-- shared/tests/
    +-- check-agent-mirror-sync.vitest.ts  # covers check-agent-mirror-sync.cjs
    +-- improvement-journal.vitest.ts
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/README.md`

OLD:

~~~~text
| File | Covers |
|---|---|
| `improvement-journal.vitest.ts` |
~~~~

NEW:

~~~~text
| File | Covers |
|---|---|
| `check-agent-mirror-sync.vitest.ts` | `check-agent-mirror-sync.cjs` agent path matching and its drift exit, run from a fixture copy. |
| `improvement-journal.vitest.ts` |
~~~~
