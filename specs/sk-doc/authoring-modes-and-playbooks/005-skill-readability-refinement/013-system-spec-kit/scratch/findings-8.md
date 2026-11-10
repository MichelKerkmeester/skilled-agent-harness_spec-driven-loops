### .skilled/skills/system-spec-kit/shared/parsing/README.md
- [P1] .skilled/skills/system-spec-kit/shared/parsing/README.md:33 | 8 | The folder tree (lines 29-35) and file table (lines 37-41) omit `secret-scrubber.ts`, a committed module in this directory that `runtime/cli/core/workflow.ts` imports. For a flat folder this table is the complete inventory, so the README hides a live module. | Insert `├── secret-scrubber.ts` after line 33, then after line 40 insert the table row with cells `secret-scrubber.ts` and `Redacts credentials to typed markers before memory content is hashed, embedded or indexed`.
- [P1] .skilled/skills/system-spec-kit/shared/parsing/README.md:65 | 1 | The boundary rule sends parser tests beside the modules, but no `*.test.ts` sits under `parsing/` and `package.json` runs only `tests/*.test.ts`. A suite added where this rule points is never executed by `npm test`. | Replace line 65 with ``- Parser tests belong in the package's `tests/` folder, beside the other suites.``
- [P2] .skilled/skills/system-spec-kit/shared/parsing/README.md:81 | 5 | The README-only skip gate comes after the three commands it exempts, so a reader runs the full test and typecheck set before learning it does not apply. | Move line 81 to immediately before line 73.

### .skilled/skills/system-spec-kit/shared/predicates/README.md
- [P1] .skilled/skills/system-spec-kit/shared/predicates/README.md:62 | 9 | `Current production callers: TBD as the validator is wired into the YAML intake path.` is a progress token in a current-state README and leaves the caller claim unresolved. | Delete that sentence from line 62 and keep the two sentences before it.
- [P1] .skilled/skills/system-spec-kit/shared/predicates/README.md:73 | 1 | The command cannot run: the repository root has no `package.json` and no `vitest` binary, `shared/predicates/` holds no test file, and the installed vitest configs include only `tests/**/*.vitest.ts` and `runtime/tests/**/*.vitest.ts`. It exits 1. | Replace `vitest run shared/predicates` with `( cd .skilled/skills/system-spec-kit/shared && node --import tsx --test tests/boolean-expr.test.ts )`, which exits 0 from the repository root.

### .skilled/skills/system-spec-kit/shared/scripts/README.md
- clean

### .skilled/skills/system-spec-kit/shared/utils/README.md
- [P1] .skilled/skills/system-spec-kit/shared/utils/README.md:32 | 8 | The topology tree (lines 30-37), KEY FILES table (lines 62-67) and ENTRYPOINTS table (lines 111-116) omit `path-containment.ts`, a committed module exporting `canonicalizeExistingPrefix`, `isPathInsideRoot` and `assertPathInsideRoot` that `runtime/cli/utils/path-utils.ts` re-exports. | Insert after line 32 `+-- path-containment.ts   # Write-boundary containment primitive`; after line 44 `utils/path-containment.ts -> node:fs and node:path`; after line 64 the KEY FILES row with cells `path-containment.ts` and `Canonicalizes the longest existing path prefix and checks that a write target stays inside an allowed root.`; and after line 113 the ENTRYPOINTS row with cells `path-containment.ts`, `Module` and `Write-boundary containment shared by every skill.`

### .skilled/skills/system-spec-kit/shared/workspace/README.md
- clean
