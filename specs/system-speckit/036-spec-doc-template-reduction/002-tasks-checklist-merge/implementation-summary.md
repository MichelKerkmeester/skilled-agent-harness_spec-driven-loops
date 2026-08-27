---
title: "Implementation Summary: Unified Tasks and Verification Document"
description: "Merged tasks and verification content into one level-gated document while preserving legacy checklist reads and status compatibility."
trigger_phrases:
  - "tasks checklist merge"
  - "unified verification document"
  - "legacy checklist read path"
  - "status compatibility"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-tasks-checklist-merge |
| **Completed** | Not stated in the reviewed evidence |
| **Authored** | 2026-08-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

New packets now use one `tasks.md` document for task tracking, verification, and testing. The template gates verification and testing at L2 and above, while the manifest makes standalone `checklist.md` optional. The reader surfaces prefer the merged sections and retain legacy checklist support so existing packets keep their status and validation behavior.

### Contract migration

The change updated the unified template, manifest, scaffold and validation level detection, status derivation, priority-tag checks, acceptance-coverage bindings, anchor validation, and template-structure comparison. The golden snapshot baseline was reworked for the merged document, while legacy checklist files remain readable during rollout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Modified | Carries Tasks plus L2+ Verification Checklist and Testing Checklist sections. |
| `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` | Modified | Makes `checklist.md` optional and gates merged verification anchors on L2+. |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | Scaffolds the unified tasks document for new packets. |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modified | Detects the merged tasks document while accepting legacy checklist packets. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts` | Modified | Derives status from merged verification content and retains legacy checklist reads. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts` | Modified | Resolves merged verification, priority tags, legacy documents, and continuity-aware validation. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` | Modified | Includes legacy checklist documents in structural validation. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh` | Modified | Prefers merged verification traceability and falls back to standalone checklists. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh` | Modified | Loads the shared phase-parent helper and validates the merged anchor contract. |
| `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` | Modified | Compares merged and legacy task structures with optional verification rules. |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Rebaselines the merged task renders. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase moved the verification and testing sections into the level-gated tasks template, updated each named producer and reader, rebuilt the runtime distributions, and rebaselined the generated snapshots. Fresh L2 scaffolding and a legacy L2 packet then exercised the new and compatibility paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `checklist.md` optional rather than remove legacy reads | Existing L2+ packets still depend on their standalone checklist for status and validation. |
| Gate verification and testing sections at L2+ | L1 keeps its original task-only shape while higher levels retain their verification contract. |
| Prefer merged verification and fall back to legacy checklist content | New packets use one source while shipped packets remain compatible. |
| Repair the anchor helper path and compare behavior together | The prior blocker came from disagreement between the two structural checks. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fresh L2 scaffold | PASS, it contains a unified `tasks.md` and no `checklist.md`. |
| Legacy L2 packet validation | PASS, a standalone `checklist.md` remains accepted. |
| Legacy L2 status derivation | PASS, the derived status matches the pre-merge result. |
| Golden snapshots | PASS, the merged output was rebaselined and the suite is green. |
| `check-anchors` and template-structure comparison | PASS, both checks agree after the prior blocker was resolved. |
| Runtime distributions | PASS, both distribution trees were rebuilt before compatibility checks. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Legacy checklist files remain supported.** New scaffolds no longer create them, but shipped packets continue to require the compatibility read path until they are migrated or retired.
<!-- /ANCHOR:limitations -->
