---
title: "Feature Specification: Phase 6: sk-code-ci-surface"
description: "The repository runs 33 workflows and has no single written standard for them: only path parity is machine-enforced, the sk-code hub has no CI surface, and message-contract's every-branch push trigger reads as drift. This phase creates the read-only sk-code-ci surface packet with the rule data, the protected set, the intentional exception and the scaffold templates, registers it in the sk-code hub, and proves the registration through the hub's own gates."
trigger_phrases:
  - "sk code ci surface"
  - "phase 6 sk code ci surface"
  - "github actions workflow standards"
  - "ci workflow rule data"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: sk-code-ci-surface

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The 33 GitHub Actions workflows follow a set of rules that exist mostly in prose and reviewer memory: only `.skilled/` and `.opencode/` path parity is machine-enforced, while SHA pinning, README coverage, timeouts, least privilege, concurrency and the composite-action pattern are honour-system conventions. This phase turns those rules into a read-only `sk-code-ci` surface packet inside the sk-code hub, registers it in every hub artifact, and records message-contract's every-branch push trigger as an intentional exception so the later `/doctor:ci report` can tell a deliberate trigger from drift.

**Key Decisions**: a read-only surface packet rather than a workflow mode, because the packet supplies evidence and never writes; and the message-contract exception lives in rule data, because the workflow's YAML is correct as written.

**Critical Dependencies**: `002-rebuild-fanout-removal` supplies D1's chosen rebuild-skip form and `004-setup-caching-provisioning` supplies the landed composite action and action scan; `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` edits the same hub registration files and creates the one ordering risk this phase carries.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/214-ci-efficiency-phase-plans` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 004-setup-caching-provisioning (with 002-rebuild-fanout-removal) |
| **Successor** | 007-workflow-hygiene-on-off-control |
| **Handoff Criteria** | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exits 0 with the `3g`, `5k-canary` and `5l` legs passing; `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0; `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` passes; `git diff --exit-code -- .github/workflows/message-contract.yml` is empty; and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the CI efficiency implementation phases specification. It carries R22 and R23 of `001-research/research/synthesis-reviews/final-review.md` (`:430-457`), in the order the final review gives them: R22 creates the surface packet and its registration, then R23 adds message-contract's exception to R22's rule data.

**Scope Boundary**: One new read-only packet folder under `.skilled/skills/sk-code/`, the hub registration files that list it, the hub documents that count or describe surfaces, one guard's hard-coded surface lists, one canary case with its authored twin, one compiled-route test case, one playbook scenario, and one hub release. No workflow YAML changes, no skill runtime changes, no advisor vocabulary changes, and no `stack-detection.md` change: the fifth stack-detection value is R30 in `009-doctor-ci-review-wiring`.

**Dependencies**:
- `002-rebuild-fanout-removal`: its D1 answer decides whether the rebuild-skip rule records a `[skip ci]` token or the 8-entry push-only `paths-ignore` form. R22 records the chosen form; it does not choose it.
- `004-setup-caching-provisioning`: R12's action scan and R14's `.github/actions/setup/action.yml` must exist before the composite-action rule can cite a landed pattern rather than a proposal.
- `specs/sk-code/013-private-surface-skills/002-hub-surface-removal`: it removes `sk-code-webflow` and `sk-code-obsidian` from `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` and the canary fixture. Both phases edit the same files, so the ordering is named in §6 and handled by T003, T004, T020 to T052, T064 and T067.
- `gh` authenticated with `repo`, only for reading the ruleset that makes message-contract's context required; the phase itself makes no state-changing call.

The concurrency template's main-branch value is not a phase dependency. It records `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` as the recommended PR-only default until D2 is answered, and names `cancel-in-progress: true` on main as the alternative in one line.

**Deliverables**:
- `.skilled/skills/sk-code/sk-code-ci/`: `SKILL.md`, `README.md`, `changelog/v0.1.0.0.md`, four `references/` documents, two `assets/` templates and three workflow-doctrine symlinks.
- `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and `leaf-manifest.json` entries for `sk-code-ci`.
- `ROUTER.md` prose and machine maps, and the `verify-router-sync.cjs` surface lists that make the union leg read the new packet.
- `SKILL.md`, `README.md`, `shared/README.md`, `feature-catalog/` and `shared/references/phase-detection.md` surface wording and counts.
- One canary case plus its authored twin, one compiled-route test case and one playbook scenario.
- `scratch/`: the baseline, the ordering state, the source anchors and the phase result.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository's 33 workflows encode a large body of convention that no single artifact states. Path parity between `.skilled/` and `.opencode/` is enforced by `gate-inputs.yml`, but SHA pinning (33 of 33 today), a README row per workflow (33 of 33), `timeout-minutes` (7 lines across 6 workflows), least-privilege `permissions:` (21 of 33 files) and `concurrency:` (1 of 33) are honour-system rules (`research.md:214-226`). The sk-code hub has no CI surface at all, so a workflow-YAML diff is detected as `UNKNOWN` and sk-code-review cannot bundle CI evidence (`research.md:239`). Two rules are actively counter-intuitive: a rebuild commit re-runs 13 workflows on four generated paths that no job reads (`trigger-index-rebuild.yml:79`), and `message-contract.yml` deliberately pushes on every branch (`:2-9`, `.github/workflows/README.md:73`). Without a written standard, a reviewer cannot tell either from drift, and `/doctor:ci report` would flag the second one.

### Purpose
One read-only `sk-code-ci` surface packet records the rules, the protected set, the intentional exception and the scaffold templates, is registered in every hub artifact, and passes the hub's own parent-skill, router-sync, canary, compiled-route and playbook gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R22: create the read-only `sk-code-ci` surface packet under `.skilled/skills/sk-code/`, with the full registration list from `research.md:228-235`: registry entry, surface-axis membership, router tie-break and signals, two vocabulary classes, generated leaf manifest, `ROUTER.md` projections, `graph-metadata.json`, `description.json`, the hub `SKILL.md` table, the packet folder, a compiled-route test case, and a canary fixture with its authored twin.
- R22: the packet's rule data, covering the twin rule with the 8-entry form and inert `.opencode/` twins (`check-gate-inputs.sh:109-121`, `:336`, `:369-372`; `repo-rules-corpus.yml:9-11`), the rebuild-skip rule in D1's chosen form (`final-review.md:611-615`), push-only scope for generated-path rules (`trigger-index-rebuild.yml:6-9`), the timeout sizing rule (`final-review.md:458-472`), least privilege (`final-review.md:474-486`), the concurrency template, the composite-action rule (`final-review.md:326-361`), the switch `if:` shape (`research.md:150-157`), the protected set (`research.md:183-188`) and the scaffold templates.
- R23: record `message-contract.yml`'s every-branch push trigger as a documented exception in that rule data, with the rationale from `message-contract.yml:2-9` and `.github/workflows/README.md:73`. No YAML change.
- The hub release that carries the new packet: version `2.4.0.0` in `SKILL.md`, `mode-registry.json`, `hub-router.json` and `description.json`, plus `changelog/v2.4.0.0.md`.

### Out of Scope
- Applying R24, R25 or R26: `007-workflow-hygiene-on-off-control` adds timeouts, permissions and switches. This phase records the rules those tasks follow.
- R30's fifth stack-detection value in `shared/references/stack-detection.md:37` and `sk-code-review/SKILL.md:234`: `009-doctor-ci-review-wiring` owns it, because it is the one change that can regress detection for the existing surfaces.
- `/doctor:ci` and its `report`, `scaffold` and toggle routes: `009-doctor-ci-review-wiring` owns them. This phase supplies the templates and the protected set they read.
- Any edit to `.github/workflows/*.yml`, `.github/scripts/*`, `.github/actions/*` or `.github/workflows/README.md`. The only workflow file this phase reads is `message-contract.yml`, and its diff must stay empty.
- Rebuilding, removing or renaming an existing surface. `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` owns the removal of the two example surfaces; this phase only inserts `sk-code-ci` and preserves whatever entries are present.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.
- A new benchmark report: `benchmark/README.md` records that the Lane C harness is retired and no new run can start. The playbook scenario is the routing evidence this phase adds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md` | Create | Surface contract: when the hub bundles it, the reference map, the machine-readable `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP` |
| `.skilled/skills/sk-code/sk-code-ci/README.md` | Create | Human orientation: packet kind, tools, what it carries, what it refuses to do |
| `.skilled/skills/sk-code/sk-code-ci/changelog/v0.1.0.0.md` | Create | First packet release, matching the packet `SKILL.md` version |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Create | Rule index: path parity, SHA pins, README row, `set -euo pipefail`, fork and secret safety, matrix and `fail-fast` |
| `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` | Create | Twin rule with the 8-entry form, inert twins, rebuild-skip rule, push-only scope, message-contract exception |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Create | Timeout sizing, least privilege, concurrency template, composite action, switch `if:` shape |
| `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md` | Create | Protected-by-function workflows and the message-contract required-context rule |
| `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml` | Create | Scaffold template for a new workflow: name, triggers, `permissions:`, `concurrency:`, switch `if:`, job timeout, SHA-pinned steps, README row note |
| `.skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml` | Create | Scaffold template for a job: switch `if:`, timeout, permissions, provisioning call |
| `.skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` | Create (symlink) | Link to `../../shared/references/workflow-*.md`, the same way `sk-code-skilled/references/` does |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Add the `sk-code-ci` surface entry; append it to `extensions.surface-axis.surfaces`; bump `version` to `2.4.0.0` |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Insert `sk-code-ci` in `tieBreak` ahead of `sk-code-skilled`; add its `routerSignals` entry and two `vocabularyClasses`; bump `version` to `2.4.0.0` |
| `.skilled/skills/sk-code/description.json` | Modify | Add `sk-code-ci` to `keywords`; bump `version` to `2.4.0.0` |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify (generated) | Regenerated by `regenerate-skill-derived.cjs`; the hand-owned `causal_summary` names the new surface |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify (generated) | Regenerated by `generate-leaf-manifest.cjs`; gains the `sk-code-ci` mode and its leaves |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | A CI prose map row and the `CI_WORKFLOW` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` in §11 |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Surface table row, surface-list sentence, surface count and version `2.4.0.0` |
| `.skilled/skills/sk-code/README.md` | Modify | Surface table row, surface count sentences at `:23`, `:90` and `:106`, and the adaptation note |
| `.skilled/skills/sk-code/shared/README.md` | Modify | Packet list at `:17` and the surface wording in the overview |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modify | Surface count sentence at `:16` and the "when to use" bullet at `:28` |
| `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | Modify | Surface inventory at `:15` and `:35` |
| `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Modify | Surface axis paragraph at `:26` |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Add `sk-code-ci` to `SURFACES` (`:33`) and `SURFACE_PACKETS` (`:34`) |
| `.skilled/skills/sk-code/changelog/v2.4.0.0.md` | Create | Hub release note for the new surface |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | One `surface-bundle-ci` case with `expectedModes: ["sk-code-review", "sk-code-ci"]` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Authored twin, byte-identical to the live fixture |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modify | One test asserting the CI prompt resolves to `[sk-code-review, sk-code-ci]` |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md` | Create | Packet playbook index: the one scenario, the category list and the routing-replay note |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md` | Create | Playbook scenario with `expected_intent: CI_WORKFLOW` and its four packet-relative reference leaves |
| `.hermes/skills/sk-code-ci/SKILL.md` | Create (generated) | Hermes mirror produced by `sync-skills-hermes.cjs` |
| `scratch/` | Create | `phase-baseline.md`, `pattern-inputs.md`, `registration-before.json`, `registration-after.json`, `ordering-state.md`, `source-anchors.md`, `consumer-inventory.md`, `phase-result.md` and the six `*-before.txt` / `*-after.txt` gate logs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

Each requirement names the R-id it serves. R22 owns the packet and its registration; R23 owns the message-contract exception and depends on R22's rule data.

| ID | R-id | Requirement |
|----|------|-------------|
| REQ-001 | R22 | **Packet exists and is read-only.** `.skilled/skills/sk-code/sk-code-ci/` exists with `SKILL.md`, `README.md`, `changelog/v0.1.0.0.md`, four `references/*.md` documents, two `assets/*.yml` templates and the three `references/workflow-*.md` symlinks; the `SKILL.md` frontmatter declares `name: sk-code-ci`, `allowed-tools: [Read, Bash, Grep, Glob]`, `metadata.packetKind: surface` and a version that matches its newest changelog entry |
| REQ-002 | R22 | **The rule data is complete.** The four references and two templates carry all ten rule families the final review names, each with a `file:line` citation: the twin rule with the 8-entry form and inert `.opencode/` twins, the rebuild-skip rule in D1's chosen form, push-only scope for generated-path rules, the timeout sizing formula, least privilege, the concurrency template, the composite-action rule, the switch `if:` shape, the protected set and the scaffold templates. Numbers use the final review's corrected figures, including `standalone` and `after R1` where it gives both |
| REQ-003 | R22 | **The registration list is complete.** `research.md:228-235` names eleven artifacts; all eleven exist: the `mode-registry.json` entry and surface-axis membership, the `hub-router.json` tie-break slot, `routerSignals` entry and two vocabulary classes, the generated `leaf-manifest.json`, the `ROUTER.md` projections, `graph-metadata.json`, `description.json`, the hub `SKILL.md` table, the packet folder, a compiled-route test case and a canary fixture with its authored twin |
| REQ-004 | R22 | **The router union reaches the packet.** `ROUTER.md` §11 carries `CI_WORKFLOW` in both `INTENT_SIGNALS` and `RESOURCE_MAP` with the packet's four reference paths, and `verify-router-sync.cjs` lists `sk-code-ci` in both `SURFACES` and `SURFACE_PACKETS`, so leg 2's union includes the new packet and its map equals the parent projection |
| REQ-005 | R22 | **Routing evidence exists in three places.** A `surface-bundle-ci` canary case and its authored twin exist, a compiled-route test asserts the CI prompt resolves to `[sk-code-review, sk-code-ci]`, and a packet playbook scenario names `CI_WORKFLOW` with its four reference leaves so router-sync leg 4 replays it |
| REQ-006 | R23 | **The exception is recorded without touching the workflow.** `message-contract.yml`'s every-branch push trigger is recorded as an intentional exception in `references/trigger-and-filter-rules.md`, with the rationale from `message-contract.yml:2-9` and `.github/workflows/README.md:73`, and `.github/workflows/message-contract.yml` is byte-identical to its pre-phase state |
| REQ-007 | R22 | **The gates pass.** `parent-skill-check.cjs` exits 0 with `3g`, `5b`, `5k-alias`, `5k-packet`, `5k-canary`, `5l` and `13b-version` passing, `run-all-drift-guards.sh` exits 0, the compiled-route tests pass, and `validate.sh --strict` on this folder prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | R-id | Requirement |
|----|------|-------------|
| REQ-008 | R22 | **The hub release is coherent.** `SKILL.md`, `mode-registry.json`, `hub-router.json` and `description.json` all read the same new version (`2.4.0.0`, or `2.5.0.0` if that minor is already taken), a matching `changelog/v<version>.md` exists, and `SKILL.md`, `README.md`, `shared/README.md`, `feature-catalog/` and `phase-detection.md` name the new surface with a count that matches `mode-registry.json` |
| REQ-009 | R22 | **The registration is additive.** Against `specs/sk-code/013-private-surface-skills/002-hub-surface-removal`, every mode and surface present before this phase still exists after it, no removed example surface is re-added, and `sk-code-ci` is present whether that phase has landed or not |
| REQ-010 | R22, R23 | **No ephemeral id reaches code.** No R-id, D-id or phase number is added to a code comment, a JSON description, a template comment or a test name. Spec documents may cite them; the packet's code and JSON may not |

R22 saves 0 runner-minutes standalone and 0 after R1: it changes no workflow's trigger or job shape. R23 saves 0. Their value is that they keep R1's ~2,073 runner-min/day and R14's ~145 standalone and ~74 after R1 from regressing as new workflows are authored. `final-review.md:430-456` gives both as 0.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** (R22): The packet exists and is read-only: `parent-skill-check.cjs` reports `3g: all surface packet(s) are read-only evidence-base and advisor-invisible`, and the packet carries no `Write`, `Edit` or `Task` tool.
- **SC-002** (R22): The registration is reachable: `parent-skill-check.cjs` passes `5k-canary` and `5l`, the leaf manifest declares a `sk-code-ci` mode, and `verify-router-sync.cjs` passes leg 2 with the new packet in the union.
- **SC-003** (R22): A CI prompt routes to the surface: the compiled route returns `selectionKind: surfaceBundle` with `["sk-code-review", "sk-code-ci"]`, and the canary case plus its authored twin agree byte for byte.
- **SC-004** (R22): The packet's own playbook scenario is replayed by router-sync leg 4 and emits all four of its declared reference leaves.
- **SC-005** (R23): The exception is recorded without touching the workflow: `git diff --exit-code -- .github/workflows/message-contract.yml` exits 0, and `grep -c 'message-contract' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` is at least 2.
- **SC-006** (R22, R23): The phase's own packet validates: `validate.sh --strict` prints `RESULT: PASSED` from the final state, and no added code comment carries an R-id, a D-id or a phase number.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | R-id | Item | Impact | Mitigation |
|------|------|------|--------|------------|
| Dependency | R22 | `002-rebuild-fanout-removal` D1 answer | The rebuild-skip rule has no chosen form to record | T002 reads 002's `### Implementation Notes`; that note freezes Option A (`[skip ci]`) as the default, so the rule records A and names B in one line. No task blocks |
| Dependency | R22 | `004-setup-caching-provisioning` R12 and R14 | The composite-action rule cites a pattern that does not exist | T002 records `.github/actions/setup/action.yml` as absent today and the action-scan count as 0; the rule is written as `status: proposed` with the `final-review.md:344-360` citation, and T012 rewrites that one paragraph to `status: landed` only when T002 found both |
| Dependency | R22 | `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` | Both phases rewrite `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` and the canary fixture; a wholesale rewrite by either phase drops the other's entry | T003 and T004 record the pre-phase arrays and the ordering state; every registration task inserts rather than rewrites; T064 re-runs the registration proof. Preferred order: 013/002 first, because its removal is a rewrite and this phase's insertion is additive |
| Dependency | R22, R23 | The worktree is not provisioned | `parent-skill-check` leg `12-lib` fails on `@spec-kit/shared/frontmatter/parse-frontmatter.js`, so the gate is red before this phase starts | T001 records the failure verbatim as pre-existing; T060 treats `12-lib` as the one allowed failure and requires the other legs to pass. `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` is the repair and is out of this phase's write scope |
| Risk | R22 | `generate-leaf-manifest.cjs` stops with `MODE_LEAF_SET_COLLISION` if the new packet's leaf set hashes equal to another mode's | The phase cannot generate its manifest | The packet's four references and two assets are unique to it; if the collision fires, add a hub-root `leaf-scopes.json` entry for `sk-code-ci` as the README's add-surface step describes |
| Risk | R22 | `verify-doc-claims.cjs` fails on stale surface counts | The hub gate goes red after the registration | T037, T044 and T048 read the count from the registry after T020 and write the matching word; `three surfaces` becomes `four surfaces` in every sentence that spells a count |
| Risk | R22 | The version bump collides with another in-flight hub release | `parent-skill-check` `13b-version` fails, or the changelog has two newest entries | T042 reads the current version first; `2.3.0.0` is on disk today, so the release is `2.4.0.0`. If `changelog/v2.4.0.0.md` already exists, use `2.5.0.0` in all four fields and record why |
| Risk | R23 | The `/doctor:ci report` half of R23's acceptance is built in phase 009 | R23 cannot prove the report does not flag the exception here | The exception is recorded as a table row labelled `intentional-exception`; `009-doctor-ci-review-wiring` reads that label, and its acceptance criterion names the read |
| Risk | R22, R23 | The packet's prose drifts from the cited `file:line` anchors | A reader follows a citation to the wrong line | T005 records all ten anchors with their quoted text; T010 to T015 cite the workflow file and the quoted text, and T065 re-checks each citation through AC-002 |

### Rollback by R-id

- **R22 rollback**: `git revert` the phase commit. The packet folder, the registry entry, the router entry, the generated manifests, the canary case, the compiled-route test, the packet playbook and the hub release disappear together, because they are one commit. Then run `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` so both generated artifacts match the reverted registry, and re-run `parent-skill-check.cjs` and `run-all-drift-guards.sh`.
- **R23 rollback**: delete the `## Intentional exceptions` section from `references/trigger-and-filter-rules.md` and re-run `grep -c 'intentional-exception'` to confirm 0. No other file changes, because the workflow is never edited.
- **Partial rollback**: a registration task that turns a gate red is reverted by deleting the inserted entry, not by deleting the packet. The packet folder is inert while no registry entry names it, because `parent-skill-check` 6a only walks hub children and `sk-code-ci/` is a registered packet once T020 lands.
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The phase adds no CI job and no runner minute: R22's saving is 0 standalone and 0 after R1, and every check it adds runs locally or inside an existing hub gate.
- **NFR-P02**: The packet adds one `modes[]` entry and two vocabulary classes to routing JSON, so the hub's route resolution reads one more mode per request and no new process.

### Security
- **NFR-S01**: The packet's tool surface is read-only (`Read`, `Bash`, `Grep`, `Glob`) and forbids `Write`, `Edit` and `Task`; the packet cannot scaffold or edit a workflow itself.
- **NFR-S02**: No token, secret or repository variable is added. The rule data names the least-privilege shape and the token-eligibility split but carries no credential.

### Reliability
- **NFR-R01**: Every registration edit is additive and idempotent: re-running the generator commands produces the same bytes, and no existing mode, surface or canary case is removed.
- **NFR-R02**: Every gate this phase runs is deterministic and offline except `ci-router-vocabulary-reach.cjs`, which is optional and needs the advisor daemon; its absence does not fail the phase.

---

## 8. EDGE CASES

### R22 - packet and registration boundaries

- Empty surface list: if `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` has removed both example surfaces, `extensions.surface-axis.surfaces` is `["sk-code-skilled"]` before this phase and becomes `["sk-code-ci", "sk-code-skilled"]`; the task computes the array from the file rather than assuming its current length. The same rule holds for `routerPolicy.tieBreak`, `routerSignals`, `description.keywords` and the canary fixture.
- Maximum surface count wording: every sentence that spells a count must match `modes.filter(packetKind === 'surface').length`; `verify-doc-claims.cjs:330-340` fails a stale word, so T037, T044 and T048 read the number and write the matching word. `three surfaces` today, `four surfaces` after the registration.
- Version ceiling: the hub version is four-part; the next minor after `2.3.0.0` is `2.4.0.0`, and a second in-flight `2.4.0.0` moves this phase to `2.5.0.0`.
- Leaf-set collision: if `generate-leaf-manifest.cjs` reports `MODE_LEAF_SET_COLLISION`, the packet's four references and two assets do not give it a unique leaf set; add a hub-root `leaf-scopes.json` entry rather than renaming a leaf.
- Compiled policy staleness: the compiled route serves the activation manifest, not `mode-registry.json`. A registration that skips T057 leaves the route at generation 2 and the CI prompt resolving to a single mode, so the canary and the compiled-route test are the only evidence the route changed.

### R23 - exception boundaries

- The workflow is edited by another phase: when `.github/workflows/message-contract.yml` already differs from the scaffold commit, T017 records `git hash-object` of the file and asserts that hash at the end, rather than asserting an empty diff against `HEAD`.
- The trigger is narrowed by a later change: the exception row names `branches: ['**']` and `message-contract.yml:2-9`; if either disappears, the row is stale and the gate that greps for `branches: ['**']` fails before the report can read a wrong label.
- The ruleset stops requiring the context: the exception still stands, because the workflow's purpose is to check every pushed branch's name and commits. The protected-set rule that it is never switched off is what would change, and that is `007-workflow-hygiene-on-off-control`'s record.

### Error Scenarios

- `parent-skill-check` fails `3c` because the packet folder is missing: the mode entry was added before the folder existed; create the folder first (T007 to T019), then register (T020 onward).
- `verify-router-sync` leg 2 fails with "parent map cites a path no surface child owns": the packet's `RESOURCE_MAP` and `ROUTER.md` disagree; run the guard after both edits and add the missing leaf to the packet map rather than deleting it from the parent.
- `verify-router-sync` leg 2 fails with "parent map CI_WORKFLOW is missing child path": the parent gained the packet's entries under a different intent key; the parent array and the packet array must carry the same four paths.
- The canary fixture and its authored twin diverge: `cmp` exits 1; copy the live fixture over the authored twin, never the reverse.
- The advisor daemon is unavailable for `ci-router-vocabulary-reach.cjs`: record the skip; the gate is optional and the canary leg is the required reachability proof.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 40 (14 created in the packet, 11 hub edits, 7 generated or copied, 8 scratch), LOC: about 1,500 authored lines, Systems: the sk-code hub, its generated artifacts and five gate scripts |
| Risk | 8/25 | Auth: N, API: N, Breaking: N; the only risk is a registration conflict with another in-flight phase |
| Research | 8/20 | The rules are already measured in `final-review.md`; the work is transcription and registration, not investigation |
| Multi-Agent | 4/15 | Workstreams: 1; the packet, its registration and its tests are one ordered chain |
| Coordination | 12/15 | Dependencies: 3 phases and one sibling packet; two read decisions and no operator decision |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | R-id | Description | Impact | Likelihood | Mitigation |
|---------|------|-------------|--------|------------|------------|
| R-001 | R22 | `013-private-surface-skills/002-hub-surface-removal` rewrites the same registration arrays and drops `sk-code-ci` | H | M | T003/T004 record the pre-phase state; registration tasks insert; T064 re-runs the proof after the other phase lands |
| R-002 | R22 | A hand-edited generated artifact (`leaf-manifest.json`, `graph-metadata.json`, the Hermes copy, the compiled policy) drifts from its generator | M | M | Only the named generator writes those files; T033, T034, T056 and T057 run the generators and the freshness checks |
| R-003 | R22, R23 | The rule data drifts from the final review's corrected numbers | M | L | T005 records the source anchors; T010 to T015 quote them; AC-002 greps the corrected figures |
| R-004 | R23 | The message-contract exception is recorded in a shape `/doctor:ci report` cannot read | M | L | The exception is a table row with a stable `intentional-exception` label; phase 009 reads that label |
| R-005 | R22 | The surface count wording goes stale and `verify-doc-claims` fails | L | M | T037, T044 and T048 compute the count from the registry and T061 runs the guard |
| R-006 | R22 | The packet's intent key is added to the parent `ROUTER.md` but not to the packet's own map, so leg 2 reports a missing child path | M | M | T007 and T030 write the same four paths under `CI_WORKFLOW`; T032 runs leg 2 and names the intent key in its failure text |
| R-007 | R22 | A stale line number sends the executor to the wrong line in a 600-line `ROUTER.md` | L | M | Every task quotes the anchor text beside the number; a missing anchor stops the task instead of guessing |
| R-008 | R22 | The playbook scenario is written where router-sync leg 4 cannot see it, so the routing proof passes vacuously | M | M | The scenario lives in the packet's own `manual-testing-playbook/`, which is the only location `playbookScenarios()` walks; T062 asserts leg 4 finds a scenario |

---

## 11. USER STORIES

### US-001: One written standard for a new workflow (Priority: P0)

**As a** maintainer authoring a new GitHub Actions workflow, **I want** one read-only surface that states the trigger, filter, permission, timeout, concurrency and caching rules with their evidence, **so that** I do not have to reconstruct them from 33 files and review comments.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002).

---

### US-002: CI evidence in a workflow review (Priority: P0)

**As a** reviewer looking at a `.github/workflows` diff, **I want** the sk-code hub to bundle the CI surface as evidence, **so that** the review applies the repository's workflow rules instead of falling back to `UNKNOWN`.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-004, AC-005).

---

### US-003: A deliberate trigger is not reported as drift (Priority: P0)

**As an** operator running `/doctor:ci report` after phase 009, **I want** message-contract's every-branch push trigger recorded as intentional, **so that** the report does not flag the one workflow that must see every pushed branch.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-006).

---

### US-004: A scaffold that starts from the rules (Priority: P1)

**As an** operator running `/doctor:ci scaffold` after phase 009, **I want** templates that already carry the switch shape, permissions, concurrency, timeout and SHA-pin placeholders, **so that** a generated workflow starts compliant instead of being repaired later.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002, AC-011).

---

### US-005: A hub that survives the surface removal (Priority: P1)

**As a** maintainer landing `013-private-surface-skills/002-hub-surface-removal` after this phase, **I want** the registration to be additive and documented, **so that** removing the two example surfaces does not silently remove the CI surface.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-009).

---

### US-006: A rule that says whether it is landed or proposed (Priority: P1)

**As a** reviewer reading the composite-action rule before `004-setup-caching-provisioning` lands, **I want** the rule to say `status: proposed` with the citation it will cite once the action exists, **so that** I do not read a proposal as a description of the tree in front of me.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-011).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. This phase makes no operator decision. D1 is read from `002-rebuild-fanout-removal`'s `### Implementation Notes`. D2 is an operator decision in the parent spec, and this phase does not wait for its answer; the concurrency template records the recommended PR-only default until D2 lands. The `013-private-surface-skills/002-hub-surface-removal` ordering is a known risk with a recorded pre-phase snapshot, not an open question. The one question this phase cannot answer alone — whether `/doctor:ci report` reads the exception label — belongs to `009-doctor-ci-review-wiring`, and its acceptance criterion names that read.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md` (ADR-001 to ADR-010)
- **Goal**: See `goal.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:430-456` for R22 and R23, `:579-583` for the phase plan)
- **Registry contract**: See `../001-research/research/research.md` (`:205-241` for the surface packet and its registration list)

---

