---
title: "Authority Root: Durable Mode-Global Authority Directory"
description: "Resolves the single durable authority root directory that stays mode-global across concurrent and sequential runs."
---

# Authority Root: Durable Authority Directory

---

## 1. OVERVIEW

`authority-root/` owns one decision: which directory holds durable authority state for the deep-loop runtime. Authority is a single durable fact per deployment, so the authority root is mode-global and is never scoped to a run. A per-run root would fork authority across concurrent or sequential runs and let two runs disagree about which writer is canonical.

The default discovers the repository root rather than trusting a directory handed in by the caller. A caller near the write boundary usually holds a run-scoped path, such as a lineage directory or an artifact directory, and passing one of those in as the root reads as correct while giving every run its own authority. Discovery removes that class of mistake, so the fallback is the checkout instead of whatever the caller happened to be holding. `resolveAuthorityRoot()` always returns an absolute path, so a write boundary never has to handle an unresolved root.

---

## 2. CONTENTS

| File | Responsibility |
|------|---------|
| `resolve-authority-root.ts` | `resolveAuthorityRoot()` and the `ResolveAuthorityRootOptions` interface. Holds the git top-level probe, the environment override and the default state path |
| `index.ts` | Public API barrel: re-exports `resolveAuthorityRoot` and the `ResolveAuthorityRootOptions` type |

---

## 3. RESOLUTION ORDER

`resolveAuthorityRoot(options?)` picks the directory in this order.

| Step | Source | Behavior |
|------|--------|----------|
| 1 | `DEEP_LOOP_AUTHORITY_ROOT` | Wins when set and non-blank after trim. A relative value resolves against the base chosen below |
| 2 | `options.repositoryRoot` | Base when supplied and non-empty, with a relative value resolved against `process.cwd()`. Supply this only when the caller genuinely knows the checkout root, never a run-scoped directory |
| 3 | Git discovery | Base is `git rev-parse --show-toplevel` run from the current working directory. A failure or empty output yields null and falls through |
| 4 | `process.cwd()` | Final base when discovery yields null |
| 5 | Default root | `join(base, '.skilled/skills/.state/authority')` when no override is configured |

`options.environment` and `options.discoverRepositoryRoot` are seams for tests. Production reads `process.env` and shells out to git.

---

## 4. RELATED

- [`runtime/lib/`](../README.md)
- Parent skill: `.skilled/skills/system-deep-loop/SKILL.md`
