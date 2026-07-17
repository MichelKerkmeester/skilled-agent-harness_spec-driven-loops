---
title: "Implementation Summary: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule"
description: "Planned packet. Scopes a shared spec-folder naming classifier and a path-independent validate.sh WARN rule that flags mis-located folders regardless of how they were created."
trigger_phrases:
  - "naming guard summary"
  - "classifier intended approach"
  - "semantic naming rule summary"
  - "spec folder naming acceptance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored intended-approach doc for opened packet"
    next_safe_action: "Implement per plan.md build order then update this doc"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-naming-guard-classifier-and-validate-rule |
| **Completed** | planned (not yet implemented) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is opened, not implemented. The plan below describes the intended deliverable and its acceptance bar; this section will be rewritten with the active voice once the work lands.

The intended outcome: a spec folder created in the wrong place with a mis-numbered slug (the `028-026-program-research` shape) gets flagged automatically on the next `validate.sh` run, regardless of whether it was created via Write, mkdir, or create.sh. Today nothing detects this, and the only path-independent detection point is the validator itself.

### Intended Feature: Shared naming classifier (item 1)

A pure-TypeScript `classifyProposedSpecFolder(targetPath)` returning `{ok, severity, reason, suggestedLocation, ruleId}`, authored at `shared/spec-folder-naming.ts`, with a compiled CLI wrapper and a `classify_proposed_spec_folder` shell shim in `scripts/lib/shell-common.sh`. It reuses the existing `isPhaseParent` helper and phase-child regex (the established dual-impl pattern) rather than re-implementing detection. Only high-confidence rules ship: `EMBEDDED_SIBLING_PHASE_PARENT` (HARD-BLOCK), strict phase-child syntax (HARD-BLOCK for nested folders), and `GENERIC_STANDALONE_SLUG` (WARN). The broad embedded-number heuristic is deliberately excluded because it mis-fired on `003-skill-advisor-render-103-alignment` and `009-p2-032-cleanup`.

### Intended Feature: SEMANTIC_NAMING validate.sh rule (item 2)

A new WARN-severity `SEMANTIC_NAMING` rule wired into BOTH the shell rule (`scripts/rules/check-semantic-naming.sh` + `scripts/lib/validator-registry.json`) AND the Node orchestrator (`mcp_server/lib/validation/orchestrator.ts`). Both wirings are required because `validate.sh` runs the Node orchestrator before the shell fallback, so a shell-only rule would be silently skipped. The rule runs the classifier against existing folders and surfaces non-OK classifications as warnings, so already-shipped folders are flagged retroactively without breaking their validation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/shared/spec-folder-naming.ts | Created (planned) | Authoritative classifier |
| .opencode/skills/system-spec-kit/scripts/spec/spec-folder-naming.ts | Created (planned) | CLI wrapper emitting TSV/JSON |
| .opencode/skills/system-spec-kit/mcp_server/lib/spec/spec-folder-naming.ts | Created (planned) | Runtime re-export for orchestrator |
| .opencode/skills/system-spec-kit/scripts/lib/shell-common.sh | Modified (planned) | Add `classify_proposed_spec_folder` shim |
| .opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh | Created (planned) | Shell-side validation rule |
| .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json | Modified (planned) | Register `SEMANTIC_NAMING` (warn) |
| .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts | Modified (planned) | Add `validateSemanticNaming(folder)` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery is planned, not done. The intended verification approach: classifier unit fixtures cover the `028-026-*` HARD case plus the two known-good shapes that must stay OK, and a nested strict-fail child. A parity check confirms the rule fires on both validate paths (orchestrator and shell fallback). The packet closes only when `validate.sh <packet> --strict` is green and the five spec docs are synchronized. Source for the design: the 007 packet research recommendations and iteration 2 implementation design.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship only items 1+2; defer items 3/4/5 | The defect is ~1-in-750, so the guard must be proportionate. Items 1+2 are the smallest slice that deterministically detects the defect on the next validate. |
| Restrict HARD-BLOCK to `EMBEDDED_SIBLING_PHASE_PARENT` | The broad heuristic mis-fired on legitimate shapes; keeping false positives near zero protects operator trust. |
| Wire the rule into both orchestrator and shell fallback | `validate.sh` runs the Node orchestrator first, so a shell-only rule would be silently skipped. |
| Make `SEMANTIC_NAMING` WARN, not error | This is catch-later detection, not creation-time enforcement; flagging existing folders must not break their validation. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh <packet> --strict` on planning docs | PASS (planning docs strict-green at packet open) |
| Classifier unit fixtures | PENDING (implementation not started) |
| Orchestrator-vs-shell parity | PENDING (implementation not started) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope is intentionally narrow.** Pre-commit gate (item 3), create.sh gate (item 4), and per-runtime pre-write hooks (item 5) are deferred. The shipped slice detects mis-located folders on the next validate but does not block them at creation time.
2. **Companion fix required before item 4 could ship.** The create.sh placeholders at `create.sh:588` and `create.sh:1111` contain uppercase `PROVIDE-DESCRIPTIVE-SLUG`; a strict phase-child rule would correctly block create.sh's own scaffolding until those are lowercased. This is documented but out of scope here.
3. **Detection is retroactive, not preventive.** A mis-located folder still gets created; the rule surfaces it on the next validation pass.
<!-- /ANCHOR:limitations -->
