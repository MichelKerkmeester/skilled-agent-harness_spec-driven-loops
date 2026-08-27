---
title: "Implementation Summary: Lazy On-Demand Add-On Documents"
description: "Recorded the implementation of level-agnostic lazy add-on templates, manifest routing, opt-in scaffolding, validator acceptance, and compatibility verification."
trigger_phrases:
  - "lazy add-on implementation"
  - "before-after template"
  - "timeline template"
  - "roadmap template"
  - "decision record opt-in"
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
| **Spec Folder** | 007-lazy-addon-docs |
| **Completed** | 2026-08-27 |
| **Authored** | 2026-08-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 007 added three lean, level-agnostic lazy add-on templates: `before-after.md`, `timeline.md`, and `roadmap.md`. Each template defines stable anchors for its metadata and document-specific content. The existing `decision-record.md` now uses the same on-demand contract.

The manifest registers all four documents in `lazyAddonDocs` for every numbered level. It removes `decision-record.md` from the Level 3 and Level 3+ required-document contract. `create.sh` now accepts `--with-lazy-addons` to scaffold the four documents on request and leaves them absent by default. The validator accepts registered lazy documents when present, checks the static anchors for the three new templates, and no longer requires a decision record at Level 3 or Level 3+.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/addons/before-after.md.tmpl` | Created | Level-agnostic before-and-after record with metadata, summary, comparison, net-effect, and notes/caveats anchors |
| `.opencode/skills/system-spec-kit/templates/addons/timeline.md.tmpl` | Created | Level-agnostic chronological record with metadata, timeline, and milestones anchors |
| `.opencode/skills/system-spec-kit/templates/addons/roadmap.md.tmpl` | Created | Level-agnostic forward plan with metadata, now-next-later, milestones-targets, and dependencies anchors |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Modified | Registers the three templates and classifies all four documents as explicit, silent-skip lazy add-ons at every level |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | Adds `--with-lazy-addons` and keeps the default scaffold free of these four add-ons |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modified | Removes the decision-record level requirement from the documented contract and preserves level detection for the merged tasks verification sections |
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` | Modified | Treats lazy documents as valid when present and enforces the registered static anchors for the three new templates |
| `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` | Modified | Asserts required, optional, and lazy document classification across Levels 1, 2, 3, and 3+ |
| `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` | Modified | Covers lazy template anchors, default scaffolding, explicit opt-in scaffolding, and the optional checklist contract |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Rebaselines the rendered lazy add-on templates and removes obsolete required decision-record snapshots |
| `AGENTS.md` | Modified | Updates the level-document table present in this checkout to distinguish required, optional, and lazy add-ons |
| `.opencode/skills/system-spec-kit/mcp-server/dist/` | Rebuilt | Refreshes generated MCP server output after the validator change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three templates were authored against the existing anchor conventions, registered as lazy add-ons at every level in the manifest, and wired into the generator behind an explicit opt-in flag. The decision record moved into the same lazy class while the validators kept accepting it wherever it already exists. Verification covered a fresh scaffold at each level, an opt-in scaffold carrying all four on-demand documents, the golden snapshots, and a shipped packet that still carries a decision record.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the three new templates level agnostic | The manifest assigns the same document-specific anchor contract across Levels 1, 2, 3, and 3+. |
| Make lazy add-ons explicit | `create.sh` must not add unsolicited history, planning, or decision documents to a new packet. |
| Move `decision-record.md` to the lazy contract | Authors can record decisions at any level, while Level 3 and Level 3+ packets no longer fail because the file is absent. |
| Preserve existing decision records | The validator accepts an existing Level 3 decision record, so the contract change does not require migration or rewriting. |
| Keep the manifest as the contract source | The resolver tests, scaffold behavior, validator checks, and golden snapshots all consume or assert the same registered document classification. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Fresh Level 3 packet without `decision-record.md` | PASS | `FILE_EXISTS` passed; the packet validates without the decision record. |
| Existing Level 3 packet with `decision-record.md` | PASS | Validation result was `PASSED`, confirming backward compatibility. |
| Explicit lazy scaffolding | PASS | `--with-lazy-addons` created `before-after.md`, `timeline.md`, `roadmap.md`, and `decision-record.md`; `ANCHORS_VALID` passed. |
| TypeScript compilation | PASS | `tsc` exited with status 0. |
| MCP server distribution build | PASS | The dist build exited with status 0. |
| Golden snapshot suite | PASS | All 9 snapshots passed after rebaselining. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The opt-in covers four documents only.** `--with-lazy-addons` scaffolds the three new templates and `decision-record.md`; existing workflow add-ons such as `handover.md`, `debug-delegation.md`, and `research/research.md` remain separately governed.
2. **The documentation path differs from the implementation brief.** No `CLAUDE.md` file appears in the read-only file inventory for this checkout. The corresponding level-document table change is present in `AGENTS.md`.
<!-- /ANCHOR:limitations -->
