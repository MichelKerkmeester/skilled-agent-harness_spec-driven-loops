---
title: "Feature Specification: Phase 5: consumers-and-routing"
description: "Phase 5 of the quality gate program. It names the workflows that read the run verdict, declares the quality rows the runner reads, and routes restraint and comment hygiene requests to sk-code-quality."
trigger_phrases:
  - "consumers and routing"
  - "phase 5 consumers and routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 5: consumers-and-routing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-doctrine |
| **Successor** | 006-measurement |
| **Handoff Criteria** | The three run-verdict readers, the @code QUALITY step and the metadata gate pass, the routing canaries in plan.md section 5 are recorded, and `validate.sh --strict` prints `RESULT: PASSED` for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Make sk-code-quality a codebase-agnostic, executable author gate specification.

**Scope Boundary**: This phase names the workflows that read the quality run verdict, declares the quality rows the runner reads, and moves the routing vocabulary. It does not build the runner, the config seam, the doctrine text or the measurement.

**Dependencies**:
- 001-honest-checker (Phase 1). Transitive only. The verdict this phase reads is built on the Phase 1 checker output.
- 002-builtin-runner (Phase 2). Hard. It supplies the `code-quality-run/v1` verdict, the envelope `checker_outputs` grammar, the runner-contract resource, the runner reader row in `stack-detection.md`, the compiler validation for hub declarations, and the fixtures F14 and F16 that need the sk-code-ci and SKILLED rows.
- 003-config-and-doctor (Phase 3). Soft. This phase reads no `.sk-code/quality.json` and no doctor route, but the battery run in T058 expects the nine legs that phase 003 leaves, and the hub version in T033 builds on its bump.
- 004-doctrine (Phase 4). Hard. It writes the verify step 2 reader rule and the implement and debug handoff lines (its ADR-004), and the unknown-surface lines in `workflow-verify.md` quote the amended Iron Law 3 text. This phase confirms those lines and edits none of the three workflow references.
- 006-measurement (Phase 6). Depends on this phase. Phase 6 is not an input here.

**Deliverables**:
- Named readers for the run verdict in the @code RETURN and `sk-code-review`, beside the `workflow-verify.md` reader that phase 004 writes.
- The @code QUALITY step, its RETURN field and the mirrors.
- Quality rows for SKILLED and sk-code-ci, and validators for outside quality blocks.
- Routing vocabulary, alias moves, derived metadata, the leaf manifest and the hub version.
- Fixture F15, the stage-two restraint test, and the changelogs and version bumps of each touched packet.

**Changelog**:
- The hub and each touched packet get a real changelog file in their own `changelog/` folder when this phase lands. The parent changelog is outside this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The @code agent has no quality step, and its RETURN has no field for a gate result, so a change can come back as done with no gate evidence. The `sk-code-review` mode and the `sk-code-quality` mode both claim the words "quality gate", which splits requests between them. Stage one of routing does not carry "comment hygiene", "yagni" or "over-engineering", so a request that uses those words gets no sk-code recommendation at or above 0.8 today.

### Purpose
Each workflow that acts on a quality result names the verdict it reads, and each comment hygiene or restraint request reaches `sk-code-quality`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name the three readers of the run verdict and correct the allowlist reason that names them.
- Add the @code QUALITY step and its RETURN field, and sync the Claude, Codex and Pi mirrors.
- Declare the SKILLED and sk-code-ci quality rows, and validate outside quality blocks in the metadata gate and the registry compiler.
- Route restraint and comment hygiene vocabulary, move the shared aliases, and drop the quality gate trigger from `sk-code-review`.
- Regenerate derived metadata and the leaf manifest, bump versions, write changelogs, and add fixture F15 and the stage-two restraint test.

### Out of Scope
- The verdict producer, the runner, the checks and the surface reader - Phase 2 (`002-builtin-runner`) owns them, and this phase reads their output.
- The config seam and the `/doctor:sk-code quality` route - Phase 3 (`003-config-and-doctor`) owns them.
- The Iron Law 3 text, the UNKNOWN rows and the SKILLED universal checklist retitle - Phase 4 (`004-doctrine`) owns them.
- Playbook scenarios, the live benchmark and a fix for the stage-one CI canary - Phase 6 (`006-measurement`) owns measurement, and ADR-006 records the canary gap.
- The advisor plugin's copy of `declaredSurfaces` - kept where it is by ADR-014, pending operator confirmation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Drops "quality gate" at lines 22 and 29, adds one run-verdict evidence line. Version minor |
| `.skilled/skills/sk-code/sk-code-review/changelog/` | Create | Real changelog file for the minor release |
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md` | Modify | Line 109 points at the registry declaration. Version patch |
| `.skilled/skills/sk-code/sk-code-ci/changelog/` | Create | Real changelog file for the patch release |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` | Modify | Reason at line 58 names the real readers |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | Version patch only |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` | Create | Stage-two restraint replay test |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/` | Create | Real changelog file for the patch release |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Quality rows for SKILLED and sk-code-ci if Phase 2 left them out. Alias moves at lines 37 and 74. Hub version at line 3 |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Vocabulary moves at lines 50 and 71. Hub version at line 3 |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | CODE_QUALITY keywords at line 242, the runner-contract resource in the CODE_QUALITY map. Document version |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | Adds "comment hygiene", "yagni" and "over-engineering" to `intent_signals`, then regenerated derived block |
| `.skilled/skills/sk-code/description.json` | Modify | Adds "comment hygiene" to keywords. Hub version at line 4 |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Hub version at line 5 only |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify | Regenerated by the generator, never by hand |
| `.skilled/skills/sk-code/changelog/` | Create | Real hub changelog file for the minor release |
| `.skilled/agents/code.md` | Modify | QUALITY step at position 5, VERIFY and RETURN renumbered, Quality Gate RETURN field, required fields |
| `.claude/agents/code.md` | Modify | Hand-synced to the canonical edits in the Claude dialect |
| `.codex/agents/code.toml` | Modify | Regenerated by the Codex sync script |
| `.pi/agents/code.md` | Modify | Regenerated by the Pi sync script |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Adds "quality" to the allowed top-level keys and the GRAPH_METADATA_INVALID_QUALITY validator |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Rows for the quality key and its violation code at lines 130 and 147 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | Cases for a valid and a malformed quality block |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` | Modify | QUALITY_DECLARATION_INVALID beside SURFACE_DETECTION_INVALID, if Phase 2 left it out |
| `.skilled/bin/tests/quality-declaration.test.cjs` | Create | Negative test for a malformed hub quality row |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | Adds fixture F15 to the Phase 2 test file |
| `specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/` | Modify | This packet's documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The run verdict has three named readers: `workflow-verify.md` step 2, the @code RETURN `Quality Gate` field and `sk-code-review` as input evidence. Phase 004 writes the first, and this phase writes the other two and confirms the first. |
| REQ-002 | The @code agent runs a QUALITY step at position 5 between IMPLEMENT and VERIFY, and its RETURN carries `**Quality Gate:** <GATE> \| p0_blocking=<n> \| unverified=<ids or none>`. |
| REQ-003 | A malformed outside `quality` block fails the metadata gate with `GRAPH_METADATA_INVALID_QUALITY`, and a malformed hub quality row fails the registry compiler with `QUALITY_DECLARATION_INVALID`. |
| REQ-004 | `ROUTER.md` CODE_QUALITY carries the restraint words and comment hygiene. Stage one carries only "comment hygiene", "yagni" and "over-engineering", and never "simplify". |
| REQ-005 | `sk-code-review` no longer claims the "quality gate" trigger, and it may read a run verdict as input evidence. |
| REQ-006 | Fixture F15 passes: an outside `local-example` surface that declares `quality` lists its checklist, labels the envelope EXAMPLE and names no `local-` skill. |
| REQ-007 | The agent mirrors are in sync: `.skilled/agents` is canonical, `.claude` is hand-synced, and `.codex` and `.pi` are regenerated. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The SKILLED and sk-code-ci quality rows exist in `mode-registry.json`, and the sk-code-ci row is path-only for `.github/workflows/**`. |
| REQ-009 | The alias moves put "alignment verifier", "stable jsonl keys" and "add set -euo pipefail" in their new owners, and no alias appears under two modes. |
| REQ-010 | The `verify-doc-claims.cjs` allowlist reason at line 58 names `workflow-verify.md` step 2 and the @code RETURN field. |
| REQ-011 | The hub, ROUTER.md and each touched packet carry the next version, and each touched packet has a real changelog file. |
| REQ-012 | Derived metadata and the leaf manifest regenerate, and their freshness gates report zero stale roots. |
| REQ-013 | The stage-two replay of "apply yagni to this change" reports CODE_QUALITY in `surfaceIntents`. |
| REQ-014 | Each routing canary in plan.md section 5 is run, and its exact output is recorded in implementation-summary.md. |
| REQ-015 | `workflow-verify.md` lines 47 and 55 keep their unknown-surface asking after phase 004's edit, because Iron Law 3 still governs verification. This phase confirms them read only. |
| REQ-016 | This packet validates with `validate.sh --strict --no-recursive` and each document passes `validate_document.py --type spec`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0.
- **SC-002**: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0`.
- **SC-003**: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0.
- **SC-004**: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0` and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002-builtin-runner verdict, envelope grammar and hub declarations | Without them the readers have nothing to read and F14 and F16 cannot pass | Hold the phase until Phase 2 lands. This phase does not stub the verdict |
| Dependency | 004-doctrine amended Iron Law 3 text | The unknown-surface lines quote the wrong rule if Phase 4 lands later | Check the wording with `rg -n 'universal floor'` before editing lines 47 and 55 |
| Risk | Stage-one CI canary stays `single`, so `sk-code-ci` is not bundled at stage one | Med. The design expects a surface bundle, and no bundle rule exists in `hub-router.json` | ADR-006 records the measured result. AC-018 stays Unmet until an operator decision closes it |
| Risk | Alias and vocabulary moves change stage-one matching for SKILLED phrases | Med. A request that matched SKILLED may stop matching | Replay each moved phrase before and after the move, as plan.md section 5 lists |
| Risk | Hand-synced `.claude` mirror drifts from `.skilled` | Low. `check-agent-mirror-sync.cjs` fails the drift | Run `--all` after the edit and fix any drift before the phase closes |
| Risk | Hub, ROUTER and packet versions disagree | Low. Doctor and changelog readers assume one release value | Compare all four hub version carriers before closing |
<!-- /ANCHOR:risks -->

---


<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. This phase adds no runtime path. The validators run only when their gate runs.
- **NFR-P02**: N/A. This phase adds no throughput-bound component.

### Security
- **NFR-S01**: No tracked artifact names a `local-*` skill. The F15 test and the grep in AC-009 check it.
- **NFR-S02**: A quality row carries checklists only. The validators reject any row that carries `argv`, `command` or `run` keys.

### Reliability
- **NFR-R01**: A malformed quality block fails closed with a named violation code and exit 1. AC-004 and AC-005 check it.
- **NFR-R02**: Stage one and stage two route the moved phrases the same way. The replay in AC-006 and AC-007 checks it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- /ANCHOR:edge-cases -->

### Data Boundaries
- Empty input: a `graph-metadata.json` with no `quality` key passes the metadata gate unchanged. The 14 roots must still report `failed=0`.
- Maximum length: N/A. A quality block holds the rows its surface lists, and this phase sets no limit on the count.
- Invalid format: a row with a non-array `paths`, an empty `file`, or a command key fails with the named violation code and exit 1.

### Error Scenarios
- External service failure: N/A. No service call happens in this phase.
- Network timeout: N/A. No network call happens in this phase.
- Concurrent access: N/A. The phase edits files in one working tree and makes no shared write.

### State Transitions
- Partial completion: a stop after the readers and before the mirrors fails `check-agent-mirror-sync.cjs --all`. Recovery: finish the mirror step, then rerun the gate.
- Session expiry: N/A. The phase keeps no session state.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 files across four surfaces: shared references, two packets, the hub registries and the agent mirrors |
| Risk | 14/25 | Two outside validators, the @code agent mirrors and the routing vocabulary |
| Research | 7/20 | The design citations were re-checked, and the routing and gate baselines were recorded before this packet was written |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does stage one of compiled routing return a `surfaceBundle` with sk-code-ci for the CI canary? Today it returns `single`. ADR-006 decides how this gap is recorded.
- The design recommended placing this packet under `specs/sk-code/014-code-modes-research/`. It sits under `015-quality-agnostic-gate/` instead. The operator decides placement under Gate 3, and this phase does not move it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: See `../spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decisions**: See `decision-record.md`
- **Goal**: See `goal.md`
- **Implementation summary**: See `implementation-summary.md`
