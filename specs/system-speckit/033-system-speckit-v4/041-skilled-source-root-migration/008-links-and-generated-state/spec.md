---
title: "Feature Specification: Phase 8: links-and-generated-state"
description: "After the rename, 174 links outside the moved tree still point into .opencode, and 198 runtime files plus every derived index, manifest, contract and build were produced against .opencode paths. Several owners narrow or prune silently when a root constant is wrong. This phase retargets the hand-made links, changes each generator's source constants and rebuilds every derived artifact through its owner."
trigger_phrases:
  - "skilled links and generated state"
  - "retarget runtime symlinks to skilled"
  - "regenerate runtime mirrors after move"
  - "link census zero dangling"
  - "generator freshness sweep"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: links-and-generated-state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-source-root-move |
| **Successor** | 009-reference-rewrite |
| **Handoff Criteria** | A link census with no dangling tracked link outside the frozen `specs/` allowlist, and every owner's freshness check passing on the final tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the skilled source-root migration specification.

**Scope Boundary**: Symlinks, and state that a generator or build owns. A file an author writes by hand belongs to phase 009, whatever path it names. Line numbers in these documents cite files as they stood at `728c4f3efc`, under `.opencode/`. After phase 007 the same lines sit under `.skilled/`, and every command in `plan.md` and `tasks.md` uses the `.skilled/` path.

**Dependencies**:
- `007-source-root-move` validates PASSED, so the authored tree sits under `.skilled/`.
- `006-dual-root-code-and-contracts` makes root discovery resolve under `.skilled/`. Every runtime generator calls `findRepoRoot`, which keys on the sentinel `.opencode/skills/system-spec-kit/SKILL.md` today (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:27`).
- `004-migration-design` records what `.opencode/` becomes. That record decides `.opencode/specs`, the compatibility entries this phase censuses and whether old-prefix paths still resolve while phase 009 runs.
- `003-layout-probes` records how `council-graph.sqlite` is rebuilt, migrated or frozen.
- `005-gate-and-ci-readiness` teaches the pre-commit hook the new root. Until then the hook skips any mirror check whose script is missing at the old path (`.opencode/scripts/git-hooks/pre-commit:179-180`), so this phase runs every check itself.

**Deliverables**:
- 27 hand-made runtime links retargeted to `.skilled/`, and a recorded decision applied to each of the four links that were broken before the move.
- Source constants changed and output regenerated for nine runtime generators, the dist-freshness library, the command-contract compiler, the compiled-routing sync and the trigger-index generator.
- Dist builds, leaf manifests, the 13 skill `graph-metadata.json` path fields, `council-graph.sqlite`, `.skilled/package-lock.json` and this folder's spec metadata brought fresh through their owners.
- A link census and a freshness sweep with recorded output, kept as a runbook that phases 009 and 011 re-run.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007 moves the files, and nothing that points at them moves along. Of the 435 tracked symlinks, 174 outside the moved tree target a path inside it: 144 written by `sync-runtime-mirrors.cjs`, 27 made by hand and 3 in a frozen archive. Beyond the links, 198 runtime files and every derived index, manifest, compiled contract and build were produced against `.opencode` paths.

Editing that output by hand does not hold, because the next generator run overwrites it. Leaving the generators alone fails more quietly. The trigger index walks a hard-coded root list and publishes a narrower corpus without complaint when a root is missing (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:69-78`, `retrieval/lib/corpus.mjs:31`). The skill-metadata regenerator prunes a path it cannot find instead of rewriting it (`.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:9-16`, `:114-137`). The hook mirrors only collect script paths that match an `.opencode` pattern (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:110`).

### Purpose
Every tracked link resolves into `.skilled/` without depending on a compatibility `.opencode/`, and every generated or derived artifact is rebuilt by its owner and proven fresh by that owner's own check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retarget the 27 hand-made runtime links that point into `.opencode`: 19 under `.pi`, 2 under `.hermes`, 2 under `.claude`, 2 under `.cursor`, 1 under `.codex` and 1 under `.devin`.
- Change the source constants of the nine runtime generators and re-run them. They are `sync-hook-registrations.cjs` through `hook-registry.json`, `sync-runtime-mirrors.cjs` for 168 links, `sync-gate1-pointers.cjs` and the six Codex, Pi and Hermes prompt, agent and skill generators. Between them they own 197 runtime files.
- Rebuild derived state through its owner: dist builds, compiled command contracts, the compiled-routing closure, leaf manifests, the trigger index with its three generator fixtures, the 13 skill `graph-metadata.json` path fields, `council-graph.sqlite`, `.skilled/package-lock.json` and this folder's spec metadata.
- Decide and apply retire or restore for the four links already broken before the move.
- Change the test literals that assert a generator's emitted path, in the same unit as that generator.
- Run a whitespace-safe link census and a freshness sweep, recorded as a runbook for phases 009 and 011.

### Out of Scope
- Text references in authored files, including the six runtime `SYNC.md` manifests, the `.claude/agents` fork and README prose - phase 009 rewrites them and then re-runs this runbook, because generated copies embed that text.
- CI workflow filters and the pre-commit hook's script paths - phase 005.
- Root discovery (`repo-root.mjs`), launchers, installers and the `retrieval-repo-root.vitest.ts` assertions that pin the old root - phase 006.
- Global git hooks and home configs, including `~/.codex/hooks.json`, which is installed from `.codex/hooks.json` - phase 010.
- Frozen records: the 7 frozen `specs/` links, benchmark reports and changelogs - parent decision D4.
- Recorded retrieval fixtures that no generator writes, such as `latency-report.json` and `daemon-off-proof.json`, and the scaffold golden snapshot - they follow text that phase 009 rewrites.
- Live runtime load tests - phase 011.

### Files to Change

Paths are post-move. Line numbers cite the pre-move file at `728c4f3efc`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/*.ts` (16), `.pi/extensions/lib/claude-hook-adapter.ts`, `.pi/skills`, `.pi/manual-testing-playbook` | Modify | Retarget 19 hand-made links to `.skilled/` |
| `.hermes/agents`, `.hermes/manual-testing-playbook` | Modify | Retarget 2 hand-made links |
| `.claude/skills`, `.claude/manual-testing-playbook`, `.cursor/manual-testing-playbook`, `.cursor/rules/sk-vision.md`, `.codex/manual-testing-playbook`, `.devin/manual-testing-playbook` | Modify | Retarget 6 hand-made links |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Modify | Package `root` and `rebuildCommand` values (`:28-140`, 12 lines) that every spec-kit build calls |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | 81 `script` values move to the `.skilled/` prefix |
| `.claude/settings.json` (`hooks` key), `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Regenerate | `sync-hook-registrations.cjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | `OPENCODE_COMMANDS` (`:41`) and the hook-source pattern (`:110`) |
| `.claude/commands/**`, `.cursor/commands/*.md`, `.claude/hooks/*`, `.codex/hooks/*`, `.cursor/hooks/*`, `.devin/hooks/*`, `.cursor/agents/*.md`, `.devin/agents/*/AGENT.md` | Regenerate | 168 mirror links from `sync-runtime-mirrors.cjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, `codex/sync-agents.cjs`, `pi/sync-prompts-pi.cjs`, `pi/sync-agents-pi.cjs`, `hermes/sync-prompts-hermes.cjs`, `hermes/sync-skills-hermes.cjs` | Modify | Source directory constants and generated header strings |
| `.codex/prompts/*.md`, `.codex/agents/*.toml`, `.pi/prompts/*.md`, `.pi/agents/*.md`, `.hermes/prompts/*.md`, `.hermes/skills/*/SKILL.md` | Regenerate | 191 files from six generators |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs` | Modify | Target intro (`:31`) and generated-by line (`:69`) |
| `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md` | Regenerate | Gate 1 pointer blocks only |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | Source, reference, command and output path constants (`:13-30`, `:40` onward, `:664`) |
| `.skilled/commands/deep/assets/compiled/*.contract.md` (3) | Regenerate | `compile-command-contracts.cjs --write` |
| `.skilled/bin/compiled-route-sync.cjs` | Modify | `SPECS_ROOT` (`:38`) and `RUNTIME_ROOT` (`:48`) |
| `.skilled/bin/lib/compiled-routing/**` | Regenerate | Promoted closure and `serving-closure.manifest.json` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`, `retrieval/lib/rg-lane.mjs`, `retrieval/rg-wrapper.mjs` | Modify | Trigger-index and ripgrep roots, changed together |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerate | `generate-trigger-index.mjs` |
| `.skilled/skills/*/graph-metadata.json` (13) | Modify | `derived.key_files` and `derived.entities[].path` prefixes, proven by the owner's dry run |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modify | `SKILLS_DIR` (`:35`) |
| `.skilled/skills/*/leaf-manifest.json` | Regenerate | Only the manifests `ci-leaf-manifest-freshness.cjs` reports stale |
| `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` | Regenerate | Per phase 003's recorded disposition |
| `.skilled/package-lock.json` | Regenerate | Top-level `name` and `version` lines (`:2-3`) |
| Test files that assert an emitted path | Modify | Listed per unit in `plan.md` §4 |
| The four already-broken links | Delete or Modify | Per the decision recorded at T006 |
| This folder's `description.json` and `graph-metadata.json` | Regenerate | `repair-derived.cjs --apply` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every tracked symlink resolves, except the frozen `specs/` records named in the allowlist in `plan.md` §3. The census enumerates links with NUL-separated output, so names with spaces count correctly. |
| REQ-002 | The 27 hand-made runtime links point directly at `.skilled/`, each equal to its `target_if_no_compat` value in `002-per-runtime-reference-map/research/maps/map-a-symlinks.tsv`. |
| REQ-003 | The 168 mirror links change only through a `sync-runtime-mirrors.cjs` run from edited constants. Its check reports 168 mirrors across 8 trees, and a second write run links and removes nothing. |
| REQ-004 | The 197 generated runtime files change only through their eight generators. Every generator's `--check` exits 0, and a second write run changes no file. |
| REQ-005 | Dist builds, compiled command contracts, the compiled-routing closure, leaf manifests and the trigger index with its three fixtures are rebuilt by their owners, and each owner's freshness proof passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each of the four links broken before the move carries a recorded retire-or-restore decision, applied and censused. |
| REQ-007 | The 13 skill `graph-metadata.json` derived blocks name only existing `.skilled/` paths, and the owner's dry run reports no change and no error. `regenerate-skill-derived.cjs` never runs with `--write` in this phase. |
| REQ-008 | `council-graph.sqlite`, `.skilled/package-lock.json` and this folder's spec metadata are handled by their owners: phase 003's recorded disposition, an npm lock-only install and `repair-derived.cjs`. |
| REQ-009 | Every source-constant or path-data diff has a GPT-5.6-sol review recorded before its write run, and the orchestrator re-runs every delegated unit's check and suite before the next unit starts. |
| REQ-010 | The regeneration order, commands, checks and suites are recorded as a runbook that phases 009 and 011 re-run unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The link census prints a dangling list equal to the frozen allowlist. It counts 0 links outside `.opencode/` and `specs/` whose target contains `.opencode`, and 4 absolute targets, all frozen.
- **SC-002**: The freshness sweep exits 0 for all nine runtime generator checks, `check-contract-drift.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `compiled-route-sync.cjs --verify` and the per-package dist checks. A second trigger-index run into `scratch/` is byte-identical to the committed files.
- **SC-003**: Every suite named per unit in `plan.md` §4 passes in one pass on the final tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 root discovery | Every runtime generator resolves its repository root through `findRepoRoot`, and a wrong root writes mirrors into the wrong tree | T002 proves the root from a `.skilled/` path before any generator runs, and the phase halts when it does not |
| Dependency | Phase 004 layout record | `.opencode/specs`, the compatibility entries and the reach of old-prefix paths stay undecided | T001 reads the record. Units that depend on it name the branch they took in their return |
| Dependency | Phase 003 council-graph probe | `council-graph-db.ts` exposes init, upsert and cleanup (`:244`, `:418`, `:745`) but no rebuild entry point | T048 applies the disposition 003 records, and stays blocked until it exists |
| Risk | Generated output edited by hand | High. The next run overwrites it, or a parity gate fails | Every output changes only through its generator, and a second write run must leave `git status` clean |
| Risk | The orchestrating session's own hooks break | High. `.claude/settings.json` hooks run in the conducting Claude session, and `.codex/hooks.json` runs in every review dispatch | T020 checks that every rendered script path exists before T021 writes. Each rendered command carries a drift fallback, so a missing adapter prints `mk-hook-drift` instead of blocking (`sync-hook-registrations.cjs:59-75`) |
| Risk | The trigger index publishes over a narrowed or polluted corpus | High. Gate 1 lookups miss documents without an error | Change the corpus roots first, clear untracked markdown and caches from corpus roots, regenerate last and compare a second run byte for byte |
| Risk | `regenerate-skill-derived.cjs --write` prunes old-prefix paths | High. Routing entries are deleted | Never pass `--write` here. Rewrite the path fields with a JSON-aware script and use the dry run as the proof |
| Risk | A `.pytest_cache` or `__pycache__` inside a skill stales a leaf manifest | Medium. A false stale report, or a manifest that lists cache files | The leaf walker adds every file it finds (`generate-leaf-manifest.cjs:96-110`). T005 removes caches, and no pytest runs between T005 and T043 |
| Risk | Pi and Hermes drift stays invisible | Medium. Neither CI (`.github/workflows/spec-kit-check.yml:142-148`) nor pre-commit (`pre-commit:168-175`) runs the Pi or Hermes checks | The sweep runs all nine. `sync-skills-hermes.cjs --check` already exits 1 at `728c4f3efc` on `agent-deep-review`, recorded as pre-existing |
| Risk | A link name with spaces is miscounted | Low. Three `install-guides` links carry spaces | The census reads `git ls-files -s -z` |
| Risk | sk-vision cannot build offline | Low. `bun install` needs the network | Fall back to the build-output rule `sync-runtime-mirrors.cjs:154-157` applies to `dist/` targets, and record it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No latency target applies. The phase changes where generators read and write, not any path a runtime executes per prompt, and the committed cold-lookup budget in `retrieval/fixtures/latency-report.json` is not rewritten here.

### Security
- **NFR-S01**: No link target escapes the repository and no absolute target is added. The absolute count stays at the four frozen records, and every leaf symlink stays inside its skill root (`generate-leaf-manifest.cjs:120-122`).
- **NFR-S02**: Generators keep refusing to write through a symlink at an output path (`codex/sync-prompts.cjs:165-175`). A refusal halts the unit, and nobody deletes the link to get past it.

### Reliability
- **NFR-R01**: Every generator is idempotent. A second write run changes nothing, which `sync-runtime-mirrors.cjs` reports as `Linked 0, removed 0` (`:298`).
- **NFR-R02**: The trigger index is deterministic. Two runs over one tree produce byte-identical output (`generate-trigger-index.mjs:10-11`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Link names with spaces: three `.opencode/install-guides/MCP - *.md` links. The census reads NUL-separated output.
- Links into build output: `runtime/cli/runtime -> ../dist`, `runtime/shared -> ../shared/dist` and the hook mirrors that target `runtime/dist/hooks/` resolve only after the builds in T009 to T011, so the final census (T053) runs after them.
- Runtime-native commands: `.pi/prompts/goal-pi.md`, `.pi/prompts/vision.md` and the Cursor pair must survive every prune (`runtime-mirrors/command-scope.cjs:27-30`).

### Error Scenarios
- A generator refuses to write through a symlink: halt the unit and report the path.
- The trigger index meets a malformed document: it exits 1, publishes nothing and still rewrites diagnostics (`generate-trigger-index.mjs:13-17`, `:31`). Fix the document through its owner, then rerun.
- `regenerate-skill-derived.cjs` reports an error: it exits 2 and writes nothing (`:139-147`, `:257`). Read it as a path field the rewrite missed.
- A frozen `specs/system-speckit/z_archive/022-hybrid-rag-fusion/` link dangles because phase 004 left `.opencode/skills` unresolvable: add it to the allowlist by name and leave the link alone.

### State Transitions
- Partial completion: every unit lands as its own commit, so a resumed session reruns the freshness sweep and starts at the first unit that fails.
- A document edit after the trigger index run: the index hashes every corpus byte (`generate-trigger-index.mjs:126-145`), so T060 regenerates it after the last edit of the phase.
- Compiled routing interrupted between build and finalize: the rollback sibling is still in place, and `--revert <rollback-root>` restores the serving root (`bin/compiled-route-sync.cjs:1024-1038`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 435 links censused, 27 retargeted, 197 runtime files and the derived artifacts regenerated across 13 owner units |
| Risk | 19/25 | Generator constants feed hooks every runtime executes, and three owners fail quietly when a root is wrong |
| Research | 8/20 | The maps exist. Three inputs wait on phases 003, 004 and 006 |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **UNKNOWN:** which command rebuilds or migrates `council-graph.sqlite`. Phase 003 records it. The writer names the file at `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts:81` and exposes no rebuild entry point.
- **UNKNOWN:** the shape of `.opencode/` after the move. Phase 004 decides whether `.opencode/specs` exists, whether old-prefix paths resolve and so whether the three frozen `z_archive/022-hybrid-rag-fusion` links still resolve.
- **UNKNOWN:** whether phase 006 already changed a constant this phase plans to change. T001 reads 006's record, and a constant already changed is skipped.
- **UNKNOWN:** whether phase 007's rename carried untracked `node_modules/`, `dist/` and caches along. T003 records what is present before any build.
- Retire or restore for each of the four already-broken links: the orchestrator decides at T006 from the evidence in `plan.md` §3.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown and Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Phase Goal**: See `goal.md`
- **Source Maps**: See `../002-per-runtime-reference-map/research/research.md` §3-5 and §7
