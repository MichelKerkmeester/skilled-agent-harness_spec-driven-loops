---
title: "Goal: every link resolves and every generated artifact is fresh after the move"
description: "The durable directive for the phase that retargets hand-made links, re-runs every generator from new source constants and proves the tree with a link census and owner freshness checks."
trigger_phrases:
  - "skilled links phase goal"
  - "generated state phase directive"
  - "link census completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state"
    last_updated_at: "2026-09-17T15:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Rebuilt links and generated state under .skilled"
    next_safe_action: "Start phase 009 per the parent's D1 once this folder validates"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-008-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: every link resolves and every generated artifact is fresh after the move

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After the rename, every tracked link resolves into `.skilled/`, and every generated or derived artifact is rebuilt by its owner and proven fresh by that owner's own check.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Runtime links target `.skilled/` directly. Generator-owned links and files change only through a generator run from edited source constants, and a second write run must change nothing. |
| D2 | Units run in the order of `plan.md` §4, each followed by its own check and suite before the next starts. The trigger index runs last and again after the final document edit. |
| D3 | DeepSeek V4.1 Flash max on cli-pi executes one runtime directory or one generator per brief. GPT-5.6-sol on cli-codex reviews every constant or path-data diff before its write run. The orchestrator re-runs every check and decides the four already-broken links. |
| D4 | `regenerate-skill-derived.cjs` never runs with `--write` in this phase. It prunes paths it cannot find, so the 13 skill `graph-metadata.json` path fields are rewritten by a JSON-aware script and its dry run is the proof. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The link census over `git ls-files -s -z` lists only the frozen `specs/` allowlist as dangling, counts 0 links outside `.opencode/` and `specs/` with a target containing `.opencode` and counts 4 absolute targets
- [x] All nine runtime generator `--check` runs exit 0, including `sync-runtime-mirrors.cjs` at 168 mirrors across 8 trees, and a second write run leaves `git status` empty
- [x] `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` and the four per-package dist checks exit 0, and `compiled-route-sync.cjs --verify` prints `move-simulation OK`
- [x] A second trigger-index run is byte-identical to the committed index and its three fixtures, and the index path table holds no `.opencode/` entry
- [x] Each of the four already-broken links has a recorded retire-or-restore decision, applied
- [x] The phase validates `RESULT: PASSED` with every acceptance row `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this file, 2026-09-16 |
| Read-only baseline at `728c4f3efc` | Done | 8 of 9 runtime `--check` runs PASS, among them `sync-runtime-mirrors.cjs` at 168 mirrors across 8 trees. A NUL-safe count finds 435 tracked links, 8 dangling |
| Predecessors (T001) | Recorded | Phase 007 validates `RESULT: PASSED` and closed at `1464a85667`, the rollback base for this phase. Phase 004 froze L1: `.opencode` is one tracked link to `.skilled`, `.opencode/specs` keeps resolving through it and ADR-003 keeps K1 to K13. Phase 003 recorded that `council-graph.sqlite` rebuilds per session through `replay-graph-from-artifacts.cjs` and needs no migration. Phase 006 changed none of this phase's generator constants. It made root discovery and the contract compiler's path resolution accept either root |
| Root discovery (T002) | Proven | `findRepoRoot` returns the worktree root from `.skilled/skills/system-spec-kit/runtime/cli`, given relative and absolute |
| Baseline (T003) at `1464a85667` | Recorded | 13 of 15 checks pass: hook registrations (29 hooks, 15 Pi extensions), 168 mirrors across 8 trees, 2 Gate 1 pointers, 33 Codex prompts, 12 Codex agents, 33 Pi prompts, 12 Pi agents, 33 Hermes prompts, contract drift for 3 commands, 13 fresh leaf manifests, 13 fresh skill-derived blocks, all watched dist outputs fresh and all 5 routing hubs resolving. `sync-skills-hermes.cjs --check` exits 1 on `sk-create-manual-testing-playbook` and `agent-deep-review`, and `codex/generate-command-routers.cjs --check` exits 1 with 3 path drifts. Both fail identically in a clone at the pre-move `048d16d725` with a real `.opencode/`, so neither is move-caused |
| Link census before (T004) | Recorded | 436 tracked links (435 plus the `.opencode` link), 8 dangling, 4 absolute. 171 links outside `.opencode/` and `specs/` still target `.opencode`: `.claude` 56, `.cursor` 53, `.devin` 22, `.codex` 19, `.pi` 19 and `.hermes` 2, that is 144 mirrors plus the 27 hand-made links |
| Caches and untracked content (T005) | Recorded | One cache, the ignored `sk-doc/shared/scripts/__pycache__`, left in place because every leaf manifest reports fresh with it present. Nothing of this phase is untracked under `.skilled` or `specs`. The 116 untracked markdown files under `specs/` are other sessions' containment snapshots inside `lineages/`, which the corpus walker prunes |
| Broken-link decisions (T006) | Decided | `changelog/sk-design-md-generator`: retire, because the mode's changelog lives in the sk-design hub, which `changelog/sk-design` already links. `changelog/sk-doc/create-diagram`: retire, because the mode moved to `sk-design/sk-design-diagram` and recreating the link would turn `changelog/sk-design` into a directory this phase does not own. `skills/sk-doc/scripts/validate-flowchart.sh`: retire, because both diagram workflows call the sk-design copy and the one README row that names the old path is phase 009 text. `plugins/sk-vision.js`: keep and build `vision-runtime` once on this machine, recording that a fresh checkout dangles until built |
| Constant edits (T007, T019, T022, T025, T028, T031, T034, T037, T040, T045, T050) | Done | Written as expected files with exact replacement counts, then applied by DeepSeek V4.1 Flash: two JSON-aware rewrites (the hook registry's 81 script paths and 3 drift hints, and 238 derived paths in the 13 skill graph metadata files) and 22 OLD/NEW edit units on five workers across the Gateway, Cline and Devin lanes, each byte-matched and hygiene-checked. A 23rd unit made the command-reference validator accept either root, and a 24th fixed a drift-test assertion the contract suite caught |
| Reviews | Done | Five GPT-5.6 Luna reviews finished between 14:21Z and 14:29Z, before the first write run at 14:33Z, and a sixth covered the validator. `scratch/review-ledger.md` dispositions all 10 findings: one fixed, one settled by the runbook order, three pre-existing, one not reachable here, one routed to phase 009 as a class and three answered by phase 010's consumer design |
| Builds (T009, T010) | Done | The spec-kit shared, runtime and cli packages and the advisor runtime rebuilt. Each `dist-freshness.cjs check --package` exits 0, `check-all` reports every watched output fresh and `generate-context.js --help` exits 0 |
| Links (T011 to T018) | Done | 27 hand-made links retargeted to their `target_if_no_compat` values, 27 of 27 resolving to the same real files. The three dangling links retired, and `bun install` then `bun run build` in `vision-runtime` made `plugins/sk-vision.js` resolve |
| Hooks and mirrors (T021, T024) | Done | Hook registrations wrote 4 of 4 files and the check prints `PASS: 4 registration files match the 29-hook registry; 15 Pi extensions resolve.` The mirror run linked 144 and removed 0, its check passes at 168 mirrors across 8 trees, and command-tree parity, the agent roster and the command catalog pass. All 175 tracked links in `.claude`, `.codex`, `.cursor` and `.devin` resolve, and none targets `.opencode`. `hook-registration-sync.vitest.ts` fails 1 of 4 with `expected 81 to be 77`, identically in the pre-move clone, which is the failure the parent log records in CI before phase 005 |
| Runtime copies (T027, T030, T033, T036) | Done | Codex 33 prompts and 12 agents, Pi 33 prompts and 12 agents (the Pi agents embed no source path, so none was rewritten), Hermes 33 prompts and 68 skill copies (57 rewritten, including the two that had drifted before the move) and 2 Gate 1 pointer blocks. Every check passes, and the Hermes and Gate 1 suites pass |
| Contracts and routing (T039, T042) | Done | The three contracts rebuilt with `.skilled` sources, `check-contract-drift.cjs` prints `OK commands=3`, and both suites pass 23 of 23 after the assertion fix. The routing sync published under `.skilled/bin/lib/compiled-routing`, `--verify` prints `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`, `--finalize` removed the rollback sibling, `runtimeRoot` reads `.skilled/bin/lib/compiled-routing` and the suite passes 42 of 42 |
| Skill metadata and leaf manifests (T043 to T047) | Done | The regenerator's dry run prints `"changed": 0` and `"errored": 0`, `ci-skill-derived-freshness.cjs` reports 13 fresh, the skill graph compiler validates and no skill-root metadata file names `.opencode/`. The leaf-manifest gate reports 13 fresh, so no manifest was rewritten, and both leaf suites and the regenerator suite pass |
| Council graph and lock (T048, T049) | Done | The council graph follows phase 003's disposition and stays as it is. An offline lock-only install changed only line 2 of `.skilled/package-lock.json`, the package name |
| Trigger index (T050 to T052) | Done | The index and its three fixtures regenerated, a second run into scratch matched all four byte for byte, no path entry names `.opencode/`, the 1,835 documents under the three source roots are the same documents under the new prefix, and both suites pass 65 of 65 |
| Census and sweep (T053 to T055) | Done | Census after: 433 links, 4 dangling (the frozen allowlist), 0 old-root targets and 4 absolute, and the untracked-link sweep prints nothing. The freshness sweep passes 14 of 15 checks, the fifteenth being the routers generator's 3 path drifts that predate the move. A second write run of every generator wrote nothing and left status and bytes unchanged |
| Suites and inventories (T056, T057) | Done | One pass on the final tree: spec-kit suites 72 of 73 with the pre-existing registration failure, deep-loop 23 of 23, Hermes 3 of 3, routing 42 of 42, the three sk-doc suites, command-tree parity, the agent roster, the command catalog and routing `--verify`. The producer inventory leaves only the `.opencode/specs` alias, the compiler's dual-root name list, the Gate 1 intro's consumer spelling, one comment in `command-scope.cjs` and the routers generator, the last two for phase 009 |
| Commits | Done, not pushed | `88425278a6` dist freshness, `fd8213edb9` runtime links, hooks, mirrors and Codex copies (228 paths), `a19099ce92` Pi, `c04e0f3bf2` Hermes, `dadc8a34a8` Gate 1, `eef18a8e3f` contracts, `6fabee1efe` routing, `6f530bfb81` skill metadata, `43e71d183d` package lock and `aaea487a2b` retrieval. Each is staged by explicit path, carries a `Commit-Id` trailer and holds no change from a hook |
| Closure (T058 to T060) | Done | Documents amended to the measured evidence, metadata regenerated, the trigger index refreshed after the last document edit and the phase validated with `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| `sync-skills-hermes.cjs --check` already exits 1 at `728c4f3efc` | Pre-existing drift on `agent-deep-review`, class `instance-only`. Neither CI (`.github/workflows/spec-kit-check.yml:142-148`) nor pre-commit (`pre-commit:168-175`) runs the Pi or Hermes checks, which is how it went unseen. T033 regenerates it, and it does not count as move-caused. Resolved: the Hermes run cleared it and a second pre-existing drift on `sk-create-manual-testing-playbook` |
| Map class `regenerate` for the 13 skill `graph-metadata.json` rows | The supported owner prunes and never rewrites (`regenerate-skill-derived.cjs:9-16`, `:114-137`), and the advisor writer that re-derives `key_files` is kept for its tests only (`system-skill-advisor/runtime/lib/derived/sync.ts:95-98`). Class `algorithmic`. D4 follows from it |
| Map class `manual` for `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` | All three are `generate-trigger-index.mjs` outputs (`:64-67`), so T052 regenerates them. Class `matrix/evidence` |
| Map counts 34 Pi prompt rows as generated | `.pi/prompts/goal-pi.md` is hand-authored (`command-scope.cjs:27-30`), and the live check reports 33 prompts. The generators own 197 runtime files, not 198 |
| Map classes `commands/deep/assets/compiled/README.md` as generated | `compile-command-contracts.cjs` writes only `<slug>.contract.md` (`:662-665`), so the README is phase 009 text |
| The dist builds depend on `.opencode` package roots | Every spec-kit build calls `dist-freshness.cjs`, whose 12 package roots name `.opencode/` (`:28-140`). T007 changes them unless phase 006 already did. Class `cross-consumer`. Resolved: phase 006 had not, and T007 changed all 12 |
| Pre-commit skips a mirror check whose script is missing | `scripts/git-hooks/pre-commit:179-180`. Until phase 005 lands, commits in this phase are not gated by it, so each unit runs its own check. Class `cross-consumer`. Resolved: phase 005 landed, and the mirror parity gate ran on every commit here |
| Three frozen `z_archive/022-hybrid-rag-fusion` links point into `.opencode/skills` | They resolve only while that path does. If phase 004 drops it, they join the allowlist by name and stay unedited. Resolved: L1 keeps the path, and all three resolve |
| Reviews run on GPT-5.6 Luna | D3 names GPT-5.6-sol. The parent's D3, amended 2026-09-17, names GPT-5.6 Luna at xhigh on the fast tier and parallel lanes, and parent decisions outrank this goal. Every constant or path-data diff still gets a review before its write run |
| `codex/generate-command-routers.cjs` is a generator the map missed | Class `matrix/evidence`. It checks, and with `--write` rewrites, asset-path cells inside hand-authored router files, and `ASSET_PATH_RE` keys on `.opencode/commands/`. Its constants change with phase 009's router text, and its 3 path drifts predate the move |
| The mirror regex reads the whole config | Class `cross-consumer`. `hookSourcesFromConfig` matches every `.opencode/...` script path in the raw config text, so the three `install-codex-hooks.mjs` drift messages in `hook-registry.json` produce three mirrors. The messages change with the 81 `script` values, or those mirrors would vanish when the regex moves to `.skilled` |
| Two phase 006 test rows would pass without testing | Class `test-isolation`. Once the compiler's constants name `.skilled`, the drift checker's cross-spelling row and the compiler's single-root row exercise their own spelling. Both flip to `.opencode` in the same unit, keeping the other-spelling coverage |
| The Gate 1 pointer names both roots | ADR-003 K2 keeps `.opencode` as a second sentinel because consumer checkouts have no `.skilled`, so the generated intro names `.skilled/skills/system-spec-kit` or `.opencode/skills/system-spec-kit` instead of dropping the consumer spelling |
| Units ran in parallel waves | D2 orders the units one after another. Independent units ran concurrently on the parent's lanes, and a unit whose input another unit writes waited for it: builds and links, then hook registrations, then mirrors, then the other generators together, then leaf manifests, the lock and the trigger index last. Every unit's check still ran before any unit that reads its output |
| Consumer checkouts that expose only `.opencode` | Three review findings (hooks H-001, dist freshness F-002, retrieval F-003) note that `.skilled/` paths miss in a consumer project that links only `.opencode`. Phase 004's ADR-003 rewrites every such reference, and phase 010 gives each consumer root on this machine a `.skilled` link before it installs hooks under `.skilled/` (`010-machine-and-consumer-cutover/spec.md:114`, `:133`). Nothing from this phase reaches a consumer project or a home config, so the ordering is 010's, recorded in the handoff notes |
| Code outside this phase still cuts paths at `/.opencode/` | Class `class-of-bug`. Since the move, `pwd -P` and real paths spell `.skilled`, so `init-skill-graph.sh:18` derives a wrong repository root, `permissions-gate.ts:243` stops adding its `.opencode/` rule candidate, `sweep-memory-residue.mjs:307` and `alignment-validator.ts:382` classify `.skilled/` paths differently, and `compiled-route-guard.cjs:38` and `lib/compiled-route-manifest.cjs:503` keep `.opencode` constants. None is a generator or derived state, so they go to phase 009, which rewrites code references and runs before anything is published |
| The mirror parity gate refuses partial mirror commits | The plan commits each unit on its own. The gate blocks any commit that stages a generated mirror while another has unstaged changes, so the links, hook registrations, mirrors and Codex copies share `fd8213edb9`. No bypass variable was set |
| The sk-vision build writes an unignored file | `bun run build` also writes `skills/sk-vision/hooks/opencode/sk-vision.js`, which no ignore rule covers. It stays untracked and uncommitted, and phase 011 decides whether it needs a rule |
| The skill metadata grep needs a glob pathspec | AC-007's `git grep -- '.skilled/skills/*/graph-metadata.json'` also matches spec-kit test fixtures, because a git pathspec `*` crosses directories, so the row reads `:(glob).skilled/skills/*/graph-metadata.json` |
| The drift checker names sources in the command documents' spelling | Class `test-isolation`. After the rebuild, digests read `.skilled/` while the command documents still name `.opencode/` until phase 009, so the source-gap test compares the path without its root name |
### Handoff notes

| Phase | Note |
|-------|------|
| 009 | Re-run this phase's runbook after the rewrite (`plan.md` §4, rows 1 and 3 to 14, then row 15), as `009-reference-rewrite/plan.md` now says. `codex/generate-command-routers.cjs` needs its `CONTRACT_PATH`, `COMMANDS_DIR` and `ASSET_PATH_RE` changed together with the router text, and its 3 path drifts predate the move. Fix the `/.opencode/` path cuts in `init-skill-graph.sh:18`, `permissions-gate.ts:243`, `sweep-memory-residue.mjs:307` and `alignment-validator.ts:382` with dual-root logic, and move `compiled-route-guard.cjs:38`, `lib/compiled-route-manifest.cjs:503` and the comment at `command-scope.cjs:19`. `validate-command-references.cjs` still scans command text with `.opencode`-only patterns and lists two commands the prompt generator excludes. Once the command documents name `.skilled/`, the drift checker's row that rewrites command documents to `.skilled/` tests nothing and should flip to `.opencode/` |
| 010 | Create each consumer root's `.skilled` link before `~/.codex/hooks.json` receives `.skilled/` script paths, because the global Codex hooks run in every project and `.skilled/` paths miss where only `.opencode` exists. Dist freshness and retrieval roots rely on the same links. Before the main checkout takes the move, confirm no compiled-routing rollback sibling, lock or publication state exists under its `.opencode/bin/lib`, because the sync now compares `.skilled` paths textually |
| 011 | This phase deletes three tracked links, so the push range counts 4 deletions with phase 007's placeholder. A fresh checkout leaves `plugins/sk-vision.js` dangling until `vision-runtime` is built, and that build writes an unignored `hooks/opencode/sk-vision.js`. The `hook-registration-sync` failure predates the move and belongs to the pre-005 CI baseline |
<!-- /ANCHOR:log -->
