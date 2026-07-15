---
title: "Feature Specification: command-recipe choreography relocation + validator repair"
description: "Acts on the GPT-5.6 SOL ultra advisory: remove the dead wrapper-prose choreography branch from the Lane C scorer, repair sk-design's own command-surface validator (currently INVALID with 10 metadata errors from synthesizing a slash-command for the null-command transport), strengthen its asset-level choreography check to the thin-router architecture, and de-drift the stale recipe fixture + the self-masking unit test."
trigger_phrases:
  - "command recipe choreography relocation"
  - "design command surface validator repair"
  - "lane c dead branch cleanup"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/006-command-recipe-choreography-relocation"
    last_updated_at: "2026-07-14T21:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec from the SOL ultra advisory (option C)"
    next_safe_action: "Run Phase 1, then the Phase 2/3 swarm"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: command-recipe choreography relocation + validator repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-14 |
| **Parent** | `sk-doc/017-benchmark-authoring-centralization` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 005 removed a false-positive from the Lane C scorer's `validateRecipeChoreography()`: the "wrapper `## CHOREOGRAPHY` section is missing" penalty, which became unsatisfiable once the `/design:*` commands became thin routers (choreography moved to asset YAML step keys). That left the discoverability guarantee **dropped, not relocated**, and the now-dead section-present branch still lingers in the scorer. A GPT-5.6 SOL ultra advisory recommended option C: delete the dead branch, and move choreography enforcement to sk-design's own command-surface validator — the correct layer, since it already owns the 5 design commands and reads their assets. Grounding the advisory surfaced three real defects: (a) `design-command-surface-check.mjs` currently reports `STATUS=INVALID invalid=10` because it synthesizes a `/design:design-mcp-open-design` sibling command for the transport that carries `command: null`, so it never reaches surface/choreography validation; (b) the "valid" recipe fixture is stale (4 choreography rows vs live metadata's 5); (c) the unit helper `designRecipe()` clones **live** metadata instead of loading committed gold, so it structurally cannot catch fixture drift.

### Purpose
Delete the dead Lane C branch; repair the validator so it reaches VALID without weakening any check; strengthen its asset-level choreography check to the thin-router architecture; and de-drift the stale fixture + the self-masking test — so choreography discoverability is enforced at the right layer, honestly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Lane C cleanup:** remove the dead wrapper-prose branch and its now-unused `wrapperMarkdown` plumbing/helpers from `score-skill-benchmark.cjs`; keep the recipe↔metadata equality check.
- **Validator repair:** fix `design-command-surface-check.mjs` so the null-command transport no longer contributes a synthetic `/design:*` sibling command; reach `invalid=0` without weakening the check (fix the root cause in the validator's expected-set derivation, or the metadata, whichever is correct).
- **Validator strengthen:** harden the asset-level choreography check — require auto/confirm ordered `step_N_<name>` parity and canonical witnesses — WITHOUT positional `order === step_N` heuristics.
- **Fixture + test hygiene:** refresh the stale recipe fixture to current metadata; de-mask `designRecipe()` so the recipe test loads committed gold; add negative tests.

### Out of Scope
- Repointing the Lane C check positionally at YAML step keys (rejected — incompatible abstractions: 5 metadata rows vs 7 YAML steps).
- Removing the `/design:*`-specific `commandRecipe` lane from the general scorer (a documented layering follow-up).
- Any change to sk-design command behavior or the design commands themselves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Delete dead wrapper-prose branch + unused plumbing |
| `deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Drop the wrapper-markdown argument if the signature ripples |
| `sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Repair null-command synthesis; strengthen choreography check |
| `deep-improvement/assets/skill_benchmark/fixtures/sk_design/*.private.json` | Modify | Refresh stale recipe gold |
| `deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | De-mask recipe test; add negative tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lane C dead branch removed | The wrapper-prose branch + unused `wrapperMarkdown` plumbing are gone from `score-skill-benchmark.cjs`; recipe↔metadata equality retained; the full skill-benchmark suite stays green |
| REQ-002 | Validator reaches VALID | `design-command-surface-check.mjs` reports `invalid=0`; the null-command transport no longer yields a synthetic `/design:*` sibling; no check weakened to get there |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Choreography check strengthened | Validator requires auto/confirm ordered `step_N_<name>` parity + canonical witnesses; no positional `order === step_N` heuristic; owner-local negative tests cover the mutations |
| REQ-004 | Stale fixture refreshed | `sk_design_command_recipe_valid.private.json` matches current metadata (5 choreography rows + current grammar); other recipe fixtures verified consistent |
| REQ-005 | Test de-masked | The recipe unit test loads committed gold rather than cloning live metadata, so fixture drift is now catchable; negative tests added |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Layering debt documented | The `decision-record.md` records that the `commandRecipe` lane is a `/design:*`-specific extension inside a general scorer, with the recommended long-term owner-adapter direction |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full `skill-benchmark.vitest.ts` suite passes (0 failures), including new negative tests and the de-masked recipe test.
- **SC-002**: `node design-command-surface-check.mjs` reports `STATUS=VALID` / `invalid=0`.
- **SC-003**: `node --check` clean on both `.cjs`; the validator's own test suite (if any) passes.
- **SC-004**: `validate.sh --strict` on this packet returns Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Validator repair changes metadata contract semantics | Med | Fix the root cause (transport is command:null); re-run validator to `invalid=0`; do not relax an unrelated check |
| Risk | Strengthened check false-positives across the 5 commands | Med | Structural (not positional) contract; run against all 5 real commands; negative tests prove the mutations fail |
| Risk | De-masking the test surfaces the stale fixture as a failure | Low | Refresh the fixture in the same phase so the de-masked test passes on real gold |
| Dependency | SOL ultra advisory (option C) | — | Grounded + corrected against real files before scoping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No existing skill-benchmark or sk-design validator test regresses.
- **NFR-R02**: Frozen benchmark run-report artifacts remain byte-identical.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The transport mode (`command: null`) must be excluded from the runnable-command / sibling-coverage set, but still validated for its own transport contract.
- `step_0_show_prompt` is a legitimate confirm-only step and must be the sole exemption to auto/confirm step parity.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 5 files across two skills; cleanup + validator repair + strengthen + fixtures |
| Risk | 12/25 | Validator-contract + scorer changes with a regression surface |
| Research | 8/20 | Advisory + validator behavior already grounded |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open; spec folder (new child 016/006) and option C were operator-directed.
<!-- /ANCHOR:questions -->
