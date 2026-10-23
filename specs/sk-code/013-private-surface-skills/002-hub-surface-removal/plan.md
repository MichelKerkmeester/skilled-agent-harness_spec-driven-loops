---
title: "Implementation Plan: Phase 2: hub-surface-removal"
description: "Ordered removal of the two example surfaces from the sk-code hub: delete the folders, strip the two registries, regenerate every generated artifact, then strip the hand-owned documents and the tracked consumers, with a proof command per step."
trigger_phrases:
  - "hub surface removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: hub-surface-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registries, Markdown documents, Node.js CJS scripts and tests, Python generators |
| **Framework** | The sk-code hub's two-axis router (`mode-registry.json`, `hub-router.json`, `ROUTER.md`) |
| **Storage** | None; git-tracked files only |
| **Testing** | `node --test` suites, `bash` test scripts, `verify-doc-claims.cjs`, `parent-skill-check.cjs`, `validate.sh --strict` |

### Overview
The removal follows the hub's own README procedure (`.skilled/skills/sk-code/README.md:117-129`), applied to both surfaces: delete the folders, strip the two registries, regenerate the artifacts that have generators, hand-edit the two files that do not, then remove the example-authored content and the tracked consumers. Every step ends with a command whose output proves it, so a writer can stop after any step and know the state. `tasks.md` is the execution contract: 108 single-change tasks, each with a file, a verified anchor, a literal edit, a proof command, an acceptance criterion, a rollback and a stop condition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Every file anchor verified on `42b41dd286` and re-checked at `583316d083`
- [x] Phase 001 landed with `RESULT: PASSED`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `verify-doc-claims.cjs` exits 0 with no output
- [ ] Hub test suites and the doctor invariants test pass
- [ ] `validate.sh --strict` prints `RESULT: PASSED` from the final state
- [ ] One commit with a prose body, pushed to `main` last, after the suites, the reviewer and the validator have passed; nothing staged outside the phase's files
- [ ] `git status --porcelain` is empty and `git rev-parse HEAD` equals `git rev-parse origin/main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven two-axis hub. `mode-registry.json` declares the packets; `hub-router.json` declares stage-one signals and tie-break order; `ROUTER.md` section 11 is the machine-readable stage-two projection; `leaf-manifest.json` and the skill-derived files are generated from those sources; the doctor and the hub's own scripts assert the invariants.

### Key Components
- **`mode-registry.json`**: the source of truth for which packets exist. `extensions.surface-axis.surfaces` (line 19), the `sk-code-webflow` mode object (lines 60-77) and the `sk-code-obsidian` mode object (lines 97-114) name the removed surfaces.
- **`hub-router.json`**: stage-one routing. `routerPolicy.tieBreak` (line 7), `routerSignals` (webflow at 31-35, obsidian at 41-46) and `vocabularyClasses` (`code-webflow-aliases` and `code-webflow-runtime` at 73-78, `code-obsidian-aliases` and `code-obsidian-runtime` at 88-94).
- **`ROUTER.md`**: hand-owned prose maps plus the section 11 `INTENT_SIGNALS` / `RESOURCE_MAP` projection. The file is 618 lines and carries 152 packet-name lines and 172 case-insensitive surface lines today. Section 11 starts at line 307, `INTENT_SIGNALS` at 326 and `RESOURCE_MAP` at 351.
- **Generators**: `generate-leaf-manifest.cjs`, `regenerate-skill-derived.cjs`, `test_readme_manifest.py --write`, `test_readme_verdict_parity.py --write`, `sync-skills-hermes.cjs`, `compiled-route-manifest.cjs refresh`.
- **Gates**: `verify-doc-claims.cjs`, `verify-router-sync.cjs`, `parent-skill-check.cjs`, `validate.sh --strict`.

### Data Flow
Registry and router edits flow outward: `mode-registry.json` and `hub-router.json` feed `leaf-manifest.json` and the derived metadata, which feed the README manifest and the Hermes copies; the hook re-mints the compiled-routing manifest at commit time. The hand-owned documents (`ROUTER.md`, `SKILL.md`, the shared references) must be edited in the same direction, because `verify-doc-claims.cjs` compares their claims against the registry and the disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a removal, not a bug fix, but it changes a shared routing contract, so the producer/consumer inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Producer: declares the three surfaces | update, one surface remains | `node -e` print of `modes[].workflowMode` and `extensions.surface-axis.surfaces` |
| `hub-router.json` | Producer: stage-one signals and tie order | update | `node -e` print of `tieBreak`, `routerSignals` keys, `vocabularyClasses` keys |
| `ROUTER.md` §11 | Producer: stage-two projection | update by hand | `rg -c` returns 0 and `verify-router-sync.test.cjs` passes |
| `leaf-manifest.json` | Generated consumer | regenerate | `rg -n` returns nothing |
| `SKILL.md`, `shared/*`, `sk-code-quality/*`, `sk-code-review/*`, `feature-catalog/*` | Consumer documents | update | `rg -n` returns only D6 kept records |
| `verify-doc-claims.cjs`, `verify-router-sync.cjs` | Consumer gates | unchanged code, new expectations | both suites pass |
| `parent-skill-check.cjs:1229` | Consumer: names the two example surfaces as sortable-after-native | update | doctor invariants test passes |
| `.skilled/bin` fixtures and tests | Consumer: compiled routing fixtures | update | `compiled-route-surface-hint.test.cjs` and `verify-router-sync.test.cjs` pass |
| sk-doc fixtures, references, baselines | Consumer: cross-skill test fixtures and redirects | update | the owning suite passes |
| `README.md:796,1418,1419,1481`, `.skilled/skills/README.txt:60` | Consumer: adopter-facing surface lines | update | `rg -n` returns nothing |
| `.skilled/skills/sk-code/README.md`, `shared/README.md`, `shared/references/*.md`, `shared/references/universal/*.md`, `sk-code-skilled/{README.md,SKILL.md}` | Consumer: hub documents that name the surfaces | update | `rg -n` returns nothing |
| `.hermes/skills/sk-code*/` | Generated consumer | regenerate | `.hermes/skills/sk-code-webflow/` no longer exists |

Required inventories:
- Same-class producers: `rg -n 'sk-code-webflow|sk-code-obsidian|WEBFLOW|OBSIDIAN' .skilled/skills/sk-code --glob '*.json' --glob '*.md'`, because the phase removes the bare surface tokens as well as the packet names.
- Consumers of changed symbols: `rg -n 'sk-code-webflow|sk-code-obsidian' . --glob '*.cjs' --glob '*.ts' --glob '*.py' --glob '*.sh' --glob '*.json' --glob '*.md' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**'`.
- Matrix axes: two surfaces x (registry, router, generated, hand-owned doc, example content, external consumer) — every cell is one task in `tasks.md`.
- Algorithm invariant: the hub's parent projection equals the union of the remaining surface maps plus the parent-owned universal/shared tier. Removing a surface removes its map; it must never leave an orphan key or a path that no longer resolves.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The step sequence below is the same order, with the proof command that closes each step and the task range that performs it.

| Step | Work | Files and anchors | Tasks | Proof command |
|------|------|-------------------|-------|---------------|
| 1 | Confirm the workspace | README "Before You Start" (`.skilled/skills/sk-code/README.md:110-115`) | T001-T002 | `git config --local --get skilled.trustRepoHooks` prints `true` |
| 2 | Record the three baselines | the Task Notation section of `tasks.md` | T003 | 158, 164 and 1322 |
| 3 | Delete both packets | `git rm -r .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` | T004 | `git ls-files` filtered for both folders prints `0`, and the base commit still holds `226` |
| 4 | Strip `mode-registry.json` | line 5 description, line 19 surfaces, objects at 60-77 and 97-114 | T005-T008 | `node -e` prints `sk-code-quality,sk-code-review,sk-code-skilled ["sk-code-skilled"]` |
| 5 | Strip `hub-router.json` | line 7; signals at 31-35 and 41-46; classes at 73-78 and 88-94 | T009-T013 | `node -e` names no removed surface in any of the three lists |
| 6 | Regenerate the leaf manifest | `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` | T014 | `rg -c` over the manifest prints `0` |
| 7 | Hand-edit `ROUTER.md` | §1 26, 30, 37, 39-42, 45; §2 94, 96, 100; §3 112, 115; §4 119-154 deleted; §5 155-199 deleted; §7 250; §8 260, 265, 271; §9 283, 290, 293; §10 300; §11 309, 331-346, 426-436, 449-492, 502-525, 554-560, 600-618 | T015-T026 | the step 7 block below prints `0` for the grep and `router-sync: 5/5 checks passed` for the sync guard |
| 8 | Strip the hub documents | `SKILL.md`; `shared/README.md`; `shared/references/{stack-detection,phase-detection,universal-debugging-checklist,universal-verification-checklist,performance-loading-checklist}.md`; `shared/references/universal/{code-style-guide,error-recovery,multi-agent-research,code-quality-standards}.md`; `description.json`; `README.md`; `sk-code-skilled/{README.md,SKILL.md}` | T027-T043 | each file's own grep reaches its expected count, and the kept tag row at `code-style-guide.md:151` survives |
| 9 | Remove the example content | the two surface-detection scenarios, three scenario directories, `mixed-marker-ambiguity.md`, three surviving scenarios, the playbook index, two live playbook files and the setup playbook | T044-T056 | the file list from `rg -l` shrinks to the D6 kept records |
| 10 | Strip the quality mode | three checklists, `SKILL.md`, `README.md`, `typo-flags.test.sh` | T057-T062 | `typo-flags.test.sh` passes and each file's grep prints `0` |
| 11 | Strip the feature catalog and the review mode | `feature-catalog.md`, the two-axis page, `sk-code-review/{SKILL.md,README.md,references/review-core.md}` | T063-T067 | each file's grep prints `0` |
| 12 | Update the hub tests and scripts | `compiled-route-surface-hint.test.cjs`, the canary fixture and its twin, `canary-router.cjs`, `router-replay-lib.cjs`, `verify-router-sync.cjs` and its test, `verify-doc-claims.test.cjs` | T068-T075 | both suites pass and both greps print `0` |
| 13 | Update the external consumers | the doctor check and its test, the sk-doc fixture, reference, recorded picks, verdict baseline, cite-drift redirects, playbook allowlist, markdown-link allowlist, root README and skill index | T076-T086 | each owning suite passes; each grep prints `0` |
| 14 | Regenerate and hand-edit the derived metadata | `regenerate-skill-derived.cjs --write`, then `domains`, `intent_signals`, `derived` and `causal_summary` | T087-T092 | the step 14 block below prints `0` |
| 15 | Refresh the Hermes copies and the README manifest | `sync-skills-hermes.cjs`, `test_readme_manifest.py --write` | T093-T094 | `.hermes/skills/sk-code-webflow/` is gone and the manifest test prints `manifest=reproducible` |
| 16 | Close the doc-claims gate | `verify-doc-claims.cjs` | T095 | `doc-claims: 4/4 checks passed` with no `FAIL` line |
| 17 | Run the phase gate | the hub's suites, the cross-skill suites and probe, the kept-record diff, the reviewer and `validate.sh --strict` | T096-T106 | every suite exits 0, the kept-record diff is empty, the reviewer marks each criterion, and the validator prints `RESULT: PASSED` |
| 18 | Run the closure greps | AC-007's two commands | T107 | `0` packet-name paths and `4` token lines |
| 19 | Commit and push last | stage the phase's files by name, commit with hooks installed, or refresh by hand with `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copy `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` over the `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` twin; then `git push HEAD:main` | T108 | `git status --porcelain` is empty, the twin `diff` is empty, `git rev-parse HEAD` equals `git rev-parse origin/main`, and the validator still prints `RESULT: PASSED` |

### Phases table proof commands

The two commands carrying a raw `|` sit here, in fenced blocks, so the table above cannot split a cell.

Step 7:

```bash
rg -ci 'webflow|obsidian' ROUTER.md
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | tail -1
```

Expected: `0`, then `router-sync: 5/5 checks passed`.

Step 14:

```bash
rg -ci 'webflow|obsidian' graph-metadata.json
```

Expected: `0`.

### Step 11b: the three baselines and the CI-generated retrieval data

Three counts measure this phase and they are not interchangeable. `tasks.md` records each command in a fenced block and T003 records each result.

| Baseline | Value | Scope |
|----------|-------|-------|
| Planner's filtered count | 93 tracked files | Packet names only; excludes `specs/`, every changelog and every benchmark report |
| Broad tracked grep | 1,303 paths (1,123 under `specs/`) at `6347717083`; 1,322 (1,142) at `583316d083`; 1,288 (1,108) with this packet excluded | Whole tracked tree, case-insensitive, with word-boundary surface tokens |
| T003's query | 158 at HEAD, 164 with `--hidden` | Packet names only, same exclusions as the first row, hidden directories included |

T003's query silently skips six tracked `.hermes` files because `rg` skips hidden directories: the six are `.hermes/skills/sk-code{,-quality,-review,-skilled,-webflow,-obsidian}/SKILL.md`. Adding `--hidden` and excluding `.git` gives 164, and that is the count T003 asserts.

`runtime/data/trigger-index.json` (200 matching path entries today) and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` are regenerated by `.github/workflows/trigger-index-rebuild.yml` after the push. No step here writes them, so the phase handoff grep excludes both paths and the handoff does not wait on that rebuild; phase 5 proves the zero count. The index keeps 69 retained `specs/sk-code/007-sk-code-obsidian-surface/` paths after the rebuild, because `specs` is a corpus root and that folder is a retained audit record, so phase 5's count is scoped to live routing sources rather than the whole index.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `compiled-route-surface-hint.test.cjs`, `verify-router-sync.test.cjs`, `verify-doc-claims.test.cjs`, `typo-flags.test.sh` | `node --test`, `bash` |
| Integration | `parent-skill-check-invariants.test.cjs`, `leaf-resource-contract.test.cjs`, the sk-doc README manifest and verdict parity tests | `node --test`, `python3` |
| Contract | `verify-doc-claims.cjs` over the hub, `verify-router-sync.cjs` over `ROUTER.md` | `node` |
| Manual | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json` still returns `sk-code` | advisor CLI |
| Phase gate | `validate.sh --strict` on this folder | `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-ignore-and-commit-guard` | Internal | Green | Without the root ignore rules and the commit guard, a later phase can stage a private copy |
| Provisioned, hook-trusted checkout | Internal | Green | Without the hook the compiled-routing manifest is not re-minted and the phase ships a stale one |
| `generate-leaf-manifest.cjs`, `regenerate-skill-derived.cjs`, `test_readme_manifest.py`, `test_readme_verdict_parity.py`, `sync-skills-hermes.cjs`, `compiled-route-manifest.cjs` | Internal | Green | A missing generator forces a hand edit, which REQ-003 forbids |
| `node`, `python3`, `bash` | External | Green | Any gate is unrunnable |
| `gh` | External | Not needed here | CI observation belongs to phase 5 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any gate that cannot be repaired in place — a hub suite failing for a reason outside the removal, a router projection that will not reconcile, or a discovered dependency on the removed packets that phase 3 does not cover.
- **Procedure**: the phase lands as one commit, so revert it whole and re-run the gate:
  - `git revert --no-edit <phase-commit-sha>`
  - `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict`
  - `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs`
  - `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` if the reverted commit had re-minted the manifest, then copy the refreshed manifest over its authored twin.
- **Before the commit exists**: restore any single file with `git checkout 42b41dd286 -- <path>`, and restore a deleted folder with `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian`.
- **What this phase does not create**: no ignored folders. `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` are phase 4's, and their rollback is `rm -rf` of those two paths. Deleting them is not part of this phase's rollback.
- **Data**: none. No migration, no persisted state, no private content.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-ignore-and-commit-guard ──► 002-hub-surface-removal ──► 003-advisor-vocabulary-cleanup
                                        │                              │
                                        └──────────────────────────────┴──► 004-private-local-skills ──► 005-leak-and-routing-verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-ignore-and-commit-guard | None | 002 |
| 002-hub-surface-removal | 001 | 003, 004 |
| 003-advisor-vocabulary-cleanup | 002 | 004 |
| 004-private-local-skills | 001, 003 | 005 |
| 005-leak-and-routing-verification | 004 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 3-5 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable, no data
- [ ] Feature flag configured — not applicable, no runtime flag
- [ ] Monitoring alerts set — not applicable; the gates are the monitoring
- [ ] Phase 001 landed and `RESULT: PASSED`
- [ ] Working tree clean before T004, so the phase diff is only this phase's work

### Rollback Procedure
1. Stop before committing: `git restore --staged --worktree .` and restore from `42b41dd286`.
2. After committing: `git revert --no-edit <phase-commit-sha>`.
3. Verify: `verify-doc-claims.cjs` exits 0 and `validate.sh --strict` prints `RESULT: PASSED`.
4. Notify: none; the removal has no user-facing runtime behaviour beyond routing vocabulary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
        ┌──────────────────┐
        │ Phase 001        │
        │ ignore + guard   │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ Registries       │  T005-T013
        │ mode-registry    │
        │ hub-router       │
        └────────┬─────────┘
                 │
     ┌───────────▼───────────┐
     │ Generated manifest    │  T014
     │ leaf-manifest.json    │
     └───────────┬───────────┘
                 │
     ┌───────────▼───────────┐        ┌────────────────────┐
     │ Hand-owned docs       │───────►│ Playbooks, quality,│
     │ ROUTER.md, SKILL.md   │        │ review, catalog    │
     │ shared references     │        │ T044-T067          │
     └───────────┬───────────┘        └─────────┬──────────┘
                 │                              │
     ┌───────────▼───────────┐        ┌─────────▼──────────┐
     │ Hub tests and scripts │───────►│ External consumers │
     │ T068-T075             │        │ T076-T086          │
     └───────────┬───────────┘        └─────────┬──────────┘
                 │                              │
     ┌───────────▼───────────┐        ┌─────────▼──────────┐
     │ Derived metadata      │───────►│ Hermes + manifests │
     │ T087-T092             │        │ T093-T094          │
     └───────────┬───────────┘        └─────────┬──────────┘
                 └──────────────┬───────────────┘
                       ┌────────▼────────┐
                       │ Gates, commit   │  T095-T108
                       └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registries (T005-T013) | Phase 001 landed | A registry with one surface and three packets | The leaf manifest, `ROUTER.md`, every document count |
| Leaf manifest (T014) | Registries | A manifest with one surface mode | `verify-router-sync.cjs` leg 3, the Hermes copies |
| Hand-owned documents (T015-T043) | Registries and the leaf manifest | Documents whose counts match the registry | The playbook edits, the doc-claims gate |
| Playbooks, quality, review, catalog (T044-T067) | Hand-owned documents | Scenarios and checklists that name one surface | `verify-router-sync.cjs` leg 4, the doc-claims gate |
| Hub tests and scripts (T068-T075) | Playbook and document edits | Suites whose fixtures match the one-surface hub | The phase gate |
| External consumers (T076-T086) | Hub tests and scripts | The doctor, sk-doc fixtures and allowlists that resolve | The phase gate |
| Derived metadata (T087-T092) | Registries | `graph-metadata.json` with no surface key | The doc-claims gate |
| Hermes and manifests (T093-T094) | Documents and metadata | Regenerated copies and manifests | T108's commit |
| Gates and commit (T095-T108) | Every earlier component | A pushed commit with empty status | Phase 003 |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Registries (T005-T013)** - 9 tasks, about 40 minutes - CRITICAL: every later proof reads the registry, and a half-edited registry breaks every hub command.
2. **`ROUTER.md` (T015-T026)** - 12 tasks, about 90 minutes - CRITICAL: the file carries 152 packet-name lines and the section 11 projection is what the sync guard parses.
3. **Playbook index (T053)** - 1 task, about 30 minutes - CRITICAL: 23 edits in one file, and a missed row sends a reader to a deleted page.
4. **Hub tests (T068-T075)** - 8 tasks, about 60 minutes - CRITICAL: the suites are the phase's proof, and a fixture that still names a surface fails the gate.
5. **Commit and push (T108)** - 1 task, about 15 minutes - CRITICAL: it is the only step that writes the compiled-routing manifest pair.

**Total Critical Path**: about 4 hours of the 4-7 hour estimate.

**Parallel Opportunities**:
- None. Every task reads a file the previous task left, and the execution rules forbid reordering. The phase is a single writer's ordered sequence.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Registries and manifest reduced | AC-002, AC-003 and AC-004 hold; `verify-router-sync.cjs` leg 3 passes | After T014 |
| M2 | Documents stripped | AC-005 and AC-006 hold; every hub document's grep prints its expected count | After T043 |
| M3 | Example content removed | AC-007 holds for the playbook, quality, review and catalog trees | After T067 |
| M4 | Consumers and generated data aligned | AC-008 and AC-010 hold; the doc-claims gate prints `4/4` | After T095 |
| M5 | Release ready | AC-009, AC-011, AC-012, AC-013 and AC-014 hold; the commit is pushed and `git status --porcelain` is empty | After T108 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

The six decisions live in `decision-record.md` with their context, alternatives, consequences and rollback. This section is the index.

### ADR-001: Delete the two surface packets here; stand them up as private skills in phase 4

**Status**: Accepted

**Context**: Both packets ship to every adopter and feed the committed trigger index, but only the operator uses them.

**Decision**: Remove both packets with `git rm -r`, leaving the content reachable at `42b41dd286`, and let phase 4 rebuild them under ignored `local-*` paths.

**Consequences**:
- The public hub ships 226 fewer files and one surface.
- The worktree has no Webflow or Obsidian content until phase 4 runs; every task's rollback restores from the base commit.

**Alternatives Rejected**:
- Move the packets here: writes private bytes before the advisor's scan changes land.
- Keep and hide them: they still ship and still widen routing vocabulary.

### ADR-002: Hand-edit the two files no generator owns

**Status**: Accepted

**Context**: `ROUTER.md` and `graph-metadata.json`'s `causal_summary` have no generator; every other artifact does.

**Decision**: Edit those two by hand, run the generator for everything else.

**Consequences**:
- Generated files cannot drift from their source.
- Two files carry hand edits; the sync guard and the doc-claims gate prove them.

**Alternatives Rejected**:
- Write a generator for `ROUTER.md` section 11: new scope with its own tests.
- Hand-edit every artifact: the next regeneration reintroduces the surfaces.

### ADR-003: The Motion.dev scenario families leave with the overlay

**Status**: Accepted

**Context**: Fourteen playbook scenarios expect only overlay paths under the removed Webflow packet.

**Decision**: Delete the three directories and prune their index sections.

**Consequences**:
- Every surviving scenario passes the router guard.
- Motion.dev coverage moves to the private skill in phase 4.

**Alternatives Rejected**:
- Rewrite them against SKILLED references: invents expectations the router does not emit.
- Keep and exempt them from the guard: weakens the guard.

### ADR-004: Keep the comment-hygiene tag vocabulary and the dated records

**Status**: Accepted

**Context**: Four token lines are tag vocabulary, and the changelogs and benchmark reports record past releases.

**Decision**: Keep all four lines and every dated record byte-identical, and state both in the closure proof.

**Consequences**:
- The comment-hygiene gate keeps accepting a durable platform tag.
- The phase-wide grep never reaches zero; its expected count is four.

**Alternatives Rejected**:
- Rename the tag: changes a hook contract and every existing comment.
- Delete the tag lines: breaks the allowlist and the two documents that explain it.

### ADR-005: The closure boundary is the two greps, not every mixed-case word

**Status**: Accepted

**Context**: Three families match neither closure pattern: two benchmark fixture notes, the retired-name detector regex, and one quality-playbook sentence.

**Decision**: Leave them unchanged and record the boundary in the closure statement.

**Consequences**:
- The closure stays exactly checkable.
- A case-insensitive grep still finds three mentions, and the closure statement names them.

**Alternatives Rejected**:
- Rewrite the benchmark notes: falsifies a recorded measurement.
- Delete the detector: removes the check that finds the retired names.

### ADR-006: Generated data comes from its generator, and the retrieval index waits for CI

**Status**: Accepted

**Context**: Five artifacts have an in-repository generator; four retrieval artifacts are rebuilt by CI after the push.

**Decision**: Run every in-repository generator, never hand-edit its output, and leave the four retrieval artifacts to CI.

**Consequences**:
- Regenerated files are reproducible.
- The committed index keeps surface hits until CI runs; the handoff grep excludes it and phase 5 proves the count.

**Alternatives Rejected**:
- Rebuild the index here: duplicates a CI step and phase 5's proof.
- Hand-edit the manifests: the next regeneration reintroduces the surfaces.

---
