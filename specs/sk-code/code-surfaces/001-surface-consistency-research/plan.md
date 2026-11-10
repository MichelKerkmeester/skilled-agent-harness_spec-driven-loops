---
title: "Implementation Plan: sk-code surface consistency"
description: "Fifteen ordered, check-guarded steps: bring sk-code-skilled, sk-code-obsidian and sk-code-webflow onto one surface setup, derive the surface list from the registry, make /doctor:sk-code enforce the layout and add a hub scaffold for new surfaces."
trigger_phrases:
  - "surface consistency research plan"
  - "sk-code surface remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code surface consistency

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, JSON routing manifests, a Python routing block inside each `SKILL.md` |
| **Framework** | sk-code parent hub: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, compiled route |
| **Storage** | None |
| **Testing** | Drift guards, `verify-router-sync.cjs` and its tests, `parent-skill-check.cjs` and its invariant tests, setup check, compiled-route guard and surface-hint tests, advisor plugin vitest, Hermes mirror check, trigger-index check |

### Overview
Round 1 found the three surfaces already share their frontmatter, opening sections and routing keys. Steps 1-7 fix what differs: wording first, then a section reorder, then the file moves. Round 2 adds steps 8-15: the router-sync guard and replay model learn every registered surface, `parent-skill-check.cjs` gains five surface checks that `/doctor:sk-code` reports, and the hub gets a scaffold for new surfaces. Each step lands as one commit with its own check, and routing files and manifests change in the same commit as the files they name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2, §3)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified (`spec.md` §6)
- [x] Operator confirmed the obsidian grouping in §3 and the plan as written (2026-10-19)

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] Step-1 checks rerun with no regression
- [ ] `validate.sh --strict` gives `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One packet contract for every surface (`research_archive/20261019T081751Z/research.md` §7). Shared: frontmatter, section order, workflow-link wording, `assets/checklists/`, README section list, version-to-changelog match. Surface-specific: topic folder names and depth, reference content, extra `SKILL.md` sections, and whether `shared/`, `scripts/` or `benchmark/` exist.

### Key Components
- **Surface `SKILL.md` §2b block**: the routing source for each surface. Every moved path changes here first.
- **Hub `SKILL.md` RESOURCE_MAP**: the union of the surface maps; `verify-router-sync.cjs` checks the equality.
- **`ROUTER.md` and `leaf-manifest.json`**: packet-qualified resource paths; the manifest is regenerated, not hand-edited.
- **Compiled route**: refreshed after the manifest, then copied to its authored path.
- **Surface inventory**: `mode-registry.json` modes with `packetKind: surface`. After step 8 the router-sync guard reads it, as `verify-doc-claims.cjs:331` already does. Tie-break order, route signals and vocabulary in `hub-router.json` stay hand-written, because they are behavior, not inventory.
- **Doctor surface checks** (step 11-12, in `parent-skill-check.cjs`, called from `checkModes(ctx)` for each surface, hard `fail()`):

| Check id | Function | Fails when |
|---|---|---|
| `3g-layout` | `checkSurfaceSectionOrder` | `SKILL.md` sections are out of the shared order, or Assets is not last |
| `3g-workflow-trio` | `checkSurfaceWorkflowLinks` | A `references/workflow-*.md` is not a symlink into `../../shared/references/` |
| `3g-checklists-home` | `checkSurfaceAssetLayout` | `assets/checklists/` is missing, or Markdown sits directly in `assets/` |
| `3g-reference-depth` | `checkSurfaceReferenceDepth` | A file other than the three workflow links sits at the `references/` root |
| `13d-surface-version` | strict path in `checkPacketChangelogVersions` | A surface has no four-part version or no matching newest changelog entry |

- **Surface scaffold** (step 14): `.skilled/skills/sk-code/shared/assets/surface-scaffold/` with a template `SKILL.md` (surface frontmatter, shared section order, §2b block placeholders, Assets last), a README template, an example `references/<domain>/` tree with workflow-link instructions, `assets/checklists/`, `changelog/v0.1.0.0.md`, and `REGISTRATION.md`, the ordered list of every file a new surface touches with the check that proves each.

### sk-code-obsidian grouping (confirmed 2026-10-19)

| New folder | Files moved from `references/` root | Why together |
|---|---|---|
| `architecture/` | `obsidian-plugin-api.md`, `view-renderer-architecture.md`, `data-layer.md` | Plugin entry, view renderers and the data pipeline they read |
| `styling/` | `stylesheet-ownership.md`, `theme-variables.md`, `db-class-naming.md` | The one stylesheet, the host variables it reads and its class grammar |
| `interaction/` | `accessibility.md`, `mobile-and-touch.md` | Input, focus and touch behavior |
| `standards/` (exists) | `comment-grammar.md`, `folder-docs.md` | Joins `code-standards.md` and `platform-support.md` |
| `verification/` | `verification.md`, `screenshot-harness.md`, `skill-reference-integrity.md` | The gate commands and the two harnesses behind them |

The existing `operations/`, `quality/`, `release/` and `setup/` folders stay as they are. The three `workflow-*.md` links stay at the root.

### Data Flow
A move changes a path in the surface §2b block, then the hub union, `ROUTER.md`, playbook expectations and cross-links. The manifest and compiled route are regenerated from those, and the Hermes mirror and advisor index are rebuilt last.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The steps, with the check that guards each:

| Step | Change | Guarding check |
|---|---|---|
| 1 | Baseline the checks, record results in `scratch/baseline/` | `sk-code-setup-check.cjs`, `run-all-drift-guards.sh`, `verify-router-sync.cjs`, `parent-skill-check.cjs` |
| 2 | Wording: workflow-link lines and sibling-map comments in skilled and webflow; skilled §4 title to "Assets" | Setup check; `validate_document` on each changed `SKILL.md` |
| 3 | Reorder sk-code-obsidian: Rules and Integration points become §3c and §3d, Assets becomes the last section | Parent-skill check; drift guards; grep for anchors that named the old numbers |
| 4 | Move 7 obsidian and 2 webflow checklists into `assets/checklists/`, update every link in the same commit | Drift guards (mapped paths, orphans); router-sync guard; repo grep for the old paths |
| 5 | Group obsidian's 13 references per §3, update §2b, hub union, `ROUTER.md`, playbooks; regenerate the manifest and compiled route | Drift guards; router-sync guard; parent-skill check `10b-byte-drift`; compiled-route guard; repo grep for old paths |
| 6 | Re-sync `.hermes/skills`, rebuild the advisor index and the trigger index | `sync-skills-hermes.cjs` check; `advisor_rebuild` then a probe per surface; `generate-trigger-index.mjs --check` |
| 7 | Checkpoint after the layout work | Rerun step 1 and compare |
| 8 | Derive the surface list in `verify-router-sync.cjs` from the registry; run `legSurfaceMap` and `legBijection` over every surface; fail on a surface with no route signal or tie-break position | A fourth-surface fixture in the router-sync tests that fails before the change; drift guards |
| 9 | Confirm the step-2 union comments read "registered surface packets" in all three §2b blocks; load tiers stay only in the hub `ROUTER.md` | Router-sync leg 2; `verify-doc-claims.cjs`; drift guards |
| 10 | Add Obsidian's prefix and markers to `router-replay-lib.cjs`; add matched-prompt hint tests for SKILLED, OBSIDIAN and WEBFLOW plus an unmatched-hint control; add advisor workspace-marker cases for all three | `compiled-route-surface-hint.test.cjs`; advisor plugin vitest; drift guards |
| 11 | Add the four `3g-*` checks to `parent-skill-check.cjs` with invariant tests | Parent check passes on the migrated tree; each injected violation prints its own id |
| 12 | Add the strict `13d-surface-version` path; `2a` keeps covering surface graph metadata | Parent check with a missing-version fixture |
| 13 | Give the setup check's `parent-skill` judge a repair line per check id; update the doctor YAML leg text and `/doctor:sk-code` summary | `sk-code-setup-check.cjs` prints `STATUS=OK legs=8`; an injected violation prints its own repair |
| 14 | Add the surface scaffold and `REGISTRATION.md`; decide whether `SK_CODE_EXAMPLE_SURFACES` is derived or listed | A dry run copies the scaffold into a temp hub and runs the parent check and router sync on it |
| 15 | Final state | `/doctor:sk-code`, the step-1 commands compared with the baseline, the Hermes and trigger-index checks, packet `validate.sh --strict` |

Steps 11-13 must land after steps 4 and 5, or the new checks fail on today's tree. Step 8 can run any time after step 1.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Steps 1-7 add no tests: the existing guards already fail on a stale mapped path, an orphan reference or a hub-union mismatch, which is exactly the failure a move can cause. Steps 8-14 change guard and doctor code, so each gets a test that fails for its own reason first: the fourth-surface fixture (step 8), the per-surface hint cases (step 10), an injected-violation case per new check id (steps 11-12), and the scaffold dry run (step 14). Each move step also greps the repo for the old path outside `specs/` and recorded benchmark reports, and the answer must be empty before the commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and `sk-code-setup-check.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`
- `.skilled/bin/compiled-route-manifest.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` and `verify-doc-claims.cjs`
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`
- `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` and `.skilled/commands/doctor/sk-code.md`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each step is one commit on the worktree branch, so `git revert <sha>` undoes any one step. Steps 4 and 5 also regenerate the manifest and compiled route, so after reverting one of them, rerun step 6 to bring the mirror and indexes back in line.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Surface `SKILL.md` §2b blocks | Own each surface's routing | Update moved paths | Router-sync guard |
| Hub `SKILL.md`, `ROUTER.md`, `leaf-manifest.json`, compiled route | Hub routing | Update, regenerate | Parent-skill check, compiled-route guard |
| Surface and hub playbooks, READMEs, cross-surface references | Consumers of the paths | Update links | Drift guards, repo grep |
| `.hermes/skills/sk-code*` | Mirror | Regenerate | Hermes sync check |
| `verify-router-sync.cjs`, `router-replay-lib.cjs` | Guard and replay model | Read surfaces from the registry; add Obsidian | Router-sync tests, drift guards |
| `parent-skill-check.cjs`, `sk-code-setup-check.cjs`, doctor YAML and command | Doctor | Five new checks, repair lines | Invariant tests, setup check |
| `.opencode/plugins/system-skill-advisor.js` | Advisor surface hint | Unchanged; tests added | Advisor plugin vitest |
| Benchmark reports, retrieval fixtures that only record a run | Records | Unchanged | Listed as exclusions in the grep |

Required inventory before each move: `git grep -n -F '<old path>' -- . ':!specs'`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (step 1) | None | All steps |
| Docs only (steps 2, 3) | Setup | Moves |
| Moves (steps 4, 5) | Steps 2, 3; step 5 also needs the grouping confirmed | Mirrors |
| Mirrors and indexes (step 6) | Moves | Checkpoint |
| Checkpoint (step 7) | Step 6 | Doctor checks |
| Routing (steps 8-10) | Step 1 | Final state |
| Doctor checks (steps 11-13) | Steps 4, 5 and 7 | Final state |
| Scaffold (step 14) | Steps 11-13, so the dry run uses the new checks | Final state |
| Final state (step 15) | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Docs only | Low | 30 minutes |
| Moves | Med | 2-3 hours |
| Mirrors and verification | Low | 45 minutes |
| Routing guard and replay (8-10) | Med | 2 hours |
| Doctor checks (11-13) | Med | 2-3 hours |
| Scaffold (14) | Med | 1-2 hours |
| **Total** | | **About 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Step-1 baseline recorded
- [ ] Work stays on `worktrees/145-sk-code-surface-consistency-research` until the final check passes

### Rollback Procedure
1. `git revert` the step's commit on the worktree branch.
2. Rerun step 6 if the reverted step moved files.
3. Rerun the step-1 checks and compare with the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
