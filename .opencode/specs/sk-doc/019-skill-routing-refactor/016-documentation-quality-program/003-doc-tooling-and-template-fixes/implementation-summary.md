---
title: "Implementation Summary: Doc-Tooling and Template Fixes"
description: "Fixed the validate_document.py symlink path resolution at its four load sites so the documented top-level command runs, and added two clarifications to the skill-readme-template: the concrete-analogy voice device and a caveat that the validator is only a floor."
trigger_phrases:
  - "validate_document path fix summary"
  - "skill readme template clarifications"
  - "validator symlink resolve"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/003-doc-tooling-and-template-fixes"
    last_updated_at: "2026-07-22T12:50:05Z"
    last_updated_by: "claude"
    recent_action: "Shipped and verified the path fix and template clarifications."
    next_safe_action: "Proceed to phase 004 (skill/mode README overhaul)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/create-skill/assets/skill/skill-readme-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-021-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-doc-tooling-and-template-fixes |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The documented validator command was broken and the README template was missing two cheap clarifications the audit called for. This phase fixed both.

### The validator path

`sk-doc/scripts/validate_document.py` is a symlink to the real `sk-doc/shared/scripts/validate_document.py`. The script computed the `template-rules.json` path from `Path(__file__).parent` without resolving the symlink, so invoking the documented top-level path looked in the nonexistent `sk-doc/assets/` and errored before validating. Four load sites (lines 188, 665, 1001, 1086) now use `Path(__file__).resolve().parent`, so the rules file resolves to `shared/assets/template-rules.json` from either invocation path. The two `sys.path` sites already resolved, and the replacement did not touch them.

### The template clarifications

`skill-readme-template.md` gained a WRITING RULES bullet naming the concrete-analogy voice device the repo root README relies on, and a VALIDATION CHECKLIST caveat stating the validator is a floor that only checks for a numbered ALL-CAPS `overview` section, not the full checklist. The version moved to 1.8.0.6.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `validate_document.py` | Modified | `.resolve()` at the four rules-path load sites |
| `skill-readme-template.md` | Modified | Analogy note, floor caveat, version bump |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The symlink error was reproduced first, then the four load sites were fixed with a single scoped replacement that could not touch the two already-resolved sites. The symlink invocation then reported VALID for a conformant README, the real-path invocation stayed VALID, `py_compile` passed, and a grep confirmed no double-resolve. The template edits are additive and HVR-clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve `__file__` rather than hardcode the rules path | `.resolve()` fixes every load site at once and stays correct for any future symlink or copy |
| Defer the `audit_readmes.py` documentation to phase 005 | Its natural home is a code README for `create-readme/scripts`, which that phase authors anyway |
| Keep the template edits to two bullets | The audit found the template sound; only the analogy device and the validator caveat were missing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Symlink invocation | VALID (was `template_rules.json not found`) |
| Real-path invocation | VALID (no regression) |
| `py_compile` | PASS |
| Double-resolve grep | None |
| Template clarifications + version | Present, `1.8.0.6` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The validator still enforces only a subset of the README checklist.** The floor caveat now documents this, but the blocking gate itself is unchanged. Widening `template-rules.json` `readme` `requiredSections` to gate the full nine-section model is deferred to the phase 008 optional-extension decision.
2. **`audit_readmes.py` remains undocumented until phase 005.** This phase confirmed it exists and reserved its documentation for the `create-readme/scripts` code README.
<!-- /ANCHOR:limitations -->
