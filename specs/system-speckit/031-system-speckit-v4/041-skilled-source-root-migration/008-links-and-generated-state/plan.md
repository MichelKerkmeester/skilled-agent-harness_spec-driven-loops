---
title: "Implementation Plan: Phase 8: links-and-generated-state"
description: "Retarget 27 hand-made links, change the source constants of every owner and re-run them in a fixed order, then prove zero dangling links and fresh checks on the final tree. DeepSeek V4.1 Flash executes one unit per brief, GPT-5.6-sol reviews every constant diff and the orchestrator verifies each return."
trigger_phrases:
  - "skilled regeneration runbook"
  - "generator source constants order"
  - "broken link retire or restore"
  - "link census command"
  - "cli-pi deepseek flash delegation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: links-and-generated-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js generators in CommonJS and ESM, TypeScript packages built with `tsc`, one Bun build, one Python compiler |
| **Framework** | None. Repository-local generators, most with a read-only `--check` mode |
| **Storage** | Tracked symlinks, generated JSON, TOML and markdown, one tracked SQLite database |
| **Testing** | Vitest, `node --test`, self-running Node scripts and each generator's own check |

### Overview
The phase works in three passes. It retargets the 27 links no generator owns, changes the source constants of each owner and re-runs it in dependency order, then proves the tree with a link census and a freshness sweep. Line numbers cite files at `728c4f3efc` under `.opencode/`. Commands use the post-move `.skilled/` path, and `SK` stands for `.skilled/skills/system-spec-kit/runtime/cli`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `007-source-root-move` validates `RESULT: PASSED`, and its tip SHA is recorded in `goal.md` as the rollback base
- [x] Phase 004's layout record names the shape of `.opencode/`, including `.opencode/specs`
- [x] Phase 003 records the `council-graph.sqlite` disposition
- [x] `findRepoRoot` resolves the worktree root from a `.skilled/` path, which phase 006 delivers
- [x] The baseline checks and the link census are captured before the first change

### Definition of Done
- [x] The link census reports no dangling tracked link outside the frozen allowlist
- [x] Every check in the freshness sweep exits 0, and a second write run of each generator leaves `git status` clean
- [x] Every suite named per unit in §4 passes
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`, and every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generator-owned derived state. Each artifact has one owner that reads its source location from a constant. The owner's check mode is the proof of freshness. A path changes by editing the owner's constant and re-running the owner, never by editing the output.

### Key Components

**Link groups.** All 435 tracked links from `../002-per-runtime-reference-map/research/maps/map-a-symlinks.tsv`. A NUL-safe count on the worktree at `728c4f3efc` confirms 435 links with 8 dangling.

| Group | Links | Method | Proof |
|-------|------:|--------|-------|
| Generator-owned mirrors whose target moves | 144 | Edit `sync-runtime-mirrors.cjs` constants and re-run it: 66 command links (33 `.claude`, 33 `.cursor`) and 78 hook links (21 `.claude`, 18 `.codex`, 18 `.cursor`, 21 `.devin`) | `--check` PASS at 168 mirrors across 8 trees |
| Generator-owned mirrors whose target stays | 24 | The same run. Cursor and Devin agent mirrors source from `.claude/agents`, which does not move (`sync-runtime-mirrors.cjs:36-39`) | The same check |
| Hand-made runtime links | 27 | `ln -sfn` to the map's `target_if_no_compat` value: `.pi` 19, `.hermes` 2, `.claude` 2, `.cursor` 2, `.codex` 1, `.devin` 1 | `readlink` equals the map value and `test -e` holds |
| Internal links that travel with the tree | 203 | None. 201 relative links, plus `runtime/cli/runtime -> ../dist` and `runtime/shared -> ../shared/dist` | Census, after the dist builds |
| Broken before the move | 4 | Orchestrator decision, below | Census |
| Layout-dependent `.opencode/specs -> ../specs` | 1 | Follows phase 004. The map attributes the link to `runtime/cli/core/spec-root-migration.ts`, whose creating function is not wired into any caller (`:304`, `:356-357`), so nothing regenerates it | Census |
| `specs/` links | 29 | None. 22 never touch `.opencode`, and 7 frozen records stay as they are (parent D4) | Census allowlist |
| Root links outside the tree | 3 | None: `CLAUDE.md -> AGENTS.md`, `.mcp.json -> .claude/mcp.json`, `.claude/.utcp_config.json -> ../.utcp_config.json` | Census |

**Frozen allowlist.** Four `specs/` links dangle today and stay frozen. One is the absolute `global-hooks/pre-commit` link under `specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks/`. Three are absolute links under `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/` (`ws-alias`, `hostile/ws/specs/t/002-escape`, `hostile/ws/specs/t/003-file`). Three more frozen links under `specs/system-speckit/z_archive/022-hybrid-rag-fusion/` point into `.opencode/skills/system-spec-kit` by relative path. They join the allowlist by name only if phase 004's layout leaves that path unresolvable.

**Runtime files.** The map counts 198 generator rows: Hermes skill copies 68, Pi prompts 34, Codex prompts 33, Hermes prompts 33, Codex agents 12, Pi agents 12, hook registration files 4 and Gate 1 blocks 2. One of the 34 Pi rows, `.pi/prompts/goal-pi.md`, is hand-authored (`runtime-mirrors/command-scope.cjs:27-30`), so the generators own 197. The other 33 runtime rows are authored files that phase 009 rewrites.

### Broken-link decisions

The orchestrator decides each row at T006 and records the decision and its reason in `goal.md`. Each recommendation is input to that decision.

| Link | Evidence | Options | Recommendation |
|------|----------|---------|----------------|
| `.opencode/changelog/sk-design-md-generator -> ../skills/sk-design-md-generator/changelog` | The mode now lives at `skills/sk-design/sk-design-md-generator/changelog`. `changelog/sk-design` is already a link to the hub's own changelog. No tracked file outside `specs/` names the link path | Retire, or retarget to `../skills/sk-design/sk-design-md-generator/changelog` | Retire. The mode belongs to a hub whose changelog is already indexed |
| `.opencode/changelog/sk-doc/create-diagram -> ../../skills/sk-doc/sk-create-diagram/changelog` | The mode moved to `sk-design/sk-design-diagram` in `a131f628bc`, and its changelog exists there. No tracked file outside `specs/` names the link path | Retire, or recreate it under the sk-design index | Retire. Recreating it means turning `changelog/sk-design` from a link into a directory of mode links, which this phase does not own |
| `.opencode/skills/sk-doc/scripts/validate-flowchart.sh -> ../sk-create-diagram/scripts/validate-flowchart.sh` | The live script is `skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh`, and both diagram workflows call that path (`commands/design/assets/diagram-auto.yaml:215`, `diagram-confirm.yaml:182`). The old path survives only in `skills/sk-doc/README.md:192` and two generated retrieval fixtures | Retire, or retarget to `../../sk-design/sk-design-diagram/scripts/validate-flowchart.sh` | Retire. Phase 009 drops the README row, and the trigger-index run here rewrites the fixtures |
| `.opencode/plugins/sk-vision.js -> ../skills/sk-vision/vision-runtime/dist/plugin.js` | `dist/` is ignored (`.gitignore:51`) and was never built in this worktree. OpenCode loads the plugin through this link (`skills/sk-vision/SKILL.md:208`) | Build with `bun install` and `bun run build` (`vision-runtime/package.json:11`), or keep it as a build-output link the way `sync-runtime-mirrors.cjs:154-157` treats `dist/` targets | Keep the link and build it once on this machine so the census resolves. Record that a fresh checkout dangles until built |

### Data Flow
`hook-registry.json` feeds `sync-hook-registrations.cjs`, which writes four runtime hook configs. `sync-runtime-mirrors.cjs` reads those configs and the command tree, then writes 168 mirror links. The Codex, Pi and Hermes generators read `commands/`, `agents/` and `skills/` and write copies that embed source text. The contract compiler hashes its sources, the compiled-routing sync traces the serving closure and the trigger index hashes every markdown byte under its corpus roots. Each owner's check compares its committed output with a fresh build.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes path handling in shared generators, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Nine runtime generators under `SK/runtime-mirrors`, `SK/codex`, `SK/pi` and `SK/hermes` | Producers of 168 links and 197 runtime files | Update constants, re-run | Each `--check` exits 0 |
| `SK/runtime-mirrors/hook-registry.json` | Single source of 81 hook `script` paths | Update | `sync-hook-registrations.cjs --check` |
| `SK/lib/dist-freshness.cjs` | Package roots every spec-kit build calls in `prepare-build` and `record-build` | Update | Per-package `check` exits 0 |
| `compile-command-contracts.cjs`, `bin/compiled-route-sync.cjs`, `retrieval/lib/corpus.mjs`, `regenerate-skill-derived.cjs` | Producers or validators of derived state | Update constants, re-run | `check-contract-drift.cjs`, `--verify`, byte compare, dry run |
| `.github/workflows/spec-kit-check.yml:142-148` and `scripts/git-hooks/pre-commit:168-175` | Consumers that run the checks by their `.opencode` path | Unchanged here. Phase 005 owns them | This phase runs the checks directly |
| `commands/doctor/assets/doctor-runtime-mirrors.yaml:34-40` | Consumer that names generator paths for repair | Unchanged here. Phase 009 rewrites it | Not a gate |
| Generator test suites | Consumers that assert the emitted path | Update literals in the same unit | Suites in §4 |
| `~/.codex/hooks.json` | Installed copy of `.codex/hooks.json` | Unchanged here. Phase 010 reinstalls it | Out of scope |

Required inventories:
- Same-class producers: `rg -n "'\.opencode'|\.opencode/" SK/runtime-mirrors SK/codex SK/pi SK/hermes SK/retrieval/lib SK/lib/dist-freshness.cjs .skilled/bin/compiled-route-sync.cjs .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, run before the first edit and after the last. Every remaining hit is a comment, a phase 009 text row or a compatibility path phase 004 kept.
- Consumers of changed constants: `rg -n "sync-runtime-mirrors|sync-hook-registrations|sync-gate1-pointers|sync-prompts|sync-agents|sync-skills-hermes|compile-command-contracts|compiled-route-sync|generate-trigger-index|dist-freshness|CORPUS_ROOTS|DEFAULT_ROOTS" .github .skilled --glob '!**/dist/**' --glob '!**/benchmark/reports/**' --glob '!**/changelog/**'`. Each consumer outside this phase is named with its owning phase in `goal.md`.
- Matrix axes: runtime (Claude, Codex, Cursor, Devin, Hermes, Pi) by artifact kind (link, prompt, agent, skill copy, hook config, pointer block). The map populates 18 of the 36 cells, and each populated cell has an owner in §4.
- Invariant: every tracked link outside `.opencode/` and `specs/` resolves, is relative and has a target with no `.opencode` segment. Adversarial cases: a link name with spaces, a `dist/` target before and after its build, a runtime-native command inside a pruned directory and a frozen link that dangles.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. This section is the regeneration runbook those tasks execute.

Phase 009 re-runs row 1 and rows 3 to 14 after its text rewrite, plus row 15 for its own folder, because the outputs copy or hash source text. Codex and Pi agents embed the agent body (`codex/sync-agents.cjs:212`, `pi/sync-agents-pi.cjs:160`), Hermes copies embed the `SKILL.md` body (`hermes/sync-skills-hermes.cjs:90`), contracts hash their sources (`compile-command-contracts.cjs:657`) and the trigger index hashes every corpus byte (`generate-trigger-index.mjs:126-145`).

### Order

baseline and hygiene → dist builds → hand-made links → hook registrations → runtime mirrors → Codex, Pi and Hermes generators → Gate 1 pointers → command contracts → compiled routing → leaf manifests → skill graph metadata → council graph and package lock → trigger index → census and sweep → closing edits → spec metadata → trigger index refresh → validate

Why this order:
- The generators load `@spec-kit/shared` through the workspace link, and CI installs and builds it before running them (`.github/workflows/spec-kit-check.yml:131-137`). Every spec-kit build also calls `dist-freshness.cjs` with package roots from its constants.
- The Pi extension links must resolve before `sync-hook-registrations.cjs --check` verifies them (`:191-205`).
- `sync-runtime-mirrors.cjs` derives hook mirrors from the configs the registration step writes (`:14-16`, `:106-112`).
- The trigger index hashes every markdown byte, so it runs after all other writes, and once more after the closing document edits.

### Runbook

| # | Unit | Constants to change (at `728c4f3efc`) | Write | Check | Suite | Tasks |
|---|------|---------------------------------------|-------|-------|-------|-------|
| 1 | Dist builds | `SK/lib/dist-freshness.cjs:28-140`, the 12 `root` and `rebuildCommand` lines | `npm --prefix <pkg> run build` for `system-spec-kit/shared`, `runtime` and `runtime/cli`, then `system-skill-advisor/runtime` (build scripts at `shared/package.json:15`, `runtime/package.json:16`, `runtime/cli/package.json:13`, `system-skill-advisor/runtime/package.json:8`) | `node SK/lib/dist-freshness.cjs check --package <id>` exits 0 for the four ids (usage `:921`, stale exits 69 at `:14`), and `check-all` reports no package stale that was fresh at baseline | `node SK/dist/continuity/generate-context.js --help` (`system-spec-kit/package.json:23`) | T007-T011 |
| 2 | Hand-made links | None | `ln -sfn <target_if_no_compat> <link>`, one runtime directory per brief | `readlink` equals the map value and `test -e` holds | Census | T012-T018 |
| 3 | Hook registrations | `SK/runtime-mirrors/hook-registry.json`, 81 `script` values | `node SK/runtime-mirrors/sync-hook-registrations.cjs` | `--check` prints `PASS: 4 registration files match the 29-hook registry; 15 Pi extensions resolve.` (`:237`) | `tests/hook-registration-sync.vitest.ts` | T019-T021 |
| 4 | Runtime mirrors | `sync-runtime-mirrors.cjs:41` and `:110` | `node SK/runtime-mirrors/sync-runtime-mirrors.cjs` | `--check` prints `PASS: 168 mirrors across 8 trees are in sync.` (`:257`) | `bash SK/validate-command-tree-parity.sh --quiet`, `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs` | T022-T024 |
| 5 | Codex | `codex/sync-prompts.cjs:21,86,91`, `codex/sync-agents.cjs:21,205` | Both generators | `--check`: 33 prompts (`:148`) and 12 agents (`:261`) | `agent-roster-mirror-check.cjs` | T025-T027 |
| 6 | Pi | `pi/sync-prompts-pi.cjs:21,86,91`, `pi/sync-agents-pi.cjs:21` | Both generators | `--check`: 33 prompts (`:150`) and 12 agents (`:212`), with `goal-pi.md` and `vision.md` still present | `agent-roster-mirror-check.cjs` | T028-T030 |
| 7 | Hermes | `hermes/sync-prompts-hermes.cjs:21,89,94`, `hermes/sync-skills-hermes.cjs:20,27,81`, test literal `hermes/tests/sync-skills-hermes.test.mjs:59` | Both generators | `--check`: 33 prompts (`:149`) and `PASS: <n> Hermes skill copies in sync` (`:183`) | `node --test SK/hermes/tests/sync-skills-hermes.test.mjs` | T031-T033 |
| 8 | Gate 1 pointers | `sync-gate1-pointers.cjs:31` and `:69` | `node SK/runtime-mirrors/sync-gate1-pointers.cjs` | `--check` prints `PASS: 2 instruction files carry the root Gate 1 lookup.` (`:126`) | `tests/gate1-pointer-sync.vitest.ts` | T034-T036 |
| 9 | Command contracts | `compile-command-contracts.cjs:13-30`, each command's path fields from `:40`, output path `:664`, test literals `compile-command-contracts.vitest.ts:46` and `check-contract-drift.vitest.ts:51-53` | `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council --write`, then `deep/review` and `deep/research` (`:692`) | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0 (drift exits 2, `:32`) | Both vitest files, run from `.skilled/skills/system-deep-loop/runtime` | T037-T039 |
| 10 | Compiled routing | `bin/compiled-route-sync.cjs:38` (resolve `specs` directly, the directory the alias reached) and `:48`, test literals `bin/tests/compiled-route-manifest.test.cjs:41-44` | `node .skilled/bin/compiled-route-sync.cjs`, then `--verify`, then `--finalize <rollback-root>` (`:1024-1038`) | `--verify` prints `move-simulation OK` (`:732-733`), and `serving-closure.manifest.json` records `runtimeRoot` as `.skilled/bin/lib/compiled-routing` (written at `:827-831`) | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` | T040-T042 |
| 11 | Leaf manifests | None | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write <skillDir>`, only for skills the gate names stale (`:12-16`) | `ci-leaf-manifest-freshness.cjs` exits 0 (`:28-31`, its default directory follows the file at `:118`) | `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` and `tests/generate-leaf-manifest-scopes.test.cjs` | T043 |
| 12 | Skill graph metadata | `regenerate-skill-derived.cjs:35`, the `derived.key_files` and `derived.entities[].path` fields of 13 files, test literals `tests/skill-derived-regenerator.test.cjs:36-82` | JSON-aware prefix rewrite. The regenerator cannot rewrite a path (`:9-16`, `:114-137`) | `regenerate-skill-derived.cjs --all` prints `"changed": 0` and `"errored": 0` (`:255`), `ci-skill-derived-freshness.cjs` exits 0 (`:17-20`) and `skill_graph_compiler.py --validate-only` exits 0 (`:12`) | `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs` | T044-T047 |
| 13 | Council graph and package lock | Council graph per phase 003. Lock: none | Phase 003's command. `npm --prefix .skilled install --package-lock-only --ignore-scripts` | Phase 003's proof query. `git diff` of `.skilled/package-lock.json` touches only `:2-3` | None | T048-T049 |
| 14 | Trigger index | `retrieval/lib/corpus.mjs:31` (and `:101`, `:115` per phase 004), `retrieval/lib/rg-lane.mjs:61`, `retrieval/rg-wrapper.mjs:67`, test literals `tests/retrieval-coverage-parity.vitest.ts:104-105` and `tests/trigger-index.vitest.ts:296-338` | `node SK/retrieval/generate-trigger-index.mjs`, which writes the index and three fixtures (`:64-67`) | A second run with `--out`, `--manifest`, `--diagnostics` and `--variants` into `scratch/` is `cmp`-identical to the four committed files, `manifestHash` matches across all four (`commands/doctor/assets/doctor-speckit-retrieval.yaml:157`) and `grep -c '"\.opencode/' trigger-index.json` prints 0 | `tests/trigger-index.vitest.ts`, `tests/retrieval-coverage-parity.vitest.ts` | T050-T052, refreshed at T060 |
| 15 | Spec metadata | None | `node SK/spec/repair-derived.cjs --folder <this folder>`, then `--apply`, from the repository root (`:16-22`, `:38`, `:427-432`) | The dry run exits 0 | `validate.sh --strict` on this folder | T059 |

Vitest files under `SK/tests` run from `SK` with `npx vitest run --config ../../vitest.config.ts --project cli <file>` (`system-spec-kit/vitest.config.ts:39-54`). Deep-loop files run from `.skilled/skills/system-deep-loop/runtime` with `npx vitest run <file>` (`vitest.config.ts:15-17`). The `sk-create-skill` test scripts are self-running Node files (`scripts/tests/README.md:16`).

Every run of a Hermes generator happens with `HERMES_SKILLS_SOURCE_DIR`, `HERMES_SKILLS_OUTPUT_DIR` and `HERMES_AGENTS_SOURCE_DIR` unset, because each one overrides a source constant (`hermes/sync-skills-hermes.cjs:20-27`).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The generator suites named per unit in §4 | Vitest, `node --test`, self-running Node scripts |
| Integration | Freshness sweep: nine runtime `--check` runs, `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, per-package dist checks, `compiled-route-sync.cjs --verify` and the trigger index byte compare | Shell, with output and exit status read per command |
| Integration | Link census and untracked-link sweep | `git ls-files -s -z` with Python, `find -type l` and `comm` |
| Idempotence | A second write run of every generator | `git status --porcelain` stays empty |
| Manual | One generated file per generator names `.skilled/` in its header, for example `head -1 .codex/prompts/speckit-plan.md` | Shell |

### Link census

```bash
git ls-files -s -z | python3 -c '
import os, sys
links = [r.split(b"\t", 1)[1].decode() for r in sys.stdin.buffer.read().split(b"\0") if r.startswith(b"120000")]
dangling = sorted(l for l in links if not os.path.exists(l))
old_root = sorted(l for l in links if not l.startswith((".opencode/", "specs/")) and ".opencode" in os.readlink(l))
absolute = sorted(l for l in links if os.path.isabs(os.readlink(l)))
print("links", len(links))
print("dangling", len(dangling)); [print("  " + l) for l in dangling]
print("old-root-targets", len(old_root)); [print("  " + l) for l in old_root]
print("absolute", len(absolute))
'
```

Pass: `dangling` lists exactly the frozen allowlist in §3, `old-root-targets` is 0 and `absolute` is 4. The expected `links` total is 435, minus links retired at T018, plus compatibility links phase 004 adds, each difference named in `goal.md`.

### Untracked-link sweep

```bash
find .claude .codex .cursor .devin .hermes .pi .skilled .opencode -type l -not -path '*/node_modules/*' 2>/dev/null | sort > scratch/links-on-disk.txt
git ls-files -s -z | python3 -c 'import sys; [print(r.split(b"\t",1)[1].decode()) for r in sys.stdin.buffer.read().split(b"\0") if r.startswith(b"120000")]' | sort > scratch/links-tracked.txt
comm -23 scratch/links-on-disk.txt scratch/links-tracked.txt
```

Pass: `comm` prints nothing, or every printed link is named in `goal.md` with the reason it stays untracked.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `007-source-root-move` validated | Internal | Green, `RESULT: PASSED` at `1464a85667` | Nothing in this phase can start |
| Phase 006 root discovery under `.skilled/` | Internal | Green, `findRepoRoot` proven from `.skilled` paths (T002) | Generators resolve the wrong root and write into the wrong tree |
| Phase 004 layout record | Internal | Green, L1 | `.opencode/specs`, compatibility entries and the frozen allowlist stay undecided |
| Phase 003 council-graph disposition | Internal | Green, no migration needed | T048 waits. Every other unit proceeds |
| Phase 005 pre-commit and CI teach-in | Internal | Green, the mirror parity gate ran on every commit | Commits pass without mirror checks, so this phase runs them itself |
| Node.js and npm | External | Green, `node` v26.8.2 on this machine | Nothing runs |
| Bun | External | Green, `~/.bun/bin/bun` present | sk-vision stays a build-output link |
| cli-pi with the LLM Gateway | External | Green, units returned on the Gateway and Cline lanes | The orchestrator executes the units itself |
| cli-codex with GPT-5.6 Luna | External | Green, six reviews returned | Reviews wait, and no constant edit runs its write mode unreviewed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A check still failing after three repairs (parent D2), a dangling link outside the allowlist that its owner cannot fix, a suite that passed at baseline and now fails or a blocking review finding the unit cannot satisfy.
- **Procedure**: Each unit is its own commit, so `git revert --no-edit <unit-sha>` undoes one unit. Re-running that owner's check at the reverted constants confirms the old output matches. For the whole phase, `git revert --no-edit <rollback-base>..HEAD` in the worktree. Untracked build output is rebuilt after a revert. Nothing is pushed in this phase, so no remote state needs reverting.
<!-- /ANCHOR:rollback -->

---

## 8. DELEGATION

Parent decision D3 governs. Three executors appear in `tasks.md`:

| Label | Who | Invocation | Used for |
|-------|-----|------------|----------|
| `orchestrator` | The conducting Opus session | Direct | Baseline, decisions, verification of every return, council graph, spec metadata, census, sweep and commits |
| `pi-flash` | DeepSeek V4.1 Flash at thinking `max` on cli-pi, through the LLM Gateway | `AI_SESSION_CHILD=1 pi -p "<brief>" --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --mode text` (`cli-pi/SKILL.md:21`, `:217`, `cli-pi/references/providers-and-models.md:103`, `:113`) | One runtime directory's links, one generator's constant edit or one generator's write run with its check and suite |
| `codex-sol` | GPT-5.6 Luna at `xhigh` on the fast tier, read-only sandbox, under the parent's amended D3 | `codex exec --model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox read-only "<brief>"` (`cli-codex/SKILL.md:227`, `:269`, `cli-codex/references/providers-and-models.md:53`) | Second-family review of every constant or path-data diff before its write run |

Brief rules:
- One unit per brief, stated literally: the file, the line, the old text, the new text, the command to run and the output line that counts as success. A brief never bundles two runtime directories or two unrelated generators.
- Every `pi-flash` brief opens with the child-dispatch preamble (`cli-external-orchestration/shared/references/child-dispatch-preamble.md`) and inlines the `code` persona from the orchestrating runtime's agent directory. Every `codex-sol` brief inlines the `review` persona (`cli-pi/SKILL.md:216` states the persona rule).
- Outputs use kebab-case names under this folder's `scratch/`, for example `scratch/unit-returns/runtime-mirrors-review.md`. A unit that needs another pass records it as `iteration-2`, the state-record term the parent packet settled on.
- A unit is done when the orchestrator re-runs its check and suite and reads the output and the exit status itself. The next brief waits for that, and the orchestrator commits the unit.
- A blocking review verdict stops the unit. The orchestrator repairs the edit or the brief, and the review runs again before any write run.

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T006) ──► Builds and links (T007-T018) ──► Generators (T019-T042) ──► Derived state (T043-T052) ──► Verify (T053-T060)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 003, 004, 006 and 007 recorded | Builds and links |
| Builds and links | Setup | Generators |
| Generators | Builds and links, each unit after the one before it | Derived state |
| Derived state | Generators | Verify |
| Verify | Derived state | Phase 009 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimates, not measurements.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Builds, links and generators | High | 6-9 hours across 10 units and 9 reviews |
| Derived state | Medium | 3-4 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **12-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Rollback base SHA recorded in `goal.md` before T007
- [x] `council-graph.sqlite` copied to `scratch/council-graph-before.sqlite` before T048. Not needed, because phase 003's disposition changes nothing
- [x] The compiled-routing rollback sibling kept until `--verify` passes at T042

### Rollback Procedure
1. Stop the running unit and send no further brief.
2. Revert the unit's commit with `git revert --no-edit <unit-sha>`. Before `--finalize`, restore compiled routing with `node .skilled/bin/compiled-route-sync.cjs --revert <rollback-root>` instead.
3. Re-run the owner's check at the reverted constants, then the census. Read both outputs and both exit statuses.
4. Record the trigger, the revert SHA and the check output in the `goal.md` log.

### Data Reversal
- **Has data migrations?** Yes, if phase 003 records a migration of `council-graph.sqlite`.
- **Reversal procedure**: The database is tracked, so `git checkout <rollback-base> -- .skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` restores it. `scratch/council-graph-before.sqlite` is the second copy.
<!-- /ANCHOR:enhanced-rollback -->

---
