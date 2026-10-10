---
title: "Feature Specification: Phase 5: router-sync-guard"
description: "Four checks on the sk-code router lost their guard when the router-sync suite was deleted, and a verbatim port of that suite would pass three of them without checking anything. This phase restores the checks as a standalone CommonJS guard, wires the legs that pass on the current tree into the drift-guard umbrella and updates the retirement notes to name it."
trigger_phrases:
  - "router sync guard"
  - "phase 5 router sync guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: router-sync-guard

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
| **Branch** | `scaffold/005-router-sync-guard` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-hook-stdin-deadline |
| **Successor** | None |
| **Handoff Criteria** | Goal criteria 1 to 6 in `goal.md` pass, `validate.sh --strict` prints `RESULT: PASSED`, and the operator has chosen how leg 1b is handled before the umbrella wiring lands (parent decision D3) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Follow-up fixes for the sk-code Ponytail refinement specification.

**Scope Boundary**: Restore the four checks of the deleted router-sync suite as one standalone guard, wire the legs that pass today into the drift-guard umbrella, and update the retirement notes. Routing drift the guard reports is recorded, not fixed.

**Dependencies**:
- `004-hook-stdin-deadline` is the predecessor in the parent handoff table.
- The retired sources, read-only, at commit `b45ea54cea3^`: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` and `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`. Copies are saved in `scratch/source/`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`, read by the guard for `qualifiedIdToLeaf`.

**Deliverables**:
- `assets/scripts/verify_router_sync.cjs` (guard) and `assets/scripts/router_replay_lib.cjs` (replay functions it needs)
- Third guard in `scripts/run-all-drift-guards.sh`, gated as described in Open Questions
- Retirement notes in the five files the last phase wrote, updated to name the restored guard and the one gap that remains
- Regenerated `leaf-manifest.json` and Hermes copy of `sk-code-opencode/SKILL.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `b45ea54cea3` deleted the sk-code router-sync suite with the skill-benchmark lane. Its four checks cover router paths (they resolve, and every routable doc and prose path is routed), the surface map (it equals the union of the surface children plus the parent tier), agreement between compiled destinations, `leaf-manifest.json` and the code-opencode map, and playbook expectations (every `expected_resource` is emitted). Only partial coverage survives: `verify_alignment_drift.py --check-router` checks dead routes, and the CI workflow `routing-registry-drift.yml` covers the compiled side of checks 3 and 4 in warn-only mode. The retirement notes in five files say so. A verbatim port would look restored and still check nothing in three places: its orphan walk reads `references/` and `assets/` at the sk-code root, which no longer exist, so the walk finds zero docs; its route-gold path points at `specs/sk-doc/019-*`, but the gold now sits under `specs/sk-doc/z_archive/`, so the suite would return early; and its surface list still names `sk-code-mobile-cli`, which is gone, so that check throws.

### Purpose
A standalone guard runs the four checks against the live sk-code tree, names each drifted router entry, fails when any leg fails, and joins the drift-guard umbrella for the legs that pass on the current tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A standalone CommonJS guard with a sibling replay library and no test-runner dependency
- Checks 1 to 4 restored, with check 1 split into leg 1a (paths and prose maps) and leg 1b (orphan docs) so the passing leg can be wired without the failing one
- Seeded-defect controls that prove every leg can fail
- Umbrella wiring for legs 1a, 2, 3 and 4, held behind the operator's go (see Open Questions)
- Retirement notes and the sk-code-opencode router notes updated to name the restored guard and the remaining gap
- Regenerated `leaf-manifest.json` and Hermes SKILL copy

### Out of Scope
- Fixing the routing drift leg 1b reports (nine docs with no router naming them): parent 007 scope assigns fixes to the operator
- Editing any routing doc, playbook scenario or router map so that the guard passes
- Re-creating the vitest suite or adding any test-runner dependency
- Checking the one scenario in the root `manual-testing-playbook/` folder: the retired check never walked that folder either, so the port keeps that scope
- Committing, pushing or merging the change; the operator does that after review

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` | Create | The guard: legs 1a, 1b, 2, 3, 4; `--checks` flag; PASS/FAIL output; exit status |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs` | Create | Replay functions from the recovered `router-replay.cjs` with the CLI block removed; exports the four functions the guard uses |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | Header comment, third `run_guard` line (gated), retired-guard note replaced, final count |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modify | Guard count, run-all row, expected output, retirement paragraph |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Router comment block (lines 55 to 61), SMART ROUTING drift bullet (line 175), verifier assets line (line 187) |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modify | Retired-suite section, coverage table, entry-point and doc-pointer lines |
| `.skilled/skills/sk-code/benchmark/README.md` | Modify | Successor paragraph (line 16) names the restored guard |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | Modify | Code-file count and structure rows for the two new files. Not named in the brief; see Open Questions |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Modify (generated) | Regenerated by `sync-skills-hermes.cjs` after the SKILL.md edit |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify (generated) | Regenerated by `generate-leaf-manifest.cjs --write`; gains the two new files as leaves |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/implementation-summary.md` | Modify at close | The scaffold is replaced with the build record after the checks pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard and its library are CommonJS files with no test-runner dependency, and the library exports exactly four functions | `node --check` on both files exits 0 with no output; `grep -n vitest` on both files prints nothing and exits 1; the export keys are `loadSurfaceRouter,parseRouter,registryPacketRoots,routeSkillResources` |
| REQ-002 | The guard runs legs 1a, 1b, 2, 3 and 4, prints one PASS or FAIL line per leg and a summary line, and exits 0 only when every selected leg passes | `node <guard> --checks 1a,2,3,4` prints four PASS lines and `router-sync: 4/4 checks passed` and exits 0; `node <guard>` prints `FAIL check 1b` and exits 1; an unknown leg id exits 2 |
| REQ-003 | Every leg fails on a defect seeded into a copy of the tree, so no leg passes by skipping its input | `scratch/prototype/negative-controls.sh` prints `negative controls: 6/6 behaved as expected` and exits 0 |
| REQ-004 | The umbrella runs the guard for legs 1a, 2, 3 and 4 and reports zero errors | Umbrella output shows `PASS: router-sync`, `Errors: 0`, `run-all-drift-guards: all 3 guards PASSED` and exit 0. Blocked until the operator's go (parent decision D3) |
| REQ-005 | Generated artifacts match their sources | `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` exits 0; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync` and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Retirement notes name the restored guard and the one remaining gap, leg 1b, with its owner | Each of the five named files, and the SKILL.md verifier line, mentions `verify_router_sync`; `grep -rn "have no guard\|no guard checks it now\|has no full replacement"` over those files prints nothing and exits 1 |
| REQ-007 | Touched READMEs stay valid and the folder README counts the new files | `validate_document.py` prints `VALID` and `Total issues: 0` for the three READMEs; `assets/scripts/README.md` shows `Code files | 6` |
| REQ-008 | New code carries durable comments only, with no lane, decision or spec labels | `grep -n "Mode A\|D1\|D2\|Lane C\|benchmark\|PROTOTYPE\|post-relocation" <guard> <library>` prints nothing and exits 1 |
| REQ-009 | The manifest changes only by the two new leaves and its own digest and count lines | `diff` of `scratch/before/leaf-manifest.json` against the regenerated file shows only added lines for `assets/scripts/router_replay_lib.cjs`, `assets/scripts/verify_router_sync.cjs` and the digest and count fields |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four retired checks run again on the live tree. Legs 1a, 2, 3 and 4 pass, and leg 1b names its nine docs as a gap with an owner.
- **SC-002**: Each leg is shown to fail on a seeded defect, so a leg cannot pass by finding nothing to check.
- **SC-003**: The drift-guard umbrella runs the passing legs with zero errors, once the operator has given the go.
- **SC-004**: No retirement note in the touched files still calls checks 2 to 4 unguarded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A verbatim port passes three legs without checking anything: the orphan walk root is gone, the route-gold path is stale, and the surface list names a removed surface | High | Restored walk over the live packet folders; route-gold read from its `z_archive` path, and a missing gold fails; surface list reduced to the two live surfaces; seeded controls prove each leg |
| Risk | Leg 1b fails on the current tree. Nine docs have no router naming them: `shared/references/workflow-debug.md`, `workflow-implement.md`, `workflow-verify.md` and six `sk-code-obsidian/references/*` docs | High | Not fixed in this phase. Operator picks option A or B (see Open Questions) |
| Dependency | Parent 007 goal decision D3: stop and report before wiring the guard into the umbrella when it fails on the current tree | High | Umbrella tasks are marked blocked and wait for the operator's go |
| Dependency | Route-gold at `specs/sk-doc/z_archive/019-*/001-sk-code/compiled/route-gold.typed.json` | Medium | Leg 3 fails loudly if the archived file moves; the archive is historical evidence |
| Risk | New files are untracked, and the alignment-drift scan reads git-tracked files only, so header and style checks cannot see them until they are staged | Medium | The build records this; the umbrella's first guard does not vouch for the new files |
| Risk | Regenerating the manifest adds two leaves to the sk-code-opencode mode (69 to 71) | Low | REQ-009 diff; CI's manifest freshness step reads the committed file, so the regenerated file must be committed with the change |
| Risk | Editing `sk-code-opencode/SKILL.md` changes the sk-code hub's policy hash, so CI's `compiled-route-guard.cjs` (the authoritative freshness blocker) can report sk-code stale until its compiled routing is re-minted. The pre-commit gate re-mints when the inputs are staged together | Medium | Task T027 runs the guard after the edits and refreshes sk-code if it reports stale; the refreshed manifests go in the same commit as the SKILL.md change |
| Dependency | `leaf-resource-contract.cjs` supplies `qualifiedIdToLeaf` | Low | Read-only dependency; the path arithmetic is checked in plan.md |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Leg 1b handling (operator decision before any umbrella wiring).** Option A, recommended: leg 1b keeps failing and stays out of the umbrella; a later phase routes or retires the nine docs, then adds `1b` to the umbrella. Option B: the guard prints leg 1b as `WARN check 1b` through a `--warn 1b` flag that keeps it out of the exit status, and the umbrella runs `--checks 1a,1b,2,3,4 --warn 1b`. B changes the PASS/FAIL output contract for that leg and keeps nine unresolved docs visible in every gate run.
- **Parent scope row.** The parent 007 spec lists `.skilled/skills/sk-code/sk-code-opencode/scripts/` as the only location for this phase. The guard and library live in `assets/scripts/`, as the brief sets. An amendment to the parent row is proposed, not made here.
- **One addition beyond the brief's list.** `assets/scripts/README.md` counts code files and lists each one, so two new files make it stale. It is included. Remove its row from Files to Change if the operator does not want it touched.
<!-- /ANCHOR:questions -->

