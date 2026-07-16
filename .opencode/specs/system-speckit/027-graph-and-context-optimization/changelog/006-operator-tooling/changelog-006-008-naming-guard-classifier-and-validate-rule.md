---
title: "Changelog: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule [006-operator-tooling/008-naming-guard-classifier-and-validate-rule]"
description: "Chronological changelog for the Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

This packet is opened, not implemented. The plan below describes the intended deliverable and its acceptance bar; this section will be rewritten with the active voice once the work lands.

### Added

- None.

### Changed

- Scoped the intended deliverable: a pure-TypeScript `classifyProposedSpecFolder()` classifier at `shared/spec-folder-naming.ts` and a `SEMANTIC_NAMING` WARN-severity validate.sh rule, wired into both the shell rule and the Node orchestrator.
- Defined the HARD-BLOCK scope as `EMBEDDED_SIBLING_PHASE_PARENT` only; the broad embedded-number heuristic is excluded because it mis-fires on legitimate shapes like `003-skill-advisor-render-103-alignment`.
- Specified that the rule reuses the existing `isPhaseParent` helper and phase-child regex (dual-impl pattern) rather than re-deriving detection logic.

### Fixed

- None.

### Verification

- validate.sh <packet> --strict on planning docs - PASS (planning docs strict-green at packet open)
- Classifier unit fixtures - PENDING (implementation not started)
- Orchestrator-vs-shell parity - PENDING (implementation not started)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/shared/spec-folder-naming.ts` | Created (planned) | Authoritative classifier |
| `.opencode/skills/system-spec-kit/scripts/spec/spec-folder-naming.ts` | Created (planned) | CLI wrapper emitting TSV/JSON |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/spec-folder-naming.ts` | Created (planned) | Runtime re-export for orchestrator |
| `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` | Modified (planned) | Add classify_proposed_spec_folder shim |
| `.opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh` | Created (planned) | Shell-side validation rule |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified (planned) | Register SEMANTIC_NAMING (warn) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified (planned) | Add validateSemanticNaming(folder) |

### Follow-Ups

- Implement the classifier and SEMANTIC_NAMING rule per plan.md build order, then rewrite this changelog with active-voice results.
- Wire the rule into both the Node orchestrator and shell fallback so `validate.sh` does not silently skip it.
- Companion fix required: `create.sh` placeholders at lines 588 and 1111 contain uppercase `PROVIDE-DESCRIPTIVE-SLUG` that would block a strict phase-child rule until lowercased.
- Detection is retroactive, not preventive: a mis-located folder still gets created and is only surfaced on the next validation pass.
