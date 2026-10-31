---
title: "Implementation Summary: Symlinked runtime: entry guard, project root and empty saves"
description: "Complete. The entry guard canonicalizes both sides so it survives the symlink flag, the project root comes from the caller's repository instead of the script's location, and an empty save keeps the refusal it already had."
trigger_phrases:
  - "symlinked runtime root implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/037-symlinked-runtime-root"
    last_updated_at: "2026-10-31T17:40:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Closed the packet with the build record, both inventories and the empty-save decision"
    next_safe_action: "None. Rerun the cited cases before reopening a row"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/config.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-symlinked-runtime-root-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Refuse an empty-exchanges save, or write it and exit non-zero: neither. A save with nothing in it already exits 1 with INSUFFICIENT_CONTEXT_ABORT, so workflow.ts is unchanged and a test pins the behaviour"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-symlinked-runtime-root |
| **Status** | Complete |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A save run from a repository that links `.skilled` now resolves that repository as its project root and writes to its own packet. The entry guard no longer falls silent under `--preserve-symlinks-main`. An explicit `--project-root` overrides the derived root, and a save with nothing in it keeps refusing with a named reason.

### The entry guard

`isMainModule` compares two canonical paths. The module URL goes through `fileURLToPath` and both sides go through `realpathSync`, each falling back to its unresolved form when resolution fails. Under `--preserve-symlinks-main` Node keeps the linked spelling in the module URL as well as the launch path, so the two sides only match once both are resolved. The same change is in all three copies: `runtime/cli/lib/esm-entry.ts`, `runtime/lib/esm-entry.ts` and `runtime/cli/lib/esm-entry.mjs`. A module URL that names no file falls back to the comparison the old guard made.

### The project root

`runtime/cli/core/config.ts` exports `resolveProjectRoot()`, and `PROJECT_ROOT` is its result. It returns the first of:

1. the working directory's git top-level, when it holds `.skilled/skills/system-spec-kit`
2. the working directory, when it does
3. the runtime repository, with a stderr line naming the fallback

`gitTopLevel` is exported for the option check. `TEMPLATE_DIR` and the config file path stay script-relative, because those files belong to the runtime and every consuming repository shares one runtime.

`runtime/cli/continuity/generate-context.ts` accepts `--project-root <dir>`. The option is split out of the arguments before the parser runs, so the parser never sees it. The directory must exist, and when the working directory sits inside a git repository the directory must also sit inside that repository. It binds `CONFIG.PROJECT_ROOT` before the write guard runs, and the help text documents it.

### Empty saves

The packet asked for a refusal, or a write with a non-zero exit, on a save whose input holds no exchanges. The measurements argued against changing anything:

- The Claude Stop hook builds its auto-save payload with `exchanges: []` on every run, carrying only a session summary, one observation and the recent context. The auto-save is on by default.
- Across the session transcripts under `~/.claude/projects`: 134 `Context auto-save completed`, 1,643 `Context auto-save failed` — 1,445 or more of them `Spec packet write blocked … collision class`, the defect this packet fixes — and 2 `Auto-save skipped`.
- `generate-context --help` documents `--json '{"specFolder":"specs/001-feature/"}'`, a form that carries no content at all.
- In the current code an input with no content does not exit 0. A specFolder-only save and a save with only a summary, one observation and the recent context both stop at `INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. … No primary evidence was captured`, exit 1.

So `workflow.ts` is unchanged. Refusing on an empty `exchanges` array alone would fail every Stop-hook save, and the case `does not exit 0 on a save with nothing in it` pins the behaviour that already meets the requirement.

### Inventories

- **Same-class producers.** `rg -n "realpathSync|pathToFileURL" runtime --glob '*.ts' --glob '*.mjs'` finds one entry guard that compares a canonical launch path with a module URL: `isMainModule`, in its three copies. Every other hit resolves a single path for a containment check, which is a different class. The finding class is `class-of-bug`, closed in all three copies.
- **Readers of `CONFIG.PROJECT_ROOT`.** `rg -n "PROJECT_ROOT" runtime --glob '*.ts' --glob '!**/dist/**' --glob '!**/tests/**'` finds 13 files. Every read is project-owned: spec-folder roots and resolution in `config.ts`, `generate-context.ts`, `workflow.ts`, `folder-detector.ts`, `spec-folder-extractor.ts` and `nested-changelog.ts`; git context in `session-extractor.ts` and `extractGitContext` in `workflow.ts`; session file paths in `session-extractor.ts`. None of them reads a runtime asset.

### Files Changed

Paths below are from the repository root. `runtime/` in the prose is `.skilled/skills/system-spec-kit/runtime/`.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts` | Modified | Canonicalize both sides of the entry guard |
| `.skilled/skills/system-spec-kit/runtime/lib/esm-entry.ts` | Modified | The same change in the runtime workspace copy |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.mjs` | Modified | The same change in the plain-JavaScript copy |
| `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts` | Modified | `PROJECT_ROOT` from `resolveProjectRoot()` |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modified | `--project-root`, checked against the working repository |
| `.skilled/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts` | Modified | Cases for the guard under `--preserve-symlinks-main` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts` | Created | Saves through a real `.skilled` link from a temp repository |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`npm run typecheck` and `npm run build` ran in `runtime` and in `runtime/cli`. Each new case was then run against the pre-change code to watch it fail — apart from the controls, which must pass either way — the fix went in, and the same cases were rerun from the final state. The two probes ran from a temp repository whose `.skilled` links to the build under test, with and without `--preserve-symlinks-main`. `validate.sh --strict` ran on this folder last.

Two plan entries changed. `workflow.ts` stayed untouched, for the reason under Empty saves. The save cases went into one new file, `runtime/cli/tests/symlinked-project-root.vitest.ts`, rather than beside the existing generate-context tests, so every case that runs through a link sits in one place.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the root from the caller's git top-level | The script's location names the runtime, and one runtime serves every consuming repository |
| Keep template and asset paths script-relative | Those files live in the runtime, so the script's location is the right anchor for them |
| Accept `--project-root` only inside the working repository | The option may narrow the target, but it must not let a save write outside the repository the caller stands in |
| Change no workflow code for empty saves | The existing gate already exits 1 with a named reason, and refusing on an empty `exchanges` array alone would fail every Stop-hook auto-save |
| Canonicalize each side on its own, with a fallback | `--preserve-symlinks-main` leaves either side non-canonical, and a resolution failure must not raise |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/esm-entry-symlink.vitest.ts` in `runtime` | `Tests 11 passed (11)`. The new cases against the old guard: `Tests 3 failed \| 8 passed (11)` |
| `npx vitest run --config ../../vitest.config.ts --project cli tests/symlinked-project-root.vitest.ts` in `runtime/cli` | `Tests 10 passed (10)`. Against main's build: `Tests 6 failed \| 1 passed (7)` |
| Full spec-kit cli suite | `Test Files 193 passed \| 3 skipped (196)`, `Tests 2255 passed \| 20 skipped (2275)`, exit 0. Main's baseline was `2245 passed \| 20 skipped`, so the delta is the 10 new cases |
| Full spec-kit runtime suite | `Test Files 282 passed \| 3 skipped (285)`, `Tests 4220 passed \| 21 skipped (4241)`, exit 0, 0 failures |
| `npm run typecheck` and `npm run build` in both workspaces | exit 0 |
| `npm run typecheck:tests` in `runtime` | 99 errors, the same 99 as main |
| `quality-gate.cjs --files` on the seven changed files | `"gate": "NO_BLOCKER_FOUND"`, exit 0 |
| `check-comment-hygiene.sh` on the same files | exit 0 |
| `generate-description.js` with no arguments, through the link | Main's build with the flag: exit 0, 0 bytes. Fixed build with the flag: exit 1, 92 bytes of usage, the same as without it |
| `generate-context.js --not-an-option`, through the link | Main's build with the flag: exit 0, 0 bytes. Fixed build with the flag: exit 1, 1049 bytes, against 854 without it — the extra bytes name the new option |
| A save through the link from a temp git repository | Main's build: exit 1, `Spec packet write blocked for "demo/001-demo": collision class is divergent-duplicate (no readable packet roots)`. Fixed build: exit 0, with `description.json` and `graph-metadata.json` in the temp repository and nothing under the runtime repository's `specs/demo` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/037-symlinked-runtime-root --strict` | The rules over the five documents pass, including `STATUS_CROSS_DOC_CONSISTENCY`, `AC_COVERAGE` at 8/8 and `AC_CLOSURE` at 8/8. The overall result is `RESULT: FAILED` on two `GENERATED_METADATA_*` errors: `description.json` and `graph-metadata.json` are stale against the edited docs, and `repair-derived.cjs` rewrites them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two maintenance scripts now share the resolver** A follow-up commit replaced the local `resolveProjectRoot()` in `continuity/migrate-trigger-phrase-residual.ts` and `continuity/backfill-frontmatter.ts` with the one in `core/config.ts`, so they resolve the caller's repository too. `tests/backfill-frontmatter.vitest.ts`, `tests/memory-quality-phase6-migration.vitest.ts` (4 passed) and `node tests/test-frontmatter-backfill.js` (pass=15, fail=0, the same as main) pass after it.
2. **The graph-metadata write guard trusts a workspace only when it carries `.opencode`** A linked repository without that folder still receives no `graph-metadata.json`, so the test repository links both `.skilled` and `.opencode`.
3. **`npm run typecheck:tests` in `runtime` is red** 99 errors, the same 99 as main. The one that names a `config.ts` is `shared/config.ts`, a file this change does not touch.
4. **The runtime suite has no main baseline** The cli suite's delta is exactly the 10 added cases. The runtime suite's delta is not stated because no baseline was captured for it.
<!-- /ANCHOR:limitations -->
