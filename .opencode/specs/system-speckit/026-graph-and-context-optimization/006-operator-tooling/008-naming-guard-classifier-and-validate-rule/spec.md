---
title: "Feature Specification: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule"
description: "Spec folders can be created in the wrong location with mis-numbered slugs (the 028-026-* shape) and nothing detects it; this packet scopes a shared classifier plus a path-independent validate.sh WARN rule."
trigger_phrases:
  - "naming guard classifier"
  - "classifyProposedSpecFolder"
  - "semantic naming rule"
  - "spec folder naming validate"
  - "embedded sibling phase parent"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Opened Level 2 packet scoping items 1+2 of the naming-guard research"
    next_safe_action: "Implement classifier module per plan.md build order"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/spec-folder-naming.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/shell-common.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "open-008-naming-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-06 |
| **Branch** | `008-naming-guard-classifier-and-validate-rule` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec folders can be created at the wrong location with a slug that embeds an existing sibling packet number (the `028-026-program-research` shape, where a track-root slug starts with an existing phase-parent's 3-digit number), and nothing in the toolchain detects this. The motivating defect was Write-created, not `create.sh`-created, so the only path-independent detection point is `validate.sh`. The prior broad embedded-number heuristic also false-positived on legitimate shapes like `003-skill-advisor-render-103-alignment` and `009-p2-032-cleanup`.

### Purpose
Ship a shared, near-zero-false-positive naming classifier plus a `validate.sh` WARN rule that flags every mis-located spec folder on the next validation, regardless of how the folder was created.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Item 1**: shared `classifyProposedSpecFolder(targetPath) -> {ok, severity, reason, suggestedLocation, ruleId}` module, TS-authoritative at `shared/spec-folder-naming.ts`, plus a shell shim `classify_proposed_spec_folder` in `scripts/lib/shell-common.sh`, reusing the existing `isPhaseParent` and phase-child regex dual-impl.
- **Item 1 rules (high-confidence only)**: `EMBEDDED_SIBLING_PHASE_PARENT` as HARD-BLOCK; strict phase-child syntax HARD-BLOCK for nested folders; `GENERIC_STANDALONE_SLUG` as WARN.
- **Item 2**: a new `validate.sh` `SEMANTIC_NAMING` rule (severity WARN), wired into BOTH the shell rule (`scripts/rules/check-semantic-naming.sh` + `scripts/lib/validator-registry.json`) AND the Node orchestrator (`mcp_server/lib/validation/orchestrator.ts`), because `validate.sh` runs the Node orchestrator before the shell fallback.

### Out of Scope
- Pre-commit gate integration (research item 3) - deferred; higher leverage but separate enforcement surface, can be added once items 1+2 prove stable.
- `create.sh` creation-time gate (research item 4) - deferred; 176:0 of real creations bypass `create.sh`, so it is an early-warning nicety not a guarantee. Companion fix it would need: lowercase the uppercase `PROVIDE-DESCRIPTIVE-SLUG` placeholders at `create.sh:588` and `create.sh:1111` so a strict phase-child rule would not block create.sh's own scaffolding.
- Per-runtime pre-write hooks (research item 5) - deferred (likely drop); not live in any runtime today, complexity disproportionate to a 1-in-750 defect.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/shared/spec-folder-naming.ts | Create | Authoritative pure-TS classifier `classifyProposedSpecFolder()`. |
| .opencode/skills/system-spec-kit/scripts/spec/spec-folder-naming.ts | Create | CLI wrapper compiled to dist; emits TSV/JSON for the shell shim. |
| .opencode/skills/system-spec-kit/mcp_server/lib/spec/spec-folder-naming.ts | Create | Runtime re-export for the validator orchestrator. |
| .opencode/skills/system-spec-kit/scripts/lib/shell-common.sh | Modify | Add `classify_proposed_spec_folder` shell shim mirroring existing helpers. |
| .opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh | Create | New `run_check` rule calling the shell shim. |
| .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json | Modify | Register `SEMANTIC_NAMING` (severity warn) after `FOLDER_NAMING`. |
| .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts | Modify | Add `validateSemanticNaming(folder)` and push it into the orchestrator entries. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared classifier returns `{ok, severity, reason, suggestedLocation, ruleId}` and flags the `028-026-*` shape as HARD-BLOCK via `EMBEDDED_SIBLING_PHASE_PARENT`. | Unit fixture for `028-026-program-research` next to a phase-parent `026-*` sibling returns `severity: HARD-BLOCK`, `ruleId: EMBEDDED_SIBLING_PHASE_PARENT`, and a `suggestedLocation` under the sibling. |
| REQ-002 | Classifier produces near-zero false positives on known-good shapes. | `003-skill-advisor-render-103-alignment` and `009-p2-032-cleanup` classify as `ok: true` (or WARN-only, never HARD-BLOCK). |
| REQ-003 | `SEMANTIC_NAMING` rule runs through BOTH the Node orchestrator and the shell fallback. | Orchestrator path emits the rule; disabling the orchestrator and running the shell fallback also emits the rule; neither path silently skips it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Nested/phase-child folders failing strict `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` syntax classify HARD-BLOCK. | A nested child with uppercase or underscore returns HARD-BLOCK with a normalized `suggestedLocation`. |
| REQ-005 | `SEMANTIC_NAMING` emits WARN (never error) for any non-OK classification, so existing folders are flagged not blocked. | Running validate against a folder with a known mis-location surfaces a WARN line; strict mode may still escalate per existing strict behavior. |
| REQ-006 | Classifier fails open on missing dist / malformed output / unavailable Node. | A simulated missing-dist or malformed-TSV case prints a warning and the rule proceeds (no validator crash). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `028-026-*` mis-location shape is detected deterministically on the next `validate.sh` run, regardless of creation path.
- **SC-002**: Zero false-positive HARD-BLOCK on the two known-good shapes from the research scan across the ~752 live numbered folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `isPhaseParent` dual-impl (TS + shell) must stay in agreement | Classifier mis-classifies phase parents if the two diverge | Reuse the existing exported regex/helper; do not re-implement detection. |
| Risk | Over-broad embedded-number heuristic re-introduces false positives | High (erodes trust, blocks valid folders) | Restrict HARD-BLOCK to the tight `EMBEDDED_SIBLING_PHASE_PARENT` rule; everything subjective is WARN. |
| Risk | Shell-only rule silently skipped because validate.sh prefers the Node orchestrator | Medium (rule appears wired but never runs) | Wire the rule into BOTH the orchestrator and the shell fallback; add a parity check in tasks. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Classifier adds negligible overhead to a validate run (single sibling-directory scan per folder, no recursive crawl).

### Security
- **NFR-S01**: Classifier operates on path strings and directory listings only; no shell interpolation of folder names into commands.

### Reliability
- **NFR-R01**: Fail-open behavior - any classifier error degrades to a warning and validation proceeds; classifier issues never crash `validate.sh`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Embedded number matching a non-phase-parent sibling: WARN, not HARD-BLOCK (related-packet naming may be intentional).
- Embedded number matching zero or >1 sibling: no match, classify OK (ambiguous, do not guess).
- Generic standalone slug (`fix`, `cleanup`, `phase-2`): WARN only.

### Error Scenarios
- Missing compiled dist artifact: print warning, proceed (fail open).
- Malformed TSV from the CLI wrapper: print warning, proceed.
- Node unavailable: print warning, proceed.

### State Transitions
- Existing folders flagged retroactively: `SEMANTIC_NAMING` is catch-later WARN, so already-shipped folders are surfaced without breaking their validation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~7 files, new module + 1 rule + 2 wiring points |
| Risk | 8/25 | No breaking changes; WARN-only rule; fail-open |
| Research | 5/20 | Research already complete (007 packet) |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Ruleset, severities, and integration points are settled by the 007 research recommendations and iteration 2 implementation design.
<!-- /ANCHOR:questions -->
