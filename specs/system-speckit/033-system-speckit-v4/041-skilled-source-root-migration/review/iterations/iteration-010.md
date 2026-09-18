# Iteration 010: Documentation truthfulness

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

**Run.** The first attempt was stopped by a session boundary before it answered. This is the re-run of 2026-09-18, against commit `67fa4f7b8e`, after the remediation of the other nine angles had landed. It exited 0 and returned ten findings: three P1, seven P2, no P0. The executor printed `VERDICT: FAIL`. Under the review's verdict contract a FAIL needs an active P0, so this iteration's verdict is CONDITIONAL.

**Triage.** Each finding was checked against the tree before it was acted on. All ten were confirmed, and all ten are fixed in the closing commit of phase 012. One residue of `DOC-003` is recorded rather than fixed: the hub's `graph-metadata.json` still summarises a two-model roster, and that file feeds the compiled skill graph, so it changes through its own generator rather than by hand.

### DOC-001 Gate 3 FAQ names a nonexistent skip option
- severity: P1
- file: README.md:1000
- claim: Gate 3 can be skipped with option E.
- reality: `AGENTS.md:53-57` defines only options A through D, with D as Skip.
- fix: Change “option E” to “option D”.

### DOC-002 Hook documentation still advertises the removed naming gate
- severity: P1
- file: .skilled/scripts/git-hooks/README.md:20,29,74,116
- claim: `pre-push` blocks only new-branch naming violations and always allows existing-branch updates.
- reality: `pre-push:164-168` says the naming gate was removed and the permission gate applies to every push. The tests README repeats the obsolete naming-gate claim at line 31.
- fix: Document the all-push permission gate and remove the migration-tolerance and naming-gate claims.

### DOC-003 Hermes documentation still claims a two-model roster
- severity: P1
- file: .skilled/skills/cli-external-orchestration/cli-hermes/README.md:37,70
- claim: Only `deepseek-v4.1-flash` and `glm-5.3-flash` are allowed.
- reality: `executor-config.ts:261-269` and `fanout-run.cjs:2619-2627` allow seven models. The current `SKILL.md:198` also documents seven.
- fix: Update the live Hermes README, references, feature catalog and manual-playbook claims to the seven-model roster.

### DOC-004 The OpenCode README overstates which entries are symlinks
- severity: P2
- file: .opencode/README.md:25
- claim: Every entry except `plugins/` and package files is a symlink into `.skilled/`.
- reality: `ls -la .opencode` shows regular `.gitignore`, `README.md` and `SYNC.md` files. `.opencode/SYNC.md:39-41` confirms those exceptions.
- fix: Enumerate all non-symlink exceptions or limit the claim to the listed runtime surfaces.

### DOC-005 Runtime SYNC manifests contain stale roster counts
- severity: P2
- file: .claude/SYNC.md:32,91-92
- claim: The runtime surfaces contain 13 agents and 34 shared commands.
- reality: `find` checks return 12 Claude agents and 33 commands. The same stale counts appear in `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md` and `.pi/SYNC.md`, while the tree has 12 agents, 33 Codex prompts, 18 Codex hooks and 35 Pi prompts.
- fix: Refresh the hardcoded counts in all runtime manifests or remove them in favor of authoritative checks.

### DOC-006 CI documentation overclaims hook-test coverage
- severity: P2
- file: .github/workflows/README.md:67
- claim: The gate-input workflow runs every hook test suite under the selected source root.
- reality: `.github/workflows/gate-inputs.yml:32` selects only `*.test.sh` files. `.skilled/scripts/git-hooks/tests/README.md:28` also lists `install-git-hooks-worktree-harness.sh`, which the glob omits.
- fix: Add the harness to the workflow list or narrow the documentation to the `*.test.sh` suites.

### DOC-007 The root README mislabels the OpenCode agent path as canonical
- severity: P2
- file: README.md:638
- claim: OpenCode uses the canonical `.opencode/agents/` definitions directly.
- reality: `readlink .opencode/agents` returns `../.skilled/agents`. `.skilled/` is the source of truth and `.opencode/` is the compatibility path.
- fix: Say that OpenCode reads `.opencode/agents/`, which resolves to the canonical `.skilled/agents/` source.

### DOC-008 The root README reports the wrong number of `sk-doc` packets
- severity: P2
- file: README.md:626
- claim: `sk-doc` routes to ten workflow packets.
- reality: `.skilled/skills/sk-doc/SKILL.md:15` states fourteen workflow modes across thirteen packets. The registry and packet directories match that structure.
- fix: Change the claim to fourteen workflow modes across thirteen packets.

### DOC-009 The skills catalog omits the Hermes dispatch mode
- severity: P2
- file: .skilled/skills/README.txt:45
- claim: `cli-external-orchestration` routes to six CLI modes ending at `cli-pi`.
- reality: `.skilled/skills/cli-external-orchestration/SKILL.md:3,15,33` and its registry include the seventh mode, `cli-hermes`.
- fix: Add `cli-hermes` to the catalog entry.

### DOC-010 Skill creation instructions contradict automatic discovery
- severity: P2
- file: README.md:1012
- claim: A new skill must be registered manually in `.skilled/skills/README.txt`.
- reality: `.skilled/skills/README.txt:33,145` says discovery uses `SKILL.md` frontmatter and `graph-metadata.json` with no manual registration. The advisor skill also documents automatic watcher and startup discovery at line 342.
- fix: Remove the imperative registration step or describe it as an optional catalog edit.

