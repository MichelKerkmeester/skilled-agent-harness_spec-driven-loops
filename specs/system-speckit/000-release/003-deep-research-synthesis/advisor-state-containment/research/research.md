# Advisor State-Containment — Deep Research Findings

> Converged early at 7/10 iterations (2 cli-devin lineages: grok-4-6-xhigh, deepseek-v4-pro-max). Root cause, ship-state, and fix were established; remaining iterations would only add corroboration. All claims below carry file:line / commit evidence from the live tree.

## Verdict

**The stray-state-directory leak is NOT resolved.** Partial containment *did* ship in-window (two commits on 2026-07-27), but it does not cover the primary leak path, so the advisor still writes state into `specs/` packets — confirmed by fresh leak timestamps (2026-08-02, 2026-08-08). The dedicated fix packet, `system-skill-advisor/017-advisor-audit-and-state-containment`, is a **Draft at 0%**.

## Scope (the real number)

Of the ~23 nested `.opencode` directories under `specs/`, only **3–4 are advisor-written** — each a single untracked `.opencode/skills/.advisor-state/skill-graph-generation.json` (gitignored). The rest are test fixtures (16 command-tree fixtures under `035-command-surface-benchmark`), vendored clones (`external/…`), a plugin-install spill (`specs/barter/…`), and a historical research dump. **So the changelog's "23 stray dirs" over-counts the advisor leak by ~6×.**

Confirmed advisor leaks: `specs/hooks/008-pi-caching…/001-correctness-floor/…` (2026-08-08), `specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/…` (2026-08-02), `specs/system-deep-loop/z_archive/026-goal-opencode-plugin/…` (2026-07-04).

## Root cause

The advisor resolves its state path relative to the **session CWD, not the repo root**, and auto-creates the tree:

- `user-prompt-submit.ts:138-142` — `workspaceRootFor(input)` returns `input.cwd ?? process.cwd()` with **no anchoring**. When a Claude Code / OpenCode session runs from inside a `specs/<packet>` directory, that packet path becomes the "workspace root".
- `freshness/generation.ts:12` — `GENERATION_RELATIVE_PATH = .opencode/skills/.advisor-state/skill-graph-generation.json` is joined to that root.
- `generation.ts:109-110` — `writeGenerationAtomic` calls `mkdirSync(dirname, { recursive: true })`, so the full nested tree is created inside the packet on first write.
- Trigger: `readAdvisorGeneration` hits `ENOENT` (a fresh spec dir never has that tree) and writes generation `0` (`reason: LEGACY_ADVISOR_GENERATION_BUMP`).

Full chain: `buildSkillAdvisorBrief → getAdvisorFreshness → readAdvisorGeneration → getAdvisorGenerationPath(workspaceRoot)`.

## What shipped vs. what's missing

**Shipped in-window (real, partial):**
- `541d321d7ea` (2026-07-27) — `repo-root.mjs`: a shared anchored resolver (sentinel-based walk-up + `hoistAboveOpencodeTree` fallback), wired into `spec-gate-core.mjs resolveGuardPaths()`.
- `cc6ff3c17d8` (2026-07-27) — upgraded `workspace-root.ts` from `hoistAboveSpecsTree` (the v3.6-era specs-only deny-list) to `hoistAboveOpencodeTree` (a structural boundary that hoists above the outermost `.opencode`).

**Still unguarded (why it leaks anyway):** the hook entry point `workspaceRootFor()` and the generation-counter / daemon-DB writers never call the new `repo-root.mjs` resolver — they still pass the raw CWD. So the anchored resolver exists but the primary leak path bypasses it.

## Writers that can leak (4 of 9)

Generation counter (`freshness/generation.ts` — **primary**), daemon quarantine DB (`daemon/watcher.ts:294`), daemon lease DB (`daemon/lease.ts:55-95`), skill-graph DB (`skill-graph-db.ts:269`). Safe writers: the Python subprocess advisor (computes `REPO_ROOT` from `__file__`) and hook metrics (write to `tmpdir()`).

## Recommended fix

1. **Anchor at the entry point.** Make `workspaceRootFor()` (and the generation/daemon-DB path resolvers) route through the existing `repo-root.mjs` anchored resolver instead of `input.cwd ?? process.cwd()`. The precedent already exists: `skill-advisor-cli-fallback.ts:176-198 findCliFallbackPaths` already walks up to the repo root — apply the same anchoring here.
2. **Fail closed on `specs/`.** As a backstop, refuse to write `.advisor-state` when the resolved path lands inside a `specs/` subtree.
3. **Clean the existing leaks** (the 3–4 stray `.advisor-state` dirs) and add a regression check that runs the advisor from a `specs/<packet>` CWD and asserts no nested `.advisor-state` is created.

Blast radius: advisor mcp-server runtime + hooks; the anchored resolver already ships, so the change is wiring existing tooling into the unguarded path — low risk, high value.

## Method / provenance

7 iterations (grok-4-6-xhigh ×3, deepseek-v4-pro-max ×4), read-only in a disposable HEAD worktree, via cli-devin. The deepseek lineage carried the deepest code trace; grok confirmed the live on-disk state and corrected the leak count. Converged early on operator instruction once root cause + ship-state + fix agreed across both lineages.
