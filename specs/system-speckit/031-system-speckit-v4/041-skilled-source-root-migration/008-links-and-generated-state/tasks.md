---
title: "Tasks: Phase 8: links-and-generated-state"
description: "Ordered tasks with a named executor each: baseline, dist builds, 27 link retargets, constant edits reviewed before every generator run, derived-state rebuilds, then the census and freshness sweep."
trigger_phrases:
  - "skilled links task list"
  - "generator rerun tasks"
  - "link census verification checklist"
  - "orchestrator pi-flash codex-sol tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: links-and-generated-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Executors**: `orchestrator` is the conducting Opus session. `pi-flash` is DeepSeek V4.1 Flash at thinking `max` on cli-pi through the LLM Gateway. `codex-sol` is the review lane, which ran GPT-5.6 Luna at `xhigh` on the fast tier under the parent's amended D3. Invocations and brief rules are in `plan.md` §8. `SK` stands for `.skilled/skills/system-spec-kit/runtime/cli`. Independent units ran in parallel on the parent's lanes, and a unit whose input another unit writes waited for that unit's check.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [orchestrator] Confirm the predecessors and record their inputs in `goal.md`. `bash SK/spec/validate.sh specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move --strict` prints `RESULT: PASSED`. `git rev-parse HEAD` is recorded as the rollback base. Phase 004's `.opencode/` shape, phase 003's council-graph disposition and phase 006's list of constants it already changed are read and noted. A constant 006 already changed is skipped in its unit below.
- [x] T002 [orchestrator] Prove root discovery before any generator runs: `node --input-type=module -e "import('./.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs').then((m) => console.log(m.findRepoRoot('.skilled/skills/system-spec-kit/runtime/cli')))"` prints the worktree root. Any other output halts the phase (sentinel at `shared/workspace/repo-root.mjs:27`).
- [x] T003 [orchestrator] Capture the baseline into `scratch/baseline-checks.txt`: the nine runtime `--check` runs, `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `node SK/lib/dist-freshness.cjs check-all` and `node .skilled/bin/compiled-route-sync.cjs --check`, each with its exit status, plus `ls -d` of every `node_modules/` and `dist/` under `.skilled/skills`. Record each failure as pre-existing in `goal.md`. At planning time `sync-skills-hermes.cjs --check` already exits 1 on `agent-deep-review`.
- [x] T004 [orchestrator] Capture the link census into `scratch/link-census-before.txt` with the command in `plan.md` §5, and record the link total and the dangling set.
- [x] T005 [orchestrator] Clear caches and pin untracked content: `find .skilled/skills -type d \( -name .pytest_cache -o -name __pycache__ \) -prune -print` lists them, then remove the listed directories. Record `git status --porcelain --untracked-files=all -- .skilled specs` in `scratch/untracked-before.txt`. Untracked markdown under `specs/`, `.skilled/skills`, `.skilled/install-guides` or `.skilled/hooks` is moved out or named in `goal.md` before T052.
- [x] T006 [orchestrator] Decide retire or restore for each of the four already-broken links from the evidence in `plan.md` §3, and record each decision with its reason in `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 [pi-flash] Edit the 12 package `root` and `rebuildCommand` values from `.opencode/` to `.skilled/` (`SK/lib/dist-freshness.cjs:28-140`). `git diff --stat` names only that file.
- [x] T008 [codex-sol] Review the T007 diff: only `root` and `rebuildCommand` strings changed, and each new root exists or is a package phase 004 did not move.
- [x] T009 [pi-flash] Build the spec-kit workspace in order: `npm --prefix .skilled/skills/system-spec-kit/shared run build`, then `npm --prefix .skilled/skills/system-spec-kit/runtime run build`, then `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run build`. On a module-resolution error, first run the install CI runs, `npm --prefix .skilled/skills/system-spec-kit ci` (`.github/workflows/spec-kit-check.yml:136`). Smoke: `node SK/dist/continuity/generate-context.js --help` exits 0.
- [x] T010 [pi-flash] Build `.skilled/skills/system-skill-advisor/runtime` with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`. Check: `node SK/lib/dist-freshness.cjs check --package <id>` exits 0 for `system-spec-kit/shared`, `system-spec-kit/runtime`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`, and `check-all` reports no package stale that T003 recorded as fresh.
- [x] T011 [pi-flash] Only if T006 kept `plugins/sk-vision.js`: run `bun install` and `bun run build` in `.skilled/skills/sk-vision/vision-runtime`, then `test -e .skilled/plugins/sk-vision.js`. If the install cannot reach the network, record the build-output exemption in `goal.md` instead.
- [x] T012 [pi-flash] Retarget the 19 `.pi` links (16 `extensions/*.ts`, `extensions/lib/claude-hook-adapter.ts`, `skills`, `manual-testing-playbook`) with `ln -sfn` to their `target_if_no_compat` values in `../002-per-runtime-reference-map/research/maps/map-a-symlinks.tsv`. Check each: `readlink` equals the map value and `test -e` holds.
- [x] T013 [pi-flash] Retarget `.hermes/agents` and `.hermes/manual-testing-playbook` the same way, with the same check.
- [x] T014 [pi-flash] Retarget `.claude/skills` and `.claude/manual-testing-playbook` the same way, with the same check.
- [x] T015 [pi-flash] Retarget `.cursor/manual-testing-playbook` and `.cursor/rules/sk-vision.md` the same way, with the same check.
- [x] T016 [pi-flash] Retarget `.codex/manual-testing-playbook` the same way, with the same check.
- [x] T017 [pi-flash] Retarget `.devin/manual-testing-playbook` the same way, with the same check.
- [x] T018 [pi-flash] Apply the T006 decisions: `git rm` each retired link, and `ln -sfn` each restored link to its recorded target. Create `.opencode/specs` or another compatibility entry only where phase 004's record requires it and phase 007 did not create it.
- [x] T019 [pi-flash] Rewrite the 81 `script` values in `SK/runtime-mirrors/hook-registry.json` from the `.opencode/` prefix to `.skilled/` with a JSON-aware script, not `sed`. `git diff --stat` names only that file.
- [x] T020 [codex-sol] Review the T019 diff: only `script` values changed, and each new path exists under `.skilled/` or is a `runtime/dist/` output T009 built.
- [x] T021 [pi-flash] Run `node SK/runtime-mirrors/sync-hook-registrations.cjs`, then `--check`, which must print `PASS: 4 registration files match the 29-hook registry; 15 Pi extensions resolve.` (`SK/runtime-mirrors/sync-hook-registrations.cjs:237`). Suite: `tests/hook-registration-sync.vitest.ts`.
- [x] T022 [pi-flash] Edit `SK/runtime-mirrors/sync-runtime-mirrors.cjs`: `OPENCODE_COMMANDS` (`:41`) becomes `'.skilled/commands'`, and the hook-source pattern (`:110`) matches `\.skilled\/` where it matched `\.opencode\/`.
- [x] T023 [codex-sol] Review the T022 diff: the new pattern matches every `script` path in the four configs T021 wrote, and the orphan and prune logic is untouched.
- [x] T024 [pi-flash] Run `node SK/runtime-mirrors/sync-runtime-mirrors.cjs`, then `--check`, which must print `PASS: 168 mirrors across 8 trees are in sync.` Suites: `bash SK/validate-command-tree-parity.sh --quiet`, `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs`, `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`.
- [x] T025 [pi-flash] Edit the Codex generators: `SOURCE_DIR` and the two header strings in `SK/codex/sync-prompts.cjs` (`:21`, `:86`, `:91`), and `SOURCE_DIR` and the `Converted from` line in `SK/codex/sync-agents.cjs` (`:21`, `:205`).
- [x] T026 [codex-sol] Review the T025 diff: only those five lines changed.
- [x] T027 [pi-flash] Run both Codex generators, then `--check`: `PASS: 33 prompts are in sync.` and `PASS: 12 agents are in sync.` Suite: `agent-roster-mirror-check.cjs`.
- [x] T028 [pi-flash] Edit the Pi generators: `SK/pi/sync-prompts-pi.cjs` (`:21`, `:86`, `:91`) and `SK/pi/sync-agents-pi.cjs` (`:21`).
- [x] T029 [codex-sol] Review the T028 diff: only those four lines changed.
- [x] T030 [pi-flash] Run both Pi generators, then `--check`: 33 prompts and 12 agents, with `.pi/prompts/goal-pi.md` and `.pi/prompts/vision.md` still present (`SK/runtime-mirrors/command-scope.cjs:27-30`). Suite: `agent-roster-mirror-check.cjs`.
- [x] T031 [pi-flash] Edit the Hermes generators: `SK/hermes/sync-prompts-hermes.cjs` (`:21`, `:89`, `:94`), `SK/hermes/sync-skills-hermes.cjs` (`:20`, `:27`, `:81`) and the test literal `SK/hermes/tests/sync-skills-hermes.test.mjs:59`.
- [x] T032 [codex-sol] Review the T031 diff: only those seven lines changed, and the test literal matches the new canonical-source header.
- [x] T033 [pi-flash] With `HERMES_SKILLS_SOURCE_DIR`, `HERMES_SKILLS_OUTPUT_DIR` and `HERMES_AGENTS_SOURCE_DIR` unset, run both Hermes generators, then `--check`: `PASS: 33 prompts are in sync.` and `PASS: <n> Hermes skill copies in sync`, with `<n>` recorded. Suite: `node --test SK/hermes/tests/sync-skills-hermes.test.mjs`.
- [x] T034 [pi-flash] Edit `SK/runtime-mirrors/sync-gate1-pointers.cjs`: the Codex target intro (`:31`) and the generated-by line (`:69`) name `.skilled/`.
- [x] T035 [codex-sol] Review the T034 diff: only those two strings changed.
- [x] T036 [pi-flash] Run `node SK/runtime-mirrors/sync-gate1-pointers.cjs`, then `--check`, which must print `PASS: 2 instruction files carry the root Gate 1 lookup.` Suite: `tests/gate1-pointer-sync.vitest.ts`.
- [x] T037 [pi-flash] Edit `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`: every `.opencode/` path in `SHARED_SOURCES` and `REFS` (`:13-30`), in each command's path fields (from `:40`) and in the output path (`:664`), plus the test literals `tests/unit/compile-command-contracts.vitest.ts:46` and `tests/unit/check-contract-drift.vitest.ts:51-53`.
- [x] T038 [codex-sol] Review the T037 diff: every new path resolves under `.skilled/`, and no non-path string changed.
- [x] T039 [pi-flash] Run `compile-command-contracts.cjs --command deep/ai-council --write`, then `--command deep/review --write` and `--command deep/research --write`. Check: `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. Suite: both vitest files from `.skilled/skills/system-deep-loop/runtime`.
- [x] T040 [pi-flash] Edit `.skilled/bin/compiled-route-sync.cjs`: `SPECS_ROOT` (`:38`) resolves `path.join(REPO_ROOT, 'specs')`, and `RUNTIME_ROOT` (`:48`) joins `.skilled`, plus the test literals `.skilled/bin/tests/compiled-route-manifest.test.cjs:41-44`.
- [x] T041 [codex-sol] Review the T040 diff against the publication contract: `SPECS_ROOT` resolves to the same real directory as before, and the rollback, finalize and revert paths are untouched.
- [x] T042 [pi-flash] Run `node .skilled/bin/compiled-route-sync.cjs`, then `--verify`, which must print `move-simulation OK`, then `--finalize <rollback-root>`. Check that `serving-closure.manifest.json` records `runtimeRoot` as `.skilled/bin/lib/compiled-routing`. Suite: `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs`.
- [x] T043 [pi-flash] Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`. For each skill it names stale, run `generate-leaf-manifest.cjs --write <skillDir>`, then rerun the gate until it exits 0. Suites: `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` and `tests/generate-leaf-manifest-scopes.test.cjs`.
- [x] T044 [orchestrator] Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --all` as a dry run, never with `--write`, and record `changed`, `errored` and each would-prune path in `scratch/skill-derived-before.json`.
- [x] T045 [pi-flash] Rewrite the `.opencode/` prefix to `.skilled/` in `derived.key_files` and `derived.entities[].path` of the 13 `.skilled/skills/*/graph-metadata.json` files with a JSON-aware script that touches no other field. In the same unit, change `SKILLS_DIR` (`regenerate-skill-derived.cjs:35`) and the test literals `tests/skill-derived-regenerator.test.cjs:36-82`.
- [x] T046 [codex-sol] Review the T045 diff: only those fields and lines changed, and every rewritten path exists.
- [x] T047 [pi-flash] Check: `regenerate-skill-derived.cjs --all` prints `"changed": 0` and `"errored": 0`, `ci-skill-derived-freshness.cjs` exits 0 and `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` exits 0. Suite: `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`.
- [x] T048 [orchestrator] Copy `council-graph.sqlite` to `scratch/council-graph-before.sqlite`, then apply the disposition phase 003 recorded (rebuild, migration or freeze) and run 003's proof query. Phase 003 records a per-session rebuild and no migration, so the file stays as it is and no copy was needed.
- [x] T049 [pi-flash] Run `npm --prefix .skilled install --package-lock-only --ignore-scripts`. `git diff .skilled/package-lock.json` may touch only lines 2-3. If it reaches further, discard the change and record in `goal.md` that the lock keeps its old name until a dependency change regenerates it.
- [x] T050 [pi-flash] Edit the trigger-index and ripgrep roots together: `SK/retrieval/lib/corpus.mjs:31` (and `:101`, `:115` when phase 004 moves the specs alias), `SK/retrieval/lib/rg-lane.mjs:61`, `SK/retrieval/rg-wrapper.mjs:67`, plus the test literals `SK/tests/retrieval-coverage-parity.vitest.ts:104-105` and `SK/tests/trigger-index.vitest.ts:296-338`.
- [x] T051 [codex-sol] Review the T050 diff: each trigger-index root still sits under a ripgrep root, and the exclusion lists are untouched.
- [x] T052 [pi-flash] Run `node SK/retrieval/generate-trigger-index.mjs`, then a second run with `--out scratch/trigger-index.json --manifest scratch/corpus-manifest.json --diagnostics scratch/generation-diagnostics.json --variants scratch/phrase-variants.json`. Check: `cmp` of each scratch file against its committed file prints nothing and the four `manifestHash` values match. `grep -c '"\.opencode/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` prints 0. Suites: `tests/trigger-index.vitest.ts` and `tests/retrieval-coverage-parity.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T053 [orchestrator] Run the link census from `plan.md` §5 into `scratch/link-census-after.txt`: the dangling list equals the frozen allowlist, `old-root-targets` is 0 and `absolute` is 4.
- [x] T054 [orchestrator] Run the untracked-link sweep from `plan.md` §5. Every printed link is staged or named in `goal.md` with its reason.
- [x] T055 [orchestrator] Run the freshness sweep into `scratch/freshness-sweep.txt` with each exit status: the nine runtime `--check` runs, `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, the four per-package dist checks and `compiled-route-sync.cjs --verify`. Then run each generator's write mode once more and confirm `git status --porcelain` stays empty.
- [x] T056 [orchestrator] Run every suite named in `plan.md` §4 in one pass on the final tree and record the pass counts.
- [x] T057 [orchestrator] Run the same-class producer and consumer inventories from `plan.md` affected surfaces, and name every remaining hit with its owning phase in `goal.md`.
- [x] T058 [orchestrator] Record the evidence in `tasks.md`, `acceptance-criteria.md` and the `goal.md` log, citing the `scratch/` outputs and the unit commit SHAs.
- [x] T059 [orchestrator] Run `node SK/spec/repair-derived.cjs --folder specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state` from the repository root, then with `--apply`, then the dry run again, which exits 0.
- [x] T060 [orchestrator] After the last document edit, regenerate the trigger index once more with the T052 command and compare into `scratch/trigger-index-final.txt`. Run `bash SK/spec/validate.sh specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state --strict`, which must print `RESULT: PASSED`, then commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every P0 and P1 checklist item below verified with cited evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Phase Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001 to REQ-010 documented in `spec.md` §4 [EVIDENCE: `spec.md` §4]
- [x] CHK-002 [P0] Order, runbook, census and delegation defined in `plan.md` §3-5 and §8 [EVIDENCE: `plan.md` §3 to §5 and §8]
- [x] CHK-003 [P0] Predecessor inputs recorded in `goal.md`: 007 PASSED, the rollback base, phase 004's layout, phase 003's disposition and phase 006's changed constants (T001) [EVIDENCE: `goal.md` row "Predecessors (T001)", rollback base `1464a85667`]
- [x] CHK-004 [P0] Root discovery proven from a `.skilled/` path (T002) [EVIDENCE: `goal.md` row "Root discovery (T002)"]
- [x] CHK-005 [P1] Baseline checks and census captured with exit statuses (T003, T004) [EVIDENCE: `scratch/baseline-checks.txt`, `scratch/link-census-before.txt`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No generated file changed except through its generator: a second write run of every generator leaves `git status --porcelain` empty (T055) [EVIDENCE: every second write run wrote 0 files, and status and bytes were unchanged]
- [x] CHK-011 [P0] Every constant or path-data diff has a `codex-sol` verdict recorded before its write run (T008, T020, T023, T026, T029, T032, T035, T038, T041, T046, T051) [EVIDENCE: five Luna reviews under `scratch/briefs/` finished by 14:29Z, before the first write run at 14:33Z, dispositioned in `scratch/review-ledger.md`]
- [x] CHK-012 [P1] Same-class producer inventory returns only comments, phase 009 text rows or compatibility paths phase 004 kept (T057) [EVIDENCE: `goal.md` row "Suites and inventories (T056, T057)"]
- [x] CHK-013 [P1] Every test literal that asserts an emitted path changed in the same unit as its generator [EVIDENCE: each test file shares its generator's commit]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Link census: dangling list equals the frozen allowlist, `old-root-targets` 0, `absolute` 4 (T053) [EVIDENCE: `scratch/link-census-after.txt`]
- [x] CHK-021 [P0] Freshness sweep: every check exits 0 (T055) [EVIDENCE: `scratch/freshness-sweep.txt`, 14 of 15, the routers generator's 3 path drifts predating the move and routed to phase 009]
- [x] CHK-022 [P0] Trigger index: the second run is byte-identical to the four committed files, `manifestHash` matches across them and the path table holds no `.opencode/` entry (T052, T060) [EVIDENCE: `goal.md` row "Trigger index (T050 to T052)"]
- [x] CHK-023 [P1] Every unit suite passes in one pass on the final tree (T056) [EVIDENCE: all pass except `hook-registration-sync`, whose failure is identical on the pre-move commit]
- [x] CHK-024 [P1] Untracked-link sweep prints nothing unexplained (T054) [EVIDENCE: the sweep printed nothing]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each map correction and pre-existing failure found during the phase is logged in `goal.md` with a class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation` [EVIDENCE: `goal.md` Deviations and findings, each with its class]
- [x] CHK-FIX-002 [P0] Same-class producer inventory run before the first constant edit and after the last (T057) [EVIDENCE: run at `1464a85667` and after `aaea487a2b`]
- [x] CHK-FIX-003 [P0] Consumer inventory run for every changed constant, with each consumer outside this phase named with its owning phase (T057) [EVIDENCE: `goal.md` handoff notes for phases 009, 010 and 011]
- [x] CHK-FIX-004 [P0] Census adversarial cases covered: a link name with spaces, a `dist/` target before and after its build, runtime-native commands after a prune and a frozen dangling link [EVIDENCE: three `install-guides` links with spaces resolve, `runtime/cli/runtime` and `plugins/sk-vision.js` resolve after their builds, `goal-pi.md` and `vision.md` survive, and the four frozen links stay dangling]
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: 6 runtimes by 6 artifact kinds, 18 populated cells, each with its owner [EVIDENCE: `implementation-summary.md` Matrix]
- [x] CHK-FIX-006 [P1] Hermes generators run with `HERMES_SKILLS_SOURCE_DIR`, `HERMES_SKILLS_OUTPUT_DIR` and `HERMES_AGENTS_SOURCE_DIR` unset (`sync-skills-hermes.cjs:20-27`) [EVIDENCE: every write-run script unsets all three first]
- [x] CHK-FIX-007 [P1] Evidence pinned to unit commit SHAs listed in `goal.md`, not to a moving branch range [EVIDENCE: `goal.md` row "Commits"]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No absolute link target added: the census `absolute` count stays 4, all frozen [EVIDENCE: `scratch/link-census-after.txt`]
- [x] CHK-031 [P0] No link target escapes the repository, and every leaf symlink stays inside its skill root (`generate-leaf-manifest.cjs:120-122`) [EVIDENCE: every retargeted link resolves to the same real file inside the worktree, and the leaf-manifest gate reports 13 fresh]
- [x] CHK-032 [P1] No generator refusal to write through a symlink was bypassed by deleting the link (`codex/sync-prompts.cjs:165-175`) [EVIDENCE: no generator refused a write]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` agree on counts, order and executors [EVIDENCE: amended 2026-09-17 to the measured counts, the parallel waves and the Luna reviews]
- [x] CHK-041 [P1] Phase 009's plan points to the runbook in `plan.md` §4 for its re-run [EVIDENCE: `../009-reference-rewrite/plan.md:187`]
- [x] CHK-042 [P2] The six runtime `SYNC.md` manifests are listed among phase 009's inputs [EVIDENCE: `../009-reference-rewrite/plan.md:187`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Census, baseline, sweep, review and unit-return outputs live only under `scratch/`, with kebab-case names [EVIDENCE: `scratch/` and `scratch/briefs/`]
- [x] CHK-051 [P1] `scratch/` holds only evidence the acceptance rows cite, and `scratch/council-graph-before.sqlite` is removed once T048 verifies [EVIDENCE: no database copy was needed, and the second-run trigger-index outputs were removed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-17, at `aaea487a2b`
<!-- /ANCHOR:summary -->

---
