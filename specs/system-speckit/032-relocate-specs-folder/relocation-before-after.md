---
title: "Before vs After: The Specs-Root Relocation"
description: "What all five phases of this packet did to move the canonical spec-kit tree from .opencode/specs to specs/ — the decision, the atomic flip, the tooling fixes, and the documentation cleanup, each grounded in real commits and command output."
trigger_phrases:
  - "specs root relocation before after"
  - "032 relocate specs folder summary"
importance_tier: "normal"
contextType: "reference"
---

# Before vs After: The Specs-Root Relocation

This is the whole packet's story, not one phase's. Five phases, one topology change, four different kinds of work: research, planning, one atomic mutation, and two rounds of cleanup. Every number below traces to a real commit or a real command run against this repo.

---

## 1. THE ONE-LINE VERSION

| | Before | After |
|---|---|---|
| **Canonical spec-kit tree** | `.opencode/specs/` (real directory) | `specs/` (real directory, at repo root) |
| **`.opencode/specs`** | the real directory | a relative symlink: `.opencode/specs -> ../specs` |
| **Root `specs`** | already a symlink pointing INTO `.opencode/specs` | now the physical tree itself |
| **Resolver precedence** (`config.ts`, registry files) | `.opencode/specs` checked first, `specs` as fallback | `specs` checked first, `.opencode/specs` as legacy fallback |
| **`.gitignore`** (downstream project entries) | `.opencode/specs/<project>` | `specs/<project>` |

Confirmed live, right now:
```
$ ls -ld specs .opencode/specs && readlink .opencode/specs
drwxr-xr-x@ 20 ... specs
lrwxr-xr-x@  1 ... .opencode/specs -> ../specs
../specs
```

---

## 2. PHASE 1 — RESEARCH: SHOULD THIS HAPPEN AT ALL

**Before**: an open question. The repo already had a root `specs` symlink pointing *into* `.opencode/specs`, suggesting someone anticipated this move — but nobody had mapped the blast radius. Spec-kit tooling, five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`), a global `~/.gitignore_global` special-casing both paths for downstream repos, and thousands of files referencing `.opencode/specs/...` directly.

**After**: **CONDITIONAL-GO**, reached via 4 independent research lineages across 2 rounds (`glm`/`grok` round 1, `sol`/`luna` round 2 after the operator asked for more depth). The decisive finding — missed by round 1, caught by round 2 — was that this repo **already had a substantial migration-safety subsystem** (`spec-root-registry.ts`, `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`, a 61-test validation matrix) built for the *opposite* migration direction. That single discovery changed the plan from "hand-patch ~7 literals" to "invert and reuse the existing harness" — a materially safer path than anyone had scoped going in.

**Also found**: an internal Memory MCP inconsistency (the indexer was dual-root-aware; the discovery/identity layer was canonical-locked to one root) that only surfaced from cross-reading multiple lineages' citations against each other.

---

## 3. PHASE 2 — PLAN: TWO DECISIONS THAT SHAPED EVERYTHING AFTER

**ADR-001 — build new orchestration code on the existing primitives, don't repoint the old migration function.** The `spec-root-*` subsystem existed for the reverse direction; reusing its primitives (byte-verified copy, quarantine-backed safety check) while writing a new top-level `flipToTopLevelCanonical` orchestrator was safer than either a from-scratch rewrite or trying to bend the existing function backwards.

**ADR-002 — the leak risk that reframed the whole execution plan.** Before this ADR, the working assumption was that downstream project ownership was a simple technical toggle (Option 1: stay shared, Option 2: repo-owned via a local `.gitignore` negation). A fresh-context review found that assumption wrong: `PUBLIC-RELEASE.md` shows downstream projects symlink their entire `.opencode/` directory, and git cannot track content behind a symlink — Option 2 as originally framed was **not implementable**. Worse, it surfaced a genuine **data-exposure risk in the flip itself**: post-flip, `.gitignore`'s existing `.opencode/specs/<project>` entries would match nothing (git sees only a symlink blob there), while those same projects' real content would sit at `specs/<project>/` — untracked *and unignored*, visible to `git add -A` in a public repo.

**Decision**: keep shared-by-default, add an opt-in `SPEC_KIT_SPECS_DIR` override (mirroring the already-shipped `SPEC_KIT_DB_DIR` pattern) — and, critically, **the symlink flip and the `.gitignore` rebase must land in one atomic commit, never split**. That single constraint became step 4 of phase 3's runbook and the reason it was executed as one commit instead of the more obvious two.

---

## 4. PHASE 3 — EXECUTION: THE ATOMIC FLIP, FOR REAL

This is where the topology actually changed. 11 steps, each with its own command and its own pass/fail check.

### The flip itself (step 4) — real commit, real diff

```
commit 606e55cb8a981e69fc3cdc43c711fe3ca560ff2e
feat(spec-root)!: flip specs/ to canonical, .opencode/specs to symlink
```

Landed as **one commit, 49,902 files changed** — the physical directory move plus the `.gitignore` rebase together, exactly as ADR-002 required. Real `.gitignore` diff from that commit:

```diff
-.opencode/specs/anobel.com
+specs/anobel.com
 .claude/specs/anobel.com
 .codex/specs/anobel.com

-.opencode/specs/ai-systems
-.opencode/specs/anobel.com
-.opencode/specs/barter
-.opencode/specs/z-future
+specs/ai-systems
+specs/anobel.com
+specs/barter
+specs/z-future
```

Three pre-commit checks gated the commit: `git check-ignore -v` matched all four downstream project paths under the new `specs/` location, `readlink .opencode/specs` printed `../specs`, and `git status` showed no leaked project tree anywhere. All three passed before committing. The underlying `flipToTopLevelCanonical` function refused to run at all unless the migration manifest showed zero divergent-duplicate packets (confirmed: 0 of 3,561) and byte-verified both the new tree and an independent quarantine backup before deleting the old directory.

### Steps 5-8, 10 — the wider fix, plus 6 bugs nobody had on the list

Steps 5-8 flipped the 12 originally-named call sites (7 registry resolvers + 5 `SPEC_KIT_SPECS_DIR` override sites) plus CI and operator-facing docs. Step 10's inverted 61-test validation matrix then **surfaced 6 more production files** with the same hardcoded old-direction bug that were never on the original list — `spec-root-canonical-resolver.ts`, `spec-root-write-guard.ts`, `spec-root-migration.ts` (two functions), `spec-root-migration-manifest.ts`, and `config.ts` (whose registry label had also been wrong: `legacy-first` when the code was always canonical-first). All fixed in the same pass — a real correctness bug post-flip isn't optional just because it wasn't on the original list.

### Step 9 — the reindex that couldn't clean up after itself, so a human did

A standalone Memory MCP reindex ran for ~3 hours (worked around a daemon routed to a different git worktree) and discovered new content correctly, but **structurally could not** clean up 10,459 rows still indexed under the old `.opencode/specs/` alias — both the stale-path detector and the orphan sweep check literal filesystem existence, and the new compat symlink means those old-alias paths always resolve. 2,384 of those rows already had a duplicate counterpart under the canonical path. Resolved with one transactional `DELETE FROM memory_index WHERE file_path LIKE '%.opencode/specs/%'` (10,459 rows), `PRAGMA integrity_check` and `PRAGMA foreign_key_check` both clean, FTS5 cascade confirmed 1:1.

**Before**: 10,459 stale-alias rows, unknown duplicate count.
**After**: 0 stale-alias rows, 5,733 canonical rows, 5,756 total.

### Step 11 — the sweep that proved it

```
strict-pass-freshness.ts --roots specs: 0 regressions, 0 new failures across 1,911 folders
```

---

## 5. PHASE 4 — A CLEANUP DISCOVERED MID-FLIGHT

Not the relocation itself, but scoped and run because phase 3's `scripts/` cleanup surfaced it: a maintainer-mode git filter (`setup-maintainer-filters.sh`) that kept five `SPECKIT_CODE_GRAPH_INDEX_*` flags `"true"` locally while committing `"false"` — except none of the four config files it targeted had carried those keys in a while. Dead infrastructure for a mechanism nothing used anymore.

**Before**: `.gitattributes` (21 lines, entirely this filter's mapping), a reference doc entirely describing the same filter, and 5 dead `env.SPECKIT_CODE_GRAPH_INDEX_*` reads in `index-scope.ts` with an unreachable `'env'` fallback value.
**After**: both files deleted, the 5 dead reads removed, every fallback goes straight to its safe default. Verified: `tsc --noEmit` 0 errors, `index-scope.vitest.ts` 8/8 passing with unchanged assertions, zero live references left outside historical spec docs.

---

## 6. PHASE 5 — DOES THE DOCUMENTATION AGREE WITH WHAT STEP 4 ACTUALLY DID

The flip changed the physical topology; nothing forced every README in the repo to catch up. A dual-executor `/deep:review` (one lineage completed all 10 iterations; the other never spawned a process, root-caused to a confirmed silent-failure gap in the shared fan-out runtime, out of scope to fix here) found 20 places still describing the pre-flip layout, including two real functional gaps disguised as documentation:

- **`check-no-spec-imports.cjs`** only checked imports against `.opencode/specs` — a canonical-path `specs/...` import could bypass this durable security guard entirely. Fixed: both roots now checked.
- **`memory-drift-marker.sh`** diffed `git diff-tree` against `-- .opencode/specs`, which after the flip matches only the symlink blob itself, never the real tree — every drift-marking hook was silently detecting **zero** changes no matter how much churn happened in `specs/`. Verified empirically: 0 lines detected with the old pathspec, 16 with the fixed one, same commit range.

All 20 findings fixed (2 initially deferred exactly as the review recommended, then fixed on request), 25 files touched total. Full finding-by-finding before/after: `005-readme-migration-audit/before-after.md`.

---

## 7. WHAT THE WHOLE PACKET TOUCHED, BY THE NUMBERS

| Phase | What it measured | Number |
|---|---|---|
| 1 | Research lineages run | 4 (2 rounds) |
| 3, step 4 | Files changed in the atomic flip commit | 49,902 |
| 3, step 4 | Downstream project `.gitignore` entries rebased | 4 (`ai-systems`, `anobel.com`, `barter`, `z-future`) |
| 3, steps 5-8 | Call sites flipped from the original scope | 12 (7 registry + 5 override) |
| 3, step 10 | Additional production files with the same bug, found by the inverted test matrix | 6 |
| 3, step 9 | Stale Memory MCP index rows deleted | 10,459 |
| 3, step 11 | Spec folders swept with zero regressions | 1,911 |
| 4 | Dead env-var reads removed | 5 |
| 5 | README/doc findings fixed | 20 / 20 |
| 5 | Files touched for documentation fixes | 25 |
| 5 | Real functional/security bugs found via doc audit | 2 |

---

## 8. VERIFIED, RIGHT NOW

```
$ ls -ld specs .opencode/specs
drwxr-xr-x@ 20 michelkerkmeester  staff  640 specs
lrwxr-xr-x@  1 michelkerkmeester  staff    8 .opencode/specs -> ../specs

$ grep -n "^specs/" .gitignore
265:specs/ai-systems
266:specs/anobel.com
267:specs/barter
268:specs/z-future
```

`validate.sh --recursive --strict` on the whole `032-relocate-specs-folder` family: 0 errors, 0 warnings, all 6 folders (parent + 5 phases).

---

*Per-phase detail: `001-relocation-implications-research/`, `002-migration-plan/`, `003-migration-execution/`, `004-code-graph-index-flag-deprecation/`, `005-readme-migration-audit/`. Finding-level before/after for the documentation audit specifically: `005-readme-migration-audit/before-after.md`.*
