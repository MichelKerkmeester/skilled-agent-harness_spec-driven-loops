---
title: "Research: how Barter does overlays, sync and re-pin today"
description: "Evidence map of Barter's overlay manifest, replay and sync engine, lock, hooks, rules and re-pin procedure, with the failure modes ranked. Every claim cites a file and line read on 2026-11-06."
trigger_phrases:
  - "barter overlay mechanics research"
  - "overlay sync repin failure modes"
importance_tier: "normal"
contextType: "research"
---
# Research: how Barter does overlays, sync and re-pin today

No deep-research loop ran for this packet. Every claim below comes from a file read or a read-only command run directly. A model pass would only have added hypotheses to re-verify against the same files. Paths starting `barter-overlays/` are under `ai-speckit/skilled/`. `SP` is the 034 orchestrator scratchpad, `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled-barter-ai-speckit/2381e5f3-8c4e-4571-be7c-b46c0bf7f162/scratchpad/034`.

## 1. The mechanics

- **Pin and tree.** `skilled/` is a `git archive` copy of one Skilled commit, untracked in ai-speckit (`git ls-files skilled` prints 0). The manifest's `pin.commit` names it, `ef8e79f85a` when read.
- **Manifest.** `overlay-manifest.json` held 116 overlays: 88 `file` (76 of them guarded by `pinnedSha256`), 16 `directory`, 8 `json-entry`, 2 `remove-root`, 1 `marked-section`, 1 `skill-root`. It also lists 19 `layoutLinks`, 9 `regenerate` steps and 9 `verifyGenerated` checks. 110 overlays target `.skilled`, 5 target `.opencode` and 1 targets `.hermes`.
- **Replay.** `replay.cjs` plans every overlay, writes nothing when any plan is blocked, then applies and runs the regenerate steps (`replay.cjs:1241-1288`). `--check` prints `RESULT: PASSED` or `FAILED` (`replay.cjs:1189-1239`).
- **Sync.** `sync.cjs` wraps replay with a per-destination hash file, `sync-state.json`. It classifies each destination as `in-sync`, `overlay-edited`, `live-edited`, `both-changed` or `upstream-moved` (`sync.cjs:185-207`). It offers `--status`, `--apply`, `--capture`, `--guard` and `--pre-commit`. Its apply only runs the plans that hold an `overlay-edited` record (`sync.cjs`, `commandApply`).
- **Guards.** A protected-name rule refuses `.env*` and non-allowed names containing `token` (`sync.cjs:89-101`). Per-runtime hooks call one core: the pre-write guard asks `sync.cjs --guard`, and the post-edit pass runs `sync.cjs --apply` in ai-speckit sessions (`overlay-sync-core.cjs:147-198`). OpenCode and Hermes use plugins, and Pi uses a layout link.
- **Lock.** `.build-lock` is written with noclobber by scratch tools only (`with-lock.sh:8`, `run-leaf.sh:31`). `with-lock.sh:13-14` also demands a clean `--status` before running its command.
- **Commit gate.** Barter's pre-commit runs `sync.cjs --pre-commit` and `replay.cjs --check` (`barter-overlays/git-hooks/pre-commit:83` and `:93`).
- **Rules.** `barter-overlay-first.md` says a Barter-owned file changes in `barter-overlays/` first and reaches the tree only through `sync.cjs --apply`. The ai-speckit `CLAUDE.md` Barter rules repeat it.
- **Re-pin procedure.** A seven-step manual runbook (`barter-overlays/README.md:47-130`). Each re-pin packet adds scratch tooling: 034 has a 141-line `integrate.sh` that builds a dry tree, `restore-pinned.cjs`, `with-lock-repin.sh` and `manifest-edit.cjs`.

## 2. Failure modes, ranked by cost when they bite

1. **No rollback.** The tree is untracked, so a re-pin overwrites files nothing can restore. The runbook's "restore from git" rollback does not exist (034 `facts.md:19`, open question at `facts.md:49`).
2. **Upstream fixes made in place are reverted.** Program 033 edited routers in the vendored tree. Skilled got 36 router edits, 32 of them equal to Barter's live copies, and the re-pin still brings back 4 routers and the template with the old sentence (034 `facts.md:20-22`). Skilled has since committed the fix as `ab14c6777b`.
3. **The integration trap.** A pinned overlay whose canonical copy changed blocks replay, because the destination holds the last applied Barter copy, which matches neither the pin nor the new source. Root cause, inferred from code and consistent with every observation: `replay.cjs` plans with no accepted hashes (`replay.cjs:1190`, `:1242`), while `sync.cjs:241` passes `state.files`. The workaround is `SP/restore-pinned.cjs`, called from `SP/integrate.sh:68-70`. A test that runs replay with accepted hashes on the 034 case would confirm the root cause.
4. **The sync blind spot.** sk-git `SKILL.md` is in both `replace` and `retained` of `sk-git-root`. `replay.cjs:847` leaves retained paths out of the outputs, `sync.cjs` skips them in `destinationCandidates`, and `overlay-sync-core.cjs:91-92` treats them as unowned. `status` reads clean while the live copy is stale, the guard allows a live edit, and only `replay.cjs --check` sees the drift. The test fixture never puts a retained file in `replace` (`tests/sync.test.cjs:124-126`).
5. **The lock is advisory.** Nothing in the engine, hooks or plugins reads `.build-lock` (the grep prints 0 lines). The post-edit hook runs `sync.cjs --apply` with no lock (`overlay-sync-core.cjs:193`). `with-lock.sh` cannot wrap the steps between the copy and the first replay, so 034 wrote `with-lock-repin.sh` without the check (`facts.md:24`).
6. **Protected-name false positive.** Upstream's `tokens.css` made `sync.cjs --status` exit 2 (`facts.md:23`). The guard was patched to an extension allow list in place.
7. **The re-pin is rebuilt by hand every time.** The runbook is prose, and 034 rebuilt staging, dry-tree integration and dead-entry inventory in scratch (`facts.md:28-36`).
8. **json-entry operation order.** Operations in one set are planned against the file before any of them runs, so a `setKeyOnItem` on an item the same set inserts failed (030 `implementation-summary.md:128`).
9. **Root files.** A whole-archive copy also replaces `REPO RULES.md` and `AGENTS.md`, which carry Barter rows no overlay protects (`README.md:147-154`).

## 3. Concurrency note

While this research ran, `sync.cjs` changed content between two reads a minute apart, and its mtime stayed at Nov 5 22:59. The manifest was rewritten at 07:43. The lock was held at 07:43 and released by 07:50. Any count above is a snapshot of a tree that was being re-pinned.

## 4. Skilled-side facts

- `/doctor:update`'s engine is git-history based: `release-update.cjs:311-314` resolves the repository with `git rev-parse --show-toplevel`, `:350` lists `.skilled` with `git ls-tree`, and `:829` reads `HEAD`. It has an apply lock with an owner record (`release-update.cjs:2041-2065`) and an `unlock` command.
- `/doctor:symlink` links a project to a Skilled checkout with a plan digest and a run record, and never copies (`symlink.md:82-93`).
- No Skilled skill or command has an overlay concept for downstream projects. The doctor route manifest lists 16 routers (`_routes.yaml:6-22`), and each route becomes an advisor command bridge (`_routes.yaml:23-29`).
- Each doctor command names its owning skill in a `skill_agent` tag, and `derive-command-bridges.cjs:141-152` credits the command's advisor bridge to that skill. The deriver reads routers from the fixed `.skilled/commands/doctor/` (`derive-command-bridges.cjs:22`). On 2026-11-06, `system-spec-kit` was the tag for env, helper, install, mcp, runtime-mirrors, setup, speckit, symlink and update. `sk-doc` held agents-md and sk-skill, `sk-code` held ci and sk-code, and git, deep-loop and skill-advisor each named their own skill. Four contract tests pin a tag value: install, helper, symlink and agents-md.
- `system-spec-kit` has no `mode-registry.json` or `hub-router.json`, so it is a standalone skill that owns nine doctor commands through tags alone. That is the precedent for a standalone `system-skilled-doctor`.
- Runtime hooks are rendered from `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, which Barter extends today through a json-entry overlay (`README.md:233-240`).
