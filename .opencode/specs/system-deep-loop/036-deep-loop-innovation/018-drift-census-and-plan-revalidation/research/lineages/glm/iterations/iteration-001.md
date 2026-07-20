# Iteration 1: Commit-range triage and positive-control reproduction (phase 003)

## Focus

Iteration 1's focus was Q-001: triage the commit range `0ce43ff589..739b85ac57` by phase surface and produce a per-phase hit-list, plus an opportunistic first pass at the Q-002 positive control (phase 003's renamed reference files and its `behavior_benchmark/` glob).

Pinned HEAD: `739b85ac57` ("fix(deep-loop): unblock cli-opencode fan-out lineage dispatch"). Baseline: `0ce43ff589` (2026-07-16, the merge that landed normalized 036 on v4).

## Actions Taken

1. `git log --oneline 0ce43ff589..HEAD` → **205** commits in range (spec.md said 204; the spec was off by one — `739b85ac57` itself landed after the spec was authored on 2026-07-19, see `git show -s --format=%ci 739b85ac57`). 195 non-merge commits.
2. `git log --oneline 0ce43ff589..HEAD -- .opencode/skills/system-deep-loop` → **25** commits touching the runtime substrate (spec.md said 22; three more landed between spec authoring and HEAD pin).
3. `git log --name-only --pretty=format: --no-merges 0ce43ff589..HEAD | awk -F'/' '{print $1"/"$2}' | sort | uniq -c | sort -rn` → top-level churn by category: `.opencode/specs` 62559 lines, `.opencode/skills` 15832, `.opencode/commands` 278, with long-tail edits to `.opencode/{bin,plugins,scripts,agents,install-guides,changelog,hooks,logs}`, `.claude/agents`, `.codex/{agents,prompts,hooks.json,config.toml}`, `.github/{workflows,hooks}`, and root configs.
4. `git show --stat cc77a1e550a` and rename-extraction grep → confirmed `cc77a1e550a` renamed `state_format.md`→`state-format.md`, `integration_points.md`→`integration-points.md`, and the `behavior_benchmark.md` family across all eight `system-deep-loop` modes.
5. Path resolution against pinned HEAD: `state_format.md` and `integration_points.md` under `runtime/references/` **DO NOT RESOLVE**; the kebab-case siblings `state-format.md` and `integration-points.md` do. `state_format.md` was PRESENT at baseline `0ce43ff589`, `state-format.md` was ABSENT — proving the rename is entirely post-baseline.
6. Glob check: `find ... -maxdepth 3 -type d -name behavior_benchmark` under `system-deep-loop/` → **zero** matches. Kebab sibling `behavior-benchmark/` exists in six mode folders (deep-alignment, deep-research, shared, deep-review, deep-improvement, deep-ai-council).
7. Read `003/spec.md` and `003/plan.md` and grepped for the snake_case names: confirmed phase 003 still pins the OLD paths at `003/spec.md:93`, `:144`, `003/plan.md:81`, `:82`, `:153`.

## Findings

### F1.1 — Range accounting differs from spec by +1 commit, +3 system-deep-loop commits

The spec's "204 commits / 22 system-deep-loop" reflects a HEAD that predates `739b85ac57`. Pinned census is **205 / 25**. This is not drift in a phase; it is the census itself recording the exact HEAD pin so verdicts do not move with the branch. [SOURCE: `git log --oneline 0ce43ff589..739b85ac57 | wc -l` = 205; `git log --oneline 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop | wc -l` = 25]

### F1.2 — POSITIVE CONTROL reproduced: phase 003 first-order drift (path breakage)

Independently rediscovered, before reading any prior analysis file:

- `003/plan.md:81` names `.opencode/skills/system-deep-loop/runtime/references/state_format.md` — file no longer resolves. Kebab sibling `state-format.md` resolves. Renamed by `cc77a1e550a` (`{state_format.md => state-format.md}` under three separate subtrees including `runtime/references/`). [SOURCE: 003/plan.md:81, `git show --stat cc77a1e550a`, `ls runtime/references/`]
- `003/plan.md:82` names `integration_points.md` — same pattern. Kebab sibling `integration-points.md` resolves. Renamed by `cc77a1e550a` (`{integration_points.md => integration-points.md}`). [SOURCE: 003/plan.md:82]
- `003/spec.md:93` and `:144`, and `003/plan.md:153`, name `behavior_benchmark/` (snake_case glob `.opencode/skills/system-deep-loop/*/behavior_benchmark/`). At HEAD this glob matches **zero** dirs; kebab sibling `behavior-benchmark/` matches six. [SOURCE: 003/spec.md:93,144; 003/plan.md:153; `find ... -name behavior_benchmark` = 0 hits; `find ... -name behavior-benchmark` = 6 hits]

All three are FIRST-ORDER drift (path no longer resolves). The new paths exist and the content was preserved verbatim through the rename, so the phase's *investigation* is still feasible — this is "needs refinement" (fix the three path strings), not "invalidated".

### F1.3 — Per-phase triage map (drives iterations 2-8)

Classified the 195 non-merge commits by which 036 phase surface they touch. The system-deep-loop commits (25 total) sort cleanly into buckets; non-system-deep-loop commits touch 036 surfaces only when they rename or reroute paths the phases cite.

| Phase | Phase surface (from spec/plan) | Material commits in range | Drift risk |
|-------|--------------------------------|---------------------------|------------|
| 003 | Baseline taxonomy + state census (runtime references, behavior benchmarks) | `cc77a1e550a` (renames), `72c36121201` (de-skill-specific harness classifier + manifest freshness gate), `b5f26ecedc6` (typed resource pairs), skill-benchmark typed-pair series | **HIGH (confirmed)** |
| 004 | Architecture coverage + transition contract | typed-pair gold (`72bb0bc0c70`, `c067920890a`), `708d25acf04` (typed-pair routing surface) | medium |
| 005 | Fanout live-tools unblock | `739b85ac57` (cli-opencode fan-out dispatch unblock), `9259c23e313` (goal-opencode rename + path refs) | medium |
| 006 | Transition authorized-ledger core | `6cd8ab14e4e` (mode routing + stale route gold), `708d25acf04` (typed-pair routing) | medium |
| 007 | Shared evidence + control services | `b5f26ecedc6`, `c067920890a` (typed pairs in skill-benchmark), shared mode contract churn | low-medium |
| 008 | Compatibility shadow + rollback bridge | none directly; the rollback-bridge paths may share names with 015 | low |
| 009 | Fanout fan-in durable orchestration | `739b85ac57`, `9259c23e313`; durable-orchestration script paths possibly touched by `9259c23e313` | medium |
| 010 | Novelty claims + continuity + projections | `cc77a1e550a` renamed continuity references, `71e18c224c3` (deferred-integration reference completion) | medium |
| 011 | Convergence + termination + health | convergence references renamed by `cc77a1e550a`; possibly affected by mode-routing fixes | low-medium |
| 012 | Shared mode contracts + fixtures | `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f` all directly touch mode registries and routing defaults; **also the skill-benchmark typed-pair series (`b5f26ecedc6`, `72bb0bc0c70`, `c067920890a`, `bd51376e311`, `c3af0f6061b`, `d9dc4004e2b`, `eae9ccab9c7`, `72c36121201`)** | **HIGH** |
| 013 | Mode + lane migrations (8 workstreams) | `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f` (OPEN QUESTION A) | **HIGH (open question A)** |
| 014 | Staged state migration + authority cutover | `9259c23e313` (path refs), mode-routing churn | low-medium |
| 015 | Legacy writer retirement | none directly named; check writer paths still exist | low |
| 016 | Whole-system gate (incl. behavior-benchmark harness) | `72c36121201` (de-skill-specific harness classifier + manifest freshness gate) — directly touches the harness | medium |
| 017 | Integrate latest + closeout (drift-handling charter) | `1a5963e6b9d` (017 hyphen refs in benchmark suite), `71e18c224c3` (deferred-integration reference completion) | low |

**Cross-cutting:** `cc77a1e550a` (kebab migration) is a first-order-drift engine across every phase that names a snake_case path; `9259c23e313` (goal_opencode rename) is a smaller first-order engine for any phase that names the old command file; the skill-benchmark typed-pair series is a second-order engine for any phase whose premises assume the old skill-authoritative single-source contract.

### F1.4 — Two open questions are tractable in this loop

- **OPEN QUESTION A (mode count):** commits `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f` all touch routing defaults and mode registries. Phase 013 plans eight workstreams against a specific registered-mode count. To resolve: count the registered modes at baseline vs HEAD in the typed-pair routing manifest and the four flipped hubs.
- **OPEN QUESTION B (packet-033 renumber):** the 003 baseline + 016 gate depend on the behavior-benchmark harness. Need to find what "packet-033" is now and whether the harness dependency survives. The `z_archive/027-deep-loop-behavior-benchmarks` path is the suspected fallback.

## Questions Answered

- **Q-001** (commit-range triage by phase surface): ANSWERED. See F1.3 table.
- **Q-002** (phase 003 positive control): ANSWERED at the path-resolution level. Phase 003 has first-order drift on three named paths (two reference files + the `behavior_benchmark/` glob); attribution confirmed to `cc77a1e550a`; the kebab siblings exist and preserve content. Final verdict locked in iteration 8 synthesis, but evidence is complete.

## Questions Remaining

- Q-003 (phases 004-006), Q-004 (007-009), Q-005 (010-012), Q-006 (013 + mode-count question A), Q-007 (014-015), Q-008 (016-017 + packet-033 question B), Q-009 (negative control — at least one clean phase).

## Sources Consulted

- `git log --oneline 0ce43ff589..739b85ac57` (full range, 205 commits)
- `git log --oneline 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop` (25 runtime commits)
- `git log --name-only --pretty=format: --no-merges 0ce43ff589..739b85ac57` (top-level path churn)
- `git show --stat cc77a1e550a` (kebab-case migration squash, ~3000 files)
- `git cat-file -e 0ce43ff589:...state_format.md` (present at baseline) and `0ce43ff589:...state-format.md` (absent at baseline)
- `find .opencode/skills/system-deep-loop -name behavior_benchmark` (0 hits) and `-name behavior-benchmark` (6 hits)
- `003/spec.md:93,144` and `003/plan.md:81,82,153` (path citations still using snake_case)
- `ls runtime/references/` → coverage-graph-schema.md, integration-points.md, script-interface-contract.md, state-format.md (no snake_case entries)

## Assessment

- **newInfoRatio: 1.00** — First pass; every finding is net-new to this packet. Established the commit census, reproduced the positive control, and produced a per-phase hit-list that drives every subsequent iteration.
- **Novelty justification:** the iteration independently rediscovered the known-true phase-003 drift using only `git`, `ls`, and `find` — the same tools available to any reader — and built a full per-phase triage map no prior artifact in this packet provided.
- **Confidence:** high on F1.1-F1.3 (reproducible from documented commands); medium-high on F1.4 (open questions will be resolved in dedicated iterations 6 and 8).
- **Tool-call budget:** 7/12 used. Remaining headroom reserved for state writes.

## Reflection

### What worked

- Resolving paths against pinned HEAD with `git cat-file -e <sha>:<path>` cleanly distinguishes "absent at baseline" from "absent at HEAD" — exactly the test the spec's positive control demands.
- Treating the kebab-case migration `cc77a1e550a` as a first-class "drift engine" rather than one of 25 commits made the per-phase triage collapse fast: every snake_case path cited by a phase is a candidate first-order hit.
- Counting commits *after* pinning HEAD removed ambiguity about why the spec said 204 and the live range said 205 — the branch keeps moving (risk SC-003), so the pin is the verdict's anchor.

### What failed

- Trying to use the code graph for structural symbol resolution: it is empty at init (`freshness=empty`, 0 nodes). Switched to Grep + `git show`. Code graph is unavailable for this census; documented in dashboard Active Risks.

### Ruled out

- _Approach:_ "trust the spec's commit counts". _Reason ruled out:_ spec said 204/22; live range is 205/25. The discrepancy is post-spec-authoring drift on the branch itself. Verdicts must cite the live counts against the pinned HEAD, not the spec's snapshot. _Evidence:_ `git log --oneline 0ce43ff589..739b85ac57 | wc -l` = 205.

## Recommended Next Focus

Iteration 2: Open question A's anchor — resolve the registered-mode count. Read `003-baseline-taxonomy-and-state-census` and `013-mode-and-lane-migrations` plan.md to enumerate the modes they assume, then count registered modes in the typed-pair routing manifest and the four hubs `908efde8d8f` flipped to `defaultMode: null` at HEAD vs baseline. This both advances Q-006 (phase 013 verdict) and produces the most load-bearing open-question evidence early, before budget pressure forces breadth over depth.
