---
title: "Implementation Summary: Single-Source Continuity"
description: "Made implementation-summary.md the canonical continuity document and removed redundant continuity emission from the four non-canonical templates."
trigger_phrases:
  - "continuity single source"
  - "canonical implementation-summary"
  - "FRONTMATTER_MEMORY_BLOCK"
  - "SESSION_LINEAGE"
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
| **Spec Folder** | 004-continuity-single-source |
| **Completed** | Not stated in the reviewed evidence |
| **Authored** | 2026-08-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Continuity now has one canonical document: `implementation-summary.md`. The validator accepts missing continuity in `spec.md`, `plan.md`, `tasks.md`, and legacy `checklist.md`, while the canonical summary remains required. The four non-canonical manifest templates no longer emit `_memory.continuity`, and the implementation-summary template retains it.

### Validator-first consolidation

The continuity validator and session-lineage scan were updated before the template emissions were removed. The runtime save path was already single-source, so the resume ladder, status derivation, and freshness path remain unchanged. Legacy five-copy packets remain valid under the relaxed expectations.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` | Modified | Makes continuity optional in non-canonical contract documents while preserving the canonical requirement. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts` | Modified | Limits session-lineage continuity inspection to the canonical summary and preserves legacy document handling. |
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modified | Removes redundant continuity emission. |
| `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` | Modified | Removes redundant continuity emission. |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Modified | Removes redundant continuity emission. |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Modified | Removes redundant continuity emission from the legacy template. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase relaxed the validator contract first, checked the canonical save and consumer paths, removed the four non-canonical template blocks, and rebaselined the generated snapshots while retaining compatibility for legacy five-copy packets.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `implementation-summary.md` canonical | The resume ladder, status derivation, and freshness gate already read that document. |
| Relax validators before editing templates | Existing packets still contain five continuity copies and must continue to validate. |
| Leave runtime arbitration unchanged | The save and consumer paths already use the canonical source, so template cleanup did not require runtime behavior changes. |
| Keep legacy copies readable | Compatibility matters while shipped packets retain their original frontmatter shape. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canonical continuity validation | PASS, `implementation-summary.md` remains the required continuity host. |
| Optional continuity validation | PASS, `spec.md`, `plan.md`, `tasks.md`, and legacy `checklist.md` may omit the block. |
| Legacy five-copy packet | PASS, the old packet shape remains valid after the validator relaxation. |
| Runtime consumers | PASS, the resume ladder, status derivation, and freshness path remain keyed to implementation-summary. |
| Golden snapshots | PASS, the continuity consolidation output was rebaselined. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Legacy packets can still contain duplicate continuity blocks.** The validators accept them for compatibility, but new scaffolds emit continuity only in implementation-summary.md.
<!-- /ANCHOR:limitations -->
