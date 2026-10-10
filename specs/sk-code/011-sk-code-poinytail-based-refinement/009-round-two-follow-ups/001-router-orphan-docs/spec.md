---
title: "Feature Specification: Phase 1: router-orphan-docs"
description: "Router check 1b ships opt-in because nine docs have no router naming them, so the drift-guard umbrella skips it and a new unrouted doc passes every gate. Three are shared workflow docs reached through surface symlinks and six are Obsidian references that no intent carries."
trigger_phrases:
  - "router orphan docs"
  - "phase 1 router orphan docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: router-orphan-docs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/001-router-orphan-docs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-quality-report-listing |
| **Handoff Criteria** | A bare `verify_router_sync.cjs` run and the drift-guard umbrella both run leg 1b and exit 0, and the new test passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Round two follow-ups specification.

**Scope Boundary**: Router check 1b of `verify_router_sync.cjs`, the Obsidian router entries it flags, and the docs that describe 1b as opt-in.

**Dependencies**:
- The surface-alignment phase T035 steps, reused for the conditional manifest re-mint
- The restored router-sync guard and its umbrella line from the earlier follow-up phase

**Deliverables**:
- Leg 1b runs by default and in the umbrella, and passes
- Six Obsidian references routed under existing intents
- A test for the check
- Playbook and docs text that matches the new behavior

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs --checks 1b` lists nine docs that no router names, so leg 1b is held back by an `OPT_IN_LEGS` set and the drift-guard umbrella runs `--checks 1a,2,3,4` without it. A new doc that no router names therefore passes every gate. Two causes sit behind the nine. Three are the canonical `shared/references/workflow-*.md` docs, which each surface reaches through a symlink that no router lists. Six are `sk-code-obsidian` references that no intent in `SKILL.md` section 2b carries, and the Obsidian playbook records that as drift.

### Purpose
Leg 1b runs by default and in the umbrella and passes, because the six references are routed, the three shared docs are allowlisted by exact path with the reason beside the list, and a test proves the check still fails on an unrouted doc.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the three `shared/references/workflow-*.md` paths to `NON_ROUTED_ALLOWLIST`, with a comment that names the symlinks, and delete `OPT_IN_LEGS` and the filter that used it
- Wire the six Obsidian references into the existing `STACK_STANDARDS`, `VERIFICATION` and `CODE_QUALITY` intents, with seven title-derived keywords and no new intent
- Pass leg 1b from `run-all-drift-guards.sh`
- Add `verify_router_sync.test.cjs` with a symlinked-doc case, an unrouted-doc case and a default-run case
- Rewrite the Obsidian playbook text that calls these docs unmapped, keeping OB-H06 keyword-blind
- Update every doc that calls leg 1b opt-in or not run
- Bump the OpenCode and Obsidian packet versions with a changelog entry each
- Re-mint the compiled sk-code manifest and the leaf manifest only if their freshness checks report stale

### Out of Scope
- Realpath matching in the check - no router names the canonical path or the symlinks, so it would find nothing (see plan.md section 3)
- Routing the three workflow docs through each surface `RESOURCE_MAP` - it changes what three surfaces load, so it is an operator decision
- The three dead entries already in `NON_ROUTED_ALLOWLIST` - recorded in the summary, not changed
- Other stale prose found while reading - recorded in the summary, not changed
- Regenerating the Hermes copies - the orchestrator runs the generator once after all builds
- Anything under `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` | Modify | Allowlist the three shared workflow docs by exact path with the reason beside the list, delete `OPT_IN_LEGS` and its filter |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` | Create | New `node:test` file with three cases, run against a throwaway hub (the `scripts/tests/` folder is new) |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | Pass `--checks 1a,1b,2,3,4`, rewrite the header line and the note under the router-sync call |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modify | Overview sentence, umbrella table row and one row for the new test |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Pointer comment, wrapper description, leg 1b sentence and version 1.1.0.0 to 1.1.1.0 |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modify | Table row, gap note and entry-point line that call leg 1b out of the umbrella |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.1.1.0.md` | Create | Changelog entry for OpenCode 1.1.1.0 |
| `.skilled/skills/sk-code/benchmark/README.md` | Modify | Successor note that says leg 1b is not wired |
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` | Modify | Section 2b: seven keywords, six `RESOURCE_MAP` entries, version 0.1.1.0 to 0.1.2.0 |
| `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.2.0.md` | Create | Changelog entry for Obsidian 0.1.2.0 |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Category rows, OB-019 and OB-H06 summary lines, holdout note and the honesty paragraph |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md` | Modify | OB-H06 scenario: expected intent, overview, contract, commands and anchors |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` | Modify | OB-019 scenario: three sentences that call `accessibility.md` unwired |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify only if stale | Compiled sk-code manifest, re-minted only if `compiled-route-guard.cjs` stops listing sk-code as fresh |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify only if stale | Authored copy of the same manifest, copied over only after a re-mint |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify only if stale | Leaf manifest, regenerated only if the freshness check fails for sk-code (no change expected) |
| `.hermes/skills/sk-code-obsidian/SKILL.md` | Regenerate (orchestrator) | Output of `sync-skills-hermes.cjs`, run once after all builds. The builder runs only `--check` |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Regenerate (orchestrator) | Same generator, same rule |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/implementation-summary.md` | Modify | Filled from the evidence at the end of the build |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/scratch/` | Create | Baselines, red and green test output, the replay script and the reach probe |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A bare guard run includes leg 1b and passes | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` prints `PASS check 1b` and `router-sync: 5/5 checks passed` and exits 0 |
| REQ-002 | The umbrella runs leg 1b and passes | `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0, prints `PASS check 1b`, a `PASS: router-sync` line naming `--checks 1a,1b,2,3,4`, `Errors: 0` and `all 3 guards PASSED` |
| REQ-003 | The six Obsidian references are routed under existing intents | The `RESOURCE_MAP` block of `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` names all six paths, the intent count stays 5, `--checks 1b` passes and a probe prompt per doc reaches it |
| REQ-004 | The three shared workflow docs are allowlisted by exact path and any other unrouted `shared/` doc is still reported | `NON_ROUTED_ALLOWLIST` holds six exact paths and no folder entry, and the test case with a stray `shared/references/stray.md` sees `FAIL check 1b` |
| REQ-005 | The check has a test | `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` prints `pass 3` and `fail 0`, the same file prints `fail 3` against the unedited guard, and `run-node-tests.mjs --list` finds it |
| REQ-006 | Compiled routing, leaf manifest and rule copies stay green | `compiled-route-guard.cjs` lists sk-code `fresh`, the leaf freshness check prints `failed=0`, `check-rule-copies.js` exits 0 and `validate_skill_package.py` on the hub exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | No packet doc calls leg 1b opt-in or not run | The stale-wording search over `.skilled/skills/sk-code` prints nothing and exits 1 |
| REQ-008 | The Obsidian playbook tells the new truth and OB-H06 stays keyword-blind | The playbook validator prints `violations=0`, OB-H06 commands print `1` and `0`, and no Obsidian doc outside changelogs says `unmapped` |
| REQ-009 | Versions and changelogs follow the skill contract | Both `SKILL.md` files and both new changelogs carry the new version, `validate_document.py` prints `VALID` and `Total issues: 0` for each, and no hard blocker count rises |
| REQ-010 | Only the listed files change and the Hermes drift is the expected one | The scoped `git status --porcelain` differs from the saved copy by the thirteen planned lines, and `sync-skills-hermes.cjs --check` shows only two new drift lines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A bare guard run covers five legs, so a new unrouted doc fails the same gate that checks router paths
- **SC-002**: The check can still fail, shown by a test case and by a red run against the unedited guard
- **SC-003**: The six docs surface for prompts that use their own words, and no existing scenario loses a resource or changes intent
- **SC-004**: No packet doc says leg 1b is opt-in, not wired or not run
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new routes load more docs: `STACK_STANDARDS` gains 2, `VERIFICATION` gains 3 and `CODE_QUALITY` gains 1 | Med | The replay of all 27 Obsidian scenarios shows no intent change and no lost resource. Only the counts rise, for example OB-011 from 15 to 21 and OB-015 from 19 to 25 |
| Risk | The allowlist hides the three workflow docs if their symlinks vanish | Low | The paths are exact, the comment names the symlinks, and the test keeps every other `shared/` doc reported |
| Risk | The new keywords make a prompt select an intent it did not select before | Low | Keywords are phrases from the docs' own titles, the replay compares the intents column for all 27 scenarios, and `screen reader` is deliberately not added so OB-H06 stays keyword-blind |
| Risk | The test file is untracked until the orchestrator stages it, and the alignment lint scans only tracked files | Low | A lint task points the verifier at the folder with git discovery blocked, so the file is checked before it is tracked |
| Dependency | Sibling child 002 edits `sk-code-quality` and lists the same two manifests and the leaf manifest as conditional | Low | Each builder regenerates only after its own last edit, the sk-code policy hash reads only the hub files, and the scope check treats any sibling line as baseline |
| Dependency | Hermes copies of both skills drift until the orchestrator regenerates them | Low | The builder runs only `--check` and expects exactly two new `DRIFT` lines |
| Dependency | The earlier deep-research round writes under `001-ponytail-deep-research/research/` | Low | No task reads or writes there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None block the build. The brief proposed realpath matching for the three workflow docs and allowed the allowlist if reading the check showed that was wrong. It was wrong (plan.md section 3), so the allowlist is used with the reason beside it.
- Operator decision, not made here: route the three workflow docs through each surface `RESOURCE_MAP` and drop their allowlist entries. It would let leg 1b see them, but it changes what three surfaces load.
<!-- /ANCHOR:questions -->

---
