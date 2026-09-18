---
title: "Feature Specification: Phase 13: clear-pre-existing-ci-and-doc-debt"
description: "Turn the two CI workflows that were red before the migration green, add a check that catches a stale Hermes skill or prompt copy, and remove the retired skill-benchmark lane's live documents and broken scripts."
trigger_phrases:
  - "pre-existing ci debt"
  - "routing ratchet deep-review wave"
  - "playbook operator contract violations"
  - "hermes mirror ci guard"
  - "retired skill-benchmark removal"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: clear-pre-existing-ci-and-doc-debt

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-18 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-fix-deep-review-p1-p2-findings-for-source-root-migration |
| **Successor** | None |
| **Handoff Criteria** | Routing Registry Drift Guard, Playbook Operator Contract and the new Hermes mirror job pass on the pushed tip, and the whole local gate shows no new failure against the phase 012 baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the skilled source-root migration specification.

**Scope Boundary**: The four follow-ups phase 012 recorded as known limitations, which the operator took on 2026-09-18: the two CI workflows that were red before the migration, the missing Hermes mirror check, and the retired skill-benchmark lane that live documents still described. Nothing else.

**Dependencies**:
- Phase 012 closed at `d10ec9d549`, the baseline for every regression claim here.
- The operator chose to remove the retired lane's material outright and to delete its storage guide and serving-snapshot schema rather than archive them.

**Deliverables**:
- The advisor scorer ratchet passes again, with no prompt routed differently from before the cleanup that broke it.
- sk-design's router version agrees with its release authority.
- The eleven playbook contract violations are gone.
- A CI job compares every Hermes skill and prompt copy with its source.
- The retired skill-benchmark lane's documents, scripts and scenarios are removed, and no live document tells a reader how to run it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two CI workflows have failed on every push for days, so a new failure in either one looks like the old one and nobody reads it. Routing Registry Drift Guard fails because a cleanup of the deep-loop hub dropped six dead keywords that still carried weight, and because sk-design's router states the wrong version. Playbook Operator Contract fails on eleven violations in five scenario files. Separately, nothing checks the Hermes copies of skills and prompts, and about thirty live files still explain how to run a skill-benchmark lane that was retired a week ago.

### Purpose
Every push shows green on these workflows unless something new broke, the Hermes copies cannot drift unnoticed, and a reader finds no instructions for a lane that no longer exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Routing ratchet**: find the prompts that route differently from before the cleanup and restore them with vocabulary that describes the hub today.
- **Hub records**: sk-design's `ROUTER.md` version, and the cli-external-orchestration summary of the Hermes roster, which phase 012 left as a residue.
- **Playbook contract**: the eleven violations the fail-closed gate reports.
- **Hermes mirrors**: a CI job that runs both sync scripts in check mode on every push and pull request.
- **Retired skill-benchmark lane**: its authoring assets, storage guide, serving-snapshot schema, two scripts that import the retired lane, the scenarios that exercised them, its hub alias, and every live paragraph that tells a reader how to run it.
- **Description residue** (operator-approved 2026-09-18): live skill docs, holdout scenarios, benchmark READMEs, playbook roots, feature catalogs and code comments that still describe the retired lane as present, and one validator CLI that still required a module the lane's retirement deleted.

### Out of Scope
- The `'skill-benchmark'` mode id in ledger schemas, reducers and sealed-artifact types - persisted records carry it, so the id is a data contract, not documentation.
- The write-set conflict census, `.skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:14` and `shipped-census.ts:107`. The operator approved removing its retired workstream on the premise that it lists shipped modes. It does not: its seven workstreams mirror the child folders of one spec program, `036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/`, which still holds `007-skill-benchmark`, and it already omits the shipped `008-deep-alignment`. No code outside its own tests calls it. The corrected facts go back to the operator before anything changes.
- `legacy-projection-manifest.ts` - it records how the historical writer laid out files.
- Changelogs, generated retrieval fixtures, `trigger-index.json` and the grader cache - frozen or generated records.
- The eleven stale entries in each direction of the frozen durable-directory manifest, which predate this work, and `create-journey-proof.test.cjs`, whose version-mismatch failure predates it too.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Name what a deep-review wave produces: iteration files and iteration history |
| `.skilled/skills/sk-design/ROUTER.md` | Modify | Version `2.0.0.0`, matching the hub's release authority |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Modify | The summary names a seven-model Hermes roster |
| Five playbook scenario files (cli-devin, sk-communication, sk-create-manual-testing-playbook, sk-git, system-deep-loop) | Modify | Remove the dated run, add the missing section and blockers, name the refusal by its gate tag, give the containment scenario its operator contract |
| `.github/workflows/command-tree-parity.yml`, `.github/workflows/README.md` | Modify | New `hermes-mirror` job and its README row |
| `.skilled/skills/sk-doc/sk-create-benchmark/**` | Delete/Modify | Remove the skill-benchmark family, its assets, references, scripts and scenarios. Renumber the remaining sections |
| sk-doc hub `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` | Modify | Drop the lane's alias and leaves |
| Eleven `benchmark/README.md` files | Modify | Drop re-run sections and links to removed guides. State that the lane is retired |
| Two compiled-routing parity scenarios, one chart scenario, and the sk-code, sk-create-skill and sk-create-manual-testing-playbook references | Delete/Modify | Remove what only the lane could run. Record results by hand |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | New skills no longer get the retired run command |
| Hermes copies and compiled route manifests | Regenerate | Their generators, run by the commit gates |
| `.skilled/commands/deep/assets/compiled/deep-{research,review,ai-council}.contract.md` | Regenerate | `compile-command-contracts.cjs --write` records the hub's new `SKILL.md` digest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No change blocks a commit or push that passes today, and the whole local gate shows no new failure against the `d10ec9d549` baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The scorer ratchet passes at its recorded bucket counts, and every labeled and ambiguity prompt routes to the skill it reached before the cleanup, without restoring keywords for families the tree no longer has. |
| REQ-003 | sk-design's `ROUTER.md` carries the version its `SKILL.md` release authority states. |
| REQ-004 | `validate-playbook-package.cjs --strict` exits 0 across the playbook fleet. |
| REQ-005 | A CI job on every push and pull request fails when any Hermes skill or prompt copy differs from what its sync script would write. |
| REQ-006 | No live document, route or script offers the retired skill-benchmark lane, and nothing left imports a module the retirement removed. The persisted mode id stays. |
| REQ-007 | Routing Registry Drift Guard, Playbook Operator Contract and the Hermes mirror job pass on the pushed tip. |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-008 | The cli-external-orchestration hub summary states the roster size the Hermes code enforces. |
| REQ-009 | No live skill doc, scenario, README, catalog or code comment describes the retired lane as present, and every prompt still routes as before. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A push shows every workflow green, so the next red one names a new failure.
- **SC-002**: All 289 advisor prompts in the per-row dump route as they did before this phase.
- **SC-003**: `rg` finds no live instruction for running the skill-benchmark lane outside frozen records and the persisted-data contract.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New hub keywords move other prompts | High | Compare a per-row routing dump of all 289 prompts before and after. Any moved row blocks the change |
| Risk | Deleting a script another file still requires | Med | `rg` for every deleted path before deleting, and run the node gate after |
| Risk | Bulk README edits rewrite a lane that is still live | Med | Review each README diff by hand and restore any live lane's text |
| Dependency | Command Tree Parity already installs the spec-kit package the sync scripts need | Low | The job reuses that install step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Hermes mirror job adds one job to a workflow that already runs, not a new workflow.

### Security
- **NFR-S01**: No private home-derived path enters a tracked file.
- **NFR-S02**: No gate bypass variable is used to land any change.

### Reliability
- **NFR-R01**: No advisor prompt changes route.
- **NFR-R02**: Every hub passes its structural check after the lane's alias leaves the sk-doc hub.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A benchmark README whose lane is live, such as deep-improvement's: it keeps its run section.
- A README that already recorded the retirement accurately: its note stays as written.

### Error Scenarios
- A sync script finds a stale copy in CI: the job exits 1 and names the copy.
- A scenario that can only run with the retired lane: it is deleted, not left to report SKIP forever.

### State Transitions
- The main checkout has moved past the phase 012 tip: the phase commits are rebased onto it before the fast-forward.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 67 files, most of them documentation |
| Risk | 12/25 | Advisor routing and a hub registry are shared contracts |
| Research | 8/20 | Root-causing the routing regression took a per-row dump |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the write-set conflict census drop the retired workstream, given that it models a spec program's folders rather than the shipped modes? Put back to the operator with the corrected facts.
<!-- /ANCHOR:questions -->

---
