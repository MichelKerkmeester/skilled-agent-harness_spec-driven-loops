---
title: "Implementation Plan: Phase 8: cutover-and-rollout"
description: "Final-gate execution plan for the sk-prompt parent-hub cutover. The approach is to run strict parent-hub validation, recursive spec validation, a stale-reference grep sweep, then roll up parent metadata only after the evidence is clean."
trigger_phrases:
  - "sk-prompt rollout plan"
  - "parent skill strict validation"
  - "recursive spec validation"
  - "stale reference grep"
  - "metadata rollup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-18T06:22:50.367Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned; all gates PASS clean, parent metadata rolled up"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-sk-prompt-parent-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: cutover-and-rollout

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js validation scripts, shell validation, markdown/spec metadata |
| **Framework** | OpenCode skill parent-hub pattern and Spec Kit phase packet workflow |
| **Storage** | Filesystem metadata in the parent spec folder |
| **Testing** | `parent-skill-check.cjs`, `validate.sh --recursive --strict`, and grep evidence |

### Overview
This phase executes the terminal cutover gate for the merged `sk-prompt` parent hub. It does not add new behavior; it proves the already-folded hub clears strict parent-skill validation, the whole parent packet passes recursive strict spec validation, live stale references are gone, and the parent packet metadata is rolled up only after those checks are clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 008 scope is limited to validation, stale-reference sweep, and parent rollup.
- [x] Prior construction phases have landed the hub layout, router metadata, command/runtime path updates, benchmark path migration, and documentation alignment.
- [x] The executor has the exact command strings and stale-reference filters needed for evidence capture.

### Definition of Done
- [x] `parent-skill-check.cjs` strict run exits cleanly with zero warnings.
- [x] Recursive strict spec validation exits cleanly for the parent packet.
- [x] Grep sweep evidence shows zero live old-path references outside historical spec/changelog text.
- [x] Parent `description.json` and `graph-metadata.json` are rolled up after evidence is clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Final-gate verification and metadata rollup.

### Key Components
- **Strict parent-hub check**: Confirms `.opencode/skills/sk-prompt` satisfies the canonical parent-skill router, registry, and packet layout rules under `PARENT_HUB_CHECK_STRICT=1`.
- **Recursive spec validation**: Confirms the full `.opencode/specs/sk-prompt/007-sk-prompt-parent` packet, including phase children, satisfies strict Spec Kit validation.
- **Stale-reference sweep**: Confirms old flat `sk-prompt-models/` and direct `sk-prompt/SKILL.md` live references have been replaced or intentionally retained only in historical spec/changelog text.
- **Parent metadata rollup**: Updates the parent packet's own metadata after checks pass so resume and graph traversal reflect completion and phase `008` as the last active child.

### Data Flow
Validation evidence flows first: parent-hub check, recursive spec validation, and grep sweep must all pass before parent packet metadata is changed. If any gate fails, the future executor stops, records the failing evidence in the phase completion artifacts, and routes fixes to the owning prior scope rather than marking the parent complete.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt` | Folded parent hub under test | Validate unchanged unless the strict gate finds a defect | `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` |
| `.opencode/specs/sk-prompt/007-sk-prompt-parent` | Parent packet and phase docs | Validate recursively, then roll up parent metadata after clean evidence | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/007-sk-prompt-parent --recursive --strict` |
| Live repository references | Consumers of old skill paths | Patch only if stale live hits remain during execution | Final grep sweep for `sk-prompt-models/` and `sk-prompt/SKILL.md`, excluding historical spec/changelog text |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phases 001-007 have landed the hub layout, router metadata, command rename, runtime path updates, benchmark path migration, and documentation reference updates.
- [x] Confirm the working tree has no unrelated staged changes before any future metadata rollup.
- [x] Prepare evidence capture locations in the phase 008 completion artifacts without creating new production files.

### Phase 2: Core Implementation
- [x] Run `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` and stop on any warning or failure.
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/007-sk-prompt-parent --recursive --strict` and stop on any error.
- [x] Run the stale-reference grep sweep for old flat `sk-prompt-models/` and `sk-prompt/SKILL.md` paths; classify historical spec/changelog text as allowed and patch any live hit before closeout.
- [x] After all gates are clean, update parent `description.json` and `graph-metadata.json` so the packet is complete and `last_active_child_id` points to `008`.

### Phase 3: Verification
- [x] Re-run the parent-hub strict check after any fixes required by the first run.
- [x] Re-run recursive strict spec validation after metadata rollup.
- [x] Re-run the stale-reference grep sweep and record the final zero-live-hit result.
- [x] Record the exact command outputs and metadata changes in `implementation-summary.md` and the Level-2 checklist during the future execution pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Parent hub router, mode registry, packet metadata, packet layout | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=1` |
| Spec validation | Parent packet and all phase children | `validate.sh --recursive --strict` |
| Reference audit | Live references to old flat skill paths | Grep sweep for `sk-prompt-models/` and `sk-prompt/SKILL.md` with historical spec/changelog exclusions |
| Metadata verification | Parent `description.json` and `graph-metadata.json` closeout state | File readback after rollup plus recursive validation rerun |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Internal validation gate | Required | Cannot claim canon-clean parent hub status without a strict zero-warning run. |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Internal validation gate | Required | Cannot close the parent packet without recursive strict validation. |
| Phase 001 research evidence | Internal planning source | Required | Stale-reference exclusions and old-path risk handling must stay grounded in researched facts. |
| Parent packet metadata files | Internal continuity source | Required | Resume and graph traversal remain stale if rollup is not performed after validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parent-hub strict check emits any warning/failure, recursive strict spec validation fails, grep sweep finds live stale references, or parent metadata rollup introduces inconsistent completion state.
- **Procedure**: Do not mark the parent complete. Revert only the phase 008 metadata rollup edits made during the future execution pass, keep validation evidence in the phase completion artifacts, fix the owning prior-scope defect, and rerun all gates before attempting closeout again.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
