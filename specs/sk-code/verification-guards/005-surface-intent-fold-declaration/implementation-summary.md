---
title: "Implementation Summary"
description: "A hub can declare in hub-router.json that a surface folds its child intents into one parent intent, and the router sync check accepts the fold. Skilled's own hub declares none, so its guard output is unchanged."
trigger_phrases:
  - "surface intent fold declaration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/verification-guards/005-surface-intent-fold-declaration"
    last_updated_at: "2026-11-13T20:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Built and verified, nothing committed"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs"
      - ".skilled/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-surface-intent-fold-declaration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-surface-intent-fold-declaration |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hub can now declare an optional `surfaceIntentFolds` key in `hub-router.json`. Check 2 of the router sync guard then compares a folded surface's whole path set with the one parent intent it names. Skilled's own `hub-router.json` is unchanged, so the live guard still prints `router-sync: 5/5 checks passed`.

### Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it

A host hub that folds all the intents of a surface into one parent intent used to have every child path reported as unowned. The key is keyed by surface packet and its value is one parent map intent. A declaration that names an unregistered surface or an unknown intent is reported and not applied, so a typo cannot hide a real gap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | New `surfaceIntentFolds` reader and the fold branch in `legSurfaceMap` |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | `buildFoldHub`, an `extra` parameter for `writeSurfaceRouting` and two fold cases |
| `.skilled/skills/sk-code/README.md` | Modified | The `hub-router.json` row names `surfaceIntentFolds` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus agent planned the edits from a decided design. A DeepSeek worker (`dsh --profile headless`, LLM Gateway route) applied them from the literal text in `plan.md`. The orchestrating session read the diff and reran the gates in the worktree. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Optional key, no change to Skilled's own hub | Skilled declares no fold, so its policy hash and its guard output stay as they were |
| Report and skip an invalid declaration | An unknown surface or intent applied anyway would hide the very path gap the check exists to find |
| One parent intent per folded surface | The check compares the surface's whole path set with one intent, which keeps the rule easy to read and test |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on `verify-router-sync.test.cjs` | Before 13 of 13. After 16 of 16, exit 0. Two cases are the fold cases and one is a host route-gold case from the host spec tree packet |
| `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | `router-sync: 5/5 checks passed`, exit 0, before and after |
| `node --test .skilled/bin/tests/` | Before 180 tests, 179 pass, 0 fail, 1 skipped. After 182 tests, 181 pass, 0 fail, 1 skipped, exit 0 |
| `node .skilled/bin/compiled-route-sync.cjs --check` | `all 55 served copies match their authored files`, exit 0, before and after |
| `git diff --stat` on `hub-router.json` and `SKILL.md` of sk-code | Prints nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Adding the key changes the sk-code policy hash of the hub that declares it.** That host must refresh its activation manifest.
2. **It was not run against the host's real 16-surface hub.** The host must add the declarations and route its own `shared/references/mode-packet-skeleton.md`. Its two real defects stay reported.
<!-- /ANCHOR:limitations -->

---


