---
title: "Implementation Summary: Goal docs hygiene + cross-runtime contracts"
description: "Completion record for packet 032's docs closeout: fixed 10 stale rename-fallout references, repaired the goal command-path test, and documented the cross-runtime goal hooks across injection-contract.md, goal-plugin.md, the runtime-routing constitutional rule, and the goal concern README."
trigger_phrases:
  - "goal docs hygiene summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-29T07:06:08Z"
    last_updated_by: "claude"
    recent_action: "Phase 008 complete: refs fixed, docs updated, test repaired"
    next_safe_action: "Commit phase 008; final packet --recursive validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal-plugin.md"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
      - "goal-plugin.md hosts the cross-runtime section; no separate sibling doc was created."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-goal-docs-hygiene |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The docs closeout for the cross-runtime goal-hooks packet: the goal command moved into a `commands/goal/` subfolder (invoked `/goal:goal-opencode`), leaving stale references behind, and phases 003/004/005's Devin/Cursor/Pi adapters were undocumented in the hook-injection references. Both are now resolved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/hooks/goal-plugin.md` | Modify | Fixed flat command path (3×) + dead RELATED packet path; added a "Cross-Runtime Relationship" section (shared-file model + capability tiers). |
| `references/hooks/injection-contract.md` | Modify | Added the cross-runtime active-goal entry: verbatim `[active_goal]` block + per-runtime channel/visibility (Devin/Cursor `[SYS]`, Pi `[MSG]`). |
| `constitutional/goal-prompting-runtime-specific.md` | Modify | Fixed the `*goal*.md` glob to the subfolder; added the fifth-move history note + a Devin/Cursor/Pi routing section; added `/goal:goal-opencode` trigger. |
| `feature-catalog/ux-hooks/goal-opencode-plugin.md` | Modify | Fixed stale `goal_opencode.md` paths (2×). |
| `README.md` | Modify | `README.md:1063` `/goal_opencode` -> `/goal:goal-opencode`. |
| `plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Test 8 regex -> subfolder path; test 9 -> archived `026-goal-opencode-plugin` graph. |
| `.opencode/hooks/goal/README.md` | Modify | Corrected the stale "no adapter wiring yet" Status/§2 to the built state (devin/cursor/pi adapters present, per-runtime tiers). |
| `SKILL.md`, `feature-catalog/feature-catalog.md`, `references/config/hook-system.md`, `manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` | Modify | **Scope expansion:** the REQ-001 verification grep found 4 more files carrying the same stale flat/underscore command path; all fixed to meet the zero-live-hits acceptance. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran last in the packet, after phases 001-007 landed, so the docs describe real artifacts. The stale references were located by targeted `grep` (the repo's rg output mangles these specific strings, so `grep -F`-style checks were used). The `commands/{memory,deep,speckit}/*.md -> /namespace:command` convention fixed the correct invocation form as `/goal:goal-opencode`. The verbatim `[active_goal]` block came from the goal concern README's already-authored "WHAT IT DOES AND INJECTS" section.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Host the cross-runtime content in `goal-plugin.md`, not a new `goal-cross-runtime.md` | The added content (shared-file model + a compact capability table + pointers) fit one section; a separate doc would fragment discovery. The open question is resolved. |
| Fix the 4 additional stale references beyond the spec's named 4 | REQ-001's acceptance is "zero live hits"; leaving known-stale live refs to honor a literal 4-file scope would make that claim false. Recorded as a documented scope expansion. |
| Leave the pre-existing "missing overview section" doc-validator warning | It reproduces identically at HEAD on `goal-plugin.md` and the constitutional file (they use "PURPOSE"/"Rule" headings); not introduced here, and renaming those headings is out of scope. |
| Leave `mk-goal-tool-path.test.cjs` tests 1-6 env-gated | They fail only on the absent `@opencode-ai/plugin` dependency in the main tree, not on any rename fallout; the documented baseline confirms they pass where deps are installed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Manual (grep sweep) | PASS | Zero live `goal_opencode` / flat `commands/goal-opencode.md` hits outside the intentional constitutional history and `z_archive`. |
| Unit (`mk-goal-tool-path.test.cjs`) | PASS (rename scope) | The 3 file-read tests (7/8/9) pass after the fixes; tests 1-6 env-gated on the absent `@opencode-ai/plugin` dep (unchanged). |
| Documentation (`validate_document.py`) | PASS (edits) | `injection-contract.md`, `goal/README.md`, both `ux-hooks` docs = 0 issues; `goal-plugin.md` + constitutional carry a pre-existing "missing overview" warning (identical at HEAD). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`mk-goal-tool-path.test.cjs` tests 1-6 remain env-gated** on the `@opencode-ai/plugin` dependency, absent from the main tree's `.opencode/node_modules`. They are unrelated to the rename and pass in the documented environment; running them here would require installing the `.opencode` deps.
2. **Two docs keep a pre-existing "missing overview section" validator warning** (`goal-plugin.md`, the constitutional rule) — present at HEAD, not introduced here; harmonizing their heading convention is a separate cleanup.
3. **The invocation form `/goal:goal-opencode` follows the repo's `folder:command` convention** and the recent memory index; per the constitutional rule's own guidance, the live command filename should still be re-verified before invoking, as it has moved on operator decision before.
<!-- /ANCHOR:limitations -->
