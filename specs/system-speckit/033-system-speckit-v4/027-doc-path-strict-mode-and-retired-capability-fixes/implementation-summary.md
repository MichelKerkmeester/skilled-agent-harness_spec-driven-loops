---
title: "Implementation Summary: Doc path, strict-mode and retired-capability fixes"
description: "Readers of the spec-kit docs now get the runtime's real behavior: `--strict` selects rules and never turns a warning into a failure, moved scripts are cited at their runtime/cli paths, four phantom rule scripts are gone from five documents, and the retired vector search, decay and re-index steps no longer appear as live.."
trigger_phrases:
  - "doc mismatch fixes shipped"
  - "strict mode doc corrected"
  - "phantom rule scripts removed from docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/027-doc-path-strict-mode-and-retired-capability-fixes"
    last_updated_at: "2026-09-06T10:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with its verification evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:77e877943519053839b040662839bcd7291cc043f7ee416a3e8681b5b99031be"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-doc-path-strict-mode-and-retired-capability-fixes |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Readers of the spec-kit docs now get the runtime's real behavior: `--strict` selects rules and never turns a warning into a failure, moved scripts are cited at their runtime/cli paths, four phantom rule scripts are gone from five documents, and the retired vector search, decay and re-index steps no longer appear as live.

### Fourteen fixes at their cited lines

Each confirmed row was replaced by an asserted exact-text edit, so a stale anchor would have stopped the run instead of silently skipping. A same-class sweep then caught three more sites the lane had not cited: the README and the compliance contract listed the same phantom rules, and the smart-router reference repeated the duplicated cli sibling.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| references/validation/validation-rules.md | Modified | Severity table, strict sentence, completion-freshness note and flag rows |
| runtime/cli/spec/validate.sh | Modified | Help line for --strict |
| README.md | Modified | continuity/ instead of memory/, no constitutional/, real counts, real rule list |
| references/structure/phase-definitions.md | Modified | validate.sh path and rule list |
| references/templates/level-selection-guide.md | Modified | Phantom section-counts rule removed |
| references/workflows/execution-methods.md | Modified | Vector re-index steps removed |
| references/cli/memory-handback.md, references/cli/shared-smart-router.md | Modified | Six cli siblings |
| references/config/environment-variables.md | Modified | MEMORY_BASE_PATH is inert |
| references/validation/template-compliance-contract.md | Modified | Real rule list |
| feature-catalog (5 files) | Modified | Description discovery, doctor routes, config contract, rule engine, template composition |
| manual-testing-playbook (3 files) | Modified | Build path, recorded suite output, doctor snapshot wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One Python pass with an assertion per row, a ripgrep sweep for every retired name across the three doc trees, the sk-doc validator over each touched file, and a trigger-index regeneration with zero malformed documents. Committed as fc71f4d121.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite the recorded suite output to FILE_EXISTS | The playbook showed output of a rule that no longer exists; the extended suite still runs the check-files rule with three level cases |
| Keep the config-contract table but drop retired rows | config.jsonc no longer carries semanticSearch, memoryIndex, memoryDecay, hybridSearch or checkpoints |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residue sweep | ripgrep for the retired names across references, feature-catalog, playbook and README: 0 hits |
| Doc validator | `validate_document.py --blocking-only` on 18 touched files: 0 blocking issues |
| Trigger index | Regenerated, malformedDocuments 0 |
| Strict validation | `validate.sh <child> --strict` printed RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded outputs** Playbook blocks that quote tool output describe today's suite; a later suite change will need the same sweep
<!-- /ANCHOR:limitations -->

---
