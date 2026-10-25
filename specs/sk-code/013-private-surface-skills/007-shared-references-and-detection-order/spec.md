---
title: "Feature Specification: Phase 7: shared-references-and-detection-order"
description: "The sk-code shared references still held web-era and duplicate material, and surface detection hard-coded SKILLED first, so an operator-private or repo-added surface could never outrank it. This phase trims shared references to hub and mode material and makes SKILLED the one fallback surface that always ranks last."
trigger_phrases:
  - "shared references and detection order"
  - "phase 7 shared references and detection order"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/007-shared-references-and-detection-order"
    last_updated_at: "2026-10-25T22:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the phase after CI rebuilt the trigger index in fbfc4bfe22"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-shared-references-and-detection-order"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Phase 7: shared-references-and-detection-order

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The sk-code `shared/references/` folder still carried web-era checklists and audits, and surface detection named SKILLED first, so a surface the operator keeps private or a surface another repository adds could never win. This phase deletes or moves every shared file that is not about the hub and its modes, and turns SKILLED into the one declared fallback surface that always ranks last. The router-sync, parent-skill and compiled-route suites prove it once phase B regenerates the derived files.

**Key Decisions**: SKILLED is a declared fallback, not a hard-coded first match. Outside sk-code family skills declare their own surface in `graph-metadata.json` under `surface_detection`.

**Critical Dependencies**: The leaf-manifest regeneration and the compiled-routing re-mint in phase B. Until they run, router-sync check 2, parent-skill-check 10b and 12a, and two compiled-route suites fail on the expected drift.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | `verify-router-sync.cjs` prints `5/5`, `parent-skill-check.cjs .skilled/skills/sk-code` prints OK, the compiled-route suites pass after the re-mint, and recursive strict validation of the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the private surface skills packet. Phase 4 moved the Webflow and Obsidian surfaces into private `local-*` skills. This phase makes the hub ready for them: shared references stop carrying their web-era leftovers, and detection lets a private or repo-added surface lead.

**Scope Boundary**: the sk-code hub shared references and their readers, the sk-code surface detection data and its four detectors, and the fleet metadata gate key list. The private `local-*` skills are operator-owned and stay unchanged.

**Dependencies**:
- Phase 004 is on `main`, so `local-*` skills exist as gitignored symlinks
- The four optimizer workers finish their edits to the shared references before phase B runs

**Deliverables**:
- Four shared references deleted, one moved to `sk-code-quality/references/`
- `surfaceDetection` in `mode-registry.json`, read by the registry compiler, the canary router, the replay library and the advisor plugin
- `surface_detection` accepted as an optional object by `ci-skill-root-metadata.cjs`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared references folder held material that belonged to no hub mode: two checklists that repeated the workflow docs and still named Lighthouse, `.next`, cross-browser and single-viewport checks, a frontend performance audit only ROUTER read, and an error-recovery note. Surface detection hard-coded SKILLED first in one replay regex, and a SKILLED hint moved SKILLED ahead of CI, so an operator-private or repo-added surface could never outrank it.

The operator set two rules:

> "Shared references should only contain stuff regarding the parent and nested modes like stack detection"

> "sk code skilled should always be last and new modes from other repo users should always be priority"

### Purpose
Shared references hold only hub and mode material, and detection ranks declared specific surfaces first, outside sk-code family surfaces next, SKILLED as the single fallback after them, and UNKNOWN last.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the shared references that repeat the workflow docs or serve one web surface, folding any surface-neutral rule into the workflow doc that owns it
- Move the code style guide to `sk-code-quality/references/` and repoint every reader
- Declare `surfaceDetection` on `sk-code-skilled` in `mode-registry.json` with role `fallback`, and read the declared order in the compiler, canary router, replay library and advisor plugin
- Accept `surface_detection` in the fleet metadata gate so an outside sk-code family skill can declare its surface
- Correct the prose that still describes the old hint behaviour

### Out of Scope
- The operator-owned `local-webflow` and `local-obsidian` skills. Their suggested `surface_detection` blocks are recorded in the worker notes and left for the operator
- The WEBFLOW, MOTION and LENIS allowlist regexes in `check-comment-hygiene.sh`, the JS/CSS overlay `naming-init-formatting-and-css.md` and the archived spec sample fixture. Each belongs to another owner or needs a decision
- `hub-router.json`. Its tieBreak already ends with `sk-code-skilled`

### Per-File Verdicts

| File | Verdict | Reason |
|------|---------|--------|
| `shared/references/universal-debugging-checklist.md` | Delete | Repeated the Four-Phase checklist in `workflow-debug.md`. Its one extra rule, no debug instrumentation left in the fix, moved to that doc's Never list |
| `shared/references/universal-verification-checklist.md` | Delete | Repeated the Pre-Claim Gate and kept Lighthouse, `.next`, cross-browser and single-viewport leftovers. Its surface-neutral extras moved to `workflow-verify.md` |
| `shared/references/universal/error-recovery.md` | Fold, then delete | Became the surface-neutral Command Failure Recovery subsection of `workflow-debug.md` |
| `shared/references/universal/multi-agent-research.md` | Delete | A frontend performance audit that only ROUTER read |
| `shared/references/universal/code-style-guide.md` | Move | Now `sk-code-quality/references/code-style-guide.md`, the mode that owns style |
| `shared/references/workflow-{implement,debug,verify}.md` | Keep, scrub | Browser and viewport wording became runtime and environment wording |
| `shared/references/universal/code-quality-standards.md` | Keep, scrub | The overlay line names the mode that loads it, not a stack |
| `shared/references/stack-detection.md`, `phase-detection.md` | Keep, rewrite | Hub detection doctrine. Stack detection now states the declared order |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/` (4 files) | Delete | The four files in the verdict table |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Move | From `shared/references/universal/`, links repointed, examples made surface-neutral |
| `.skilled/skills/sk-code/shared/references/workflow-*.md`, `universal/code-quality-standards.md`, `shared/README.md` | Modify | Folded rules, scrubbed web wording, removed checklist pointers |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | RESOURCE_MAP and SHARED_CONTROL_RESOURCES repointed, hint prose corrected |
| Style guide readers: `.github/workflows/comment-hygiene.yml`, both pre-commit hooks, the post-edit-quality hooks and README, `ephemeral-pointer-audit.mjs` and its README, `sk-code-quality` scripts and docs, `sk-code-skilled` checklist and references, five playbook files | Modify | Repointed to the moved style guide |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | `surfaceDetection` on `sk-code-skilled` and the contract text in `extensions.surface-axis` |
| `registry-compiler.cjs`, `canary-router.cjs` (served copies under `.skilled/bin/lib/` and the authored twins under `specs/sk-doc/z_archive/`) | Modify | `validateSurfaceDetection`, `routingModel.surfaceDetection`, hint resolution by declared label |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | `declaredSurfaces` and `detectSurfaces` replace the hard-coded regex |
| `.skilled/plugins/system-skill-advisor.js` | Modify | `detectWorkspaceSurface` reads the declared order |
| `.skilled/skills/sk-code/SKILL.md`, `graph-metadata.json`, `sk-code-review/SKILL.md`, feature catalog, playbook files | Modify | Describe the declared order |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Allowlist comment matches the shared-control routing |
| `.skilled/bin/README.md` | Modify | `--surface-hint` row says a fallback hint changes nothing |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` and its contract test | Modify | `surface_detection` is an allowed optional object key |
| Tests: `compiled-route-surface-hint.test.cjs`, `system-skill-advisor-plugin.vitest.ts` | Modify | Seven new cases for the declared order |
| `leaf-manifest.json`, compiled routing manifests, `.hermes/skills/` mirrors, trigger index, retrieval fixtures | Regenerate (phase B) | Never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `shared/references/` holds no file outside the hub and mode doctrine. The four deleted files are absent and no tracked reader outside dated records and generated data names them |
| REQ-002 | `sk-code-skilled` is the only surface with role `fallback`, and it ranks last in every detector: compiler, canary router, replay library and advisor plugin |
| REQ-003 | A declared specific surface, from the hub or from an outside sk-code family skill, leads SKILLED when both match. A SKILLED hint changes no route |
| REQ-004 | The fallback's real-path guard holds: a generic Node file outside the hub's `.skilled/` stays UNKNOWN, and a file inside a symlinked `local-*` skill is not SKILLED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `ci-skill-root-metadata.cjs` accepts `surface_detection` as an optional object and rejects a non-object value |
| REQ-006 | The surface-neutral rules of the deleted checklists live on in `workflow-debug.md` and `workflow-verify.md`, so the verify gate is not weaker |
| REQ-007 | Derived files are regenerated, not hand-edited: leaf manifest, compiled routing, Hermes mirrors, trigger index and retrieval fixtures |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` after phase B
- **SC-002**: `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` passes 12/12, and the compiled-route front-door and manifest suites pass after the re-mint
- **SC-003**: replay parity over the 77 hub playbook prompts differs only where a `.skilled/` prompt moved from UNKNOWN to SKILLED with no resource change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Optimizer workers editing five shared references | Phase B gates would read files still in flux | Phase B starts only after they report done |
| Risk | The `.ts` file marker on the fallback would make any TypeScript file SKILLED | High | The fallback holds on real paths only through path markers inside the hub's own `.skilled/` |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. Detection reads a handful of declared markers per call and the packet runs no service.

### Security
- **NFR-S01**: No private `local-*` skill id, path or marker reaches a tracked file. The suggested private blocks stay in the worker notes, and the `stack-detection.md` example uses the neutral `local-example`.

### Reliability
- **NFR-R01**: The registry compiler rejects a malformed block on every compile with `SURFACE_DETECTION_INVALID` or `SURFACE_FALLBACK_INVALID`.

---

## 8. EDGE CASES

### Data Boundaries
- No declared specific surface: detection returns SKILLED for hub paths and UNKNOWN elsewhere, as before.
- An outside block claiming role `fallback`: ignored, so only the hub names the fallback.

### Error Scenarios
- A hub with surface packets but no fallback, or two: the compiler fails with `SURFACE_FALLBACK_INVALID`.
- A non-object `surface_detection`: the fleet gate fails with `GRAPH_METADATA_INVALID_SURFACE_DETECTION`.

### State Transitions
- Partial completion: until phase B runs, three gates fail on the stale leaf manifest and compiled routing. Each failure names that one cause.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 55, LOC: about 2,000 changed, Systems: hub docs, routing compiler, advisor plugin, fleet gate |
| Risk | 15/25 | Auth: N, API: N, Breaking: routing order for mixed surfaces |
| Research | 8/20 | Replay parity and twin-file discovery |
| Multi-Agent | 10/15 | Workstreams: 2 workers, 1 integrator, 4 optimizers |
| Coordination | 10/15 | Dependencies: optimizer edits, phase B regeneration |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The served compiler copies drift from the authored twins and a sync erases the change | H | M | Both twins carry the change byte-identically, and `compiled-route-sync.cjs --check` confirms all 55 copies match |
| R-002 | A moved style guide path stays named in a reader | M | L | Every reader was repointed and phase B regenerates the trigger index and retrieval fixtures |

---

## 11. USER STORIES

### US-001: Private surface leads (Priority: P0)

**As an** operator with a private `local-*` surface, **I want** my declared surface to lead SKILLED when both match, **so that** the hub loads my surface's resources first.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Lean shared references (Priority: P1)

**As a** maintainer reading the hub, **I want** shared references to hold only hub and mode doctrine, **so that** no web-era checklist loads for a non-web task.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Naming severity: Operator ruled 2026-10-25: P1 in both. `shared/references/universal/code-quality-standards.md` now lists naming under P1, matching `sk-code-skilled/assets/checklists/universal-checklist.md`.
- Whether to add the suggested `surface_detection` blocks to the two private skills is the operator's call.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section of `plan.md`
