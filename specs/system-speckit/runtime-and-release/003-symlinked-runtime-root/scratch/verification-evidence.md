# Verification evidence

Recorded on 2026-10-31 in the worktree `worktrees/public/304-doctor-symlink-install`, built from `main` at `20615846be`, with the uncommitted fix applied. "Main's build" means the unfixed `dist` in the primary checkout at the same commit.

## Inventories (T007, CHK-FIX-002, CHK-FIX-003)

- **Same-class producers.** `rg -n "realpathSync|pathToFileURL" .skilled/skills/system-spec-kit/runtime --glob '*.ts' --glob '*.mjs'` lists one entry guard comparing a canonical launch path with a module URL: `isMainModule`, in its three copies (`runtime/cli/lib/esm-entry.ts`, `runtime/lib/esm-entry.ts`, `runtime/cli/lib/esm-entry.mjs`). Every other hit resolves a single path for containment checks, which is a different class. The finding class is therefore `class-of-bug`, closed in all three copies.
- **Readers of `CONFIG.PROJECT_ROOT`.** `rg -n "PROJECT_ROOT" .skilled/skills/system-spec-kit/runtime --glob '*.ts' --glob '!**/dist/**' --glob '!**/tests/**'` finds 13 files. Every `CONFIG.PROJECT_ROOT` read is project-owned:
  - spec-folder roots and resolution: `config.ts`, `generate-context.ts`, `workflow.ts`, `folder-detector.ts`, `spec-folder-extractor.ts` and `nested-changelog.ts`
  - git context: `session-extractor.ts`, plus `extractGitContext` in `workflow.ts`
  - session file paths: `session-extractor.ts`

  None of them reads a runtime asset. `TEMPLATE_DIR` and the config file path stay script-relative and unchanged. Two maintenance scripts, `continuity/migrate-trigger-phrase-residual.ts` and `continuity/backfill-frontmatter.ts`, keep their own `resolveProjectRoot()`. They were outside this packet's first commit. A follow-up commit points both at the shared resolver in `core/config.ts`.

## The fix

- `isMainModule`, all three copies: the module URL is converted with `fileURLToPath` and both sides are resolved with `realpathSync`, each falling back to its unresolved form. A URL that names no file falls back to the old comparison.
- `runtime/cli/core/config.ts`: `PROJECT_ROOT` is `resolveProjectRoot()`. It returns the first match from this list:
  1. the working directory's git top-level, when it holds `.skilled/skills/system-spec-kit`
  2. the working directory, when it does
  3. the runtime repository, with a stderr line naming the fallback

  `gitTopLevel` is exported for the option check.
- `runtime/cli/continuity/generate-context.ts`: accepts `--project-root <dir>`.
  - The directory must exist. When the working directory is inside a git repository, the directory must also sit inside that repository.
  - It is split out of the arguments before the parser runs and bound to `CONFIG.PROJECT_ROOT`. The help text documents it.
- `runtime/cli/core/workflow.ts`: unchanged (see the empty-save section).

## Cases failing against the pre-change code (T004, CHK-021)

- `runtime/tests/esm-entry-symlink.vitest.ts`, with the new cases added and the old guard in place: `Tests 3 failed | 8 passed (11)`. The three failures are:
  - `recognizes the entrypoint when the module URL keeps the linked path`
  - `lets a script launched through a symlink with --preserve-symlinks-main know it was run`
  - `answers identically for symlinked and direct launch paths and module URLs, and an import`

  The two "stays dormant" cases pass before and after. They are controls against a guard that always answers yes.
- `runtime/cli/tests/symlinked-project-root.vitest.ts`, against the old build: `Tests 6 failed | 1 passed (7)`. The one that passed is `stays the runtime repository for a run inside the runtime repository itself`, the regression control.
- The save from a temp git repository that links `.skilled` and `.opencode` to main's build exited 1 with `Spec packet write blocked for "demo/001-demo": collision class is divergent-duplicate (no readable packet roots).` It wrote nothing beyond the spec it started with.

## Results after the fix (T012)

- `npx vitest run tests/esm-entry-symlink.vitest.ts` (runtime) → `Tests 11 passed (11)`.
- `npx vitest run --config ../../vitest.config.ts --project cli tests/symlinked-project-root.vitest.ts` (runtime/cli) → `Tests 10 passed (10)`:
  - the root is the linked repository, also from a subfolder
  - a run inside the runtime repository still resolves to the runtime repository
  - outside any project, the root falls back to the runtime repository and stderr says `is not inside a repository that uses spec-kit`
  - `--not-an-option` exits 1 with `Unknown option` with and without `--preserve-symlinks-main`
  - a `--project-root` outside the working repository is refused, and so is a missing one
  - `saves to the linked repository's own packet` exits 0 and writes `description.json` and `graph-metadata.json` into the temp repository, with nothing under the runtime repository's `specs/demo`
  - `honours an explicit project root from a directory outside any repository` exits 0
  - `does not exit 0 on a save with nothing in it`

## Probes through the link (T013, AC-003, AC-004)

These ran from a temp repository whose `.skilled` links to the build under test.

| Build | Flag | `generate-description.js` (no args) | `generate-context.js --not-an-option` |
|---|---|---|---|
| main's build | none | exit 1, 92 bytes (usage) | exit 1, 796 bytes |
| main's build | `--preserve-symlinks-main` | **exit 0, 0 bytes** | **exit 0, 0 bytes** |
| fixed build | none | exit 1, 92 bytes (usage) | exit 1, 854 bytes |
| fixed build | `--preserve-symlinks-main` | exit 1, 92 bytes (usage) | exit 1, 1049 bytes |

The fixed build prints a few more bytes because its help and error text name the new option.

## Empty saves (T010)

Measured before choosing:

- The Claude Stop hook (`runtime/hooks/claude/session-stop.ts:143-151`) builds its auto-save payload with `exchanges: []` on every run, carrying only a session summary, one observation and the recent context. The auto-save is on by default (`autosaveMode ?? 'enabled'`).
- Counted across the session transcripts under `~/.claude/projects` (lines, not unique events):
  - 134 `Context auto-save completed`
  - 1,643 `Context auto-save failed`, of which 1,445 or more are `Spec packet write blocked … collision class`, the root defect this packet fixes
  - 2 `Auto-save skipped`
- `generate-context --help` documents `--json '{"specFolder":"specs/001-feature/"}'` as a call. That form carries no content at all.
- In the current code an input with no content does not exit 0. A specFolder-only save and a save with only a summary, one observation and recent context both stop at `INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. … No primary evidence was captured`, exit 1. The packet's problem statement predates that gate.

Outcome: no workflow change. The existing gate already refuses a save with nothing in it, with a non-zero exit and a reason on stderr. The case `does not exit 0 on a save with nothing in it` pins that behaviour. Changing it to refuse on an empty `exchanges` array alone would fail every Stop-hook save, because those never carry exchanges.

## Gates

- `npm run typecheck` and `npm run build`, in both `runtime` and `runtime/cli` → exit 0.
- `npm run typecheck:tests` in `runtime` → 99 errors, the same 99 as main. The one that names a `config.ts` is `shared/config.ts`, a file this change does not touch.
- `quality-gate.cjs --files` on the seven changed files → `"gate": "NO_BLOCKER_FOUND"`, exit 0.
- `check-comment-hygiene.sh` on the same files → exit 0.
- Full spec-kit cli suite, `npx vitest run --config ../../vitest.config.ts --project cli` in `runtime/cli` → `Test Files 193 passed | 3 skipped (196)`, `Tests 2255 passed | 20 skipped (2275)`, exit 0. Main's baseline on the same commit was `2245 passed | 20 skipped`, so the +10 is exactly the cases in `symlinked-project-root.vitest.ts`.
- Full spec-kit runtime suite, `npx vitest run` in `runtime` → `Test Files 282 passed | 3 skipped (285)`, `Tests 4220 passed | 21 skipped (4241)`, exit 0, with 0 failures. No main baseline was captured for this suite, so its delta is not stated. The added cases in `esm-entry-symlink.vitest.ts` are four new tests plus two new rows in the copies-agree case.

## Decision: empty saves

REQ-004 asked that a save whose input holds no exchanges should refuse, or write and exit non-zero. As written, that would fail every Claude Stop-hook auto-save, because the hook never sends exchanges. It would also fail the specFolder-only refresh form that `--help` documents. The measured behaviour already meets the requirement's intent: a save with nothing in it exits 1 with `INSUFFICIENT_CONTEXT_ABORT` and names the missing evidence. The decision is to keep that gate, change no workflow code, and pin it with a test. AC-007 is met by the case `does not exit 0 on a save with nothing in it`. That case uses a payload with an empty `exchanges` array and no other content.
