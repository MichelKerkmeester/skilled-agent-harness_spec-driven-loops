---
title: "Feature Specification: Hook Feature Flags + Full Hub Index"
description: "Give every repo-authored runtime hook a per-concern kill-switch honored across all six runtimes, behind one shared guard with a master switch, and complete the .opencode/hooks index so every hook (skill-owned as symlink, global as real file) is browsable in one place."
status: "in-progress"
completion_pct: 15
trigger_phrases:
  - "hook feature flags"
  - "feature-flag all hooks"
  - "hooks hub full index"
  - "MK_HOOKS_DISABLED master switch"
  - "per-concern hook kill-switch"
importance_tier: "high"
contextType: "spec"
---
# Feature Specification: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Two coupled outcomes for the repo's ~90 authored runtime hook adapters across six runtimes (Claude, Codex, Cursor, Devin, OpenCode, Pi):

1. **Feature flags** — every hook honors a kill-switch. A single shared guard (`isHookEnabled(concern)`) checks a master switch (`MK_HOOKS_DISABLED`) then a per-concern switch (`MK_<CONCERN>_DISABLED`), default **on**, so adding it changes no behavior until a flag is set. Legacy `MK_*_DISABLED` / `SPECKIT_*_DISABLED` names are absorbed as aliases so existing operator config keeps working.
2. **Full hub index** — `.opencode/hooks/` becomes the single browsable index of every hook. Global (skill-independent) hooks keep their real code there; skill-owned hooks (advisor, spec-gate, git-preflight, spec-kit lifecycle) are **symlinked in** under `<concern>/<runtime>/`, code staying in the owning skill.

---

## 1. PROBLEM

- Kill-switches today live almost entirely at the OpenCode plugin level (7 of 13 `mk-*.js`). The equivalent per-runtime adapters (`claude/`, `codex/`, `cursor/`, `devin/`, `pi/`) run unconditionally, so a concern is disableable on OpenCode but not elsewhere — roughly 80 of 90 adapters have no flag.
- The `.opencode/hooks/` hub deliberately excludes the skill-engine hooks (per its README), so there is no one place to see every hook the repo installs.

## 2. DECISIONS (operator-locked)

- **Full index** (not portable-cores-only): skill-owned hooks are symlinked into the hub; this revises the hub README's prior "why only four concerns moved" stance.
- **Per-concern-family flags** (not per-individual-adapter): one env var per hook family, honored by every runtime adapter of it, plus a master switch. ~15 flags cover ~90 adapters.
- **Default on**: a kill-switch only silences a hook when explicitly set.

## 3. SCOPE

### In scope
- Shared guard (`hook-flags.{cjs,mjs,ts}`) + master switch + tests.
- Wire the guard into every authored adapter across all six runtimes, grouped by concern.
- Symlink every skill-owned hook into the hub; update the hub README + `injection-contract.md`.
- Cross-runtime validation (loaders clean, master off = all silent, per-concern toggles verified, symlinks resolve).

### Out of scope
- Changing any hook's actual behavior/logic (only a guarded early-return is added).
- Third-party / non-authored hooks.

## 4. CONCERN FAMILIES

`dispatch` · `mcp-route-guard` · `post-edit-quality` · `task-dispatch` · `goal` · `skill-advisor` · `spec-gate` · `spec-memory` · `completion` · `session-lifecycle` · `git-preflight` · `directive-lifecycle` · `dist-freshness` · `codex-watchdog` · `permission-policy`

## 5. PHASES

1. Guard + master switch + tests (shipped).
2. Pilot: `mcp-route-guard` end-to-end across all six runtimes + prove switches gate it.
3. Remaining hub concerns (dispatch, post-edit-quality, task-dispatch, goal).
4. Skill-owned concerns (skill-advisor, spec-gate, completion, session-lifecycle, git-preflight, spec-memory, …).
5. Full hub index (symlinks) + README + `injection-contract.md`.
6. Cross-runtime validation.

## 6. ROLLBACK

`MK_HOOKS_DISABLED=1` silences the entire enforcement layer instantly. Each per-concern switch is independently reversible. The guard is default-on, so every phase is behavior-neutral until a flag is set.

## 7. STATUS

**In progress — Phase 1 shipped.** Shared guard (`.opencode/hooks/shared/hook-flags.{cjs,mjs,ts}`) + master switch, `node --test` 7/7 pass (incl. cross-flavor facade parity). Phase 2 pilot next.
