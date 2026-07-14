---
title: "Implementation Plan: command-template conformance across all seven OpenCode command families"
description: "Source-first conformance of create/design/doctor/memory/speckit/prompt-improve/goal_opencode command docs to the sk-doc create-command canon — uniform six numbered H2 router sections, dispatch-class-correct assets, behavior-preserving. Verification uses validate_document.py --type command per file plus a reference-set behavior diff."
trigger_phrases:
  - "command template conformance plan"
  - "create-command router vocabulary plan"
  - "doctor unnumbered header fix plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/001-command-template-conformance"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Documented the source-first conformance plan matching shipped work"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/mcp.md"
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/update.md"
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/commands/create/"
      - ".opencode/commands/memory/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct-dispatch families use the presentation-only OWNED ASSETS variant, no workflow YAML."
      - "Behavior preservation is proven by a reference-set diff, not just visual review."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: command-template conformance across all seven OpenCode command families

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode command docs (Markdown) plus workflow YAML / presentation `.txt` / `_routes.yaml` assets |
| **Framework** | sk-doc `create-command` canon; `validate_document.py --type command` gate |
| **Storage** | Checked-in command docs under `.opencode/commands/**` |
| **Testing** | `validate_document.py --type command` per file; per-file reference-set behavior diff (HEAD vs conformed) |

### Overview
Apply a source-first conformance sweep: bring every command family to the uniform six numbered H2 router sections (`## 1. ROUTER CONTRACT / ## 2. OWNED ASSETS / ## 3. MODE ROUTING / ## 4. EXECUTION TARGETS / ## 5. PRESENTATION BOUNDARY / ## 6. WORKFLOW SUMMARY`). Section STRUCTURE is uniform; ASSETS follow dispatch class. Workflow-YAML families (`create`, `design`, `speckit`) keep their `_auto`/`_confirm`/`_presentation` triads. Direct-dispatch families (`memory`, `doctor`) use the direct-dispatch canon variant: presentation-only OWNED ASSETS plus an EXECUTION TARGETS section pointing at the script/tool/route manifest (doctor keeps `_routes.yaml`). All edits are behavior-preserving — no dispatch target, mode, or flag contract changes.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| Deep-alignment audit (000-foundations) | Surfaced 20 P1 `missing_recommended_router_section` findings across the five workflow-YAML families. |
| `validate_document.py --type command` on `doctor/{mcp,speckit,update}.md` | FAILED (exit 1): unnumbered headers → zero sections detected, two blocking errors each. |
| `validate_document.py --type command` on `prompt-improve.md` | FAILED (exit 1): missing a required leaf section. |
| Dispatch-class adjudication (Fable) | Direct-dispatch families (`memory`, `doctor`) get presentation-only OWNED ASSETS + EXECUTION TARGETS; no `_auto`/`_confirm` YAML authored. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Canon target defined: the six numbered H2 router sections and the two dispatch-class asset variants.
- [x] Dependencies identified: 000-foundations deep-alignment findings; `shared/scripts/validate_document.py` per-file gate.

### Definition of Done
- [x] `doctor/{mcp,speckit,update}.md` and `prompt-improve.md` move INVALID → VALID (exit 1 → 0).
- [x] Every in-scope command doc exits 0 on `validate_document.py --type command` (0 blocking, 0 warnings).
- [x] Behavior preserved — per-file reference-set diff shows zero dispatch-target / asset-path / `$ARGUMENTS` losses.
- [x] `create/*` and `memory/*` use canon vocabulary (no banned synonyms); `memory/save.md` gap mis-framing corrected.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first, behavior-preserving doc conformance with a two-variant asset model keyed on dispatch class.

### Key Components
- **Router-core sections**: the uniform six numbered H2 sections the validator keys on.
- **Workflow-YAML families** (`create`, `design`, `speckit`): OWNED ASSETS names the `_auto`/`_confirm`/`_presentation` triad; the dispatch model is unchanged.
- **Direct-dispatch families** (`memory`, `doctor`): OWNED ASSETS is presentation-only; EXECUTION TARGETS points at scripts/tools/route manifest (doctor keeps `_routes.yaml`).
- **Validator gate**: `.opencode/skills/sk-doc/shared/scripts/validate_document.py --type command`, which detects numbered `## N.` headers and the router-core.

### Data Flow
Each command doc declares its router contract, owned assets, mode routing, execution targets, presentation boundary, and workflow summary. The validator parses numbered headers and the router-core to accept/reject the doc. Conformance renames/renumbers sections into the canonical slots and folds non-canon sections (`HARD RULES`, `RELATED COMMANDS`, `WHEN TO USE`, `PRECONDITIONS`, `REGISTER`) into canon slots — without touching the dispatch prose that determines runtime behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 Remediation (INVALID → VALID)
- [x] Conform `doctor/{mcp,speckit,update}.md`: unnumbered → numbered six-section router-core; keep subsystem-dispatch model and `_routes.yaml`.
- [x] Conform `prompt-improve.md`: add the missing required leaf section; numbered H2s.
- [x] Confirm each of the four moves from exit 1 to exit 0 on `validate_document.py --type command`.

### Phase 2: Canon Vocabulary Sweep (VALID-with-drift → clean)
- [x] Rename `create/*` (10) Title-case sections to the canonical six-section vocabulary.
- [x] Replace `memory/*` (4) banned-synonym headers with canon; fix `save.md` "Missing upstream asset" mis-framing to a plain direct-dispatch statement; fold extras.
- [x] Fold inserted sections / renumber `design/*` and `speckit/*` where recommended-section warnings remained; conform `goal_opencode.md` vocabulary (confirmed already conformant, unchanged).

### Phase 3: Verification
- [x] Run `validate_document.py --type command` per in-scope file → 0 blocking / 0 warnings.
- [x] Run the per-file reference-set behavior diff (HEAD vs conformed) → zero losses.
- [x] Confirm report anchors present per file.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Per-file validation | Every in-scope command doc | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type command` (expect exit 0, 0 blocking, 0 warnings) |
| Behavior preservation | Every modified file | Reference-set diff: every dispatch target, asset path, and `$ARGUMENTS` token in the pre-conformance HEAD file vs the conformed file (expect zero losses) |
| P0 regression check | doctor family + prompt-improve | Confirm exit 1 → exit 0 transition |
| Spec validation | This packet child | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` (orchestrator-run) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 000-foundations deep-alignment findings | Upstream child | Available | Checklist rows would lack authoritative finding provenance. |
| `validate_document.py --type command` | Local tool (`sk-doc/shared/scripts`) | Available | Per-file gate cannot run; conformance unverifiable. |
| Dispatch-class adjudication (Fable) | Decision input | Resolved | Direct-dispatch asset shape would be ambiguous. |
| `git` HEAD (pre-conformance) | Baseline | Available | Behavior diff has no baseline to compare against. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A conformed command doc regresses dispatch behavior, or a validator change reclassifies a conformed doc as INVALID.
- **Procedure**: Revert the two conformance commits (`52d17a8075`, then `95b5a60240`) from git, restoring the pre-conformance headers. Re-run `validate_document.py --type command` to confirm the prior state, then re-plan. No runtime state, data, or deployed service is involved — this is a source-only revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (P0 remediation) -> Phase 2 (Canon vocabulary sweep) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 remediation | 000-foundations findings | Canon vocabulary sweep |
| Canon vocabulary sweep | P0 remediation | Verification |
| Verification | Canon vocabulary sweep | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| P0 Remediation | Medium | 1-2 hours |
| Canon Vocabulary Sweep | Medium | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration required.
- [x] Git diff reviewed to ensure only command docs (and doctor `_routes.yaml` reference) changed.
- [x] Reference-set diff confirms behavior parity before completion is claimed.

### Rollback Procedure
1. Revert `52d17a8075` (create/design/memory/speckit/prompt-improve, 23 files).
2. Revert `95b5a60240` (doctor family P0).
3. Re-run `validate_document.py --type command` across the affected files to confirm the pre-conformance contract.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Source-only git revert of the two conformance commits.
<!-- /ANCHOR:enhanced-rollback -->
