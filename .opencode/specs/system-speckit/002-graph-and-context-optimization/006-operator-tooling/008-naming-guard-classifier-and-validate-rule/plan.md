---
title: "Implementation Plan: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule"
description: "Build a TS-authoritative spec-folder naming classifier with a shell shim, then wire a WARN-severity SEMANTIC_NAMING rule into both the Node validator orchestrator and the shell fallback."
trigger_phrases:
  - "naming guard plan"
  - "classifier build order"
  - "semantic naming rule wiring"
  - "spec folder naming module"
  - "validator orchestrator naming"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted build-order plan for items 1+2 of naming guard"
    next_safe_action: "Execute Phase 2 starting with the shared classifier module"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/spec-folder-naming.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/shell-common.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "open-008-naming-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to dist) + Bash |
| **Framework** | system-spec-kit validator (Node orchestrator + shell rule registry) |
| **Storage** | None (filesystem path inspection only) |
| **Testing** | Node unit fixtures + `validate.sh --strict` parity check |

### Overview
Add a pure-TS `classifyProposedSpecFolder()` authored in `shared/`, exposed to shell via a CLI wrapper + `classify_proposed_spec_folder` shim, and to the runtime via an `mcp_server/lib/spec` re-export. Then register a WARN-severity `SEMANTIC_NAMING` validation rule wired into BOTH the Node orchestrator (which `validate.sh` runs first) and the shell rule registry (the fallback path), so the rule is never silently skipped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Ruleset and severities frozen (done via 007 research recommendations)
- [ ] Real code anchors confirmed (`is-phase-parent.ts`, `shell-common.sh`, `validator-registry.json`, `check-folder-naming.sh`)
- [ ] False-positive exclusion shapes identified (`003-...-103-...`, `009-p2-032-...`)

### Definition of Done
- [ ] Classifier flags `028-026-*` HARD-BLOCK and passes the two known-good shapes
- [ ] `SEMANTIC_NAMING` runs through both orchestrator and shell fallback
- [ ] `validate.sh <packet> --strict` green for this packet; docs synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-impl shared-helper pattern (existing `isPhaseParent` precedent): one authoritative TypeScript source, a compiled CLI wrapper for shell consumers, and a runtime re-export for the validator orchestrator.

### Key Components
- **`shared/spec-folder-naming.ts`**: pure classifier, no I/O beyond sibling-directory listing; returns the classification record.
- **`scripts/spec/spec-folder-naming.ts`**: CLI wrapper emitting TSV/JSON for the shell shim.
- **`scripts/lib/shell-common.sh` shim**: `classify_proposed_spec_folder` calls the compiled wrapper and parses TSV.
- **`scripts/rules/check-semantic-naming.sh` + registry**: shell-side validation rule.
- **`mcp_server/lib/validation/orchestrator.ts`**: `validateSemanticNaming(folder)` pushed into orchestrator entries.

### Data Flow
`validate.sh` -> Node orchestrator (`validateSemanticNaming`) -> classifier; on orchestrator-unavailable, shell fallback -> `check-semantic-naming.sh` -> `classify_proposed_spec_folder` shim -> compiled classifier. Both paths converge on the same TS classifier output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/spec-folder-naming.ts` (new) | Authoritative classifier policy | create | Unit fixtures for the 3 hard cases + 2 known-good shapes |
| `scripts/lib/shell-common.sh` | Shared shell helpers (`is_phase_parent` lives here) | update (add shim) | `bash -n` + smoke call returning TSV |
| `scripts/lib/validator-registry.json` | Rule registry consumed by validate.sh | update (add `SEMANTIC_NAMING`) | `python3 -c 'import json'` parse + validate.sh lists the rule |
| `mcp_server/lib/validation/orchestrator.ts` | Node orchestrator validate.sh runs first | update (push rule) | Orchestrator path emits the rule |
| `scripts/rules/check-folder-naming.sh` | Pattern to mirror for the new rule | unchanged (reference only) | n/a |

Required inventories:
- Same-class producers: `rg -n 'is_phase_parent|isPhaseParent|PHASE_CHILD_REGEX' .opencode/skills/system-spec-kit`.
- Consumers of changed symbols: `rg -n 'SEMANTIC_NAMING|classify_proposed_spec_folder|classifyProposedSpecFolder' .opencode/skills/system-spec-kit`.
- Matrix axes: nesting (top-level vs nested) x embedded-number sibling type (phase-parent / non-phase / none / multiple) x slug genericness.
- Algorithm invariant: HARD-BLOCK fires ONLY when a top-level slug body starts with an existing sibling's 3-digit number AND exactly one such sibling exists AND that sibling is a phase parent; all other embedded-number shapes are OK or WARN.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dual-impl anchors and tsconfig include globs (`shared/**`, `scripts/spec/**`, `mcp_server/lib/**`)
- [ ] Define fixtures: `028-026-*`, `003-...-103-...`, `009-p2-032-...`, a strict-fail nested child
- [ ] Lock the classification record shape and ruleId constants

### Phase 2: Core Implementation
- [ ] Implement `classifyProposedSpecFolder()` with `EMBEDDED_SIBLING_PHASE_PARENT` (HARD), strict phase-child syntax (HARD), `GENERIC_STANDALONE_SLUG` (WARN)
- [ ] Add the CLI wrapper + `classify_proposed_spec_folder` shell shim
- [ ] Add `check-semantic-naming.sh` and register `SEMANTIC_NAMING` (warn) in validator-registry.json
- [ ] Add `validateSemanticNaming(folder)` to the Node orchestrator entries

### Phase 3: Verification
- [ ] Unit fixtures pass (3 hard cases + 2 known-good shapes)
- [ ] Parity check: rule emitted via orchestrator path AND shell fallback path
- [ ] `validate.sh <packet> --strict` green; spec/plan/tasks/checklist/impl-summary synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyProposedSpecFolder()` against fixture folders | Node + tmp dirs |
| Integration | Rule emitted via both orchestrator and shell fallback | validate.sh |
| Manual | `classify_proposed_spec_folder` shim TSV output | Bash smoke call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `isPhaseParent` dual-impl (TS + shell) | Internal | Green | Classifier cannot detect phase parents reliably |
| Validator orchestrator + registry contract | Internal | Green | Rule cannot be wired into validate.sh |
| TS build (dist compilation for shell shim) | Internal | Green | Shell shim has no compiled classifier to call |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: False-positive HARD-BLOCK on a legitimate folder, or validate.sh regression.
- **Procedure**: Remove the `SEMANTIC_NAMING` registry entry + orchestrator push (rule goes dark); revert the new module files. No data migration involved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Classifier unit fixtures green
- [ ] Parity confirmed (orchestrator + shell paths)
- [ ] No HARD-BLOCK false positives across a sample of live folders

### Rollback Procedure
1. Remove `SEMANTIC_NAMING` from `validator-registry.json` and the orchestrator entries (rule stops firing).
2. Revert the new classifier module files and the shell shim.
3. Re-run `validate.sh --strict` on an unrelated packet to confirm baseline restored.
4. No stakeholder notification needed (internal tooling, WARN-only).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
