---
title: "Feature Specification: Phase 14: fix-pre-existing-defects-found-by-migration"
description: "Fix the pre-existing defects phases 12 and 13 recorded: the red scaffold proof, sk-doc tests nobody ran, a stale trigger index, tests that rewrite a tracked database, Codex hook drift, root-name hardcodes, and the deep-loop and sk-doc suites CI never ran."
trigger_phrases:
  - "pre-existing defects phase 14"
  - "scaffold version mismatch fix"
  - "council database test isolation"
  - "deep-loop runtime ci job"
  - "hook flags either root name"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: fix-pre-existing-defects-found-by-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-18 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-clear-pre-existing-ci-and-doc-debt |
| **Successor** | None |
| **Handoff Criteria** | Every defect below is fixed with a test that fails without the fix, the whole local gate is green, both new CI workflows pass in a clean clone, and CI is green on the pushed tip |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the skilled source-root migration specification.

**Scope Boundary**: The pre-existing defects phases 12 and 13 recorded and the operator chose to fix on 2026-09-18, plus the defects of the same kind found while fixing them. The compiled-serving admission tool the operator also chose is scoped separately, because its design needs an operator decision first.

**Dependencies**:
- Phase 13 closed with CI green on both branches.
- The operator approved rewriting `~/.codex/hooks.json` with a backup kept.

**Deliverables**:
- The node gate fully green for the first time in this packet.
- Every sk-doc script test passing, and run in CI.
- A trigger index that lists no deleted file.
- Test runs that leave the tracked council database untouched.
- Codex hooks that match their installer.
- Hook flags, search roots and plugin logs that work under either source-root name.
- CI jobs for the deep-loop runtime suites and the sk-doc script tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several checks failed or ran nowhere, and several callers still assumed the source tree is named `.skilled`. The node gate's one red test, the scaffold proof, failed because new hubs inherited a template's own version. Four sk-doc script tests failed unseen because no workflow ran them, and the deep-loop runtime suites, which caught a stale command contract in phase 13, ran only on a developer's machine. The deep-loop tests rewrote a tracked database on every run, the Codex hooks had drifted from their installer, and hook flags, search roots and plugin logs broke in a checkout that carries only `.opencode`.

### Purpose
Every check runs where it should and passes for a real reason, and the source-tree name is chosen by the sentinel file everywhere a caller can know it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Scaffold version**: new skills start at `1.0.0.0` in `SKILL.md`, as their router files do.
- **sk-doc script tests**: the frozen durable-directory manifest, the README verdict baseline, the hub-template directive anchor and four validator fixtures.
- **Trigger index**: regenerated, which first needed a README frontmatter phase 13 broke to be repaired.
- **Council database**: test runs write a scratch copy.
- **Codex hooks**: reinstalled from the main checkout, with a backup.
- **Root-name hardcodes**: the hook-flags imports and config lookups, the ripgrep search roots, and three plugins' log paths.
- **CI**: jobs for the deep-loop runtime suites and the sk-doc script tests.

### Out of Scope
- The compiled-serving admission tool - the operator chose to build one, but restoring the retired parity path would bring back about 4,000 lines of the lane phase 13 removed, and a gold-agreement checker would change the admission bar. That choice is the operator's, so the tool gets its own phase once it is made.
- The Pi extensions' hook-flags imports - Pi loads them from `.pi/extensions/`, where no relative path can know the source root's name.
- The other code that spells `.skilled` literally, about 180 files - many of them name both roots on purpose, and they were not audited one by one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | New skills start at their first version; the reports index drops the retired-harness claim and gains separators |
| `.skilled/skills/sk-doc/scripts/tests/**` | Modify | Manifest, verdict baseline, directive anchor, validator fixtures, a refresh mode and a runner script |
| `.skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md` | Modify | Paragraph moved out of the frontmatter |
| `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts`, its script helper and council script test | Modify | Database directory override and a guard |
| 22 spec-kit and advisor hooks, four session scripts, `hook-flags.sh`, `check-dist-staleness.sh` | Modify | Hook flags found under either root name |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` and its test | Modify | Search roots named as the checkout names them |
| Three OpenCode plugins and their tests | Modify/Create | Logs under the selected source root |
| `.github/workflows/{deep-loop-runtime,sk-doc-script-tests,sk-doc-rename-harness}.yml`, `.github/workflows/README.md` | Create/Modify | The new CI jobs |
| Trigger index and its three companion files | Regenerate | The generator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No change blocks a commit or push that passes today, and the node gate, the spec-kit projects CI runs, the deep-loop suites and the sk-doc script tests all pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | A scaffolded hub's `SKILL.md` carries the same version as its router files, and the scaffold proof passes. |
| REQ-003 | Every sk-doc script test passes. |
| REQ-004 | The trigger index lists no deleted file. |
| REQ-005 | A deep-loop test run leaves the tracked council database unchanged. |
| REQ-006 | `install-codex-hooks.mjs --check` reports no drift, and the prior hooks file is kept as a backup. |
| REQ-007 | Hook flags, search roots and plugin logs resolve under `.opencode` when that is the only source root. |
| REQ-008 | CI runs the deep-loop runtime suites and the sk-doc script tests, and both jobs pass in a clean clone. |
| REQ-009 | CI is green on the pushed tip. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The node gate reports zero failures.
- **SC-002**: Each fix has a test that fails against the code before it.
- **SC-003**: The two new workflows pass when run from a clean clone under Node 22.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting 22 hook imports breaks a hook silently, since each import sits in a fail-open block | High | Resolve every rewritten path from the location the hook runs from, and rebuild both runtimes |
| Risk | A new CI job fails for environment reasons and turns the branches red | Med | Run each job's exact steps in a clean clone under Node 22 before pushing |
| Risk | The manifest test on every push trips on unrelated new directories | Med | It names the changed directories and offers a one-command refresh |
| Dependency | `~/.codex/hooks.json` is home configuration | Med | Back it up first; the installer keeps the operator's other hooks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The every-push sk-doc job finishes in about a minute of test time; the ten-minute harness runs only when sk-doc's scripts change.

### Security
- **NFR-S01**: No private home-derived path enters a tracked file.
- **NFR-S02**: No gate bypass variable is used to land any change.

### Reliability
- **NFR-R01**: Every hook-flags lookup stays fail-open, as before.
- **NFR-R02**: With `DEEP_LOOP_COUNCIL_DB_DIR` unset, the council database stays where it was.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A project with no toolchain tree: the plugins log under its `.opencode` directory instead of creating a source root.
- A durable directory added on purpose: the manifest test names it and `--write` accepts it.

### Error Scenarios
- A hook-flags file missing: every hook keeps running, as before.
- `npm ci` under a newer npm rejects the spec-kit lockfile: CI pins Node 22, which the simulation used.

### State Transitions
- The main checkout's compiled hooks predate this change until its runtime is rebuilt; they still work, because the old paths name the tree that exists.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 60 files across hooks, plugins, tests, CI and docs |
| Risk | 15/25 | Global hooks and CI are shared contracts |
| Research | 10/20 | Each failure needed its cause found before its fix |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which compiled-serving admission path should the next phase build: the restored legacy-parity lane, a new checker against routing gold, or none? Phase 15 researched it, and its `research/research.md` recommends the checker; the choice stays the operator's.
<!-- /ANCHOR:questions -->

---
