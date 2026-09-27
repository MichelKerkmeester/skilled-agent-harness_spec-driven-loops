---
title: "Iteration 7 — deepseek-07: Moving `cli-jev` under `cli-classifier`: the blast radius"
trigger_phrases: []
---

# Iteration 7 — deepseek-07: Moving `cli-jev` under `cli-classifier`

## Focus

Angle **deepseek-07** (W3): *Moving `cli-jev` under `cli-classifier`: the blast radius.* Maps to question G; answers angle questions 1 to 5. W3: the newest iteration of every sibling was read first (Sibling check).

## Actions Taken

1. Counted `cli-jev` references: `rg -l` over `.skilled`, `.claude`, `.hermes`, `.pi` (92 files, 927 occurrences) and classified them by surface.
2. Read the hub's own registry surfaces: `cli-jev/graph-metadata.json`, `description.json`, `mode-registry.json` (modes and the `transport-axis` extension with `enforcedBy`), `hub-router.json`.
3. Read the parent-hub method: `sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:44-56`, `:98-132`, `:212-290` (the eleven surfaces and the two verification commands).
4. Read the repo rule that governs the move: `.skilled/repo-rules/skill-hub-routing.md:35-75`.
5. Read the code literals and consumers: `.skilled/bin/compiled-route-guard.cjs:40-50` (the seven-hub list), `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:19`, `:37`, `dispatch-audit.mjs:46`, `:234-237`, and the test files that pin them.
6. Read the generated surfaces that name the hub: `compiled-routing/009-parent-hub-rollout/008-cli-jev/` (a full generated closure), `serving-closure.manifest.json`, advisor `skill-graph.json` (one line), retrieval fixtures, `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:283-288`.
7. Read the newest sibling iterations: `grok/iteration-010.md`, `mimo/iteration-001.md`, `swe/iteration-002.md`, `glm/iteration-001.md`.
8. Nothing was moved or executed; the move itself belongs to the build phase.

## Sibling check

- `grok/iterations/iteration-010.md` (newest): its one-phase order says a judgment phase has no baseline while callers and labels are zero. Agreed: this angle is structural and independent of model availability; its "0 runtime Deem callers" count is quoted as grok's.
- `mimo/iterations/iteration-001.md` (newest): its counted transcript corpus (93 files, 66,498 deduped assistant messages) is quoted as mimo's; used here only as the statement that no context baseline existed before round 3.
- `swe/iterations/iteration-002.md` (newest): its sk-doc check map covers `validate_skill_package.py`; the move must pass that validator (F5 step 5). Not reopened by me; cited as swe's.
- `glm/iterations/iteration-001.md` (newest): it opened the launchd plist the iteration-2 steer said was unopened — program `deem-ctl update`, `StartInterval` 21600, `RunAtLoad` (quoted as glm's read). That resolves iteration 2's weak claim; recorded, not re-derived.

## Findings

**F1 (new; answers angle question 1). The counted blast radius: 92 files, 927 occurrences, classified by surface.**

| Surface | Files | Examples (opened) |
|---|---|---|
| Hub source (the thing that moves) | 53 | `.skilled/skills/cli-jev/` root (7 files) plus `cli-usage`, benchmarks, changelogs, playbooks |
| Compiled-routing literals and generated closure | 12 | `.skilled/bin/compiled-route-guard.cjs:47` (hub list); `compiled-routing-flag.ts:19`, `:37`; `compiled-routing/009-parent-hub-rollout/008-cli-jev/**`; `serving-closure.manifest.json:69` |
| Dispatch guard and its tests | 3 | `dispatch-audit.mjs:46` (`skill: 'cli-jev', packetPath: 'cli-jev/cli-usage'`), `:234-237`; `dispatch-rule-checks.test.mjs:14`, `:464`, `:469`; `dispatch-audit.test.mjs:123-160` |
| Advisor surfaces | 3 | `skill-graph.json` (family `cli`, signals), `compiled-routing-flag.ts` (shared with above), `parity/fixtures/local-native-approved-divergences.json:780` |
| Retrieval fixtures | 3 | `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` |
| Sibling/other skills | 9 | `.skilled/skills/cli-external-orchestration/**` references to the transport-axis |
| Agents (three runtimes) | 6 | `.skilled/agents/orchestrate.md:475, :838, :853`; mirrors in `.claude/agents` and `.pi/agents` |
| Hermes mirrors | 5 | `.hermes/skills/cli-jev/SKILL.md`, `cli-usage/SKILL.md`, `agent-orchestrate`, `agent-prompt-improver`, `cli-external-orchestration` |
| sk-doc test manifests | 2 | `durable-directory-manifest.json:283-288` lists every cli-jev subpath |

The classes overlap (a file can be both a literal and a fixture); the table counts the file's primary role. The move touches far more generated and pinned surfaces than source files. [SOURCE: `rg -l` in this iteration; `.skilled/bin/compiled-route-guard.cjs:47`; `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:19`, `:37`; `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:46`, `:234-237`; `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:283-288`; `.hermes/skills/cli-jev/SKILL.md:9`]

**F2 (new; answers angle question 1's frozen-contract half). The owners and the frozen literals.** The hub files are owned by `cli-jev` itself; `mode-registry.json` is the hub identity and declares `transport-axis` with `transports: ["cli-usage"]` and `enforcedBy: "parent-hub-check rule 3h … and rule 5i …"` (`mode-registry.json:113-119`). The compiled-routing hub list is a literal in `compiled-route-guard.cjs:40-50` (seven ids) and the tri-state flag list in `compiled-routing-flag.ts:19`, `:37`; the dispatch shape table binds `cli-jev/cli-usage` (`dispatch-audit.mjs:46`). Parent-hub integration itself has eleven surfaces, of which only rows 1-3, 9 and 11 are gated (`parent-skills-nested-packets.md:216-236`); row 6 (advisor vocabulary) has no gate and is the one a move most easily breaks. [SOURCE: `.skilled/skills/cli-jev/mode-registry.json:113-119`; `.skilled/bin/compiled-route-guard.cjs:40-50`; `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:19`, `:37`; `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:216-236`]

**F3 (new; answers angle question 3). What breaks between the move and the regeneration, in order of damage.** (a) The advisor: `cli-usage` is `routingClass: metadata`, so its vocabulary reaches the advisor only through the hub's `graph-metadata.json` intent signals (row 6, ungated); a moved folder with an unregenerated graph makes the hub unreachable for jev requests. (b) Compiled routing: the generated closure carries a `008-cli-jev` generation and the guard holds the literal id; until republished, the front door falls back to the legacy sentinel — safe but a silent loss of compiled routing. (c) The dispatch audit: its shape table resolves `jev` commands to packet path `cli-jev/cli-usage`; a moved packet makes the audit point at a path that no longer exists (its tests fail first). (d) Mirrors and fixtures: `.hermes` copies carry the canonical-source line and would describe a stale path; retrieval fixtures and the durable-directory manifest name old paths. (e) The trigger index: generated from author-declared phrases through `graph-metadata.json` (`runtime/data/README.md:17`), so it needs regeneration after the graph moves. [SOURCE: F1 files; `parent-skills-nested-packets.md:220-236`; `.skilled/skills/system-spec-kit/runtime/data/README.md:17`]

**F4 (new; answers angle question 5). An alias from `cli-jev` to its new place is not enough, and the class is why.** `legacyAdvisorId`/`legacyAliases` and the projection maps exist for `lexical` or `alias-fold` modes; `cli-usage` is `metadata` and takes "none of this" (nested-packets row 10, `:230-231`). The advisor finds a metadata hub by its own graph identity, and a second skill-shaped graph below a root is rejected (`skill-hub-routing.md:51`). So no alias row can keep `cli-jev` routable once its graph leaves; the literal lists must be updated and the graph regenerated. If both ids must work during migration, the old folder stays in place until the new hub is green, then the move is one step — not an alias layered over a half-move. [SOURCE: `parent-skills-nested-packets.md:228-231`; `.skilled/repo-rules/skill-hub-routing.md:51`; `.skilled/skills/cli-jev/mode-registry.json` (routingClass metadata)]

**F5 (new; answers angle question 4). The safe order, each step with its rollback.** 1) Author the `cli-classifier` hub skeleton beside the old one: `mode-registry.json` with two transport modes (`cli-usage`, `cli-deem`), `transport-axis` listing both, `hub-router.json`, root `SKILL.md` mode table, `graph-metadata.json` intent signals, `description.json`, `leaf-manifest.json` (regenerate). Rollback: delete the skeleton; nothing else changed. 2) Move the packet folders with `git mv` (the one git-write step, phase-owned). Rollback: `git revert` the move commit. 3) Update the literals: `compiled-route-guard.cjs` hub list, `compiled-routing-flag.ts` lists, `dispatch-audit.mjs` shape table and its tests, `hermes` canonical-source lines. Rollback: revert the commit. 4) Regenerate: compiled-routing publication (authored program under `specs/`, never hand-edit the generated tree), advisor graph, trigger index, runtime mirrors. Rollback: republish the previous generation (the layout keeps one complete generation, `compiled-route-layout.cjs` refuses a mixed root). 5) Verify: `parent-skill-check.cjs <hub>` with the hub path, then replay both stages with a real jev request and a real Deem request (`compiled-route.cjs --hub cli-classifier --prompt …`, `skill_advisor.py …`), then the dispatch tests. [SOURCE: `parent-skills-nested-packets.md:238-256`; `.skilled/repo-rules/skill-hub-routing.md:57-75`; `.skilled/bin/lib/README.md:56-58`]

**F6 (new; answers angle question 2's shape half from the method doc). The move must stay a two-tier hub: no intermediate tier, one modes array, no second array for transports.** The canonical method is one hub directory plus nested packets, every packet one entry in `modes[]` (`parent-skills-nested-packets.md:54-56`); the `transport-axis` extension is declared once with every transport listed (`:162`), and `tieBreak` must be an exact permutation of the registry modes or check 5e fails (`:224-226`). So `cli-classifier` = hub + `cli-usage/` + `cli-deem/`, `transport-axis.transports = ["cli-usage","cli-deem"]`, and a tie-break that lists workflow modes before transports (there are none here yet, so the tie-break is the two transports in registry order). No extra shared helper directory. [SOURCE: `parent-skills-nested-packets.md:44-56`, `:162`, `:224-228`; `.skilled/skills/cli-jev/mode-registry.json:110-119`]

**F7 (new; a recorded size). The move relocates 53 source files and 39 referencing files; the pure-add minimum is one hub folder plus two packet folders, with 12 literal/generated surfaces to update and 5 regeneration steps.** Counted by F1; the `cli-deem` folder is new (iteration 6's client), so the move proper is `cli-usage` plus the hub identity. [SOURCE: F1 counts]

**F8 (new; a guardrail for the build phase). Neither the hub move nor `cli-deem` adds a global switch.** The hub is a routing identity; the two-backend gate stays per-feature (iteration 1, N-deepseek-01-3), and the transport mode itself declares `mutatesWorkspace:false` and forbids Write/Edit/Task (`mode-registry.json` transport entry; nested-packets `:162`). With neither backend available, the hub still routes exactly as today; each transport's behavior without its backend is the iteration-1/6 skip line. [SOURCE: `.skilled/skills/cli-jev/mode-registry.json:70-90`; `parent-skills-nested-packets.md:162`; iteration 1; iteration 6]

## Per-Idea Records

### N-deepseek-07-1: The minimum `cli-classifier` hub shape

- **Idea:** `cli-classifier` as a two-mode transport hub: `cli-usage` (moved) and `cli-deem` (new client, iteration 6), with hub files only — `SKILL.md`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`, changelog. No shared helper directory, no extra abstraction.
- **Question:** G, A.
- **Builds on:** F6; parent D2 (`goal.md:50`); the canonical method.
- **Value:** The hub the parent requires, at the smallest size that passes the parent-hub checks and both routing stages.
- **Seam:** New folder under `.skilled/skills/`; model files at `cli-jev/mode-registry.json` etc.
- **Metric, baseline, harness:** Metric: `parent-skill-check.cjs` green on the hub + both stage replays hit; baseline: today's single-mode hub passes only for jev requests. Harness: the two commands of `parent-skills-nested-packets.md:245-250`.
- **Savings:** Structural; enables `cli-deem` discovery; no token saving itself.
- **Cost, latency, privacy:** None; routing is local and deterministic.
- **Two-backend gate:** No switch at the hub; each transport keeps its own.
- **Rough LOC:** ~8 files; the two registry/router files dominate (~150 lines total authoring).
- **Verdict:** **build-now as the hub phase** (D2 mandates it).
- **Confidence:** Confirmed from the method doc and the existing hub.

### N-deepseek-07-2: The ordered move with rollback (F5)

- **Idea:** Execute the move as five ordered steps (skeleton → `git mv` → literals → regeneration → two-stage verification), each with its rollback; never hand-edit the generated compiled-routing tree.
- **Question:** G.
- **Builds on:** F5; `compiled-routing/` generation rule.
- **Value:** A move that cannot half-land: at every step either the old hub or the new one fully serves.
- **Seam:** `.skilled/bin/lib/README.md:56-58`; `parent-skills-nested-packets.md:238-256`.
- **Metric, baseline, harness:** Metric: zero legacy-sentinel routings for the new hub after step 4; replay commands as the harness.
- **Savings:** Avoids a broken migration window; no token saving.
- **Cost, latency, privacy:** One build phase; no backend.
- **Two-backend gate:** Orthogonal.
- **Rough LOC:** 0 beyond N-deepseek-07-1; the literals are 3 files.
- **Verdict:** **build-now as the phase plan.**
- **Confidence:** Confirmed from the method doc and the generation rules.

### Dropped: an alias from `cli-jev` to the new location

- **Idea:** Keep `cli-jev` working by adding an alias to the new hub.
- **Reason:** F4: metadata hubs have no alias path; a second graph below a root is rejected; the literal lists and graph regeneration are the actual compatibility work. Dropped.
- **Confidence:** Confirmed from the method doc and the rule.

### Dropped: moving `cli-jev` before the new hub is green

- **Idea:** Move first, fix surfaces after.
- **Reason:** F3: the advisor loses the vocabulary the moment the graph moves, and the dispatch audit's tests break before the fix; the skeleton-first order (F5) removes the window. Dropped.
- **Confidence:** Confirmed from the surface list.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| Counted blast radius: 92 files / 927 occurrences, classified | **new** (no baseline counted it) | F1 |
| The compiled-routing hub list and tri-state flag are code literals (two files) | new | `compiled-route-guard.cjs:40-50`; `compiled-routing-flag.ts:19`, `:37` |
| The dispatch audit binds `cli-jev/cli-usage` in a shape table plus tests | new | `dispatch-audit.mjs:46`, `:234-237`; tests |
| Eleven parent-hub surfaces; only five gated; row 6 is the silent breaker | new | `parent-skills-nested-packets.md:216-236` |
| An alias cannot carry a metadata hub | new | F4; `skill-hub-routing.md:51` |
| Five-step move with per-step rollback; generated tree never hand-edited | new | F5 |
| Minimum hub shape = one modes array, two transports, no intermediate tier | new | F6 |
| Jev gate | restated (BASE2 §11) | — |

## Hand-off

- swe-07: its `cli-classifier` file tree should adopt N-deepseek-07-1's minimum and F6's constraints; the literals of F2 are the review list.
- glm-02: its minimum-hub comparison should weigh F4 (no alias carry) and F3 (ungated row 6).
- deepseek-10: the hub phase is a Planned child; its build order starts with the skeleton (F5 step 1).
- deepseek-08 and 09: no dependency; the hub move never gates on a backend.
