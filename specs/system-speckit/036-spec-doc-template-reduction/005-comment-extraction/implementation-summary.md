---
title: "Implementation Summary: Instructional Comment Extraction"
description: "Removed non-load-bearing instructional comments from in-scope manifest templates while preserving structural markers and reducing rendered snapshot bytes."
trigger_phrases:
  - "comment extraction"
  - "instructional comment leakage"
  - "template markers"
  - "rendered byte reduction"
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
| **Spec Folder** | 005-comment-extraction |
| **Completed** | Not stated in the reviewed evidence |
| **Authored** | 2026-08-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The in-scope manifest templates now omit instructional `SELF-CHECK`, `FAILURE MODES`, voice-guide, and footer comments that the renderer previously carried into scaffold output. Load-bearing `SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`, and structural anchor markers remain. The reviewed snapshot baseline records the resulting rendered-byte reduction.

### Measured reduction

The measured Level 1 `spec.md` example fell from approximately 4,280 bytes to approximately 2,490 bytes in the rendered baseline. This phase records the source and snapshot reduction without changing the inline-gate renderer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modified | Removes instructional comments while retaining level and source markers. |
| `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` | Modified | Removes instructional comments while retaining structural content. |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Modified | Removes instructional comments while retaining task and verification contracts. |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Modified | Removes instructional comments from the legacy checklist template. |
| `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl` | Modified | Removes non-load-bearing guidance comments from the decision-record template. |
| `.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` | Modified | Removes voice-guide and footer comments from the implementation-summary template. |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Rebaselines the reduced rendered output. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase classified instructional comments separately from structural markers, removed the targeted comments from the in-scope manifest templates, left the renderer unchanged, and reviewed the reduced snapshot output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve level and source markers | Detection and snapshot checks consume them, so they are part of the template contract. |
| Leave the renderer unchanged | Removing comments at the template source avoids expanding the render path. |
| Remove only instructional comments | Anchors and other structural markers carry validation and routing behavior. |
| Record the byte reduction from reviewed snapshots | The output baseline proves the rendered effect of the source cleanup. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted comment scan | PASS for the in-scope manifest templates, with the targeted instructional blocks removed. |
| Structural marker preservation | PASS, `SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`, and structural anchors remain. |
| Renderer scope | PASS, no inline-gate renderer change appears in the inspected diff. |
| Rendered byte measurement | PASS, the Level 1 spec example is approximately 4,280 bytes before and approximately 2,490 bytes after. |
| Golden snapshots | PASS, the reduced renders were rebaselined. |
| Guidance sidecars and guide link | NOT EVIDENCED in the inspected diff, so this summary makes no completion claim for that planned artifact. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sidecar guidance is not shown in the inspected diff.** No new guidance file or template-guide link appears in the scoped changes, so discoverability of the removed authoring instructions needs separate follow-up if required.
2. **Explicit byte-budget assertions are not shown in the inspected test diff.** This summary records the measured snapshot reduction and does not claim a new assertion until that change is evidenced.
<!-- /ANCHOR:limitations -->
