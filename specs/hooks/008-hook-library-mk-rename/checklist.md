---
title: "Verification Checklist: Hook Library mk- Prefix Rename"
description: "Objective pass/fail gates for the hook-library mk- rename, each with the exact command that proves it."
trigger_phrases:
  - "hook rename checklist"
  - "mk rename verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->

> Each item names the observable check. Mark `[x]` only after reading the
> command's output and exit status. Validation items run on `main` post-merge.
> Commands use `git ls-files` / `git grep` — there is no `rg` binary in this
> environment (only an interactive shell function).

---

## A. File renames & history
- [x] No `mk-*.js` in `.opencode/plugins/` — `git ls-files '.opencode/plugins/*.js' | grep -E '/mk-'` → empty
- [x] No `mk-*.test.cjs` in `.opencode/plugins/tests/` → empty
- [x] No `.opencode/bin/mk-*-launcher.cjs` → empty; `system-spec-memory-launcher.cjs` + `system-skill-advisor-launcher.cjs` present (Phase 5)
- [x] Every moved plugin/test/launcher shows `rename` in `git diff --summary` (REQ-004). Caveat: the per-concern `opencode/` entry **symlinks** are retargeted, so they land as delete+add (a symlink's target blob changed), not `R100` — expected for links.

## B. Reference completeness (functional surfaces only)
- [x] `verify-no-mk.sh all` → `CLEAN: 0 canonical mk-/mk_ tokens … (content + symlink name/target)`
- [x] `mcp__mk_spec_memory__` / `mcp__mk_skill_advisor__` / `mcp__mk_code_index__` refs → 0 outside `specs/**` (Phase 5; `git grep -c 'mcp__mk_'` → 0)
- [x] Delta report: baseline (T1.3) 2443 → 0 content occurrences; + 15 stale `mk-` symlinks (missed by content grep) → 0
- [x] **Gate hardened**: `verify-no-mk.sh` now also scans tracked symlink **names + target blobs** (`git grep` skips mode-120000 blobs and never searches filenames) — the blind spot that let the 15 symlinks survive is closed.

## C. Loadability & behavior
- [x] Deps-free tests green: `hook-flags.test.cjs` 13/13, `goal-core.test.cjs` 49/49, `goal-pi.test.mjs` 21/21
- [x] Zero `AssertionError` across `.opencode/plugins/tests/`; every failure is `ERR_MODULE_NOT_FOUND` for `@opencode-ai/plugin` / `dist/` (absent in a bare worktree — environmental, not a rename regression)
- [ ] **(on `main`)** Full plugin + advisor/bridge vitest suite green (needs `node_modules` + built `dist`)
- [ ] **(on `main`)** OpenCode session loads all renamed plugins (no plugin-load error in logs)
- [ ] **(on `main`, Phase 5 cutover)** spec-memory daemon binds `/tmp/system-spec-memory`; skill-advisor binds `/tmp/system-skill-advisor`; MCP handshake + one tool call per renamed namespace

## D. Backward compatibility
- [x] Old `MK_*` disable flag still silences its hook — `hook-flags.test.cjs` legacy-alias cases pass; `env-aliases.cjs` forward-maps `MK_*`→new at load (REQ-005)
- [x] Longest `/tmp/system-*` socket path ~41 chars « 104 (REQ-010)
- [x] **New** documented/exported kill switches now actually disable their hook (audit P0/P1): `OPENCODE_GOAL_PLUGIN_DISABLED`, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SYSTEM_SPECKIT_COMPLETION_DISABLED`, `SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED`, `SYSTEM_DISPATCH_DISABLED`, `CODEX_WATCHDOG_DISABLED` — all verified `disabled=true` via `isHookEnabled()`

## E. Scope containment
- [x] `git status` shows no `specs/**` path outside `specs/hooks/008-hook-library-mk-rename/` (REQ-006)
- [x] Diff touches no `.worktrees/**`, `barter/**`, `node_modules/**`, `dist/**`
- [x] No behavior change: kill-switch resolution stays fail-open; the audit fix is purely **additive** alias recognition — no canonical name changed, `concernFlag()` unchanged (NFR-R01/02)

## F. Packet completion (on `main`)
- [ ] `validate.sh specs/hooks/008-hook-library-mk-rename --strict` → Exit 0 (SC-002)
- [ ] `description.json` + `graph-metadata.json` regenerated (not hand-stubs)
- [ ] `implementation-summary.md` authored with evidence
- [ ] Memory reindex run

## G. Post-sweep correctness audit (Composer 2.5, cli-cursor `ask` mode)
> An independent diff audit was run to catch blind-sed failures a token grep cannot: inverted assertions, dangling refs, config/identity drift, over-replacement. Verdict: MCP/daemon layer aligned; the real damage was an **incomplete Phase-4 env rename** — the sweep renamed kill-switch names in tests/examples/plugin constants but never taught `hook-flags.cjs` the new canonical set. All findings verified against code before fixing.

- [x] **P0** skill-advisor plugin `envDisablesPlugin()` ignored the exported `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` → added it (+`_PLUGIN_`) to `LEGACY_ALIASES['skill-advisor']`; plugin now honors it with no plugin-file edit
- [x] **P0** bridge disable checked only the contract's `SPECKIT_…` name while configs export `SYSTEM_…` → bridge now honors both (`advisorDisabledByEnv`), contract + its 8 dependent tests untouched
- [x] **P1** `hook-flags.test.cjs` had 4 failing assertions (goal/completion/spec-memory/dispatch new names) → resolver taught the names; 13/13
- [x] **P1** goal delegation (`goal-core`/plugin) — `OPENCODE_GOAL_PLUGIN_DISABLED` now disables; goal-core 49/49
- [x] **P1** `hook-flags.env.example` `SYSTEM_DISPATCH_DISABLED` / `CODEX_WATCHDOG_DISABLED` now functional via aliases
- [x] **P1** completion sentinel — `SYSTEM_SPECKIT_COMPLETION_DISABLED` restored as a `completion` alias (matches pre-rename `MK_SPECKIT_COMPLETION_DISABLED` behavior)
- [x] **Note** 15 stale `mk-*.js` per-concern `opencode/` entry symlinks (name + target both `mk-`) renamed to new stems and retargeted; all 16 `opencode/` entries resolve
