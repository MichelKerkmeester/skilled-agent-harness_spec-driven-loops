---
title: "Implementation Summary: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance"
description: "What shipped: contract-derived level addenda replacing deleted fragments, and a vocabulary scan that exempts real identifiers while the prose drops reserved words."
trigger_phrases:
  - "restore level upgrade"
  - "upgrade-level fragments"
  - "vocabulary invariance"
  - "template addendum derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored the level-upgrade path and cleared the vocabulary invariance"
    next_safe_action: "None; both defects are fixed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-003-restore-level-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-restore-level-upgrade-and-vocabulary-invariance |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The documented way to raise a packet's level was inoperable. `upgrade-level.sh` looked for per-level fragment files under a directory the template restructure had deleted, so every Level 1 to Level 2 upgrade failed on the missing file and rolled itself back. The fragments are not restored here: the gated templates already encode what each level adds, so the addendum is now derived from them and cannot drift from what the scaffolder emits.

### Contract-derived level addenda

Rendering one gated template at two levels and taking what the higher level adds reproduces the deleted fragment exactly. Because a level bump also renumbers headings, a raw diff would re-inject sections the document already has, so sections are matched on their text with the leading number stripped and the ones already present are dropped. An upgrade to Level 2 now also creates the document the closure gate requires, which it previously would not have.

The second fix separates two things the vocabulary invariance had conflated. Real artifact names — a hub's compiled activation manifest, the literal `missing-manifest` status code, the `SPECKIT_CHILD_MANIFEST_FILE` environment variable — are exempted by the token they match, following the pattern the test file already used. Four lines that merely used a reserved word as ordinary English were reworded instead, because exempting those would have widened the scanner's blind spot for no gain.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/spec/upgrade-level.sh` | Modified | Derives level addenda from gated templates; creates the closure document at Level 2 |
| `scripts/tests/workflow-invariance.vitest.ts` | Modified | Exempts genuine identifiers by token |
| `feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md` | Modified | Heading reworded |
| `feature-catalog/tooling-and-scripts/derived-packet-repair.md` | Modified | Prose reworded |
| `manual-testing-playbook/tooling-and-scripts/canonical-first-spec-root-resolution.md` | Modified | Two lines reworded |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failing upgrade was captured first as a negative control, then a throwaway Level 1 packet was driven through Level 2, Level 3 and Level 3+ in sequence, each step checked for a zero exit and the result scanned for duplicated headings. The vocabulary invariance was re-run in full, including its sentinel test, to confirm the allowlist narrowed the scan rather than disabling it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive addenda from the gated templates rather than restoring fragment files | Two sources for the same content drift; the templates are already the scaffolder's source of truth |
| Filter sections the document already carries | A level bump renumbers headings, so a raw diff would duplicate existing sections |
| Exempt real identifiers by token, reword loose English | Exempting ordinary prose would widen the scanner's blind spot without making any document more accurate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control | PASS - the upgrade failed on the missing fragment before the fix |
| Upgrade chain L1 to L3+ | PASS - each step exits 0 |
| Duplicate heading scan | PASS - none in spec, plan or checklist |
| Closure document on upgrade | PASS - checklist.md and acceptance-criteria.md both created |
| `workflow-invariance` | PASS - 2/2, sentinel test still reports a planted leak |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The derived addendum is a line diff, not a semantic merge.** It reproduces the deleted fragments faithfully for the current templates, but a future template that reorders sections between levels rather than adding them would need the filter revisited.
<!-- /ANCHOR:limitations -->

---


